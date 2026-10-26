// Vercel entry point: Vercel runs this file as a serverless function.
// It reuses the same Express app as src/server.js.
const app = require("../src/app");

module.exports = app;
