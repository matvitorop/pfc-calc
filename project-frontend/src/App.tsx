//import { useState } from 'react'
import ProfilePage from './components/ProfilePage';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { fetchUserDetails } from './store/reducers/userSlice';
import { useEffect } from 'react';
import '../css/main.css';
import { useFetchUserData } from './hooks/fetchUserData';
import MainPage from './components/MainPage';
import RegisterForm from './components/User/RegisterForm'
import LoginForm from './components/User/LoginForm'
import SearchItem from './components/Items/SearchItem'
import 'bootstrap/dist/css/bootstrap.min.css';
import NotesPage from "./components/Notes/NotesPage.tsx";
import './components/Notes/Notes.css'; // Імпорт стилів

function App() {
    /* const user = {
        id: 1,
        email: 'test@example.com',
        userName: 'John',
        age: new Date(1990, 1, 1),
        weight: 70,
        height: 175,
        activityCoefId: 2,
        dietId: 1,
        caloriesStandard: 2000,
    }; */

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
            <ProfilePage {...user} />
            <MainPage />
            <NotesPage/>
        </>
    );
}

export default App;
