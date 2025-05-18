import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import HandControl, { ComputerHand } from './HandControl';

// Fallback component while loading
const LoadingFallback = () => (
    <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl">Loading game...</p>
    </div>
);

const Game = () => {
    const [playerChoice, setPlayerChoice] = useState(null);
    const [computerChoice, setComputerChoice] = useState(null);
    const [result, setResult] = useState('');
    const [score, setScore] = useState({ player: 0, computer: 0 });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const choices = ['rock', 'paper', 'scissors'];

    const handleChoice = async (choice) => {
        try {
            setIsLoading(true);
            setError(null);
            
            const computerSelection = choices[Math.floor(Math.random() * choices.length)];
            setPlayerChoice(choice);
            
            // Artificial delay for smooth animation
            await new Promise(resolve => setTimeout(resolve, 300));
            setComputerChoice(computerSelection);
            
            determineWinner(choice, computerSelection);
        } catch (err) {
            setError('Failed to process your choice');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
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

    const choiceImages = {
        rock: '🪨',
        paper: '📄',
        scissors: '✂️'
    };

    // Safe drag end handler with error boundary
    const handleDragEnd = (result) => {
        try {
            if (!result.destination) return;
            
            const sourceIndex = result.source.index;
            if (sourceIndex >= 0 && sourceIndex < choices.length) {
                const choice = choices[sourceIndex];
                handleChoice(choice);
            }
        } catch (err) {
            setError('Something went wrong with the drag operation');
            console.error(err);
        }
    };

    // Reset error on component unmount
    useEffect(() => {
        return () => setError(null);
    }, []);

    // Error display component
    if (error) {
        return (
            <div className="text-red-500 text-center p-4">
                <p>{error}</p>
                <button 
                    onClick={() => setError(null)}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center  bg-gray-100">
            <motion.h1 
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-4xl font-bold "
            >
                Rock Paper Scissors
            </motion.h1>
            
            <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5 }}
                className=""
            >
                <p className="text-xl">Score:</p>
                <p>Player: {score.player} - Computer: {score.computer}</p>
            </motion.div>

            {/* Add HandControl and ComputerHand side by side */}
            <div className="mb-12 flex flex-row justify-center items-center w-full gap-8" style={{ minHeight: 340, overflow: 'visible' }}>
                <HandControl 
                    choice={playerChoice}
                    onChoiceSelect={handleChoice}
                />
                <ComputerHand choice={computerChoice} />
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="choices" direction="horizontal">
                    {(provided, snapshot) => (
                        <div 
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={`flex gap-4 mb-8 p-4 ${
                                snapshot.isDraggingOver ? 'bg-blue-100 rounded-lg' : ''
                            }`}
                        >
                            {choices.map((choice, index) => (
                                <Draggable 
                                    key={choice} 
                                    draggableId={choice} 
                                    index={index}
                                    isDragDisabled={isLoading}
                                >
                                    {(provided, snapshot) => (
                                        <motion.div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            whileHover={{ scale: isLoading ? 1 : 1.1 }}
                                            whileTap={{ scale: isLoading ? 1 : 0.95 }}
                                        >
                                            <button
                                                onClick={() => !isLoading && handleChoice(choice)}
                                                disabled={isLoading}
                                                className={`px-6 py-4 bg-blue-500 text-white rounded-lg 
                                                    ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}
                                                    ${snapshot.isDragging ? 'opacity-50' : ''} 
                                                    capitalize flex flex-col items-center`}
                                            >
                                                <span className="text-2xl mb-2">{choiceImages[choice]}</span>
                                                {choice}
                                            </button>
                                        </motion.div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            <AnimatePresence>
                {playerChoice && computerChoice && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-center mb-8"
                    >
                        <motion.p 
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.3 }}
                        >
                            Your choice: {choiceImages[playerChoice]} {playerChoice}
                        </motion.p>
                        <motion.p
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                        >
                            Computer's choice: {choiceImages[computerChoice]} {computerChoice}
                        </motion.p>
                        <motion.p 
                            className="text-xl font-bold mt-2"
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            {result}
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                onClick={resetGame}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
                Reset Game
            </motion.button>
        </div>
    );
};

// Wrap the export with Suspense
export default function GameWithSuspense() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <Game />
        </Suspense>
    );
}
