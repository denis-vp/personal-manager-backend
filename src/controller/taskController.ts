import taskRepository from "../repository/taskRepository";
import { Request, Response } from "express";
import { validateTask } from "../validators/taskValidator";
import { v4 as uuidv4 } from "uuid";

export const getTasks = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.limit as string) || 25;

  try {
    const tasks = await taskRepository.getTasks(page, pageSize);
    res.status(200).json(tasks);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getTask = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const task = await taskRepository.getTask(id);
    res.status(200).json(task);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const createTask = async (req: Request, res: Response) => {
  const task = req.body;
  try {
    validateTask(task);
    task.id = uuidv4();
    const createdTask = await taskRepository.addTask(task);
    res.status(201).json(createdTask);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  const task = req.body;
  const id = req.params.id;
  try {
    validateTask(task);
    const updatedTask = await taskRepository.updateTask(id, task);
    res.status(200).json(updatedTask);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    await taskRepository.deleteTask(id);
    res.status(204).send();
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export default { getTasks, getTask, createTask, updateTask, deleteTask };