import React, { Component } from 'react';
import './App.css';
import Room from './Room.js';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "games": [],
        };
        this.socket = props.socket;
        this.load = this.load.bind(this);
        this.socket.onmessage = (event) => {
            let msg = JSON.parse(event.data);
            if (msg.type === "load") {
                this.setState({
                    "games": msg.data
                });
            }
        }
    }

    load() {
        this.socket.send(JSON.stringify({
            "request": "load",
        }));
    }

    render() {
        let rooms = [];
        for (let i = 0; i < this.state.games.length; i++) {
            rooms.push(
                <Room
                    name={this.state.games[i]["name"]}
                    key={i}
                    link={this.state.games[i]["path"]}
                />
            );
        }
        return (
            <div className="lobby">
                {rooms}
                <button
                    onClick={() => this.load()}
                >Load</button>
            </div>
        )
    }
}

export default App;
