import { Note } from "../../src/model/note";
import noteRepository from "../../src/repository/noteRepository";

const noteFactory = (
  id: string,
  title: string,
  category: string,
  content: string,
  date: string,
  associatedTaskId: string
): Note => {
  return {
    id: id,
    title: title,
    category: category,
    content: content,
    date: date,
    associatedTaskId: associatedTaskId,
  };
};

const prepareNoteTestData = () => {
  noteRepository.addNote(
    noteFactory(
      "testId1",
      "A Note",
      "todos",
      "This is a note",
      new Date().toISOString().slice(0, 10),
      "testTaskId1"
    )
  );
  noteRepository.addNote(
    noteFactory(
      "testId2",
      "Another Note",
      "todos",
      "This is another note",
      new Date().toISOString().slice(0, 10),
      "testTaskId1"
    )
  );
  noteRepository.addNote(
    noteFactory(
      "testId3",
      "Yet Another Note",
      "todos",
      "This is yet another note",
      new Date().toISOString().slice(0, 10),
      "testTaskId2"
    )
  );
};

export default prepareNoteTestData;
