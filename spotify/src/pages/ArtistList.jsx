import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const ArtistList = () => {
    const [artists, setArtists] = useState([]);

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                const res = await api.get('/artists');
                setArtists(res.data);
            } catch (err) {
                console.error('Error fetching artists:', err);
            }
        };
        fetchArtists();
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Navbar />
            <div className="container mx-auto p-8">
                <h1 className="text-3xl font-bold mb-8">Artists</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {artists.map(artist => (
                        <Link key={artist._id} to={`/artists/${artist._id}`} className="bg-gray-800 p-6 rounded-lg shadow hover:bg-gray-750 transition block">
                            <div className="h-40 w-40 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl font-bold text-gray-500">
                                {artist.name[0]}
                            </div>
                            <h3 className="text-xl font-semibold text-center">{artist.name}</h3>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ArtistList;
