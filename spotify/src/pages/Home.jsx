import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
    const { user } = useContext(AuthContext);
    const [songs, setSongs] = useState([]);
    const [topSongs, setTopSongs] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [songsRes, topRes, recsRes] = await Promise.all([
                api.get('/songs'),
                api.get('/songs/top'),
                api.get('/ai/recommendations')
            ]);
            setSongs(songsRes.data);
            setTopSongs(topRes.data);
            setRecommendations(recsRes.data);
        } catch (err) {
            console.error('Error fetching data', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const res = await api.get(`/songs?search=${search}`);
            setSongs(res.data);
        } catch (err) {
            console.error('Error searching songs', err);
        }
    };

    const toggleFavorite = async (songId) => {
        try {
            await api.post(`/users/favorites/${songId}`);
            alert('Added to favorites!');
            // Refresh recommendations potentially
        } catch (err) {
            console.error('Error adding favorite', err);
        }
    };

    if (loading) return <div className="text-gray-900 dark:text-white p-8">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
            <Navbar />
            <div className="container mx-auto p-8">
                <h1 className="text-3xl font-bold mb-8">Welcome, {user.username}</h1>

                {/* Search Section */}
                <div className="mb-12">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <input
                            type="text"
                            placeholder="Search songs, genres..."
                            className="flex-1 p-3 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button type="submit" className="bg-green-500 px-6 py-3 rounded font-bold text-white hover:bg-green-600">Search</button>
                    </form>
                </div>

                {/* Top 10 Songs */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-400">Top 10 Trending Songs</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {topSongs.map(song => (
                            <div key={song._id} className="bg-white dark:bg-gray-800 p-4 rounded shadow hover:shadow-lg dark:hover:bg-gray-700 transition flex justify-between items-center border border-gray-200 dark:border-gray-700">
                                <div>
                                    <h3 className="font-bold">{song.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">{song.artist?.name}</p>
                                    <p className="text-xs text-gray-500">🔥 {song.popularity} popularity</p>
                                </div>
                                <button onClick={() => toggleFavorite(song._id)} className="text-gray-400 hover:text-red-500">
                                    ♥
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recommendations */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-purple-600 dark:text-purple-400">Recommended for You</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recommendations.map(song => (
                            <div key={song._id} className="bg-white dark:bg-gray-800 p-4 rounded shadow hover:shadow-lg dark:hover:bg-gray-700 transition border border-gray-200 dark:border-gray-700">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-bold">{song.title}</h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">{song.artist?.name}</p>
                                    </div>
                                    <button onClick={() => toggleFavorite(song._id)} className="text-gray-400 hover:text-red-500">
                                        ♥
                                    </button>
                                </div>
                                <p className="text-xs text-purple-500 dark:text-purple-300 mt-2 italic">"{song.reason}"</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* All Songs List */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">All Songs</h2>
                    <div className="space-y-2">
                        {songs.map(song => (
                            <div key={song._id} className="bg-white dark:bg-gray-800 p-3 rounded flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-750 border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded mr-4 flex items-center justify-center text-xs text-gray-600 dark:text-gray-300">IMG</div>
                                    <div>
                                        <p className="font-semibold">{song.title}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{song.artist?.name} • {song.album?.title}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs text-gray-500">{Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}</span>
                                    <button onClick={() => toggleFavorite(song._id)} className="text-gray-400 hover:text-red-500">
                                        ♥
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
