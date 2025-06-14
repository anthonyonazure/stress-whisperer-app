
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface DailyNotesProps {
  value: string;
  onChange: (value: string) => void;
}

const DailyNotes = ({ value, onChange }: DailyNotesProps) => {
  return (
    <div>
      <Label htmlFor="comments">Daily Notes</Label>
      <Textarea
        id="comments"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="How was your day? Any additional thoughts..."
        rows={3}
      />
    </div>
  );
};

export default DailyNotes;
