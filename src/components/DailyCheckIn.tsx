
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useUserData } from '@/hooks/useUserData';
import { supabase } from '@/integrations/supabase/client';
import SelfCarePrompts from './SelfCarePrompts';
import StressLevelSlider from './StressLevelSlider';
import MoodSelector from './MoodSelector';
import TriggersList from './TriggersList';
import RedFlagsList from './RedFlagsList';
import DailyNotes from './DailyNotes';

interface DailyCheckInProps {
  onComplete: () => void;
}

const DailyCheckIn = ({ onComplete }: DailyCheckInProps) => {
  const { user } = useAuth();
  const { redFlags, triggers } = useUserData();
  const [stressLevel, setStressLevel] = useState([5]);
  const [mood, setMood] = useState('');
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [selectedRedFlags, setSelectedRedFlags] = useState<string[]>([]);
  const [comments, setComments] = useState('');
  const [showPrompts, setShowPrompts] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getTodayKey = () => {
    return new Date().toISOString().split('T')[0];
  };

  useEffect(() => {
    if (user) {
      loadTodaysEntry();
    }
  }, [user]);

  const loadTodaysEntry = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('daily_entries')
        .select('*')
        .eq('user_id', user.id)
        .eq('entry_date', getTodayKey())
        .maybeSingle();

      if (error) {
        console.error('Error loading today\'s entry:', error);
        return;
      }

      if (data) {
        setStressLevel([data.stress_level || 5]);
        setMood(data.mood || '');
        setSelectedTriggers(data.selected_triggers || []);
        setSelectedRedFlags(data.selected_red_flags || []);
        setComments(data.notes || '');
      }
    } catch (error) {
      console.error('Error loading today\'s entry:', error);
    }
  };

  useEffect(() => {
    if (stressLevel[0] >= 7 || selectedRedFlags.length > 0) {
      setShowPrompts(true);
    } else {
      setShowPrompts(false);
    }
  }, [stressLevel, selectedRedFlags]);

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const entryData = {
        user_id: user.id,
        entry_date: getTodayKey(),
        stress_level: stressLevel[0],
        mood,
        selected_triggers: selectedTriggers,
        selected_red_flags: selectedRedFlags,
        notes: comments,
      };

      const { error } = await supabase
        .from('daily_entries')
        .upsert(entryData, {
          onConflict: 'user_id,entry_date'
        });

      if (error) throw error;

      toast({
        title: "Entry saved!",
        description: "Your daily check-in has been recorded.",
      });

      onComplete();
    } catch (error) {
      console.error('Error saving entry:', error);
      toast({
        title: "Error",
        description: "Failed to save your check-in. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleTriggerToggle = (trigger: string) => {
    setSelectedTriggers(prev => 
      prev.includes(trigger) 
        ? prev.filter(t => t !== trigger)
        : [...prev, trigger]
    );
  };

  const handleRedFlagToggle = (flag: string) => {
    setSelectedRedFlags(prev => 
      prev.includes(flag) 
        ? prev.filter(f => f !== flag)
        : [...prev, flag]
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-blue-800">Daily Check-in</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <StressLevelSlider value={stressLevel} onChange={setStressLevel} />
          
          <MoodSelector value={mood} onChange={setMood} />

          <TriggersList 
            userTriggers={triggers}
            selectedTriggers={selectedTriggers}
            onTriggerToggle={handleTriggerToggle}
          />

          <RedFlagsList 
            userRedFlags={redFlags}
            selectedRedFlags={selectedRedFlags}
            onRedFlagToggle={handleRedFlagToggle}
          />

          <DailyNotes value={comments} onChange={setComments} />

          {showPrompts && (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertDescription className="text-orange-800">
                Based on your stress level or red flags, we recommend some self-care techniques.
              </AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={handleSave} 
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={!mood || loading}
          >
            {loading ? 'Saving...' : 'Save Check-in'}
          </Button>
        </CardContent>
      </Card>

      {showPrompts && <SelfCarePrompts stressLevel={stressLevel[0]} />}
    </div>
  );
};

export default DailyCheckIn;
