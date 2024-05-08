import { Task } from "../../src/model/task";
import taskRepository from "../../src/repository/taskRepository";

const taskFactory = (
  id: string,
  title: string,
  category: string,
  content: string,
  isFinished: boolean,
  dueDate: string,
  priority: string
): Task => {
  return {
    id: id,
    title: title,
    category: category,
    content: content,
    isFinished: isFinished,
    dueDate: dueDate,
    priority: priority,
  };
};

const prepareTaskTestData = () => {
  taskRepository.addTask(
    taskFactory(
      "testTaskId1",
      "A Task",
      "todos",
      "This is a task",
      false,
      new Date().toISOString().slice(0, 10),
      "high"
    )
  );
  taskRepository.addTask(
    taskFactory(
      "testTaskId2",
      "Another Task",
      "todos",
      "This is another task",
      false,
      new Date().toISOString().slice(0, 10),
      "medium"
    )
  );
  taskRepository.addTask(
    taskFactory(
      "testTaskId3",
      "Yet Another Task",
      "todos",
      "This is yet another task",
      false,
      new Date().toISOString().slice(0, 10),
      "low"
    )
  );
};

export default prepareTaskTestData;