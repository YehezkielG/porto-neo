"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, Send, Sparkles } from "lucide-react";
import MarkdownMessage from "./MarkdownMessage";
import ScrollReveal from "./ScrollReveal";
import type { FormEvent, KeyboardEvent } from "react";

type ChatMessage = { role: "user" | "assistant"; content: string };

const KIRO_ENDPOINT = "/api/ask-kiel";

const SUGGESTIONS = [
  "What skills does Kiel have?",
  "Where did Kiel study?",
  "What projects has Kiel built?",
  "How can I contact Kiel?",
];
const GREETING =
  "Hey there! I'm Kiro, Kiel's AI assistant. Ask me about Kiel's skills, education, projects, or how to get in touch!";

const KiroAI = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: GREETING },
  ]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chat = chatRef.current;
    if (chat) chat.scrollTo({ top: chat.scrollHeight, behavior: "smooth" });
  }, [messages, isSending]);

  const sendMessage = async (value = draft) => {
    const message = value.trim();
    if (!message || isSending || message.length > 300) return;

    const history = messages
      .slice(1)
      .map(({ role, content }) => ({ role, content }));
    const requestPayload = { message, history };
    setMessages((current) => [
      ...current,
      { role: "user", content: message },
    ]);
    setDraft("");
    setError("");
    setIsSending(true);

    try {
      console.info(
        "[KiroAI] Request payload:",
        JSON.stringify(requestPayload, null, 2)
      );
      const response = await fetch(KIRO_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload),
      });
      const data = await response.json();
      console.info(
        "[KiroAI] Retrieved knowledge chunks:",
        data.sources?.rag ?? []
      );
      if (!response.ok)
        throw new Error(data.error || "Kiro could not answer right now.");
      if (typeof data.reply !== "string" || !data.reply.trim())
        throw new Error("Kiro returned an empty response.");
      setMessages((current) => [
        ...current,
        { role: "assistant", content: data.reply },
      ]);
    } catch (sendError) {
      const err = sendError as Error;
      setError(err.message || "Could not connect to Kiro. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage();
  };

  return (
    <ScrollReveal
      as="section"
      id="kiro"
      className="relative isolate mt-11 pt-2 before:absolute before:right-[3%] before:top-[102px] before:z-[-1] before:h-[210px] before:w-[38%] before:rotate-[3deg] before:bg-[var(--lime)] before:content-['']"
    >
      <div className="mb-6 flex items-center gap-4">
        <div>
          <p className="mb-3 font-mono text-[10px] font-black tracking-[.22em] text-[#12566b]">
            ASK ABOUT MY WORK
          </p>
          <h2 className="m-0 text-[clamp(40px,6vw,68px)] font-black leading-[.95] tracking-[-.07em]">
            Kiro AI<span className="text-[var(--accent)]">.</span>
          </h2>
        </div>
      </div>

      <div className="relative overflow-visible border-0 bg-transparent shadow-none">
        <header className="relative flex min-h-[74px] items-center gap-[13px] border-2 border-black bg-[#fffdf5] px-[18px] py-3 shadow-[7px_7px_0_var(--shadow-color)]">
          <span className="grid size-[46px] shrink-0 place-items-center border-2 border-black bg-[var(--lime)] text-[#080a12] shadow-[3px_3px_0_var(--shadow-color)]">
            <Bot size={25} aria-hidden="true" />
          </span>
          <div className="grid gap-[3px]">
            <strong className="font-mono text-base text-[#080a12]">
              Kiro AI
            </strong>
            <span className="flex items-center gap-[7px] font-mono text-[11px] text-[#31505a]">
              <i className="size-2 rounded-full border border-black bg-[var(--lime)]" />
              Portfolio assistant
            </span>
          </div>
          <Sparkles
            className="ml-auto text-[#168aad]"
            size={22}
            aria-hidden="true"
          />
        </header>

        <div
          ref={chatRef}
          className="my-[18px] flex h-[min(52vh,470px)] min-h-[310px] flex-col gap-[18px] overflow-y-auto border-2 border-black bg-[#10172f] p-6 shadow-[9px_9px_0_var(--shadow-color)] max-[760px]:min-h-[280px] max-[760px]:p-3"
          role="log"
          aria-live="polite"
          aria-label="Conversation with Kiro AI"
        >
          {messages.map((item, index) => (
            <article
              className={`flex max-w-[88%] items-end gap-3 max-[760px]:max-w-[96%] ${item.role === "user" ? "self-end" : "self-start"}`}
              key={`${item.role}-${index}`}
            >
              {item.role === "assistant" && (
                <span className="grid size-8 shrink-0 place-items-center border-2 border-black bg-[var(--lime)] text-[#080a12] shadow-[3px_3px_0_var(--shadow-color)]">
                  <Bot size={18} aria-hidden="true" />
                </span>
              )}
              {item.role === "assistant" ? (
                <MarkdownMessage content={item.content} />
              ) : (
                <p className="m-0 border-2 border-black bg-[var(--accent)] px-4 py-3.5 font-mono text-[13px] leading-[1.7] text-[#fffdf5] shadow-[-5px_5px_0_var(--shadow-color)] [overflow-wrap:anywhere]">
                  {item.content}
                </p>
              )}
            </article>
          ))}
          {isSending && (
            <div
              className="flex items-center gap-1.5 font-mono text-[11px] text-[#a7adbd]"
              role="status"
            >
              <span className="size-1.5 animate-pulse rounded-full bg-[var(--lime)]" />
              <span className="size-1.5 animate-pulse rounded-full bg-[var(--lime)] [animation-delay:150ms]" />
              <span className="size-1.5 animate-pulse rounded-full bg-[var(--lime)] [animation-delay:300ms]" />
              Kiro is thinking...
            </div>
          )}
        </div>

        <div className="pt-2">
          {error && (
            <p
              className="mb-2.5 border-2 border-black bg-[#ffb2d9] px-2.5 py-2 text-xs text-[#11131b] shadow-[4px_4px_0_var(--shadow-color)]"
              role="alert"
            >
              {error}
            </p>
          )}
          <div className="mb-[7px] text-right font-mono text-[10px] text-[#38535a]">
            {draft.length}/300
          </div>
          <form
            className="flex items-center gap-3 border-2 border-black bg-[#fffdf5] px-[15px] py-2 shadow-[7px_7px_0_var(--shadow-color)] max-[760px]:px-3 max-[760px]:py-2.5"
            onSubmit={handleSubmit}
          >
            <label className="sr-only" htmlFor="kiro-question">
              Ask Kiro a question
            </label>
            <textarea
              id="kiro-question"
              rows={1}
              maxLength={300}
              placeholder="Type your question... (Enter to send)"
              className="m-0 min-h-10 max-h-[120px] w-full resize-y border-0 bg-transparent p-2.5 font-mono text-[13px] text-[#11131b] shadow-none placeholder:text-[#607078] focus:outline-none"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event: KeyboardEvent<HTMLTextAreaElement>) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  sendMessage();
                }
              }}
              disabled={isSending}
            />
            <button
              className="grid size-10 shrink-0 place-items-center border-2 border-black bg-[var(--lime)] text-[#11131b] shadow-[3px_3px_0_var(--shadow-color)] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_var(--shadow-color)] disabled:bg-[#aab6b9] disabled:text-[#405057]"
              type="submit"
              aria-label="Send question"
              disabled={isSending || !draft.trim()}
            >
              <Send size={18} aria-hidden="true" />
            </button>
          </form>
          <div className="mt-[13px] flex flex-wrap items-center gap-2">
            <span className="mr-[3px] font-mono text-[9px] font-extrabold tracking-[.12em] text-[#31505a]">
              TRY ASKING
            </span>
            {SUGGESTIONS.map((suggestion) => (
              <button
                className="border-2 border-black bg-[#fffdf5] px-[11px] py-2 text-[10px] text-[#11131b] shadow-[3px_3px_0_var(--shadow-color)] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-[var(--lime)] hover:shadow-[1px_1px_0_var(--shadow-color)] disabled:cursor-not-allowed disabled:opacity-60"
                key={suggestion}
                type="button"
                onClick={() => sendMessage(suggestion)}
                disabled={isSending}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
};

export default KiroAI;
