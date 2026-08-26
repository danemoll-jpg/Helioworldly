// The player's chosen display name for the global leaderboard — remembered locally so they
// aren't asked every time, but never tied to any account.
const STORAGE_KEY = 'helioworldly.playerName';

export function getStoredPlayerName(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? '';
  } catch {
    return '';
  }
}

export function setStoredPlayerName(name: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, name.trim().slice(0, 24));
  } catch {
    // localStorage unavailable (private browsing, etc.) — silently no-op, same as storage.ts.
  }
}

export function isValidPlayerName(name: string): boolean {
  const trimmed = name.trim();
  return trimmed.length >= 1 && trimmed.length <= 24;
}
