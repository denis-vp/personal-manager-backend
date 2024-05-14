import taskRepository from "../repository/taskRepository";
import { v4 as uuidv4 } from "uuid";
import { LoremIpsum } from "lorem-ipsum";
import { Note } from "../model/note";
import noteRepository from "../repository/noteRepository";

const generateNotes = async (count: number) => {
    const lorem = new LoremIpsum();
    for (let i = 0; i < count; i++) {
        const note: Note = {
            id: uuidv4(),
            title: `Note ${i + 1}`,
            category: `poetry`,
            content: lorem.generateSentences(Math.floor(Math.random() * 5) + 1),
            date: new Date().toISOString(),
            associatedTaskId: ""
        };
        noteRepository.addNote(note);
    }
};

generateNotes(100);