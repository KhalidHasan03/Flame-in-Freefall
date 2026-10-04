/**
 * Data access seam.
 *
 * Every read in FlareNexus goes through this module. Components never import from `@/data`
 * directly, which means the future migration to real NASA sources is a change to the files in
 * this folder and nothing else.
 *
 * Target architecture once the research engine exists:
 *
 *   React UI  →  Next.js route handlers  →  Express/Node API
 *                                          →  RAG retrieval
 *                                          →  NASA structured database
 *                                          →  knowledge graph
 *                                          →  LLM
 *                                          →  evidence references  →  Firewise UI
 *
 * To switch modes, set `API_CONFIG.USE_MOCKS` to false and point `BASE_URL` at that API. The
 * request signatures, parameter names and return shapes below are the contract.
 */

export const API_CONFIG = {
  USE_MOCKS: true,
  BASE_URL: process.env.NEXT_PUBLIC_API_URL ?? "/api",
};

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function request(resource, resolveMock, searchParams) {
  if (API_CONFIG.USE_MOCKS) {
    return resolveMock();
  }

  const query = searchParams ? `?${new URLSearchParams(searchParams)}` : "";
  const response = await fetch(`${API_CONFIG.BASE_URL}/${resource}${query}`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new ApiError(`Request to /${resource} failed with status ${response.status}`, response.status);
  }

  return response.json();
}

/**
 * Only the AI path uses a delay. It exists so the typing state is a real interaction rather
 * than a decoration on an instant response. Static record reads stay synchronous.
 */
export function resolveWithDelay(value, baseMs = 620) {
  const jitter = Math.round(Math.random() * 280);
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), baseMs + jitter);
  });
}

export function createId(prefix) {
  return `${prefix}-${Date.now().toString(36)}`;
}
