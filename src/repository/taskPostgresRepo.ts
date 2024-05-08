import { Task } from "../model/task";
import pool from "../postgresDatabase";

export const getTasks = async (page: number, pageSize: number) => {
    const offset = (page - 1) * pageSize;
    const result = await pool.query('SELECT * FROM public."tasks" ORDER BY title OFFSET $1 LIMIT $2', [offset, pageSize]);
    return result.rows;
};

export const getTask = async (id: string) => {
    const result = await pool.query('SELECT * FROM public."tasks" WHERE id = $1', [id]);
    if (result.rowCount === 0) {
        throw new Error("Task not found");
    }
    return result.rows[0];
};

export const addTask = async (task: Task) => {
    const result = await pool.query('INSERT INTO public."tasks" (id, title, category, content, "isFinished", "dueDate", priority) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [task.id, task.title, task.category, task.content, task.isFinished, task.dueDate, task.priority]);
    if (result.rowCount === 0) {
        throw new Error("Task not added");
    }
    return result.rows[0];
};

export const updateTask = async (id: string, task: Task) => {
    const result = await pool.query('UPDATE public."tasks" SET title = $2, category = $3, content = $4, "isFinished" = $5, "dueDate" = $6, priority = $7 WHERE id = $1 RETURNING *', [id, task.title, task.category, task.content, task.isFinished, task.dueDate, task.priority]);
    if (result.rowCount === 0) {
        throw new Error("Task not found");
    }
    return result.rows[0];
};

export const deleteTask = async (id: string) => {
    await pool.query('UPDATE public."notes" SET "associatedTaskId" = NULL WHERE "associatedTaskId" = $1', [id]);
    const tasksResult = await pool.query('DELETE FROM public."tasks" WHERE id = $1', [id]);
    if (tasksResult.rowCount === 0) {
        throw new Error("Task not found");
    }
};

export default { getTasks, getTask, addTask, updateTask, deleteTask };