import { Task } from "../model/task";
import { v4 as uuidv4 } from "uuid";
import { LoremIpsum } from "lorem-ipsum";
import taskRepository from "../repository/taskRepository";

export const generateTasks = (count: number) => {
    const lorem = new LoremIpsum();
    const priorities = [`low`, `medium`, `high`];

    for (let i = 0; i < count; i++) {
        const task: Task = {
            id: uuidv4(),
            title: `Task ${i + 1}`,
            category: `poetry`,
            content: lorem.generateSentences(Math.floor(Math.random() * 5) + 1),
            isFinished: Math.random() >= 0.5,
            dueDate: null,
            priority: priorities[Math.floor(Math.random() * priorities.length)],
        };

        taskRepository.addTask(task);
    }
}

generateTasks(100);