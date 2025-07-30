import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { X, Plus, ArrowLeft, HelpCircle } from 'lucide-react';
import { useUserData } from '@/hooks/useUserData';

interface UserSettingsProps {
  onBack: () => void;
}

interface ListManagerProps {
  title: string;
  list: string[];
  addItem: (item: string) => void;
  removeItem: (item: string) => void;
  placeholder: string;
  tooltipContent?: string;
}

const ListManager = ({ title, list, addItem, removeItem, placeholder, tooltipContent }: ListManagerProps) => {
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
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {tooltipContent && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-gray-500 hover:text-gray-700 cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <div className="text-sm" dangerouslySetInnerHTML={{ __html: tooltipContent }} />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
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

const UserSettings = ({ onBack }: UserSettingsProps) => {
  const { redFlags, triggers, boundaries, addRedFlag, removeRedFlag, addTrigger, removeTrigger, addBoundary, removeBoundary } = useUserData();

  return (
    <div className="space-y-6">
      <Button
        onClick={onBack}
        variant="ghost"
        className="mb-4 text-gray-600 hover:text-gray-800"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-center text-gray-800">
            Manage Your Tracking Items
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ListManager
            title="Your Red Flags"
            list={redFlags}
            addItem={addRedFlag}
            removeItem={removeRedFlag}
            placeholder="e.g., Skipping meals, Poor sleep"
            tooltipContent="<strong>Red Flags</strong> are warning signs that indicate your mental health may be declining. Red Flags come in two categories: thoughts and emotions.<br/><br/><strong>Thought Examples:</strong><br/>• 'I'm worthless' or negative self-talk<br/>• 'Nothing will get better'<br/>• Racing or obsessive thoughts<br/><br/><strong>Emotion Examples:</strong><br/>• Feeling overwhelmed or hopeless<br/>• Increased irritability or anger<br/>• Feeling numb or disconnected<br/>• Excessive worry or anxiety"
          />

          <ListManager
            title="Your Stress Triggers"
            list={triggers}
            addItem={addTrigger}
            removeItem={removeTrigger}
            placeholder="e.g., Work deadlines, Traffic"
            tooltipContent="<strong>Stress Triggers</strong> are specific situations, events, or thoughts that cause you to feel stressed or anxious. Triggers are anything that causes Red Flags to occur.<br/><br/><strong>Examples:</strong><br/>• Work deadlines or meetings<br/>• Traffic or commuting<br/>• Financial concerns<br/>• Conflict with others<br/>• Large crowds"
          />

          <ListManager
            title="Your Boundaries"
            list={boundaries}
            addItem={addBoundary}
            removeItem={removeBoundary}
            placeholder="e.g., No work calls after 6pm, Take lunch breaks"
            tooltipContent="<strong>Boundaries</strong> are healthy limits you set to protect your mental health and well-being.<br/><br/><strong>Examples:</strong><br/>• No work calls after 6pm<br/>• Taking regular lunch breaks<br/>• Saying no to extra commitments<br/>• Setting social media time limits<br/>• Prioritizing sleep schedule"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default UserSettings;