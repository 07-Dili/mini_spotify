import React, { useState } from 'react';

const Player = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(30);

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4 flex items-center justify-between z-50">
            <div className="flex items-center w-1/3">
                <div className="w-14 h-14 bg-gray-700 rounded mr-4"></div>
                <div>
                    <h4 className="text-white font-semibold text-sm">Simulated Song</h4>
                    <p className="text-gray-400 text-xs">Simulated Artist</p>
                </div>
            </div>

            <div className="flex flex-col items-center w-1/3">
                <div className="flex items-center space-x-6 mb-2">
                    <button className="text-gray-400 hover:text-white">⏮</button>
                    <button
                        className="bg-white text-black rounded-full w-8 h-8 flex items-center justify-center hover:scale-105 transition"
                        onClick={() => setIsPlaying(!isPlaying)}
                    >
                        {isPlaying ? '⏸' : '▶'}
                    </button>
                    <button className="text-gray-400 hover:text-white">⏭</button>
                </div>
                <div className="w-full flex items-center space-x-2">
                    <span className="text-xs text-gray-400">1:20</span>
                    <div className="h-1 bg-gray-600 rounded-full w-full relative group cursor-pointer">
                        <div className="absolute h-full bg-green-500 rounded-full" style={{ width: `${progress}%` }}></div>
                        <div className="absolute h-3 w-3 bg-white rounded-full top-1/2 transform -translate-y-1/2 hidden group-hover:block" style={{ left: `${progress}%` }}></div>
                    </div>
                    <span className="text-xs text-gray-400">3:45</span>
                </div>
            </div>

            <div className="w-1/3 flex justify-end items-center space-x-4">
                <span className="text-gray-400">🔊</span>
                <div className="w-24 h-1 bg-gray-600 rounded-full">
                    <div className="h-full bg-white rounded-full" style={{ width: '70%' }}></div>
                </div>
            </div>
        </div>
    );
};

export default Player;
