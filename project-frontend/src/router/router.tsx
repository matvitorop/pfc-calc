import { createBrowserRouter } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import AuthAccess from "./AuthAccess";

import MainPage from "../components/MainPage";
import ProfilePage from "../components/ProfilePage";
import RegisterForm from "../components/User/RegisterForm";
import LoginForm from "../components/User/LoginForm";
import ReportsPage from "../components/ReportsPage";
import ErrorPage from "../components/ErrorPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <PrivateRoute element={<MainPage />} />,
        errorElement: <ErrorPage />,
    },
    { path: "/register", element: <AuthAccess element={<RegisterForm />} /> },
    { path: "/login", element: <AuthAccess element={<LoginForm />} /> },
    { path: "/profile", element: <PrivateRoute element={<ProfilePage />} /> },
    { path: "/reports", element: <PrivateRoute element={<ReportsPage />} /> },
]);