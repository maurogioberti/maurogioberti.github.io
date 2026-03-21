import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';

import {
  DARK_MEDIA_QUERY,
  DATASET_THEME,
  DATASET_THEME_MODE,
  DATA_THEME_ATTRIBUTE,
  DATA_THEME_MODE_ATTRIBUTE,
  THEME_MODE_DARK,
  THEME_MODE_LIGHT,
  THEME_MODE_SYSTEM,
  THEME_STORAGE_KEY,
  getOppositeTheme,
  resolveTheme,
  themeInitScript,
} from './theme';

describe('theme utilities', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: ((query: string) => ({
        matches: query === DARK_MEDIA_QUERY,
        media: query,
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })) as typeof window.matchMedia,
    });
  });

  afterEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute(DATA_THEME_ATTRIBUTE);
    document.documentElement.removeAttribute(DATA_THEME_MODE_ATTRIBUTE);
  });

  test('resolveTheme should follow the system preference in system mode', () => {
    expect(resolveTheme(THEME_MODE_SYSTEM, true)).toBe(THEME_MODE_DARK);
    expect(resolveTheme(THEME_MODE_SYSTEM, false)).toBe(THEME_MODE_LIGHT);
    expect(resolveTheme(THEME_MODE_DARK, false)).toBe(THEME_MODE_DARK);
  });

  test('getOppositeTheme should return the opposite effective theme', () => {
    expect(getOppositeTheme(THEME_MODE_DARK)).toBe(THEME_MODE_LIGHT);
    expect(getOppositeTheme(THEME_MODE_LIGHT)).toBe(THEME_MODE_DARK);
  });

  test('themeInitScript should sanitize invalid stored values', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'invalid-theme');

    new Function(themeInitScript)();

    expect(document.documentElement.dataset[DATASET_THEME_MODE]).toBe(THEME_MODE_SYSTEM);
    expect(document.documentElement.dataset[DATASET_THEME]).toBe(THEME_MODE_DARK);
  });

  test('themeInitScript should apply a stored light preference', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, THEME_MODE_LIGHT);

    new Function(themeInitScript)();

    expect(document.documentElement.dataset[DATASET_THEME_MODE]).toBe(THEME_MODE_LIGHT);
    expect(document.documentElement.dataset[DATASET_THEME]).toBe(THEME_MODE_LIGHT);
  });
});
