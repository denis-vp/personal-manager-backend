import { beforeAll, afterAll, describe, expect, test } from "@jest/globals";
import server from "../../src/index";
import request from "supertest";
import prepareTaskTestData from "./prepareTaskTestData";

beforeAll(() => {
  prepareTaskTestData();
});

afterAll(() => {
  server.close();
});

describe("Test to get all tasks", () => {
  test("It should respond with the GET method to get all tasks", (done) => {
    request(server)
      .get("/tasks")
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        done();
      });
  });
});

describe("Test to get a specific task", () => {
  test("It should respond with the GET method to get a specific task", (done) => {
    request(server)
      .get("/tasks/testTaskId1")
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual({
          id: "testTaskId1",
          title: "A Task",
          category: "todos",
          content: "This is a task",
          isFinished: false,
          dueDate: response.body.dueDate,
          priority: "high",
        });
        done();
      });
  });
  test("It should respond with the GET method on a specific task that does not exist", (done) => {
    request(server)
      .get("/tasks/wrongId")
      .then((response) => {
        expect(response.statusCode).toBe(404);
        expect(response.body).toStrictEqual({ message: "Task not found" });
        done();
      });
  });
});
