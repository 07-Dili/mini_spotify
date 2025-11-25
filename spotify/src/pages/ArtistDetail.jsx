import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { useParams, Link } from 'react-router-dom';

const ArtistDetail = () => {
    const { id } = useParams();
    const [artist, setArtist] = useState(null);
    const [albums, setAlbums] = useState([]);

    useEffect(() => {
        const fetchArtistData = async () => {
            try {
                const artistRes = await api.get(`/artists/${id}`);
                setArtist(artistRes.data);

                const albumsRes = await api.get(`/albums?artistId=${id}`);
                setAlbums(albumsRes.data);
            } catch (err) {
                console.error('Error fetching artist data:', err);
            }
        };
        fetchArtistData();
    }, [id]);

    if (!artist) return <div className="text-white p-8">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Navbar />
            <div className="container mx-auto p-8">
                <div className="mb-12 text-center">
                    <div className="h-48 w-48 bg-gray-700 rounded-full mx-auto mb-6 flex items-center justify-center text-6xl font-bold text-gray-500">
                        {artist.name[0]}
                    </div>
                    <h1 className="text-4xl font-bold mb-4">{artist.name}</h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">{artist.bio}</p>
                </div>

                <h2 className="text-2xl font-bold mb-6">Albums</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {albums.map(album => (
                        <Link key={album._id} to={`/albums/${album._id}`} className="bg-gray-800 p-4 rounded-lg shadow hover:bg-gray-750 transition block">
                            <img src={album.cover_image} alt={album.title} className="w-full h-48 object-cover rounded mb-4" />
                            <h3 className="text-lg font-semibold">{album.title}</h3>
                            <p className="text-gray-400 text-sm">{album.release_year}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ArtistDetail;
