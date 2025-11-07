import React, { type FC } from 'react';
import type { User } from '../models/User';
import { useState } from 'react';
import lightThemeIcon from '../assets/lightThemeIcon.svg';
import darkThemeIcon from '../assets/DarkThemeIcon.svg';
import { ChevronLeft, LogOut } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { logoutUser, updateUserDetails } from '../store/reducers/userSlice';
import { UserFieldMap } from '../store/types';
import calculateAge from '../hooks/calcUserAge';
import '../../css/main.css';
import UpdateUserModal from './UpdateUserModal';
import { toggleTheme } from '../store/reducers/themeSlice';

const ProfilePage: FC<User> = user => {
    // const [darkTheme, setDarkTheme] = useState(false);
    const [modalField, setModalField] = useState<{ fieldName: string; label: string; value: string | number } | null>(null);

    const dispatch = useAppDispatch();
    const darkTheme = useAppSelector(state => state.themeReducer.isDarkTheme);
    const handleToggleTheme = () => {
        dispatch(toggleTheme());
    };
    //^ we need to change type of input despite of fieldName type (age -date, email -email...)
    const openUpdateUserModal = (fieldName: string, label: string, value: string | number) => {
        setModalField({ fieldName, label, value });
    };
    const handleSave = (newValue: string) => {
        if (modalField) {
            dispatch(updateUserDetails({ fieldName: modalField.fieldName, value: newValue }));
            setModalField(null);
        }
    };

    const logOut = () => {
        dispatch(logoutUser());
        //^ add logic for navigate to login page
    };

    return (
        <div className={`me-page ${darkTheme ? 'dark-theme' : ''}`}>
            <div className="me-container">
                {/* Header */}
                <div className="header">
                    <button className="back-btn">
                        <ChevronLeft className="icon" />
                    </button>
                    <h1 className="title">Me</h1>
                </div>

                {/* Profile Info */}
                <div className="profile-section">
                    {/*  <div className="avatar">
                        <img src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=200&h=200&fit=crop" alt="Profile" />
                    </div> */}
                    <h2 className="name" onClick={() => openUpdateUserModal(UserFieldMap.userName, 'User name', user.userName)}>
                        {user.userName}
                    </h2>
                    <p className="email" onClick={() => openUpdateUserModal(UserFieldMap.email, 'Email', user.email)}>
                        {user.email}
                    </p>
                </div>

                <div
                    className="calorie-card clickable"
                    onClick={() => openUpdateUserModal(UserFieldMap.caloriesStandard, 'Calorie Intake', user.caloriesStandard)}
                >
                    <span className="calorie-label">Calorie Intake</span>
                    <span className="calorie-value">{user.caloriesStandard} Cal</span>
                </div>

                <div className="info-list">
                    <div className="info-item clickable" onClick={() => openUpdateUserModal(UserFieldMap.dietId, 'Diet', user.dietId)}>
                        <span className="info-label">Diet</span>
                        <span className="info-value">Gain weight</span>
                    </div>

                    <div className="info-item clickable" onClick={() => openUpdateUserModal(UserFieldMap.age, 'Age', user.age)}>
                        <span className="info-label">Age</span>
                        <span className="info-value">{user.age && calculateAge(user.age)} years</span>
                    </div>

                    <div className="info-item clickable" onClick={() => openUpdateUserModal(UserFieldMap.height, 'Height', user.height)}>
                        <span className="info-label">Height</span>
                        <span className="info-value">{user.height} cm</span>
                    </div>

                    <div className="info-item clickable" onClick={() => openUpdateUserModal(UserFieldMap.weight, 'Weight', user.weight)}>
                        <span className="info-label">Weight</span>
                        <span className="info-value">{user.weight} kg</span>
                    </div>

                    <div
                        className="info-item clickable"
                        onClick={() => openUpdateUserModal(UserFieldMap.activityCoefId, 'LifeStyle', user.activityCoefId)}
                    >
                        <span className="info-label">Lifestyle</span>
                        <span className="info-value">Active</span>
                    </div>
                </div>

                {/*  Theme toggle */}
                <div className="theme-toggle-section">
                    <div className="theme-item">
                        <div className="theme-left">
                            <div className="toggle-icon-wrapper">
                                <img src={darkTheme ? darkThemeIcon : lightThemeIcon} alt="" />
                            </div>
                            <span className="theme-text">Dark theme</span>
                        </div>
                        <label className="toggle-switch">
                            <input type="checkbox" checked={darkTheme} onChange={handleToggleTheme} />
                            <span className="slider"></span>
                        </label>
                    </div>
                </div>

                {/* Logout */}
                <button
                    className="logout-btn"
                    onClick={() => {
                        logOut();
                    }}
                >
                    <LogOut className="logout-icon" size={20} />
                    <span className="logout-text">Logout</span>
                </button>
                {/* Modal */}
                {modalField && (
                    <UpdateUserModal
                        fieldName={modalField.fieldName}
                        label={modalField.label}
                        initialValue={modalField.value}
                        onClose={() => setModalField(null)}
                        onSave={handleSave}
                    />
                )}
            </div>
        </div>
    );
};
export default ProfilePage;
