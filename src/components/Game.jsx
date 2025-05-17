import React, { useState } from 'react';

const Game = () => {
    const [playerChoice, setPlayerChoice] = useState(null);
    const [computerChoice, setComputerChoice] = useState(null);
    const [result, setResult] = useState('');
    const [score, setScore] = useState({ player: 0, computer: 0 });

    const choices = ['rock', 'paper', 'scissors'];

    const handleChoice = (choice) => {
        const computerSelection = choices[Math.floor(Math.random() * choices.length)];
        setPlayerChoice(choice);
        setComputerChoice(computerSelection);
        determineWinner(choice, computerSelection);
    };

    const determineWinner = (player, computer) => {
        if (player === computer) {
            setResult("It's a tie!");
            return;
        }

        if (
            (player === 'rock' && computer === 'scissors') ||
            (player === 'paper' && computer === 'rock') ||
            (player === 'scissors' && computer === 'paper')
        ) {
            setResult('You win!');
            setScore(prev => ({ ...prev, player: prev.player + 1 }));
        } else {
            setResult('Computer wins!');
            setScore(prev => ({ ...prev, computer: prev.computer + 1 }));
        }
    };

    const resetGame = () => {
        setPlayerChoice(null);
        setComputerChoice(null);
        setResult('');
        setScore({ player: 0, computer: 0 });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-8">Rock Paper Scissors</h1>
            
            <div className="mb-8">
                <p className="text-xl">Score:</p>
                <p>Player: {score.player} - Computer: {score.computer}</p>
            </div>

            <div className="flex gap-4 mb-8">
                {choices.map(choice => (
                    <button
                        key={choice}
                        onClick={() => handleChoice(choice)}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 capitalize"
                    >
                        {choice}
                    </button>
                ))}
            </div>

            {playerChoice && computerChoice && (
                <div className="text-center mb-8">
                    <p>Your choice: {playerChoice}</p>
                    <p>Computer's choice: {computerChoice}</p>
                    <p className="text-xl font-bold mt-2">{result}</p>
                </div>
            )}

            <button
                onClick={resetGame}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
                Reset Game
            </button>
        </div>
    );
};

export default Game;
