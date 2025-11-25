import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import Recommendations from './pages/Recommendations';
import ArtistList from './pages/ArtistList';
import ArtistDetail from './pages/ArtistDetail';
import AlbumList from './pages/AlbumList';
import AlbumDetail from './pages/AlbumDetail';

const PrivateRoute = ({ children }) => {
  const { user, loading } = React.useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-900 text-white">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/favorites" element={<PrivateRoute><Favorites /></PrivateRoute>} />
            <Route path="/recommendations" element={<PrivateRoute><Recommendations /></PrivateRoute>} />
            <Route path="/artists" element={<PrivateRoute><ArtistList /></PrivateRoute>} />
            <Route path="/artists/:id" element={<PrivateRoute><ArtistDetail /></PrivateRoute>} />
            <Route path="/albums" element={<PrivateRoute><AlbumList /></PrivateRoute>} />
            <Route path="/albums/:id" element={<PrivateRoute><AlbumDetail /></PrivateRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;