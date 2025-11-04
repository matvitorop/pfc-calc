export interface User {
    id: number;
    email: string;
    userName: string;
    age: Date;
    weight: number;
    height: number;
    activityCoefId: number;
    dietId: number;
    caloriesStandard: number;
}

export type UserFieldKey = 'email' | 'userName' | 'age' | 'weight' | 'height' | 'activityCoefId' | 'dietId' | 'caloriesStandard';

export const UserFieldMap: Record<UserFieldKey, string> = {
    email: 'email',
    userName: 'userName',
    age: 'age',
    weight: 'weight',
    height: 'height',
    activityCoefId: 'activityCoefId',
    dietId: 'dietId',
    caloriesStandard: 'caloriesStandard',
};
