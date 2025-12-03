import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Loading from '../components/Loading';
import { Link, useSearchParams } from 'react-router-dom';

const AlbumList = () => {
    const [albums, setAlbums] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const limit = 16;

    const [searchParams] = useSearchParams();
    const search = searchParams.get('search') || '';

    useEffect(() => {
        setPage(1);
    }, [search]);

    useEffect(() => {
        const fetchAlbums = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/albums?page=${page}&limit=${limit}&search=${search}`);
                setAlbums(res.data.albums || []);
                setTotalPages(res.data.totalPages || 1);
            } catch (err) {
                console.error('Error fetching albums:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAlbums();
    }, [page, search]);

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
                    <h1 className="text-3xl font-bold">Albums</h1>
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
                    {albums.length === 0 ? (
                        <p className="col-span-full text-center text-gray-500 py-8">No albums found.</p>
                    ) : (
                        albums.map(album => (
                            <Link key={album._id} to={`/albums/${album._id}`} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg dark:hover:bg-gray-750 transition block border border-gray-200 dark:border-gray-700">
                                <img src={album.imageUrl || 'https://via.placeholder.com/300'} alt={album.title} className="w-full h-48 object-cover rounded mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{album.title}</h3>
                                <p className="text-gray-400 text-sm">{album.artist?.name}</p>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AlbumList;
