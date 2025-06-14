
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
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
  const [stressLevel, setStressLevel] = useState([5]);
  const [mood, setMood] = useState('');
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [selectedRedFlags, setSelectedRedFlags] = useState<string[]>([]);
  const [userTriggers, setUserTriggers] = useState<string[]>([]);
  const [userRedFlags, setUserRedFlags] = useState<string[]>([]);
  const [comments, setComments] = useState('');
  const [showPrompts, setShowPrompts] = useState(false);
  const { toast } = useToast();

  const getTodayKey = () => {
    return new Date().toISOString().split('T')[0];
  };

  useEffect(() => {
    const storedUserTriggers = localStorage.getItem('user-triggers');
    if (storedUserTriggers) setUserTriggers(JSON.parse(storedUserTriggers));
    
    const storedUserRedFlags = localStorage.getItem('user-red-flags');
    if (storedUserRedFlags) setUserRedFlags(JSON.parse(storedUserRedFlags));

    const todayKey = getTodayKey();
    const stored = localStorage.getItem(`stress-entry-${todayKey}`);
    if (stored) {
      const entry = JSON.parse(stored);
      setStressLevel([entry.stressLevel]);
      setMood(entry.mood);
      setSelectedTriggers(Array.isArray(entry.triggers) ? entry.triggers : (entry.triggers ? [entry.triggers] : []));
      setSelectedRedFlags(Array.isArray(entry.redFlags) ? entry.redFlags : (entry.redFlags ? [entry.redFlags] : []));
      setComments(entry.comments || '');
    }
  }, []);

  useEffect(() => {
    if (stressLevel[0] >= 7 || selectedRedFlags.length > 0) {
      setShowPrompts(true);
    } else {
      setShowPrompts(false);
    }
  }, [stressLevel, selectedRedFlags]);

  const handleSave = () => {
    const entry = {
      date: getTodayKey(),
      stressLevel: stressLevel[0],
      mood,
      triggers: selectedTriggers,
      redFlags: selectedRedFlags,
      comments,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem(`stress-entry-${getTodayKey()}`, JSON.stringify(entry));
    
    // Also save to a list for trending
    const allEntries = JSON.parse(localStorage.getItem('all-stress-entries') || '[]');
    const existingIndex = allEntries.findIndex((e: any) => e.date === entry.date);
    
    if (existingIndex >= 0) {
      allEntries[existingIndex] = entry;
    } else {
      allEntries.push(entry);
    }
    
    localStorage.setItem('all-stress-entries', JSON.stringify(allEntries));

    toast({
      title: "Entry saved!",
      description: "Your daily check-in has been recorded.",
    });

    onComplete();
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
            userTriggers={userTriggers}
            selectedTriggers={selectedTriggers}
            onTriggerToggle={handleTriggerToggle}
          />

          <RedFlagsList 
            userRedFlags={userRedFlags}
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
            disabled={!mood}
          >
            Save Check-in
          </Button>
        </CardContent>
      </Card>

      {showPrompts && <SelfCarePrompts stressLevel={stressLevel[0]} />}
    </div>
  );
};

export default DailyCheckIn;
