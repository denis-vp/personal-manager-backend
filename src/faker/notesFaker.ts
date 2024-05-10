import taskRepository from "../repository/taskRepository";
import { v4 as uuidv4 } from "uuid";
import { LoremIpsum } from "lorem-ipsum";
import { Note } from "../model/note";
import noteRepository from "../repository/noteRepository";

const generateNotes = async (count: number) => {
    const lorem = new LoremIpsum();
    const tasks = await taskRepository.getTasks(1, 100);

    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        for (let j = 0; j < count; j++) {
            const note: Note = {
                id: uuidv4(),
                title: `Note ${i + 1} - ${j + 1}`,
                category: `poetry`,
                content: lorem.generateSentences(Math.floor(Math.random() * 5) + 1),
                date: new Date().toISOString(),
                associatedTaskId: task.id,
            };
            noteRepository.addNote(note);
        }
    }
};

generateNotes(2);