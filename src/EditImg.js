import React from 'react';
import './css/common.css';
import './css/Buttons.css';
import './css/Inputs.css';
import IndexedDbRepository from './IndexedRepository';

class EditImg extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
        this.state = {
            image: null,
            name: null,
            description: null,
            format: null,
            collection: null,
            tags: null,
            colList: []
        }

        this.handleAdd = async() => {
            this.obj.name = this.state.name;
            this.obj.description = this.state.description;
            this.obj.format = this.state.format;
            this.obj.collection = this.state.collection;
            this.obj.tags = this.state.tags;
            this.obj.image = this.state.image;
            this.repository.save('photos', this.obj)
            .then(() => {alert('Изображение отредактировано успешно!'); window.location = ('/');});
        };

    }

    componentDidMount() {
        document.title = "Редактирование картинки";
        this.repository = new IndexedDbRepository();
        this.repository.findById('photos', parseInt(this.props.match.params.id))
        .then( result => {this.obj = result;
                            this.setState({name: result.name,
                                            description: result.description,
                                            format: result.format,
                                            collection: result.collection,
                                            tags: result.tags.toString(),
                                            image: result.image})});
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
                this.obj.mimetype =  '.' + file.type.split('/')[1];
                this.obj.weight = (file.size/1024/1024).toFixed(2) + " МБ";
                var reader = new FileReader();
                reader.readAsBinaryString(file);
                
                reader.onload = function(e) {
                    let bits = e.target.result;
                    var img = new Image();
                    img.src = 'data:image/'+ this.obj.mimetype.split('.').pop()+';base64,' + btoa(bits);
                    img.onload = () => {
                                
                        var size = img.height + "х" + img.width + " px";
                        this.obj.size = size;
                        this.setState({
                            image: bits,
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

    handleClick(e) {
        window.location = ('/');
    }

    render() {
        return (
            <div class = "container">
                <div class = "header"> 
                    <h1>Редактирование картинки</h1>
                </div>
                <div class = "imgcontent">
                    <img src = {'data:image/jpeg;base64,' + btoa(this.state.image)} id="preview" alt = "preview"/><br/>
                    <input type="file" name="image" accept = "image/*" onChange={this.handleImageChange}/><br/>
                    <input class = "input_1" id="name" name="name" type="text" value={this.state.name} onChange={this.handleChange}/><br/>
                    <textarea class = "textarea_1" name="description" type="text" value={this.state.description} onChange={this.handleChange}></textarea>
                    <input class = "input_1" name="tags" type="text" value={this.state.tags} onChange={this.handleChange}/><br/>
                    <label>Формат</label>
                    <select class = "select" name="format" value = {this.state.format} onChange={this.handleChange} onLoad={this.handleChange}><br/>
                        <option value="Альбом">Альбом</option>
                        <option value="Портрет">Портрет</option>
                        <option value="Квадрат">Квадрат</option>
                    </select><br/>
                    <label>Коллекция</label>
                    <select class = "select" name="collection" value = {this.state.collection} onChange={this.handleChange}>
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
                        <button type="button" class="button" onClick={this.handleAdd}>Изменить</button>
                    </div>
                </div>
            </div>
        );
    }
}


export default EditImg;