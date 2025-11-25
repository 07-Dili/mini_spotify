import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const AlbumList = () => {
    const [albums, setAlbums] = useState([]);

    useEffect(() => {
        const fetchAlbums = async () => {
            try {
                const res = await api.get('/albums');
                setAlbums(res.data);
            } catch (err) {
                console.error('Error fetching albums:', err);
            }
        };
        fetchAlbums();
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Navbar />
            <div className="container mx-auto p-8">
                <h1 className="text-3xl font-bold mb-8">Albums</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {albums.map(album => (
                        <Link key={album._id} to={`/albums/${album._id}`} className="bg-gray-800 p-4 rounded-lg shadow hover:bg-gray-750 transition block">
                            <img src={album.cover_image} alt={album.title} className="w-full h-48 object-cover rounded mb-4" />
                            <h3 className="text-lg font-semibold">{album.title}</h3>
                            <p className="text-gray-400 text-sm">{album.artist?.name}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AlbumList;
