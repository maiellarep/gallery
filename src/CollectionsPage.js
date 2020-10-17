import React from 'react';
import './css/CollectionsPage.css';
import './css/common.css';
import './css/Buttons.css';
import IndexedDbRepository from './IndexedRepository';
import {Link} from 'react-router-dom';
import Menu from './Menu';

class CollectionsPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            collections: []
        }
        this.search = this.search.bind(this);   
    }

    componentDidMount() {
        document.title = "Список коллекций";
        this.repository = new IndexedDbRepository("id");
        this.repository.findAll('collections').then( collections => this.setState( { collections } ) );
    }

    search(e) {
        if(e.target.value === '' || e.target.value === null) {
            this.repository.findAll('collections').then( collections => this.setState( { collections } ) );
        }
        else {
            this.repository.searchByField('collections', 'collections', e.target.value).then(collections => this.setState({collections}));
        }

    }

    render() {
        return (
            <div class="container">
                <Menu />
                <div class = "header">
                    <h1>Коллекции</h1>
                    <div class = "search">
                        <input class = "searchstr" id = "search" type = "text" placeholder = "Поиск (происходит в живом режиме)" onChange = {this.search}/>
                    </div>
                </div>
                
                <div>
                    <ul class = "photosUl">
                        {this.state.collections.map((collectiondata) => {
                            return (
                                <li>
                                    <div class="photo">
                                        <Link to={/collectionpage/+ collectiondata.colName} class="btnlink" >
                                            <div class = "photoDiv">
                                                <img class = "photoImg" src = {'data:image/jpeg;base64,' + btoa(collectiondata.colPreview)} alt = "preview"/>
                                            </div>
                                            <p class = "collectionName">{collectiondata.colName}</p>
                                        </Link> 
                                    </div>
                                </li>
                            );
                        })}   
                    </ul>
                </div>
            </div>
        );
    }
}

export default CollectionsPage;