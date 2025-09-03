-- Enable realtime for notifications
ALTER TABLE public.commissions REPLICA IDENTITY FULL;
ALTER TABLE public.checklists REPLICA IDENTITY FULL;
ALTER TABLE public.profiles REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.commissions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.checklists;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;

-- Create notification preferences table for GDPR compliance
CREATE TABLE public.notification_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email_notifications BOOLEAN DEFAULT true,
  marketing_emails BOOLEAN DEFAULT false,
  analytics_tracking BOOLEAN DEFAULT false,
  functional_cookies BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Create policy for users to manage their own preferences
CREATE POLICY "Users can manage their own notification preferences" 
ON public.notification_preferences 
FOR ALL 
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_notification_preferences_updated_at
BEFORE UPDATE ON public.notification_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default preferences for existing users
INSERT INTO public.notification_preferences (user_id, email_notifications, marketing_emails, analytics_tracking, functional_cookies)
SELECT id, true, false, false, true
FROM public.profiles
WHERE id NOT IN (SELECT user_id FROM public.notification_preferences);

-- Create function to send notifications on database events
CREATE OR REPLACE FUNCTION public.trigger_notification_on_commission()
RETURNS TRIGGER AS $$
BEGIN
  -- Call the edge function to send notification
  PERFORM net.http_post(
    url := (SELECT value FROM storage.objects WHERE name = 'SITE_URL' LIMIT 1) || '/functions/v1/db-trigger',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := json_build_object(
      'table', 'commissions',
      'record', row_to_json(NEW),
      'old_record', row_to_json(OLD),
      'event_type', TG_OP
    )::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to send notifications on checklist updates
CREATE OR REPLACE FUNCTION public.trigger_notification_on_checklist()
RETURNS TRIGGER AS $$
BEGIN
  -- Only trigger on updates, not inserts
  IF TG_OP = 'UPDATE' THEN
    PERFORM net.http_post(
      url := (SELECT value FROM storage.objects WHERE name = 'SITE_URL' LIMIT 1) || '/functions/v1/db-trigger',
      headers := '{"Content-Type": "application/json"}'::jsonb,
      body := json_build_object(
        'table', 'checklists',
        'record', row_to_json(NEW),
        'old_record', row_to_json(OLD),
        'event_type', TG_OP
      )::text
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to send welcome notifications
CREATE OR REPLACE FUNCTION public.trigger_notification_on_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- Only trigger on inserts (new users)
  IF TG_OP = 'INSERT' THEN
    PERFORM net.http_post(
      url := (SELECT value FROM storage.objects WHERE name = 'SITE_URL' LIMIT 1) || '/functions/v1/db-trigger',
      headers := '{"Content-Type": "application/json"}'::jsonb,
      body := json_build_object(
        'table', 'profiles',
        'record', row_to_json(NEW),
        'event_type', TG_OP
      )::text
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
CREATE TRIGGER commission_notification_trigger
  AFTER INSERT ON public.commissions
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_notification_on_commission();

CREATE TRIGGER checklist_notification_trigger
  AFTER UPDATE ON public.checklists
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_notification_on_checklist();

CREATE TRIGGER profile_notification_trigger
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_notification_on_profile();