import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Loading from '../components/Loading';
import { useParams, Link } from 'react-router-dom';

const ArtistDetail = () => {
    const { id } = useParams();
    const [artist, setArtist] = useState(null);
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);

    // Pagination for Albums
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 16;

    useEffect(() => {
        const fetchArtistData = async () => {
            setLoading(true);
            try {
                const artistRes = await api.get(`/artists/${id}`);
                setArtist(artistRes.data);

                const albumsRes = await api.get(`/albums?artistId=${id}&page=${page}&limit=${limit}`);
                setAlbums(albumsRes.data.albums || []);
                setTotalPages(albumsRes.data.totalPages || 1);
            } catch (err) {
                console.error('Error fetching artist data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchArtistData();
    }, [id, page]);

    if (loading) return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
            <Navbar />
            <Loading />
        </div>
    );

    if (!artist) return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
            <Navbar />
            <div className="p-8 text-center text-gray-500">Artist not found.</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
            <Navbar />
            <div className="container mx-auto p-8">
                <div className="mb-12 text-center">
                    <img src={artist.imageUrl || 'https://via.placeholder.com/150'} alt={artist.name} className="h-48 w-48 object-cover rounded-full mx-auto mb-6" />
                    <h1 className="text-4xl font-bold mb-4">{artist.name}</h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">{artist.bio}</p>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Albums</h2>
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
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {albums.map(album => (
                        <Link key={album._id} to={`/albums/${album._id}`} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg dark:hover:bg-gray-750 transition block border border-gray-200 dark:border-gray-700">
                            <img src={album.imageUrl || 'https://via.placeholder.com/300'} alt={album.title} className="w-full h-48 object-cover rounded mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{album.title}</h3>
                            <p className="text-gray-400 text-sm">{album.release_year}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ArtistDetail;
