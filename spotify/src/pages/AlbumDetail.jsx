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

    // Pagination for Songs
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 15;

    useEffect(() => {
        const fetchAlbumData = async () => {
            try {
                const albumRes = await api.get(`/albums/${id}`);
                setAlbum(albumRes.data);

                const songsRes = await api.get(`/songs?albumId=${id}&page=${page}&limit=${limit}`);
                setSongs(songsRes.data.songs || []);
                setTotalPages(songsRes.data.totalPages || 1);
            } catch (err) {
                console.error('Error fetching album data:', err);
            }
        };
        fetchAlbumData();
        fetchFavorites();
    }, [id, page]);

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

    if (!album) return <div className="p-8">Loading...</div>;

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="container mx-auto p-8">
                <div className="flex flex-col md:flex-row items-center md:items-end mb-12 gap-8">
                    <img src={album.imageUrl || 'https://via.placeholder.com/300'} alt={album.title} className="w-64 h-64 object-cover rounded shadow-lg" />
                    <div>
                        <p className="uppercase text-sm font-bold text-gray-400">Album</p>
                        <h1 className="text-5xl font-bold mb-4">{album.title}</h1>
                        <p className="text-gray-600 dark:text-gray-300">
                            By <span className="font-bold text-gray-900 dark:text-white">{album.artist?.name}</span> • {album.release_year} • {songs.length} songs
                        </p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Songs</h2>
                        <div className="flex space-x-2">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(p => p - 1)}
                                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
                            >
                                Prev
                            </button>
                            <span className="px-2 py-1 text-gray-300">Page {page} of {totalPages}</span>
                            <button
                                disabled={page === totalPages}
                                onClick={() => setPage(p => p + 1)}
                                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                    {songs.map((song, index) => (
                        <div key={song._id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition group border-b border-gray-100 dark:border-gray-700 last:border-0">
                            <div className="flex items-center gap-4">
                                <span className="text-gray-400 w-6 text-right">{(page - 1) * limit + index + 1}</span>
                                <div>
                                    <h3 className="text-gray-900 dark:text-white font-medium">{song.title}</h3>
                                    <p className="text-gray-400 text-sm">{song.artist?.name}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <button
                                    onClick={() => toggleFavorite(song._id)}
                                    className={`text-xl ${favorites.includes(song._id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500 dark:text-gray-600 dark:group-hover:text-white'}`}
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
