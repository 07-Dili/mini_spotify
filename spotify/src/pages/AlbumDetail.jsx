import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AlbumDetail = () => {
    const { id } = useParams();
    const [album, setAlbum] = useState(null);
    const [songs, setSongs] = useState([]);
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const fetchAlbumData = async () => {
            try {
                const albumRes = await api.get(`/albums/${id}`);
                setAlbum(albumRes.data);

                const songsRes = await api.get(`/songs?albumId=${id}`);
                setSongs(songsRes.data);
            } catch (err) {
                console.error('Error fetching album data:', err);
            }
        };
        fetchAlbumData();
        fetchFavorites();
    }, [id]);

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

    if (!album) return <div className="text-white p-8">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Navbar />
            <div className="container mx-auto p-8">
                <div className="flex flex-col md:flex-row items-center md:items-end mb-12 gap-8">
                    <img src={album.cover_image} alt={album.title} className="w-64 h-64 object-cover rounded shadow-lg" />
                    <div>
                        <p className="uppercase text-sm font-bold text-gray-400">Album</p>
                        <h1 className="text-5xl font-bold mb-4">{album.title}</h1>
                        <p className="text-gray-300">
                            By <span className="font-bold text-white">{album.artist?.name}</span> • {album.release_year} • {songs.length} songs
                        </p>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6">
                    {songs.map((song, index) => (
                        <div key={song._id} className="flex items-center justify-between p-3 hover:bg-gray-700 rounded transition group">
                            <div className="flex items-center gap-4">
                                <span className="text-gray-400 w-6 text-right">{index + 1}</span>
                                <div>
                                    <h3 className="text-white font-medium">{song.title}</h3>
                                    <p className="text-gray-400 text-sm">{song.artist?.name}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <button
                                    onClick={() => toggleFavorite(song._id)}
                                    className={`text-xl ${favorites.includes(song._id) ? 'text-green-500' : 'text-gray-600 group-hover:text-white'}`}
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
            </div>
        </div>
    );
};

export default AlbumDetail;
