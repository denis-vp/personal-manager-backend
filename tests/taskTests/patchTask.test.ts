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

describe("Test to create a task", () => {
  test("It should respond with the PATCH method to update a task", (done) => {
    request(server)
      .patch("/tasks/testTaskId1")
      .send({
        id: "testTaskId1",
        title: "A Task",
        category: "todos",
        description: "This is an updated task",
        isFinished: false,
        dueDate: new Date().toISOString().slice(0, 10),
        priority: "high",
      })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual({
          id: response.body.id,
          title: "A Task",
          category: "todos",
          description: "This is an updated task",
          isFinished: false,
          dueDate: response.body.dueDate,
          priority: "high",
        });
        done();
      });
  });
});
