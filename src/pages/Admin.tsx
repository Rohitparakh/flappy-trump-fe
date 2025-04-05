import React, { useEffect, useState } from 'react';
import { useGameStore, LeaderboardEntry, API_BASE_URL } from '@/lib/gameStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Toaster } from '@/components/ui/toaster';
import { ArrowLeft, Download, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const Admin: React.FC = () => {
  const { leaderboard: localLeaderboard } = useGameStore();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const getLeaderboard = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/scores`);
        if (response.ok) {
          const cloudEntries: LeaderboardEntry[] = await response.json();

          // Merge cloud + local (remove duplicates)
          const merged = [...cloudEntries];
          localLeaderboard.forEach(localEntry => {
            if (!merged.some(e => e.id === localEntry.id)) {
              merged.push(localEntry);
            }
          });

          const sorted = merged.sort((a, b) => b.score - a.score);
          setLeaderboard(sorted);
        }
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
      }
    };

    getLeaderboard();
  }, [localLeaderboard]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'tariff2024') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid password');
    }
  };

  const filteredEntries = leaderboard.filter((entry) =>
    entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (entry.telegramUsername && entry.telegramUsername.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const exportData = () => {
    const jsonString = JSON.stringify(leaderboard, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = 'flappy_trump_leaderboard.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="bg-gray-800 border border-gray-700 p-8 rounded-lg shadow-xl w-full max-w-md">
          <h1 className="text-2xl font-bold text-white mb-6">Admin Authentication</h1>
          <form onSubmit={handleAdminLogin}>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm text-gray-300 mb-1">
                Admin Password
              </label>
              <Input
                id="password"
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full bg-gray-700 border-gray-600 text-white"
                placeholder="Enter admin password"
              />
            </div>
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
              Login
            </Button>
          </form>
          <div className="mt-6 text-center">
            <Link to="/" className="text-blue-400 hover:underline flex items-center justify-center gap-2">
              <ArrowLeft size={16} />
              Back to Game
            </Link>
          </div>
        </div>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Flappy Trump Admin Panel</h1>
          <Link to="/">
            <Button variant="secondary" className=" !text-blue-400 border-gray-600 text-white hover:bg-gray-700">
              <ArrowLeft size={16} className="mr-2" /> Back to Game
            </Button>
          </Link>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or telegram..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={exportData} className="bg-blue-600 hover:bg-blue-700">
                <Download size={16} className="mr-2" /> Export Data
              </Button>
            </div>
          </div>

          <div className="rounded-md border border-gray-700">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-700 hover:bg-gray-700">
                  <TableHead className="text-gray-300">#</TableHead>
                  <TableHead className="text-gray-300">Name</TableHead>
                  <TableHead className="text-gray-300">Score</TableHead>
                  <TableHead className="text-gray-300">Telegram</TableHead>
                  <TableHead className="text-gray-300">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.length > 0 ? (
                  filteredEntries.map((entry, index) => (
                    <TableRow key={entry.id} className="border-gray-700 hover:bg-gray-700/50">
                      <TableCell className="text-gray-300">{index + 1}</TableCell>
                      <TableCell className="font-medium text-gray-300">{entry.name}</TableCell>
                      <TableCell className="text-gray-300">{entry.score}</TableCell>
                      <TableCell className="text-gray-300">
                        {entry.telegramUsername || 'N/A'}
                      </TableCell>
                      <TableCell className="text-gray-300">{formatDate(entry.createdAt)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-400">
                      No records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-6">
          <h2 className="text-xl font-bold mb-4 text-white">Stats Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-sm text-gray-400 mb-1">Total Players</h3>
              <p className="text-2xl font-bold text-white">{leaderboard.length}</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-sm text-gray-400 mb-1">Average Score</h3>
              <p className="text-2xl font-bold text-white">
                {leaderboard.length > 0
                  ? Math.round(leaderboard.reduce((sum, entry) => sum + entry.score, 0) / leaderboard.length)
                  : 0}
              </p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-sm text-gray-400 mb-1">Highest Score</h3>
              <p className="text-2xl font-bold text-white">
                {leaderboard.length > 0
                  ? leaderboard.reduce((max, entry) => Math.max(max, entry.score), 0)
                  : 0}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Admin;
