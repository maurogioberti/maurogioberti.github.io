import 'server-only';

import { codeToHtml } from 'shiki';

const SUPPORTED_LANGUAGES = ['ts', 'js', 'json', 'bash', 'csharp'] as const;
type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
const SUPPORTED_LANGUAGE_SET = new Set<SupportedLanguage>(SUPPORTED_LANGUAGES);

const PRE_BLOCK_REGEX = /<pre([^>]*)>([\s\S]*?)<\/pre>/gi;
const CODE_BLOCK_REGEX = /^<code[^>]*>([\s\S]*?)<\/code>$/i;
const HIGHLIGHTED_PRE_REGEX = /^<pre([^>]*)>([\s\S]*?)<\/pre>$/i;

const LANGUAGE_ALIASES: Record<string, SupportedLanguage> = {
  bash: 'bash',
  csharp: 'csharp',
  cs: 'csharp',
  javascript: 'js',
  js: 'js',
  json: 'json',
  shell: 'bash',
  sh: 'bash',
  ts: 'ts',
  typescript: 'ts',
};

export async function highlightCode(code: string, language: SupportedLanguage): Promise<string> {
  return await codeToHtml(code, {
    lang: language,
    themes: {
      light: 'github-light',
      dark: 'github-dark',
    },
    defaultColor: false,
  });
}

export async function highlightBlogCodeBlocks(html: string): Promise<string> {
  const matches = Array.from(html.matchAll(PRE_BLOCK_REGEX));

  if (matches.length === 0) {
    return html;
  }

  const segments: string[] = [];
  let lastIndex = 0;

  for (const match of matches) {
    const fullMatch = match[0];
    const matchIndex = match.index ?? 0;
    const attributes = match[1] ?? '';
    const rawCode = extractRawCode(match[2] ?? '');
    const language = resolveLanguage(attributes, rawCode);

    segments.push(html.slice(lastIndex, matchIndex));

    if (!language) {
      segments.push(fullMatch);
      lastIndex = matchIndex + fullMatch.length;
      continue;
    }

    const highlightedHtml = await highlightCode(rawCode, language);
    const highlightedPre = extractHighlightedPre(highlightedHtml);

    if (!highlightedPre) {
      segments.push(fullMatch);
      lastIndex = matchIndex + fullMatch.length;
      continue;
    }

    segments.push(
      `<pre${mergePreAttributes(attributes, highlightedPre.attributes)}>${highlightedPre.codeHtml}</pre>`
    );
    lastIndex = matchIndex + fullMatch.length;
  }

  segments.push(html.slice(lastIndex));

  return segments.join('');
}

function extractRawCode(blockHtml: string): string {
  const codeMatch = blockHtml.match(CODE_BLOCK_REGEX);
  const rawCode = codeMatch ? codeMatch[1] : blockHtml;

  return decodeHtmlEntities(rawCode)
    .replace(/^\r?\n/, '')
    .replace(/\r?\n\s*$/, '');
}

function extractHighlightedPre(highlightedHtml: string): { attributes: string; codeHtml: string } | undefined {
  const match = highlightedHtml.match(HIGHLIGHTED_PRE_REGEX);

  if (!match) {
    return undefined;
  }

  return {
    attributes: match[1] ?? '',
    codeHtml: match[2] ?? '',
  };
}

function mergePreAttributes(originalAttributes: string, highlightedAttributes: string): string {
  const mergedClasses = mergeClassNames(
    readAttributeValue(originalAttributes, 'class'),
    readAttributeValue(highlightedAttributes, 'class')
  );
  const mergedStyles = mergeStyles(
    readAttributeValue(originalAttributes, 'style'),
    readAttributeValue(highlightedAttributes, 'style')
  );
  const remainingAttributes = [
    removeAttribute(originalAttributes, 'class'),
    removeAttribute(highlightedAttributes, 'class'),
  ]
    .map((attributes) => removeAttribute(attributes, 'style'))
    .map((attributes) => removeAttribute(attributes, 'data-shiki'))
    .map((attributes) => attributes.trim())
    .filter(Boolean);

  const attributes = [...remainingAttributes];

  if (mergedClasses) {
    attributes.push(`class="${escapeAttributeValue(mergedClasses)}"`);
  }

  if (mergedStyles) {
    attributes.push(`style="${escapeAttributeValue(mergedStyles)}"`);
  }

  attributes.push('data-shiki="true"');

  return attributes.length > 0 ? ` ${attributes.join(' ')}` : '';
}

function readAttributeValue(attributes: string, attributeName: string): string | undefined {
  return attributes.match(new RegExp(`(?:^|\\s)${attributeName}=["']([^"']*)["']`, 'i'))?.[1];
}

function removeAttribute(attributes: string, attributeName: string): string {
  return attributes.replace(new RegExp(`(?:^|\\s)${attributeName}=["'][^"']*["']`, 'ig'), '');
}

function mergeClassNames(...values: Array<string | undefined>): string | undefined {
  const classNames = Array.from(
    new Set(
      values
        .flatMap((value) => value?.split(/\s+/) ?? [])
        .map((value) => value.trim())
        .filter(Boolean)
    )
  );

  return classNames.length > 0 ? classNames.join(' ') : undefined;
}

function mergeStyles(...values: Array<string | undefined>): string | undefined {
  const declarations = values
    .flatMap((value) => value?.split(';') ?? [])
    .map((value) => value.trim())
    .filter(Boolean);

  return declarations.length > 0 ? `${declarations.join('; ')};` : undefined;
}

function escapeAttributeValue(value: string): string {
  return value.replace(/"/g, '&quot;');
}

function resolveLanguage(attributes: string, code: string): SupportedLanguage | undefined {
  return readLanguageFromAttributes(attributes) ?? detectLanguage(code);
}

function readLanguageFromAttributes(attributes: string): SupportedLanguage | undefined {
  const dataLanguageMatch = attributes.match(/data-(?:lang|language)=["']([^"']+)["']/i);
  const classLanguageMatch = attributes.match(/class=["'][^"']*language-([a-z0-9#+-]+)[^"']*["']/i);

  return normalizeLanguage(dataLanguageMatch?.[1] ?? classLanguageMatch?.[1]);
}

function detectLanguage(code: string): SupportedLanguage | undefined {
  const trimmedCode = code.trim();

  if (!trimmedCode) {
    return undefined;
  }

  if (looksLikeJson(trimmedCode)) {
    return 'json';
  }

  if (looksLikeCSharp(trimmedCode)) {
    return 'csharp';
  }

  if (looksLikeBash(trimmedCode)) {
    return 'bash';
  }

  if (looksLikeTypeScript(trimmedCode)) {
    return 'ts';
  }

  if (looksLikeJavaScript(trimmedCode)) {
    return 'js';
  }

  return undefined;
}

function normalizeLanguage(language?: string): SupportedLanguage | undefined {
  if (!language) {
    return undefined;
  }

  const normalizedLanguage = LANGUAGE_ALIASES[language.trim().toLowerCase()];
  return normalizedLanguage && SUPPORTED_LANGUAGE_SET.has(normalizedLanguage)
    ? normalizedLanguage
    : undefined;
}

function looksLikeJson(code: string): boolean {
  if (!/^[\[{]/.test(code)) {
    return false;
  }

  try {
    JSON.parse(code);
    return true;
  } catch {
    return false;
  }
}

function looksLikeCSharp(code: string): boolean {
  return /\[Fact\]|\bpublic\s+(?:class|struct|interface|enum)\b|\bpublic\s+async\s+Task\b|\bDateTime\.|\bAssert\.|\bHttpStatusCode\b|\busing\s+[A-Z][\w.]*(?:\.[A-Z][\w.]*)*;/.test(code);
}

function looksLikeBash(code: string): boolean {
  return /^(?:\s*\$ ?)?(?:npm|npx|pnpm|yarn|git|dotnet|node|cd|ls|mkdir|cp|mv|rm|curl)\b/m.test(code)
    || /[├└]──/.test(code)
    || /^\/[\w/-]+$/m.test(code);
}

function looksLikeTypeScript(code: string): boolean {
  return /\binterface\b|\btype\b|\bimplements\b|\breadonly\b|:\s*(?:string|number|boolean|unknown|any|void|Promise<)/.test(code);
}

function looksLikeJavaScript(code: string): boolean {
  return /\b(?:const|let|var|function|export|import|async|await)\b/.test(code);
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}
