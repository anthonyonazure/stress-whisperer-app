import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, MessageSquare, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DailyCheckIn from '@/components/DailyCheckIn';
import StressChart from '@/components/StressChart';
import DailyQuote from '@/components/DailyQuote';
import Onboarding from '@/components/Onboarding';

const Index = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [todaysEntry, setTodaysEntry] = useState(null);
  const [hasOnboarded, setHasOnboarded] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('hasOnboarded') === 'true';
    }
    return false;
  });

  const getTodayKey = () => {
    return new Date().toISOString().split('T')[0];
  };

  useEffect(() => {
    if (hasOnboarded) {
      const todayKey = getTodayKey();
      const stored = localStorage.getItem(`stress-entry-${todayKey}`);
      if (stored) {
        setTodaysEntry(JSON.parse(stored));
      } else {
        setTodaysEntry(null);
      }
    }
  }, [hasOnboarded, currentView]);

  const handleOnboardingComplete = () => {
    setHasOnboarded(true);
    setCurrentView('dashboard');
  };
  
  const handleCheckinComplete = () => {
    setCurrentView('dashboard');
    // We re-trigger the useEffect to reload the latest entry
    const todayKey = getTodayKey();
    const stored = localStorage.getItem(`stress-entry-${todayKey}`);
    if (stored) {
      setTodaysEntry(JSON.parse(stored));
    }
  }

  const renderView = () => {
    switch (currentView) {
      case 'checkin':
        return <DailyCheckIn onComplete={handleCheckinComplete} />;
      case 'trends':
        return <StressChart />;
      default:
        return (
          <div className="space-y-6">
            <DailyQuote />
            
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <Calendar className="h-5 w-5" />
                  Today's Check-in
                </CardTitle>
              </CardHeader>
              <CardContent>
                {todaysEntry ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-700">Stress Level:</span>
                      <span className={`font-semibold px-3 py-1 rounded-full text-sm ${
                        todaysEntry.stressLevel <= 3 ? 'bg-green-100 text-green-800' :
                        todaysEntry.stressLevel <= 6 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {todaysEntry.stressLevel}/10
                      </span>
                    </div>
                    <div className="text-sm text-blue-700">
                      <strong>Mood:</strong> {todaysEntry.mood}
                    </div>
                    {todaysEntry.triggers && todaysEntry.triggers.length > 0 && (
                      <div className="text-sm text-blue-700">
                        <strong>Triggers:</strong> {Array.isArray(todaysEntry.triggers) ? todaysEntry.triggers.join(', ') : todaysEntry.triggers}
                      </div>
                    )}
                    <Button 
                      onClick={() => setCurrentView('checkin')} 
                      variant="outline" 
                      size="sm"
                      className="border-blue-300 text-blue-700 hover:bg-blue-100"
                    >
                      Update Entry
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-blue-700 mb-4">Ready for today's check-in?</p>
                    <Button 
                      onClick={() => setCurrentView('checkin')}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Start Check-in
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={() => setCurrentView('trends')}
                variant="outline"
                className="h-16 flex items-center justify-center gap-3 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 hover:from-purple-100 hover:to-pink-100"
              >
                <TrendingUp className="h-6 w-6 text-purple-600" />
                <span className="text-purple-700 font-medium">View Trends</span>
              </Button>
              
              <Button
                onClick={() => setCurrentView('checkin')}
                variant="outline"
                className="h-16 flex items-center justify-center gap-3 bg-gradient-to-r from-green-50 to-teal-50 border-green-200 hover:from-green-100 hover:to-teal-100"
              >
                <MessageSquare className="h-6 w-6 text-green-600" />
                <span className="text-green-700 font-medium">Daily Check-in</span>
              </Button>
            </div>
          </div>
        );
    }
  };

  if (!hasOnboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-md mx-auto p-4 space-y-6">
        <header className="text-center py-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            MindTracker
          </h1>
          <p className="text-gray-600 mt-2">Your daily wellness companion</p>
        </header>

        {currentView !== 'dashboard' && (
          <Button
            onClick={() => setCurrentView('dashboard')}
            variant="ghost"
            className="mb-4 text-gray-600 hover:text-gray-800"
          >
            ← Back to Dashboard
          </Button>
        )}

        {renderView()}
      </div>
    </div>
  );
};

export default Index;
