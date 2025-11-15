export interface Note 
{
    id: number;
    userId: number;
    title: string;
    dueDate: string | null;
    isCompleted: boolean;
    completedDate: string | null;
}