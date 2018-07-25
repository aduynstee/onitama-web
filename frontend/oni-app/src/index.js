import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

var data = '{"turns": [{"number": 0, "cards": ["ox", "horse", "tiger", "crane", "boar"], "board": ["redpawn", "redpawn", "redking", "redpawn", "redpawn", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "bluepawn", "bluepawn", "blueking", "bluepawn", "bluepawn"], "lastMove": null}, {"number": 1, "cards": ["horse", "boar", "tiger", "crane", "ox"], "board": ["redpawn", "redpawn", "empty", "redpawn", "redpawn", "empty", "empty", "redking", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "bluepawn", "bluepawn", "blueking", "bluepawn", "bluepawn"], "lastMove": "c1-c2 [ox]"}, {"number": 2, "cards": ["horse", "boar", "tiger", "ox", "crane"], "board": ["redpawn", "redpawn", "empty", "redpawn", "redpawn", "empty", "empty", "redking", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "blueking", "empty", "empty", "bluepawn", "bluepawn", "empty", "bluepawn", "bluepawn"], "lastMove": "c5-c4 [crane]"}, {"number": 3, "cards": ["horse", "crane", "tiger", "ox", "boar"], "board": ["redpawn", "redpawn", "empty", "redpawn", "redpawn", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "redking", "empty", "empty", "empty", "empty", "blueking", "empty", "empty", "bluepawn", "bluepawn", "empty", "bluepawn", "bluepawn"], "lastMove": "c2-c3 [boar]"}, {"number": 4, "cards": ["horse", "crane", "ox", "boar", "tiger"], "board": ["redpawn", "redpawn", "empty", "redpawn", "redpawn", "empty", "empty", "blueking", "empty", "empty", "empty", "empty", "redking", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "bluepawn", "bluepawn", "empty", "bluepawn", "bluepawn"], "lastMove": "c4-c2 [tiger]"}, {"number": 5, "cards": ["crane", "tiger", "ox", "boar", "horse"], "board": ["redpawn", "redpawn", "empty", "redpawn", "redpawn", "empty", "empty", "blueking", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "redking", "empty", "empty", "bluepawn", "bluepawn", "empty", "bluepawn", "bluepawn"], "lastMove": "c3-c4 [horse]"}, {"number": 6, "cards": ["crane", "tiger", "boar", "horse", "ox"], "board": ["redpawn", "redpawn", "empty", "redpawn", "redpawn", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "blueking", "empty", "empty", "empty", "empty", "redking", "empty", "empty", "bluepawn", "bluepawn", "empty", "bluepawn", "bluepawn"], "lastMove": "c2-c3 [ox]"}, {"number": 7, "cards": ["tiger", "ox", "boar", "horse", "crane"], "board": ["redpawn", "redpawn", "empty", "redpawn", "redpawn", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "blueking", "redking", "empty", "empty", "empty", "empty", "empty", "empty", "bluepawn", "bluepawn", "empty", "bluepawn", "bluepawn"], "lastMove": "c4-d3 [crane]"}, {"number": 8, "cards": ["tiger", "ox", "boar", "crane", "horse"], "board": ["redpawn", "redpawn", "empty", "redpawn", "redpawn", "empty", "empty", "blueking", "empty", "empty", "empty", "empty", "empty", "redking", "empty", "empty", "empty", "empty", "empty", "empty", "bluepawn", "bluepawn", "empty", "bluepawn", "bluepawn"], "lastMove": "c3-c2 [horse]"}, {"number": 9, "cards": ["ox", "horse", "boar", "crane", "tiger"], "board": ["redpawn", "redpawn", "empty", "redpawn", "redpawn", "empty", "empty", "blueking", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "bluepawn", "bluepawn", "empty", "redking", "bluepawn"], "lastMove": "d3-d5 [tiger]"}, {"number": 10, "cards": ["ox", "horse", "boar", "tiger", "crane"], "board": ["redpawn", "redpawn", "empty", "redpawn", "redpawn", "empty", "empty", "blueking", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "bluepawn", "bluepawn", "bluepawn", "empty", "redking", "empty"], "lastMove": "e5-e4 [crane]"}, {"number": 11, "cards": ["ox", "crane", "boar", "tiger", "horse"], "board": ["redpawn", "redpawn", "empty", "redpawn", "empty", "empty", "empty", "blueking", "empty", "redpawn", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "bluepawn", "bluepawn", "bluepawn", "empty", "redking", "empty"], "lastMove": "e1-e2 [horse]"}, {"number": 12, "cards": ["ox", "crane", "boar", "horse", "tiger"], "board": ["redpawn", "redpawn", "empty", "redpawn", "empty", "empty", "empty", "empty", "empty", "redpawn", "empty", "empty", "blueking", "empty", "empty", "empty", "empty", "empty", "empty", "bluepawn", "bluepawn", "bluepawn", "empty", "redking", "empty"], "lastMove": "c2-c3 [tiger]"}, {"number": 13, "cards": ["crane", "tiger", "boar", "horse", "ox"], "board": ["empty", "redpawn", "empty", "redpawn", "empty", "redpawn", "empty", "empty", "empty", "redpawn", "empty", "empty", "blueking", "empty", "empty", "empty", "empty", "empty", "empty", "bluepawn", "bluepawn", "bluepawn", "empty", "redking", "empty"], "lastMove": "a1-a2 [ox]"}], "activePlayer": "blue", "lastTurn": 13, "legalMoves": {"boar": [null, null, null, null, null, null, null, null, null, null, null, null, [11, 13, 7], null, null, null, null, null, null, [14, 18], [15], [16, 22], null, null, null], "horse": [null, null, null, null, null, null, null, null, null, null, null, null, [13, 17, 7], null, null, null, null, null, null, [14, 24], [15], [16, 22], null, null, null]}, "startPlayer": "red"}';


var mockSocket = {};
mockSocket.onmessage = function(e) {
    console.log('Called onmessage');
}
mockSocket.send = function(msg) {
    console.log('Sent '+msg);
    let mockEvent = {};
    let msgData = JSON.parse(msg);
    if (msgData.request === "player") {
        mockEvent = {
            "data": JSON.stringify({
                "type": "player",
                "player": "blue",
            })
        };
    } else {
        mockEvent = {
            "data": JSON.stringify({
                "type": "update",
                "gameData": JSON.parse(data),
            })
        };
    }
    this.onmessage(mockEvent);
}

var socket = mockSocket;

//Assume socketAddress has been set in a script that ran prior to this one
// var socket = new WebSocket(window.socketAddress);

socket.onopen = function(e) {
    ReactDOM.render(<App socket={socket} />, document.getElementById('root'));
    registerServiceWorker();
}

socket.onopen(null);
