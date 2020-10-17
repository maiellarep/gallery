import React from 'react';
import './css/Menu.css';

import {Link, withRouter} from 'react-router-dom';


class Menu extends React.Component {   
    render() {
        return(
            <div class = "menu-container">
                <ul class = "menu">
                <li><Link to='/'>Главная страница</Link></li>
                <li><Link to='/collections'>Коллекции</Link></li>
                <li><Link to='/storageinfo'>Хранилище</Link></li>
                <li><Link to='/add'>Загрузить картинку</Link></li>
                <li><Link to='/addcollection'>Добавить коллекцию</Link></li>
                </ul>
            </div>
        );
        
    } 
}

export default withRouter(Menu);