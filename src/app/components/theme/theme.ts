export const THEME_MODE_SYSTEM = 'system';
export const THEME_MODE_DARK = 'dark';
export const THEME_MODE_LIGHT = 'light';

export const THEME_STORAGE_KEY = 'vs-theme-mode';
export const DARK_MEDIA_QUERY = '(prefers-color-scheme: dark)';
export const MEDIA_QUERY_CHANGE_EVENT = 'change';

export const DATASET_THEME = 'theme';
export const DATASET_THEME_MODE = 'themeMode';
export const DATA_THEME_ATTRIBUTE = 'data-theme';
export const DATA_THEME_MODE_ATTRIBUTE = 'data-theme-mode';

const THEME_MODE_VALUES = [
  THEME_MODE_SYSTEM,
  THEME_MODE_DARK,
  THEME_MODE_LIGHT,
] as const;

export type ThemeMode = (typeof THEME_MODE_VALUES)[number];
export type ResolvedTheme = Exclude<ThemeMode, typeof THEME_MODE_SYSTEM>;

export function isThemeMode(value: string | null | undefined): value is ThemeMode {
  return typeof value === 'string' && THEME_MODE_VALUES.includes(value as ThemeMode);
}

export function resolveTheme(mode: ThemeMode, prefersDark: boolean): ResolvedTheme {
  if (mode === THEME_MODE_SYSTEM) {
    return prefersDark ? THEME_MODE_DARK : THEME_MODE_LIGHT;
  }

  return mode;
}

export function getOppositeTheme(theme: ResolvedTheme): ResolvedTheme {
  return theme === THEME_MODE_DARK ? THEME_MODE_LIGHT : THEME_MODE_DARK;
}

export function getSystemThemeMediaQueryList(): MediaQueryList {
  return window.matchMedia(DARK_MEDIA_QUERY);
}

export function getSystemPrefersDark(): boolean {
  return getSystemThemeMediaQueryList().matches;
}

export function applyThemeMode(mode: ThemeMode): ResolvedTheme {
  const theme = resolveTheme(mode, getSystemPrefersDark());
  const root = document.documentElement;

  root.dataset[DATASET_THEME_MODE] = mode;
  root.dataset[DATASET_THEME] = theme;

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {}

  return theme;
}

export function syncSystemTheme(): ResolvedTheme {
  const theme = resolveTheme(THEME_MODE_SYSTEM, getSystemPrefersDark());
  document.documentElement.dataset[DATASET_THEME] = theme;
  return theme;
}

export function readThemeModeFromDocument(): ThemeMode {
  if (typeof document === 'undefined') {
    return THEME_MODE_SYSTEM;
  }

  const currentMode = document.documentElement.dataset[DATASET_THEME_MODE];
  return isThemeMode(currentMode) ? currentMode : THEME_MODE_SYSTEM;
}

export function readEffectiveThemeFromDocument(mode: ThemeMode): ResolvedTheme {
  if (typeof document === 'undefined') {
    return THEME_MODE_DARK;
  }

  const currentTheme = document.documentElement.dataset[DATASET_THEME];

  if (currentTheme === THEME_MODE_DARK || currentTheme === THEME_MODE_LIGHT) {
    return currentTheme;
  }

  return resolveTheme(mode, getSystemPrefersDark());
}

export const themeInitScript = `
(() => {
  const storageKey = ${JSON.stringify(THEME_STORAGE_KEY)};
  const root = document.documentElement;
  const media = window.matchMedia(${JSON.stringify(DARK_MEDIA_QUERY)});
  let mode = ${JSON.stringify(THEME_MODE_SYSTEM)};

  try {
    const stored = window.localStorage.getItem(storageKey);
    if (
      stored === ${JSON.stringify(THEME_MODE_SYSTEM)} ||
      stored === ${JSON.stringify(THEME_MODE_DARK)} ||
      stored === ${JSON.stringify(THEME_MODE_LIGHT)}
    ) {
      mode = stored;
    }
  } catch {}

  root.dataset[${JSON.stringify(DATASET_THEME_MODE)}] = mode;
  root.dataset[${JSON.stringify(DATASET_THEME)}] = mode === ${JSON.stringify(THEME_MODE_SYSTEM)}
    ? (media.matches ? ${JSON.stringify(THEME_MODE_DARK)} : ${JSON.stringify(THEME_MODE_LIGHT)})
    : mode;
})();
`.trim();

export const extensionHydrationCleanupScript = `
(() => {
  const attributeNames = new Set([
    'bis_skin_checked',
    'bis_register',
    'bis_use',
    'data-bis-config',
    'data-dynamic-id',
    'data-gr-ext-installed',
    'data-new-gr-c-s-check-loaded',
  ]);
  const processedPattern = /^__processed_[\\\\w-]+__$/;
  const extensionProtocols = ['chrome-extension:', 'moz-extension:', 'safari-web-extension:'];

  const shouldRemove = (name) => attributeNames.has(name) || processedPattern.test(name);
  const hasExtensionSource = (element) => {
    if (!(element instanceof HTMLScriptElement)) {
      return false;
    }

    const source = element.getAttribute('src');
    return typeof source === 'string' && extensionProtocols.some((protocol) => source.startsWith(protocol));
  };

  const cleanElement = (element) => {
    if (!(element instanceof Element)) {
      return;
    }

    for (const attribute of Array.from(element.attributes)) {
      if (shouldRemove(attribute.name)) {
        element.removeAttribute(attribute.name);
      }
    }

    if (hasExtensionSource(element)) {
      element.removeAttribute('src');
      element.removeAttribute('type');
      element.removeAttribute('charset');
    }
  };

  const cleanSubtree = (root) => {
    cleanElement(root);

    if (!(root instanceof Element)) {
      return;
    }

    for (const element of root.querySelectorAll('*')) {
      cleanElement(element);
    }
  };

  const root = document.documentElement;

  if (!root) {
    return;
  }

  cleanSubtree(root);

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'attributes') {
        cleanElement(mutation.target);
        continue;
      }

      for (const node of mutation.addedNodes) {
        cleanSubtree(node);
      }
    }
  });

  observer.observe(root, {
    attributes: true,
    childList: true,
    subtree: true,
  });

  window.setTimeout(() => observer.disconnect(), 5000);
})();
`.trim();