
import React, { useEffect } from 'react';
import { useGameStore, LeaderboardEntry } from '@/lib/gameStore';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';

interface LeaderboardProps {
  onClose: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ onClose }) => {
  const { leaderboard, score, fetchLeaderboard, isLoadingScores } = useGameStore();
  
  useEffect(() => {
    // Fetch leaderboard when component mounts
    fetchLeaderboard();
  }, [fetchLeaderboard]);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Find player's position in leaderboard
  const findPlayerPosition = () => {
    const playerScoreIndex = leaderboard.findIndex(entry => entry.score <= score);
    return playerScoreIndex === -1 ? leaderboard.length + 1 : playerScoreIndex + 1;
  };

  const playerPosition = findPlayerPosition();
  
  // Create leaderboard display logic
  const renderLeaderboardEntries = () => {
    if (isLoadingScores) {
      return (
        <div className="flex justify-center items-center p-10">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2 text-white">Loading scores...</span>
        </div>
      );
    }
    
    if (leaderboard.length === 0) {
      return (
        <div className="text-center p-4 text-gray-300">
          <p>No scores yet! Be the first to set a record.</p>
        </div>
      );
    }

    const topEntries = leaderboard.slice(0, 10);
    const showSeparator = leaderboard.length > 10 && playerPosition > 10;
    
    return (
      <div className="w-full">
        {/* Top 10 entries */}
        {topEntries.map((entry: LeaderboardEntry, index: number) => (
          <div 
            key={entry.id} 
            className={`grid grid-cols-12 text-sm px-2 py-2 border-b border-gray-700 
              ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'} 
              ${index === 0 ? 'bg-amber-900/50' : ''}`}
          >
            <div className="col-span-1 font-medium text-gray-200">{index + 1}</div>
            <div className="col-span-3 font-medium truncate text-gray-100">{entry.name}</div>
            <div className="col-span-3 text-right text-gray-100">{entry.score}</div>
            <div className="col-span-5 text-right text-gray-300 text-xs">{formatDate(entry.createdAt)}</div>
          </div>
        ))}
        
        {/* Separator dots if needed */}
        {showSeparator && (
          <div className="text-center py-2 border-b border-gray-700">
            <div className="flex justify-center items-center gap-1">
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        )}
        
        {/* Player's position if not in top 10 */}
        {playerPosition > 10 && score > 0 && (
          <div className="grid grid-cols-12 text-sm px-2 py-2 border-b border-gray-700 bg-blue-900/50">
            <div className="col-span-1 font-medium text-gray-200">{playerPosition}</div>
            <div className="col-span-3 font-medium truncate text-gray-200">Your Score</div>
            <div className="col-span-3 text-right text-gray-200">{score}</div>
            <div className="col-span-5 text-right text-gray-400 text-xs">Current</div>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="game-ui inset-0 flex flex-col items-center justify-center bg-gray-800/95 border border-gray-700 rounded-md p-6">
      <h2 className="text-3xl font-bold mb-6 text-red-500">High Scores</h2>
      
      <ScrollArea className="h-[300px] w-full mb-6 rounded-md border border-gray-700 bg-gray-900/50">
        <div className="p-2">
          <div className="grid grid-cols-12 font-bold text-sm px-2 py-1 bg-gray-700 rounded">
            <div className="col-span-1 text-gray-200">#</div>
            <div className="col-span-3 text-gray-200">Name</div>
            <div className="col-span-3 text-right text-gray-200">Score</div>
            <div className="col-span-5 text-right text-gray-200">Date</div>
          </div>
          
          {renderLeaderboardEntries()}
        </div>
      </ScrollArea>
      
      <Button 
        onClick={onClose}
        className="w-full px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium"
      >
        Back
      </Button>
    </div>
  );
};

export default Leaderboard;
