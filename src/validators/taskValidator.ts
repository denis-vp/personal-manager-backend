import { Task } from "../model/task";

export const validateTask = (task: Task) => {
    const errors = [];

    if (task.title === "") errors.push("title is empty");
    if (task.content === "") errors.push("content is empty");
    if (!["low", "medium", "high", ""].includes(task.priority)) errors.push("priority is invalid");

    if (errors.length > 0) {
        throw new Error(errors.join(", "));
    };
}