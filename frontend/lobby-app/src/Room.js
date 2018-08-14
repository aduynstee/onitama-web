import React from "react";

function Room(props) {
    let players = [];
    for (let i = 0; i < props.players.length; i++) {
        players.push(
            <li>{props.players[i]}</li>
        );
    }
    let playerList;
    if (players.length == 0) {
        playerList = <div>Waiting for players...</div>;
    } else {
        playerList = (
            <div>
                <div>Players ({players.length}/2):</div>
                <ul>{players}</ul>
            </div>
        );
    }
    return (
        <div className="game-room">
            <div>{props.name}</div>
            {playerList}
            <div><a href={props.link}>Join</a></div>
            <div>Created: {props.created} ago</div>
        </div>
    )
}

export default Room;
