import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import noteController from "./controller/noteController";
import taskController from "./controller/taskController";

dotenv.config();

const app: Express = express();
const port = process.env.NODE_ENV === "test" ? 0 : process.env.PORT;
app.use(cors());
const jsonParser = bodyParser.json();

// ----------------------------------- Ping Route -----------------------------------

app.get("/ping", (req: Request, res: Response) => {
    res.send("Server working!").status(200);
});

// ------------------------------------ Notes ---------------------------------------

app.get("/notes", noteController.getNotes);

app.get("/notes/task/:taskId", noteController.getNotesByTaskId);

app.get("/notes/unassociated", noteController.getUnassociatedNotes);

app.get("/notes/:id", noteController.getNote);

app.post("/notes/create", jsonParser, noteController.createNote);

app.patch("/notes/:id", jsonParser, noteController.updateNote);

app.delete("/notes/:id", noteController.deleteNote);

// ------------------------------------ Tasks ---------------------------------------

app.get("/tasks", taskController.getTasks);

app.get("/tasks/:id", taskController.getTask);

app.post("/tasks/create", jsonParser, taskController.createTask);

app.patch("/tasks/:id", jsonParser, taskController.updateTask);

app.delete("/tasks/:id", taskController.deleteTask);


const server = app.listen(port, () => {
  console.group();
  console.log(`Server started at port ${port}`);
  console.groupEnd();
});

export default server;