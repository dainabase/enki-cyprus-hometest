-- RLS policies for developer_drafts
CREATE POLICY "Users can manage their own developer drafts"
ON public.developer_drafts
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all developer drafts"
ON public.developer_drafts
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);
