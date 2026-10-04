import { experiments } from "@/data/experiments";
import {
  defaultConversation,
  emptyEvidenceState,
  fallbackAnswer,
  mockAnswers,
  suggestedQuestions,
} from "@/data/aiResponses";
import { resolveWithDelay } from "./client";

export { suggestedQuestions, emptyEvidenceState, defaultConversation };

/**
 * Firewise question interface.
 *
 * This is the single entry point a real RAG pipeline will replace. The signature — a question
 * string in, an answer with confidence and citable evidence out — is what the UI depends on,
 * and it is what the future retrieval service must return.
 */
export async function askFirewiseQuestion(question) {
  const trimmed = question.trim();
  if (!trimmed) return null;

  const match = selectAnswer(trimmed);
  const payload = {
    id: `msg-${Date.now().toString(36)}`,
    role: "assistant",
    answerId: match.id,
    question: trimmed,
    text: match.answer,
    confidence: match.confidence,
    evidence: match.evidence ?? [],
    caveat: match.caveat ?? null,
    source: "mock",
  };

  return resolveWithDelay(payload);
}

export async function getSuggestedQuestions() {
  return suggestedQuestions;
}

function normalise(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s.]/g, " ").split(/\s+/).filter(Boolean);
}

function selectAnswer(question) {
  const terms = normalise(question);
  if (!terms.length) return fallbackAnswer;

  let best = null;
  let bestScore = 0;

  mockAnswers.forEach((candidate) => {
    const keywords = candidate.keywords.map((keyword) => normalise(keyword)).flat();
    const score = keywords.reduce((total, keyword) => {
      if (terms.includes(keyword)) return total + 3;
      if (keyword.length > 4 && terms.some((term) => term.includes(keyword) || keyword.includes(term))) {
        return total + 1;
      }
      return total;
    }, 0);
    if (score > bestScore) {
      bestScore = score;
      best = candidate;
    }
  });

  return bestScore > 0 ? best : fallbackAnswer;
}

/**
 * Drops citation IDs that do not exist in the dataset. Every evidence chip the UI renders is
 * built from this, so a bad ID can never produce a dead link.
 */
export function hydrateConversation(conversation) {
  const known = new Set(experiments.map((experiment) => experiment.id));
  return {
    ...conversation,
    messages: conversation.messages.map((message) => ({
      ...message,
      evidence: (message.evidence ?? []).filter((id) => known.has(id)),
    })),
  };
}
