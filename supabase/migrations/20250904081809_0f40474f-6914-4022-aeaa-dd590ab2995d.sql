-- Create admin user with specified credentials
-- Note: This uses Supabase's built-in functions to safely create an admin user

DO $$
DECLARE
    admin_user_id uuid;
BEGIN
    -- Insert the user into auth.users (this should normally be done via Supabase Auth API)
    -- For admin creation, we'll insert directly but this is exceptional
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        'jmd@hypervisual.ch',
        crypt('Spiral74@#', gen_salt('bf')),
        now(),
        now(),
        now(),
        '{"provider": "email", "providers": ["email"]}',
        '{}',
        false,
        '',
        '',
        '',
        ''
    ) RETURNING id INTO admin_user_id;

    -- Insert corresponding profile with admin role
    INSERT INTO public.profiles (id, email, role, created_at, updated_at)
    VALUES (
        admin_user_id,
        'jmd@hypervisual.ch',
        'admin',
        now(),
        now()
    )
    ON CONFLICT (id) DO UPDATE SET
        role = 'admin',
        updated_at = now();
        
    -- Log the creation
    RAISE NOTICE 'Admin user created with ID: %', admin_user_id;
    
END $$;