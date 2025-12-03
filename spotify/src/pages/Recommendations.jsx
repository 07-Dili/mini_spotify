import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Loading from '../components/Loading';

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
            const res = await api.get('/users/favorites/ids');
            setFavorites(res.data);
        } catch (err) {
            console.error('Error fetching favorites', err);
        }
    };

    const toggleFavorite = async (songId) => {
        try {
            if (favorites.includes(songId)) {
                await api.delete(`/users/favorites/${songId}`);
                setFavorites(favorites.filter(id => id !== songId));
                toast.info('Removed from favorites');
            } else {
                await api.post(`/users/favorites/${songId}`);
                setFavorites([...favorites, songId]);
                toast.success('Added to favorites!');
            }
        } catch (err) {
            console.error('Error toggling favorite', err);
            toast.error('Failed to update favorite');
        }
    };

    const navigate = useNavigate();

    if (loading) return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
            <Navbar />
            <Loading />
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendations.map(song => (
                        <div
                            key={song._id}
                            onClick={() => {
                                if (song.album?._id) {
                                    navigate(`/albums/${song.album._id}`);
                                } else {
                                    alert('This song does not belong to an album.');
                                }
                            }}
                            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg dark:hover:bg-gray-750 transition border border-gray-200 dark:border-gray-700 cursor-pointer"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{song.title}</h3>
                                    <p className="text-gray-500 dark:text-gray-400">{song.artist?.name}</p>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); toggleFavorite(song._id); }}
                                    className={`text-xl ${favorites.includes(song._id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                                >
                                    ♥
                                </button>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">{song.genre} • {song.mood}</p>
                            {song.reason && (
                                <div className="mt-4 flex justify-end">
                                    <span className="text-xs text-purple-500 dark:text-purple-400 italic bg-purple-50 dark:bg-purple-900/30 px-2 py-1 rounded">
                                        {song.reason}
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Recommendations;
