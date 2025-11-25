import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            const res = await api.get('/users/favorites');
            setFavorites(res.data);
        } catch (err) {
            console.error('Error fetching favorites:', err);
        }
    };

    const removeFavorite = async (songId) => {
        try {
            await api.delete(`/users/favorites/${songId}`);
            setFavorites(favorites.filter(song => song._id !== songId));
        } catch (err) {
            console.error('Error removing favorite:', err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Navbar />
            <div className="container mx-auto p-8">
                <h1 className="text-3xl font-bold mb-8">Your Favorites</h1>
                {favorites.length === 0 ? (
                    <p className="text-gray-400">You haven't added any favorites yet.</p>
                ) : (
                    <div className="bg-gray-800 rounded-lg p-6">
                        {favorites.map((song, index) => (
                            <div key={song._id} className="flex items-center justify-between p-3 hover:bg-gray-700 rounded transition group">
                                <div className="flex items-center gap-4">
                                    <span className="text-gray-400 w-6 text-right">{index + 1}</span>
                                    <div>
                                        <h3 className="text-white font-medium">{song.title}</h3>
                                        <p className="text-gray-400 text-sm">{song.artist?.name} • {song.album?.title}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <button
                                        onClick={() => removeFavorite(song._id)}
                                        className="text-xl text-green-500 hover:text-red-500"
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
