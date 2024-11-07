import React from 'react';
import './index.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import SpotifyLogin from './components/SpotifyLogin';
import Comparisons from './pages/Comparisons';
import Results from './pages/Results';

function App() {
    return (
        <Router>
            <Routes>
                {/* default path should be to the home page*/}
                <Route path="/" element={<Navigate to="/Home" />} />
                <Route path="/Home" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/spotify-login" element={<SpotifyLogin />} />
                <Route path="/comparisons" element={<Comparisons />} />
                <Route path="/results" element={<Results />} />
            </Routes>
        </Router>
    );
}

export default App;