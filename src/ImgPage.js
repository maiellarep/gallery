import React from 'react';
import './css/CollectionsPage.css';
import './css/common.css';
import './css/Buttons.css';
import './css/ImgPage.css';
import IndexedDbRepository from './IndexedRepository';
import Menu from './Menu';
import {Link} from 'react-router-dom';

class ImgPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            format: '',
            description: '', 
            size: '',
            weight: '',
            mimetype: '',
            image: '',
            collection: '',
            date: '',
            tags: '',
            id: null
        }

        this.handleDelete = async( idToDelete ) => {
            this.repository.deleteById( 'photos', idToDelete )
            .then(() => {alert('Изображение удалено успешно!'); window.location = ('/')});
        };
    }
    componentDidMount() {
        document.title = "Информация о картинке";
        this.repository = new IndexedDbRepository();
        this.repository.findById('photos', parseInt(this.props.match.params.id)).then( r => this.setState( {             
            image: r.image,
            name: r.name,
            description: r.description,
            format: r.format,
            mimetype: r.mimetype,
            weight: r.weight,
            size: r.size,
            collection: r.collection,
            date: r.date,
            tags: r.tags.toString(),
            id: r.id } 
        ));
    }

    render() {
        return (
            <div class = "container">
                {<Menu />}
                <div class = "header">
                    <h1>{this.state.name}</h1>
                </div>
                <div class = "imgcontent">
                    <img src = {'data:image/' + this.state.mimetype.split('.').pop() + ';base64,' + btoa(this.state.image)} alt = "preview"/>
                    
                    <p>Описание: {this.state.description}</p>
                    <p>Формат: {this.state.format}</p>
                    <p>Размер оригинального изображения: {this.state.size}</p>
                    <p>Вес файла: {this.state.weight}</p>
                    <p>Тип файла: {this.state.mimetype}</p>
                    <p>Коллекция: {this.state.collection}</p>
                    <p>Теги: {this.state.tags}</p>
                    <p>Дата добавления: {this.state.date}</p>
                    <div class = "btnsDiv">
                        <button class = "button" type = "button" onClick = {async () => {await this.handleDelete(this.state.id)}}>Удалить</button>
                        <Link to={/edit/+ this.state.id} class="button" >Редактировать</Link>
                        <a class = "button" href = {'data:image/' + this.state.mimetype.split('.').pop() + ';base64,' + btoa(this.state.image)} download = {this.state.name+this.state.mimetype}>Скачать</a>
                    </div>
                    
                </div>
                
            </div>
        );
    }
}


export default ImgPage;