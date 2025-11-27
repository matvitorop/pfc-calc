import { Navigate } from "react-router-dom";
import { useAuthCheck } from "./useAuthCheck";

interface PrivateRouteProps {
    element: JSX.Element;
}

const PrivateRoute = ({ element }: PrivateRouteProps) => {
    const authorized = useAuthCheck();

    // authorized === null означає, що триває перевірка токена
    if (authorized === null) {
        return <div>Loading...</div>;
    }

    return authorized ? element : <Navigate to="/login" replace />;
};

export default PrivateRoute;