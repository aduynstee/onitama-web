import React from "react";
import "./App.css";

function PlayerPanel(props) {
    let cls = "player-name "+props.color;
    if (props.active) cls += " active";
    let name = "";
    if (props.name === null || props.name === undefined) {
        name = "Waiting for an opponent...";
    } else {
        name = props.name;
    }
    return (
        <div className={cls}>
            {name}
        </div>
    )
}

export default PlayerPanel;
