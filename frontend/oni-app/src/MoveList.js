import React from "react";
import "./App.css";

function MoveList(props) {
    let movelist = [];
    for (let i = 1; i < props.moves.length; i++) {
        let cls = "move";
        if (i === props.selectedMove) {
            cls += " selected";
        }
        cls += " "+props.playerOrder[(i-1) % 2];
        movelist.push(
            <div
                className={cls}
                key={i}
                onClick={() => props.clickHandler(i)}
            >
                {props.moves[i]}
            </div>
        )
    }
    let buttonNames = ["Start", "Previous", "Next", "Current"];
    let buttons = [];
    for (let i = 0; i < buttonNames.length;  i++) {
        buttons.push(
            <button
                onClick={() => props.buttonHandler(i)}
            >
                {buttonNames[i]}
            </button>
        );
    }
    return (
        <div className="movelist-container">
            <div className="move-buttons">
                {buttons}
            </div>
            <div className="movelist">
                {movelist}
            </div>
        </div>
    )
}

export default MoveList;
