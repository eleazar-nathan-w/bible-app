import { useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { BookOpen, Heart, Bookmark, FileText, PlayCircle } from 'lucide-react';
import { getVerseOfTheDay, getVerseText, findBook } from '../../data/bibleData';
import { getLastRead, getHighlights, getBookmarks, getNotes, getUserProfile } from '../../lib/storage';
import { useEffect, useState } from 'react';
import { readingPlans } from '../../data/readingPlans';

export function Home() {
  const navigate = useNavigate();
  const [verseOfDay, setVerseOfDay] = useState(getVerseOfTheDay());
  const [verseText, setVerseText] = useState('');
  const [lastRead, setLastRead] = useState(getLastRead());
  const [userName, setUserName] = useState(getUserProfile().name);
  const [stats, setStats] = useState({
    highlights: 0,
    bookmarks: 0,
    notes: 0,
  });

  useEffect(() => {
    const verse = getVerseOfTheDay();
    setVerseOfDay(verse);
    const text = getVerseText(verse.book, verse.chapter, verse.verse);
    setVerseText(text || '');
    
    setStats({
      highlights: getHighlights().length,
      bookmarks: getBookmarks().length,
      notes: getNotes().length,
    });

    const handleProfileUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<{ name?: string }>;
      setUserName(customEvent.detail?.name || '');
    };

    window.addEventListener('bible-profile-updated', handleProfileUpdated);

    return () => {
      window.removeEventListener('bible-profile-updated', handleProfileUpdated);
    };
  }, []);

  return (
    <div className="md:ml-64">
      <div className="container max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold">
            {userName.trim() ? `Welcome back, ${userName.trim()}` : 'Welcome'}
          </h1>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Verse of the Day */}
        <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              Verse of the Day
            </CardTitle>
            <CardDescription>{verseOfDay.reference}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed mb-4">"{verseText}"</p>
            <Button 
              onClick={() => navigate(`/bible/${verseOfDay.book}/${verseOfDay.chapter}`)}
              variant="outline"
            >
              Read Chapter
            </Button>
          </CardContent>
        </Card>

        {/* Continue Reading */}
        {lastRead && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Continue Reading
              </CardTitle>
              <CardDescription>Pick up where you left off</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{lastRead.book} {lastRead.chapter}</p>
                  <p className="text-sm text-muted-foreground">
                    {findBook(lastRead.book)?.testament === 'old' ? 'Old Testament' : 'New Testament'}
                  </p>
                </div>
                <Button onClick={() => navigate(`/bible/${lastRead.book}/${lastRead.chapter}`)}>
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:bg-accent transition-colors" onClick={() => navigate('/profile')}>
            <CardContent className="pt-6 text-center">
              <Bookmark className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{stats.bookmarks}</p>
              <p className="text-xs text-muted-foreground">Bookmarks</p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:bg-accent transition-colors" onClick={() => navigate('/profile')}>
            <CardContent className="pt-6 text-center">
              <Heart className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{stats.highlights}</p>
              <p className="text-xs text-muted-foreground">Highlights</p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:bg-accent transition-colors" onClick={() => navigate('/profile')}>
            <CardContent className="pt-6 text-center">
              <FileText className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{stats.notes}</p>
              <p className="text-xs text-muted-foreground">Notes</p>
            </CardContent>
          </Card>
        </div>

        {/* Featured Reading Plans */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Reading Plans</h2>
            <Button variant="ghost" onClick={() => navigate('/plans')}>
              View All
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {readingPlans.slice(0, 2).map((plan) => (
              <Card key={plan.id} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate(`/plans/${plan.id}`)}>
                <div className="aspect-video w-full overflow-hidden bg-muted">
                  <img 
                    src={plan.imageUrl} 
                    alt={plan.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{plan.title}</CardTitle>
                  <CardDescription>{plan.duration} • {plan.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">{plan.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            className="h-auto py-6 flex-col gap-2"
            onClick={() => navigate('/bible')}
          >
            <BookOpen className="w-8 h-8" />
            <span>Read Bible</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto py-6 flex-col gap-2"
            onClick={() => navigate('/bible/Psalms/23')}
          >
            <PlayCircle className="w-8 h-8" />
            <span>Listen to Audio</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
