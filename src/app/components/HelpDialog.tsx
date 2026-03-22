import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { HelpCircle, BookOpen, Highlighter, ListChecks, Search as SearchIcon, Settings, Share2 } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

export function HelpDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <HelpCircle className="w-4 h-4 mr-2" />
          Help & Tips
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            Help & Tips
          </DialogTitle>
          <DialogDescription>
            Learn how to get the most out of Bible App
          </DialogDescription>
        </DialogHeader>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="reading">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Reading the Bible
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 text-sm">
              <p>
                <strong>Navigation:</strong> Use the book and chapter dropdowns at the top to 
                jump to any passage. Use the previous/next buttons to move between chapters.
              </p>
              <p>
                <strong>Audio:</strong> Click the play button to listen to the chapter being 
                read aloud. Control playback speed in settings.
              </p>
              <p>
                <strong>Reading Settings:</strong> Customize font size, font family, and Bible 
                translation in the reader settings (gear icon).
              </p>
              <p>
                <strong>Themes:</strong> Switch between light and dark mode in your profile 
                settings for comfortable reading any time of day.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="study">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Highlighter className="w-4 h-4" />
                Study Tools
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 text-sm">
              <p>
                <strong>Highlighting:</strong> Hover over any verse and click the three dots 
                to access highlighting options. Choose from 5 colors to organize your highlights.
              </p>
              <p>
                <strong>Notes:</strong> Add personal notes to verses by clicking "Add Note" 
                in the verse menu. Your notes are private and saved locally.
              </p>
              <p>
                <strong>Bookmarks:</strong> Save your favorite verses or chapters for quick 
                access later. View all bookmarks in your profile.
              </p>
              <p>
                <strong>All Saved Offline:</strong> Your highlights, notes, and bookmarks are 
                automatically saved to your device and work offline.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="plans">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <ListChecks className="w-4 h-4" />
                Reading Plans
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 text-sm">
              <p>
                <strong>Browse Plans:</strong> Explore curated reading plans in various 
                categories including Complete Bible, New Testament, Wisdom, and Devotional.
              </p>
              <p>
                <strong>Start a Plan:</strong> Click on any plan to view details and daily 
                readings. Click "Read Now" on any day to jump to that passage.
              </p>
              <p>
                <strong>Track Progress:</strong> Mark days as complete to track your progress. 
                See your completion percentage and stay motivated.
              </p>
              <p>
                <strong>Devotionals:</strong> Many plans include daily devotional content to 
                help you reflect on what you've read.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="search">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <SearchIcon className="w-4 h-4" />
                Searching Scripture
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 text-sm">
              <p>
                <strong>Keyword Search:</strong> Enter any word or phrase to search across all 
                of scripture. Results show matching verses with context.
              </p>
              <p>
                <strong>Filters:</strong> Narrow your search by testament (Old/New) or specific 
                book for more targeted results.
              </p>
              <p>
                <strong>Multiple Terms:</strong> Search for multiple words and find verses 
                containing all your search terms.
              </p>
              <p>
                <strong>Quick Access:</strong> Click any search result to jump directly to 
                that verse in the reader.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="sharing">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Sharing Verses
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 text-sm">
              <p>
                <strong>Share Text:</strong> Use the share option in the verse menu to share 
                via your device's native share sheet or copy to clipboard.
              </p>
              <p>
                <strong>Create Images:</strong> Generate beautiful verse images to share on 
                social media (feature available in verse menu).
              </p>
              <p>
                <strong>Reference Format:</strong> Shared verses include the full text and 
                proper scripture reference.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="settings">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings & Privacy
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 text-sm">
              <p>
                <strong>Privacy First:</strong> All your data is stored locally on your device. 
                Nothing is sent to external servers.
              </p>
              <p>
                <strong>Offline Mode:</strong> The app works completely offline once loaded. 
                Your highlights, notes, and bookmarks are always accessible.
              </p>
              <p>
                <strong>Data Management:</strong> You can clear all your data at any time from 
                the profile settings page (Danger Zone).
              </p>
              <p>
                <strong>No Account Required:</strong> Use all features without creating an 
                account or signing in.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-6 p-4 bg-muted rounded-lg text-sm">
          <p className="font-medium mb-2">Need More Help?</p>
          <p className="text-muted-foreground">
            This is a demonstration Bible app showcasing modern web app capabilities. 
            For a production version with full Bible content, real audio, and cloud sync, 
            additional development would be needed.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
