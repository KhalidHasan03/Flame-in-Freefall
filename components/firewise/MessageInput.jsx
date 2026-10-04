"use client";

import { Send, Square } from "lucide-react";
import { useState } from "react";
import { useFirewise } from "@/lib/context/FirewiseProvider";
import { PROTOTYPE_LABELS } from "@/lib/constants";

const QUICK = [
  "Why are some flames harder to detect in microgravity?",
  "How does reduced gravity affect flame shape?",
  "Which materials show increased flame spread?",
  "What research gaps exist for lunar habitats?",
];

export function SuggestedQuestions({ onPick, className = "" }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <p className="fx-label">Ask about the dataset</p>
      {QUICK.map((question) => (
        <button
          key={question}
          type="button"
          onClick={() => onPick(question)}
          className="rounded-lg border border-line bg-elevated/40 px-2.5 py-1.5 text-left text-[11px] leading-relaxed text-ink-muted transition-colors hover:border-brand/50 hover:text-ink"
        >
          {question}
        </button>
      ))}
    </div>
  );
}

export default function MessageInput({ suggestions = true, className = "" }) {
  const { ask, pending } = useFirewise();
  const [value, setValue] = useState("");

  const submit = (event) => {
    event?.preventDefault();
    const question = value.trim();
    if (!question || pending) return;
    setValue("");
    ask(question);
  };

  return (
    <div className={`space-y-2.5 border-t border-line bg-surface-raised/50 px-3 py-3 ${className}`}>
      <form onSubmit={submit} className="relative">
        <label htmlFor="firewise-input" className="sr-only">
          Ask Firewise a question about the experiment dataset
        </label>
        <textarea
          id="firewise-input"
          rows={2}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) submit(event);
          }}
          placeholder="Ask about a flame, material, mission or gap…"
          className="fx-input fx-scrollbar max-h-28 min-h-14 w-full resize-y pr-11 text-xs leading-relaxed"
          disabled={pending}
        />
        <button
          type="submit"
          aria-label={pending ? "Waiting for response" : "Send question"}
          disabled={pending || !value.trim()}
          className="fx-btn fx-btn-primary absolute bottom-2 right-2 size-8 p-0"
        >
          {pending ? (
            <Square className="size-3.5 animate-fade-in" aria-hidden="true" />
          ) : (
            <Send className="size-3.5" aria-hidden="true" />
          )}
        </button>
      </form>
      <p className="text-[10px] leading-relaxed text-ink-faint">{PROTOTYPE_LABELS.aiNote}</p>
      {suggestions ? (
        <div className="flex flex-wrap gap-1.5">
          {QUICK.slice(0, 2).map((question) => (
            <button
              key={question}
              type="button"
              onClick={() => ask(question)}
              disabled={pending}
              className="rounded-full border border-line bg-elevated/40 px-2 py-1 text-[10px] font-medium text-ink-muted transition-colors hover:border-brand/50 hover:text-ink disabled:opacity-50"
            >
              {question.length > 42 ? `${question.slice(0, 41)}…` : question}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}