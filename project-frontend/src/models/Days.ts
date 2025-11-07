export interface Days {
    id: number;
    userId: number;
    day: string;
    mealTypeId: number;
    itemId: number;
    measurement: number;
    name: string | null;
    proteins: number | null;
    fats: number | null;
    carbs: number | null;
    description: string | null;
    apiId: number | null;
    calories: number | null;
}
