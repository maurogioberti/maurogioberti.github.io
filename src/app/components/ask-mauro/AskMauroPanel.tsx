'use client';

import './ask-mauro.css';

import Image from 'next/image';
import {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type RefObject,
} from 'react';

import { ASK_MAURO_APP_URL, QUESTION_MAX_LENGTH, askMauro, type AskCard } from './askMauroClient';
import {
  ANSWER_READY_ANNOUNCEMENT,
  CONVERSATION_STATUS_ASKING,
  CONVERSATION_STATUS_IDLE,
  CONVERSATION_STATUS_REVEALING,
  ERROR_COPY,
  INITIAL_CONVERSATION_STATE,
  REVEAL_CHARS_PER_TICK,
  REVEAL_TICK_MS,
  SUGGESTED_QUESTIONS,
  conversationReducer,
  countParagraphChars,
  sliceParagraphs,
  type AssistantMessage,
  type ConversationMessage,
  type UserMessage,
} from './askMauroConversation';
import { linkify } from './linkify';
import { THINKING_ARIA_LABEL } from './thinkingMessages';
import { useThinkingMessage } from './useThinkingMessage';

const AVATAR_SRC = '/assets/profile/maurogioberti-ai-avatar.png';
const AVATAR_SIZE = 28;
const HEADER_AVATAR_SIZE = 36;
const ICON_SIZE = 18;
const LINK_ICON_SIZE = 12;
const RETRY_ICON_SIZE = 14;
const MAX_COMPOSER_HEIGHT_PX = 160;
/**
 * The send button's own height (`h-9` = 2.25rem = 36px), reused as the floor
 * for the editable area so the two controls in the composer row share one
 * definition of "control height" rather than drifting apart.
 */
const MIN_COMPOSER_HEIGHT_PX = 36;
const COUNTER_THRESHOLD = QUESTION_MAX_LENGTH - 60;
const TYPING_DOT_DELAY_S = 0.16;
/**
 * The portfolio ships as `<html lang="en">` with no language switcher, so the
 * widget's waiting copy is English. The catalog is bilingual and the hook takes
 * the language as a parameter, so adding a switcher later is a one-line change
 * here rather than a rewrite.
 */
const WIDGET_LANGUAGE = 'en' as const;
const PANEL_TITLE_ID = 'ask-mauro-panel-title';

/** Matches Tailwind's `sm` breakpoint: below it the panel opens as a modal sheet. */
const MOBILE_DIALOG_MEDIA_QUERY = '(max-width: 639px)';
const REDUCED_MOTION_MEDIA_QUERY = '(prefers-reduced-motion: reduce)';

const ICON_BUTTON_CLASSES =
  'inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-vs-border text-vs-foreground-muted transition-colors duration-200 hover:border-vs-primary hover:bg-vs-background hover:text-vs-primary';
const EXTERNAL_LINK_CLASSES =
  'inline-flex items-center gap-1 text-xs font-medium text-vs-primary hover:text-vs-primary-light';

interface RevealProgress {
  messageId: number;
  visibleChars: number;
}

interface AskMauroPanelProps {
  open: boolean;
  onClose: () => void;
}

export function AskMauroPanel({ open, onClose }: AskMauroPanelProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);
  const [state, dispatch] = useReducer(conversationReducer, INITIAL_CONVERSATION_STATE);
  const [reveal, setReveal] = useState<RevealProgress | null>(null);
  const [announcement, setAnnouncement] = useState('');
  /** Aborts the in-flight ask; set while a generation is running. */
  const abortRef = useRef<AbortController | null>(null);
  /**
   * Monotonic run id. A cancelled request can still resolve a moment later, so
   * every dispatch is gated on still being the current run — that is what
   * keeps a stopped answer from appearing after the fact.
   */
  const runRef = useRef(0);

  const revealingMessage =
    state.status === CONVERSATION_STATUS_REVEALING ? lastAssistantMessage(state.messages) : null;

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (open && !dialog.open) {
      if (window.matchMedia(MOBILE_DIALOG_MEDIA_QUERY).matches) {
        dialog.showModal();
      } else {
        dialog.show();
      }
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Focus lands on the composer when the panel opens and returns to it after
  // every answer or failure, mirroring a chat input's expected behavior.
  useEffect(() => {
    if (open && state.status === CONVERSATION_STATUS_IDLE) {
      composerRef.current?.focus({ preventScroll: true });
    }
  }, [open, state.status]);

  // Local typewriter reveal for the newest answer. The response is already
  // complete; reduced-motion users see the full text immediately.
  useEffect(() => {
    if (revealingMessage === null) {
      return;
    }

    const total = countParagraphChars(revealingMessage.content);

    if (window.matchMedia(REDUCED_MOTION_MEDIA_QUERY).matches) {
      setReveal({ messageId: revealingMessage.id, visibleChars: total });
      return;
    }

    setReveal({ messageId: revealingMessage.id, visibleChars: 0 });

    const interval = window.setInterval(() => {
      setReveal((current) =>
        current === null
          ? current
          : { ...current, visibleChars: Math.min(current.visibleChars + REVEAL_CHARS_PER_TICK, total) }
      );
    }, REVEAL_TICK_MS);

    return () => {
      window.clearInterval(interval);
    };
  }, [revealingMessage]);

  useEffect(() => {
    if (
      revealingMessage !== null &&
      reveal !== null &&
      reveal.messageId === revealingMessage.id &&
      reveal.visibleChars >= countParagraphChars(revealingMessage.content)
    ) {
      dispatch({ type: 'reveal-complete' });
      setAnnouncement(ANSWER_READY_ANNOUNCEMENT);
    }
  }, [reveal, revealingMessage]);

  useEffect(() => {
    const list = messageListRef.current;

    if (list) {
      list.scrollTop = list.scrollHeight;
    }
  }, [state.messages, state.status, state.error, reveal]);

  const runQuestion = useCallback(async (question: string) => {
    const token = ++runRef.current;
    const controller = new AbortController();
    abortRef.current = controller;

    const result = await askMauro(question, fetch, controller.signal);

    // Superseded by a Stop (or by the panel closing): drop the result silently.
    if (token !== runRef.current) {
      return;
    }
    abortRef.current = null;

    if (result.ok) {
      dispatch({ type: 'succeed', answer: result.answer });
    } else if (result.kind !== 'cancelled') {
      dispatch({ type: 'fail', kind: result.kind });
    }
  }, []);

  /**
   * Stop the current generation for real.
   *
   * Aborting the request makes the backend see the disconnect and drop its
   * llama-server connection, which ends the generation (measured: the model's
   * slot frees in ~0.4 s). Whatever was already revealed stays on screen; the
   * rest of the answer is never fabricated.
   */
  const stop = useCallback(() => {
    if (state.status === CONVERSATION_STATUS_IDLE) {
      return;
    }

    runRef.current += 1;
    abortRef.current?.abort();
    abortRef.current = null;
    dispatch({ type: 'cancel' });
    composerRef.current?.focus({ preventScroll: true });
  }, [state.status]);

  // Closing the panel, navigating away, or unmounting must not leave a
  // generation running on the server.
  useEffect(() => {
    if (!open && abortRef.current) {
      runRef.current += 1;
      abortRef.current.abort();
      abortRef.current = null;
      dispatch({ type: 'cancel' });
    }
  }, [open]);

  useEffect(
    () => () => {
      runRef.current += 1;
      abortRef.current?.abort();
      abortRef.current = null;
    },
    []
  );

  const send = useCallback(
    (question: string) => {
      const trimmed = question.trim();

      if (trimmed === '' || state.status !== CONVERSATION_STATUS_IDLE) {
        return;
      }

      setAnnouncement('');
      dispatch({ type: 'ask', question: trimmed });
      // Suggested-question chips unmount on the first ask; parking focus on the
      // read-only composer keeps keyboard and screen reader users oriented.
      composerRef.current?.focus({ preventScroll: true });
      void runQuestion(trimmed);
    },
    [runQuestion, state.status]
  );

  const retry = useCallback(() => {
    const question = state.pendingQuestion;

    if (question === null || state.status !== CONVERSATION_STATUS_IDLE) {
      return;
    }

    setAnnouncement('');
    dispatch({ type: 'retry' });
    void runQuestion(question);
  }, [runQuestion, state.pendingQuestion, state.status]);

  function handleKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === 'Escape' && !event.nativeEvent.isComposing) {
      event.preventDefault();
      dialogRef.current?.close();
    }
  }

  const busy = state.status !== CONVERSATION_STATUS_IDLE;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={PANEL_TITLE_ID}
      onClose={onClose}
      onKeyDown={handleKeyDown}
      className="ask-mauro-panel fixed inset-0 z-[80] m-0 h-dvh max-h-none w-full max-w-none border border-vs-border bg-vs-background-secondary p-0 text-vs-foreground shadow-2xl sm:inset-auto sm:right-5 sm:bottom-24 sm:h-auto sm:max-h-[min(37.5rem,calc(100dvh-8rem))] sm:w-[25rem] sm:max-w-[calc(100vw-2.5rem)] sm:rounded-2xl"
    >
      <header className="flex items-center gap-3 border-b border-vs-border px-4 py-3">
        <span className="relative flex-shrink-0">
          <Image
            src={AVATAR_SRC}
            alt=""
            width={HEADER_AVATAR_SIZE}
            height={HEADER_AVATAR_SIZE}
            className="rounded-full"
          />
          <span
            className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-vs-background-secondary bg-vs-success"
            aria-hidden="true"
          />
        </span>
        <div className="min-w-0 flex-1">
          <p id={PANEL_TITLE_ID} className="truncate text-sm font-semibold text-vs-heading">
            Ask Mauro
          </p>
          <p className="truncate text-xs text-vs-foreground-muted">AI assistant trained on this portfolio</p>
        </div>
        <button
          type="button"
          aria-label="Close Ask Mauro"
          onClick={() => dialogRef.current?.close()}
          className={ICON_BUTTON_CLASSES}
        >
          <CloseIcon />
        </button>
      </header>

      <div ref={messageListRef} className="flex-1 space-y-5 overflow-y-auto overscroll-contain px-4 py-4">
        {state.messages.length === 0 && <EmptyState onAsk={send} />}
        {state.messages.map((message) => (
          <MessageRow
            key={message.id}
            message={message}
            reveal={revealingMessage !== null && revealingMessage.id === message.id ? reveal : null}
          />
        ))}
        {state.status === CONVERSATION_STATUS_ASKING && <ThinkingRow />}
        {state.error !== null && <ErrorRow message={ERROR_COPY[state.error]} onRetry={retry} />}
        {/* The reveal text is deliberately not live; this region announces the
            waiting stages and one completion notice instead of every tick. */}
        <p aria-live="polite" className="sr-only">
          {state.status === CONVERSATION_STATUS_ASKING ? THINKING_ARIA_LABEL[WIDGET_LANGUAGE] : announcement}
        </p>
      </div>

      <Composer disabled={busy} onSend={send} onStop={stop} textareaRef={composerRef} />

      <footer className="flex items-center justify-between gap-3 border-t border-vs-border px-4 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
        <p className="text-[11px] text-vs-foreground-muted">Answers can take a minute</p>
        <a href={ASK_MAURO_APP_URL} target="_blank" rel="noopener noreferrer" className={EXTERNAL_LINK_CLASSES}>
          Open full experience
          <ExternalLinkIcon />
        </a>
      </footer>
    </dialog>
  );
}

function lastAssistantMessage(messages: ConversationMessage[]): AssistantMessage | null {
  for (let index = messages.length - 1; index >= 0; index--) {
    const message = messages[index];

    if (message.role === 'assistant') {
      return message;
    }
  }

  return null;
}

function EmptyState({ onAsk }: { onAsk: (question: string) => void }) {
  return (
    <div>
      <p className="text-sm leading-relaxed text-vs-foreground/80">
        Hi! Ask about my work, AI projects, .NET background, talks or mentoring — I answer from what this
        portfolio publishes.
      </p>
      <p className="mt-4 text-[10px] font-semibold tracking-[0.16em] text-vs-foreground-muted uppercase">Start with</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {SUGGESTED_QUESTIONS.map((suggestion) => (
          <button
            key={suggestion.label}
            type="button"
            aria-label={`${suggestion.label} — asks: ${suggestion.question}`}
            onClick={() => onAsk(suggestion.question)}
            className="tag cursor-pointer"
          >
            {suggestion.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function MessageRow({ message, reveal }: { message: ConversationMessage; reveal: RevealProgress | null }) {
  if (message.role === 'user') {
    return <UserRow message={message} />;
  }

  return <AssistantRow message={message} reveal={reveal} />;
}

function UserRow({ message }: { message: UserMessage }) {
  return (
    <div className="flex justify-end">
      <p className="max-w-[85%] rounded-2xl rounded-br-md border border-vs-tag-border bg-vs-tag-bg px-3.5 py-2 text-sm leading-relaxed break-words whitespace-pre-wrap">
        {message.text}
      </p>
    </div>
  );
}

function AssistantRow({ message, reveal }: { message: AssistantMessage; reveal: RevealProgress | null }) {
  const paragraphs = reveal === null ? message.content : sliceParagraphs(message.content, reveal.visibleChars);
  const caretIndex =
    reveal === null
      ? -1
      : paragraphs.findIndex((paragraph, index) => paragraph.length < message.content[index].length);

  return (
    <div className="flex gap-2.5">
      <Image
        src={AVATAR_SRC}
        alt=""
        width={AVATAR_SIZE}
        height={AVATAR_SIZE}
        className="mt-0.5 h-7 w-7 flex-shrink-0 rounded-full"
      />
      <div className="min-w-0 flex-1 space-y-3">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="max-w-[66ch] text-sm leading-relaxed break-words text-vs-foreground/90">
            <LinkedText text={paragraph} />
            {index === caretIndex && <span className="ask-mauro-caret" aria-hidden="true" />}
          </p>
        ))}
        {reveal === null && message.cards.length > 0 && (
          <div className="space-y-2 pt-1">
            <p className="text-[10px] font-semibold tracking-[0.16em] text-vs-foreground-muted uppercase">
              From the portfolio
            </p>
            {message.cards.map((card) => (
              <AnswerCardView key={card.title} card={card} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Assistant prose with any URLs rendered as real links.
 *
 * Segments are React nodes, never HTML strings, so clickability is added
 * without a raw-HTML rendering path. The backend only lets through URLs that
 * appear verbatim in the retrieved evidence, so these are real portfolio
 * links; they still open with `noopener noreferrer`. Cards are unaffected —
 * an answer may legitimately show a link and a card for the same resource.
 */
function LinkedText({ text }: { text: string }) {
  return (
    <>
      {linkify(text).map((segment, index) =>
        segment.kind === 'link' ? (
          <a
            key={index}
            href={segment.href}
            target="_blank"
            rel="noopener noreferrer"
            className="break-words text-vs-primary underline underline-offset-2 transition-opacity hover:opacity-80"
          >
            {segment.value}
          </a>
        ) : (
          <span key={index}>{segment.value}</span>
        ),
      )}
    </>
  );
}

function AnswerCardView({ card }: { card: AskCard }) {
  return (
    <div className="rounded-xl border border-vs-border bg-vs-background/60 p-3">
      <span className="tag capitalize">{card.kind}</span>
      <p className="mt-2 line-clamp-2 text-sm font-semibold text-vs-heading">{card.title}</p>
      {card.subtitle !== undefined && (
        <p className="mt-1 line-clamp-1 text-xs text-vs-foreground-muted">{card.subtitle}</p>
      )}
      <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5">
        {card.links.map((link) => (
          <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className={EXTERNAL_LINK_CLASSES}>
            {link.label}
            <ExternalLinkIcon />
          </a>
        ))}
      </div>
    </div>
  );
}

function ThinkingRow() {
  const message = useThinkingMessage(WIDGET_LANGUAGE);

  return (
    <div className="flex items-center gap-2.5">
      <Image src={AVATAR_SRC} alt="" width={AVATAR_SIZE} height={AVATAR_SIZE} className="h-7 w-7 flex-shrink-0 rounded-full" />
      {/* min-h keeps the bubble a fixed height so a longer message cannot
          nudge the transcript as the copy rotates. */}
      <p className="flex min-h-9 items-center gap-1.5 rounded-full border border-vs-border bg-vs-background/60 px-3 py-2">
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            className="ask-mauro-typing-dot h-1.5 w-1.5 rounded-full bg-vs-primary"
            style={{ animationDelay: `${dot * TYPING_DOT_DELAY_S}s` }}
          />
        ))}
        {/* Hidden from assistive tech: the panel's live region announces one
            stable word instead of every rotation. */}
        <span
          key={message.text}
          aria-hidden="true"
          className="ask-mauro-thinking ml-1 min-w-[13rem] whitespace-nowrap text-xs text-vs-foreground-muted"
        >
          {message.glyph} {message.text}
        </span>
      </p>
    </div>
  );
}

function ErrorRow({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div role="alert" className="flex gap-2.5">
      <Image src={AVATAR_SRC} alt="" width={AVATAR_SIZE} height={AVATAR_SIZE} className="mt-0.5 h-7 w-7 flex-shrink-0 rounded-full" />
      <div className="max-w-[85%] space-y-2 rounded-2xl rounded-tl-md border border-vs-error/35 bg-vs-error/8 px-3.5 py-2.5">
        <p className="text-sm leading-relaxed text-vs-foreground/90">{message}</p>
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 rounded-lg border border-vs-border px-2.5 py-1 text-xs font-medium transition-colors duration-200 hover:border-vs-primary hover:text-vs-primary"
        >
          <RetryIcon />
          Try again
        </button>
      </div>
    </div>
  );
}

function Composer({
  disabled,
  onSend,
  onStop,
  textareaRef,
}: {
  disabled: boolean;
  onSend: (question: string) => void;
  /** Cancels the running generation for real; shown in place of Send. */
  onStop: () => void;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
}) {
  const [value, setValue] = useState('');

  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = 'auto';
    // Clamped at BOTH ends. scrollHeight is purely font/line-height driven, so
    // an empty composer measured 35px against a 36px send button and sat 3px
    // short of the row it lives in — the editable area looked compressed and
    // its top strip was not clickable. MIN_COMPOSER_HEIGHT_PX is the send
    // control's own height, so the two stay locked together instead of being
    // two independent numbers that happen to be close.
    const measured = Math.min(textarea.scrollHeight, MAX_COMPOSER_HEIGHT_PX);
    textarea.style.height = `${Math.max(measured, MIN_COMPOSER_HEIGHT_PX)}px`;
  }, [textareaRef, value]);

  function submit(event?: FormEvent) {
    event?.preventDefault();

    if (disabled || value.trim() === '') {
      return;
    }

    onSend(value);
    setValue('');
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submit();
    }
  }

  return (
    <form onSubmit={submit} className="border-t border-vs-border p-3">
      <div className="flex items-end gap-2 rounded-xl border border-vs-border bg-vs-background/60 p-1.5 transition-colors focus-within:border-vs-primary">
        {/* readOnly rather than disabled: a disabled textarea would drop
            keyboard focus to <body> for the whole 30-120s generation wait. */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          readOnly={disabled}
          maxLength={QUESTION_MAX_LENGTH}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Mauro something..."
          aria-label="Ask Mauro something"
          className={`min-h-9 flex-1 resize-none bg-transparent px-2 py-2 text-base leading-relaxed placeholder:text-vs-foreground-muted focus:outline-none sm:text-sm ${
            disabled ? 'opacity-60' : ''
          }`}
        />
        {value.length >= COUNTER_THRESHOLD && (
          <span
            aria-live="polite"
            className={`pb-2 font-mono text-[11px] tabular-nums ${
              value.length >= QUESTION_MAX_LENGTH ? 'text-vs-error' : 'text-vs-foreground-muted'
            }`}
          >
            {value.length}/{QUESTION_MAX_LENGTH}
          </span>
        )}
        {disabled ? (
          <button
            type="button"
            onClick={onStop}
            aria-label="Stop generating"
            className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-white transition-all duration-200 [background:var(--vs-error,#b3261e)] hover:brightness-110"
          >
            <StopIcon />
          </button>
        ) : (
          <button
            type="submit"
            disabled={value.trim() === ''}
            aria-label="Send question"
            className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-white transition-all duration-200 [background:var(--vs-button)] hover:brightness-110 disabled:opacity-35"
          >
            <SendIcon />
          </button>
        )}
      </div>
    </form>
  );
}

function StopIcon() {
  return (
    <svg aria-hidden="true" width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg aria-hidden="true" width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19V5" />
      <path d="m5 12 7-7 7 7" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg aria-hidden="true" width={LINK_ICON_SIZE} height={LINK_ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}

function RetryIcon() {
  return (
    <svg aria-hidden="true" width={RETRY_ICON_SIZE} height={RETRY_ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}
