import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const Register = () => {
    const [step, setStep] = useState(1);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Preferences
    const [selectedLanguages, setSelectedLanguages] = useState([]);
    const [selectedArtists, setSelectedArtists] = useState([]);
    const [availableArtists, setAvailableArtists] = useState([]);

    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const languages = ['Hindi', 'English', 'Punjabi', 'Tamil', 'Telugu', 'Malayalam', 'Kannada', 'Bengali'];

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                const res = await api.get('/artists?limit=100');
                setAvailableArtists(res.data.artists || []);
            } catch (err) {
                console.error('Failed to fetch artists');
            }
        };
        fetchArtists();
    }, []);

    const handleLanguageToggle = (lang) => {
        if (selectedLanguages.includes(lang)) {
            setSelectedLanguages(selectedLanguages.filter(l => l !== lang));
        } else {
            setSelectedLanguages([...selectedLanguages, lang]);
        }
    };

    const handleArtistToggle = (id) => {
        if (selectedArtists.includes(id)) {
            setSelectedArtists(selectedArtists.filter(a => a !== id));
        } else {
            setSelectedArtists([...selectedArtists, id]);
        }
    };

    const handleNext = () => {
        if (step === 2 && selectedLanguages.length < 2) {
            setError('Please select at least 2 languages.');
            return;
        }
        if (step === 3 && selectedArtists.length < 2) {
            setError('Please select at least 2 artists.');
            return;
        }
        setError('');
        setStep(step + 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedArtists.length < 2) {
            setError('Please select at least 2 artists.');
            return;
        }
        try {
            await register(username, email, password, selectedLanguages, selectedArtists);
            navigate('/login');
        } catch (err) {
            setError('Registration failed. Username or email might be taken.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-96 border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
                    {step === 1 && 'Create Account'}
                    {step === 2 && 'Select Languages'}
                    {step === 3 && 'Select Artists'}
                </h2>

                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

                {step === 1 && (
                    <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                        <div className="mb-4">
                            <label className="block text-gray-600 dark:text-gray-400 mb-2">Username</label>
                            <input
                                type="text"
                                className="w-full p-2 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-600 dark:text-gray-400 mb-2">Email</label>
                            <input
                                type="email"
                                className="w-full p-2 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-600 dark:text-gray-400 mb-2">Password</label>
                            <input
                                type="password"
                                className="w-full p-2 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-200">
                            Next
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <div>
                        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">Select at least 2 languages you enjoy.</p>
                        <div className="grid grid-cols-2 gap-2 mb-6">
                            {languages.map(lang => (
                                <button
                                    key={lang}
                                    onClick={() => handleLanguageToggle(lang)}
                                    className={`p-2 rounded border ${selectedLanguages.includes(lang) ? 'bg-green-500 text-white border-green-500' : 'bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600'}`}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                        <button onClick={handleNext} className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-200">
                            Next
                        </button>
                    </div>
                )}

                {step === 3 && (
                    <div>
                        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">Select at least 2 artists you love.</p>
                        <div className="grid grid-cols-2 gap-2 mb-6 max-h-60 overflow-y-auto">
                            {availableArtists.map(artist => (
                                <button
                                    key={artist._id}
                                    onClick={() => handleArtistToggle(artist._id)}
                                    className={`p-2 rounded border text-sm truncate ${selectedArtists.includes(artist._id) ? 'bg-green-500 text-white border-green-500' : 'bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600'}`}
                                >
                                    {artist.name}
                                </button>
                            ))}
                        </div>
                        <button onClick={handleSubmit} className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-200">
                            Complete Registration
                        </button>
                    </div>
                )}

                {step === 1 && (
                    <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
                        Already have an account? <Link to="/login" className="text-green-500 hover:underline">Login</Link>
                    </p>
                )}
            </div>
        </div>
    );
};

export default Register;
