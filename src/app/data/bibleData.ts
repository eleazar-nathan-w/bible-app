import Papa from 'papaparse';
import bibleCsvRaw from './bible.csv?raw';

// Bible data structure
export interface BibleVerse {
  number: number;
  text: string;
}

export interface BibleChapter {
  chapter: number;
  verses: BibleVerse[];
}

export interface BibleBook {
  name: string;
  shortName: string;
  chapters: BibleChapter[];
  testament: 'old' | 'new';
}

export interface BibleTranslation {
  id: string;
  name: string;
  abbreviation: string;
  language: string;
}

export const translations: BibleTranslation[] = [
  { id: 'kjv', name: 'King James Version', abbreviation: 'KJV', language: 'English' },
  { id: 'niv', name: 'New International Version', abbreviation: 'NIV', language: 'English' },
  { id: 'esv', name: 'English Standard Version', abbreviation: 'ESV', language: 'English' },
  { id: 'nlt', name: 'New Living Translation', abbreviation: 'NLT', language: 'English' },
  { id: 'nkjv', name: 'New King James Version', abbreviation: 'NKJV', language: 'English' },
  { id: 'msg', name: 'The Message', abbreviation: 'MSG', language: 'English' },
  { id: 'amp', name: 'Amplified Bible', abbreviation: 'AMP', language: 'English' },
  { id: 'rvr60', name: 'Reina-Valera 1960', abbreviation: 'RVR60', language: 'Spanish' },
  { id: 'lsg', name: 'Louis Segond', abbreviation: 'LSG', language: 'French' },
  { id: 'bhs', name: 'Biblia Hebraica Stuttgartensia', abbreviation: 'BHS', language: 'Hebrew' },
];

interface CsvBibleRow {
  citation: string;
  book: string;
  chapter: string;
  verse: string;
  text: string;
}

const OLD_TESTAMENT_BOOKS = new Set([
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth',
  '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra',
  'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon',
  'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
  'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah',
  'Malachi',
]);

const BOOK_SHORT_NAMES: Record<string, string> = {
  Genesis: 'Gen',
  Exodus: 'Exod',
  Leviticus: 'Lev',
  Numbers: 'Num',
  Deuteronomy: 'Deut',
  Psalms: 'Ps',
  Proverbs: 'Prov',
  Ecclesiastes: 'Eccl',
  'Song of Solomon': 'Song',
  Matthew: 'Matt',
  Mark: 'Mark',
  Luke: 'Luke',
  John: 'John',
  Acts: 'Acts',
  Romans: 'Rom',
  Philippians: 'Phil',
  '1 Corinthians': '1Cor',
  '2 Corinthians': '2Cor',
  '1 Thessalonians': '1Thess',
  '2 Thessalonians': '2Thess',
  '1 Timothy': '1Tim',
  '2 Timothy': '2Tim',
  '1 Peter': '1Pet',
  '2 Peter': '2Pet',
  '1 John': '1John',
  '2 John': '2John',
  '3 John': '3John',
};

function inferShortName(bookName: string): string {
  const mapped = BOOK_SHORT_NAMES[bookName];
  if (mapped) {
    return mapped;
  }

  const compact = bookName.replace(/[^A-Za-z0-9]/g, '');
  return compact.slice(0, 4) || bookName.slice(0, 4);
}

function inferTestament(bookName: string): 'old' | 'new' {
  return OLD_TESTAMENT_BOOKS.has(bookName) ? 'old' : 'new';
}

function normalizeVerseText(text: string): string {
  return text.replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').trim();
}

function parseBibleCsv(csvText: string): BibleBook[] {
  const parsed = Papa.parse<CsvBibleRow>(csvText, {
    header: true,
    skipEmptyLines: 'greedy',
  });

  const booksMap = new Map<string, Map<number, Map<number, string>>>();

  for (const row of parsed.data) {
    const bookName = row.book?.trim();
    const chapterNumber = Number(row.chapter);
    const verseNumber = Number(row.verse);
    const verseText = normalizeVerseText(row.text ?? '');

    if (!bookName || !Number.isFinite(chapterNumber) || !Number.isFinite(verseNumber) || !verseText) {
      continue;
    }

    if (!booksMap.has(bookName)) {
      booksMap.set(bookName, new Map());
    }

    const chapterMap = booksMap.get(bookName)!;
    if (!chapterMap.has(chapterNumber)) {
      chapterMap.set(chapterNumber, new Map());
    }

    chapterMap.get(chapterNumber)!.set(verseNumber, verseText);
  }

  return Array.from(booksMap.entries()).map(([bookName, chapterMap]) => ({
    name: bookName,
    shortName: inferShortName(bookName),
    testament: inferTestament(bookName),
    chapters: Array.from(chapterMap.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([chapterNumber, verseMap]) => ({
        chapter: chapterNumber,
        verses: Array.from(verseMap.entries())
          .sort((a, b) => a[0] - b[0])
          .map(([verseNumber, text]) => ({ number: verseNumber, text })),
      })),
  }));
}

export const bibleBooks: BibleBook[] = parseBibleCsv(bibleCsvRaw);

export const dailyVerses = [
  { reference: 'John 3:16', book: 'John', chapter: 3, verse: 16 },
  { reference: 'Psalms 23:1', book: 'Psalms', chapter: 23, verse: 1 },
  { reference: 'Proverbs 3:5-6', book: 'Proverbs', chapter: 3, verse: 5 },
  { reference: 'Romans 8:28', book: 'Romans', chapter: 8, verse: 28 },
  { reference: 'Philippians 4:13', book: 'Philippians', chapter: 4, verse: 13 },
  { reference: 'Genesis 1:1', book: 'Genesis', chapter: 1, verse: 1 },
];

export function getVerseOfTheDay() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return dailyVerses[dayOfYear % dailyVerses.length];
}

export function findBook(bookName: string): BibleBook | undefined {
  return bibleBooks.find(
    book => book.name.toLowerCase() === bookName.toLowerCase() || 
           book.shortName.toLowerCase() === bookName.toLowerCase()
  );
}

export function findChapter(bookName: string, chapterNum: number): BibleChapter | undefined {
  const book = findBook(bookName);
  return book?.chapters.find(ch => ch.chapter === chapterNum);
}

export function getVerseText(bookName: string, chapterNum: number, verseNum: number): string | undefined {
  const chapter = findChapter(bookName, chapterNum);
  return chapter?.verses.find(v => v.number === verseNum)?.text;
}
