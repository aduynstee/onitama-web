import React, { Component } from 'react';
import './App.css';

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'board': Array(25).fill('empty'),
            'cards': {
                'user': Array(2).fill('user card'),
                'neutral': 'neutral card',
                'opponent': Array(2).fill('opp card'),
            }
        };
    }

    render() {
        return (
            <div id="game">
                <div className="game-left">
                    <TurnList />
                </div>
                <div className="game-center">
                    <div className="card-row">
                        <Card
                            name={this.state.cards.opponent[0]}
                        />
                        <Card
                            name={this.state.cards.opponent[1]}
                        />
                    </div>
                    <Board
                        state={this.state.board}
                    />
                    <div className="card-row">
                        <Card
                            name={this.state.cards.user[0]}
                        />
                        <Card
                            name={this.state.cards.user[1]}
                        />
                    </div>
                </div>
                <div className="game-right">
                    <div className="neutral-card">
                        <Card
                            name={this.state.cards.neutral}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

class Card extends Component {
    constructor(props) {
        super(props);
        this.name = props.name;
    }

    render() {
        return (
            <div className="card">
                {this.name}
            </div>
        )
    }
}

class Board extends Component {
    constructor(props) {
        super(props);
        this.state = props.state;
    }

    render() {
        let squares = []
        for (let i = 0; i < this.state.length; i++) {
            squares[i] = (
                <div className="board-square">
                    {this.state[i]}
                </div>
            )
        }
        let rows = []
        for (let i = 0; i < 5; i++) {
            rows[i] = (
                <div className="board-row">
                    {squares.slice(5*i, 5*(i+1))}
                </div>
            )
        }
        return (
            <div id="board">
                {rows}
            </div>
        )
    }
}

class TurnList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="turn-list">
                <div className="turn">Turns go here</div>
                <div className="turn">Turns go here</div>
                <div className="turn">Turns go here</div>
                <div className="turn">Turns go here</div>
                <div className="turn">Turns go here</div>
            </div>
        )
    }
}

class App extends Component {
    render() {
        return (
            <div className="App">
                 <Game/>
            </div>
        );
    }
}

export default App;
