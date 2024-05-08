export type Task = {
    id: string;
    title: string;
    category: string;
    content: string;
    isFinished: boolean;
    dueDate: string | null;
    priority: string;
};