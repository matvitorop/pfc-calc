import React, { type FC, useEffect, useMemo, useRef, useState } from 'react';
import { Calendar, Plus, TrendingUp, BarChart3, Edit2, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { createMeal, deleteMeal, updateMeal } from '../store/reducers/mealTypeSlice';
import UpdateMealModal from './UpdateMealModal';
import AddMealTypeForm from './AddMealTypeForm';
import { deleteItemFromSummary, updateItemSummary } from '../store/reducers/summarySlice';
import { useFetchMealTypes } from '../hooks/fetchMealTypes';
import { useFetchSummary } from '../hooks/fetchSummary';
import { useFetchDiets_ActCoefsData } from '../hooks/fetchDiets&ActCoefs';
import { useFetchUserData } from '../hooks/fetchUserData';
import LoadingPage from './LoadingPage';
import ErrorPage from './ErrorPage';
import SearchItem from './Items/SearchItem';
import type { Diet } from '../store/diets/dietSlice';
import { DefaultValues } from '../store/types';
import type { Days } from '../models/Days';
import { useNavigate } from 'react-router-dom';

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

/* interface Meal {
    id: number;
    name: string;
    calories: number;
    icon: string;
} */

/*
    ^ make global array state for showing list of product for specific meal ( in format  [{mealid:334,isShown:true/false}  ])
    
    */
interface FoodList {
    id: number;
    isShown: boolean;
}

const MainPage: FC = () => {
    const mealIcons = [{ icon: '🥐' }, { icon: '🍜' }, { icon: '🍝' }]; //^ change on func or just del

    const dispatch = useAppDispatch();
    //=============  fetches  =====================
    const mealsInfo = useFetchMealTypes();
    const daysInfo = useFetchSummary();
    const diets_coefs = useFetchDiets_ActCoefsData();
    const userInfo = useFetchUserData();
    //==============================================

    //===========   status + darkTheme =============
    const darkTheme = useAppSelector(state => state.themeReducer.isDarkTheme);
    const isLoading = mealsInfo.isLoading || daysInfo.isLoading || diets_coefs.isLoading || userInfo.isLoading;
    const hasError = mealsInfo.hasError || daysInfo.hasError || diets_coefs.hasError || userInfo.hasError;
    //================================================
    //*only for testing:  console.log(isLoading, hasError); */

    // ==================   summary calculation =============================
    const calculateTotals = () => {
        // console.log(!daysInfo.days.data, !Array.isArray(daysInfo.days.data));

        if (!daysInfo.days.data || !Array.isArray(daysInfo.days.data)) {
            return { calories: 0, proteins: 0, fats: 0, carbs: 0 };
        }
        /*  console.log(daysInfo.days.data); */
        return daysInfo.days.data.reduce(
            (acc, item) => ({
                calories: acc.calories + (item.calories || 0) * (item.measurement / 100),
                proteins: acc.proteins + (item.proteins || 0) * (item.measurement / 100),
                fats: acc.fats + (item.fats || 0) * (item.measurement / 100),
                carbs: acc.carbs + (item.carbs || 0) * (item.measurement / 100),
            }),
            { calories: 0, proteins: 0, fats: 0, carbs: 0 },
        );
    };
    const totals = calculateTotals();
    const userDiet: Diet[] = diets_coefs.diets.data.filter(el => el.id === userInfo.user.data?.dietId);
    // ^ in future maybe del
    if (userDiet[0] == undefined) {
        userDiet[0] = {
            id: 1,
            name: DefaultValues.dietName,
            proteinPerc: DefaultValues.proteinPerc,
            fatsPerc: DefaultValues.fatsPerc,
            carbsPerc: DefaultValues.carbsPerc,
            description: '',
        };
    }

    const calorieData = useMemo<CalorieData>(
        () => ({
            consumed: parseFloat(totals.calories.toFixed(1)),
            goal: userInfo.user.data?.caloriesStandard || DefaultValues.CaloriesStandard,
            protein: {
                current: parseFloat(totals.proteins.toFixed(2)),
                goal:
                    userInfo.user.data?.caloriesStandard > 0
                        ? parseFloat(((userInfo.user.data?.caloriesStandard * userDiet[0].proteinPerc) / 100 / 4).toFixed(2))
                        : parseFloat(((DefaultValues.CaloriesStandard * userDiet[0].proteinPerc) / 100 / 4).toFixed(2)),
            },
            fats: {
                current: parseFloat(totals.fats.toFixed(2)),
                goal:
                    userInfo.user.data?.caloriesStandard > 0
                        ? parseFloat(((userInfo.user.data?.caloriesStandard * userDiet[0].fatsPerc) / 100 / 9).toFixed(2))
                        : parseFloat(((DefaultValues.CaloriesStandard * userDiet[0].fatsPerc) / 100 / 9).toFixed(2)),
            },
            carbs: {
                current: parseFloat(totals.carbs.toFixed(2)),
                goal:
                    userInfo.user.data?.caloriesStandard > 0
                        ? parseFloat(((userInfo.user.data?.caloriesStandard * userDiet[0].carbsPerc) / 100 / 4).toFixed(2))
                        : parseFloat(((DefaultValues.CaloriesStandard * userDiet[0].carbsPerc) / 100 / 4).toFixed(2)),
            },
        }),
        [totals, userInfo.user.data?.caloriesStandard, userDiet[0]],
    );

    const calculatePercentage = (current: number, goal: number): number => {
        return Math.min((current / goal) * 100, 100);
    };
    const caloriePercentage = calculatePercentage(calorieData.consumed, calorieData.goal);
    const circumference = 2 * Math.PI * 70;
    //=============================================================

    // =========== calculations for mealType ======================
    const calcMealTypeCalories = (mealId: number) => {
        if (!daysInfo.days.data || !Array.isArray(daysInfo.days.data)) {
            return 0;
        }
        const result = daysInfo.days.data
            .filter(item => item.mealTypeId === mealId)
            .reduce((acc, item) => acc + (item.calories || 0) * (item.measurement / 100), 0);

        return parseFloat(result.toFixed(1));
    };

    //==================== change mealType measurement =======================================

    const openUpdateMeasurementModal = (id: number, name: string, measurement: number) => {
        setModalField({ id: id, label: name, value: null, measurement });
    };

    const handleUpdateMeasurement = (newValue: string) => {
        if (modalField) {
            dispatch(updateItemSummary({ id: modalField.id, measurement: parseFloat(newValue) }));
            setModalField(null);
        }
    };

    // ==================   adding meal type =============================

    const [modalField, setModalField] = useState<{ id: number; label: string; value: string | null; measurement: number | null } | null>(null);

    const handleAddMealType = (newMealName: string) => {
        if (newMealName !== null || newMealName !== '') {
            dispatch(createMeal(newMealName));
        }
    };
    const onCloseAddingMealTypeForm = () => {
        setShowAddMeal(!showAddMeal);
    };
    const [showAddMeal, setShowAddMeal] = useState(false);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);

    //==================   update meal type =============================
    const openUpdateMealTypeModal = (id: number, label: string, value: string) => {
        setOpenMenuId(null);
        setModalField({ id, label, value, measurement: null });
    };

    const handleUpdateMealType = (newValue: string) => {
        if (modalField) {
            dispatch(updateMeal({ id: modalField.id, name: newValue }));
            setModalField(null);
        }
    };

    //==============  delete meal type =========================
    const handleDeleteMealType = (id: number) => {
        setOpenMenuId(null);
        dispatch(deleteMeal(id));
    };
    //==========================================================

    // ===================    food lists ===============================
    const [openFoodList, setOpenFoodList] = useState<FoodList[] | null>(null);
    const [quickAddMealId, setQuickAddMealId] = useState<number | null>(null);

    useEffect(() => {
        if (mealsInfo.meals.mealTypes.length > 0) {
            setOpenFoodList(
                mealsInfo.meals.mealTypes.map(el => ({
                    id: el.id,
                    isShown: false,
                })),
            );
        }
    }, [mealsInfo.meals.mealTypes]);

    const handleShowFoodList = (id: number) => {
        setOpenFoodList(prev => prev && prev.map(item => (item.id === id ? { ...item, isShown: !item.isShown } : item)));
    };

    //================== handling  click  =======================
    const menuRefs = useRef<Record<number, HTMLDivElement | null>>({});

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (openMenuId === null) return;

            const activeRef = menuRefs.current[openMenuId];
            if (!activeRef) return;

            if (!activeRef.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openMenuId]);

    // ============ page navigation ====================

    const navigate = useNavigate();
    const handleNavigateToProfile = () => {
        navigate('/profile');
    };
    const navigateToReports = () => {
        navigate('/reports');
    };
    // ==================================================

    if (hasError) {
        return <ErrorPage />;
    }

    if (isLoading || !daysInfo.days.data || !mealsInfo.meals.mealTypes || !userInfo.user.data) {
        return (
            <LoadingPage />
            /* <div className={`main-page ${darkTheme ? 'dark-theme' : ''}`}>
                <div className="main-container">
                    <div className="main-page__loading">
                        <span>loading ...</span>
                    </div>
                </div>
            </div> */
        );
    }

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
                        <span className="streak-count">{userInfo.user.data?.visitsStreak || 0}</span>
                    </div>
                </div>
                <div className="main-page__scroll-container">
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
                    <div className="meals-section">
                        <SearchItem mealTypes={mealsInfo.meals.mealTypes} />
                    </div>

                    {/* Meals Section */}
                    <div className="meals-section">
                        <div className="meals-header">
                            <h2 className="section-title">Meals</h2>
                            <button className="add-meal-btn" aria-label="Add new meal" onClick={() => setShowAddMeal(!showAddMeal)}>
                                <Plus size={20} />
                            </button>
                        </div>
                        {showAddMeal && <AddMealTypeForm initialValue="" onClose={onCloseAddingMealTypeForm} onSave={handleAddMealType} />}
                        <div className="meals-list">
                            {mealsInfo.meals.mealTypes &&
                                Array.isArray(mealsInfo.meals.mealTypes) &&
                                mealsInfo.meals.mealTypes.map(meal => (
                                    <div key={meal.id}>
                                        <div
                                            className="meal-card"
                                            ref={el => {
                                                menuRefs.current[meal.id] = el;
                                            }}
                                            onClick={e => {
                                                handleShowFoodList(meal.id);
                                            }}
                                        >
                                            <div className="meal-card-body">
                                                <div className="meal-info">
                                                    {/*  <button
                                                    className="meal-show-menu"
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        setOpenMenuId(openMenuId === meal.id ? null : meal.id);
                                                    }}
                                                >
                                                    ⋮
                                                </button> */}
                                                    <span className="meal-icon">{/*meal.icon*/}</span>
                                                    <div className="meal-details">
                                                        <div className="meal-name">{meal.name}</div>
                                                        <div className="meal-calories">{calcMealTypeCalories(meal.id)} kcal</div>
                                                    </div>
                                                </div>
                                                <button
                                                    className="meal-add-btn"
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        setQuickAddMealId(meal.id);
                                                    }}
                                                    aria-label={`Add ${meal.name}`}
                                                >
                                                    <Plus size={24} />
                                                </button>
                                            </div>
                                            <div className="dropdown-menu">
                                                <button onClick={() => openUpdateMealTypeModal(meal.id, 'meal', meal.name)} className="menu-item">
                                                    <Edit2 size={16} /> Edit
                                                </button>
                                                <button onClick={() => handleDeleteMealType(meal.id)} className="menu-item delete">
                                                    <Trash2 size={16} /> Delete
                                                </button>
                                            </div>
                                        </div>

                                        <div className="meal-foods">
                                            {openFoodList?.find(el => el.id === meal.id)?.isShown && daysInfo.days.data
                                                ? daysInfo.days.data
                                                      .filter(el => el.mealTypeId == meal.id)
                                                      .map(el => (
                                                          <div key={el.id} className="meal-foods__item item-meal-foods">
                                                              <h3 className="item-meal-foods__title">{el.name}</h3>
                                                              <div className="item-meal-foods__body">
                                                                  <span className="item-meal-foods__el">Proteins:{el.proteins}</span>
                                                                  <span className="item-meal-foods__el">Fats:{el.fats}</span>
                                                                  <span className="item-meal-foods__el">Carbs:{el.carbs}</span>
                                                                  <span className="item-meal-foods__el">Cal:{el.calories}</span>
                                                                  <span className="item-meal-foods__el">Measurement: {el.measurement}g</span>
                                                                  <div className="item-meal-foods__btns">
                                                                      <button
                                                                          onClick={() =>
                                                                              openUpdateMeasurementModal(el.id, el.name || 'meal', el.measurement)
                                                                          }
                                                                          className="item-meal-foods__edit"
                                                                      >
                                                                          <Edit2 size={16} />
                                                                      </button>
                                                                      <button
                                                                          onClick={() => dispatch(deleteItemFromSummary(el.id))}
                                                                          className="item-meal-foods__del"
                                                                      >
                                                                          <Trash2 size={16} />
                                                                      </button>
                                                                  </div>
                                                              </div>
                                                          </div>
                                                      ))
                                                : ''}
                                        </div>
                                    </div>
                                ))}
                        </div>
                        {quickAddMealId !== null && (
                            <div className="modal-overlay" onClick={() => setQuickAddMealId(null)}>
                                <div className="modal-card" onClick={e => e.stopPropagation()}>
                                    <SearchItem
                                        mealTypes={mealsInfo.meals.mealTypes}
                                        defaultMealTypeId={quickAddMealId}
                                        disableCreate={true}
                                        onClose={() => setQuickAddMealId(null)}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Navigation */}
                <div className="bottom-nav">
                    <button className="nav-btn" onClick={handleNavigateToProfile} aria-label="Go to profile">
                        <TrendingUp size={24} />
                        <span>Profile</span>
                    </button>
                    <button className="nav-btn" aria-label="Diary">
                        <div className="active-btn-circle">
                            <Calendar size={24} />
                        </div>
                        <span>Diary</span>
                    </button>
                    <button
                        className="nav-btn"
                        aria-label="Go to reports"
                        onClick={() => {
                            navigateToReports();
                        }}
                    >
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
                        measurement={modalField.measurement}
                        onClose={() => setModalField(null)}
                        onSave={modalField.measurement === null ? handleUpdateMealType : handleUpdateMeasurement}
                    />
                )}
            </div>
        </div>
    );
};

export default MainPage;
