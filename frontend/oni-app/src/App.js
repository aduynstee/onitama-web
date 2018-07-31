import React, { Component } from "react";
import "./App.css";

class App extends Component {
    render() {
        let legalPlayers = ["red", "blue", "observer"];
        if (legalPlayers.includes(this.props.userPlayer)) {
            return (
                <div className="App">
                     <Game
                        userPlayer={this.props.userPlayer}
                        socket={this.props.socket}
                        gameData={this.props.gameData}
                    />
                </div>
            );
        } else {
            return (
                <div className="App">
                     An error occurred.
                </div>
            );
        }
    }
}

export default App;
