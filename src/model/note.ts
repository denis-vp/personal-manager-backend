export type Note = {
    id: string;
    title: string;
    category: string;
    content: string;
    date: string;
    associatedTaskId: string | null;
};