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

describe("Test to update notes", () => {
  test("It should respond with the PATCH method on a note", (done) => {
    request(server)
      .patch("/notes/testId1")
      .send({
        id: "testId1",
        title: "An Updated Note",
        category: "todos",
        content: "This is an updated note",
        date: new Date().toISOString().slice(0, 10),
        associatedTaskId: "testTaskId1",
      })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual({
          id: "testId1",
          title: "An Updated Note",
          category: "todos",
          content: "This is an updated note",
          date: response.body.date,
          associatedTaskId: "testTaskId1",
        });
        done();
      });
  }),
    test("It should respond with the PATCH method on a note that does not exist", (done) => {
      request(server)
        .patch("/notes/wrongId")
        .send({
          title: "An Updated Note",
          category: "todos",
          content: "This is an updated note",
          date: new Date().toISOString().slice(0, 10),
          associatedTaskId: "testTaskId1",
        })
        .then((response) => {
          expect(response.statusCode).toBe(404);
          expect(response.body).toStrictEqual({ message: "Note not found" });
          done();
        });
    });
});
