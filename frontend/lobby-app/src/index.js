import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

var games = ['game1', 'game2', 'game3'];

ReactDOM.render(
    <App games={games} />, 
    document.getElementById('root')
);
registerServiceWorker();
