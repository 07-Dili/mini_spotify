import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const Recommendations = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const res = await api.get('/ai/recommendations');
                setRecommendations(res.data);
            } catch (err) {
                console.error('Error fetching recommendations:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchRecommendations();
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Navbar />
            <div className="container mx-auto p-8">
                <h1 className="text-3xl font-bold mb-2">Recommended for You</h1>
                <p className="text-gray-400 mb-8">Based on your listening history and favorites</p>

                {loading ? (
                    <div className="text-center py-12">Loading recommendations...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recommendations.map(song => (
                            <div key={song._id} className="bg-gray-800 p-4 rounded-lg shadow hover:bg-gray-750 transition border border-gray-700">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="text-xl font-semibold">{song.title}</h3>
                                        <p className="text-gray-400">{song.artist?.name}</p>
                                    </div>
                                    <span className="text-xs bg-green-900 text-green-300 px-2 py-1 rounded-full">
                                        {song.reason}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 mt-2">{song.genre} • {song.mood}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Recommendations;
