import { Task } from "../model/task";

export const validateTask = (task: Task) => {
    if (task.title === "") throw new Error("Invalid task: title is empty");
    if (task.content === "") throw new Error("Invalid task: content is empty");
    if (!["low", "medium", "high", ""].includes(task.priority)) throw new Error("Invalid task: priority is invalid");
}