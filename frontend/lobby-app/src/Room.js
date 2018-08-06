import React from "react";

function Room(props) {
    return (
        <div className="game-room">
            {props.name}
            <a href={props.link}>Join</a>
        </div>
    )
}

export default Room;
