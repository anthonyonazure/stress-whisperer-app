
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { X, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OnboardingProps {
  onComplete: () => void;
}

interface ListManagerProps {
  title: string;
  list: string[];
  setList: React.Dispatch<React.SetStateAction<string[]>>;
  placeholder: string;
}

const ListManager = ({ title, list, setList, placeholder }: ListManagerProps) => {
    const [inputValue, setInputValue] = useState('');

    const handleAdd = () => {
        if (inputValue.trim() && !list.includes(inputValue.trim()) && list.length < 40) {
            setList([...list, inputValue.trim()]);
            setInputValue('');
        }
    };

    const handleRemove = (itemToRemove: string) => {
        setList(list.filter(item => item !== itemToRemove));
    };

    return (
        <div>
            <h3 className="font-semibold text-lg mb-2">{title}</h3>
            <div className="flex gap-2 mb-2">
                <Input 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={placeholder}
                    onKeyDown={(e) => {if (e.key === 'Enter') { e.preventDefault(); handleAdd(); }}}
                />
                <Button onClick={handleAdd} size="icon" variant="outline"><Plus className="h-4 w-4" /></Button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
                {list.map((item, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                        <span className="text-sm">{item}</span>
                        <Button onClick={() => handleRemove(item)} size="icon" variant="ghost" className="h-6 w-6">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
            {list.length >= 40 && <p className="text-sm text-red-500 mt-2">You have reached the limit of 40 items.</p>}
        </div>
    );
};

const Onboarding = ({ onComplete }: OnboardingProps) => {
    const [redFlags, setRedFlags] = useState<string[]>([]);
    const [triggers, setTriggers] = useState<string[]>([]);
    const { toast } = useToast();

    const handleSave = () => {
        localStorage.setItem('user-red-flags', JSON.stringify(redFlags));
        localStorage.setItem('user-triggers', JSON.stringify(triggers));
        localStorage.setItem('hasOnboarded', 'true');

        toast({
            title: "Setup Complete!",
            description: "Your personalized lists have been saved.",
        });

        onComplete();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Welcome to MindTracker!</CardTitle>
                    <CardDescription className="text-center pt-2">
                        To get started, let's create lists of your personal stress triggers and red flags. You can add up to 40 of each.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <ListManager 
                        title="Your Red Flags"
                        list={redFlags}
                        setList={setRedFlags}
                        placeholder="e.g., Feeling overwhelmed, avoiding calls"
                    />
                    <ListManager 
                        title="Your Stress Triggers"
                        list={triggers}
                        setList={setTriggers}
                        placeholder="e.g., Work deadlines, social events"
                    />

                    <Button onClick={handleSave} className="w-full bg-blue-600 hover:bg-blue-700">
                        Save and Start Tracking
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default Onboarding;
