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
    const amountOfDays = useMemo(() => {
        switch (activeTab) {
            case timePeriodFieldMap.WEEKLY:
                return 90;
            case timePeriodFieldMap.MONTHLY:
                return 365;
            case timePeriodFieldMap.DAILY:
            default:
                return 30;
        }
    }, [activeTab]);
    //^ only for test force = false
    const daysInfo = useFetchDays({ day: null, daysBack: amountOfDays, limit: null });
    const mealsInfo = useFetchMealTypes();

    // ^ in process  make work with data(add arg by default force + ) + add more fetch to grab more data
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

        /* return {
            dates: sortedDates,
            calories: sortedDates.map(date => Math.round(dailyCalories[date])),
            dailyCalories,
        }; */

        switch (activeTab) {
            case timePeriodFieldMap.WEEKLY: {
                const weeklyData: { [key: string]: { total: number; count: number } } = {};

                sortedDates.forEach(date => {
                    const dateObj = new Date(date);

                    const dayOfWeek = dateObj.getDay();
                    const diff = dateObj.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
                    const monday = new Date(dateObj.setDate(diff));
                    const weekKey = monday.toISOString().split('T')[0];

                    if (!weeklyData[weekKey]) {
                        weeklyData[weekKey] = { total: 0, count: 0 };
                    }
                    weeklyData[weekKey].total += dailyCalories[date];
                    weeklyData[weekKey].count += 1;
                });

                const weekKeys = Object.keys(weeklyData).sort();

                return {
                    dates: weekKeys,
                    calories: weekKeys.map(week => Math.round(weeklyData[week].total)),
                    dailyCalories: Object.fromEntries(weekKeys.map(week => [week, weeklyData[week].total])),
                };
            }
            case timePeriodFieldMap.MONTHLY: {
                const monthlyData: { [key: string]: { total: number; count: number } } = {};

                sortedDates.forEach(date => {
                    const dateObj = new Date(date);
                    const monthKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;

                    if (!monthlyData[monthKey]) {
                        monthlyData[monthKey] = { total: 0, count: 0 };
                    }
                    monthlyData[monthKey].total += dailyCalories[date];
                    monthlyData[monthKey].count += 1;
                });

                const monthKeys = Object.keys(monthlyData).sort();

                return {
                    dates: monthKeys,
                    calories: monthKeys.map(month => Math.round(monthlyData[month].total)), // Середнє за місяць
                    dailyCalories: Object.fromEntries(monthKeys.map(month => [month, monthlyData[month].total])),
                };
            }

            case timePeriodFieldMap.DAILY:
            default: {
                return {
                    dates: sortedDates,
                    calories: sortedDates.map(date => Math.round(dailyCalories[date])),
                    dailyCalories,
                };
            }
        }
    }, [daysInfo.days.data]);

    const averageCalories = useMemo(() => {
        if (processedData.calories.length === 0) return 0;
        const sum = processedData.calories.reduce((acc, val) => acc + val, 0);
        return Math.round(sum / processedData.calories.length);
    }, [processedData.calories]);

    const goal = userInfo.user.data?.caloriesStandard || 3000;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);

        switch (activeTab) {
            case timePeriodFieldMap.DAILY: {
                const day = date.getDate().toString().padStart(2, '0');
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                return `${day}.${month}`;
            }

            case timePeriodFieldMap.WEEKLY: {
                const day = date.getDate().toString().padStart(2, '0');
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                return `Week ${day}.${month}`;
            }

            case timePeriodFieldMap.MONTHLY: {
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

                if (dateString.length === 7) {
                    const [year, month] = dateString.split('-');
                    return `${months[parseInt(month) - 1]} ${year}`;
                }
                return months[date.getMonth()];
            }

            default:
                return dateString;
        }
    };

    const formatHistoryDate = (dateString: string) => {
        const date = new Date(dateString);
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        switch (activeTab) {
            case timePeriodFieldMap.DAILY: {
                const day = date.getDate();
                const month = months[date.getMonth()];
                return `${day} ${month}`;
            }

            case timePeriodFieldMap.WEEKLY: {
                const day = date.getDate();
                const month = months[date.getMonth()];
                return `Week of ${day} ${month}`;
            }

            case timePeriodFieldMap.MONTHLY: {
                if (dateString.length === 7) {
                    const [year, month] = dateString.split('-');
                    return `${months[parseInt(month) - 1]} ${year}`;
                }
                return `${months[date.getMonth()]} ${date.getFullYear()}`;
            }

            default:
                return dateString;
        }
    };

    // data for chart
    const chartLabels = processedData.dates.map(formatDate);
    const chartCalories = processedData.calories;

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

    function ChangeTab(tab: string) {
        setActiveTab(tab);
    }

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
                        <button key={tab} onClick={() => ChangeTab(tab)} className={`tab-btn ${activeTab === tab ? 'active' : ''}`}>
                            {tab}
                        </button>
                    ))}
                </div>
                {/* Statistics Section */}
                <div className="statistics-section">
                    <h2 className="section-title">Last {amountOfDays} days</h2>

                    <div className="stats-info">
                        <div className="stat-item">
                            <span className="stat-label">{activeTab} Average: </span>
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
