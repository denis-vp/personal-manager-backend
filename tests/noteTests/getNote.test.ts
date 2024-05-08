import { beforeAll, afterAll, describe, expect, test } from "@jest/globals";
import server from "../../src/index";
import request from "supertest";
import prepareNoteTestData from "./prepareNoteTestData";

beforeAll(() => {
  prepareNoteTestData();
});

afterAll(() => {
  server.close();
});

describe("Test to get all notes", () => {
  test("It should respond with the GET method on all notes", (done) => {
    request(server)
      .get("/notes")
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        done();
      });
  });
});

describe("Test to get a specific note", () => {
  test("It should respond with the GET method on a specific note", (done) => {
    request(server)
      .get("/notes/testId1")
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual({
          id: "testId1",
          title: "A Note",
          category: "todos",
          content: "This is a note",
          date: response.body.date,
          associatedTaskId: "testTaskId1",
        });
        done();
      });
  });
  test("It should respond with the GET method on a specific note that does not exist", (done) => {
    request(server)
      .get("/notes/wrongId")
      .then((response) => {
        expect(response.statusCode).toBe(404);
        expect(response.body).toStrictEqual({ message: "Note not found" });
        done();
      });
  });
});
