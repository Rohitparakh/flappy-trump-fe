
import React, { useEffect } from 'react';
import { useGameStore } from '@/lib/gameStore';

const Bird: React.FC = () => {
  const { birdPosition, updateBirdPosition, showSpeechBubble, speechBubbleText } = useGameStore();
  const [velocity, setVelocity] = React.useState(0);
  const [rotation, setRotation] = React.useState(0);

  // Update bird position based on physics
  useEffect(() => {
    const gameLoop = setInterval(() => {
      // Apply gravity to velocity
      setVelocity(v => Math.min(v + 0.5, 8)); // Limit max downward velocity
      updateBirdPosition(velocity);
      setRotation(velocity * 2);
    }, 24);

    return () => clearInterval(gameLoop);
  }, [updateBirdPosition, velocity]);

  // Handle key press and click for flapping
  useEffect(() => {
    const handleFlap = () => {
      setVelocity(-7); // Slightly reduced upward force for better control
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault(); // Prevent page scrolling
        handleFlap();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', handleFlap);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleFlap);
    };
  }, []);

  return (
    <>
      <div
        className="bird absolute z-20"
        style={{
          left: `${birdPosition.x}px`,
          top: `${birdPosition.y}px`,
          width: '40px',
          height: '40px',
          transform: `rotate(${rotation}deg)`,
          transition: 'transform 0.1s ease',
          willChange: 'transform',
        }}
      >
        <div className="w-full h-full relative">
          <img 
            src="/lovable-uploads/98ececd0-2ab9-44d0-8fc2-a254a6a11e5c.png" 
            alt="Trump" 
            className="w-full h-full object-contain"
            style={{
              filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.3))",
            }}
          />
        </div>
        
        {/* Speech bubble */}
        {showSpeechBubble && (
          <div className="absolute -right-[100%] -top-[100%] transform -translate-y-full translate-x-1/4 bg-white rounded-lg p-2 text-black text-xs font-bold animate-bounce" style={{
            filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))",
            whiteSpace: "nowrap",
            minWidth: "70px",
            textAlign: "center",
          }}>
            <div className="mb-1">{speechBubbleText}</div>
            <div className="absolute left-1/4 top-full w-2 h-2 bg-white transform rotate-45"></div>
          </div>
        )}
      </div>
    </>
  );
};

export default Bird;
