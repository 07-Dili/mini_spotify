import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 16;

    useEffect(() => {
        fetchFavorites();
    }, [page]);

    const fetchFavorites = async () => {
        try {
            const res = await api.get(`/users/favorites?page=${page}&limit=${limit}`);
            if (Array.isArray(res.data)) {
                setFavorites(res.data);
            } else {
                const newFavorites = res.data.favorites || [];
                setFavorites(newFavorites);
                setTotalPages(res.data.totalPages || 1);

                // If current page is empty and we are not on page 1, go back
                if (newFavorites.length === 0 && page > 1) {
                    setPage(prev => prev - 1);
                }
            }
        } catch (err) {
            console.error('Error fetching favorites:', err);
        }
    };

    const removeFavorite = async (songId) => {
        try {
            // Optimistic update to remove immediately
            setFavorites(prev => prev.filter(song => song._id !== songId));

            await api.delete(`/users/favorites/${songId}`);

            // Refetch to fill the gap from next page
            fetchFavorites();
        } catch (err) {
            console.error('Error removing favorite:', err);
            fetchFavorites(); // Revert/Refresh on error
        }
    };

    const navigate = useNavigate();

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="container mx-auto p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Your Favorites</h1>
                    {favorites.length > 0 && (
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

                {favorites.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400">You haven't added any favorites yet.</p>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                        {favorites.map((song, index) => (
                            <div
                                key={song._id}
                                onClick={() => {
                                    if (song.album?._id) {
                                        navigate(`/albums/${song.album._id}`);
                                    } else {
                                        // Alert if toast is not available, or just do nothing
                                        alert('This song does not belong to an album.');
                                    }
                                }}
                                className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition group border-b border-gray-100 dark:border-gray-700 last:border-0 cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <span className="text-gray-400 w-6 text-right">{(page - 1) * limit + index + 1}</span>
                                    <div>
                                        <h3 className="text-gray-900 dark:text-white font-medium">{song.title}</h3>
                                        <p className="text-gray-400 text-sm">{song.artist?.name} • {song.album?.title}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); removeFavorite(song._id); }}
                                        className="text-xl text-red-500 hover:text-gray-400"
                                    >
                                        ♥
                                    </button>
                                    <span className="text-gray-400 text-sm">
                                        {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Favorites;
