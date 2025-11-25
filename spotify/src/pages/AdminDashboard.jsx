import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('artists');

    // Pagination State
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 5; // Items per page

    // Data State
    const [listData, setListData] = useState([]); // Paginated data for list view
    const [allArtists, setAllArtists] = useState([]); // All artists for dropdowns
    const [allAlbums, setAllAlbums] = useState([]); // All albums for dropdowns

    // Form States
    const [artistForm, setArtistForm] = useState({ name: '', bio: '', imageUrl: '' });
    const [albumForm, setAlbumForm] = useState({ title: '', artistId: '', release_year: '', imageUrl: '' });
    const [songForm, setSongForm] = useState({ title: '', duration: '', genre: '', mood: '', language: '', albumId: '', artistId: '' });

    useEffect(() => {
        fetchListData();
        fetchDropdownData();
    }, [activeTab, page]);

    const fetchListData = async () => {
        try {
            let res;
            if (activeTab === 'artists') res = await api.get(`/artists?page=${page}&limit=${limit}`);
            else if (activeTab === 'albums') res = await api.get(`/albums?page=${page}&limit=${limit}`);
            else if (activeTab === 'songs') res = await api.get(`/songs?page=${page}&limit=${limit}`);

            if (res.data) {
                // Backend returns { artists: [], totalPages: ... } etc.
                // We need to normalize this
                const dataKey = activeTab; // 'artists', 'albums', 'songs'
                setListData(res.data[dataKey]);
                setTotalPages(res.data.totalPages);
            }
        } catch (err) {
            console.error('Error fetching list data', err);
        }
    };

    const fetchDropdownData = async () => {
        // Only needed for forms
        try {
            const [artistsRes, albumsRes] = await Promise.all([
                api.get('/artists?limit=1000'), // Fetch all (or many) for dropdowns
                api.get('/albums?limit=1000')
            ]);
            setAllArtists(artistsRes.data.artists);
            setAllAlbums(albumsRes.data.albums);
        } catch (err) {
            console.error('Error fetching dropdown data', err);
        }
    };

    const handleCreateArtist = async (e) => {
        e.preventDefault();
        try {
            await api.post('/artists', artistForm);
            toast.success('Artist created successfully');
            setArtistForm({ name: '', bio: '', imageUrl: '' });
            fetchListData();
            fetchDropdownData();
        } catch (err) {
            toast.error('Failed to create artist');
        }
    };

    const handleCreateAlbum = async (e) => {
        e.preventDefault();
        try {
            await api.post('/albums', albumForm);
            toast.success('Album created successfully');
            setAlbumForm({ title: '', artistId: '', release_year: '', imageUrl: '' });
            fetchListData();
            fetchDropdownData();
        } catch (err) {
            toast.error('Failed to create album');
        }
    };

    const handleCreateSong = async (e) => {
        e.preventDefault();
        try {
            await api.post('/songs', songForm);
            toast.success('Song created successfully');
            setSongForm({ title: '', duration: '', genre: '', mood: '', language: '', albumId: '', artistId: '' });
            fetchListData();
        } catch (err) {
            toast.error('Failed to create song');
        }
    };

    const handleDeleteArtist = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await api.delete(`/artists/${id}`);
            toast.success('Artist deleted');
            fetchListData();
            fetchDropdownData();
        } catch (err) {
            toast.error('Failed to delete artist');
        }
    };

    const handleDeleteAlbum = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await api.delete(`/albums/${id}`);
            toast.success('Album deleted');
            fetchListData();
            fetchDropdownData();
        } catch (err) {
            toast.error('Failed to delete album');
        }
    };

    const handleDeleteSong = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await api.delete(`/songs/${id}`);
            toast.success('Song deleted');
            fetchListData();
        } catch (err) {
            toast.error('Failed to delete song');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
            <Navbar />
            <div className="container mx-auto p-8">
                <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

                {/* Tabs */}
                <div className="flex space-x-4 mb-8 border-b border-gray-700 pb-4">
                    {['artists', 'albums', 'songs'].map(tab => (
                        <button
                            key={tab}
                            className={`px-4 py-2 rounded ${activeTab === tab ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-800'}`}
                            onClick={() => { setActiveTab(tab); setPage(1); }}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Section */}
                    <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded shadow h-fit">
                        <h2 className="text-xl font-bold mb-4">Create New</h2>

                        {activeTab === 'artists' && (
                            <form onSubmit={handleCreateArtist} className="space-y-4">
                                <input className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600" placeholder="Name" value={artistForm.name} onChange={e => setArtistForm({ ...artistForm, name: e.target.value })} required />
                                <input className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600" placeholder="Bio" value={artistForm.bio} onChange={e => setArtistForm({ ...artistForm, bio: e.target.value })} />
                                <input className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600" placeholder="Image URL" value={artistForm.imageUrl} onChange={e => setArtistForm({ ...artistForm, imageUrl: e.target.value })} />
                                <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">Create Artist</button>
                            </form>
                        )}

                        {activeTab === 'albums' && (
                            <form onSubmit={handleCreateAlbum} className="space-y-4">
                                <input className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600" placeholder="Title" value={albumForm.title} onChange={e => setAlbumForm({ ...albumForm, title: e.target.value })} required />
                                <select className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600" value={albumForm.artistId} onChange={e => setAlbumForm({ ...albumForm, artistId: e.target.value })} required>
                                    <option value="">Select Artist</option>
                                    {allArtists.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
                                </select>
                                <input className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600" placeholder="Year" type="number" value={albumForm.release_year} onChange={e => setAlbumForm({ ...albumForm, release_year: e.target.value })} />
                                <input className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600" placeholder="Cover Image URL" value={albumForm.imageUrl} onChange={e => setAlbumForm({ ...albumForm, imageUrl: e.target.value })} />
                                <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">Create Album</button>
                            </form>
                        )}

                        {activeTab === 'songs' && (
                            <form onSubmit={handleCreateSong} className="space-y-4">
                                <input className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600" placeholder="Title" value={songForm.title} onChange={e => setSongForm({ ...songForm, title: e.target.value })} required />
                                <input className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600" placeholder="Duration (sec)" type="number" value={songForm.duration} onChange={e => setSongForm({ ...songForm, duration: e.target.value })} required />
                                <input className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600" placeholder="Genre" value={songForm.genre} onChange={e => setSongForm({ ...songForm, genre: e.target.value })} required />
                                <input className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600" placeholder="Mood" value={songForm.mood} onChange={e => setSongForm({ ...songForm, mood: e.target.value })} required />
                                <input className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600" placeholder="Language" value={songForm.language} onChange={e => setSongForm({ ...songForm, language: e.target.value })} required />
                                <select className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600" value={songForm.artistId} onChange={e => setSongForm({ ...songForm, artistId: e.target.value })} required>
                                    <option value="">Select Artist</option>
                                    {allArtists.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
                                </select>
                                <select className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600" value={songForm.albumId} onChange={e => setSongForm({ ...songForm, albumId: e.target.value })} required>
                                    <option value="">Select Album</option>
                                    {allAlbums.filter(a => !songForm.artistId || a.artist._id === songForm.artistId).map(a => <option key={a._id} value={a._id}>{a.title}</option>)}
                                </select>
                                <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">Create Song</button>
                            </form>
                        )}
                    </div>

                    {/* List Section */}
                    <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded shadow overflow-y-auto max-h-[800px]">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Manage {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
                            <div className="flex space-x-2">
                                <button
                                    disabled={page === 1}
                                    onClick={() => setPage(p => p - 1)}
                                    className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
                                >
                                    Prev
                                </button>
                                <span className="px-2 py-1">Page {page} of {totalPages}</span>
                                <button
                                    disabled={page === totalPages}
                                    onClick={() => setPage(p => p + 1)}
                                    className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {activeTab === 'artists' && listData.map(item => (
                                <div key={item._id} className="flex justify-between items-center p-2 border-b dark:border-gray-700">
                                    <span>{item.name}</span>
                                    <button onClick={() => handleDeleteArtist(item._id)} className="text-red-500 hover:text-red-700">Delete</button>
                                </div>
                            ))}

                            {activeTab === 'albums' && listData.map(item => (
                                <div key={item._id} className="flex justify-between items-center p-2 border-b dark:border-gray-700">
                                    <span>{item.title} ({item.artist?.name})</span>
                                    <button onClick={() => handleDeleteAlbum(item._id)} className="text-red-500 hover:text-red-700">Delete</button>
                                </div>
                            ))}

                            {activeTab === 'songs' && listData.map(item => (
                                <div key={item._id} className="flex justify-between items-center p-2 border-b dark:border-gray-700">
                                    <span>{item.title} - {item.artist?.name}</span>
                                    <button onClick={() => handleDeleteSong(item._id)} className="text-red-500 hover:text-red-700">Delete</button>
                                </div>
                            ))}

                            {listData.length === 0 && <p className="text-gray-500 text-center py-4">No data found.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
