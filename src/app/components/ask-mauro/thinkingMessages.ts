/**
 * Playful waiting copy for the "Ask Mauro is working" state.
 *
 * SHARED SOURCE OF TRUTH. This file is mirrored verbatim from the full web app
 * (`frontend/src/features/ask-mauro/`) — the two
 * apps are separate packages with no shared workspace, so the catalog is
 * copied rather than imported. Edit it here and copy it across; a test in each
 * codebase asserts the catalog it sees is intact.
 *
 * Tone: witty, mildly nerdy, warm, short. Never childish, never corporate.
 *
 * Every line is also *honest*, which is the constraint that actually shapes
 * the list. Nothing here claims to browse the internet, to contact Mauro, to
 * feel anything, or to be N% done — because none of that is true. What IS true
 * is the machinery: retrieval over embeddings, a very small local model, and a
 * grounding rule that forbids inventing facts. Those make better jokes anyway.
 *
 * The glyph is fixed per message, not random: it changes because the message
 * changed, which keeps the indicator lively without turning it into a slot
 * machine.
 */

export type ThinkingLanguage = 'en' | 'es';

export interface ThinkingMessage {
  /** Small leading glyph. Decorative — always hidden from assistive tech. */
  readonly glyph: string;
  readonly text: string;
}

const EN: readonly ThinkingMessage[] = [
  { glyph: "✦", text: "Thinking..." },
  { glyph: "⌁", text: "Shuffling some artificial neurons..." },
  { glyph: "∿", text: "Looking through the wires..." },
  { glyph: "◆", text: "Checking my digital memory..." },
  { glyph: "✧", text: "Give me a second, this one's interesting..." },
  { glyph: "⟡", text: "Doing vector magic..." },
  { glyph: "✦", text: "Connecting some dots..." },
  { glyph: "≋", text: "Reading between the embeddings..." },
  { glyph: "⌇", text: "Cooking an answer..." },
  { glyph: "⚙", text: "Compiling thoughts..." },
  { glyph: "◇", text: "Playing with the data..." },
  { glyph: "▤", text: "Opening some mental drawers..." },
  { glyph: "⁂", text: "A tiny bit of AI wizardry happening..." },
  { glyph: "⌘", text: "Checking that Mauro actually did that..." },
  { glyph: "⊹", text: "Trying very hard not to hallucinate..." },
  { glyph: "◦", text: "Only 0.6B neurons, give me a moment 😄" },
  { glyph: "⚙", text: "Working... surprisingly." },
  { glyph: "✦", text: "Let's see what I can find..." },
  { glyph: "⌁", text: "Grepping the portfolio..." },
  { glyph: "≋", text: "Sorting vectors by vibes. Cosine ones." },
] as const;

const ES: readonly ThinkingMessage[] = [
  { glyph: "✦", text: "Pensando..." },
  { glyph: "⌁", text: "Revolviendo neuronas artificiales..." },
  { glyph: "∿", text: "Buscando entre los cables..." },
  { glyph: "◆", text: "Consultando mi yo digital..." },
  { glyph: "✧", text: "Dame un segundo, esto está interesante..." },
  { glyph: "⟡", text: "Haciendo magia con vectores..." },
  { glyph: "▤", text: "Ordenando recuerdos..." },
  { glyph: "✦", text: "Conectando puntitos..." },
  { glyph: "◦", text: "Preguntándole al pequeño cerebro..." },
  { glyph: "≋", text: "Leyendo entre embeddings..." },
  { glyph: "⌇", text: "Un momento, estoy cocinando la respuesta..." },
  { glyph: "⚙", text: "Compilando pensamientos..." },
  { glyph: "◇", text: "Jugando con los datos..." },
  { glyph: "▤", text: "Abriendo cajones mentales..." },
  { glyph: "⁂", text: "Esto requiere un poquito de brujería..." },
  { glyph: "⊹", text: "Buscando algo que no suene inventado..." },
  { glyph: "⌘", text: "Chequeando que Mauro realmente haya hecho eso..." },
  { glyph: "◦", text: "No me apures, tengo 0.6B neuronas 😄" },
  { glyph: "⚙", text: "Trabajando... sorprendentemente." },
  { glyph: "✦", text: "A ver qué encuentro..." },
] as const;

export const THINKING_MESSAGES: Record<ThinkingLanguage, readonly ThinkingMessage[]> = {
  en: EN,
  es: ES,
};

/** Stable, non-rotating label for assistive technology (see useThinkingMessage). */
export const THINKING_ARIA_LABEL: Record<ThinkingLanguage, string> = {
  en: "Thinking",
  es: "Pensando",
};

/** How long each message stays on screen. */
export const ROTATE_MS = 2500;

/**
 * A shuffled pass over the catalog.
 *
 * Shuffling rather than picking at random each tick is what guarantees the
 * "no repeat within one request" rule for free: a full pass shows every
 * message at most once, and 20 messages at 2.5 s covers ~50 s of waiting —
 * far longer than any real answer takes.
 *
 * `avoid` keeps the first message of a new pass from repeating the last one
 * shown, which is the only place a duplicate could appear back to back.
 */
export function shuffledMessages(
  language: ThinkingLanguage,
  random: () => number = Math.random,
  avoid?: string,
): ThinkingMessage[] {
  const pool = [...THINKING_MESSAGES[language]];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [pool[i], pool[j]] = [pool[j]!, pool[i]!];
  }
  if (avoid !== undefined && pool.length > 1 && pool[0]!.text === avoid) {
    [pool[0], pool[1]] = [pool[1]!, pool[0]!];
  }
  return pool;
}
