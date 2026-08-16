import { useEffect, useRef, useState } from 'react';
import {
  ROTATE_MS,
  shuffledMessages,
  type ThinkingLanguage,
  type ThinkingMessage,
} from './thinkingMessages';

/**
 * Rotating waiting copy, one message at a time.
 *
 * SHARED SOURCE OF TRUTH — mirrored verbatim from the full web app.
 *
 * Driven by MOUNT, not by a status flag: the waiting indicator is rendered
 * only while a request is genuinely pending, so mounting starts the rotation
 * and unmounting stops it. That makes every "stop the rotation" case — answer
 * arrived, request failed, user pressed Stop, panel closed, component
 * unmounted — the same single code path, with no way for a timer to outlive
 * the thing it belongs to.
 *
 * It also means a Tier 0 canonical answer (~5 ms) is never slowed down: the
 * indicator has no minimum lifetime and nothing here defers the response. If
 * the answer beats the first paint, no waiting state is shown at all — which
 * is the correct outcome, not a bug.
 */
export function useThinkingMessage(
  language: ThinkingLanguage,
  options: { random?: () => number; rotateMs?: number } = {},
): ThinkingMessage {
  const { random, rotateMs = ROTATE_MS } = options;
  // Regenerated per mount and per language change; `useRef` would keep a stale
  // pass alive across a language switch.
  const [queue, setQueue] = useState<ThinkingMessage[]>(() => shuffledMessages(language, random));
  const [index, setIndex] = useState(0);
  const lastShown = useRef<string | undefined>(undefined);

  useEffect(() => {
    setQueue(shuffledMessages(language, random, lastShown.current));
    setIndex(0);
    // `random` is a test seam and intentionally not a dependency: a caller
    // passing an inline function must not restart the rotation every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((current) => {
        const next = current + 1;
        if (next < queue.length) return next;
        // Exhausted the pass: reshuffle, avoiding an immediate repeat of the
        // message currently on screen.
        setQueue(shuffledMessages(language, random, queue[current]?.text));
        return 0;
      });
    }, rotateMs);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue, language, rotateMs]);

  const message = queue[index] ?? queue[0]!;
  lastShown.current = message.text;
  return message;
}
