import React, { Component } from 'react';
import './App.css';

class Piece extends Component {
    render() {
        let val = "X";
        switch(this.props.value) {
            case "redpawn":
            case "bluepawn":
                val = "P";
                break;
            case "redking":
            case "blueking":
                val = "K";
                break;
            case "empty":
                val = "E";
                break;
            default:
                break;
        }
        return (
            <div className={this.props.value}>
                {val}
            </div>
        )
    }
}

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'board': Array(25).fill('empty'),
            'cards': {
                'user': Array(2).fill('user card'),
                'neutral': 'neutral card',
                'opponent': Array(2).fill('opp card'),
            }
        };
    }

    render() {
        return (
            <div id="game">
                <div className="game-left">
                    <TurnList />
                </div>
                <div className="game-center">
                    <div className="card-row">
                        <Card
                            name={this.state.cards.opponent[0]}
                        />
                        <Card
                            name={this.state.cards.opponent[1]}
                        />
                    </div>
                    <Board
                        state={this.state.board}
                    />
                    <div className="card-row">
                        <Card
                            name={this.state.cards.user[0]}
                        />
                        <Card
                            name={this.state.cards.user[1]}
                        />
                    </div>
                </div>
                <div className="game-right">
                    <div className="neutral-card">
                        <Card
                            name={this.state.cards.neutral}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

class Card extends Component {
    render() {
        return (
            <div className="card">
                {this.props.name}
            </div>
        )
    }
}

class Board extends Component {
    render() {
        let squares = []
        for (let i = 0; i < this.props.state.length; i++) {
            squares[i] = (
                <div className="board-square">
                    <Piece
                        value = {this.props.state[i]}
                    />
                </div>
            )
        }
        let rows = []
        for (let i = 0; i < 5; i++) {
            rows[i] = (
                <div className="board-row">
                    {squares.slice(5*i, 5*(i+1))}
                </div>
            )
        }
        return (
            <div id="board">
                {rows}
            </div>
        )
    }
}

class TurnList extends Component {
    render() {
        return (
            <div className="turn-list">
                <div className="turn">Turns go here</div>
                <div className="turn">Turns go here</div>
                <div className="turn">Turns go here</div>
                <div className="turn">Turns go here</div>
                <div className="turn">Turns go here</div>
            </div>
        )
    }
}

class App extends Component {
    render() {
        return (
            <div className="App">
                 <Game/>
            </div>
        );
    }
}

export default App;
