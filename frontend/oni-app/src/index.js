import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

//Assume socketAddress has been set in a script that ran prior to this one
var socket = new WebSocket(window.socketAddress);

socket.onopen = function(e) {
    ReactDOM.render(<App socket={socket} />, document.getElementById('root'));
    registerServiceWorker();
}
