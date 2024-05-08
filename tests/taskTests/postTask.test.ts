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

describe("Test to create tasks", () => {
  test("It should respond with the POST method to create a task", (done) => {
    request(server)
      .post("/tasks/create")
      .send({
        id: "",
        title: "A Task",
        category: "todos",
        content: "This is a task",
        isFinished: false,
        dueDate: new Date().toISOString().slice(0, 10),
        priority: "high",
      })
      .then((response) => {
        expect(response.statusCode).toBe(201);
        expect(response.body).toStrictEqual({
          id: response.body.id,
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
});
