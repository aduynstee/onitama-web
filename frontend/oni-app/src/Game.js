import React, { Component } from "react";
import MoveList from './MoveList.js';
import Card from './Card.js';
import Board from './Board.js';
import "./App.css";

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
        this.update(this.props.gameData);
    }

    requestUpdate() {
        this.socket.send(JSON.stringify({
            "request": "update",
        }));
    }

    update(gameData) {
        this.data = gameData;
        let newMoves = ["Start"];
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
            let playerOrder = ["red", "blue"];
            if (this.data.startPlayer === "blue") {
                playerOrder.reverse();
            }
            return (
                <div id="game">
                    <div className="game-left">
                        <MoveList
                            moves={this.state.moves}
                            selectedMove={this.state.displayTurn}
                            clickHandler={this.showTurn}
                            playerOrder={playerOrder}
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

export default Game;
