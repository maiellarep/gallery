import React from 'react';
import './css/common.css';
import './css/Buttons.css';
import IndexedDbRepository from './IndexedRepository';
import Menu from './Menu';

class StorageInfo extends React.Component {
    constructor(props) {
        super(props);

        this.clearStorage = this.clearStorage.bind(this);
        this.state = {
            recordsNum: '',
            total: 0,
            nowUsing: 0,
            usingPercent: 0
        }
    }

    componentDidMount() {
      document.title = "Хранилище";
        this.repository = new IndexedDbRepository();
        this.repository.count('photos').then(recordsNum => this.setState({recordsNum}));

        navigator.storage.estimate().then((result) => {
          this.setState({total: result.quota});
          this.setState({nowUsing: result.usage});
        });
    }

    clearStorage = () => {
      if(window.confirm('Вы уверенны что хотите очистить хранилище? Все изображение будут удалены!'))
      {
        this.repository.deleteAll('photos').then(alert("Хранилище было очищено"));
      }
    }

  render()
  {
    return (
      <div class = "container">
        <div class = "header">
          <Menu />
          <h1>Информация о хранилище</h1>
        </div>
        <div>
          <p>В базе данных {this.state.recordsNum} записей</p>
          <p>Всего доступно места: {this.state.total}</p>
          <p>Занято: {this.state.nowUsing}</p>
          <p>Занято (в процентах): {this.state.nowUsing/this.state.total*100}%</p>
        </div>

        <button class = "button" type = "button" onClick = {this.clearStorage}>Очистить хранилище</button>
      </div>
    );
  }
}

export default StorageInfo;
