// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Problems from './components/Problems';
import Rankings from './components/Rankings';
import Profile from './components/Profile';
import Navbar from './components/Navbar';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');

    // Check local storage for authentication status and username on mount
    useEffect(() => {
        const storedAuth = localStorage.getItem('isAuthenticated');
        const storedUsername = localStorage.getItem('username');

        console.log("Stored Auth:", storedAuth);
        console.log("Stored Username:", storedUsername);

        if (storedAuth === 'true' && storedUsername) {
            setIsAuthenticated(true);
            setUsername(storedUsername);
            console.log("User is authenticated:", storedUsername);
        } else {
            console.log("User is not authenticated.");
        }
    }, []);

    const handleLogin = (user) => {
        setIsAuthenticated(true);
        setUsername(user);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('username', user);
        console.log("User logged in:", user);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUsername('');
        localStorage.setItem('isAuthenticated', 'false');
        localStorage.removeItem('username');
        console.log("User logged out.");
    };

    return (
        <Router>
            <div>
                {isAuthenticated && <Navbar username={username} onLogout={handleLogout} />}
                <Routes>
                    <Route 
                        path="/" 
                        element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/home" />} 
                    />
                    <Route 
                        path="/home" 
                        element={isAuthenticated ? <Home username={username} /> : <Navigate to="/" />} 
                    />
                    <Route path="/signup" element={<Signup />} />
                    <Route 
                        path="/problems" 
                        element={isAuthenticated ? <Problems username={username} /> : <Navigate to="/" />} 
                    />
                    <Route 
                        path="/rankings" 
                        element={isAuthenticated ? <Rankings username={username} /> : <Navigate to="/" />} 
                    />
                    <Route 
                        path="/profile/:username" 
                        element={isAuthenticated ? <Profile username={username} /> : <Navigate to="/" />} 
                    />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
