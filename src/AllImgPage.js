
import React from 'react';
import './css/common.css';
import './css/AllImg.css';
import './css/Buttons.css';
import IndexedDbRepository from './IndexedRepository';
import {Link, withRouter} from 'react-router-dom';
import Menu from './Menu';

class AllImgPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            images: [],
            searchItem: 'name',
            sQuery: ''
        }

        this.search = this.search.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        document.title = "Главная страница";
        this.repository = new IndexedDbRepository("id");
        this.repository.findAll('photos').then( images => this.setState( { images } ) );  
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    search() {
        if(this.state.sQuery === '' || this.state.sQuery === null) {
            this.repository.findAll('photos').then( images => this.setState( { images } ) );
        }
        else {
            this.repository.searchByField('photos', this.state.searchItem, this.state.sQuery).then(images => this.setState( { images } ) );
        }

    }

    render() {
        return (
            <div class="container">
                <Menu />
                <div class = "header">     
                    <h1>Галерея изображений</h1>
                    <div class = "search">
                    <input class = "searchstr" id = "search" type = "text" name = "sQuery" placeholder = "Поиск" onChange = {this.handleChange}/>
                    <select class = "selecttag" name = "searchItem" onChange = {this.handleChange}>
                        <option value = "name">По названию</option>
                        <option value = "collections">По коллекции</option>
                        <option value = "tags">По тегу</option>
                    </select>
                    <button type = "button" class = 'button searchbtn' onClick = {this.search}>Поиск</button>
                    </div>

                </div>
                <ul class = "photosUl">
                    {this.state.images.map((imgcontent) => {
                        return (
                            <li>
                                <div class="photo">
                                    <Link to={/imgpage/+ imgcontent.id} >
                                        <div class = "photoDiv">
                                            <img class = "photoImg" src = {'data:image/'+ imgcontent.mimetype.split('.').pop() +';base64,' + btoa(imgcontent.image)} alt = "preview"/>
                                        </div>   
                                    </Link>
                                    
                                </div>
                            </li>
                        )
                    })}     
                </ul>
                
            </div>
        );
    }
}

export default withRouter(AllImgPage);