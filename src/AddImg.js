import React from 'react';
import './css/common.css';
import IndexedDbRepository from './IndexedRepository';
import './css/Buttons.css';
import './css/Inputs.css';
import logo from './img/defaultOrganisationLogo.jpg';

class AddImg extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.state = {
            name: null,
            format: 'Альбом',
            description: null, 
            size: null,
            weight: null,
            mimetype: null,
            image: null,
            collection: null,
            tags: [],
            colList: [],
            preview: logo
        }

    }

    componentDidMount() {
        document.title = "Добавление картинки";
        this.repository = new IndexedDbRepository();
        this.repository.findAll('collections').then( colList => this.setState( { colList } ) );
    }

    handleChange(e) {
        if(e.target.name === 'tags')
        {
            var arr = e.target.value.split(',');
            this.setState({tags: arr});
        }
        else{
            this.setState({[e.target.name]: e.target.value});
        }

    }

    handleImageChange(e) {
        var file = e.target.files[0];
        if(file !== undefined && file !== null)
        {
            if(file.type.split('/')[0] === 'image')
            {
                this.setState({
                    mimetype: '.' + file.type.split('/')[1],
                    weight: (file.size/1024/1024).toFixed(2) + " МБ",
                    preview: URL.createObjectURL(file)
                });
                var reader = new FileReader();
                reader.readAsBinaryString(file);
                
                    reader.onload = function(e) {
                        let bits = e.target.result;
                        var img = new Image();
                        img.src = 'data:image/'+ this.state.mimetype.split('.').pop()+';base64,' + btoa(bits);
                        img.onload = () => {
                                
                        var size = img.height + "х" + img.width + " px";
                            this.setState({
                                image: bits,
                                size: size
                            });
                        }
                            
                    }.bind(this);
        
            }
            else 
            {
                alert("Неправильный тип файла! Загрузите изображение!");
            }
        }
    }

    handleAdd = () => {
        if(this.state.image != null)
        {
            if(this.state.name != null)
            {
                var date = new Date();
                var day = date.getDate();
                var month = date.getMonth()+1;
                var year = date.getFullYear();
        
                this.repository.save( 'photos', { image: this.state.image, 
                    name: this.state.name, 
                    description: this.state.description, 
                    format: this.state.format,
                    date: day + '.' + month + '.' + year,
                    mimetype: this.state.mimetype,
                    weight: this.state.weight,
                    size: this.state.size,
                    collection: this.state.collection,
                    tags: this.state.tags}).then(() => {alert('Изображение добавлено успешно!'); window.location = ('/add')});
            }
            else
            {
                alert("Изображение должно иметь название. Заполните это поле");
            }
        }
        else
        {
            alert("Добавьте изображение!");
        }
    };
    
    handleClick(e) {
        window.location = ('/');
    }


    render() {
        return (
            <div class = "container">
                <div class = "header"> 
                    <h1>Добавление новой картинки</h1>
                </div>
                <div class = "imgcontent">
                    <img src = {this.state.preview} class = "preview" id="preview" alt = "preview"/><br/>
                    <input type="file" accept = "image/*" name="image" onChange={this.handleImageChange}/><br/>
                    <input class = "input_1" id="name" name="name" type="text"  placeholder = "Название картинки" onChange={this.handleChange} required/><br/>
                    <textarea class="textarea_1" id="description" name="description" type="text" placeholder = "Введите описание картинки..." onChange={this.handleChange}>        
                    </textarea><br/>
                    <input class = "input_1" name="tags" type="text"  placeholder = "Теги через запятую без пробела. Пример: тег1,тег2" onChange={this.handleChange} required/><br/>
                    <label>Формат </label>
                    <select class = "select" name="format" onChange={this.handleChange}>
                        <option value="Альбом">Альбом</option>
                        <option value="Портрет">Портрет</option>
                        <option value="Квадрат">Квадрат</option>
                    </select><br/>
                    <label>Коллекция </label>
                    <select class = "select" name="collection" onChange={this.handleChange}>
                        <option>Выберите коллекцию</option>
                        {
                            this.state.colList.map((item) => {
                                return(
                                    <option value={item.colName}>{item.colName}</option>
                                );
                            })
                        }
                    </select><br/>
                    <div class = "btnsDiv">
                        <button class = "button" type="button" onClick={this.handleClick}>Отмена</button>
                        <button class = "button" type="button" onClick={this.handleAdd}>Добавить</button>
                    </div>
                </div>
            
            </div>
        );
    }
}


export default AddImg;