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

describe("Test to create notes", () => {
  test("It should respond with the POST method to create a note", (done) => {
    request(server)
      .post("/notes/create")
      .send({
        id: "",
        title: "A Note",
        category: "todos",
        content: "This is a note",
        date: new Date().toISOString().slice(0, 10),
        associatedTaskId: "testTaskId1",
      })
      .then((response) => {
        expect(response.statusCode).toBe(201);
        expect(response.body).toStrictEqual({
          id: response.body.id,
          title: "A Note",
          category: "todos",
          content: "This is a note",
          date: response.body.date,
          associatedTaskId: "testTaskId1",
        });
        done();
      });
  });
});
