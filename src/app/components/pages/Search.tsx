import { useState } from 'react';
import { useNavigate } from 'react-router';
import { bibleBooks } from '../../data/bibleData';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Search as SearchIcon, BookOpen, Filter } from 'lucide-react';
import { Badge } from '../ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface SearchResult {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  testament: 'old' | 'new';
}

export function Search() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [testament, setTestament] = useState<'all' | 'old' | 'new'>('all');
  const [selectedBook, setSelectedBook] = useState<string>('all');

  const handleSearch = () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      const searchResults: SearchResult[] = [];
      const searchTerms = query.toLowerCase().split(' ').filter(t => t.length > 0);

      bibleBooks.forEach(book => {
        // Filter by testament
        if (testament !== 'all' && book.testament !== testament) return;
        
        // Filter by book
        if (selectedBook !== 'all' && book.name !== selectedBook) return;

        book.chapters.forEach(chapter => {
          chapter.verses.forEach(verse => {
            const verseText = verse.text.toLowerCase();
            
            // Check if all search terms are in the verse
            const matches = searchTerms.every(term => verseText.includes(term));
            
            if (matches) {
              searchResults.push({
                book: book.name,
                chapter: chapter.chapter,
                verse: verse.number,
                text: verse.text,
                testament: book.testament,
              });
            }
          });
        });
      });

      setResults(searchResults);
      setIsSearching(false);
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const terms = query.toLowerCase().split(' ').filter(t => t.length > 0);
    let highlighted = text;
    
    terms.forEach(term => {
      const regex = new RegExp(`(${term})`, 'gi');
      highlighted = highlighted.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-900/60">$1</mark>');
    });
    
    return highlighted;
  };

  return (
    <div className="md:ml-64">
      <div className="container max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold">Search Bible</h1>
          <p className="text-muted-foreground">
            Search through scripture to find verses and passages
          </p>
        </div>

        {/* Search Bar */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search for words, phrases, or topics..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-9"
                autoFocus
              />
            </div>
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Filter className="w-4 h-4" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Testament</label>
                <Select value={testament} onValueChange={(val: any) => setTestament(val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="old">Old Testament</SelectItem>
                    <SelectItem value="new">New Testament</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Book</label>
                <Select value={selectedBook} onValueChange={setSelectedBook}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Books</SelectItem>
                    {bibleBooks
                      .filter(b => testament === 'all' || b.testament === testament)
                      .map(book => (
                        <SelectItem key={book.name} value={book.name}>
                          {book.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {results.length > 0 && (
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {results.length} {results.length === 1 ? 'result' : 'results'} found
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setQuery('');
                  setResults([]);
                }}
              >
                Clear
              </Button>
            </div>
          )}

          {results.length === 0 && query && !isSearching && (
            <Card>
              <CardContent className="py-12 text-center">
                <SearchIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or filters
                </p>
              </CardContent>
            </Card>
          )}

          {results.length === 0 && !query && (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Start searching</h3>
                <p className="text-muted-foreground mb-4">
                  Enter keywords to search through the Bible
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => {
                      setQuery('love');
                      setTimeout(handleSearch, 100);
                    }}
                  >
                    love
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => {
                      setQuery('faith');
                      setTimeout(handleSearch, 100);
                    }}
                  >
                    faith
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => {
                      setQuery('Lord shepherd');
                      setTimeout(handleSearch, 100);
                    }}
                  >
                    shepherd
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => {
                      setQuery('beginning God created');
                      setTimeout(handleSearch, 100);
                    }}
                  >
                    creation
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-3">
            {results.map((result, idx) => (
              <Card
                key={`${result.book}-${result.chapter}-${result.verse}-${idx}`}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/bible/${result.book}/${result.chapter}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base">
                      {result.book} {result.chapter}:{result.verse}
                    </CardTitle>
                    <Badge variant="secondary">
                      {result.testament === 'old' ? 'OT' : 'NT'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p 
                    className="text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: highlightMatch(result.text, query) 
                    }}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
