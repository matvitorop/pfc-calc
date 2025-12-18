/* export interface User {
    id: number;
    email: string;
    userName: string;
    age: Date;
    weight: number;
    height: number;
    activityCoefId: number;
    dietId: number;
    caloriesStandard: number;
} */

export const DefaultValues = {
    dietName: 'usual diet',
    CaloriesStandard: 3400,
    proteinPerc: 20,
    carbsPerc: 50,
    fatsPerc: 30,
};

export type UserFieldKey = 'email' | 'userName' | 'age' | 'weight' | 'height' | 'activityCoefId' | 'dietId' | 'caloriesStandard';

export const UserFieldMap: Record<UserFieldKey, string> = {
    email: 'email',
    userName: 'username',
    age: 'age',
    weight: 'weight',
    height: 'height',
    activityCoefId: 'activity_coef_id',
    dietId: 'diet_id',
    caloriesStandard: 'calories_standard',
};

export type timePeriodKey = 'DAILY' | 'WEEKLY' | 'MONTHLY';
export const timePeriodFieldMap: Record<timePeriodKey, string> = {
    DAILY: 'DAILY',
    WEEKLY: 'WEEKLY',
    MONTHLY: 'MONTHLY',
};
