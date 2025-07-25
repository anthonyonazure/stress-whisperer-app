import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface BoundariesListProps {
  userBoundaries: string[];
  selectedBoundaries: string[];
  onBoundaryToggle: (boundary: string) => void;
}

const BoundariesList = ({ userBoundaries, selectedBoundaries, onBoundaryToggle }: BoundariesListProps) => {
  if (userBoundaries.length === 0) return null;

  // Handle cases where boundaries might be stored as a single comma-separated string
  const allBoundaries = userBoundaries.flatMap(b => b.split(',').map(s => s.trim()).filter(Boolean));

  return (
    <div>
      <Label>Boundaries Today</Label>
      <div className="grid grid-cols-1 gap-3 mt-2 p-3 border rounded-md max-h-40 overflow-y-auto">
        {allBoundaries.map((boundary, index) => (
          <div key={`boundary-${index}`} className="flex items-start space-x-2">
            <Checkbox
              id={`boundary-${index}`}
              checked={selectedBoundaries.includes(boundary)}
              onCheckedChange={() => onBoundaryToggle(boundary)}
              className="mt-0.5"
            />
            <label
              htmlFor={`boundary-${index}`}
              className="text-sm font-medium leading-relaxed cursor-pointer flex-1"
            >
              {boundary}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoundariesList;