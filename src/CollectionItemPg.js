import React from 'react';
import './css/CollectionsPage.css';
import './css/common.css';
import IndexedDbRepository from './IndexedRepository';
import {Link} from 'react-router-dom';
import { saveAs } from 'file-saver';
import Menu from './Menu';

class CollectionItemPg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            images: []
        }
        this.saveCollection = this.saveCollection.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount() {
        document.title = "Страница коллекции";
        this.repository = new IndexedDbRepository("id");
        this.repository.searchByField('photos', 'collections', this.props.match.params.colName).then( images => this.setState( { images } ) );
        
    }

    handleDelete = async( idToDelete ) => {
        var colImg = await this.repository.searchByField('photos', 'collections', idToDelete);
        if(window.confirm('Удалить данную коллекцию?'))
        {
            if(window.confirm('Удалить также и изображения коллекции?'))
            {
                for (const element of colImg) {
                    await this.repository.deleteById( 'photos', element.id );
                }
            }
            else
            {
                for (const element of colImg) {
                    element.collection = null;
                    await this.repository.save( 'photos', element);
                }
            }
            this.repository.deleteById( 'collections', idToDelete )
            .then(() =>{alert('Коллекция была удалена успешно!'); window.location = ('/')});
        }
        
    }

    async saveCollection() {
        var JSZip = require("jszip");
        var zip = new JSZip();
        var img = zip.folder("images");
        for(const image of this.state.images) {
            var imgData = btoa(image.image);
            var imgName = image.name + image.mimetype;
            img.file( imgName, imgData, {base64: true});
        }
        var archiveName = this.props.match.params.colName + '.zip';
        zip.generateAsync({type:"blob"})
        .then(function(base64) {
            saveAs(base64, archiveName);
        });

    }

    render() {
        return (
            <div class="container">
                <div class = "header"> 
                    <Menu />
                    <h1>{"Коллекция " + this.props.match.params.colName}</h1>
                </div>
                <div id="photo-wall">
                    <ul class = "photosUl">
                        {this.state.images.map((imgcontent) => {
                            return (
                                <li>
                                    <div class="post">
                                        <Link to={/imgpage/+ imgcontent.id} class="btnlink" >
                                            <div class = "photoDiv">
                                                <img class = "photoImg" src = {'data:image/' + imgcontent.mimetype.split('.').pop() + ';base64,' + btoa(imgcontent.image)} alt = "preview"/>
                                            </div>        
                                        </Link>
                                    </div>
                                </li>
                            );
                        })}     
                    </ul>
                    <button class = "button" type = "button" onClick = {async () => {await this.saveCollection()}}>Сохранить коллекцию</button>
                    <button class = "button" type = "button" onClick = {async () => {await this.handleDelete(this.props.match.params.colName)}}>Удалить данную коллекцию</button>
                </div>
            </div>
        );
    }
}

export default CollectionItemPg;