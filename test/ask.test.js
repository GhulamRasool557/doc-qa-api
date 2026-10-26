const request = require("supertest");
const app = require("../src/app");

describe("POST /ask", () => {
  test("answers a library question with doc-2", async () => {
    const res = await request(app)
      .post("/ask")
      .send({ question: "When does the library close?" });

    expect(res.status).toBe(200);
    expect(res.body.documentId).toBe("doc-2");
  });

  test("returns the fallback when nothing matches", async () => {
    const res = await request(app)
      .post("/ask")
      .send({ question: "What is the capital of France?" });

    expect(res.status).toBe(200);
    expect(res.body.documentId).toBe(null);
  });

  test("rejects an empty question with 400", async () => {
    const res = await request(app)
      .post("/ask")
      .send({ question: "" });

    expect(res.status).toBe(400);
  });

  test("rejects broken JSON with 400", async () => {
    const res = await request(app)
      .post("/ask")
      .set("Content-Type", "application/json")
      .send('{"question": "library"');

    expect(res.status).toBe(400);
  });

  test("returns 404 for an unknown route", async () => {
    const res = await request(app).get("/hello");

    expect(res.status).toBe(404);
  });
});
