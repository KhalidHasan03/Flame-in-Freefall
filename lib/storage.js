const NAMESPACE = "flarenexus";

function available() {
  if (typeof window === "undefined") return false;
  try {
    const probe = `${NAMESPACE}:__probe__`;
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

const enabled = typeof window !== "undefined" ? available() : false;

function fullKey(key) {
  return `${NAMESPACE}:${key}`;
}

export function readValue(key, fallback) {
  if (!enabled) return fallback;
  try {
    const raw = window.localStorage.getItem(fullKey(key));
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

/* -------------------------------------------------------------------------- */
/* External store plumbing                                                     */
/* -------------------------------------------------------------------------- */
/*
 * localStorage is an external store, so the hooks that read it subscribe rather than mirror it
 * into state from an effect. Values are cached and only re-parsed when something writes, which
 * is what keeps `useSyncExternalStore` from looping on a fresh object identity every render.
 */
const cache = new Map();
const listeners = new Set();

function emit() {
  listeners.forEach((listener) => listener());
}

/**
 * `storage` only fires in *other* tabs, so its handler drops the cache before re-emitting —
 * otherwise subscribers would be told to re-read and get the stale cached snapshot back.
 */
function handleExternalChange(event) {
  if (!event.key || event.key.startsWith(`${NAMESPACE}:`)) cache.clear();
  emit();
}

export function subscribe(listener) {
  listeners.add(listener);
  if (typeof window !== "undefined") window.addEventListener("storage", handleExternalChange);
  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined" && listeners.size === 0) {
      window.removeEventListener("storage", handleExternalChange);
    }
  };
}

/**
 * Stable snapshot for `useSyncExternalStore`. `merge` folds the stored object onto a default,
 * so settings added in a later version are filled in rather than coming back undefined.
 */
export function readSnapshot(key, fallback, merge = false) {
  if (cache.has(key)) return cache.get(key);
  const stored = readValue(key, null);
  const value = stored === null ? fallback : merge ? { ...fallback, ...stored } : stored;
  cache.set(key, value);
  return value;
}

function commit(key, value) {
  cache.set(key, value);
  emit();
}

export function writeValue(key, value) {
  if (!enabled) return;
  try {
    window.localStorage.setItem(fullKey(key), JSON.stringify(value));
  } catch {
    /* Storage is full or blocked — the app keeps working from React state. */
  }
  commit(key, value);
}

export function removeValue(key) {
  if (!enabled) return;
  try {
    window.localStorage.removeItem(fullKey(key));
  } catch {
    /* no-op */
  }
  cache.delete(key);
  emit();
}

export function clearNamespace() {
  if (!enabled) return;
  Object.keys(window.localStorage)
    .filter((key) => key.startsWith(`${NAMESPACE}:`))
    .forEach((key) => {
      window.localStorage.removeItem(key);
      cache.delete(key.slice(NAMESPACE.length + 1));
    });
  emit();
}

export const STORAGE_KEYS = {
  settings: "settings",
  savedExperiments: "saved:experiments",
  savedInsights: "saved:insights",
  savedComparisons: "saved:comparisons",
  savedAnswers: "saved:answers",
  compare: "compare",
  conversations: "firewise:conversations",
  activeConversation: "firewise:active",
  railDocked: "firewise:rail-docked",
};

export { NAMESPACE as STORAGE_NAMESPACE };