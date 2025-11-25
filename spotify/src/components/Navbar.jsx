import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import api from '../api/axios';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [searchHistory, setSearchHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);

    const debounceTimeout = React.useRef(null);
    const isFirstRender = React.useRef(true);

    React.useEffect(() => {
        if (user) fetchHistory();
    }, [user]);

    // Debounce Search
    React.useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

        debounceTimeout.current = setTimeout(() => {
            performSearch(searchQuery);
        }, 1500);

        return () => clearTimeout(debounceTimeout.current);
    }, [searchQuery]);

    const fetchHistory = async () => {
        try {
            const res = await api.get('/users/history');
            setSearchHistory(res.data);
        } catch (err) {
            console.error('Error fetching history', err);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        performSearch(searchQuery);
    };

    const performSearch = async (query) => {
        if (!query.trim()) {
            navigate(location.pathname);
            return;
        }

        // Determine target path based on current location
        let targetPath = '/';
        if (location.pathname === '/artists') targetPath = '/artists';
        else if (location.pathname === '/albums') targetPath = '/albums';

        try {
            // Update Server History
            const res = await api.post('/users/history', { query });
            setSearchHistory(res.data);
        } catch (err) {
            console.error('Error updating history', err);
        }

        setShowHistory(false);
        navigate(`${targetPath}?search=${encodeURIComponent(query)}`);
    };

    const clearHistory = async (e) => {
        if (e) e.preventDefault(); // Prevent form submission if inside form
        try {
            await api.delete('/users/history');
            setSearchHistory([]);
        } catch (err) {
            console.error('Error clearing history', err);
        }
    };

    const deleteHistoryItem = async (e, term) => {
        e.stopPropagation(); // Prevent triggering search
        e.preventDefault();
        try {
            const res = await api.delete(`/users/history?item=${encodeURIComponent(term)}`);
            setSearchHistory(res.data);
        } catch (err) {
            console.error('Error deleting history item', err);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4 flex justify-between items-center shadow-md transition-colors duration-200 sticky top-0 z-50">
            <Link to="/" className="text-2xl font-bold text-green-500 mr-8">Mini-Spotify</Link>

            {user && (
                <>
                    <div className="flex-1 max-w-xl relative mx-4">
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                placeholder="Search songs, artists, albums..."
                                className="w-full p-2 pl-4 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 border border-gray-300 dark:border-transparent"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    if (e.target.value === '') {
                                        navigate(location.pathname);
                                    }
                                }}
                                onFocus={() => setShowHistory(true)}
                                onBlur={() => setTimeout(() => setShowHistory(false), 200)} // Delay to allow clicking items
                            />
                            <button type="submit" className="absolute right-3 top-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white">
                                🔍
                            </button>
                        </form>

                        {showHistory && searchHistory.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                                <div className="flex justify-between items-center p-2 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
                                    <span className="text-xs text-gray-500 font-semibold uppercase">Recent Searches</span>
                                    <button
                                        onClick={clearHistory}
                                        onMouseDown={(e) => e.preventDefault()} // Prevent blur before click
                                        className="text-xs text-red-500 hover:text-red-700"
                                    >
                                        Clear All
                                    </button>
                                </div>
                                <ul>
                                    {searchHistory.map((term, index) => (
                                        <li key={index} className="flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2">
                                            <button
                                                className="flex-1 text-left text-gray-800 dark:text-gray-200 flex items-center"
                                                onClick={() => {
                                                    setSearchQuery(term);
                                                    performSearch(term);
                                                }}
                                                onMouseDown={(e) => e.preventDefault()} // Prevent blur before click
                                            >
                                                <span className="mr-2 text-gray-400">🕒</span> {term}
                                            </button>
                                            <button
                                                onClick={(e) => deleteHistoryItem(e, term)}
                                                onMouseDown={(e) => e.preventDefault()} // Prevent blur before click
                                                className="text-gray-400 hover:text-red-500 ml-2 p-1"
                                                title="Remove from history"
                                            >
                                                ✕
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-6">
                        <Link to="/" className="hover:text-green-400">Home</Link>
                        <Link to="/artists" className="hover:text-green-400">Artists</Link>
                        <Link to="/albums" className="hover:text-green-400">Albums</Link>
                        <Link to="/favorites" className="hover:text-green-400">Favorites</Link>
                        <Link to="/recommendations" className="hover:text-green-400">For You</Link>
                        {user?.role === 'admin' && (
                            <Link to="/admin" className="text-yellow-500 hover:text-yellow-400 font-bold">Admin</Link>
                        )}
                        <div className="flex items-center space-x-4 ml-4 border-l border-gray-600 pl-4">
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-full hover:bg-gray-700 dark:hover:bg-gray-800 transition"
                            >
                                {theme === 'dark' ? '☀️' : '🌙'}
                            </button>
                            <span className="text-gray-700 dark:text-gray-300 hidden md:inline">Hi, {user?.username}</span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-sm"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </>
            )}
        </nav>
    );
};

export default Navbar;
