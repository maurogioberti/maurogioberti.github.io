/**
 * Pure conversation state machine and copy for the Ask Mauro widget.
 *
 * The reducer owns every transition; React components only dispatch. The
 * local reveal animation is presentation state and stays out of the reducer —
 * only its timing constants and text helpers live here so they can be tested.
 */

import { QUESTION_MAX_LENGTH, type AskAnswer, type AskCard, type AskErrorKind } from './askMauroClient';

export const CONVERSATION_STATUS_IDLE = 'idle';
export const CONVERSATION_STATUS_ASKING = 'asking';
export const CONVERSATION_STATUS_REVEALING = 'revealing';

export type ConversationStatus =
  | typeof CONVERSATION_STATUS_IDLE
  | typeof CONVERSATION_STATUS_ASKING
  | typeof CONVERSATION_STATUS_REVEALING;

export interface UserMessage {
  id: number;
  role: 'user';
  text: string;
}

export interface AssistantMessage {
  id: number;
  role: 'assistant';
  content: string[];
  cards: AskCard[];
}

export type ConversationMessage = UserMessage | AssistantMessage;

export interface ConversationState {
  messages: ConversationMessage[];
  status: ConversationStatus;
  /** The question behind the request in flight or the last failure; enables retry. */
  pendingQuestion: string | null;
  error: AskErrorKind | null;
  nextMessageId: number;
}

export type ConversationAction =
  | { type: 'ask'; question: string }
  | { type: 'retry' }
  | { type: 'succeed'; answer: AskAnswer }
  | { type: 'fail'; kind: AskErrorKind }
  | { type: 'reveal-complete' };

export const INITIAL_CONVERSATION_STATE: ConversationState = {
  messages: [],
  status: CONVERSATION_STATUS_IDLE,
  pendingQuestion: null,
  error: null,
  nextMessageId: 1,
};

export function conversationReducer(state: ConversationState, action: ConversationAction): ConversationState {
  switch (action.type) {
    case 'ask': {
      const question = action.question.trim();

      if (state.status !== CONVERSATION_STATUS_IDLE || question === '' || question.length > QUESTION_MAX_LENGTH) {
        return state;
      }

      return {
        messages: [...state.messages, { id: state.nextMessageId, role: 'user', text: question }],
        status: CONVERSATION_STATUS_ASKING,
        pendingQuestion: question,
        error: null,
        nextMessageId: state.nextMessageId + 1,
      };
    }
    case 'retry': {
      // Re-asks the failed question; the user bubble is already on screen.
      if (state.status !== CONVERSATION_STATUS_IDLE || state.error === null || state.pendingQuestion === null) {
        return state;
      }

      return { ...state, status: CONVERSATION_STATUS_ASKING, error: null };
    }
    case 'succeed': {
      if (state.status !== CONVERSATION_STATUS_ASKING) {
        return state;
      }

      return {
        messages: [
          ...state.messages,
          {
            id: state.nextMessageId,
            role: 'assistant',
            content: action.answer.content,
            cards: action.answer.cards,
          },
        ],
        status: CONVERSATION_STATUS_REVEALING,
        pendingQuestion: null,
        error: null,
        nextMessageId: state.nextMessageId + 1,
      };
    }
    case 'fail': {
      if (state.status !== CONVERSATION_STATUS_ASKING) {
        return state;
      }

      return { ...state, status: CONVERSATION_STATUS_IDLE, error: action.kind };
    }
    case 'reveal-complete': {
      if (state.status !== CONVERSATION_STATUS_REVEALING) {
        return state;
      }

      return { ...state, status: CONVERSATION_STATUS_IDLE };
    }
  }
}

/* -------------------------------------------------------------------------- */
/*  Local reveal animation                                                    */
/*  The backend returns complete JSON; the reveal is purely presentational.   */
/* -------------------------------------------------------------------------- */

export const REVEAL_CHARS_PER_TICK = 3;
export const REVEAL_TICK_MS = 12;

export function countParagraphChars(paragraphs: readonly string[]): number {
  return paragraphs.reduce((total, paragraph) => total + paragraph.length, 0);
}

/**
 * Slices an answer to the first `visibleChars` characters across paragraph
 * boundaries, preserving one entry per paragraph so layout stays stable.
 */
export function sliceParagraphs(paragraphs: readonly string[], visibleChars: number): string[] {
  let remaining = visibleChars;

  return paragraphs.map((paragraph) => {
    const visible = paragraph.slice(0, Math.max(0, remaining));
    remaining -= paragraph.length;
    return visible;
  });
}

/* -------------------------------------------------------------------------- */
/*  Copy                                                                      */
/* -------------------------------------------------------------------------- */

export const ERROR_COPY: Record<AskErrorKind, string> = {
  invalid: "That question couldn't be processed. Try rephrasing it a bit.",
  busy: 'Ask Mauro is answering someone else right now. Try again in a moment.',
  rate_limited: "You've asked several questions in a short time. Give it a moment and try again.",
  unavailable: 'Ask Mauro is temporarily unavailable. Try again in a moment.',
  timeout: 'That answer took too long to generate. Please try again.',
  server: 'Something unexpected went wrong. Please try again.',
  network: "Can't reach Ask Mauro right now. Check that you're online and try again.",
};

/** Answers are generation-bound and can take tens of seconds; the label escalates while waiting. */
export const THINKING_STAGES = [
  { afterMs: 0, label: 'searching the profile' },
  { afterMs: 15000, label: 'still thinking — good answers take a moment' },
  { afterMs: 45000, label: 'almost there — thanks for the patience' },
] as const;

export const ANSWER_READY_ANNOUNCEMENT = 'Answer ready.';

export const SUGGESTED_QUESTIONS = [
  { label: 'Tech Lead role', question: 'What does Mauro do as a Tech Lead?' },
  { label: 'Why AI Architect?', question: 'Why does Mauro describe himself as an AI Architect?' },
  { label: 'RAG benchmark', question: 'What did Mauro learn benchmarking RAG in Python and .NET?' },
  { label: 'Mentoring', question: 'How does Mauro mentor developers?' },
] as const;
