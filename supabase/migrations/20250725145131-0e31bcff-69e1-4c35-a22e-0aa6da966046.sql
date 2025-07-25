-- Create boundaries table
CREATE TABLE public.boundaries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  boundary_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.boundaries ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own boundaries" 
ON public.boundaries 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own boundaries" 
ON public.boundaries 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own boundaries" 
ON public.boundaries 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add selected_boundaries column to daily_entries table
ALTER TABLE public.daily_entries 
ADD COLUMN selected_boundaries TEXT[] DEFAULT '{}'::text[];