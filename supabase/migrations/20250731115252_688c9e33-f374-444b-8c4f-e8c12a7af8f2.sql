-- Add unmet_needs column to daily_entries table
ALTER TABLE public.daily_entries 
ADD COLUMN unmet_needs TEXT[] DEFAULT '{}';

-- Update the validate_user_inputs function to include validation for unmet_needs
CREATE OR REPLACE FUNCTION public.validate_user_inputs()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
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
  
  -- Validate daily entries notes and unmet needs
  IF TG_TABLE_NAME = 'daily_entries' THEN
    IF NEW.notes IS NOT NULL AND LENGTH(TRIM(NEW.notes)) > 1000 THEN
      RAISE EXCEPTION 'Notes must be 1000 characters or less';
    END IF;
    
    -- Validate unmet_needs array length (max 50 items to prevent abuse)
    IF NEW.unmet_needs IS NOT NULL AND array_length(NEW.unmet_needs, 1) > 50 THEN
      RAISE EXCEPTION 'Cannot select more than 50 unmet needs';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$;