import { Task } from "../model/task";

const tasks: Task[] = [];

export const getTasks = async (page: number = 0, pageSize: number = 0) => {
    return tasks;
};

export const getTask = async (id: string) => {
    const task = tasks.find(task => task.id === id);
    if (!task) {
        throw new Error("Task not found");
    }
    return task;
};

export const addTask = async (task: Task) => {
    tasks.push(task);
    return task;
};

export const updateTask = async (id: string, task: Task) => {
    const index = tasks.findIndex(task => task.id === id);
    if (index === -1) {
        throw new Error("Task not found");
    }
    tasks[index] = task;
    return task;
};

export const deleteTask = async (id: string) => {
    const index = tasks.findIndex(task => task.id === id);
    if (index === -1) {
        throw new Error("Task not found");
    }
    tasks.splice(index, 1);
};

export default { getTasks, getTask, addTask, updateTask, deleteTask };