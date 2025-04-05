
import React, { useState, useEffect } from 'react';
import { useGameStore } from '@/lib/gameStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import Leaderboard from './Leaderboard';

const STORAGE_KEY = 'flappy_trump_user_data';

const GameOverScreen: React.FC = () => {
  const { score, highScore, restartGame, addLeaderboardEntry, fetchLeaderboard } = useGameStore();
  const [playerName, setPlayerName] = useState('');
  const [telegramUsername, setTelegramUsername] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const { toast } = useToast();
  
  // Load saved user data when component mounts
  useEffect(() => {
    const savedUserData = localStorage.getItem(STORAGE_KEY);
    if (savedUserData) {
      try {
        const { name, telegram } = JSON.parse(savedUserData);
        setPlayerName(name || '');
        setTelegramUsername(telegram || '');
      } catch (error) {
        console.error('Error parsing saved user data', error);
      }
    }
    
    // Fetch leaderboard data
    fetchLeaderboard();
  }, [fetchLeaderboard]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!playerName.trim()) {
      toast({
        title: 'Name required',
        description: 'Please enter your name to submit your score',
        variant: 'destructive',
      });
      return;
    }
    
    if (!telegramUsername.trim()) {
      toast({
        title: 'Telegram username required',
        description: 'Please enter your Telegram username to submit your score',
        variant: 'destructive',
      });
      return;
    }
    
    // Save user data to localStorage for future use
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      name: playerName.trim(),
      telegram: telegramUsername.trim()
    }));
    
    addLeaderboardEntry(playerName.trim(), telegramUsername.trim());
    setSubmitted(true);
    
    toast({
      title: 'Score submitted!',
      description: `Your score of ${score} has been added to the leaderboard.`,
    });
  };
  
  const toggleLeaderboard = () => {
    setShowLeaderboard(!showLeaderboard);
  };
  
  return (
    <div className="game-ui inset-0 flex flex-col items-center justify-center bg-gray-800/95 border border-gray-700 rounded-md p-6">
      <h2 className="text-3xl font-bold mb-6 text-red-500">Game Over!</h2>
      
      <div className="text-center mb-6">
        <p className="text-xl mb-2 text-gray-300">Your Score: <span className="font-bold text-white">{score}</span></p>
        <p className="text-md text-gray-300">High Score: <span className="font-bold text-white">{highScore}</span></p>
      </div>
      
      {showLeaderboard && <Leaderboard onClose={toggleLeaderboard} />}
      
      {!showLeaderboard && !submitted && (
        <form onSubmit={handleSubmit} className="w-full max-w-xs mb-6">
          <div className="mb-4">
            <label htmlFor="playerName" className="block text-sm font-medium mb-1 text-gray-300">
              Enter your name:
            </label>
            <Input
              id="playerName"
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full bg-gray-700 border-gray-600 text-white"
              placeholder="Your name"
              maxLength={15}
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="telegramUsername" className="block text-sm font-medium mb-1 text-gray-300">
              Telegram username:
            </label>
            <Input
              id="telegramUsername"
              type="text"
              value={telegramUsername}
              onChange={(e) => setTelegramUsername(e.target.value)}
              className="w-full bg-gray-700 border-gray-600 text-white"
              placeholder="@username"
              maxLength={32}
              required
            />
          </div>
          
          <Button 
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            Submit Score
          </Button>
        </form>
      )}
      
      {!showLeaderboard && submitted && (
        <div className="mb-6 text-center">
          <p className="text-green-400 font-medium mb-4">Score submitted successfully!</p>
        </div>
      )}
      
      <div className="flex flex-col w-full gap-3">
        {!showLeaderboard && (
          <Button 
            onClick={toggleLeaderboard}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full text-lg transition-all transform hover:scale-105"
          >
            View Leaderboard
          </Button>
        )}
        
        {showLeaderboard && (
          <Button 
            onClick={toggleLeaderboard}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-full text-lg transition-all"
          >
            Back
          </Button>
        )}
        
        <Button 
          onClick={restartGame}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold rounded-full text-lg transition-all transform hover:scale-105"
        >
          Play Again
        </Button>
      </div>
    </div>
  );
};

export default GameOverScreen;
