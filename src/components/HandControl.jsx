import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

const springConfig = {
  type: "spring",
  stiffness: 300,
  damping: 20
};

const fingerBases = {
  thumb: { x1: 32, y1: 50, x2: 45, y2: 40 },
  index: { x1: 40, y1: 40, x2: 40, y2: 25 },
  middle: { x1: 50, y1: 40, x2: 50, y2: 23 },
  ring: { x1: 60, y1: 40, x2: 60, y2: 27 },
  pinky: { x1: 70, y1: 40, x2: 70, y2: 30 }
};

// Utility to get finger offsets for a given gesture
const getGestureOffsets = (gesture) => {
  switch (gesture) {
    case 'rock':
      return { thumb: 6, index: 6, middle: 6, ring: 6, pinky: 6 };
    case 'scissors':
      return { thumb: 6, index: 0, middle: 0, ring: 6, pinky: 6 };
    case 'paper':
    default:
      return { thumb: 0, index: 0, middle: 0, ring: 0, pinky: 0 };
  }
};

// User-controlled hand
const HandControl = ({ choice, onChoiceSelect }) => {
  const [fingers, setFingers] = useState({
    thumb: 0,
    index: 0,
    middle: 0,
    ring: 0,
    pinky: 0
  });
  const [pendingChoice, setPendingChoice] = useState(null);
  const [lastChoice, setLastChoice] = useState(null);

  const updateFinger = (finger, offset) => {
    const newFingers = { ...fingers, [finger]: offset };
    setFingers(newFingers);

    if (
      newFingers.thumb === 6 &&
      newFingers.index === 6 &&
      newFingers.middle === 6 &&
      newFingers.ring === 6 &&
      newFingers.pinky === 6
    ) {
      setPendingChoice('rock');
    }
    else if (
      newFingers.index === 0 &&
      newFingers.middle === 0 &&
      newFingers.ring === 6 &&
      newFingers.pinky === 6 &&
      newFingers.thumb === 6
    ) {
      setPendingChoice('scissors');
    }
    else if (
      newFingers.thumb === 0 &&
      newFingers.index === 0 &&
      newFingers.middle === 0 &&
      newFingers.ring === 0 &&
      newFingers.pinky === 0
    ) {
      setPendingChoice('paper');
    }
    else {
      setPendingChoice('paper');
    }
  };

  const handleShowChoice = () => {
    onChoiceSelect(pendingChoice);
    setLastChoice(pendingChoice);
    setFingers({
      thumb: 0,
      index: 0,
      middle: 0,
      ring: 0,
      pinky: 0
    });
    setTimeout(() => {
      setPendingChoice('paper');
      setLastChoice(null);
    }, 500);
  };

  const handleFingerDrag = (finger, info) => {
    if (lastChoice) return;
    const offset = Math.min(6, Math.max(0, info.offset.y));
    updateFinger(finger, offset);
  };

  useEffect(() => {
    setPendingChoice('paper');
  }, []);

  const createFingerStyle = (finger) => ({
    rotate: fingers[finger],
    transition: springConfig,
    transformOrigin: getFingerOrigin(finger)
  });

  const getFingerOrigin = (finger) => {
    switch(finger) {
      case 'thumb': return '32px 60px';
      case 'index': return '40px 30px';
      case 'middle': return '35px 20px';
      case 'ring': return '35px 10px';
      case 'pinky': return '35px 5px';
      default: return 'center';
    }
  };

  return (
    <div className="relative w-70 h-70">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Palm with gradient */}
        <defs>
          <linearGradient id="skinGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: "#ffdbac" }} />
            <stop offset="50%" style={{ stopColor: "#f1c27d" }} />
            <stop offset="100%" style={{ stopColor: "#ffdbac" }} />
          </linearGradient>
        </defs>
        <motion.path
          d="M 30 70 Q 50 75 70 70 Q 72 40 50 38 Q 28 40 30 70"
          fill="url(#skinGradient)"
          stroke="#C6947B"
          strokeWidth="1"
        />
        {Object.entries(fingerBases).map(([finger, base]) => {
          const offset = fingers[finger] || 0;
          const y2 = base.y2 + offset;
          return (
            <g key={finger} style={{ cursor: 'grab' }}>
              <motion.line
                x1={base.x1}
                y1={base.y1}
                x2={base.x2}
                y2={y2}
                stroke="#ffdbac"
                strokeWidth="3"
                strokeLinecap="round"
                drag="y"
                dragConstraints={{
                  top: 0,
                  bottom: 6
                }}
                dragElastic={0}
                dragMomentum={false}
                onDragEnd={(_, info) => {
                  if (Math.abs(info.offset.y) < 4) {
                    updateFinger(finger, 0);
                  }
                }}
                onDrag={(_, info) => handleFingerDrag(finger, info)}
                style={{ cursor: 'grab' }}
              />
              <motion.circle
                cx={base.x2}
                cy={y2}
                r="2"
                fill="#C6947B"
              />
            </g>
          );
        })}
      </svg>
      <div className="text-center ">
        <button
          onClick={handleShowChoice}
          className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
        >
          Show Choice ({pendingChoice || 'paper'})
        </button>
      </div>
    </div>
  );
};

// Computer hand: shows a gesture based on the choice prop
export const ComputerHand = ({ choice }) => {
  // Memoize the finger positions for the current gesture
  const fingers = useMemo(() => getGestureOffsets(choice), [choice]);

  return (
    <div className="relative w-70 h-70">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <linearGradient id="skinGradientComp" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: "#ffe0b2" }} />
            <stop offset="50%" style={{ stopColor: "#e0b97a" }} />
            <stop offset="100%" style={{ stopColor: "#ffe0b2" }} />
          </linearGradient>
        </defs>
        <motion.path
          d="M 30 70 Q 50 75 70 70 Q 72 40 50 38 Q 28 40 30 70"
          fill="url(#skinGradientComp)"
          stroke="#C6947B"
          strokeWidth="1"
        />
        {Object.entries(fingerBases).map(([finger, base]) => {
          const offset = fingers[finger] || 0;
          const y2 = base.y2 + offset;
          return (
            <g key={finger}>
              <motion.line
                x1={base.x1}
                y1={base.y1}
                x2={base.x2}
                y2={y2}
                stroke="#ffe0b2"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <motion.circle
                cx={base.x2}
                cy={y2}
                r="2"
                fill="#C6947B"
              />
            </g>
          );
        })}
      </svg>
      <div className="text-center mt-2 text-sm text-gray-500">Computer</div>
    </div>
  );
};

export default HandControl;
