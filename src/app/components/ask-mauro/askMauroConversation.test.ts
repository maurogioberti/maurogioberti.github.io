import { faker } from '@faker-js/faker';
import { describe, expect, test } from '@jest/globals';

import { QUESTION_MAX_LENGTH, type AskAnswer } from './askMauroClient';
import {
  CONVERSATION_STATUS_ASKING,
  CONVERSATION_STATUS_IDLE,
  CONVERSATION_STATUS_REVEALING,
  INITIAL_CONVERSATION_STATE,
  conversationReducer,
  countParagraphChars,
  sliceParagraphs,
  type ConversationState,
} from './askMauroConversation';

function buildAnswer(): AskAnswer {
  return { content: [faker.lorem.paragraph(), faker.lorem.paragraph()], cards: [] };
}

function askedState(question: string): ConversationState {
  return conversationReducer(INITIAL_CONVERSATION_STATE, { type: 'ask', question });
}

function failedState(question: string): ConversationState {
  return conversationReducer(askedState(question), { type: 'fail', kind: 'busy' });
}

describe('conversationReducer', () => {
  test('ask should append the user message and start the request', () => {
    const question = faker.lorem.sentence();

    const state = askedState(`  ${question}  `);

    expect(state.messages).toEqual([{ id: 1, role: 'user', text: question }]);
    expect(state.status).toBe(CONVERSATION_STATUS_ASKING);
    expect(state.pendingQuestion).toBe(question);
    expect(state.error).toBeNull();
  });

  test('ask should ignore blank and over-long questions', () => {
    const overLong = 'a'.repeat(QUESTION_MAX_LENGTH + 1);

    expect(conversationReducer(INITIAL_CONVERSATION_STATE, { type: 'ask', question: '   ' })).toBe(
      INITIAL_CONVERSATION_STATE
    );
    expect(conversationReducer(INITIAL_CONVERSATION_STATE, { type: 'ask', question: overLong })).toBe(
      INITIAL_CONVERSATION_STATE
    );
  });

  test('ask should be ignored while a request is in flight', () => {
    const state = askedState(faker.lorem.sentence());

    const next = conversationReducer(state, { type: 'ask', question: faker.lorem.sentence() });

    expect(next).toBe(state);
  });

  test('fail should return to idle and keep the question available for retry', () => {
    const question = faker.lorem.sentence();

    const state = failedState(question);

    expect(state.status).toBe(CONVERSATION_STATUS_IDLE);
    expect(state.error).toBe('busy');
    expect(state.pendingQuestion).toBe(question);
    expect(state.messages).toHaveLength(1);
  });

  test('retry should clear the error without appending a duplicate user message', () => {
    const failed = failedState(faker.lorem.sentence());

    const state = conversationReducer(failed, { type: 'retry' });

    expect(state.status).toBe(CONVERSATION_STATUS_ASKING);
    expect(state.error).toBeNull();
    expect(state.messages).toEqual(failed.messages);
  });

  test('retry should be ignored when there is no failed question', () => {
    expect(conversationReducer(INITIAL_CONVERSATION_STATE, { type: 'retry' })).toBe(INITIAL_CONVERSATION_STATE);

    const asking = askedState(faker.lorem.sentence());

    expect(conversationReducer(asking, { type: 'retry' })).toBe(asking);
  });

  test('succeed should append the assistant message and start the reveal', () => {
    const answer = buildAnswer();

    const state = conversationReducer(askedState(faker.lorem.sentence()), { type: 'succeed', answer });

    expect(state.status).toBe(CONVERSATION_STATUS_REVEALING);
    expect(state.pendingQuestion).toBeNull();
    expect(state.messages).toHaveLength(2);
    expect(state.messages[1]).toEqual({ id: 2, role: 'assistant', content: answer.content, cards: answer.cards });
  });

  test('succeed should be ignored when no request is in flight', () => {
    const state = conversationReducer(INITIAL_CONVERSATION_STATE, { type: 'succeed', answer: buildAnswer() });

    expect(state).toBe(INITIAL_CONVERSATION_STATE);
  });

  test('reveal-complete should return the conversation to idle', () => {
    const revealing = conversationReducer(askedState(faker.lorem.sentence()), {
      type: 'succeed',
      answer: buildAnswer(),
    });

    const state = conversationReducer(revealing, { type: 'reveal-complete' });

    expect(state.status).toBe(CONVERSATION_STATUS_IDLE);
    expect(conversationReducer(state, { type: 'reveal-complete' })).toBe(state);
  });

  test('message ids should increase across the conversation', () => {
    const answer = buildAnswer();

    let state = askedState(faker.lorem.sentence());
    state = conversationReducer(state, { type: 'succeed', answer });
    state = conversationReducer(state, { type: 'reveal-complete' });
    state = conversationReducer(state, { type: 'ask', question: faker.lorem.sentence() });

    expect(state.messages.map((message) => message.id)).toEqual([1, 2, 3]);
  });
});

describe('sliceParagraphs', () => {
  test('should reveal characters across paragraph boundaries', () => {
    const paragraphs = ['abcde', 'fghij'];

    expect(sliceParagraphs(paragraphs, 0)).toEqual(['', '']);
    expect(sliceParagraphs(paragraphs, 3)).toEqual(['abc', '']);
    expect(sliceParagraphs(paragraphs, 7)).toEqual(['abcde', 'fg']);
    expect(sliceParagraphs(paragraphs, 10)).toEqual(paragraphs);
    expect(sliceParagraphs(paragraphs, 99)).toEqual(paragraphs);
  });

  test('countParagraphChars should total every paragraph', () => {
    const paragraphs = [faker.lorem.paragraph(), faker.lorem.paragraph()];

    expect(countParagraphChars(paragraphs)).toBe(paragraphs[0].length + paragraphs[1].length);
    expect(countParagraphChars([])).toBe(0);
  });
});

describe('cancel', () => {
  test('returns to idle from asking so the composer is usable again', () => {
    const asked = conversationReducer(INITIAL_CONVERSATION_STATE, {
      type: 'ask',
      question: 'What did Mauro present at DevBcn 2026?',
    });

    const cancelled = conversationReducer(asked, { type: 'cancel' });

    expect(cancelled.status).toBe(CONVERSATION_STATUS_IDLE);
    expect(cancelled.error).toBeNull();
  });

  test('keeps the already-rendered messages instead of erasing them', () => {
    const asked = conversationReducer(INITIAL_CONVERSATION_STATE, {
      type: 'ask',
      question: 'Tell me about RAG',
    });

    const cancelled = conversationReducer(asked, { type: 'cancel' });

    expect(cancelled.messages).toEqual(asked.messages);
  });

  test('can stop a partially revealed answer without completing it', () => {
    const asked = conversationReducer(INITIAL_CONVERSATION_STATE, {
      type: 'ask',
      question: 'Tell me about RAG',
    });
    const revealing = conversationReducer(asked, {
      type: 'succeed',
      answer: { content: ['One.', 'Two.'], cards: [] },
    });

    const cancelled = conversationReducer(revealing, { type: 'cancel' });

    expect(cancelled.status).toBe(CONVERSATION_STATUS_IDLE);
    expect(cancelled.messages).toHaveLength(2);
  });

  test('is a no-op when nothing is running', () => {
    expect(conversationReducer(INITIAL_CONVERSATION_STATE, { type: 'cancel' })).toBe(
      INITIAL_CONVERSATION_STATE
    );
  });
});
