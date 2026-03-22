import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { Keyboard } from 'lucide-react';
import { Badge } from './ui/badge';

export function KeyboardShortcuts() {
  const shortcuts = [
    { key: ['←', '→'], description: 'Navigate between chapters' },
    { key: ['/'], description: 'Focus search' },
    { key: ['H'], description: 'Go to home' },
    { key: ['B'], description: 'Go to Bible reader' },
    { key: ['P'], description: 'Go to reading plans' },
    { key: ['Esc'], description: 'Close dialogs' },
    { key: ['Space'], description: 'Play/pause audio' },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Keyboard className="w-4 h-4 mr-2" />
          Shortcuts
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Quick access to common actions
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {shortcuts.map((shortcut, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <span className="text-sm">{shortcut.description}</span>
              <div className="flex gap-1">
                {shortcut.key.map((k, i) => (
                  <Badge key={i} variant="secondary" className="font-mono">
                    {k}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
