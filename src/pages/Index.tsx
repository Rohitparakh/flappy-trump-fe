
import React from 'react';
import Game from '@/components/Game';
import { Toaster } from '@/components/ui/toaster';
import { Link } from 'react-router-dom';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 py-8">
      <h1 className="text-4xl font-bold text-center mb-6 text-red-500" style={{ 
        textShadow: '2px 2px 0 #000',
        fontFamily: '"Courier New", monospace',
      }}>Flappy Trump</h1>
      
      <div className="w-full max-w-md relative">
        <div className="absolute inset-0 -m-2 rounded-lg bg-gradient-to-br from-red-500/20 to-blue-500/20 blur"></div>
        <div className="relative">
          <Game />
        </div>
      </div>
      
      <div className="text-center mt-8 text-gray-300 text-sm">
        <p>Use SPACE key or click to flap wings</p>
        <p className="mt-1">© 2025 Flappy Trump</p>
        <Link to ="/admin"className="mt-5">Admin Panel</Link>
      </div>
      
      <Toaster />
    </div>
  );
};

export default Index;
