import { useNavigate } from 'react-router';
import { readingPlans } from '../../data/readingPlans';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { getPlanProgress, getAllPlanProgress } from '../../lib/storage';
import { useState, useEffect } from 'react';
import { BookOpen, Calendar, CheckCircle2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

export function Plans() {
  const navigate = useNavigate();
  const [planProgress, setPlanProgress] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    const allProgress = getAllPlanProgress();
    const progressMap = new Map<string, number>();
    
    allProgress.forEach(progress => {
      const plan = readingPlans.find(p => p.id === progress.planId);
      if (plan) {
        const percentage = (progress.completedDays.length / plan.days.length) * 100;
        progressMap.set(progress.planId, percentage);
      }
    });
    
    setPlanProgress(progressMap);
  }, []);

  const activePlans = readingPlans.filter(plan => planProgress.has(plan.id));
  const availablePlans = readingPlans.filter(plan => !planProgress.has(plan.id));

  const categories = Array.from(new Set(readingPlans.map(p => p.category)));

  return (
    <div className="md:ml-64">
      <div className="container max-w-6xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold">Reading Plans</h1>
          <p className="text-muted-foreground">
            Deepen your faith with guided Bible reading plans
          </p>
        </div>

        {/* Active Plans */}
        {activePlans.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-primary" />
              In Progress
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {activePlans.map(plan => {
                const progress = planProgress.get(plan.id) || 0;
                
                return (
                  <Card 
                    key={plan.id} 
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => navigate(`/plans/${plan.id}`)}
                  >
                    <div className="aspect-video w-full overflow-hidden bg-muted rounded-t-lg">
                      <img 
                        src={plan.imageUrl} 
                        alt={plan.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <CardTitle>{plan.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {plan.duration} • {plan.category}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary">
                          {Math.round(progress)}%
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Progress value={progress} className="h-2" />
                      <p className="text-sm text-muted-foreground">
                        {Math.round(progress)}% complete
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Browse Plans */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            Browse Plans
          </h2>

          <Tabs defaultValue="all">
            <TabsList className="flex-wrap h-auto">
              <TabsTrigger value="all">All Plans</TabsTrigger>
              {categories.map(category => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availablePlans.map(plan => (
                  <PlanCard key={plan.id} plan={plan} navigate={navigate} />
                ))}
              </div>
            </TabsContent>

            {categories.map(category => (
              <TabsContent key={category} value={category} className="mt-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availablePlans
                    .filter(plan => plan.category === category)
                    .map(plan => (
                      <PlanCard key={plan.id} plan={plan} navigate={navigate} />
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function PlanCard({ plan, navigate }: { plan: any; navigate: any }) {
  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
      onClick={() => navigate(`/plans/${plan.id}`)}
    >
      <div className="aspect-video w-full overflow-hidden bg-muted">
        <img 
          src={plan.imageUrl} 
          alt={plan.title}
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-2">{plan.title}</CardTitle>
        <CardDescription className="flex items-center gap-2 mt-1">
          <Calendar className="w-4 h-4" />
          {plan.duration}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {plan.description}
        </p>
        <Badge variant="outline" className="mt-3">
          {plan.category}
        </Badge>
      </CardContent>
    </Card>
  );
}
