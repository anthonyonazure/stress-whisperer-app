
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MoodSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const MoodSelector = ({ value, onChange }: MoodSelectorProps) => {
  return (
    <div>
      <Label htmlFor="mood">Current Mood</Label>
      <Select value={value} onValueChange={onChange}>
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
  );
};

export default MoodSelector;
