import React from 'react';
import Piece from "./Piece.js";
import "./App.css";

function Board(props) {
    let squares = []
    for (let i = 0; i < props.board.length; i++) {
        let cls;
        if (props.target === i) {
            cls = "board-square target"
        } else if (props.highlight.includes(i)) {
            cls = "board-square highlight";
        } else if (props.select === i) {
            cls = "board-square selected";
        } else {
            cls = "board-square";
        }
        squares[i] = (
            <div
                key={i}
                className={cls}
                onClick={() => props.clickHandler(i)}
            >
                <Piece
                    value = {props.board[i]}
                />
            </div>
        )
    }
    let rows = []
    //Row 0 should be blue's start row (squares 20 through 24)
    for (let i = 0; i < 5; i++) {
        let row = squares.slice(5*i, 5*(i+1));
        if (props.flipBoard) {
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
    if (props.flipBoard) {
        rows.reverse();
    }
    let fileLetters = ['a','b','c','d','e'];
    if (props.flipBoard) {
        fileLetters.reverse();
    }
    let files = [];
    for (let i = 0; i < 5; i++) {
        files.push(
            <div
                className="file"
                key={i}
            >
                {fileLetters[i]}
            </div>
        );
    }
    let rankLetters = ['1','2','3','4','5'];
    if (props.flipBoard) {
        rankLetters.reverse();
    }
    let ranks = [];
    for (let i = 0; i < 5; i++) {
        ranks.push(
            <div
                className="rank"
                key={i}
            >
                {rankLetters[i]}
            </div>
        );
    }
    return (
        <div id="board-container">
            <div id="board">
                {rows}
            </div>
            <div id="ranks">
                {ranks}
            </div>
            <div id="files">
                {files}
            </div>
        </div>
    )
}

export default Board;
