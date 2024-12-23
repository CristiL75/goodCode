import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // pentru React Router v6

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate(); // Inițializează useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:4000/signup', {
                username,
                email,
                password,
                confirmPassword
            });

            // Dacă utilizatorul este înregistrat cu succes, redirecționează-l la pagina de logare
            if (response.status === 201) {
                alert(response.data.message); // Afișează mesajul de succes
                navigate('/login'); // Redirecționează utilizatorul către pagina de logare
            }
        } catch (error) {
            console.error("Error signing up:", error);
            alert("Error signing up: " + error.response.data);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Username:</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Confirm Password:</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Sign Up</button>
        </form>
    );
};

export default Signup;
