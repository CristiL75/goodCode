import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Rankings = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Aici faci un request pentru a obține lista de utilizatori din backend
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Eroare la obținerea utilizatorilor:', error);
            }
        };
        
        fetchUsers();
    }, []);

    return (
        <div>
            <h2>Clasament Utilizatori</h2>
            <div>
                {users.map((user) => (
                    <div key={user.username}>
                        <Link to={`/profile/${user.username}`}>
                            {user.username}
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Rankings;
