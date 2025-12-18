import React from 'react';
import '../../css/main.css';
import { useAppSelector } from '../hooks/redux';

const LoadingPage: React.FC = () => {
    const darkMode = useAppSelector(state => state.themeReducer.isDarkTheme);
    return (
        <div className={`loading-page ${darkMode ? 'dark-theme' : ''} `}>
            <div className="loading-container">
                <div className="spinner"></div>
                <p className="loading-text">Loading...</p>
            </div>
        </div>
    );
};

export default LoadingPage;
