/**
 * Emergency-intent detection for the Firewise question path.
 *
 * WHY THIS EXISTS
 *
 * Firewise answers research questions. A research-support prototype has no business answering
 * "is there a fire on the station right now", and it has no way to know whether the person asking
 * is a crew member with a procedure to follow or a student writing a paper. So when a question
 * reads as an operational emergency, this module intercepts it *before* retrieval runs and returns
 * a fixed notice instead of a research answer.
 *
 * WHAT THIS DELIBERATELY DOES NOT DO
 *
 * It does not contain emergency instructions, procedures, checklists or guidance of any kind. It
 * names no procedure, no agency and no crew, and it implies no endorsement by any of them. The
 * notice it selects tells the reader to go to their own approved procedures and authorized crew
 * communication channels, which is the only safe thing a non-operational prototype can say. Any
 * future wording must keep that property: this is a router, never an authority.
 *
 * WHY THE MATCHING IS SO CONSERVATIVE
 *
 * "Fire", "flame", "burn", "oxygen", "suppress" and "extinguish" are the vocabulary of the entire
 * dataset. So is "emergency" — this is a fire-safety research platform, and records legitimately
 * cover emergency egress, evacuation procedures, fire detection and alarm response. Matching any
 * of that on sight would route ordinary research questions to the notice and make the assistant
 * useless for the job it exists to do.
 *
 * So the shape is: hazard vocabulary alone never triggers anything, and research framing
 * suppresses every tier. Someone mid-emergency writes "fire on the station right now help" — no
 * dataset, no study, no comparison. Someone asking about the literature writes "what does the
 * dataset say about emergency evacuation testing", which contains every emergency word in this
 * module and must still be answered as research. The framing words are the discriminator, and
 * they are deliberately restricted to nouns that describe *studying* something rather than
 * interrogative forms like "how do" or "what is", which appear in both worlds:
 * "how does fire suppression work" is research, "how do I put this fire out right now" is not.
 */

/**
 * Tier 1 — unambiguous operational declarations.
 *
 * Every phrase here describes a situation being reported rather than a subject being studied.
 * They are still subject to research framing, because on this dataset "emergency" is a domain
 * word, not a signal on its own.
 */
const DECLARATIONS = [
  /\bemergenc(?:y|ies)\b/,
  /\bmayday\b/,
  /\bpanic\b/,
  /\bdistress (?:call|signal)\b/,
  /\bcrew\s+(?:member\s+)?(?:is|are|was|were)\s+(?:in\s+(?:danger|threat|risk)|hurt|harmed|injured|trapped|unconscious|missing)\b/,
  /\bcrew (?:is|are|was|were) (?:in|under|at) (?:danger|threat|risk)\b/,
  /\b(?:is|are) (?:anyone|someone|somebody|anybody|everyone|a\s+crew\s+member)\s+(?:hurt|harmed|injured|trapped|unconscious|missing|ok|okay)\b/,
  /\b(?:someone|somebody|anyone|anybody|a\s+crew\s+member)\s+(?:is\s+)?(?:trapped|hurt|harmed|injured|unconscious|missing)\b/,
  /\babandon ship\b/,
  /\bevacuat(?:e|ing|ion)\b/,
  /\b(?:immediate|emergency|urgent)\s+abort\b/,
  /\blife[-\s]threatening\b/,
  /\b(?:rapid|fast)\s+(?:decompression|depressurization|depressurisation)\b/,
];

/**
 * Tier 2 — immediacy plus a hazard. Both required.
 *
 * This is the tier most likely to need tuning, so the two halves are kept as separate lists
 * rather than fused into one pattern: it makes it obvious in review that no hazard word can
 * trigger the notice on its own.
 */
const IMMEDIACY = [
  /\bright now\b/,
  /\b(?:happening|going on|occurring)\s+(?:now|right now)\b/,
  /\bat this (?:moment|very moment)\b/,
  /\burgently\b/,
  /\bimmediately\b/,
  /\b(?:this is|this just)\s+(?:an?\s+)?(?:emergency|urgent|emergency situation)\b/,
  /\bas soon as possible\b/,
  /*
    "currently" is deliberately absent. It reads as urgency but is common in research prose —
    "what is currently known about flame luminosity" is a literature question, and it was the one
    false positive this module produced in testing. Emergencies reach tier 2b through a
    present-tense report ("there is burning smoke on the station") instead, which is a far
    stronger signal than an adverb.
  */
];

const HAZARDS = [
  /\bfire\b/,
  /\bsmoke\b/,
  /\bflames?\b/,
  /\bburning\b/,
  /\balarms?\b/,
  /\bdepressuriz/,
  /\bdepressuris/,
  /\btoxic\b/,
  /\bsparking\b/,
  /\bfuel leak\b/,
  /\b(?:cooling|thermal)\s+(?:failure|fail|loop)\b/,
  /\bpower (?:loss|failure|fail)\b/,
  /\bcontainment breach\b/,
];

/**
 * Tier 2b — a hazard reported in the present tense, with no "when".
 *
 * "We have a toxic leak" names no hazard *and* no immediacy marker, so tier 2 cannot see it, but
 * it is unambiguously someone reporting a situation rather than asking about one. Requiring a
 * first-person or existential present-tense construction keeps this from firing on "there is
 * evidence that..." — and research framing suppresses it regardless.
 */
const PRESENT_REPORT = [
  /\bwe (?:have|are|got|just)\b/,
  /\b(?:there is|there's)\b/,
  /\bi (?:have|see|smell|can)\b/,
  /\bit'?s (?:happening|burning|smoking|on fire)\b/,
];

/**
 * Tier 3 — people present, plus a present-tense safety question.
 *
 * "Is the crew safe right now?" names no hazard at all, so tiers 1 and 2 cannot see it. It is
 * still a question about the present tense of human safety rather than about the literature.
 */
const PEOPLE = [
  /\bcrew\b/,
  /\bpeople\b/,
  /\banyone\b/,
  /\bsomeone\b/,
  /\bsomebody\b/,
  /\banybody\b/,
  /\beveryone\b/,
  /\bastronauts?\b/,
];

const PRESENT_SAFETY = [
  /\bsafe\b/,
  /\bsafety\b/,
  /\bok\b/,
  /\ball right\b/,
  /\ball well\b/,
  /\bin (?:trouble|danger)\b/,
  /\bconscious\b/,
];

/**
 * Research framing. Suppresses every tier.
 *
 * "Is the crew safe" and "is the crew safe in the Saffire records" differ only in the last three
 * words, and only one of them is an emergency. This list is what tells them apart.
 *
 * Restricted to nouns and phrases that describe *studying* something. Interrogative forms are
 * excluded on purpose: "how do" and "what is" belong to both a research question and an
 * operational one, so they cannot discriminate, while "dataset", "experiment" and "study" only
 * appear when the reader is asking about the literature.
 */
const RESEARCH_FRAMING = [
  /\bresearch/,
  /\bstud(?:y|ies|ying)\b/,
  /\bexperiment/,
  /\bdataset\b/,
  /\brecords?\b/,
  /\bevidence\b/,
  /\b(?:paper|papers|literature|publication)s?\b/,
  /\bcompare\b|\bcomparison\b/,
  /\bdifference between\b/,
  /\bhypothes/,
  /\bmodel/,
  /\bsimulat/,
  /\banalys/,
  /\b(?:test|tests|testing)\b/,
  /\bmethodolog/,
  /\bprototype\b/,
  /\bhypothes/,
];

/** @returns {boolean} whether any pattern in the list matches the lower-cased text. */
function matchesAny(patterns, text) {
  return patterns.some((pattern) => pattern.test(text));
}

/**
 * Classify a question as an operational emergency or ordinary research.
 *
 * Pure and synchronous so it can be unit-tested directly and called before any await. The cost
 * of a false positive is a dismissible notice; the cost of a false negative is an AI-shaped
 * answer to someone who needed a procedure, so the bias is deliberately toward the notice.
 *
 * @param {string} question Raw user input, not yet normalised.
 * @returns {{ isEmergency: boolean, matched: string[] }} `matched` names the tier that fired,
 *   for logging and testing. Empty when `isEmergency` is false.
 */
export function detectEmergencyIntent(question) {
  const text = String(question ?? "").toLowerCase().trim();

  if (!text) return { isEmergency: false, matched: [] };

  const researchFramed = matchesAny(RESEARCH_FRAMING, text);
  if (researchFramed) return { isEmergency: false, matched: [] };

  if (matchesAny(DECLARATIONS, text)) {
    return { isEmergency: true, matched: ["declaration"] };
  }

  if (matchesAny(IMMEDIACY, text) && matchesAny(HAZARDS, text)) {
    return { isEmergency: true, matched: ["immediacy+hazard"] };
  }

  if (matchesAny(PRESENT_REPORT, text) && matchesAny(HAZARDS, text)) {
    return { isEmergency: true, matched: ["present+hazard"] };
  }

  if (matchesAny(PEOPLE, text) && matchesAny(PRESENT_SAFETY, text)) {
    return { isEmergency: true, matched: ["people+safety"] };
  }

  return { isEmergency: false, matched: [] };
}

/**
 * True when the question should bypass research retrieval entirely.
 *
 * @param {string} question
 * @returns {boolean}
 */
export function isEmergencyQuestion(question) {
  return detectEmergencyIntent(question).isEmergency;
}