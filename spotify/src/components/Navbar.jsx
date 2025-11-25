import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-gray-800 dark:bg-gray-900 text-white p-4 flex justify-between items-center shadow-md transition-colors duration-200">
            <Link to="/" className="text-2xl font-bold text-green-500">Mini-Spotify</Link>

            {user && (
                <div className="flex items-center space-x-6">
                    <Link to="/" className="hover:text-green-400">Home</Link>
                    <Link to="/artists" className="hover:text-green-400">Artists</Link>
                    <Link to="/albums" className="hover:text-green-400">Albums</Link>
                    <Link to="/favorites" className="hover:text-green-400">Favorites</Link>
                    <Link to="/recommendations" className="hover:text-green-400">For You</Link>
                    {user?.role === 'admin' && (
                        <Link to="/admin" className="text-yellow-500 hover:text-yellow-400 font-bold">Admin Dashboard</Link>
                    )}
                    <div className="flex items-center space-x-4 ml-4 border-l border-gray-600 pl-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-gray-700 dark:hover:bg-gray-800 transition"
                        >
                            {theme === 'dark' ? '☀️' : '🌙'}
                        </button>
                        <span className="text-gray-300">Hi, {user?.username}</span>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-sm"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
