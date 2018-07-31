import React from "react";
import "./App.css";

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

function Card(props) {
    let filled = cardData[props.name];
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
        if (props.flipCard) {
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
    if (props.pending) {
        cls += " pending";
    }
    if (props.flipCard) {
        return (
            <div
                className={cls}
                onClick = {props.onClick}
            >
                {props.name}
                {rows}
            </div>
        )
    } else {
        rows.reverse();
        return (
            <div
                className={cls}
                onClick = {props.onClick}
            >
                {rows}
                {props.name}
            </div>
        )
    }
}

export default Card;
