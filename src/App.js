import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import CollectionsPage from './CollectionsPage';
import AllImgPage from './AllImgPage';
import AddImg from './AddImg';
import EditImg from './EditImg';
import AddCollectionPg from './AddCollectionPg';
import CollectionItemPg from './CollectionItemPg';
import StorageInfo from './StorageInfo';
import ImgPage from './ImgPage';

class App extends React.Component {
  render()
  {
    return (
      <div>
        <Router>
          <div>
          <Switch>
            <Route path="/" exact component={AllImgPage}/>
            <Route path="/add" component={AddImg}/>
            <Route path="/collections" component={CollectionsPage}/>
            <Route path="/addcollection" component={AddCollectionPg}/>
            <Route path="/collectionpage/:colName" component={CollectionItemPg}/>
            <Route path="/edit/:id" component={EditImg}/>
            <Route path="/storageinfo" component={StorageInfo}/>
            <Route path="/imgpage/:id" component={ImgPage}/>
          </Switch>
          
          </div>

      </Router>
      </div>
    );
  }
}

export default App;
