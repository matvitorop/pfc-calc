import React, { type FC, useEffect, useRef, useState } from 'react';
import { Calendar, Plus, TrendingUp, BarChart3, Edit2, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchSummary } from '../store/reducers/summarySlice';
import { createMeal, deleteMeal, fetchMeals, updateMeal } from '../store/reducers/mealTypeSlice';
import UpdateMealModal from './UpdateMealModal';
import SearchItem  from './Items/SearchItem';
interface MacroData {
    current: number;
    goal: number;
}

interface CalorieData {
    consumed: number;
    goal: number;
    protein: MacroData;
    fats: MacroData;
    carbs: MacroData;
}

interface Meal {
    id: number;
    name: string;
    calories: number;
    icon: string;
}

const MainPage: FC = () => {
    const [modalField, setModalField] = useState<{ id: number; label: string; value: string } | null>(null);
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(fetchMeals());
        dispatch(fetchSummary());
    }, []);
    const darkTheme = useAppSelector(state => state.themeReducer.isDarkTheme);
    const user = useAppSelector(state => state.userReducer);
    const { days, loading, error } = useAppSelector(state => state.summaryReducer);
    const { mealTypes, loading: mealTypesLoading, error: mealTypesError } = useAppSelector(state => state.mealReducer);

    const mealIcons = [{ icon: '🥐' }, { icon: '🍜' }, { icon: '🍝' }]; //^ change on func

    const calculateTotals = () => {
        return days.reduce(
            (acc, item) => ({
                calories: acc.calories + (item.calories || 0),
                proteins: acc.proteins + (item.proteins || 0) * (item.measurement / 100),
                fats: acc.fats + (item.fats || 0) * (item.measurement / 100),
                carbs: acc.carbs + (item.carbs || 0) * (item.measurement / 100),
            }),
            { calories: 0, proteins: 0, fats: 0, carbs: 0 },
        );
    };

    const calcMealCalories = (name: string) => {};

    const openUpdateMealModal = (id: number, label: string, value: string) => {
        setOpenMenuId(null);
        setModalField({ id, label, value });
    };

    const handleUpdateMeal = (newValue: string) => {
        if (modalField) {
            dispatch(updateMeal({ id: modalField.id, name: newValue }));
            setModalField(null);
        }
    };

    const totals = calculateTotals();
    //^ calc goal depence on diet info
    const [calorieData] = useState<CalorieData>({
        consumed: totals.calories,
        goal: user.data?.caloriesStandard || 3400,
        protein: { current: totals.proteins, goal: 225 },
        fats: { current: totals.fats, goal: 118 },
        carbs: { current: totals.carbs, goal: 340 },
    });

    const [meals] = useState<Meal[]>([
        { id: 1, name: 'Breakfast', calories: 0, icon: '🥐' },
        { id: 2, name: 'Lunch', calories: 0, icon: '🍜' },
        { id: 3, name: 'Dinner', calories: 0, icon: '🍝' },
    ]);

    const calculatePercentage = (current: number, goal: number): number => {
        return Math.min((current / goal) * 100, 100);
    };

    const caloriePercentage = calculatePercentage(calorieData.consumed, calorieData.goal);
    const circumference = 2 * Math.PI * 70;

    const handleNavigateToProfile = () => {
        /*  navigate('/profile'); */
    };

    const handleAddMeal = () => {
        if (newMealName !== null || newMealName !== '') {
            dispatch(createMeal(newMealName));
        }
    };
    const [showAddMeal, setShowAddMeal] = useState(false);
    const [newMealName, setNewMealName] = useState('');
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);

    const handleDeleteMeal = (id: number) => {
        setOpenMenuId(null);
        dispatch(deleteMeal(id));
    };

    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };

        if (openMenuId !== null) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openMenuId]);

    /* if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    } */
    return (
        <div className={`main-page ${darkTheme ? 'dark-theme' : ''}`}>
            <div className="main-container">
                {/* Header */}
                <div className="main-header">
                    <div className="header-left">
                        <h1 className="header-title">Today</h1>
                        <button className="calendar-btn" aria-label="Open calendar">
                            <Calendar className="calendar-icon" size={20} />
                        </button>
                    </div>
                    <div className="streak-badge">
                        <span className="streak-icon">🔥</span>
                        <span className="streak-count">{user.data?.VisitsStreak || 0}</span>
                    </div>
                </div>

                {/* Summary Section */}
                <div className="summary-section">
                    <h2 className="section-title mg-1">Summary</h2>

                    {/* Circular Progress */}
                    <div className="calorie-progress-wrapper">
                        <svg className="progress-ring" width="160" height="160">
                            <circle className="progress-ring-bg" cx="80" cy="80" r="70" strokeWidth="12" />
                            <circle
                                className="progress-ring-fill"
                                cx="80"
                                cy="80"
                                r="70"
                                strokeWidth="12"
                                strokeDasharray={circumference}
                                strokeDashoffset={circumference * (1 - caloriePercentage / 100)}
                                transform="rotate(-90 80 80)"
                            />
                        </svg>
                        <div className="progress-text">
                            <div className="progress-value">
                                {calorieData.consumed} / {calorieData.goal}
                            </div>
                            <div className="progress-label">Calories</div>
                        </div>
                    </div>

                    {/* Macros */}
                    <div className="macros-grid">
                        <div className="macro-item">
                            <div className="macro-bar-wrapper">
                                <div
                                    className="macro-bar protein-bar"
                                    style={{
                                        width: `${calculatePercentage(calorieData.protein.current, calorieData.protein.goal)}%`,
                                    }}
                                />
                            </div>
                            <div className="macro-values">
                                {calorieData.protein.current} / {calorieData.protein.goal}
                            </div>
                            <div className="macro-label">Proteins</div>
                        </div>

                        <div className="macro-item">
                            <div className="macro-bar-wrapper">
                                <div
                                    className="macro-bar fats-bar"
                                    style={{
                                        width: `${calculatePercentage(calorieData.fats.current, calorieData.fats.goal)}%`,
                                    }}
                                />
                            </div>
                            <div className="macro-values">
                                {calorieData.fats.current} / {calorieData.fats.goal}
                            </div>
                            <div className="macro-label">Fats</div>
                        </div>

                        <div className="macro-item">
                            <div className="macro-bar-wrapper">
                                <div
                                    className="macro-bar carbs-bar"
                                    style={{
                                        width: `${calculatePercentage(calorieData.carbs.current, calorieData.carbs.goal)}%`,
                                    }}
                                />
                            </div>
                            <div className="macro-values">
                                {calorieData.carbs.current} / {calorieData.carbs.goal}
                            </div>
                            <div className="macro-label">Carbs</div>
                        </div>
                    </div>
                </div>

                {/* Meals Section */}
                <div className="meals-section">
                    <div className="meals-header">
                        <h2 className="section-title">Meals</h2>
                        <button className="add-meal-btn" aria-label="Add new meal" onClick={() => setShowAddMeal(!showAddMeal)}>
                            <Plus size={20} />
                        </button>
                    </div>
                    <SearchItem />
                    {showAddMeal && (
                        <div className="add-meal-form">
                            <input
                                type="text"
                                placeholder="Meal type name..."
                                value={newMealName}
                                onChange={e => setNewMealName(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') handleAddMeal();
                                    if (e.key === 'Escape') {
                                        setShowAddMeal(false);
                                        setNewMealName('');
                                    }
                                }}
                                autoFocus
                            />
                            <button onClick={handleAddMeal} className="confirm-btn">
                                Додати
                            </button>
                            <button
                                onClick={() => {
                                    setShowAddMeal(false);
                                    setNewMealName('');
                                }}
                                className="cancel-add-btn"
                            >
                                Скасувати
                            </button>
                        </div>
                    )}
                    <div className="meals-list">
                        {meals.map(meal => (
                            <div key={meal.id} className="meal-card" ref={openMenuId === meal.id ? menuRef : null}>
                                <div className="meal-info">
                                    <button
                                        className="meal-show-menu"
                                        onClick={e => {
                                            e.stopPropagation();
                                            setOpenMenuId(openMenuId === meal.id ? null : meal.id);
                                        }}
                                    >
                                        ⋮
                                    </button>
                                    <span className="meal-icon">{meal.icon}</span>
                                    <div className="meal-details">
                                        <div className="meal-name">{meal.name}</div>
                                        <div className="meal-calories">{meal.calories} / 569 kcal</div>

                                        {openMenuId === meal.id && (
                                            <div className="dropdown-menu">
                                                <button onClick={() => openUpdateMealModal(meal.id, 'meal', meal.name)} className="menu-item">
                                                    <Edit2 size={16} /> Edit
                                                </button>
                                                <button onClick={() => handleDeleteMeal(meal.id)} className="menu-item delete">
                                                    <Trash2 size={16} /> Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <button className="meal-add-btn" onClick={() => {}} aria-label={`Add ${meal.name}`}>
                                    <Plus size={24} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Navigation */}
                <div className="bottom-nav">
                    <button className="nav-btn" onClick={handleNavigateToProfile} aria-label="Go to profile">
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
                {/* Modal */}
                {modalField && (
                    <UpdateMealModal
                        id={modalField.id}
                        label={modalField.label}
                        initialValue={modalField.value}
                        onClose={() => setModalField(null)}
                        onSave={handleUpdateMeal}
                    />
                )}
            </div>
        </div>
    );
};

export default MainPage;
