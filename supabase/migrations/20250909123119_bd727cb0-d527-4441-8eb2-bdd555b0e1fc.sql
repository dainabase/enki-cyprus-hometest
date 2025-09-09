-- Add RLS policies for all draft tables

-- Building drafts - Admin/authenticated users only
CREATE POLICY "Users can manage their own building drafts"
ON public.building_drafts
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all building drafts"
ON public.building_drafts
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Contact drafts - Allow anonymous with session_id or authenticated users
CREATE POLICY "Anyone can manage contact drafts by session"
ON public.contact_drafts
FOR ALL
USING (
  (user_id IS NULL AND session_id IS NOT NULL) OR 
  (auth.uid() = user_id)
)
WITH CHECK (
  (user_id IS NULL AND session_id IS NOT NULL) OR 
  (auth.uid() = user_id)
);

-- Registration drafts - Anonymous users by session
CREATE POLICY "Anyone can manage registration drafts by session"
ON public.registration_drafts
FOR ALL
USING (session_id IS NOT NULL)
WITH CHECK (session_id IS NOT NULL);

-- Lexaia drafts - Anonymous with session or authenticated users
CREATE POLICY "Anyone can manage lexaia drafts by session"
ON public.lexaia_drafts
FOR ALL
USING (
  (user_id IS NULL AND session_id IS NOT NULL) OR 
  (auth.uid() = user_id)
)
WITH CHECK (
  (user_id IS NULL AND session_id IS NOT NULL) OR 
  (auth.uid() = user_id)
);

-- Search drafts - Anonymous with session or authenticated users
CREATE POLICY "Anyone can manage search drafts by session"
ON public.search_drafts
FOR ALL
USING (
  (user_id IS NULL AND session_id IS NOT NULL) OR 
  (auth.uid() = user_id)
)
WITH CHECK (
  (user_id IS NULL AND session_id IS NOT NULL) OR 
  (auth.uid() = user_id)
);