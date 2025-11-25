import ProfilePage from './components/ProfilePage';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { fetchUserDetails } from './store/reducers/userSlice';
import { useEffect } from 'react';
import '../css/main.css';
import { useFetchUserData } from './hooks/fetchUserData';
import MainPage from './components/MainPage';
import RegisterForm from './components/User/RegisterForm';
import LoginForm from './components/User/LoginForm';
import SearchItem from './components/Items/SearchItem';
import ErrorPage from './components/ErrorPage';
import LoadingPage from './components/LoadingPage';
import ReportsPage from './components/ReportsPage';
//import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <>
            <RegisterForm />
            <LoginForm />
            <ProfilePage />
            <MainPage />
            <ReportsPage />
        </>
    );
}

export default App;
