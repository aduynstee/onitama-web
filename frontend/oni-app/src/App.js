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
        this.data = props.data;
        let currentTurn = this.data.turns[this.data.turns.length-1];
        let moves = [];
        for (let i = 1; i < this.data.turns.length; i++) {
            moves.push(this.data.turns[i].lastMove);
        }
        this.state = {
            'board': currentTurn.board,
            'cards': currentTurn.cards,
            'displayTurn': currentTurn.number,
            'moves': moves,
            'selectedSquare': null,
            'highlightSquares': [],
        };
    }

    render() {
        return (
            <div id="game">
                <div className="game-left">
                    <MoveList moves={this.state.moves} />
                </div>
                <div className="game-center">
                    <div className="card-row">
                        <Card
                            name={this.state.cards[2]}
                        />
                        <Card
                            name={this.state.cards[3]}
                        />
                    </div>
                    <Board
                        state={this.state.board}
                    />
                    <div className="card-row">
                        <Card
                            name={this.state.cards[0]}
                        />
                        <Card
                            name={this.state.cards[1]}
                        />
                    </div>
                </div>
                <div className="game-right">
                    <div className="neutral-card">
                        <Card
                            name={this.state.cards[4]}
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

class MoveList extends Component {
    render() {
        let movelist = [];
        for (let i in this.props.moves) {
            movelist.push(
                <div className="move">
                    {this.props.moves[i]}
                </div>
            );
        }
        return (
            <div className="turn-list">
                {movelist}
            </div>
        )
    }
}

class App extends Component {
    render() {
        return (
            <div className="App">
                 <Game data={this.props.data}/>
            </div>
        );
    }
}

export default App;