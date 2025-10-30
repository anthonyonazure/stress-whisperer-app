
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, TrendingUp, MessageSquare, Plus, Settings as SettingsIcon, LogOut, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useUserData } from '@/hooks/useUserData';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import DailyCheckIn from '@/components/DailyCheckIn';
import StressChart from '@/components/StressChart';
import DailyQuote from '@/components/DailyQuote';
import UserOnboarding from '@/components/UserOnboarding';
import UserSettings from '@/components/UserSettings';
import JournalHistory from '@/components/JournalHistory';

const Index = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { redFlags, triggers, loading: dataLoading } = useUserData();
  const { toast } = useToast();
  const [currentView, setCurrentView] = useState('dashboard');
  const [todaysEntry, setTodaysEntry] = useState(null);
  const [hasOnboarded, setHasOnboarded] = useState(false);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Check if user has completed onboarding (has red flags or triggers)
  useEffect(() => {
    if (user && !dataLoading) {
      setHasOnboarded(redFlags.length > 0 || triggers.length > 0);
    }
  }, [user, redFlags, triggers, dataLoading]);

  const getTodayKey = () => {
    return new Date().toISOString().split('T')[0];
  };

  useEffect(() => {
    if (hasOnboarded && user) {
      loadTodaysEntry();
    }
  }, [hasOnboarded, user, currentView]);

  const loadTodaysEntry = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.from('daily_entries')
        .select('*')
        .eq('user_id', user.id)
        .eq('entry_date', getTodayKey())
        .maybeSingle();

      if (error) {
        console.error('Error loading today\'s entry:', error);
        return;
      }

      if (data) {
        setTodaysEntry({
          stressLevel: data.stress_level,
          mood: data.mood,
          triggers: data.selected_triggers,
          redFlags: data.selected_red_flags,
          notes: data.notes
        });
      } else {
        setTodaysEntry(null);
      }
    } catch (error) {
      console.error('Error loading today\'s entry:', error);
    }
  };

  const handleOnboardingComplete = () => {
    setHasOnboarded(true);
    setCurrentView('dashboard');
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive"
      });
    } else {
      navigate('/auth');
    }
  };
  
  const handleCheckinComplete = () => {
    setCurrentView('dashboard');
    // Reload today's entry from database
    loadTodaysEntry();
  };

  const renderView = () => {
    switch (currentView) {
      case 'checkin':
        return <DailyCheckIn onComplete={handleCheckinComplete} />;
      case 'trends':
        return <StressChart />;
      case 'settings':
        return <UserSettings onBack={() => setCurrentView('dashboard')} />;
      case 'journal':
        return <JournalHistory />;
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

              <Button
                onClick={() => setCurrentView('journal')}
                variant="outline"
                className="h-16 flex items-center justify-center gap-3 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 hover:from-blue-100 hover:to-cyan-100"
              >
                <BookOpen className="h-6 w-6 text-blue-600" />
                <span className="text-blue-700 font-medium">Journal History</span>
              </Button>
            </div>

            <Button
              onClick={() => setCurrentView('settings')}
              variant="outline"
              className="w-full h-16 flex items-center justify-center gap-3 bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200 hover:from-orange-100 hover:to-yellow-100"
            >
              <SettingsIcon className="h-6 w-6 text-orange-600" />
              <span className="text-orange-700 font-medium">Edit Red Flags & Triggers</span>
            </Button>
          </div>
        );
    }
  };

  // Show loading state
  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if user is not authenticated (will redirect)
  if (!user) {
    return null;
  }

  if (!hasOnboarded) {
    return <UserOnboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-md mx-auto p-4 space-y-6">
        <header className="text-center py-6 relative">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            MindTracker
          </h1>
          <p className="text-gray-600 mt-2">Your daily wellness companion</p>
          <Button
            onClick={handleSignOut}
            variant="ghost"
            size="sm"
            className="absolute top-6 right-0 text-gray-500 hover:text-gray-700"
          >
            <LogOut className="h-4 w-4" />
          </Button>
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
