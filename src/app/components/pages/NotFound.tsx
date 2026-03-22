import { useNavigate } from 'react-router';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { BookOpen, Home } from 'lucide-react';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="md:ml-64">
      <div className="container max-w-4xl mx-auto p-4 md:p-6">
        <Card className="mt-12">
          <CardContent className="py-16 text-center">
            <BookOpen className="w-20 h-20 mx-auto mb-6 text-muted-foreground" />
            <h1 className="text-4xl font-bold mb-3">Page Not Found</h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
              Oops! The page you're looking for seems to have wandered off. 
              Let's get you back on track.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => navigate('/')} size="lg">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
              <Button onClick={() => navigate('/bible')} variant="outline" size="lg">
                <BookOpen className="w-4 h-4 mr-2" />
                Read Bible
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
