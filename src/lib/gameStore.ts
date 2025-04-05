
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  createdAt: string;
  telegramUsername: string;
  deviceId?: string;
}

export const BACKEND_API_URL = "https://api.jsonbin.io/v3/b/";
export const JSONBIN_API_KEY = "$2b$10$EaNcibE4SEpAZJvSCUYnw.OQDnMjnvhbop3rq4.D25u1.F/Z175um";
export const COLLECTION_ID = "65e08616dc74654018a83435";
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


interface GameState {
  gameStarted: boolean;
  gameOver: boolean;
  score: number;
  highScore: number;
  gravity: number;
  birdPosition: { x: number; y: number };
  pipes: Array<{ x: number; height: number; passed: boolean }>;
  leaderboard: LeaderboardEntry[];
  showSpeechBubble: boolean;
  speechBubbleText: string;
  deviceId: string;
  isLoadingScores: boolean;
  
  // Actions
  startGame: () => void;
  restartGame: () => void;
  endGame: () => void;
  updateBirdPosition: (velocity: number) => void;
  addPipe: () => void;
  movePipes: () => void;
  incrementScore: () => void;
  addLeaderboardEntry: (name: string, telegramUsername: string) => void;
  resetGame: () => void;
  fetchLeaderboard: () => Promise<void>;
}

const INITIAL_BIRD_POSITION = { x: 50, y: 250 };
const PIPE_GAP = 150;
const PIPE_WIDTH = 60;
const GAME_WIDTH = 320;
const GAME_HEIGHT = 600;
const GROUND_HEIGHT = 64;

// Generate a random speech bubble text
const getRandomSpeechBubble = () => {
  const texts = ["LFG", "Pump it!", "Kill gay's", "No tariff's"];
  return texts[Math.floor(Math.random() * texts.length)];
};

// Generate a unique device ID if not exists
const getDeviceId = () => {
  const existingId = localStorage.getItem('flappy_trump_device_id');
  if (existingId) return existingId;
  
  const newId = nanoid();
  localStorage.setItem('flappy_trump_device_id', newId);
  return newId;
};


export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      gameStarted: false,
      gameOver: false,
      score: 0,
      highScore: 0,
      gravity: 0.6,
      birdPosition: INITIAL_BIRD_POSITION,
      pipes: [],
      leaderboard: [],
      showSpeechBubble: false,
      speechBubbleText: "",
      deviceId: getDeviceId(),
      isLoadingScores: false,
      
      startGame: () => {
        set({
          gameStarted: true,
          gameOver: false,
          score: 0,
          birdPosition: INITIAL_BIRD_POSITION,
          pipes: [],
          showSpeechBubble: false,
        });
      },
      
      restartGame: () => {
        set({
          gameStarted: true,
          gameOver: false,
          score: 0,
          birdPosition: INITIAL_BIRD_POSITION,
          pipes: [],
          showSpeechBubble: false,
        });
      },
      
      endGame: () => {
        const currentScore = get().score;
        const currentHighScore = get().highScore;
        
        set({
          gameOver: true,
          gameStarted: false,
          highScore: Math.max(currentScore, currentHighScore),
        });
      },
      
      updateBirdPosition: (velocity) => {
        const { birdPosition, gravity, gameOver } = get();
        
        if (gameOver) return;
        
        let newY = birdPosition.y + velocity + gravity;
        
        if (newY > GAME_HEIGHT - GROUND_HEIGHT - 25) {
          newY = GAME_HEIGHT - GROUND_HEIGHT - 25;
          get().endGame();
        }
        
        if (newY < 0) {
          newY = 0;
        }
        
        set({
          birdPosition: {
            ...birdPosition,
            y: newY,
          },
        });
      },
      
      addPipe: () => {
        const { pipes } = get();
        const height = Math.floor(Math.random() * (GAME_HEIGHT - PIPE_GAP - GROUND_HEIGHT - 100)) + 50;
        
        set({
          pipes: [
            ...pipes,
            {
              x: GAME_WIDTH,
              height,
              passed: false,
            },
          ],
        });
      },
      
      movePipes: () => {
        const { pipes, birdPosition, gameOver } = get();
        
        if (gameOver) return;
        
        const updatedPipes = pipes
          .map((pipe) => {
            const newX = pipe.x - 2;
            
            let passed = pipe.passed;
            if (!passed && newX + PIPE_WIDTH < birdPosition.x) {
              passed = true;
              get().incrementScore();
            }
            
            const birdRight = birdPosition.x + 25;
            const birdLeft = birdPosition.x;
            const birdTop = birdPosition.y;
            const birdBottom = birdPosition.y + 25;
            
            const pipeLeft = newX;
            const pipeRight = newX + PIPE_WIDTH;
            const topPipeBottom = pipe.height;
            const bottomPipeTop = pipe.height + PIPE_GAP;
            
            if (
              birdRight > pipeLeft &&
              birdLeft < pipeRight &&
              (birdTop < topPipeBottom || birdBottom > bottomPipeTop)
            ) {
              get().endGame();
            }
            
            return {
              ...pipe,
              x: newX,
              passed,
            };
          })
          .filter((pipe) => pipe.x > -PIPE_WIDTH);
        
        set({ pipes: updatedPipes });
      },
      
      incrementScore: () => {
        set((state) => {
          const newScore = state.score + 1;
          
          // Show speech bubble every 4 points
          if (newScore % 4 === 0) {
            return {
              score: newScore,
              showSpeechBubble: true,
              speechBubbleText: getRandomSpeechBubble()
            };
          }
          
          return { score: newScore, showSpeechBubble: false };
        });
        
        // Hide the speech bubble after 2 seconds
        if (get().showSpeechBubble) {
          setTimeout(() => {
            set({ showSpeechBubble: false });
          }, 2000);
        }
      },
      
      addLeaderboardEntry: async (name, telegramUsername) => {
        const { score, deviceId, leaderboard } = get();
        
        const newEntry: LeaderboardEntry = {
          id: nanoid(),
          name,
          score,
          createdAt: new Date().toISOString(),
          telegramUsername,
          deviceId
        };
        
        // Add to local leaderboard
        const updatedLeaderboard = [...leaderboard, newEntry]
          .sort((a, b) => b.score - a.score);
        
        set({ leaderboard: updatedLeaderboard });
       
        
        try {
          const response = await fetch(`${API_BASE_URL}/scores}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ entries: updatedLeaderboard }),
          });
      
          if (!response.ok) {
            console.error('Failed to save leaderboard to MongoDB');
          }
        } catch (error) {
          console.error('Error saving to MongoDB:', error);
        }
        // Send to cloud storage
        // try {
        //   const response = await fetch(`${BACKEND_API_URL}${COLLECTION_ID}`, {
        //     method: 'PUT',
        //     headers: {
        //       'Content-Type': 'application/json',
        //       'X-Master-Key': JSONBIN_API_KEY,
        //     },
        //     body: JSON.stringify({ entries: updatedLeaderboard })
        //   });
          
        //   if (!response.ok) {
        //     console.error('Failed to save leaderboard to cloud storage');
        //   }
        // } catch (error) {
        //   console.error('Error saving to cloud storage:', error);
        // }
      },
      
      resetGame: () => {
        set({
          gameStarted: false,
          gameOver: false,
          score: 0,
          birdPosition: INITIAL_BIRD_POSITION,
          pipes: [],
          showSpeechBubble: false,
        });
      },

      fetchLeaderboard: async () => {
        set({ isLoadingScores: true });
      
        try {
          const response = await fetch(`${API_BASE_URL}/scores`);
      
          if (response.ok) {
            const cloudEntries = await response.json();
            const localEntries = get().leaderboard;
      
            // Merge and deduplicate
            const mergedEntries = [...cloudEntries];
      
            localEntries.forEach(localEntry => {
              if (!mergedEntries.some(e => e.id === localEntry.id)) {
                mergedEntries.push(localEntry);
              }
            });
      
            const sortedEntries = mergedEntries.sort((a, b) => b.score - a.score);
      
            set({ leaderboard: sortedEntries });
          }
        } catch (error) {
          console.error('Error fetching leaderboard from MongoDB:', error);
        } finally {
          set({ isLoadingScores: false });
        }
      }
      
      
      // fetchLeaderboard: async () => {
      //   set({ isLoadingScores: true });
        
      //   try {
      //     const response = await fetch(`${BACKEND_API_URL}${COLLECTION_ID}/latest`, {
      //       headers: {
      //         'X-Master-Key': JSONBIN_API_KEY,
      //       }
      //     });
          
      //     if (response.ok) {
      //       const data = await response.json();
      //       if (data.record && Array.isArray(data.record.entries)) {
      //         // Merge cloud leaderboard with local entries
      //         const cloudEntries = data.record.entries;
      //         const localEntries = get().leaderboard;
              
      //         // Combine and deduplicate by ID
      //         const mergedEntries = [...cloudEntries];
              
      //         // Add any local entries that aren't already in cloud data
      //         localEntries.forEach(localEntry => {
      //           if (!mergedEntries.some(e => e.id === localEntry.id)) {
      //             mergedEntries.push(localEntry);
      //           }
      //         });
              
      //         // Sort by score
      //         const sortedEntries = mergedEntries.sort((a, b) => b.score - a.score);
              
      //         set({ leaderboard: sortedEntries });
      //       }
      //     }
      //   } catch (error) {
      //     console.error('Error fetching leaderboard:', error);
      //   } finally {
      //     set({ isLoadingScores: false });
      //   }
      // }
    }),
    {
      name: 'flappy-bird-storage',
      partialize: (state) => ({
        highScore: state.highScore,
        // leaderboard: state.leaderboard,
        // deviceId: state.deviceId
      }),
    }
  )
);
