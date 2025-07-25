import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { useUserData } from '@/hooks/useUserData';

interface UserOnboardingProps {
  onComplete: () => void;
}

interface ListManagerProps {
  title: string;
  list: string[];
  addItem: (item: string) => void;
  removeItem: (item: string) => void;
  placeholder: string;
}

const ListManager = ({ title, list, addItem, removeItem, placeholder }: ListManagerProps) => {
  const [newItem, setNewItem] = useState('');

  const handleAdd = () => {
    if (newItem.trim() && !list.includes(newItem.trim()) && list.length < 40) {
      addItem(newItem.trim());
      setNewItem('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      
      <div className="flex gap-2">
        <Input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button 
          onClick={handleAdd} 
          size="sm" 
          disabled={!newItem.trim() || list.includes(newItem.trim()) || list.length >= 40}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {list.map((item, index) => (
          <Badge key={index} variant="secondary" className="text-sm">
            {item}
            <button
              onClick={() => removeItem(item)}
              className="ml-2 hover:text-red-500"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>

      <p className="text-sm text-gray-500">
        {list.length}/40 items ({40 - list.length} remaining)
      </p>
    </div>
  );
};

const UserOnboarding = ({ onComplete }: UserOnboardingProps) => {
  const { redFlags, triggers, boundaries, addRedFlag, removeRedFlag, addTrigger, removeTrigger, addBoundary, removeBoundary } = useUserData();

  const handleSave = () => {
    if (redFlags.length > 0 || triggers.length > 0 || boundaries.length > 0) {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        <header className="text-center py-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Welcome to MindTracker
          </h1>
          <p className="text-gray-600">
            Let's personalize your experience by setting up your red flags, stress triggers, and boundaries.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-center text-gray-800">
              Personalize Your Tracking
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <ListManager
              title="Your Red Flags"
              list={redFlags}
              addItem={addRedFlag}
              removeItem={removeRedFlag}
              placeholder="e.g., Skipping meals, Poor sleep"
            />

            <ListManager
              title="Your Stress Triggers"
              list={triggers}
              addItem={addTrigger}
              removeItem={removeTrigger}
              placeholder="e.g., Work deadlines, Traffic"
            />

            <ListManager
              title="Your Boundaries"
              list={boundaries}
              addItem={addBoundary}
              removeItem={removeBoundary}
              placeholder="e.g., No work calls after 6pm, Take lunch breaks"
            />

            <Button 
              onClick={handleSave}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={redFlags.length === 0 && triggers.length === 0 && boundaries.length === 0}
            >
              Save and Start Tracking
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserOnboarding;