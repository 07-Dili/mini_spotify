import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { Link, useSearchParams } from 'react-router-dom';

const ArtistList = () => {
    const [artists, setArtists] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 16;

    const [searchParams] = useSearchParams();
    const search = searchParams.get('search') || '';

    useEffect(() => {
        setPage(1);
    }, [search]);

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                const res = await api.get(`/artists?page=${page}&limit=${limit}&search=${search}`);
                setArtists(res.data.artists || []);
                setTotalPages(res.data.totalPages || 1);
            } catch (err) {
                console.error('Error fetching artists:', err);
            }
        };
        fetchArtists();
    }, [page, search]);

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="container mx-auto p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Artists</h1>
                    <div className="flex space-x-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="px-3 py-1 bg-gray-200 dark:bg-gray-800 rounded disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-700"
                        >
                            Prev
                        </button>
                        <span className="px-2 py-1">Page {page} of {totalPages}</span>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(p => p + 1)}
                            className="px-3 py-1 bg-gray-200 dark:bg-gray-800 rounded disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-700"
                        >
                            Next
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {artists.length === 0 ? (
                        <p className="col-span-full text-center text-gray-500 py-8">No artists found.</p>
                    ) : (
                        artists.map(artist => (
                            <Link key={artist._id} to={`/artists/${artist._id}`} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg dark:hover:bg-gray-750 transition block border border-gray-200 dark:border-gray-700">
                                <img src={artist.imageUrl || 'https://via.placeholder.com/150'} alt={artist.name} className="h-40 w-40 object-cover rounded-full mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-center">{artist.name}</h3>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ArtistList;
