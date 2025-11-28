import { Navigate } from "react-router-dom";
import { useAuthCheck } from "./useAuthCheck";
import LoadingPage from "../components/LoadingPage";

interface Props {
    element: JSX.Element;
}

const AuthAccess = ({ element }: Props) => {
    const authorized = useAuthCheck();

    if (authorized === null) return <LoadingPage />;;

    return authorized ? <Navigate to="/" replace /> : element;
};

export default AuthAccess;