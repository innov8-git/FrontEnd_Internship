import { INTENTS, CLOSING_KEYWORDS, CLOSING_MESSAGE, UNKNOWN_MESSAGE } from '../data/chatbotIntents';

/**
 * Keyword-based intent matcher.
 *
 * Scoring algorithm:
 * 1. Normalize user input (lowercase, strip punctuation).
 * 2. For each intent, count how many of its keywords appear in the input.
 * 3. Multi-word keywords ("merge conflict") get a 2× bonus.
 * 4. Exact keyword matches get a 1.5× bonus.
 * 5. The intent with the highest weighted score wins.
 * 6. A minimum threshold of 1.0 is required to avoid false matches.
 */

const MIN_SCORE_THRESHOLD = 1.0;

function normalize(text) {
  return String(text ?? '')
    .toLowerCase()
    .replace(/['']/g, "'")
    .replace(/[^\w\s'.-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(text) {
  return normalize(text).split(' ').filter(Boolean);
}

/**
 * Score a single intent against user input.
 * Returns a number ≥ 0. Higher = better match.
 */
function scoreIntent(intent, normalizedInput, inputTokens) {
  let score = 0;

  for (const keyword of intent.keywords) {
    const normalizedKeyword = normalize(keyword);
    const isMultiWord = normalizedKeyword.includes(' ');

    if (isMultiWord) {
      // Multi-word phrase match (higher weight)
      if (normalizedInput.includes(normalizedKeyword)) {
        score += 3.0;
      }
    } else {
      // Single-word match
      if (inputTokens.includes(normalizedKeyword)) {
        // Exact token match
        score += 1.5;
      } else if (normalizedInput.includes(normalizedKeyword)) {
        // Substring match (partial)
        score += 0.75;
      }
    }
  }

  // Bonus: check if any sample question is very similar
  for (const sample of intent.sampleQuestions ?? []) {
    const normalizedSample = normalize(sample);
    if (normalizedInput === normalizedSample) {
      score += 5.0; // Exact sample match
    } else if (normalizedInput.includes(normalizedSample) || normalizedSample.includes(normalizedInput)) {
      score += 2.0; // Substring of a sample
    }
  }

  return score;
}

/**
 * Match user input to the best intent.
 * Returns { intent, score } or null if no match above threshold.
 */
export function matchIntent(userInput) {
  const normalizedInput = normalize(userInput);
  if (!normalizedInput) return null;

  // Check for closing / thank-you messages first
  const isClosing = CLOSING_KEYWORDS.some((kw) => normalizedInput.includes(normalize(kw)));
  if (isClosing) {
    return { intent: { id: 'CLOSING', answer: CLOSING_MESSAGE }, score: 10 };
  }

  const inputTokens = tokenize(userInput);

  let bestMatch = null;
  let bestScore = 0;

  for (const intent of INTENTS) {
    const score = scoreIntent(intent, normalizedInput, inputTokens);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = intent;
    }
  }

  if (bestScore >= MIN_SCORE_THRESHOLD && bestMatch) {
    return { intent: bestMatch, score: bestScore };
  }

  return null;
}

/**
 * Get the chatbot response for a user message.
 * Returns the answer string (markdown).
 */
export function getChatbotResponse(userInput) {
  const match = matchIntent(userInput);
  if (match) return match.intent.answer;
  return UNKNOWN_MESSAGE;
}

/**
 * Get intents filtered by category.
 */
export function getIntentsByCategory(categoryId) {
  return INTENTS.filter((intent) => intent.category === categoryId);
}



/**
 * Retrieve related questions based on the matched intent and current query.
 * Gathers other questions from the same intent, plus sibling intents in the same category.
 */
export function getRelatedQuestions(matchedIntent, currentQuery, limit = 5) {
  if (!matchedIntent || matchedIntent.id === 'CLOSING') {
    return [
      'Which internships are available?',
      'How does the assessment discount work?',
      'What are the available internship durations?',
      'How does mentor code review work?',
      'When is the completion certificate issued?',
    ];
  }

  const normalizedCurrent = String(currentQuery ?? '').toLowerCase().trim();
  const results = [];

  // 1. Other sample questions from the matched intent itself
  for (const q of matchedIntent.sampleQuestions ?? []) {
    if (q.toLowerCase().trim() !== normalizedCurrent && !results.includes(q)) {
      results.push(q);
    }
  }

  // 2. Questions from other intents in the same category
  const siblingIntents = INTENTS.filter(
    (i) => i.category === matchedIntent.category && i.id !== matchedIntent.id,
  );
  for (const intent of siblingIntents) {
    for (const q of intent.sampleQuestions ?? []) {
      if (q.toLowerCase().trim() !== normalizedCurrent && !results.includes(q)) {
        results.push(q);
        if (results.length >= limit) break;
      }
    }
    if (results.length >= limit) break;
  }

  // 3. Fallback questions if fewer than limit
  if (results.length < limit) {
    const popularFallbacks = [
      'Which internships are available?',
      'How can I register?',
      'How does the assessment discount work?',
      'How do I submit tasks on GitHub?',
      'How do mentors review my code?',
    ];
    for (const q of popularFallbacks) {
      if (q.toLowerCase().trim() !== normalizedCurrent && !results.includes(q)) {
        results.push(q);
        if (results.length >= limit) break;
      }
    }
  }

  return results.slice(0, limit);
}
