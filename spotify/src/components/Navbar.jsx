import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="bg-gray-800 p-4 text-white shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-green-500">Mini-Spotify</Link>
                <div className="flex space-x-6 items-center">
                    <Link to="/" className="hover:text-green-400">Home</Link>
                    <Link to="/artists" className="hover:text-green-400">Artists</Link>
                    <Link to="/albums" className="hover:text-green-400">Albums</Link>
                    <Link to="/favorites" className="hover:text-green-400">Favorites</Link>
                    <Link to="/recommendations" className="hover:text-green-400">For You</Link>
                    <div className="flex items-center space-x-4 ml-4 border-l border-gray-600 pl-4">
                        <span className="text-gray-300">Hi, {user?.username}</span>
                        <button
                            onClick={logout}
                            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
