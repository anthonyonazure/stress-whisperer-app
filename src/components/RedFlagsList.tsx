
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface RedFlagsListProps {
  userRedFlags: string[];
  selectedRedFlags: string[];
  onRedFlagToggle: (flag: string) => void;
}

const RedFlagsList = ({ userRedFlags, selectedRedFlags, onRedFlagToggle }: RedFlagsListProps) => {
  if (userRedFlags.length === 0) return null;

  // Handle cases where flags might be stored as a single comma-separated string
  const allFlags = userRedFlags.flatMap(f => f.split(',').map(s => s.trim()).filter(Boolean));

  return (
    <div>
      <Label>Red Flags Today</Label>
      <div className="grid grid-cols-1 gap-3 mt-2 p-3 border rounded-md max-h-40 overflow-y-auto">
        {allFlags.map((flag, index) => (
          <div key={`flag-${index}`} className="flex items-start space-x-2">
            <Checkbox
              id={`flag-${index}`}
              checked={selectedRedFlags.includes(flag)}
              onCheckedChange={() => onRedFlagToggle(flag)}
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
  );
};

export default RedFlagsList;
