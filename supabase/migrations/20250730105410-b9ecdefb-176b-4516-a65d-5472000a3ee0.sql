-- Fix missing UPDATE RLS policies
CREATE POLICY "Users can update their own boundaries" 
ON public.boundaries 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own red flags" 
ON public.red_flags 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own triggers" 
ON public.triggers 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Fix search_path vulnerability in existing functions
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'display_name');
  RETURN NEW;
END;
$$;

-- Add input validation function for text length
CREATE OR REPLACE FUNCTION public.validate_text_length(input_text TEXT, max_length INTEGER DEFAULT 500)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN LENGTH(TRIM(input_text)) <= max_length AND LENGTH(TRIM(input_text)) > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Add validation triggers for text inputs
CREATE OR REPLACE FUNCTION public.validate_user_inputs()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate boundaries
  IF TG_TABLE_NAME = 'boundaries' THEN
    IF NOT public.validate_text_length(NEW.boundary_text, 200) THEN
      RAISE EXCEPTION 'Boundary text must be between 1 and 200 characters';
    END IF;
  END IF;
  
  -- Validate red flags
  IF TG_TABLE_NAME = 'red_flags' THEN
    IF NOT public.validate_text_length(NEW.flag_text, 200) THEN
      RAISE EXCEPTION 'Red flag text must be between 1 and 200 characters';
    END IF;
  END IF;
  
  -- Validate triggers
  IF TG_TABLE_NAME = 'triggers' THEN
    IF NOT public.validate_text_length(NEW.trigger_text, 200) THEN
      RAISE EXCEPTION 'Trigger text must be between 1 and 200 characters';
    END IF;
  END IF;
  
  -- Validate daily entries notes
  IF TG_TABLE_NAME = 'daily_entries' THEN
    IF NEW.notes IS NOT NULL AND LENGTH(TRIM(NEW.notes)) > 1000 THEN
      RAISE EXCEPTION 'Notes must be 1000 characters or less';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Create validation triggers
CREATE TRIGGER validate_boundaries_trigger
  BEFORE INSERT OR UPDATE ON public.boundaries
  FOR EACH ROW EXECUTE FUNCTION public.validate_user_inputs();

CREATE TRIGGER validate_red_flags_trigger
  BEFORE INSERT OR UPDATE ON public.red_flags
  FOR EACH ROW EXECUTE FUNCTION public.validate_user_inputs();

CREATE TRIGGER validate_triggers_trigger
  BEFORE INSERT OR UPDATE ON public.triggers
  FOR EACH ROW EXECUTE FUNCTION public.validate_user_inputs();

CREATE TRIGGER validate_daily_entries_trigger
  BEFORE INSERT OR UPDATE ON public.daily_entries
  FOR EACH ROW EXECUTE FUNCTION public.validate_user_inputs();