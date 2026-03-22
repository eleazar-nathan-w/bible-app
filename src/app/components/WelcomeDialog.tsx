import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { BookOpen, Heart, ListChecks, Search, Settings } from 'lucide-react';
import { getUserProfile, updateUserProfile } from '../lib/storage';

export function WelcomeDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('bible_app_welcome_seen');
    const profile = getUserProfile();
    setName(profile.name);

    if (!hasSeenWelcome || !profile.name.trim()) {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      return;
    }

    updateUserProfile({ name: trimmedName });
    localStorage.setItem('bible_app_welcome_seen', 'true');
    setOpen(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && !getUserProfile().name.trim()) {
      return;
    }

    setOpen(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            Welcome to Bible App
          </DialogTitle>
          <DialogDescription className="text-base">
            Your personal Bible study companion
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold mb-2">What should we call you?</h4>
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your name"
                autoComplete="given-name"
                className="mb-3"
              />
              <h4 className="font-semibold mb-1">Read & Study</h4>
              <p className="text-sm text-muted-foreground">
                Access multiple Bible translations with customizable reading settings, 
                including font size, theme, and audio playback.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold mb-1">Highlight & Annotate</h4>
              <p className="text-sm text-muted-foreground">
                Highlight verses in multiple colors, add personal notes, and bookmark 
                your favorite passages. All saved locally for offline access.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <ListChecks className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold mb-1">Reading Plans</h4>
              <p className="text-sm text-muted-foreground">
                Follow curated reading plans to deepen your faith. Track your progress 
                and access daily devotionals.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Search className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold mb-1">Search Scripture</h4>
              <p className="text-sm text-muted-foreground">
                Find verses and passages quickly with full-text search. Filter by 
                book or testament.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Settings className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold mb-1">Offline Ready</h4>
              <p className="text-sm text-muted-foreground">
                All your data is saved locally. Continue reading, studying, and 
                accessing your content even without an internet connection.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleClose} className="w-full" disabled={!name.trim()}>
            Get Started
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
