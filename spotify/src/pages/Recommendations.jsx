import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const Recommendations = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 16;

    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        fetchRecommendations();
        fetchFavorites();
    }, [page]);

    const fetchRecommendations = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/ai/recommendations?page=${page}&limit=${limit}`);
            if (Array.isArray(res.data)) {
                setRecommendations(res.data);
            } else {
                setRecommendations(res.data.recommendations || []);
                setTotalPages(res.data.totalPages || 1);
            }
        } catch (err) {
            console.error('Error fetching recommendations:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchFavorites = async () => {
        try {
            const res = await api.get('/users/favorites');
            // Handle pagination if favorites endpoint is called without params (it might return paginated now)
            // But for just checking IDs, we might need a different endpoint or fetch all.
            // For now, let's assume the user doesn't have thousands of favorites for this check, 
            // OR we rely on the paginated response if that's what we get.
            // Actually, we updated /favorites to be paginated. So this call will return page 1.
            // To check if a song is favorited, we ideally need the full list or check individually.
            // For simplicity in this "Mini-Spotify", we'll just use the first page or what we get.
            // A better way would be a specific "check-favorites" endpoint or sending IDs to check.
            // Let's just use what we get for now, acknowledging limitation.
            if (res.data.favorites) {
                setFavorites(res.data.favorites.map(f => f._id));
            } else if (Array.isArray(res.data)) {
                setFavorites(res.data.map(f => f._id));
            }
        } catch (err) {
            console.error('Error fetching favorites', err);
        }
    };

    const toggleFavorite = async (songId) => {
        try {
            if (favorites.includes(songId)) {
                await api.delete(`/users/favorites/${songId}`);
                setFavorites(favorites.filter(id => id !== songId));
            } else {
                await api.post(`/users/favorites/${songId}`);
                setFavorites([...favorites, songId]);
            }
        } catch (err) {
            console.error('Error toggling favorite', err);
        }
    };

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="container mx-auto p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Recommended for You</h1>
                    {recommendations.length > 0 && (
                        <div className="flex space-x-2">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(p => p - 1)}
                                className="px-3 py-1 bg-gray-200 dark:bg-gray-800 rounded disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                            >
                                Prev
                            </button>
                            <span className="px-2 py-1 text-gray-900 dark:text-white">Page {page} of {totalPages}</span>
                            <button
                                disabled={page === totalPages}
                                onClick={() => setPage(p => p + 1)}
                                className="px-3 py-1 bg-gray-200 dark:bg-gray-800 rounded disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
                <p className="text-gray-500 dark:text-gray-400 mb-8">Based on your listening history and favorites</p>

                {loading ? (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">Loading recommendations...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recommendations.map(song => (
                            <div key={song._id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg dark:hover:bg-gray-750 transition border border-gray-200 dark:border-gray-700">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{song.title}</h3>
                                        <p className="text-gray-500 dark:text-gray-400">{song.artist?.name}</p>
                                    </div>
                                    <button
                                        onClick={() => toggleFavorite(song._id)}
                                        className={`text-xl ${favorites.includes(song._id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                                    >
                                        ♥
                                    </button>
                                </div>
                                <p className="text-sm text-gray-500 mt-2">{song.genre} • {song.mood}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Recommendations;
