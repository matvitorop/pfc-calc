import ProfilePage from './components/ProfilePage';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { fetchUserDetails } from './store/reducers/userSlice';
import { useEffect } from 'react';
import '../css/main.css';
import { useFetchUserData } from './hooks/fetchUserData';
import MainPage from './components/MainPage';
import RegisterForm from './components/User/RegisterForm'
import LoginForm from './components/User/LoginForm'

function App() {
    const { user, loading, error } = useFetchUserData();
    //const { data, loading, error } = useAppSelector(state => state.userReducer);
    if (loading) {
        return <div>Loading profile data...</div>;
    }
    if (error) {
        return <div>Happend error: {error} </div>;
    }
    if (!user) {
        return <div>User`s data not accessable.</div>;
    }
    /* if (!data) {
        return <div>User`s data not accessable.</div>;
    } */
    return (
        <>
            <RegisterForm />
            <LoginForm />
            <MainPage />
            <ProfilePage {...user} />
        </>
    );
}

export default App;
