import { Navigate } from "react-router-dom";
import { useAuthCheck } from "./useAuthCheck";

interface Props {
    element: JSX.Element;
}

const AuthAccess = ({ element }: Props) => {
    const authorized = useAuthCheck();

    if (authorized === null) return <div>Loading...</div>;

    return authorized ? <Navigate to="/" replace /> : element;
};

export default AuthAccess;