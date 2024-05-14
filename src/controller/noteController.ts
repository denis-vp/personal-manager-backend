import noteRepository from "../repository/noteRepository";
import { Request, Response } from "express";
import { validateNote } from "../validators/noteValidator";
import { v4 as uuidv4 } from "uuid";

export const getNotes = async (req: Request, res: Response) => {
  const titleSortOrder  = req.params.titleSortOrder;
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.limit as string) || 25;

  try {
    const notes = await noteRepository.getNotes(page, pageSize);

    // TODO: move the sorting logic to the repository
    if (titleSortOrder === "ASC") {
      notes.sort((a, b) => a.title.localeCompare(b.title));
    } else if (titleSortOrder === "DESC") {
      notes.sort((a, b) => b.title.localeCompare(a.title));
    }

    res.status(200).json(notes);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getNotesByTaskId = async (req: Request, res: Response) => {
  const taskId = req.params.taskId;
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.limit as string) || 25;

  try {
      const notes = await noteRepository.getNotesByTaskId(taskId, page, pageSize);
      res.status(200).json(notes);
  } catch (error: any) {
      res.status(400).json({ message: error.message });
  }
};

export const getUnassociatedNotes = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.limit as string) || 25;
  
  try {
    const notes = await noteRepository.getUnassociatedNotes(page, pageSize);
    res.status(200).json(notes);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export const getNote = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const note = await noteRepository.getNote(id);
    res.status(200).json(note);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const createNote = async (req: Request, res: Response) => {
  const note = req.body;
  try {
    validateNote(note);
    note.id = uuidv4();
    const createdNote = await noteRepository.addNote(note);
    res.status(201).json(createdNote);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateNote = async (req: Request, res: Response) => {
  const note = req.body;
  const id = req.params.id;
  try {
    validateNote(note);
    const updatedNote = await noteRepository.updateNote(id, note);
    res.status(200).json(updatedNote);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteNote = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    await noteRepository.deleteNote(id);
    res.status(204).send();
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export default { getNotes, getNotesByTaskId, getUnassociatedNotes, getNote, createNote, updateNote, deleteNote };