import { describe, expect, it } from 'vitest';
import { editDistance, isCloseMatch, normalize } from '../src/matching.js';

describe('normalize', () => {
  it('lowercases, trims, and strips punctuation', () => {
    expect(normalize('  Jupiter!  ')).toBe('jupiter');
  });

  it('collapses internal whitespace', () => {
    expect(normalize('the   moon')).toBe('the moon');
  });
});

describe('editDistance', () => {
  it('is 0 for identical strings', () => {
    expect(editDistance('mars', 'mars')).toBe(0);
  });

  it('counts a single substitution', () => {
    expect(editDistance('mars', 'mard')).toBe(1);
  });

  it('handles empty strings', () => {
    expect(editDistance('', 'abc')).toBe(3);
    expect(editDistance('abc', '')).toBe(3);
  });
});

describe('isCloseMatch', () => {
  it('accepts an exact match', () => {
    expect(isCloseMatch('Jupiter', 'Jupiter')).toBe(true);
  });

  it('accepts a single typo on a long name', () => {
    expect(isCloseMatch('jupitor', 'Jupiter')).toBe(true);
  });

  it('requires an exact match on very short names', () => {
    expect(isCloseMatch('mats', 'Mars')).toBe(false);
  });

  it('rejects an unrelated word', () => {
    expect(isCloseMatch('banana', 'Jupiter')).toBe(false);
  });

  it('rejects an empty answer', () => {
    expect(isCloseMatch('', 'Jupiter')).toBe(false);
  });
});
