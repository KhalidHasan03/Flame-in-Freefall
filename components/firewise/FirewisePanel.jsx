"use client";

import { MessageSquareQuote, MessagesSquare, Plus, Trash2 } from "lucide-react";
import { useFirewise } from "@/lib/context/FirewiseProvider";
import { PROTOTYPE_LABELS } from "@/lib/constants";
import PrototypeNotice from "@/components/shared/PrototypeNotice";
import Badge from "@/components/shared/Badge";
import EmptyState from "@/components/shared/EmptyState";
import IconButton from "@/components/shared/IconButton";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

/** Typing indicator shown while the mock retrieval resolves. */
function PendingBubble() {
  return (
    <div className="flex items-start gap-2.5" role="status" aria-live="polite">
      <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand/15">
        <MessageSquareQuote className="size-3 text-brand" aria-hidden="true" />
      </span>
      <div className="rounded-[var(--radius-panel)] rounded-tl-sm border border-brand/20 bg-brand/[0.06] px-3 py-3">
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((index) => (
            <span
              key={index}
              className="size-1.5 rounded-full bg-brand/70 animate-typing"
              style={{ animationDelay: `${index * 160}ms` }}
            />
          ))}
        </div>
        <span className="sr-only">Firewise is composing a response</span>
      </div>
    </div>
  );
}

export default function FirewisePanel({ docked = false, inDrawer = false, headerAccessory = null }) {
  const { activeConversation, conversations, pending, ask, newConversation, removeConversation, selectConversation } =
    useFirewise();

  const messages = activeConversation?.messages ?? [];

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <div className="flex items-center justify-between gap-2 border-b border-line px-3 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <MessageSquareQuote className="size-4 shrink-0 text-brand" aria-hidden="true" />
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-ink">
              {activeConversation?.title ?? "New question"}
            </p>
            <p className="truncate text-[10px] text-ink-faint">
              {messages.length} message{messages.length === 1 ? "" : "s"} • stored responses
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {headerAccessory}
          <IconButton icon={Plus} label="New conversation" size="sm" onClick={newConversation} />
          {conversations.length > 1 && activeConversation ? (
            <IconButton
              icon={Trash2}
              label="Delete this conversation"
              size="sm"
              onClick={() => removeConversation(activeConversation.id)}
            />
          ) : null}
        </div>
      </div>

      <div className="border-b border-line px-3 py-2">
        <PrototypeNotice compact label={PROTOTYPE_LABELS.ai} message={PROTOTYPE_LABELS.aiNote} />
      </div>

      {conversations.length > 1 ? (
        <div className="fx-scrollbar flex gap-1.5 overflow-x-auto border-b border-line px-3 py-2">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              type="button"
              onClick={() => selectConversation(conversation.id)}
              className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-medium transition-colors ${
                conversation.id === activeConversation?.id
                  ? "border-brand bg-brand/15 text-brand"
                  : "border-line bg-elevated/40 text-ink-muted hover:text-ink"
              }`}
            >
              {conversation.title}
            </button>
          ))}
        </div>
      ) : null}

      <div className="fx-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto px-3 py-3">
        {messages.length === 0 && !pending ? (
          <EmptyState
            icon={MessagesSquare}
            title="No questions yet"
            description="Firewise answers from stored example responses in this prototype. It will say when a question is not covered by the dataset."
          />
        ) : (
          messages.map((message) => <MessageBubble key={message.id} message={message} />)
        )}
        {pending ? <PendingBubble /> : null}
      </div>

      {docked || inDrawer ? (
        <div className="border-t border-line px-3 py-2">
          <Badge tone="neutral">Prototype · mock retrieval</Badge>
        </div>
      ) : null}

      <MessageInput />
    </div>
  );
}