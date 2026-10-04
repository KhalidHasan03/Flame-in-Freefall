"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { askFirewiseQuestion, defaultConversation, hydrateConversation } from "@/lib/api/ai";
import { STORAGE_KEYS } from "@/lib/storage";
import usePersistentState from "@/lib/usePersistentState";

const FirewiseContext = createContext(null);

/** The rail is never empty on first load, so the shipped conversation seeds the store. */
const SEED = [hydrateConversation(defaultConversation)];

function titleFrom(question) {
  const trimmed = question.trim();
  return trimmed.length > 46 ? `${trimmed.slice(0, 45).trimEnd()}…` : trimmed;
}

export function FirewiseProvider({ children }) {
  const [conversations, setConversations] = usePersistentState(STORAGE_KEYS.conversations, SEED);
  const [activeId, setActiveId] = usePersistentState(STORAGE_KEYS.activeConversation, defaultConversation.id);
  // Ephemeral request state: never persisted, so it stays ordinary component state.
  const [pending, setPending] = useState(false);
  // `pending` state is not readable inside the same tick, so a ref guards overlapping requests.
  const inFlight = useRef(false);

  const appendMessage = useCallback(
    (conversationId, message) =>
      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === conversationId
            ? { ...conversation, messages: [...conversation.messages, message] }
            : conversation,
        ),
      ),
    [setConversations],
  );

  const ask = useCallback(
    async (question) => {
      const trimmed = question.trim();
      if (!trimmed || inFlight.current) return null;

      const conversationId = conversations.some((item) => item.id === activeId)
        ? activeId
        : conversations[0]?.id;
      if (!conversationId) return null;

      const askedAt = Date.now();
      appendMessage(conversationId, { id: `user-${askedAt.toString(36)}`, role: "user", text: trimmed });

      inFlight.current = true;
      setPending(true);
      const answer = await askFirewiseQuestion(trimmed).catch(() => null);
      inFlight.current = false;
      setPending(false);

      if (!answer) return null;

      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === conversationId
            ? {
                ...conversation,
                // The user message is already stored, so a length of 1 means this is the first exchange.
                title:
                  conversation.messages.length <= 1 || conversation.title === "New question"
                    ? titleFrom(trimmed)
                    : conversation.title,
                messages: [...conversation.messages, answer],
              }
            : conversation,
        ),
      );
      setActiveId(conversationId);
      return answer;
    },
    [activeId, conversations, appendMessage, setConversations, setActiveId],
  );

  const newConversation = useCallback(() => {
    const conversation = {
      id: `conv-${Date.now().toString(36)}`,
      title: "New question",
      messages: [],
    };
    setConversations((current) => [conversation, ...current]);
    setActiveId(conversation.id);
    return conversation.id;
  }, [setConversations, setActiveId]);

  const removeConversation = useCallback(
    (conversationId) => {
      const remaining = conversations.filter((conversation) => conversation.id !== conversationId);
      const next = remaining.length ? remaining : SEED;
      setConversations(next);
      setActiveId(next[0].id);
    },
    [conversations, setConversations, setActiveId],
  );

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeId) ?? conversations[0],
    [conversations, activeId],
  );

  const value = useMemo(
    () => ({
      conversations,
      activeConversation,
      activeId: activeConversation?.id ?? null,
      pending,
      ask,
      newConversation,
      selectConversation: setActiveId,
      removeConversation,
      clearActive: newConversation,
    }),
    [conversations, activeConversation, pending, ask, newConversation, setActiveId, removeConversation],
  );

  return <FirewiseContext.Provider value={value}>{children}</FirewiseContext.Provider>;
}

export function useFirewise() {
  const context = useContext(FirewiseContext);
  if (!context) throw new Error("useFirewise must be used inside FirewiseProvider");
  return context;
}