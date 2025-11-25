import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
    const [songs, setSongs] = useState([]);
    const [search, setSearch] = useState('');
    const { user } = useContext(AuthContext);
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        fetchSongs();
        fetchFavorites();
    }, [search]);

    const fetchSongs = async () => {
        try {
            const res = await api.get(`/songs?search=${search}`);
            setSongs(res.data);
        } catch (err) {
            console.error('Error fetching songs:', err);
        }
    };

    const fetchFavorites = async () => {
        try {
            const res = await api.get('/users/favorites');
            setFavorites(res.data.map(f => f._id));
        } catch (err) {
            console.error('Error fetching favorites:', err);
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
            console.error('Error toggling favorite:', err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Navbar />
            <div className="container mx-auto p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Discover Music</h1>
                    <input
                        type="text"
                        placeholder="Search songs or genres..."
                        className="p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-green-500 w-64"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {songs.map(song => (
                        <div key={song._id} className="bg-gray-800 p-4 rounded-lg shadow hover:bg-gray-750 transition">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-semibold">{song.title}</h3>
                                    <p className="text-gray-400">{song.artist?.name} • {song.album?.title}</p>
                                    <p className="text-sm text-gray-500 mt-1">{song.genre} • {song.mood}</p>
                                </div>
                                <button
                                    onClick={() => toggleFavorite(song._id)}
                                    className={`text-2xl ${favorites.includes(song._id) ? 'text-green-500' : 'text-gray-600 hover:text-green-500'}`}
                                >
                                    ♥
                                </button>
                            </div>
                            <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                                <span>{Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
