import React, { useState } from 'react';
import { motion } from 'framer-motion';

const HandControl = ({ choice, onChoiceSelect }) => {
  const [fingers, setFingers] = useState({
    thumb: 0,
    index: 0,
    middle: 0,
    ring: 0,
    pinky: 0
  });

  const updateFinger = (finger, rotation) => {
    const newFingers = { ...fingers, [finger]: rotation };
    setFingers(newFingers);
    
    // Detect hand gesture
    if (newFingers.thumb === -45 && newFingers.index === -45 && newFingers.middle === -45) {
      onChoiceSelect('rock');
    } else if (Object.values(newFingers).every(rot => rot === 0)) {
      onChoiceSelect('paper');
    } else if (newFingers.index === 0 && newFingers.middle === 0 && 
               newFingers.ring === -45 && newFingers.pinky === -45) {
      onChoiceSelect('scissors');
    }
  };

  return (
    <div className="relative w-80 h-80">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Palm */}
        <motion.path
          d="M 30 70 Q 50 70 70 70 Q 70 40 50 40 Q 30 40 30 70"
          fill="#ffdbac"
          stroke="#000"
          strokeWidth="1"
        />
        
        {/* Thumb */}
        <motion.path
          d="M 30 60 Q 20 55 25 45"
          stroke="#000"
          strokeWidth="2"
          fill="none"
          animate={{ rotate: fingers.thumb }}
          drag
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          onDragEnd={() => updateFinger('thumb', fingers.thumb === 0 ? -45 : 0)}
        />

        {/* Fingers */}
        {['index', 'middle', 'ring', 'pinky'].map((finger, i) => (
          <motion.path
            key={finger}
            d={`M ${40 + i * 10} 40 V 20`}
            stroke="#000"
            strokeWidth="2"
            fill="none"
            animate={{ rotate: fingers[finger] }}
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            onDragEnd={() => updateFinger(finger, fingers[finger] === 0 ? -45 : 0)}
          />
        ))}

        {/* Finger joints */}
        {['index', 'middle', 'ring', 'pinky'].map((finger, i) => (
          <circle
            key={`${finger}-joint`}
            cx={40 + i * 10}
            cy={40}
            r="2"
            fill="#ff0000"
            className="cursor-pointer"
          />
        ))}
      </svg>

      <div className="text-center mt-4 text-gray-600">
        <p>Drag fingers to make gestures:</p>
        <ul className="text-sm">
          <li>Close all fingers for Rock</li>
          <li>Open all fingers for Paper</li>
          <li>Keep index and middle up for Scissors</li>
        </ul>
      </div>
    </div>
  );
};

export default HandControl;
