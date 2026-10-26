const express = require("express");
const documents = require("../data/docs.json");
const { findBestDocument } = require("./retriever");

const app = express();
app.use(express.json());

// Home route: shows the API is running
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Document Q&A API is running" });
});

// Main route: answer a question
app.post("/ask", (req, res) => {
  const question = req.body?.question;

  // 1. Check the question is valid
  if (typeof question !== "string" || question.trim() === "") {
    return res.status(400).json({ error: "Please send a non-empty 'question' text." });
  }

  // 2. Find the best document
  const result = findBestDocument(question, documents);

  // 3. No match: send the fallback
  if (result === null) {
    return res.status(200).json({
      answer: "Sorry, I couldn't find an answer in the documents.",
      documentId: null,
    });
  }

  // 4. Match found: send the answer and the document ID
  res.status(200).json({
    answer: result.document.content,
    documentId: result.document.id,
  });
});

// Unknown route
app.use((req, res) => {
  res.status(404).json({ error: "Route not found." });
});

// Errors. It must have 4 parameters.
app.use((err, req, res, next) => {
  if (err.status === 400) {
    return res.status(400).json({ error: "Request body is not valid JSON." });
  }
  res.status(500).json({ error: "Something went wrong on the server." });
});

module.exports = app;