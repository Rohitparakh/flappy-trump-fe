
import React from 'react';
import { useGameStore } from '@/lib/gameStore';
import { Button } from '@/components/ui/button';

const StartScreen: React.FC = () => {
  const { startGame, highScore } = useGameStore();
  
  return (
    <div className="game-ui inset-0 flex flex-col items-center justify-center bg-gray-800/95 rounded-md p-6">
      <h1 className="text-4xl font-bold mb-4 text-red-500 drop-shadow-md">Flappy Trump</h1>
      <div className="mb-8 animate-bird-hover">
        <div className="w-20 h-20 relative">
          <img 
            src="/trump-face.png" 
            alt="Trump" 
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      
      <div className="text-center mb-8">
        <p className="text-lg mb-2 text-gray-200">Click or press SPACE to flap wings</p>
        <p className="text-sm mb-4 text-gray-300">Avoid the tariffs and try to survive as long as possible!</p>
        <p className="text-md font-semibold text-gray-200">High Score: {highScore}</p>
      </div>
      
      <Button 
        onClick={startGame}
        className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full text-lg transition-all transform hover:scale-105"
      >
        Start Game
      </Button>
    </div>
  );
};

export default StartScreen;
