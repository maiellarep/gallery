import React from 'react';
import './css/common.css';
import './css/Buttons.css';
import IndexedDbRepository from './IndexedRepository';
import logo from './img/defaultOrganisationLogo.jpg';

class AddCollectionPg extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            colName: null,
            colPreview: null,
            preview: logo
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        
    }

    componentDidMount() {
        document.title = "Добавление коллекции";
        this.repository = new IndexedDbRepository("id");
        this.repository.findAll('collections').then( collections => this.setState( { collections } ) );
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    handleImageChange(e) {
        var file = e.target.files[0];
        if(file !== null && file !== undefined)
        {
            if(file.type.split('/')[0] === 'image')
            {
                var reader = new FileReader();
                reader.readAsBinaryString(file);
                reader.onload = function(e) {
                    let bits = e.target.result; 
                    this.setState({
                        colPreview: bits,
                        preview: URL.createObjectURL(file)
                    });    
                }.bind(this);

            }
            else
            {
                alert('Неправильный тип файла! Загрузите изображение!');
            }
        }
        
    }

    handleAdd = async() => {
        if(this.state.colPreview !== null)
        {
            if(this.state.colName !== null)
            {
                var c = await this.repository.findById('collections', this.state.colName);
                if(c === undefined)
                {
                    var newCollection = { colName: this.state.colName,
                        colPreview: this.state.colPreview };
                        this.repository.save( 'collections', newCollection)
                        .then(() => { alert('Коллекция добавлена успешно!'); window.location = ('/collections')}); 
                }
                else 
                {
                    alert('Коллекция с таким названием уже существует');
                }
            }
            else
            {
                alert('Введите название коллекции!');
            }
        }
        else
        {
            alert("У коллекции должна быть обложка. Добавьте, пожалуйста обложку!");
        }

    };

    handleClick(e) {
        window.location = ('/');
    }


    render() {
        return (
            <div class = "container">
            <div class = "header"> 
                <h1>Добавление новой коллекции</h1>
            </div>
            <div class = "imgcontent">
                <img src = {this.state.preview} accept = 'image/*' id="colPreview" alt = "collectionPreview" /><br/>
                <input  type="file" name="colPreview" accept = "image/*" onChange={this.handleImageChange}/><br/>
                <input class="input_1" name="colName" type="text" onChange={this.handleChange} placeholder = "Название коллекции" required/><br/>
                <div class = "btnsDiv">
                    <button class = "button" type="button" onClick={this.handleClick}>Отмена</button>   
                    <button type="button" class="button" onClick={this.handleAdd}>Добавить</button>
                </div>
            </div>
            </div>
        );
    }
}

export default AddCollectionPg;