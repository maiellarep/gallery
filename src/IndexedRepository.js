if ( !window.indexedDB ) window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
if ( !window.IDBTransaction ) window.IDBTransaction = window.webkitIDBTransaction || window.msIDBTransaction;
if ( !window.IDBKeyRange ) window.IDBKeyRange = window.webkitIDBKeyRange || window.msIDBKeyRange;
if ( !window.indexedDB ) throw new Error( 'IndexedDB is not awailable' );

const DB_NAME = 'gallery';

function openDatabasePromise() {
  return new Promise( ( resolve, reject ) => {
    const dbOpenRequest = window.indexedDB.open( DB_NAME, 1 );

    dbOpenRequest.onblocked = () => {
      reject( 'Требуется обновление структуры базы данных, хранимой в вашем браузере, ' +
        'но браузер уведомил о блокировке базы данных.' );
    };

    dbOpenRequest.onerror = err => {
      console.log( 'Unable to open indexedDB ' + DB_NAME );
      console.log( err );
      reject( 'Невозможно открыть базу данных, либо при её открытии произошла неисправимая ошибка.' +
       ( err.message ? 'Техническая информация: ' + err.message : '' ) );
    };

    dbOpenRequest.onupgradeneeded = event => {
      const db = event.target.result;
      try {
        db.deleteObjectStore( 'photos' );
        db.deleteObjectStore( 'collections' );
      } catch ( err ) { console.log( err ); }
      var photoStore = db.createObjectStore( 'photos', {keyPath: 'id', autoIncrement: true } );
      photoStore.createIndex("name", "name", { unique: false });
      photoStore.createIndex("collections", "collection", { unique: false });
      photoStore.createIndex("tags", "tags", { unique: false, multiEntry: true });
      var colStore = db.createObjectStore( 'collections', {keyPath: 'colName', autoIncrement: false } ); 
      colStore.createIndex("collections", "colName", { unique: true });
    };

    dbOpenRequest.onsuccess = (e) => {
      resolve( dbOpenRequest.result );
    };

    dbOpenRequest.onerror = reject;
  } );
}

function wrap( methodName ) {
  return function() {
    const [ objectStore, ...etc ] = arguments;
    return new Promise( ( resolve, reject ) => {
      const request = objectStore[ methodName ]( ...etc );
      request.onsuccess = () => resolve( request.result );
      request.onerror = reject;
    } );
  };
}
const deletePromise = wrap( 'delete' );
const getAllPromise = wrap( 'getAll' );
const getPromise = wrap( 'get' );
const putPromise = wrap( 'put' );

function sPromise( objectStore, item, value ) {
    return new Promise( ( resolve, reject ) => {
      const index = objectStore.index(item).getAll(value);
      index.onsuccess = () => resolve(index.result);
      index.onerror = reject;
    } );
}

function clearPromise(objectStore){
  return new Promise((resolve, reject) => {
    var request = objectStore.clear();
    request.onsuccess = () => resolve();
    request.onerror = reject;
  });
}

function countPromise(objectStore){
  return new Promise((resolve, reject) => {
    var request = objectStore.count();
    request.onsuccess = () => resolve(request.result);
    request.onerror = reject;
  });
}

export default class IndexedDbRepository {

  dbConnection ;
  error ;
  openDatabasePromise ;

  constructor() {
    this.error = null;

    this.openDatabasePromise = this._openDatabase();
  }

  async _openDatabase() {
    try {
      this.dbConnection = await openDatabasePromise();
    } catch ( error ) {
      this.error = error;
      throw error;
    }
  }

  async _tx(OBJECT_STORE_NAME, txMode, callback ) {
    await this.openDatabasePromise;
    const transaction = this.dbConnection.transaction( [ OBJECT_STORE_NAME ], txMode );
    const objectStore = transaction.objectStore( OBJECT_STORE_NAME );
    return await callback( objectStore );
  }

  async findAll(OBJECT_STORE_NAME) {
    return this._tx( OBJECT_STORE_NAME, 'readonly', objectStore => getAllPromise( objectStore ) );
  }

  async findById(OBJECT_STORE_NAME, key ) {
    return this._tx( OBJECT_STORE_NAME, 'readonly', objectStore => getPromise( objectStore, key ) );
  }

  async deleteById(OBJECT_STORE_NAME, key ){
    return this._tx( OBJECT_STORE_NAME, 'readwrite', objectStore => deletePromise( objectStore, key ) );
  }

  async save(OBJECT_STORE_NAME, item){
    return this._tx( OBJECT_STORE_NAME, 'readwrite', objectStore => putPromise( objectStore, item ) );
  }

  async searchByField(OBJECT_STORE_NAME, field, value) {
    return this._tx(OBJECT_STORE_NAME, 'readonly', objectStore => sPromise(objectStore, field, value));
  }

  async deleteAll(OBJECT_STORE_NAME) {
    return this._tx(OBJECT_STORE_NAME, 'readwrite', objectStore => clearPromise(objectStore));
  }

  async count(OBJECT_STORE_NAME) {
    return this._tx(OBJECT_STORE_NAME, 'readonly', objectStore => countPromise(objectStore));
  }

}