const STOP_WORDS = new Set([
  "a", "an", "the", "is", "are", "was", "were", "be", "been", "am",
  "i", "me", "my", "you", "your", "we", "our", "they", "their", "it", "its",
  "what", "when", "where", "who", "which", "why", "how",
  "do", "does", "did", "can", "could", "should", "would", "will", "must",
  "to", "of", "in", "on", "at", "for", "from", "by", "with", "about",
  "and", "or", "but", "if", "so", "not", "no",
  "this", "that", "these", "those", "there", "here",
  "any", "some", "tell", "please",
]);

function tokenize(text) {
    return text 
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 1 && !STOP_WORDS.has(word));
}

// Count how many of the question's words appear in one document.
function scoreDocument(questionWords, doc) {
  const keywords = doc.keywords ?? [];
  const docText = `${doc.title} ${doc.content} ${keywords.join(" ")}`;
  const docWords = new Set(tokenize(docText));

  let score = 0;
  for (const word of questionWords) {
    if (docWords.has(word)) {
      score++;
    }
  }
  return score;
}

// A document needs at least this score to count as an answer.
const MIN_SCORE = 1;

// Find the document that best matches the question.
// Returns { document, score }, or null if nothing matches.
function findBestDocument(question, documents) {
  const questionWords = [...new Set(tokenize(question))];
  if (questionWords.length === 0) {
    return null;
  }

  let bestDocument = null;
  let bestScore = 0;

  for (const doc of documents) {
    const score = scoreDocument(questionWords, doc);
    if (score > bestScore) {
      bestScore = score;
      bestDocument = doc;
    }
  }

  if (bestDocument === null || bestScore < MIN_SCORE) {
    return null;
  }
  return { document: bestDocument, score: bestScore };
}



module.exports = {
  tokenize,
  scoreDocument,
  findBestDocument,
};