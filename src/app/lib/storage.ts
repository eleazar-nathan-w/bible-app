// Local storage utilities for persisting user data offline

export interface Highlight {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  color: string;
  timestamp: number;
}

export interface Note {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  content: string;
  timestamp: number;
}

export interface Bookmark {
  id: string;
  book: string;
  chapter: number;
  verse?: number;
  timestamp: number;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  fontFamily: 'serif' | 'sans-serif';
  translation: string;
  language: string;
  autoPlayAudio: boolean;
  playbackSpeed: number;
}

export interface PlanProgress {
  planId: string;
  completedDays: number[];
  startedAt: number;
  lastReadAt: number;
}

export interface UserProfile {
  name: string;
}

const STORAGE_KEYS = {
  HIGHLIGHTS: 'bible_highlights',
  NOTES: 'bible_notes',
  BOOKMARKS: 'bible_bookmarks',
  PREFERENCES: 'bible_preferences',
  PROFILE: 'bible_profile',
  PLAN_PROGRESS: 'bible_plan_progress',
  LAST_READ: 'bible_last_read',
};

// Highlights
export function getHighlights(): Highlight[] {
  const data = localStorage.getItem(STORAGE_KEYS.HIGHLIGHTS);
  return data ? JSON.parse(data) : [];
}

export function addHighlight(highlight: Omit<Highlight, 'id' | 'timestamp'>): Highlight {
  const highlights = getHighlights();
  const newHighlight: Highlight = {
    ...highlight,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };
  highlights.push(newHighlight);
  localStorage.setItem(STORAGE_KEYS.HIGHLIGHTS, JSON.stringify(highlights));
  return newHighlight;
}

export function removeHighlight(id: string): void {
  const highlights = getHighlights().filter(h => h.id !== id);
  localStorage.setItem(STORAGE_KEYS.HIGHLIGHTS, JSON.stringify(highlights));
}

export function getVerseHighlight(book: string, chapter: number, verse: number): Highlight | undefined {
  return getHighlights().find(
    h => h.book === book && h.chapter === chapter && h.verse === verse
  );
}

// Notes
export function getNotes(): Note[] {
  const data = localStorage.getItem(STORAGE_KEYS.NOTES);
  return data ? JSON.parse(data) : [];
}

export function addNote(note: Omit<Note, 'id' | 'timestamp'>): Note {
  const notes = getNotes();
  const newNote: Note = {
    ...note,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };
  notes.push(newNote);
  localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  return newNote;
}

export function updateNote(id: string, content: string): void {
  const notes = getNotes().map(n => 
    n.id === id ? { ...n, content, timestamp: Date.now() } : n
  );
  localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
}

export function removeNote(id: string): void {
  const notes = getNotes().filter(n => n.id !== id);
  localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
}

export function getVerseNotes(book: string, chapter: number, verse: number): Note[] {
  return getNotes().filter(
    n => n.book === book && n.chapter === chapter && n.verse === verse
  );
}

// Bookmarks
export function getBookmarks(): Bookmark[] {
  const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
  return data ? JSON.parse(data) : [];
}

export function addBookmark(bookmark: Omit<Bookmark, 'id' | 'timestamp'>): Bookmark {
  const bookmarks = getBookmarks();
  const newBookmark: Bookmark = {
    ...bookmark,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };
  bookmarks.push(newBookmark);
  localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
  return newBookmark;
}

export function removeBookmark(id: string): void {
  const bookmarks = getBookmarks().filter(b => b.id !== id);
  localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
}

export function isBookmarked(book: string, chapter: number, verse?: number): boolean {
  return getBookmarks().some(
    b => b.book === book && b.chapter === chapter && 
         (verse === undefined || b.verse === verse)
  );
}

// Preferences
export function getPreferences(): UserPreferences {
  const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
  return data ? JSON.parse(data) : {
    theme: 'system',
    fontSize: 'medium',
    fontFamily: 'serif',
    translation: 'kjv',
    language: 'en',
    autoPlayAudio: false,
    playbackSpeed: 1.0,
  };
}

export function updatePreferences(preferences: Partial<UserPreferences>): void {
  const current = getPreferences();
  const updated = { ...current, ...preferences };
  localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated));
}

// User Profile
export function getUserProfile(): UserProfile {
  const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
  return data ? JSON.parse(data) : { name: '' };
}

export function updateUserProfile(profile: Partial<UserProfile>): void {
  const current = getUserProfile();
  const updated = { ...current, ...profile };
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('bible-profile-updated', { detail: updated }));
  }
}

// Reading Plan Progress
export function getPlanProgress(planId: string): PlanProgress | null {
  const data = localStorage.getItem(STORAGE_KEYS.PLAN_PROGRESS);
  const allProgress: PlanProgress[] = data ? JSON.parse(data) : [];
  return allProgress.find(p => p.planId === planId) || null;
}

export function updatePlanProgress(planId: string, dayNumber: number, completed: boolean): void {
  const data = localStorage.getItem(STORAGE_KEYS.PLAN_PROGRESS);
  const allProgress: PlanProgress[] = data ? JSON.parse(data) : [];
  
  let planProgress = allProgress.find(p => p.planId === planId);
  
  if (!planProgress) {
    planProgress = {
      planId,
      completedDays: [],
      startedAt: Date.now(),
      lastReadAt: Date.now(),
    };
    allProgress.push(planProgress);
  }
  
  if (completed && !planProgress.completedDays.includes(dayNumber)) {
    planProgress.completedDays.push(dayNumber);
  } else if (!completed) {
    planProgress.completedDays = planProgress.completedDays.filter(d => d !== dayNumber);
  }
  
  planProgress.lastReadAt = Date.now();
  
  localStorage.setItem(STORAGE_KEYS.PLAN_PROGRESS, JSON.stringify(allProgress));
}

export function getAllPlanProgress(): PlanProgress[] {
  const data = localStorage.getItem(STORAGE_KEYS.PLAN_PROGRESS);
  return data ? JSON.parse(data) : [];
}

// Last Read Position
export function getLastRead(): { book: string; chapter: number } | null {
  const data = localStorage.getItem(STORAGE_KEYS.LAST_READ);
  return data ? JSON.parse(data) : null;
}

export function setLastRead(book: string, chapter: number): void {
  localStorage.setItem(STORAGE_KEYS.LAST_READ, JSON.stringify({ book, chapter }));
}
