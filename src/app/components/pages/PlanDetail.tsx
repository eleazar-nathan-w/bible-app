import { useParams, useNavigate } from 'react-router';
import { readingPlans } from '../../data/readingPlans';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { ArrowLeft, CheckCircle2, Circle, BookOpen } from 'lucide-react';
import { getPlanProgress, updatePlanProgress } from '../../lib/storage';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

export function PlanDetail() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const plan = readingPlans.find(p => p.id === planId);

  const [progress, setProgress] = useState(getPlanProgress(planId || ''));
  const [completedDays, setCompletedDays] = useState<Set<number>>(
    new Set(progress?.completedDays || [])
  );

  useEffect(() => {
    const prog = getPlanProgress(planId || '');
    setProgress(prog);
    setCompletedDays(new Set(prog?.completedDays || []));
  }, [planId]);

  if (!plan) {
    return (
      <div className="md:ml-64">
        <div className="container max-w-4xl mx-auto p-4 md:p-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Plan not found</h2>
            <p className="text-muted-foreground mb-4">
              The requested reading plan could not be found.
            </p>
            <Button onClick={() => navigate('/plans')}>
              Browse Plans
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const percentage = (completedDays.size / plan.days.length) * 100;
  const nextDay = plan.days.find(d => !completedDays.has(d.day));

  const handleToggleDay = (dayNumber: number) => {
    const isCompleted = completedDays.has(dayNumber);
    updatePlanProgress(plan.id, dayNumber, !isCompleted);
    
    const newCompleted = new Set(completedDays);
    if (isCompleted) {
      newCompleted.delete(dayNumber);
      toast.success('Day unmarked as complete');
    } else {
      newCompleted.add(dayNumber);
      toast.success('Day completed!');
    }
    setCompletedDays(newCompleted);
    setProgress(getPlanProgress(plan.id));
  };

  const handleReadDay = (day: typeof plan.days[0]) => {
    if (day.readings.length > 0) {
      const firstReading = day.readings[0];
      navigate(`/bible/${firstReading.book}/${firstReading.chapter}`);
    }
  };

  return (
    <div className="md:ml-64">
      <div className="container max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate('/plans')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Plans
        </Button>

        {/* Plan Header */}
        <div className="space-y-4">
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
            <img 
              src={plan.imageUrl} 
              alt={plan.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold">{plan.title}</h1>
                <p className="text-muted-foreground mt-2">
                  {plan.duration} • {plan.category}
                </p>
              </div>
              {percentage > 0 && (
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {Math.round(percentage)}%
                </Badge>
              )}
            </div>

            <p className="text-lg">{plan.description}</p>
          </div>

          {/* Progress */}
          {completedDays.size > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
                <CardDescription>
                  {completedDays.size} of {plan.days.length} days completed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={percentage} className="h-3" />
              </CardContent>
            </Card>
          )}

          {/* Next Reading */}
          {nextDay && (
            <Card className="border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  {completedDays.size === 0 ? 'Start Reading' : 'Continue Reading'}
                </CardTitle>
                <CardDescription>Day {nextDay.day}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {nextDay.devotional && (
                  <p className="text-sm text-muted-foreground italic">
                    {nextDay.devotional}
                  </p>
                )}
                <div className="space-y-2">
                  {nextDay.readings.map((reading, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-muted-foreground" />
                      <span>
                        {reading.book} {reading.chapter}
                        {reading.verses && `:${reading.verses}`}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleReadDay(nextDay)} className="flex-1">
                    Read Now
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleToggleDay(nextDay.day)}
                  >
                    Mark Complete
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Days */}
          <Card>
            <CardHeader>
              <CardTitle>All Days</CardTitle>
              <CardDescription>
                Track your progress through the plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {plan.days.map(day => {
                  const isCompleted = completedDays.has(day.day);
                  
                  return (
                    <AccordionItem key={day.day} value={`day-${day.day}`}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3 flex-1 text-left">
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                          ) : (
                            <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <div className="font-medium">Day {day.day}</div>
                            <div className="text-sm text-muted-foreground">
                              {day.readings.map(r => `${r.book} ${r.chapter}`).join(', ')}
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pl-8 pt-2 space-y-4">
                          {day.devotional && (
                            <p className="text-sm text-muted-foreground italic">
                              {day.devotional}
                            </p>
                          )}
                          <div className="space-y-2">
                            {day.readings.map((reading, idx) => (
                              <Button
                                key={idx}
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => navigate(`/bible/${reading.book}/${reading.chapter}`)}
                              >
                                <BookOpen className="w-4 h-4 mr-2" />
                                {reading.book} {reading.chapter}
                                {reading.verses && `:${reading.verses}`}
                              </Button>
                            ))}
                          </div>
                          <Button
                            variant={isCompleted ? "secondary" : "default"}
                            className="w-full"
                            onClick={() => handleToggleDay(day.day)}
                          >
                            {isCompleted ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Completed
                              </>
                            ) : (
                              'Mark as Complete'
                            )}
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
