
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface DailyNotesProps {
  value: string;
  onChange: (value: string) => void;
}

const DailyNotes = ({ value, onChange }: DailyNotesProps) => {
  const [charCount, setCharCount] = useState(value.length);
  const maxLength = 1000;

  useEffect(() => {
    setCharCount(value.length);
  }, [value]);

  const handleChange = (newValue: string) => {
    if (newValue.length <= maxLength) {
      onChange(newValue);
      setCharCount(newValue.length);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <Label htmlFor="comments">Daily Journal Entry</Label>
        <span className={`text-sm ${charCount > maxLength * 0.9 ? 'text-destructive' : 'text-muted-foreground'}`}>
          {charCount}/{maxLength}
        </span>
      </div>
      <Textarea
        id="comments"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="How was your day? Any additional thoughts..."
        rows={3}
        maxLength={maxLength}
      />
    </div>
  );
};

export default DailyNotes;
