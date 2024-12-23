// src/components/Problems.js
import React from 'react';

const Problems = ({ username }) => {
    return (
        <div>
            <h1>Problems Page</h1>
            <p>Welcome, {username}!</p>
            {/* Your problems content goes here */}
        </div>
    );
};

export default Problems;
