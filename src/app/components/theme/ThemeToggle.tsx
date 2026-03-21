'use client';

import { MouseEvent, useEffect, useState } from 'react';

import {
  applyThemeMode,
  MEDIA_QUERY_CHANGE_EVENT,
  THEME_MODE_DARK,
  THEME_MODE_LIGHT,
  THEME_MODE_SYSTEM,
  getSystemThemeMediaQueryList,
  readEffectiveThemeFromDocument,
  readThemeModeFromDocument,
  syncSystemTheme,
  type ResolvedTheme,
  type ThemeMode,
  getOppositeTheme,
} from './theme';

const THEME_ICON_SIZE = 18;

export function ThemeToggle() {
  const [themeMode, setThemeMode] = useState<ThemeMode>(THEME_MODE_SYSTEM);
  const [effectiveTheme, setEffectiveTheme] = useState<ResolvedTheme>(THEME_MODE_DARK);

  useEffect(() => {
    const currentMode = readThemeModeFromDocument();
    setThemeMode(currentMode);
    setEffectiveTheme(readEffectiveThemeFromDocument(currentMode));
  }, []);

  useEffect(() => {
    const media = getSystemThemeMediaQueryList();

    const onChange = () => {
      if (themeMode === THEME_MODE_SYSTEM) {
        setEffectiveTheme(syncSystemTheme());
      }
    };

    media.addEventListener(MEDIA_QUERY_CHANGE_EVENT, onChange);

    return () => {
      media.removeEventListener(MEDIA_QUERY_CHANGE_EVENT, onChange);
    };
  }, [themeMode]);

  const nextTheme = getOppositeTheme(effectiveTheme);
  const buttonLabel = themeMode === THEME_MODE_SYSTEM
    ? `Theme follows system and is currently ${effectiveTheme}. Activate to switch to ${nextTheme}.`
    : `Theme is ${effectiveTheme}. Activate to switch to ${nextTheme}. Shift+click to return to system theme.`;

  function handleToggle(event: MouseEvent<HTMLButtonElement>) {
    const nextThemeMode = event.shiftKey ? THEME_MODE_SYSTEM : nextTheme;
    const nextEffectiveTheme = applyThemeMode(nextThemeMode);

    setThemeMode(nextThemeMode);
    setEffectiveTheme(nextEffectiveTheme);
  }

  return (
    <button
      type="button"
      aria-label={buttonLabel}
      title={buttonLabel}
      onClick={handleToggle}
      className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-vs-border text-vs-foreground-muted transition-colors duration-200 hover:border-vs-primary hover:bg-vs-background-secondary hover:text-vs-primary"
    >
      {nextTheme === THEME_MODE_DARK && <MoonIcon />}
      {nextTheme === THEME_MODE_LIGHT && <SunIcon />}
    </button>
  );
}

function MoonIcon() {
  return (
    <svg aria-hidden="true" width={THEME_ICON_SIZE} height={THEME_ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg aria-hidden="true" width={THEME_ICON_SIZE} height={THEME_ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}
