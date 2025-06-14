
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { X, Plus, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SettingsProps {
  onBack: () => void;
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

const Settings = ({ onBack }: SettingsProps) => {
    const [redFlags, setRedFlags] = useState<string[]>([]);
    const [triggers, setTriggers] = useState<string[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        const storedRedFlags = localStorage.getItem('user-red-flags');
        if (storedRedFlags) setRedFlags(JSON.parse(storedRedFlags));
        
        const storedTriggers = localStorage.getItem('user-triggers');
        if (storedTriggers) setTriggers(JSON.parse(storedTriggers));
    }, []);

    const handleSave = () => {
        localStorage.setItem('user-red-flags', JSON.stringify(redFlags));
        localStorage.setItem('user-triggers', JSON.stringify(triggers));

        toast({
            title: "Settings Saved!",
            description: "Your red flags and triggers have been updated.",
        });

        onBack();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Button onClick={onBack} variant="ghost" size="icon">
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-2xl font-bold text-blue-800">Settings</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-blue-800">Edit Your Lists</CardTitle>
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
                        Save Changes
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default Settings;
