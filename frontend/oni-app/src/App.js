import React, { Component } from "react";
import "./App.css";

class Piece extends Component {
    render() {
        let cls = "piece "+this.props.value;
        return (
            <div className={cls}></div>
        )
    }
}

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "loaded": false,
        };
        this.userPlayer = props.userPlayer;
        this.showTurn = this.showTurn.bind(this);
        this.selectSquare = this.selectSquare.bind(this);
        this.selectCard = this.selectCard.bind(this);
        this.socket = props.socket;
        this.socket.onmessage = (event) => {
            let msg = JSON.parse(event.data);
            if (msg.type === "update") {
                this.update(msg.gameData);
            }
        }
    }

    componentDidMount() {
        this.requestUpdate();
    }

    requestUpdate() {
        this.socket.send(JSON.stringify({
            "request": "update",
        }));
    }

    update(gameData) {
        this.data = gameData;
        let newMoves = ['Start'];
        for (let i = 1; i < gameData.turns.length; i++) {
            newMoves.push(gameData.turns[i].lastMove);
        }
        this.setState({
            "moves": newMoves,
        });
        let latestTurnNum = gameData.turns.length-1;
        //If not loaded or user was viewing the latest turn, we update board
        if (!this.state.loaded ||
            this.state.displayTurn === this.state.currentTurn) {
            this.showTurn(latestTurnNum);
        }
        this.setState({
            "currentTurn": latestTurnNum,
            "loaded": true,
        });
    }

    showTurn(turnNumber) {
        let turn = this.data.turns[turnNumber];
        this.setState({
            "board": turn.board,
            "cards": turn.cards,
            "displayTurn": turn.number,
            "selectedSquare": null,
            "highlightSquares": [],
            "pendingCardSelection": false,
        });
    }

    selectSquare(number) {
        this.setState({
            "pendingCardSelection": false,
        });
        if ((this.userPlayer === this.data.activePlayer)
            && (this.state.displayTurn === this.state.currentTurn)) {
            let cards;
            if (this.userPlayer === "red") {
                cards = this.state.cards.slice(0,2);
            } else if (this.userPlayer === "blue"){
                cards = this.state.cards.slice(2,4);
            } else {
                console.log("You cannot make moves in this game!");
                return;
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
                    //Legal move selected
                    let useableCards = [];
                    for (let i = 0; i < cards.length; i++) {
                        let cardMoves = this.data.legalMoves[cards[i]][source];
                        if (cardMoves !== null && cardMoves.includes(number)) {
                            useableCards = useableCards.concat(cards[i]);
                        }
                    }
                    if (useableCards.length === 1) {
                        //Only one card useable for this moves
                        this.sendMove(source, number, useableCards[0]);
                    } else if (useableCards.length === 2) {
                        //Player must choose a card to use
                        this.moveSelection = {
                            "start": source,
                            "end": number,
                        };
                        this.setState({
                            "pendingCardSelection": true,
                        });
                    }
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

    selectCard(card) {
        let cards = [];
        if (this.userPlayer === "red") {
            cards = this.state.cards.slice(0,2);
        } else if (this.userPlayer === "blue") {
            cards = this.state.cards.slice(2,4);
        } else {
            console.log("You cannot make moves in this game!");
            return;
        }
        if (this.state.pendingCardSelection === true
            && cards.includes(card)) {
            this.sendMove(
                this.moveSelection.start,
                this.moveSelection.end,
                card,
            );
            this.setState({
                "pendingCardSelection": false,
            });
        }
    }

    sendMove(start, end, card) {
        this.socket.send(JSON.stringify({
            "request": "move",
            "start": start,
            "end": end,
            "card": card,
        }));
    }

    render() {
        if (this.state.loaded) {
            let target = null;
            if (this.state.pendingCardSelection) {
                target = this.moveSelection.end;
            }
            let flipBoard = (this.userPlayer === "blue") ? true : false;
            let topCards = [];
            let bottomCards = [];
            if (flipBoard) {
                topCards = this.state.cards.slice(0,2);
                bottomCards = this.state.cards.slice(2,4);
            } else {
                topCards = this.state.cards.slice(2,4);
                bottomCards = this.state.cards.slice(0,2);
            }
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
                                name={topCards[0]}
                                onClick={
                                    () => this.selectCard(topCards[0])
                                }
                                flipCard={true}
                            />
                            <Card
                                name={topCards[1]}
                                onClick={
                                    () => this.selectCard(topCards[1])
                                }
                                flipCard={true}
                            />
                        </div>
                        <Board
                            board={this.state.board}
                            highlight={this.state.highlightSquares}
                            select={this.state.selectedSquare}
                            target={target}
                            clickHandler={this.selectSquare}
                            flipBoard={flipBoard}
                        />
                        <div className="card-row">
                            <Card
                                name={bottomCards[0]}
                                onClick={
                                    () => this.selectCard(bottomCards[0])
                                }
                                pending={this.state.pendingCardSelection}
                            />
                            <Card
                                name={bottomCards[1]}
                                onClick={
                                    () => this.selectCard(bottomCards[1])
                                }
                                pending={this.state.pendingCardSelection}
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
        } else {
            return (
                <p> Loading... </p>
            )
        }
    }
}

const cardData = {
    "monkey": [16, 8, 18, 6],
    "elephant": [11, 13, 16, 18],
    "crane": [8, 17, 6],
    "mantis": [16, 18, 7],
    "tiger": [22, 7],
    "dragon": [15, 8, 6, 19],
    "boar": [11, 13, 17],
    "crab": [14, 17, 10],
    "goose": [11, 13, 16, 8],
    "rooster": [11, 13, 6, 18],
    "eel": [13, 16, 6],
    "cobra": [11, 8, 18],
    "horse": [11, 17, 7],
    "ox": [13, 17, 7],
    "frog": [16, 8, 10],
    "rabbit": [14, 6, 18],
};

class Card extends Component {
    render() {
        let filled = cardData[this.props.name];
        let rows = [];
        for (let i = 0; i < 5; i++) {
            let row = [];
            for (let j = 0; j < 5; j++) {
                let cls = "";
                if (filled.includes(i*5 + j)) {
                    cls = "cardgrid-square filled";
                } else if (i*5 + j === 12) {
                    cls = "cardgrid-square center";
                } else {
                    cls = "cardgrid-square blank";
                }
                row.push(
                    <div
                        key={i+j}
                        className={cls}
                    ></div>
                );
            }
            if (this.props.flipCard) {
                row.reverse();
            }
            rows.push(
                <div
                    key={i}
                    className="cardgrid-row"
                >
                    {row}
                </div>
            );
        }
        let cls = "card";
        if (this.props.pending) {
            cls += " pending";
        }
        if (this.props.flipCard) {
            return (
                <div
                    className={cls}
                    onClick = {this.props.onClick}
                >
                    {this.props.name}
                    {rows}
                </div>
            )
        } else {
            rows.reverse();
            return (
                <div
                    className={cls}
                    onClick = {this.props.onClick}
                >
                    {rows}
                    {this.props.name}
                </div>
            )
        }

    }
}

class Board extends Component {
    render() {
        let squares = []
        for (let i = 0; i < this.props.board.length; i++) {
            let cls;
            if (this.props.target === i) {
                cls = "board-square target"
            } else if (this.props.highlight.includes(i)) {
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
            let row = squares.slice(5*i, 5*(i+1));
            if (this.props.flipBoard) {
                row.reverse();
            }
            rows[5-i] = (
                <div
                    className="board-row"
                    key={i}
                >
                    {row}
                </div>
            );
        }
        if (this.props.flipBoard) {
            rows.reverse();
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
        let c = "startmove move";
        if (this.props.selectedMove === 0) {
            c = "startmove move selected";
        }
        movelist.push(
            <div
                key={0}
                className={c}
                onClick={() => this.props.clickHandler(0)}
            >
                {this.props.moves[0]}
            </div>
        );
        for (let i = 1; i < this.props.moves.length; i = i+2) {
            let cls = "move";
            let row = [];
            for (let j = 0; j < 2; j++) {
                if (i+j < this.props.moves.length) {
                    if (i+j === this.props.selectedMove) {
                        cls = "move selected";
                    } else {
                        cls = "move";
                    }
                    row.push(
                        <div
                            key={i+j}
                            className={cls}
                            onClick={() => this.props.clickHandler(i+j)}
                        >
                            {this.props.moves[i+j]}
                        </div>
                    );
                }
            }
            movelist.push(
                <div
                    key={i}
                    className="move-row"
                >
                    {row}
                </div>
            );
        }
        return (
            <div className="move-list">
                {movelist}
            </div>
        )
    }
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "userPlayer": "unknown",
        };
        props.socket.onmessage = (event) => {
            let msg = JSON.parse(event.data);
            if (msg.type === "player") {
                this.setState({
                    "userPlayer": msg.player
                });
            }
        }
    }

    componentDidMount() {
        this.requestPlayer();
    }

    requestPlayer() {
        this.props.socket.send(JSON.stringify({
            "request": "player",
        }));
    }

    render() {
        let legalPlayers = ["red", "blue"];
        if (legalPlayers.includes(this.state.userPlayer)) {
            return (
                <div className="App">
                     <Game
                        userPlayer={this.state.userPlayer}
                        socket={this.props.socket}
                    />
                </div>
            );
        } else if (this.state.userPlayer === "unknown") {
            return (
                <div className="App">
                     Connecting...
                </div>
            );
        } else if (this.state.userPlayer === "denied") {
            return (
                <div className="App">
                     You do not have permission to see this game.
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
