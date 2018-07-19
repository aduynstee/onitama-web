import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

var data = {
    "turns": [
        {"number": 0, "cards": ["ox", "horse", "tiger", "crane", "boar"], "board": ["redpawn", "redpawn", "redking", "redpawn", "redpawn", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "bluepawn", "bluepawn", "blueking", "bluepawn", "bluepawn"], "lastMove": null},
        {"number": 1, "cards": ["horse", "boar", "tiger", "crane", "ox"], "board": ["redpawn", "redpawn", "empty", "redpawn", "redpawn", "empty", "empty", "redking", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "bluepawn", "bluepawn", "blueking", "bluepawn", "bluepawn"], "lastMove": "c1-c2 [ox]"},
        {"number": 2, "cards": ["horse", "boar", "tiger", "ox", "crane"], "board": ["redpawn", "redpawn", "empty", "redpawn", "redpawn", "empty", "empty", "redking", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "blueking", "empty", "empty", "bluepawn", "bluepawn", "empty", "bluepawn", "bluepawn"], "lastMove": "c5-c4 [crane]"},
        {"number": 3, "cards": ["horse", "crane", "tiger", "ox", "boar"], "board": ["redpawn", "redpawn", "empty", "redpawn", "redpawn", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "redking", "empty", "empty", "empty", "empty", "blueking", "empty", "empty", "bluepawn", "bluepawn", "empty", "bluepawn", "bluepawn"], "lastMove": "c2-c3 [boar]"},
        {"number": 4, "cards": ["horse", "crane", "ox", "boar", "tiger"], "board": ["redpawn", "redpawn", "empty", "redpawn", "redpawn", "empty", "empty", "blueking", "empty", "empty", "empty", "empty", "redking", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "bluepawn", "bluepawn", "empty", "bluepawn", "bluepawn"], "lastMove": "c4-c2 [tiger]"},
        {"number": 5, "cards": ["crane", "tiger", "ox", "boar", "horse"], "board": ["redpawn", "redpawn", "empty", "redpawn", "redpawn", "empty", "empty", "blueking", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "redking", "empty", "empty", "bluepawn", "bluepawn", "empty", "bluepawn", "bluepawn"], "lastMove": "c3-c4 [horse]"}
    ],
    "activePlayer": "blue",
    "lastTurn": 5,
    "legalMoves": {
        "ox": [null, null, null, null, null, null, null, [2, 6, 12], null, null, null, null, null, null, null, null, null, null, null, null, [15], [16], null, [22, 18], [19]],
        "boar": [null, null, null, null, null, null, null, [2, 8, 6], null, null, null, null, null, null, null, null, null, null, null, null, [15], [16, 22], null, [18, 22], [19]]
    },
    "startPlayer": "red"
};


ReactDOM.render(<App data={data} userPlayer="red" />, document.getElementById('root'));
registerServiceWorker();
