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
    return (
        <div className="move-list">
            {movelist}
        </div>
    )
}

export default MoveList;
