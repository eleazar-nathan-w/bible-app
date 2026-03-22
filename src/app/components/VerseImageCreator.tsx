import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Download, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface VerseImageCreatorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  verseText: string;
  reference: string;
}

const backgroundStyles = [
  { 
    id: 'gradient-warm', 
    name: 'Warm Gradient',
    className: 'bg-gradient-to-br from-orange-400 via-rose-400 to-pink-500'
  },
  { 
    id: 'gradient-cool', 
    name: 'Cool Gradient',
    className: 'bg-gradient-to-br from-blue-400 via-purple-400 to-indigo-500'
  },
  { 
    id: 'gradient-earth', 
    name: 'Earth Tones',
    className: 'bg-gradient-to-br from-amber-700 via-orange-600 to-red-700'
  },
  { 
    id: 'gradient-ocean', 
    name: 'Ocean',
    className: 'bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600'
  },
  { 
    id: 'gradient-forest', 
    name: 'Forest',
    className: 'bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600'
  },
  { 
    id: 'solid-dark', 
    name: 'Dark',
    className: 'bg-gray-900'
  },
];

export function VerseImageCreator({ open, onOpenChange, verseText, reference }: VerseImageCreatorProps) {
  const [selectedStyle, setSelectedStyle] = useState(backgroundStyles[0].id);

  const selectedBg = backgroundStyles.find(bg => bg.id === selectedStyle);

  const handleDownload = () => {
    toast.success('Verse image created', {
      description: 'In a full version, this would download the image',
    });
    // In a real implementation, this would use html2canvas or similar to capture the card
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Create Verse Image
          </DialogTitle>
          <DialogDescription>
            Create a beautiful image to share this verse
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Style Selector */}
          <div className="space-y-2">
            <Label>Background Style</Label>
            <Select value={selectedStyle} onValueChange={setSelectedStyle}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {backgroundStyles.map(style => (
                  <SelectItem key={style.id} value={style.id}>
                    {style.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Preview */}
          <Card 
            className={`
              aspect-square w-full p-8 flex flex-col items-center justify-center 
              text-center text-white overflow-hidden relative
              ${selectedBg?.className}
            `}
          >
            <div className="max-w-lg space-y-6">
              <p className="text-2xl md:text-3xl font-serif leading-relaxed">
                "{verseText}"
              </p>
              <p className="text-lg font-medium opacity-90">
                — {reference}
              </p>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={handleDownload} className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Download Image
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Note: In a full implementation, this would generate a downloadable image
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
