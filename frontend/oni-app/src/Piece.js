import React from "react";
import "./App.css";

function Piece(props){
    let cls = "piece "+props.value;
    return (
        <div className={cls}></div>
    )
}

export default Piece;
