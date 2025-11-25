import React, { useMemo, useState } from 'react';
import ErrorPage from './ErrorPage';
import '../../css/main.css';
import LoadingPage from './LoadingPage';
import { useFetchDays } from '../hooks/fetchDays';
import { useFetchDiets_ActCoefsData } from '../hooks/fetchDiets&ActCoefs';
import { useFetchMealTypes } from '../hooks/fetchMealTypes';
import { useFetchUserData } from '../hooks/fetchUserData';
import { useAppSelector } from '../hooks/redux';
import { timePeriodFieldMap } from '../store/types';
import { BarChart3, Calendar, ChevronLeft, Import, TrendingUp } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend);
interface Props {
    labels: string[];
    calories: number[];
    goal: number;
}

import { Chart } from 'react-chartjs-2';

const ReportsPage = () => {
    const [activeTab, setActiveTab] = useState<string>(timePeriodFieldMap.DAILY);
    const mealsInfo = useFetchMealTypes();
    const daysInfo = useFetchDays({ day: null, daysBack: 30, limit: null }); // ^ in process  make work with data(add arg by default force + ) + add more fetch to grab more data
    const diets_coefs = useFetchDiets_ActCoefsData();
    const userInfo = useFetchUserData();
    const darkTheme = useAppSelector(state => state.themeReducer.isDarkTheme); // later think about it
    const isLoading = mealsInfo.isLoading || daysInfo.isLoading || diets_coefs.isLoading || userInfo.isLoading;
    const hasError = mealsInfo.hasError || daysInfo.hasError || diets_coefs.hasError || userInfo.hasError;

    const processedData = useMemo(() => {
        if (!daysInfo.days.data) return { dates: [], calories: [], dailyCalories: {} };

        const dailyCalories: { [key: string]: number } = {};

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        daysInfo.days.data.forEach((item: any) => {
            const date = item.day;
            const caloriesForMeasurement = (item.calories * item.measurement) / 100;

            if (!dailyCalories[date]) {
                dailyCalories[date] = 0;
            }
            dailyCalories[date] += caloriesForMeasurement;
        });

        const sortedDates = Object.keys(dailyCalories).sort();
        const last30Days = sortedDates.slice(-30);

        return {
            dates: last30Days,
            calories: last30Days.map(date => Math.round(dailyCalories[date])),
            dailyCalories,
        };
    }, [daysInfo.days.data]);

    const averageCalories = useMemo(() => {
        if (processedData.calories.length === 0) return 0;
        const sum = processedData.calories.reduce((acc, val) => acc + val, 0);
        return Math.round(sum / processedData.calories.length);
    }, [processedData.calories]);

    const goal = userInfo.user.data?.caloriesStandard || 3000;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        return `${day}.${month}`;
    };

    const formatHistoryDate = (dateString: string) => {
        const date = new Date(dateString);
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const day = date.getDate();
        const month = months[date.getMonth()];
        return `${day} ${month}`;
    };

    // data for chart
    const chartLabels = processedData.dates.slice(-30).map(formatDate);
    const chartCalories = processedData.calories.slice(-30);

    const chartData = {
        labels: chartLabels,
        datasets: [
            {
                type: 'line' as const,
                label: 'Goal',
                data: chartLabels.map(() => goal),
                borderColor: '#71f082',
                borderWidth: 2,
                pointRadius: 0,
                tension: 0,
            },
            {
                type: 'bar' as const,
                label: 'Calories',
                data: chartCalories,
                backgroundColor: '#FFC400',
                borderRadius: 5,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: darkTheme ? 'rgba(0,0,0,0.9)' : 'rgba(0,0,0,0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                padding: 10,
                displayColors: false,
                borderColor: darkTheme ? '#4b5563' : 'transparent',
                borderWidth: 1,
            },
        },
        scales: {
            x: {
                ticks: {
                    color: darkTheme ? '#d1d5db' : '#6b7280',
                    font: {
                        size: 11,
                    },
                },
                grid: {
                    color: darkTheme ? '#4b5563' : '#e5e7eb',
                },
                border: {
                    color: darkTheme ? '#4b5563' : '#e5e7eb',
                },
            },
            y: {
                beginAtZero: true,
                ticks: {
                    color: darkTheme ? '#d1d5db' : '#6b7280',
                    font: {
                        size: 11,
                    },
                    maxTicksLimit: 5,
                },
                grid: {
                    color: darkTheme ? '#4b5563' : '#e5e7eb',
                },
                border: {
                    color: darkTheme ? '#4b5563' : '#e5e7eb',
                },
            },
        },
    };

    // Prepare history items (last 10 days in reverse order)
    const historyItems = processedData.dates
        .slice(-10)
        .reverse()
        .map(date => ({
            date,
            calories: processedData.dailyCalories[date],
        }));
    if (hasError) {
        return <ErrorPage />;
    }

    if (isLoading || !daysInfo.days.data || !mealsInfo.meals.mealTypes || !userInfo.user.data) {
        return <LoadingPage />;
    }
    return (
        <div className={`reports-page ${darkTheme ? 'dark-theme' : ''}`}>
            <div className="main-container">
                {/* Header */}
                <div className="header">
                    <h1 className="title">Reports</h1>
                </div>{' '}
                {/* Statistics */}
                {/* Tabs */}
                <div className="tabs">
                    {[timePeriodFieldMap.DAILY, timePeriodFieldMap.WEEKLY, timePeriodFieldMap.MONTHLY].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`tab-btn ${activeTab === tab ? 'active' : ''}`}>
                            {tab}
                        </button>
                    ))}
                </div>
                {/* Statistics Section */}
                <div className="statistics-section">
                    <h2 className="section-title">Last 30 Days</h2>

                    <div className="stats-info">
                        <div className="stat-item">
                            <span className="stat-label">Daily Average: </span>
                            <span className="stat-value average">{averageCalories} kcal</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Goal: </span>
                            <span className="stat-value goal">{goal.toLocaleString()} kcal</span>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="chart-container">
                        <Chart type="bar" data={chartData} options={chartOptions} />
                    </div>

                    {/* History */}
                    <h2 className="section-title">History</h2>

                    <div className="history-list">
                        {historyItems.map((item, index) => (
                            <div key={index} className="history-item">
                                <span className="history-date">{formatHistoryDate(item.date)}</span>
                                <span className="history-calories">{Math.round(item.calories).toLocaleString()} kcal</span>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Bottom Navigation */}
                {/*//^add listeners on click for all nav btns for routing */}
                <div className="bottom-nav">
                    <button className="nav-btn" aria-label="Go to profile">
                        <TrendingUp size={24} />
                        <span>Profile</span>
                    </button>
                    <button className="nav-btn nav-btn-active" aria-label="Diary">
                        <div className="diary-btn-circle">
                            <Calendar size={24} />
                        </div>
                        <span>Diary</span>
                    </button>
                    <button className="nav-btn" aria-label="Go to reports">
                        <BarChart3 size={24} />
                        <span>Reports</span>
                    </button>
                </div>
            </div>{' '}
        </div>
    );
};

export default ReportsPage;
