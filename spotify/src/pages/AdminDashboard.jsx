import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('artists');
    const [artists, setArtists] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [songs, setSongs] = useState([]);

    // Form States
    const [artistForm, setArtistForm] = useState({ name: '', bio: '', imageUrl: '' });
    const [albumForm, setAlbumForm] = useState({ title: '', artistId: '', release_year: '', cover_image: '' });
    const [songForm, setSongForm] = useState({ title: '', duration: '', genre: '', mood: '', language: '', albumId: '', artistId: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [artistsRes, albumsRes, songsRes] = await Promise.all([
                api.get('/artists'),
                api.get('/albums'),
                api.get('/songs')
            ]);
            setArtists(artistsRes.data);
            setAlbums(albumsRes.data);
            setSongs(songsRes.data);
        } catch (err) {
            console.error('Error fetching data', err);
        }
    };

    // --- Artist Handlers ---
    const handleCreateArtist = async (e) => {
        e.preventDefault();
        try {
            await api.post('/artists', artistForm);
            setArtistForm({ name: '', bio: '', imageUrl: '' });
            fetchData();
            alert('Artist created!');
        } catch (err) {
            alert('Error creating artist');
        }
    };

    const handleDeleteArtist = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await api.delete(`/artists/${id}`);
            fetchData();
        } catch (err) {
            alert('Error deleting artist');
        }
    };

    // --- Album Handlers ---
    const handleCreateAlbum = async (e) => {
        e.preventDefault();
        try {
            await api.post('/albums', albumForm);
            setAlbumForm({ title: '', artistId: '', release_year: '', cover_image: '' });
            fetchData();
            alert('Album created!');
        } catch (err) {
            alert('Error creating album');
        }
    };

    const handleDeleteAlbum = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await api.delete(`/albums/${id}`);
            fetchData();
        } catch (err) {
            alert('Error deleting album');
        }
    };

    // --- Song Handlers ---
    const handleCreateSong = async (e) => {
        e.preventDefault();
        try {
            await api.post('/songs', songForm);
            setSongForm({ title: '', duration: '', genre: '', mood: '', language: '', albumId: '', artistId: '' });
            fetchData();
            alert('Song created!');
        } catch (err) {
            alert('Error creating song');
        }
    };

    const handleDeleteSong = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await api.delete(`/songs/${id}`);
            fetchData();
        } catch (err) {
            alert('Error deleting song');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
            <Navbar />
            <div className="container mx-auto p-8">
                <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

                {/* Tabs */}
                <div className="flex space-x-4 mb-8 border-b border-gray-700 pb-4">
                    <button
                        className={`px-4 py-2 rounded ${activeTab === 'artists' ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-800'}`}
                        onClick={() => setActiveTab('artists')}
                    >
                        Artists
                    </button>
                    <button
                        className={`px-4 py-2 rounded ${activeTab === 'albums' ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-800'}`}
                        onClick={() => setActiveTab('albums')}
                    >
                        Albums
                    </button>
                    <button
                        className={`px-4 py-2 rounded ${activeTab === 'songs' ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-800'}`}
                        onClick={() => setActiveTab('songs')}
                    >
                        Songs
                    </button>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Section */}
                    <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded shadow">
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
                                    {artists.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
                                </select>
                                <input className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600" placeholder="Year" type="number" value={albumForm.release_year} onChange={e => setAlbumForm({ ...albumForm, release_year: e.target.value })} />
                                <input className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600" placeholder="Cover Image URL" value={albumForm.cover_image} onChange={e => setAlbumForm({ ...albumForm, cover_image: e.target.value })} />
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
                                    {artists.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
                                </select>
                                <select className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600" value={songForm.albumId} onChange={e => setSongForm({ ...songForm, albumId: e.target.value })} required>
                                    <option value="">Select Album</option>
                                    {albums.filter(a => !songForm.artistId || a.artist._id === songForm.artistId).map(a => <option key={a._id} value={a._id}>{a.title}</option>)}
                                </select>
                                <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">Create Song</button>
                            </form>
                        )}
                    </div>

                    {/* List Section */}
                    <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded shadow overflow-y-auto max-h-[600px]">
                        <h2 className="text-xl font-bold mb-4">Manage {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>

                        <div className="space-y-2">
                            {activeTab === 'artists' && artists.map(item => (
                                <div key={item._id} className="flex justify-between items-center p-2 border-b dark:border-gray-700">
                                    <span>{item.name}</span>
                                    <button onClick={() => handleDeleteArtist(item._id)} className="text-red-500 hover:text-red-700">Delete</button>
                                </div>
                            ))}

                            {activeTab === 'albums' && albums.map(item => (
                                <div key={item._id} className="flex justify-between items-center p-2 border-b dark:border-gray-700">
                                    <span>{item.title} ({item.artist?.name})</span>
                                    <button onClick={() => handleDeleteAlbum(item._id)} className="text-red-500 hover:text-red-700">Delete</button>
                                </div>
                            ))}

                            {activeTab === 'songs' && songs.map(item => (
                                <div key={item._id} className="flex justify-between items-center p-2 border-b dark:border-gray-700">
                                    <span>{item.title} - {item.artist?.name}</span>
                                    <button onClick={() => handleDeleteSong(item._id)} className="text-red-500 hover:text-red-700">Delete</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
