import React, { Component } from "react";
import "./App.css";

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
        let moves = ["Start"];
        for (let i = 1; i < this.data.turns.length; i++) {
            moves.push(this.data.turns[i].lastMove);
        }
        this.state = {
            "board": currentTurn.board,
            "cards": currentTurn.cards,
            "displayTurn": currentTurn.number,
            "moves": moves,
            "selectedSquare": null,
            "highlightSquares": [],
            "currentTurn": currentTurn.number,
        };
        this.userPlayer = props.userPlayer;
        this.showTurn = this.showTurn.bind(this);
        this.selectSquare = this.selectSquare.bind(this);
        this.socket = props.socket;
        this.socket.onmessage = function(e) {
            console.log(e.data);
        }
        this.socket.send("Hello from React!");
    }

    showTurn(turnNumber) {
        let turn = this.data.turns[turnNumber];
        this.setState({
            "board": turn.board,
            "cards": turn.cards,
            "displayTurn": turn.number,
            "selectedSquare": null,
            "highlightSquares": [],
        });
    }

    selectSquare(number) {
        if ((this.userPlayer === this.data.activePlayer)
            && (this.state.displayTurn === this.state.currentTurn)) {
            let cards;
            if (this.userPlayer === "red") {
                cards = this.state.cards.slice(0,2);
            } else {
                cards = this.state.cards.slice(2,4);
            }
            if (this.state.selectedSquare === null) {
                let moves = [];
                for (let i = 0; i < cards.length; i++) {
                    let cardMoves = this.data.legalMoves[cards[i]][number];
                    if (cardMoves !== null) {
                        moves = moves.concat(cardMoves);
                    }
                }
                if (moves.length > 0) {
                    this.setState({
                        "selectedSquare": number,
                        "highlightSquares": moves,
                    });
                }
            } else {
                //Square was selected to we try to treat it as a move
                let source = this.state.selectedSquare;
                let moves = [];
                for (let i = 0; i < cards.length; i++) {
                    let cardMoves = this.data.legalMoves[cards[i]][source];
                    if (cardMoves !== null) {
                        moves = moves.concat(cardMoves);
                    }
                }
                if (moves.includes(number)) {
                    alert("Legal move to square "+number);
                } else {
                    //Was not a legal move, so treat it as a square selection
                    moves = [];
                    for (let i = 0; i < cards.length; i++) {
                        let cardMoves = this.data.legalMoves[cards[i]][number];
                        if (cardMoves !== null) {
                            moves = moves.concat(cardMoves);
                        }
                    }
                    if (moves.length > 0) {
                        this.setState({
                            "selectedSquare": number,
                            "highlightSquares": moves,
                        });
                    }
                }
            }
        }
    }

    render() {
        return (
            <div id="game">
                <div className="game-left">
                    <MoveList
                        moves={this.state.moves}
                        selectedMove={this.state.displayTurn}
                        clickHandler={this.showTurn}
                    />
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
                        board={this.state.board}
                        highlight={this.state.highlightSquares}
                        select={this.state.selectedSquare}
                        clickHandler={this.selectSquare}
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
        for (let i = 0; i < this.props.board.length; i++) {
            let cls;
            if (this.props.highlight.includes(i)) {
                cls = "board-square highlight";
            } else if (this.props.select === i) {
                cls = "board-square selected";
            } else {
                cls = "board-square";
            }
            squares[i] = (
                <div
                    key={i}
                    className={cls}
                    onClick={() => this.props.clickHandler(i)}
                >
                    <Piece
                        value = {this.props.board[i]}
                    />
                </div>
            )
        }
        let rows = []
        //Row 0 should be blue's start row (squares 20 through 24)
        for (let i = 0; i < 5; i++) {
            rows[5-i] = (
                <div
                    className="board-row"
                    key={i}
                >
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
        for (let i = 0; i < this.props.moves.length; i++) {
            let cls;
            if (i === this.props.selectedMove) {
                cls = "move selected";
            } else {
                cls = "move";
            }
            movelist.push(
                <div
                    key={i}
                    className={cls}
                    onClick={() => this.props.clickHandler(i)}
                >
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
                 <Game
                    data={this.props.data}
                    userPlayer={this.props.userPlayer}
                    socket={this.props.socket}
                />
            </div>
        );
    }
}

export default App;
