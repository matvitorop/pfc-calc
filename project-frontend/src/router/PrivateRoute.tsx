import { Navigate } from 'react-router-dom';
import { useAuthCheck } from './useAuthCheck';
import LoadingPage from '../components/LoadingPage';
import type { JSX } from 'react';

interface PrivateRouteProps {
    element: JSX.Element;
}

const PrivateRoute = ({ element }: PrivateRouteProps) => {
    const authorized = useAuthCheck();

    if (authorized === null) {
        return <LoadingPage />;
    }

    return authorized ? element : <Navigate to="/login" replace />;
};

export default PrivateRoute;
