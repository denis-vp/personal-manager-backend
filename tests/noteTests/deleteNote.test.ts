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

describe("Test to delete notes", () => {
  test("It should respond with the DELETE method to delete a note", (done) => {
    request(server)
      .delete("/notes/testId1")
      .then((response) => {
        expect(response.statusCode).toBe(204);
        done();
      });
  });
  test("It should respond with the DELETE method on a specific note that does not exist", (done) => {
    request(server)
      .delete("/notes/wrongId")
      .then((response) => {
        expect(response.statusCode).toBe(404);
        expect(response.body).toStrictEqual({ message: "Note not found" });
        done();
      });
  });
});
