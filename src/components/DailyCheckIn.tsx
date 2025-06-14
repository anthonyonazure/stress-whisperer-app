
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import SelfCarePrompts from './SelfCarePrompts';
import { Checkbox } from '@/components/ui/checkbox';

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

  const getStressColor = (level: number) => {
    if (level <= 3) return 'text-green-600';
    if (level <= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-blue-800">Daily Check-in</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-sm font-medium text-gray-700">
              Stress Level: <span className={`font-bold ${getStressColor(stressLevel[0])}`}>{stressLevel[0]}/10</span>
            </Label>
            <div className="mt-2">
              <Slider
                value={stressLevel}
                onValueChange={setStressLevel}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Very Low</span>
              <span>Moderate</span>
              <span>Very High</span>
            </div>
          </div>

          <div>
            <Label htmlFor="mood">Current Mood</Label>
            <Select value={mood} onValueChange={setMood}>
              <SelectTrigger>
                <SelectValue placeholder="How are you feeling?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="great">Great</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="okay">Okay</SelectItem>
                <SelectItem value="stressed">Stressed</SelectItem>
                <SelectItem value="anxious">Anxious</SelectItem>
                <SelectItem value="sad">Sad</SelectItem>
                <SelectItem value="angry">Angry</SelectItem>
                <SelectItem value="overwhelmed">Overwhelmed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {userTriggers.length > 0 && (
            <div>
              <Label>Triggers Today</Label>
              <div className="grid grid-cols-1 gap-3 mt-2 p-3 border rounded-md max-h-40 overflow-y-auto">
                {userTriggers.map((trigger, index) => (
                  <div key={`trigger-${index}`} className="flex items-start space-x-2">
                    <Checkbox
                      id={`trigger-${index}`}
                      checked={selectedTriggers.includes(trigger)}
                      onCheckedChange={() => handleTriggerToggle(trigger)}
                      className="mt-0.5"
                    />
                    <label
                      htmlFor={`trigger-${index}`}
                      className="text-sm font-medium leading-relaxed cursor-pointer flex-1"
                    >
                      {trigger}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {userRedFlags.length > 0 && (
            <div>
              <Label>Red Flags Today</Label>
              <div className="grid grid-cols-1 gap-3 mt-2 p-3 border rounded-md max-h-40 overflow-y-auto">
                {userRedFlags.map((flag, index) => (
                  <div key={`flag-${index}`} className="flex items-start space-x-2">
                    <Checkbox
                      id={`flag-${index}`}
                      checked={selectedRedFlags.includes(flag)}
                      onCheckedChange={() => handleRedFlagToggle(flag)}
                      className="mt-0.5"
                    />
                    <label
                      htmlFor={`flag-${index}`}
                      className="text-sm font-medium leading-relaxed cursor-pointer flex-1"
                    >
                      {flag}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="comments">Daily Notes</Label>
            <Textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="How was your day? Any additional thoughts..."
              rows={3}
            />
          </div>

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
