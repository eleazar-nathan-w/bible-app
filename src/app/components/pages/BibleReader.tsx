import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { bibleBooks, findBook, findChapter, translations } from '../../data/bibleData';
import { Button } from '../ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Play, 
  Pause,
  SkipBack,
  SkipForward,
  Settings2,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { VerseDisplay } from '../VerseDisplay';
import { 
  setLastRead, 
  getPreferences, 
  isBookmarked, 
  addBookmark, 
  removeBookmark,
  getBookmarks
} from '../../lib/storage';
import { cn } from '../ui/utils';
import { toast } from 'sonner';
import { Slider } from '../ui/slider';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';

export function BibleReader() {
  const { book: bookParam, chapter: chapterParam } = useParams();
  const navigate = useNavigate();
  
  const [currentBook, setCurrentBook] = useState(bookParam || 'Genesis');
  const [currentChapter, setCurrentChapter] = useState(Number(chapterParam) || 1);
  const [preferences, setPreferences] = useState(getPreferences());
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [bookmarkedHere, setBookmarkedHere] = useState(false);
  const [activeVerseNumber, setActiveVerseNumber] = useState<number | null>(null);
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const playbackTimerRef = useRef<number | null>(null);

  const book = findBook(currentBook);
  const chapter = book ? findChapter(currentBook, currentChapter) : null;
  const maxChapter = book?.chapters.length || 1;

  const chapterText = chapter
    ? chapter.verses.map(v => `Verse ${v.number}. ${v.text}`).join(' ')
    : '';

  const chapterWordCount = chapterText.trim().split(/\s+/).filter(Boolean).length;
  const totalChars = Math.max(chapterText.length, 1);

  const verseBoundaries = chapter
    ? chapter.verses.reduce<Array<{ number: number; start: number; end: number }>>((acc, verse) => {
        const previousEnd = acc.length > 0 ? acc[acc.length - 1].end : 0;
        const segment = `Verse ${verse.number}. ${verse.text} `;
        acc.push({
          number: verse.number,
          start: previousEnd,
          end: previousEnd + segment.length,
        });
        return acc;
      }, [])
    : [];

  const setActiveVerseFromCharIndex = (charIndex: number) => {
    const current = verseBoundaries.find(
      ({ start, end }) => charIndex >= start && charIndex < end,
    );

    if (current) {
      setActiveVerseNumber(current.number);
    }
  };

  const setActiveVerseFromPercent = (percent: number) => {
    const charIndex = Math.floor((Math.min(Math.max(percent, 0), 100) / 100) * totalChars);
    setActiveVerseFromCharIndex(charIndex);
  };

  const clearPlaybackTimer = () => {
    if (playbackTimerRef.current !== null) {
      window.clearInterval(playbackTimerRef.current);
      playbackTimerRef.current = null;
    }
  };

  const startPlaybackTimer = (startPercent = 0) => {
    clearPlaybackTimer();
    const remainingPercent = Math.max(0, 100 - startPercent);
    if (remainingPercent === 0) {
      return;
    }

    const wordsPerMinute = 150 * preferences.playbackSpeed;
    const estimatedDurationSeconds = Math.max((Math.max(chapterWordCount, 1) / wordsPerMinute) * 60, 5);
    const tickMs = 250;
    const steps = Math.max((estimatedDurationSeconds * 1000) / tickMs, 1);
    const increment = remainingPercent / steps;

    playbackTimerRef.current = window.setInterval(() => {
      setPlaybackPosition(prev => {
        const next = Math.min(prev + increment, 100);
        setActiveVerseFromPercent(next);
        return next;
      });
    }, tickMs);
  };

  const stopPlayback = (resetPosition = false) => {
    clearPlaybackTimer();
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
    }
    utteranceRef.current = null;
    setIsPlaying(false);
    setActiveVerseNumber(null);
    if (resetPosition) {
      setPlaybackPosition(0);
    }
  };

  useEffect(() => {
    if (bookParam) setCurrentBook(bookParam);
    if (chapterParam) setCurrentChapter(Number(chapterParam));
  }, [bookParam, chapterParam]);

  useEffect(() => {
    setLastRead(currentBook, currentChapter);
    navigate(`/bible/${currentBook}/${currentChapter}`, { replace: true });
    setBookmarkedHere(isBookmarked(currentBook, currentChapter));
  }, [currentBook, currentChapter, navigate]);

  useEffect(() => {
    speechSynthesisRef.current = typeof window !== 'undefined' ? window.speechSynthesis : null;

    return () => {
      stopPlayback();
    };
  }, []);

  useEffect(() => {
    // Stop any in-progress narration when navigating to a different chapter.
    stopPlayback(true);

    if (preferences.autoPlayAudio && chapter) {
      // Defer to next tick so UI state has fully updated for the new chapter.
      const timeout = window.setTimeout(() => {
        handlePlayPause();
      }, 50);

      return () => window.clearTimeout(timeout);
    }
  }, [currentBook, currentChapter]);

  const handlePreviousChapter = () => {
    if (currentChapter > 1) {
      setCurrentChapter(currentChapter - 1);
    } else if (book) {
      // Go to previous book
      const currentIndex = bibleBooks.findIndex(b => b.name === currentBook);
      if (currentIndex > 0) {
        const prevBook = bibleBooks[currentIndex - 1];
        setCurrentBook(prevBook.name);
        setCurrentChapter(prevBook.chapters.length);
      }
    }
  };

  const handleNextChapter = () => {
    if (currentChapter < maxChapter) {
      setCurrentChapter(currentChapter + 1);
    } else if (book) {
      // Go to next book
      const currentIndex = bibleBooks.findIndex(b => b.name === currentBook);
      if (currentIndex < bibleBooks.length - 1) {
        const nextBook = bibleBooks[currentIndex + 1];
        setCurrentBook(nextBook.name);
        setCurrentChapter(1);
      }
    }
  };

  const handlePlayPause = () => {
    const synth = speechSynthesisRef.current;

    if (!synth || typeof SpeechSynthesisUtterance === 'undefined') {
      toast.error('Audio is not supported in this browser');
      return;
    }

    // Prefer UI state for toggling because browser speech flags can lag right after speak().
    if (isPlaying) {
      if (synth.speaking) {
        synth.pause();
      } else if (utteranceRef.current) {
        // If playback hasn't started yet, stop queued utterance so the button still behaves like pause.
        synth.cancel();
        utteranceRef.current = null;
        setPlaybackPosition(0);
      }
      clearPlaybackTimer();
      setIsPlaying(false);
      setActiveVerseNumber(null);
      return;
    }

    if (utteranceRef.current && synth.paused) {
      synth.resume();
      startPlaybackTimer(playbackPosition);
      setIsPlaying(true);
      setActiveVerseFromPercent(playbackPosition);
      return;
    }

    if (!chapterText) {
      toast.error('No text available to read aloud');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(chapterText);
    utterance.rate = preferences.playbackSpeed;
    utterance.lang = 'en-US';

    utterance.onstart = () => {
      setActiveVerseNumber(chapter?.verses[0]?.number ?? null);
    };

    utterance.onboundary = (event) => {
      if (typeof event.charIndex === 'number') {
        const percent = Math.min((event.charIndex / totalChars) * 100, 100);
        setPlaybackPosition(percent);
        setActiveVerseFromCharIndex(event.charIndex);
      }
    };

    utterance.onend = () => {
      clearPlaybackTimer();
      utteranceRef.current = null;
      setPlaybackPosition(100);
      setIsPlaying(false);
      setActiveVerseNumber(null);
    };

    utterance.onerror = () => {
      clearPlaybackTimer();
      utteranceRef.current = null;
      setIsPlaying(false);
      setActiveVerseNumber(null);
      toast.error('Audio playback failed');
    };

    utteranceRef.current = utterance;
    setPlaybackPosition(0);
    startPlaybackTimer(0);
    synth.cancel();
    synth.speak(utterance);
    setIsPlaying(true);

    toast.success('Audio playback started', {
      description: `${currentBook} ${currentChapter}`,
    });
  };

  const handleBookmarkChapter = () => {
    if (bookmarkedHere) {
      const bookmarks = getBookmarks();
      const bookmark = bookmarks.find(
        b => b.book === currentBook && b.chapter === currentChapter && !b.verse
      );
      if (bookmark) {
        removeBookmark(bookmark.id);
        setBookmarkedHere(false);
        toast.success('Bookmark removed');
      }
    } else {
      addBookmark({ book: currentBook, chapter: currentChapter });
      setBookmarkedHere(true);
      toast.success('Chapter bookmarked');
    }
  };

  const fontSizeClasses = {
    small: 'text-base',
    medium: 'text-lg',
    large: 'text-xl',
    xlarge: 'text-2xl',
  };

  if (!book || !chapter) {
    return (
      <div className="md:ml-64">
        <div className="container max-w-4xl mx-auto p-4 md:p-6">
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Book not found</h2>
            <p className="text-muted-foreground mb-4">
              The requested book or chapter could not be found.
            </p>
            <Button onClick={() => navigate('/bible/Genesis/1')}>
              Go to Genesis 1
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="md:ml-64">
      <div className="container max-w-4xl mx-auto p-4 md:p-6 space-y-4">
        {/* Header Controls */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-4 space-y-4">
          {/* Book and Chapter Selection */}
          <div className="flex items-center gap-2">
            <Select value={currentBook} onValueChange={setCurrentBook}>
              <SelectTrigger className="w-[180px]" aria-label="Select book">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                  Old Testament
                </div>
                {bibleBooks.filter(b => b.testament === 'old').map(b => (
                  <SelectItem key={b.name} value={b.name}>
                    {b.name}
                  </SelectItem>
                ))}
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                  New Testament
                </div>
                {bibleBooks.filter(b => b.testament === 'new').map(b => (
                  <SelectItem key={b.name} value={b.name}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={currentChapter.toString()} 
              onValueChange={(val) => setCurrentChapter(Number(val))}
            >
              <SelectTrigger className="w-[120px]" aria-label="Select chapter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {book.chapters.map(ch => (
                  <SelectItem key={ch.chapter} value={ch.chapter.toString()}>
                    Chapter {ch.chapter}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex-1" />

            <Button
              variant="ghost"
              size="icon"
              onClick={handleBookmarkChapter}
              aria-label={bookmarkedHere ? "Remove bookmark" : "Bookmark chapter"}
            >
              {bookmarkedHere ? (
                <BookmarkCheck className="w-5 h-5 text-primary" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Reader settings">
                  <Settings2 className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Reader Settings</SheetTitle>
                  <SheetDescription>
                    Customize your reading experience
                  </SheetDescription>
                </SheetHeader>
                <div className="space-y-6 mt-6">
                  <div className="space-y-2">
                    <Label>Font Size</Label>
                    <Select 
                      value={preferences.fontSize} 
                      onValueChange={(val) => {
                        const newPrefs = { ...preferences, fontSize: val as any };
                        setPreferences(newPrefs);
                        import('../../lib/storage').then(m => m.updatePreferences(newPrefs));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                        <SelectItem value="xlarge">Extra Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Translation</Label>
                    <Select 
                      value={preferences.translation} 
                      onValueChange={(val) => {
                        const newPrefs = { ...preferences, translation: val };
                        setPreferences(newPrefs);
                        import('../../lib/storage').then(m => m.updatePreferences(newPrefs));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {translations.map(t => (
                          <SelectItem key={t.id} value={t.id}>
                            {t.name} ({t.abbreviation})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Font Family</Label>
                    <Select 
                      value={preferences.fontFamily} 
                      onValueChange={(val) => {
                        const newPrefs = { ...preferences, fontFamily: val as any };
                        setPreferences(newPrefs);
                        import('../../lib/storage').then(m => m.updatePreferences(newPrefs));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="serif">Serif</SelectItem>
                        <SelectItem value="sans-serif">Sans Serif</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-play">Auto-play audio</Label>
                    <Switch
                      id="auto-play"
                      checked={preferences.autoPlayAudio}
                      onCheckedChange={(val) => {
                        const newPrefs = { ...preferences, autoPlayAudio: val };
                        setPreferences(newPrefs);
                        import('../../lib/storage').then(m => m.updatePreferences(newPrefs));
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Playback Speed ({preferences.playbackSpeed.toFixed(1)}x)</Label>
                    <Slider
                      value={[preferences.playbackSpeed]}
                      min={0.5}
                      max={2}
                      step={0.1}
                      onValueChange={([val]) => {
                        const newPrefs = { ...preferences, playbackSpeed: val };
                        setPreferences(newPrefs);
                        import('../../lib/storage').then(m => m.updatePreferences(newPrefs));
                      }}
                    />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Translation Badge */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {translations.find(t => t.id === preferences.translation)?.abbreviation || 'KJV'}
            </div>
          </div>
        </div>

        {/* Chapter Title */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold">
            {currentBook} {currentChapter}
          </h1>
          <p className="text-muted-foreground">
            {book.testament === 'old' ? 'Old Testament' : 'New Testament'}
          </p>
        </div>

        {/* Verses */}
        <div 
          className={cn(
            "space-y-4 leading-relaxed",
            fontSizeClasses[preferences.fontSize],
            preferences.fontFamily === 'serif' ? 'font-serif' : 'font-sans'
          )}
        >
          {chapter.verses.map(verse => (
            <VerseDisplay
              key={verse.number}
              book={currentBook}
              chapter={currentChapter}
              verse={verse}
              isNarrationActive={isPlaying && activeVerseNumber === verse.number}
            />
          ))}
        </div>

        {/* Audio Player */}
        <div className="sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t pt-4 space-y-2">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePreviousChapter}
              disabled={currentChapter === 1 && bibleBooks[0].name === currentBook}
              aria-label="Previous chapter"
            >
              <SkipBack className="w-5 h-5" />
            </Button>

            <Button
              size="icon"
              onClick={handlePlayPause}
              className="h-12 w-12"
              aria-label={isPlaying ? "Pause audio" : "Play audio"}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextChapter}
              disabled={
                currentChapter === maxChapter && 
                bibleBooks[bibleBooks.length - 1].name === currentBook
              }
              aria-label="Next chapter"
            >
              <SkipForward className="w-5 h-5" />
            </Button>

            <div className="flex-1 flex items-center gap-2">
              <Slider
                value={[playbackPosition]}
                max={100}
                step={1}
                onValueCommit={([val]) => {
                  if (isPlaying) {
                    toast.info('Seeking is not supported for narration playback yet');
                    return;
                  }
                  setPlaybackPosition(val);
                }}
                className="flex-1"
                aria-label="Audio playback position"
              />
              <span className="text-xs text-muted-foreground min-w-[3ch]">
                {Math.floor(playbackPosition)}%
              </span>
            </div>
          </div>

          {isPlaying && (
            <div className="text-sm text-center text-muted-foreground">
              Playing: {currentBook} {currentChapter}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={handlePreviousChapter}
            disabled={currentChapter === 1 && bibleBooks[0].name === currentBook}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <Button
            variant="outline"
            onClick={handleNextChapter}
            disabled={
              currentChapter === maxChapter && 
              bibleBooks[bibleBooks.length - 1].name === currentBook
            }
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
