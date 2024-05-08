import { Note } from "../model/note";

export const validateNote = (note: Note) => {
    if (note.title === "") throw new Error("Invalid note: title is empty");
    if (note.content === "") throw new Error("Invalid note: content is empty");
}