import { useState, useRef, useEffect } from 'react';
import { BibleVerse } from '../data/bibleData';
import { 
  getVerseHighlight, 
  addHighlight, 
  removeHighlight,
  getVerseNotes,
  addNote,
  updateNote,
  removeNote,
  addBookmark,
  removeBookmark,
  isBookmarked,
  getBookmarks
} from '../lib/storage';
import { cn } from './ui/utils';
import { 
  Highlighter, 
  MessageSquare, 
  Bookmark,
  Share2,
  MoreVertical,
  BookmarkCheck,
  Pencil,
  Trash2,
  Image as ImageIcon
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { Badge } from './ui/badge';
import { VerseImageCreator } from './VerseImageCreator';

interface VerseDisplayProps {
  book: string;
  chapter: number;
  verse: BibleVerse;
  isNarrationActive?: boolean;
}

const HIGHLIGHT_COLORS = [
  { name: 'Yellow', value: 'bg-yellow-200 dark:bg-yellow-900/40' },
  { name: 'Green', value: 'bg-green-200 dark:bg-green-900/40' },
  { name: 'Blue', value: 'bg-blue-200 dark:bg-blue-900/40' },
  { name: 'Purple', value: 'bg-purple-200 dark:bg-purple-900/40' },
  { name: 'Pink', value: 'bg-pink-200 dark:bg-pink-900/40' },
];

export function VerseDisplay({ book, chapter, verse, isNarrationActive = false }: VerseDisplayProps) {
  const [highlight, setHighlight] = useState(getVerseHighlight(book, chapter, verse.number));
  const [notes, setNotes] = useState(getVerseNotes(book, chapter, verse.number));
  const [bookmarked, setBookmarked] = useState(isBookmarked(book, chapter, verse.number));
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const verseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHighlight(getVerseHighlight(book, chapter, verse.number));
    setNotes(getVerseNotes(book, chapter, verse.number));
    setBookmarked(isBookmarked(book, chapter, verse.number));
  }, [book, chapter, verse.number]);

  const handleHighlight = (color: string) => {
    if (highlight) {
      removeHighlight(highlight.id);
      if (highlight.color !== color) {
        const newHighlight = addHighlight({ book, chapter, verse: verse.number, color });
        setHighlight(newHighlight);
        toast.success('Highlight color changed');
      } else {
        setHighlight(undefined);
        toast.success('Highlight removed');
      }
    } else {
      const newHighlight = addHighlight({ book, chapter, verse: verse.number, color });
      setHighlight(newHighlight);
      toast.success('Verse highlighted');
    }
    setShowColorPicker(false);
  };

  const handleAddNote = () => {
    setNoteContent('');
    setEditingNoteId(null);
    setShowNoteDialog(true);
  };

  const handleEditNote = (noteId: string, content: string) => {
    setNoteContent(content);
    setEditingNoteId(noteId);
    setShowNoteDialog(true);
  };

  const handleSaveNote = () => {
    if (!noteContent.trim()) return;

    if (editingNoteId) {
      updateNote(editingNoteId, noteContent);
      toast.success('Note updated');
    } else {
      addNote({ book, chapter, verse: verse.number, content: noteContent });
      toast.success('Note added');
    }

    setNotes(getVerseNotes(book, chapter, verse.number));
    setShowNoteDialog(false);
    setNoteContent('');
    setEditingNoteId(null);
  };

  const handleDeleteNote = (noteId: string) => {
    removeNote(noteId);
    setNotes(getVerseNotes(book, chapter, verse.number));
    toast.success('Note deleted');
  };

  const handleBookmark = () => {
    if (bookmarked) {
      const bookmarks = getBookmarks();
      const bookmark = bookmarks.find(
        b => b.book === book && b.chapter === chapter && b.verse === verse.number
      );
      if (bookmark) {
        removeBookmark(bookmark.id);
        setBookmarked(false);
        toast.success('Bookmark removed');
      }
    } else {
      addBookmark({ book, chapter, verse: verse.number });
      setBookmarked(true);
      toast.success('Verse bookmarked');
    }
  };

  const handleShare = async () => {
    const verseRef = `${book} ${chapter}:${verse.number}`;
    const text = `"${verse.text}" - ${verseRef}`;
    
    if (navigator.share) {
      try {
        await navigator.share({ text });
        toast.success('Shared successfully');
      } catch (err) {
        // User cancelled share
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard');
    }
  };

  return (
    <div className="group relative" ref={verseRef}>
      <div className="flex gap-3">
        <span className="text-muted-foreground font-medium min-w-[2ch] select-none">
          {verse.number}
        </span>
        <div className="flex-1">
          <span 
            className={cn(
              "inline leading-relaxed transition-colors",
              isNarrationActive && "bg-blue-600 text-white px-1 box-decoration-clone",
              highlight && highlight.color
            )}
          >
            {verse.text}
          </span>
          
          {/* Verse Actions */}
          <div className="inline-block ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0"
                  aria-label="Verse actions"
                >
                  <MoreVertical className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onSelect={() => setShowColorPicker(!showColorPicker)}>
                  <Highlighter className="w-4 h-4 mr-2" />
                  {highlight ? 'Change Highlight' : 'Highlight'}
                </DropdownMenuItem>
                {showColorPicker && (
                  <div className="px-2 py-2 flex gap-1">
                    {HIGHLIGHT_COLORS.map(color => (
                      <button
                        key={color.value}
                        className={cn(
                          "w-6 h-6 rounded-full border-2",
                          color.value,
                          highlight?.color === color.value 
                            ? "border-foreground ring-2 ring-foreground ring-offset-2" 
                            : "border-border"
                        )}
                        onClick={() => handleHighlight(color.value)}
                        aria-label={`Highlight with ${color.name}`}
                      />
                    ))}
                  </div>
                )}
                <DropdownMenuItem onSelect={handleAddNote}>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Add Note
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleBookmark}>
                  {bookmarked ? (
                    <>
                      <BookmarkCheck className="w-4 h-4 mr-2" />
                      Remove Bookmark
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4 mr-2" />
                      Bookmark
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => VerseImageCreator(book, chapter, verse.number)}>
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Create Image
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Display Notes */}
          {notes.length > 0 && (
            <div className="mt-2 space-y-2">
              {notes.map(note => (
                <div 
                  key={note.id} 
                  className="bg-muted p-3 rounded-lg text-sm border-l-4 border-primary"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <Badge variant="secondary" className="mb-2">
                        <MessageSquare className="w-3 h-3 mr-1" />
                        Note
                      </Badge>
                      <p className="whitespace-pre-wrap">{note.content}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(note.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleEditNote(note.id, note.content)}
                        aria-label="Edit note"
                      >
                        <Pencil className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-destructive"
                        onClick={() => handleDeleteNote(note.id)}
                        aria-label="Delete note"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Note Dialog */}
      <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingNoteId ? 'Edit Note' : 'Add Note'}
            </DialogTitle>
            <DialogDescription>
              {book} {chapter}:{verse.number}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Write your note here..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              rows={6}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNoteDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNote} disabled={!noteContent.trim()}>
              {editingNoteId ? 'Update' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}