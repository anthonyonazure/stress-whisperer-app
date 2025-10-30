import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar, Edit2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { sanitizeText } from '@/lib/security';

interface JournalEntry {
  id: string;
  entry_date: string;
  notes: string | null;
  mood: string | null;
  stress_level: number | null;
}

const JournalHistory = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadEntries();
    }
  }, [user]);

  const loadEntries = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('daily_entries')
        .select('id, entry_date, notes, mood, stress_level')
        .eq('user_id', user.id)
        .order('entry_date', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error loading journal entries:', error);
      toast({
        title: "Error",
        description: "Failed to load journal entries",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (entry: JournalEntry) => {
    setEditingId(entry.id);
    setEditNotes(entry.notes || '');
  };

  const handleSave = async (entryId: string) => {
    if (!user) return;

    setSaving(true);
    try {
      const sanitized = sanitizeText(editNotes);
      const { error } = await supabase
        .from('daily_entries')
        .update({ notes: sanitized })
        .eq('id', entryId)
        .eq('user_id', user.id);

      if (error) throw error;

      setEntries(entries.map(e => 
        e.id === entryId ? { ...e, notes: sanitized } : e
      ));
      setEditingId(null);
      
      toast({
        title: "Success",
        description: "Journal entry updated"
      });
    } catch (error) {
      console.error('Error saving journal entry:', error);
      toast({
        title: "Error",
        description: "Failed to save journal entry",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditNotes('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No journal entries yet. Start your first daily check-in!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Journal History</h2>
      
      {entries.map((entry) => (
        <Card key={entry.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {format(new Date(entry.entry_date), 'MMMM d, yyyy')}
              </div>
              {editingId !== entry.id && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(entry)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
            </CardTitle>
            {entry.mood && (
              <div className="text-sm text-muted-foreground">
                Mood: {entry.mood} • Stress: {entry.stress_level}/10
              </div>
            )}
          </CardHeader>
          <CardContent>
            {editingId === entry.id ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor={`notes-${entry.id}`}>Notes</Label>
                  <Textarea
                    id={`notes-${entry.id}`}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    rows={4}
                    maxLength={1000}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleSave(entry.id)}
                    disabled={saving}
                    size="sm"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    size="sm"
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-sm whitespace-pre-wrap">
                {entry.notes || <span className="text-muted-foreground italic">No notes</span>}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default JournalHistory;
