import React, { Component } from 'react';
import './App.css';
import Room from './Room.js';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "games": props.games,
        };
    }

    render() {
        let rooms = [];
        for (let i = 0; i < this.state.games.length; i++) {
            rooms.push(
                <Room
                    name={this.state.games[i]}
                />
            );
        }
        return (
            <div className="lobby">
                {rooms}
            </div>
        )
    }
}

export default App;
