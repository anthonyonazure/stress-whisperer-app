import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export const useUserData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [redFlags, setRedFlags] = useState<string[]>([]);
  const [triggers, setTriggers] = useState<string[]>([]);
  const [boundaries, setBoundaries] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Load user's red flags and triggers
  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      setRedFlags([]);
      setTriggers([]);
      setBoundaries([]);
      setLoading(false);
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Load red flags
      const { data: redFlagsData, error: redFlagsError } = await supabase
        .from('red_flags')
        .select('flag_text')
        .eq('user_id', user.id);

      if (redFlagsError) throw redFlagsError;

      // Load triggers
      const { data: triggersData, error: triggersError } = await supabase
        .from('triggers')
        .select('trigger_text')
        .eq('user_id', user.id);

      if (triggersError) throw triggersError;

      // Load boundaries
      const { data: boundariesData, error: boundariesError } = await supabase
        .from('boundaries')
        .select('boundary_text')
        .eq('user_id', user.id);

      if (boundariesError) throw boundariesError;

      setRedFlags(redFlagsData?.map(item => item.flag_text) || []);
      setTriggers(triggersData?.map(item => item.trigger_text) || []);
      setBoundaries(boundariesData?.map(item => item.boundary_text) || []);
    } catch (error) {
      console.error('Error loading user data:', error);
      toast({
        title: "Error",
        description: "Failed to load your data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addRedFlag = async (flagText: string) => {
    if (!user || redFlags.includes(flagText) || redFlags.length >= 40) return;

    try {
      const { error } = await supabase
        .from('red_flags')
        .insert({ user_id: user.id, flag_text: flagText });

      if (error) throw error;

      setRedFlags(prev => [...prev, flagText]);
      toast({
        title: "Added",
        description: "Red flag added successfully."
      });
    } catch (error) {
      console.error('Error adding red flag:', error);
      toast({
        title: "Error",
        description: "Failed to add red flag. Please try again.",
        variant: "destructive"
      });
    }
  };

  const removeRedFlag = async (flagText: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('red_flags')
        .delete()
        .eq('user_id', user.id)
        .eq('flag_text', flagText);

      if (error) throw error;

      setRedFlags(prev => prev.filter(flag => flag !== flagText));
      toast({
        title: "Removed",
        description: "Red flag removed successfully."
      });
    } catch (error) {
      console.error('Error removing red flag:', error);
      toast({
        title: "Error",
        description: "Failed to remove red flag. Please try again.",
        variant: "destructive"
      });
    }
  };

  const addTrigger = async (triggerText: string) => {
    if (!user || triggers.includes(triggerText) || triggers.length >= 40) return;

    try {
      const { error } = await supabase
        .from('triggers')
        .insert({ user_id: user.id, trigger_text: triggerText });

      if (error) throw error;

      setTriggers(prev => [...prev, triggerText]);
      toast({
        title: "Added",
        description: "Trigger added successfully."
      });
    } catch (error) {
      console.error('Error adding trigger:', error);
      toast({
        title: "Error",
        description: "Failed to add trigger. Please try again.",
        variant: "destructive"
      });
    }
  };

  const removeTrigger = async (triggerText: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('triggers')
        .delete()
        .eq('user_id', user.id)
        .eq('trigger_text', triggerText);

      if (error) throw error;

      setTriggers(prev => prev.filter(trigger => trigger !== triggerText));
      toast({
        title: "Removed",
        description: "Trigger removed successfully."
      });
    } catch (error) {
      console.error('Error removing trigger:', error);
      toast({
        title: "Error",
        description: "Failed to remove trigger. Please try again.",
        variant: "destructive"
      });
    }
  };

  const addBoundary = async (boundaryText: string) => {
    if (!user || boundaries.includes(boundaryText) || boundaries.length >= 40) return;

    try {
      const { error } = await supabase
        .from('boundaries')
        .insert({ user_id: user.id, boundary_text: boundaryText });

      if (error) throw error;

      setBoundaries(prev => [...prev, boundaryText]);
      toast({
        title: "Added",
        description: "Boundary added successfully."
      });
    } catch (error) {
      console.error('Error adding boundary:', error);
      toast({
        title: "Error",
        description: "Failed to add boundary. Please try again.",
        variant: "destructive"
      });
    }
  };

  const removeBoundary = async (boundaryText: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('boundaries')
        .delete()
        .eq('user_id', user.id)
        .eq('boundary_text', boundaryText);

      if (error) throw error;

      setBoundaries(prev => prev.filter(boundary => boundary !== boundaryText));
      toast({
        title: "Removed",
        description: "Boundary removed successfully."
      });
    } catch (error) {
      console.error('Error removing boundary:', error);
      toast({
        title: "Error",
        description: "Failed to remove boundary. Please try again.",
        variant: "destructive"
      });
    }
  };

  return {
    redFlags,
    triggers,
    boundaries,
    loading,
    addRedFlag,
    removeRedFlag,
    addTrigger,
    removeTrigger,
    addBoundary,
    removeBoundary,
    reloadData: loadUserData
  };
};