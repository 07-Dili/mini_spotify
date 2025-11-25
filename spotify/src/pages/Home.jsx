import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';

import { useSearchParams } from 'react-router-dom';

const Home = () => {
    const { user } = useContext(AuthContext);
    const [songs, setSongs] = useState([]);
    const [topSongs, setTopSongs] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    // const [search, setSearch] = useState(''); // Removed local state
    const [loading, setLoading] = useState(true);

    const [searchParams] = useSearchParams();
    const search = searchParams.get('search') || '';

    // Pagination State
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 16;

    useEffect(() => {
        setPage(1);
    }, [search]);

    useEffect(() => {
        fetchData();
    }, [page, search]); // Re-fetch when page or search changes

    const fetchData = async () => {
        try {
            const [songsRes, topRes] = await Promise.all([
                api.get(`/songs?search=${search}&page=${page}&limit=${limit}`),
                api.get('/songs/top')
            ]);
            setSongs(songsRes.data.songs || []);
            setTotalPages(songsRes.data.totalPages || 1);
            setTopSongs(topRes.data);

            // Fetch recommendations separately
            fetchRecommendations();
        } catch (err) {
            console.error('Error fetching data', err);
        } finally {
            setLoading(false);
        }
    };

    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            const res = await api.get('/users/favorites');
            // Handle favorites response (array or object)
            if (Array.isArray(res.data)) {
                setFavorites(res.data.map(f => f._id));
            } else {
                setFavorites((res.data.favorites || []).map(f => f._id));
            }
        } catch (err) {
            console.error('Error fetching favorites', err);
        }
    };

    const fetchRecommendations = async () => {
        try {
            const recsRes = await api.get('/ai/recommendations');
            if (Array.isArray(recsRes.data)) {
                setRecommendations(recsRes.data);
            } else {
                setRecommendations(recsRes.data.recommendations || []);
            }
        } catch (err) {
            console.error('Error fetching recommendations', err);
        }
    };

    const toggleFavorite = async (songId) => {
        try {
            let isAdding = false;
            if (favorites.includes(songId)) {
                await api.delete(`/users/favorites/${songId}`);
                setFavorites(favorites.filter(id => id !== songId));
                toast.info('Removed from favorites');
            } else {
                await api.post(`/users/favorites/${songId}`);
                setFavorites([...favorites, songId]);
                toast.success('Added to favorites!');
                isAdding = true;
            }

            // Helper to update popularity in a list
            const updateList = (list) => list.map(song => {
                if (song._id === songId) {
                    return { ...song, popularity: song.popularity + (isAdding ? 1 : -1) };
                }
                return song;
            });

            setTopSongs(prev => updateList(prev));
            setSongs(prev => updateList(prev));

            // Re-fetch recommendations to reflect new favorites
            fetchRecommendations();

        } catch (err) {
            console.error('Error toggling favorite', err);
            toast.error('Failed to update favorite');
        }
    };

    if (loading) return <div className="text-gray-900 dark:text-white p-8">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
            <Navbar />
            <div className="container mx-auto p-8">
                <h1 className="text-3xl font-bold mb-8">Welcome, {user.username}</h1>

                {/* Search Section */}
                {/* Search Section Removed - Moved to Navbar */}

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
                                <button onClick={() => toggleFavorite(song._id)} className={`text-xl ${favorites.includes(song._id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}>
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
                                    <button onClick={() => toggleFavorite(song._id)} className={`text-xl ${favorites.includes(song._id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}>
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
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">All Songs</h2>
                        <div className="flex space-x-2">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(p => p - 1)}
                                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
                            >
                                Prev
                            </button>
                            <span className="px-2 py-1">Page {page} of {totalPages}</span>
                            <button
                                disabled={page === totalPages}
                                onClick={() => setPage(p => p + 1)}
                                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {songs.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No results found.</p>
                        ) : (
                            songs.map(song => (
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
                                        <button onClick={() => toggleFavorite(song._id)} className={`text-xl ${favorites.includes(song._id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}>
                                            ♥
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
