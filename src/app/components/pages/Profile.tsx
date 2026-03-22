import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { 
  User, 
  Heart, 
  Bookmark, 
  FileText, 
  Settings, 
  Moon, 
  Sun,
  Languages,
  Volume2,
  Download,
  Trash2,
  BookOpen
} from 'lucide-react';
import { 
  getHighlights, 
  getBookmarks, 
  getNotes, 
  getPreferences, 
  updatePreferences,
  removeHighlight,
  removeBookmark,
  removeNote
} from '../../lib/storage';
import { translations } from '../../data/bibleData';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { HelpDialog } from '../HelpDialog';

export function Profile() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [preferences, setPreferences] = useState(getPreferences());
  const [highlights, setHighlights] = useState(getHighlights());
  const [bookmarks, setBookmarks] = useState(getBookmarks());
  const [notes, setNotes] = useState(getNotes());

  useEffect(() => {
    setHighlights(getHighlights());
    setBookmarks(getBookmarks());
    setNotes(getNotes());
  }, []);

  const handleUpdatePreference = (key: keyof typeof preferences, value: any) => {
    const updated = { ...preferences, [key]: value };
    setPreferences(updated);
    updatePreferences(updated);
    toast.success('Settings updated');
  };

  const handleRemoveHighlight = (id: string) => {
    removeHighlight(id);
    setHighlights(getHighlights());
    toast.success('Highlight removed');
  };

  const handleRemoveBookmark = (id: string) => {
    removeBookmark(id);
    setBookmarks(getBookmarks());
    toast.success('Bookmark removed');
  };

  const handleRemoveNote = (id: string) => {
    removeNote(id);
    setNotes(getNotes());
    toast.success('Note deleted');
  };

  const handleClearAllData = () => {
    localStorage.clear();
    toast.success('All data cleared');
    window.location.reload();
  };

  return (
    <div className="md:ml-64">
      <div className="container max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
            <User className="w-8 h-8" />
            Profile & Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your preferences and view your saved content
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <Heart className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{highlights.length}</p>
              <p className="text-sm text-muted-foreground">Highlights</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <Bookmark className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{bookmarks.length}</p>
              <p className="text-sm text-muted-foreground">Bookmarks</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <FileText className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{notes.length}</p>
              <p className="text-sm text-muted-foreground">Notes</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Settings and Content */}
        <Tabs defaultValue="settings" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="highlights">
              <Heart className="w-4 h-4 mr-2" />
              Highlights
            </TabsTrigger>
            <TabsTrigger value="bookmarks">
              <Bookmark className="w-4 h-4 mr-2" />
              Bookmarks
            </TabsTrigger>
            <TabsTrigger value="notes">
              <FileText className="w-4 h-4 mr-2" />
              Notes
            </TabsTrigger>
          </TabsList>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  General Settings
                </CardTitle>
                <CardDescription>
                  Customize your reading experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Theme */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                    Theme
                  </Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Translation */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Bible Translation
                  </Label>
                  <Select 
                    value={preferences.translation} 
                    onValueChange={(val) => handleUpdatePreference('translation', val)}
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
                  <p className="text-xs text-muted-foreground">
                    {translations.find(t => t.id === preferences.translation)?.language}
                  </p>
                </div>

                <Separator />

                {/* Font Size */}
                <div className="space-y-2">
                  <Label>Reading Font Size</Label>
                  <Select 
                    value={preferences.fontSize} 
                    onValueChange={(val) => handleUpdatePreference('fontSize', val)}
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

                {/* Font Family */}
                <div className="space-y-2">
                  <Label>Font Style</Label>
                  <Select 
                    value={preferences.fontFamily} 
                    onValueChange={(val) => handleUpdatePreference('fontFamily', val)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="serif">Serif (Traditional)</SelectItem>
                      <SelectItem value="sans-serif">Sans Serif (Modern)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Audio Settings */}
                <div className="space-y-4">
                  <Label className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4" />
                    Audio Settings
                  </Label>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-play">Auto-play audio</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically start audio when opening a chapter
                      </p>
                    </div>
                    <Switch
                      id="auto-play"
                      checked={preferences.autoPlayAudio}
                      onCheckedChange={(val) => handleUpdatePreference('autoPlayAudio', val)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Playback Speed</Label>
                    <Select 
                      value={preferences.playbackSpeed.toString()} 
                      onValueChange={(val) => handleUpdatePreference('playbackSpeed', parseFloat(val))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0.5">0.5x</SelectItem>
                        <SelectItem value="0.75">0.75x</SelectItem>
                        <SelectItem value="1.0">1.0x (Normal)</SelectItem>
                        <SelectItem value="1.25">1.25x</SelectItem>
                        <SelectItem value="1.5">1.5x</SelectItem>
                        <SelectItem value="2.0">2.0x</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                {/* Offline Access */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Offline Access
                  </Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Your highlights, notes, and bookmarks are automatically saved to your device for offline access.
                  </p>
                  <Badge variant="secondary">
                    Offline mode enabled
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>
                  Irreversible actions - proceed with caution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear All Data
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete all your highlights, notes, bookmarks, 
                        and settings. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleClearAllData}>
                        Delete Everything
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Highlights Tab */}
          <TabsContent value="highlights" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Highlights</CardTitle>
                <CardDescription>
                  {highlights.length} highlighted {highlights.length === 1 ? 'verse' : 'verses'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {highlights.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Heart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No highlights yet</p>
                    <p className="text-sm">Highlight verses while reading to save them here</p>
                  </div>
                ) : (
                  highlights.map(highlight => (
                    <div 
                      key={highlight.id}
                      className="flex items-start justify-between gap-3 p-3 rounded-lg border hover:bg-accent cursor-pointer"
                      onClick={() => navigate(`/bible/${highlight.book}/${highlight.chapter}`)}
                    >
                      <div className="flex-1">
                        <div className="font-medium mb-1">
                          {highlight.book} {highlight.chapter}:{highlight.verse}
                        </div>
                        <div className={`inline-block px-2 py-0.5 rounded ${highlight.color}`}>
                          Highlighted
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveHighlight(highlight.id);
                        }}
                        aria-label="Remove highlight"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookmarks Tab */}
          <TabsContent value="bookmarks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Bookmarks</CardTitle>
                <CardDescription>
                  {bookmarks.length} saved {bookmarks.length === 1 ? 'location' : 'locations'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {bookmarks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bookmark className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No bookmarks yet</p>
                    <p className="text-sm">Bookmark chapters and verses to find them easily</p>
                  </div>
                ) : (
                  bookmarks.map(bookmark => (
                    <div 
                      key={bookmark.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent cursor-pointer"
                      onClick={() => navigate(`/bible/${bookmark.book}/${bookmark.chapter}`)}
                    >
                      <div className="flex items-center gap-3">
                        <Bookmark className="w-4 h-4 text-primary" />
                        <div>
                          <div className="font-medium">
                            {bookmark.book} {bookmark.chapter}
                            {bookmark.verse && `:${bookmark.verse}`}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(bookmark.timestamp).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveBookmark(bookmark.id);
                        }}
                        aria-label="Remove bookmark"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Notes</CardTitle>
                <CardDescription>
                  {notes.length} saved {notes.length === 1 ? 'note' : 'notes'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {notes.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No notes yet</p>
                    <p className="text-sm">Add notes to verses to capture your insights</p>
                  </div>
                ) : (
                  notes.map(note => (
                    <div 
                      key={note.id}
                      className="p-4 rounded-lg border hover:bg-accent cursor-pointer"
                      onClick={() => navigate(`/bible/${note.book}/${note.chapter}`)}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="font-medium">
                          {note.book} {note.chapter}:{note.verse}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveNote(note.id);
                          }}
                          aria-label="Delete note"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 whitespace-pre-wrap">
                        {note.content}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(note.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Help Section */}
        <div className="flex justify-center pt-6">
          <HelpDialog />
        </div>
      </div>
    </div>
  );
}