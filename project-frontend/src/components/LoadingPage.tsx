import React from 'react';
import '../../css/main.css';

const LoadingPage: React.FC = () => {
    return (
        <div className="loading-page">
            <div className="loading-container">
                <div className="spinner"></div>
                <p className="loading-text">Loading...</p>
            </div>
        </div>
    );
};

export default LoadingPage;
