import { Note } from "../model/note";

export const validateNote = (note: Note) => {
    const errors = [];

    if (note.title === "") errors.push("title is empty");
    if (note.content === "") errors.push("content is empty");

    if (errors.length > 0) {
        throw new Error(errors.join(", "));
    };
}