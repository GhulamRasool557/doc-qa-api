# Mini Document Q&A API

A small backend API that answers questions using 10 short FAQ documents.
You send a question to `POST /ask`, it finds the most relevant document using
keyword matching, and returns the answer with the document's ID.
If no document matches, it returns a fallback message.

**Live URL:** https://doc-qa-api.vercel.app

## Tech used

- Node.js and Express
- Jest and Supertest for testing
- Deployed on Vercel (`api/index.js` + `vercel.json`)

## How to run it

You need Node.js installed.

```bash
npm install
npm start
```

The server runs on http://localhost:3000.
For development, `npm run dev` restarts the server automatically when files change (uses nodemon).

## How to run the tests

```bash
npm test
```

The tests are in `test/ask.test.js`. They check:

- a library question returns `doc-2`
- an unrelated question returns the fallback (`documentId: null`)
- an empty question returns 400
- broken JSON returns 400
- an unknown route returns 404

## API

### POST /ask

Request body:

```json
{ "question": "When does the library close?" }
```

Response (200):

```json
{
  "answer": "The library is open from 8am to 8pm, Monday to Saturday. ...",
  "documentId": "doc-2"
}
```

If no document matches (200):

```json
{
  "answer": "Sorry, I couldn't find an answer in the documents.",
  "documentId": null
}
```

### Errors

| Case | Status | Message |
|---|---|---|
| question missing, empty or not text | 400 | Please send a non-empty 'question' text. |
| body is not valid JSON | 400 | Request body is not valid JSON. |
| unknown route | 404 | Route not found. |
| unexpected server error | 500 | Something went wrong on the server. |

## How it works

1. The question is lowercased, punctuation is removed, and it is split into words.
2. Common words like "the", "is", "what" (stop words) are removed.
3. Each document gets a score: how many question words appear in its title, content or keywords.
4. The document with the highest score is returned. If no document matches, the fallback is returned.

## Project structure

```
data/docs.json      the 10 documents
src/retriever.js    tokenize, scoreDocument, findBestDocument
src/app.js          Express app: routes, validation, error handling
src/server.js       starts the server
test/ask.test.js    Jest + Supertest tests
```

## Limitations

Keyword matching does not understand synonyms ("cost" vs "fee") or different word
forms ("start" vs "starts"). It could be improved with keyword weighting, stemming,
TF-IDF, or an LLM.
