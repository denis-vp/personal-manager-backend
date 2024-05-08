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

describe("Test to delete a task", () => {
  test("It should respond with the DELETE method to delete a task", (done) => {
    request(server)
      .delete("/tasks/testTaskId1")
      .then((response) => {
        expect(response.statusCode).toBe(204);
        done();
      });
  });
  test("It should respond with the DELETE method on a specific task that does not exist", (done) => {
    request(server)
      .delete("/tasks/wrongId")
      .then((response) => {
        expect(response.statusCode).toBe(404);
        expect(response.body).toStrictEqual({ message: "Task not found" });
        done();
      });
  });
});
