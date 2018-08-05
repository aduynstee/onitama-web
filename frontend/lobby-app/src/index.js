import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

var socket = new WebSocket('ws://localhost:8000/ws/onitama/lobby/');

ReactDOM.render(
    <App socket={socket} />,
    document.getElementById('root')
);
registerServiceWorker();
