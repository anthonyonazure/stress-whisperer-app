
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface TriggersListProps {
  userTriggers: string[];
  selectedTriggers: string[];
  onTriggerToggle: (trigger: string) => void;
}

const TriggersList = ({ userTriggers, selectedTriggers, onTriggerToggle }: TriggersListProps) => {
  if (userTriggers.length === 0) return null;

  // Handle cases where triggers might be stored as a single comma-separated string
  const allTriggers = userTriggers.flatMap(t => t.split(',').map(s => s.trim()).filter(Boolean));

  return (
    <div>
      <Label>Triggers Today</Label>
      <div className="grid grid-cols-1 gap-3 mt-2 p-3 border rounded-md max-h-40 overflow-y-auto">
        {allTriggers.map((trigger, index) => (
          <div key={`trigger-${index}`} className="flex items-start space-x-2">
            <Checkbox
              id={`trigger-${index}`}
              checked={selectedTriggers.includes(trigger)}
              onCheckedChange={() => onTriggerToggle(trigger)}
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
  );
};

export default TriggersList;
