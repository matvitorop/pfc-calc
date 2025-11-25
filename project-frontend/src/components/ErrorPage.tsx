import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import '../../css/main.css';

interface ErrorPageProps {
    message?: string;
    onRetry?: () => void;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ message = 'An error occurred while loading your data', onRetry }) => {
    return (
        <div className="error-page">
            <div className="error-container">
                <div className="error-icon">
                    <AlertCircle size={64} />
                </div>
                <h2 className="error-title">Oops!</h2>
                <p className="error-message">{message}</p>
                {onRetry && (
                    <button className="retry-btn" onClick={onRetry}>
                        <RefreshCw size={20} />
                        <span>Try Again</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default ErrorPage;
