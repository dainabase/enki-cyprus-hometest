export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      ab_test_assignments: {
        Row: {
          assigned_at: string
          id: string
          test_id: string
          user_id: string | null
          user_session: string
          variant: string
        }
        Insert: {
          assigned_at?: string
          id?: string
          test_id: string
          user_id?: string | null
          user_session: string
          variant: string
        }
        Update: {
          assigned_at?: string
          id?: string
          test_id?: string
          user_id?: string | null
          user_session?: string
          variant?: string
        }
        Relationships: [
          {
            foreignKeyName: "ab_test_assignments_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "ab_tests"
            referencedColumns: ["id"]
          },
        ]
      }
      ab_tests: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          id: string
          test_name: string
          updated_at: string
          variant_a: string
          variant_b: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          test_name: string
          updated_at?: string
          variant_a?: string
          variant_b?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          test_name?: string
          updated_at?: string
          variant_a?: string
          variant_b?: string
        }
        Relationships: []
      }
      admin_audit_log: {
        Row: {
          action: string
          admin_user_id: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
        }
        Insert: {
          action: string
          admin_user_id: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
        }
        Update: {
          action?: string
          admin_user_id?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      amenities: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          icon: string
          id: string
          is_premium: boolean | null
          name: string
          name_el: string | null
          name_ru: string | null
          sort_order: number | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          icon: string
          id?: string
          is_premium?: boolean | null
          name: string
          name_el?: string | null
          name_ru?: string | null
          sort_order?: number | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          icon?: string
          id?: string
          is_premium?: boolean | null
          name?: string
          name_el?: string | null
          name_ru?: string | null
          sort_order?: number | null
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          created_at: string
          event_data: Json
          event_name: string
          id: string
          page_url: string
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_data?: Json
          event_name: string
          id?: string
          page_url: string
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json
          event_name?: string
          id?: string
          page_url?: string
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      analytics_rate_limits: {
        Row: {
          created_at: string | null
          event_count: number | null
          id: string
          session_id: string | null
          updated_at: string | null
          user_id: string | null
          window_start: string | null
        }
        Insert: {
          created_at?: string | null
          event_count?: number | null
          id?: string
          session_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          window_start?: string | null
        }
        Update: {
          created_at?: string | null
          event_count?: number | null
          id?: string
          session_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          window_start?: string | null
        }
        Relationships: []
      }
      building_drafts: {
        Row: {
          auto_save_enabled: boolean
          building_id: string | null
          created_at: string
          current_step: string
          form_data: Json
          id: string
          session_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_save_enabled?: boolean
          building_id?: string | null
          created_at?: string
          current_step?: string
          form_data?: Json
          id?: string
          session_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_save_enabled?: boolean
          building_id?: string | null
          created_at?: string
          current_step?: string
          form_data?: Json
          id?: string
          session_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      building_images: {
        Row: {
          building_id: string | null
          caption: string | null
          created_at: string | null
          display_order: number | null
          id: string
          is_primary: boolean | null
          url: string
        }
        Insert: {
          building_id?: string | null
          caption?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_primary?: boolean | null
          url: string
        }
        Update: {
          building_id?: string | null
          caption?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_primary?: boolean | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "building_images_building_id_fkey"
            columns: ["building_id"]
            isOneToOne: false
            referencedRelation: "buildings"
            referencedColumns: ["id"]
          },
        ]
      }
      buildings: {
        Row: {
          actual_completion: string | null
          building_class: string | null
          building_code: string | null
          building_name: string | null
          building_type: string | null
          construction_status: string | null
          created_at: string | null
          created_by: string | null
          display_order: number | null
          elevator_count: number | null
          energy_certificate: string | null
          energy_rating: string | null
          expected_completion: string | null
          has_cctv: boolean | null
          has_concierge: boolean | null
          has_garden: boolean | null
          has_generator: boolean | null
          has_gym: boolean | null
          has_parking: boolean | null
          has_playground: boolean | null
          has_pool: boolean | null
          has_security_system: boolean | null
          has_spa: boolean | null
          id: string
          name: string
          parking_type: string | null
          project_id: string | null
          total_floors: number | null
          total_units: number | null
          units_available: number | null
          updated_at: string | null
        }
        Insert: {
          actual_completion?: string | null
          building_class?: string | null
          building_code?: string | null
          building_name?: string | null
          building_type?: string | null
          construction_status?: string | null
          created_at?: string | null
          created_by?: string | null
          display_order?: number | null
          elevator_count?: number | null
          energy_certificate?: string | null
          energy_rating?: string | null
          expected_completion?: string | null
          has_cctv?: boolean | null
          has_concierge?: boolean | null
          has_garden?: boolean | null
          has_generator?: boolean | null
          has_gym?: boolean | null
          has_parking?: boolean | null
          has_playground?: boolean | null
          has_pool?: boolean | null
          has_security_system?: boolean | null
          has_spa?: boolean | null
          id?: string
          name: string
          parking_type?: string | null
          project_id?: string | null
          total_floors?: number | null
          total_units?: number | null
          units_available?: number | null
          updated_at?: string | null
        }
        Update: {
          actual_completion?: string | null
          building_class?: string | null
          building_code?: string | null
          building_name?: string | null
          building_type?: string | null
          construction_status?: string | null
          created_at?: string | null
          created_by?: string | null
          display_order?: number | null
          elevator_count?: number | null
          energy_certificate?: string | null
          energy_rating?: string | null
          expected_completion?: string | null
          has_cctv?: boolean | null
          has_concierge?: boolean | null
          has_garden?: boolean | null
          has_generator?: boolean | null
          has_gym?: boolean | null
          has_parking?: boolean | null
          has_playground?: boolean | null
          has_pool?: boolean | null
          has_security_system?: boolean | null
          has_spa?: boolean | null
          id?: string
          name?: string
          parking_type?: string | null
          project_id?: string | null
          total_floors?: number | null
          total_units?: number | null
          units_available?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "buildings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_buildings_project_id"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      checklists: {
        Row: {
          created_at: string
          id: string
          items: Json
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          items?: Json
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          items?: Json
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "checklists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      commission_payments: {
        Row: {
          amount: number
          commission_id: string | null
          created_at: string | null
          created_by: string | null
          id: string
          notes: string | null
          payment_date: string
          payment_method: string | null
          reference: string | null
        }
        Insert: {
          amount: number
          commission_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          notes?: string | null
          payment_date: string
          payment_method?: string | null
          reference?: string | null
        }
        Update: {
          amount?: number
          commission_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          notes?: string | null
          payment_date?: string
          payment_method?: string | null
          reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commission_payments_commission_id_fkey"
            columns: ["commission_id"]
            isOneToOne: false
            referencedRelation: "commissions"
            referencedColumns: ["id"]
          },
        ]
      }
      commissions: {
        Row: {
          amount: number
          created_at: string
          date: string
          id: string
          project_id: string
          promoter_id: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          date?: string
          id?: string
          project_id: string
          promoter_id: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          date?: string
          id?: string
          project_id?: string
          promoter_id?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      contact_drafts: {
        Row: {
          auto_save_enabled: boolean
          created_at: string
          form_data: Json
          id: string
          session_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          auto_save_enabled?: boolean
          created_at?: string
          form_data?: Json
          id?: string
          session_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          auto_save_enabled?: boolean
          created_at?: string
          form_data?: Json
          id?: string
          session_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      developer_drafts: {
        Row: {
          auto_save_enabled: boolean
          created_at: string
          current_step: string
          developer_id: string | null
          form_data: Json
          id: string
          session_id: string | null
          step_index: number
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_save_enabled?: boolean
          created_at?: string
          current_step?: string
          developer_id?: string | null
          form_data?: Json
          id?: string
          session_id?: string | null
          step_index?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_save_enabled?: boolean
          created_at?: string
          current_step?: string
          developer_id?: string | null
          form_data?: Json
          id?: string
          session_id?: string | null
          step_index?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      developers: {
        Row: {
          addresses: string[] | null
          bank_guarantee: boolean | null
          commission_rate: number | null
          company_registration_number: string | null
          contact_info: Json | null
          created_at: string | null
          email_marketing: string | null
          email_primary: string | null
          email_sales: string | null
          financial_stability: string | null
          founded_year: number | null
          history: string | null
          id: string
          insurance_coverage: number | null
          key_projects: string | null
          license_number: string | null
          logo: string | null
          main_activities: string | null
          main_city: string | null
          name: string
          payment_terms: string | null
          phone_numbers: string[] | null
          rating_justification: string | null
          rating_score: number | null
          reputation_reviews: string | null
          status: string | null
          total_projects: number | null
          updated_at: string | null
          vat_number: string | null
          website: string | null
          years_experience: number | null
        }
        Insert: {
          addresses?: string[] | null
          bank_guarantee?: boolean | null
          commission_rate?: number | null
          company_registration_number?: string | null
          contact_info?: Json | null
          created_at?: string | null
          email_marketing?: string | null
          email_primary?: string | null
          email_sales?: string | null
          financial_stability?: string | null
          founded_year?: number | null
          history?: string | null
          id?: string
          insurance_coverage?: number | null
          key_projects?: string | null
          license_number?: string | null
          logo?: string | null
          main_activities?: string | null
          main_city?: string | null
          name: string
          payment_terms?: string | null
          phone_numbers?: string[] | null
          rating_justification?: string | null
          rating_score?: number | null
          reputation_reviews?: string | null
          status?: string | null
          total_projects?: number | null
          updated_at?: string | null
          vat_number?: string | null
          website?: string | null
          years_experience?: number | null
        }
        Update: {
          addresses?: string[] | null
          bank_guarantee?: boolean | null
          commission_rate?: number | null
          company_registration_number?: string | null
          contact_info?: Json | null
          created_at?: string | null
          email_marketing?: string | null
          email_primary?: string | null
          email_sales?: string | null
          financial_stability?: string | null
          founded_year?: number | null
          history?: string | null
          id?: string
          insurance_coverage?: number | null
          key_projects?: string | null
          license_number?: string | null
          logo?: string | null
          main_activities?: string | null
          main_city?: string | null
          name?: string
          payment_terms?: string | null
          phone_numbers?: string[] | null
          rating_justification?: string | null
          rating_score?: number | null
          reputation_reviews?: string | null
          status?: string | null
          total_projects?: number | null
          updated_at?: string | null
          vat_number?: string | null
          website?: string | null
          years_experience?: number | null
        }
        Relationships: []
      }
      dossiers: {
        Row: {
          biens: string[]
          created_at: string
          id: string
          lexaia_outputs: Json
          pdf_url: string | null
          query: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          biens?: string[]
          created_at?: string
          id?: string
          lexaia_outputs?: Json
          pdf_url?: string | null
          query: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          biens?: string[]
          created_at?: string
          id?: string
          lexaia_outputs?: Json
          pdf_url?: string | null
          query?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          project_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          project_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          project_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_activities: {
        Row: {
          activity_type: string
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          lead_id: string | null
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          lead_id?: string | null
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          lead_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          assigned_to: string | null
          budget_max: number | null
          budget_min: number | null
          created_at: string | null
          email: string
          first_name: string
          golden_visa_interest: boolean | null
          id: string
          last_contact_date: string | null
          last_name: string
          notes: string | null
          phone: string | null
          property_type: string | null
          score: number | null
          source: string | null
          status: string | null
          status_changed_at: string | null
          updated_at: string | null
          urgency: string | null
          zones: string[] | null
        }
        Insert: {
          assigned_to?: string | null
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string | null
          email: string
          first_name: string
          golden_visa_interest?: boolean | null
          id?: string
          last_contact_date?: string | null
          last_name: string
          notes?: string | null
          phone?: string | null
          property_type?: string | null
          score?: number | null
          source?: string | null
          status?: string | null
          status_changed_at?: string | null
          updated_at?: string | null
          urgency?: string | null
          zones?: string[] | null
        }
        Update: {
          assigned_to?: string | null
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string | null
          email?: string
          first_name?: string
          golden_visa_interest?: boolean | null
          id?: string
          last_contact_date?: string | null
          last_name?: string
          notes?: string | null
          phone?: string | null
          property_type?: string | null
          score?: number | null
          source?: string | null
          status?: string | null
          status_changed_at?: string | null
          updated_at?: string | null
          urgency?: string | null
          zones?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "developers"
            referencedColumns: ["id"]
          },
        ]
      }
      lexaia_drafts: {
        Row: {
          auto_save_enabled: boolean
          created_at: string
          form_data: Json
          id: string
          session_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          auto_save_enabled?: boolean
          created_at?: string
          form_data?: Json
          id?: string
          session_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          auto_save_enabled?: boolean
          created_at?: string
          form_data?: Json
          id?: string
          session_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      nearby_amenities: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          icon: string
          id: string
          importance_level: number | null
          name: string
          name_el: string | null
          name_ru: string | null
          sort_order: number | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          icon: string
          id?: string
          importance_level?: number | null
          name: string
          name_el?: string | null
          name_ru?: string | null
          sort_order?: number | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          icon?: string
          id?: string
          importance_level?: number | null
          name?: string
          name_el?: string | null
          name_ru?: string | null
          sort_order?: number | null
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          analytics_tracking: boolean | null
          created_at: string
          email_notifications: boolean | null
          functional_cookies: boolean | null
          id: string
          marketing_emails: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          analytics_tracking?: boolean | null
          created_at?: string
          email_notifications?: boolean | null
          functional_cookies?: boolean | null
          id?: string
          marketing_emails?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          analytics_tracking?: boolean | null
          created_at?: string
          email_notifications?: boolean | null
          functional_cookies?: boolean | null
          id?: string
          marketing_emails?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      pipeline_stages: {
        Row: {
          color: string | null
          created_at: string | null
          display_name: string
          display_order: number
          id: string
          is_active: boolean | null
          stage_key: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          display_name: string
          display_order: number
          id?: string
          is_active?: boolean | null
          stage_key: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          display_name?: string
          display_order?: number
          id?: string
          is_active?: boolean | null
          stage_key?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          profile: Json | null
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          profile?: Json | null
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          profile?: Json | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_ai_imports: {
        Row: {
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          documents: Json[] | null
          error_message: string | null
          id: string
          mapped_data: Json | null
          project_id: string | null
          raw_extraction: Json | null
          session_id: string
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          documents?: Json[] | null
          error_message?: string | null
          id?: string
          mapped_data?: Json | null
          project_id?: string | null
          raw_extraction?: Json | null
          session_id: string
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          documents?: Json[] | null
          error_message?: string | null
          id?: string
          mapped_data?: Json | null
          project_id?: string | null
          raw_extraction?: Json | null
          session_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_ai_imports_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_amenities: {
        Row: {
          amenity_id: string
          created_at: string | null
          details: string | null
          id: string
          is_available: boolean | null
          is_paid: boolean | null
          project_id: string
        }
        Insert: {
          amenity_id: string
          created_at?: string | null
          details?: string | null
          id?: string
          is_available?: boolean | null
          is_paid?: boolean | null
          project_id: string
        }
        Update: {
          amenity_id?: string
          created_at?: string | null
          details?: string | null
          id?: string
          is_available?: boolean | null
          is_paid?: boolean | null
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_amenities_amenity_id_fkey"
            columns: ["amenity_id"]
            isOneToOne: false
            referencedRelation: "amenities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_amenities_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_documents: {
        Row: {
          confidence_scores: Json | null
          created_at: string | null
          document_name: string
          document_type: string | null
          extracted_data: Json | null
          file_size: number | null
          file_url: string
          id: string
          mime_type: string | null
          project_id: string | null
          updated_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          confidence_scores?: Json | null
          created_at?: string | null
          document_name: string
          document_type?: string | null
          extracted_data?: Json | null
          file_size?: number | null
          file_url: string
          id?: string
          mime_type?: string | null
          project_id?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          confidence_scores?: Json | null
          created_at?: string | null
          document_name?: string
          document_type?: string | null
          extracted_data?: Json | null
          file_size?: number | null
          file_url?: string
          id?: string
          mime_type?: string | null
          project_id?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_drafts: {
        Row: {
          auto_save_enabled: boolean
          created_at: string
          current_step: string
          form_data: Json
          id: string
          project_id: string | null
          session_id: string | null
          step_index: number
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_save_enabled?: boolean
          created_at?: string
          current_step?: string
          form_data?: Json
          id?: string
          project_id?: string | null
          session_id?: string | null
          step_index?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_save_enabled?: boolean
          created_at?: string
          current_step?: string
          form_data?: Json
          id?: string
          project_id?: string | null
          session_id?: string | null
          step_index?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      project_images: {
        Row: {
          caption: string | null
          created_at: string | null
          display_order: number | null
          id: string
          is_primary: boolean | null
          project_id: string | null
          url: string
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_primary?: boolean | null
          project_id?: string | null
          url: string
        }
        Update: {
          caption?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_primary?: boolean | null
          project_id?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_images_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_nearby_amenities: {
        Row: {
          created_at: string | null
          details: string | null
          distance_km: number | null
          distance_minutes_drive: number | null
          distance_minutes_walk: number | null
          id: string
          nearby_amenity_id: string
          project_id: string
          quantity: number | null
        }
        Insert: {
          created_at?: string | null
          details?: string | null
          distance_km?: number | null
          distance_minutes_drive?: number | null
          distance_minutes_walk?: number | null
          id?: string
          nearby_amenity_id: string
          project_id: string
          quantity?: number | null
        }
        Update: {
          created_at?: string | null
          details?: string | null
          distance_km?: number | null
          distance_minutes_drive?: number | null
          distance_minutes_walk?: number | null
          id?: string
          nearby_amenity_id?: string
          project_id?: string
          quantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "project_nearby_amenities_nearby_amenity_id_fkey"
            columns: ["nearby_amenity_id"]
            isOneToOne: false
            referencedRelation: "nearby_amenities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_nearby_amenities_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          accessibility_features: string[] | null
          after_sales_service: boolean | null
          ai_chatbot_enabled: boolean | null
          ai_content_disclosure: string | null
          ai_description: string | null
          ai_generated_at: string | null
          ai_generated_content: Json | null
          amenities: string[] | null
          ar_experience_url: string | null
          architect_license_number: string | null
          architect_name: string | null
          bathrooms_range: string | null
          bedrooms_range: string | null
          bim_model_url: string | null
          builder_name: string | null
          building_certification: string | null
          building_id: string | null
          building_insurance: string | null
          building_permit_number: string | null
          built_area_m2: number | null
          categorized_photos: Json | null
          city: string | null
          commission_rate: number | null
          community_features: string[] | null
          completion_date: string | null
          completion_date_new: string | null
          compliance_certifications: string[] | null
          construction_materials: string[] | null
          construction_phase: string | null
          construction_start: string | null
          construction_year: number | null
          created_at: string
          cyprus_zone: string | null
          description: string
          design_style: string | null
          detailed_description: string | null
          detailed_features: string[] | null
          developer_id: string | null
          district: string | null
          drone_footage_urls: string[] | null
          energy_rating: string | null
          engineer_license_number: string | null
          environmental_permit: string | null
          exclusive_commercialization: boolean | null
          favorite_count: number | null
          featured_new: boolean | null
          featured_property: boolean | null
          featured_until: string | null
          features: string[]
          financing_available: boolean | null
          financing_options: Json | null
          finishing_level: string | null
          floor_number: number | null
          floor_plan_3d_urls: string[] | null
          floor_plan_urls: string[] | null
          floors_total: number | null
          full_address: string | null
          furniture_status: string | null
          golden_visa_eligible: boolean | null
          golden_visa_eligible_new: boolean | null
          gps_latitude: number | null
          gps_longitude: number | null
          hoa_fees_monthly: number | null
          id: string
          incentives: string[] | null
          inquiry_count: number | null
          interactive_map_url: string | null
          interests: Json[] | null
          internet_speed_mbps: number | null
          land_area_m2: number | null
          last_price_update: string | null
          launch_date: string | null
          legal_status: string | null
          lifestyle_amenities: string[] | null
          livability: boolean | null
          location: Json
          maintenance_fees_yearly: number | null
          map_image: string | null
          marketing_highlights: string[] | null
          marketing_strategy: Json | null
          meta_description: string | null
          meta_description_new: string | null
          meta_keywords: string[] | null
          meta_title: string | null
          meta_title_new: string | null
          metaverse_preview_url: string | null
          model_3d_urls: string[] | null
          municipality: string | null
          neighborhood: string | null
          neighborhood_description: string | null
          nft_ownership_available: boolean | null
          og_image_url: string | null
          parking_spaces: number | null
          payment_plan: Json | null
          permits_obtained: string[] | null
          pet_policy: string | null
          photo_count: number | null
          photo_gallery_urls: string[] | null
          photos: string[]
          planning_permit_number: string | null
          plans: string[] | null
          price: number
          price_from: string | null
          price_from_new: number | null
          price_per_m2: number | null
          price_to: number | null
          pricing_strategy_notes: string | null
          project_code: string | null
          project_narrative: string | null
          project_phase: string | null
          project_presentation_url: string | null
          project_status: string | null
          property_category: string | null
          property_sub_type: string[] | null
          property_tax_yearly: number | null
          property_types: string[] | null
          proximity_airport_km: number | null
          proximity_city_center_km: number | null
          proximity_highway_km: number | null
          proximity_sea_km: number | null
          region: string | null
          renovation_year: number | null
          rental_yield_percent: number | null
          reservation_status: string | null
          roi_estimate_percent: number | null
          schema_markup: Json | null
          search_ranking_weight: number | null
          seasonal_features: Json | null
          seismic_rating: string | null
          smart_home_features: Json | null
          smoking_policy: string | null
          social_proof_stats: Json | null
          status: string
          status_project: string | null
          statut_commercial: string | null
          storage_spaces: number | null
          subtitle: string | null
          surrounding_amenities: Json | null
          sustainability_certifications: string[] | null
          target_audience: string[] | null
          testimonials: Json | null
          title: string
          title_deed_available: boolean | null
          title_deed_status: string | null
          title_deed_timeline: string | null
          total_units: number | null
          total_units_new: number | null
          transfer_fee: number | null
          translations: Json | null
          unique_selling_points: string[] | null
          unit_number: string | null
          units: Json[] | null
          units_available: number | null
          units_available_new: number | null
          units_sold: number | null
          updated_at: string
          url_slug: string | null
          vat_included: boolean | null
          vat_rate: number | null
          vat_rate_new: number | null
          video_tour_urls: string[] | null
          video_url: string | null
          view_count: number | null
          view_count_new: number | null
          vimeo_tour_url: string | null
          virtual_tour: string | null
          virtual_tour_url: string | null
          virtual_tour_url_new: string | null
          vr_tour_url: string | null
          warranty_years: number | null
          wellness_features: string[] | null
          youtube_tour_url: string | null
        }
        Insert: {
          accessibility_features?: string[] | null
          after_sales_service?: boolean | null
          ai_chatbot_enabled?: boolean | null
          ai_content_disclosure?: string | null
          ai_description?: string | null
          ai_generated_at?: string | null
          ai_generated_content?: Json | null
          amenities?: string[] | null
          ar_experience_url?: string | null
          architect_license_number?: string | null
          architect_name?: string | null
          bathrooms_range?: string | null
          bedrooms_range?: string | null
          bim_model_url?: string | null
          builder_name?: string | null
          building_certification?: string | null
          building_id?: string | null
          building_insurance?: string | null
          building_permit_number?: string | null
          built_area_m2?: number | null
          categorized_photos?: Json | null
          city?: string | null
          commission_rate?: number | null
          community_features?: string[] | null
          completion_date?: string | null
          completion_date_new?: string | null
          compliance_certifications?: string[] | null
          construction_materials?: string[] | null
          construction_phase?: string | null
          construction_start?: string | null
          construction_year?: number | null
          created_at?: string
          cyprus_zone?: string | null
          description: string
          design_style?: string | null
          detailed_description?: string | null
          detailed_features?: string[] | null
          developer_id?: string | null
          district?: string | null
          drone_footage_urls?: string[] | null
          energy_rating?: string | null
          engineer_license_number?: string | null
          environmental_permit?: string | null
          exclusive_commercialization?: boolean | null
          favorite_count?: number | null
          featured_new?: boolean | null
          featured_property?: boolean | null
          featured_until?: string | null
          features?: string[]
          financing_available?: boolean | null
          financing_options?: Json | null
          finishing_level?: string | null
          floor_number?: number | null
          floor_plan_3d_urls?: string[] | null
          floor_plan_urls?: string[] | null
          floors_total?: number | null
          full_address?: string | null
          furniture_status?: string | null
          golden_visa_eligible?: boolean | null
          golden_visa_eligible_new?: boolean | null
          gps_latitude?: number | null
          gps_longitude?: number | null
          hoa_fees_monthly?: number | null
          id?: string
          incentives?: string[] | null
          inquiry_count?: number | null
          interactive_map_url?: string | null
          interests?: Json[] | null
          internet_speed_mbps?: number | null
          land_area_m2?: number | null
          last_price_update?: string | null
          launch_date?: string | null
          legal_status?: string | null
          lifestyle_amenities?: string[] | null
          livability?: boolean | null
          location: Json
          maintenance_fees_yearly?: number | null
          map_image?: string | null
          marketing_highlights?: string[] | null
          marketing_strategy?: Json | null
          meta_description?: string | null
          meta_description_new?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          meta_title_new?: string | null
          metaverse_preview_url?: string | null
          model_3d_urls?: string[] | null
          municipality?: string | null
          neighborhood?: string | null
          neighborhood_description?: string | null
          nft_ownership_available?: boolean | null
          og_image_url?: string | null
          parking_spaces?: number | null
          payment_plan?: Json | null
          permits_obtained?: string[] | null
          pet_policy?: string | null
          photo_count?: number | null
          photo_gallery_urls?: string[] | null
          photos?: string[]
          planning_permit_number?: string | null
          plans?: string[] | null
          price: number
          price_from?: string | null
          price_from_new?: number | null
          price_per_m2?: number | null
          price_to?: number | null
          pricing_strategy_notes?: string | null
          project_code?: string | null
          project_narrative?: string | null
          project_phase?: string | null
          project_presentation_url?: string | null
          project_status?: string | null
          property_category?: string | null
          property_sub_type?: string[] | null
          property_tax_yearly?: number | null
          property_types?: string[] | null
          proximity_airport_km?: number | null
          proximity_city_center_km?: number | null
          proximity_highway_km?: number | null
          proximity_sea_km?: number | null
          region?: string | null
          renovation_year?: number | null
          rental_yield_percent?: number | null
          reservation_status?: string | null
          roi_estimate_percent?: number | null
          schema_markup?: Json | null
          search_ranking_weight?: number | null
          seasonal_features?: Json | null
          seismic_rating?: string | null
          smart_home_features?: Json | null
          smoking_policy?: string | null
          social_proof_stats?: Json | null
          status?: string
          status_project?: string | null
          statut_commercial?: string | null
          storage_spaces?: number | null
          subtitle?: string | null
          surrounding_amenities?: Json | null
          sustainability_certifications?: string[] | null
          target_audience?: string[] | null
          testimonials?: Json | null
          title: string
          title_deed_available?: boolean | null
          title_deed_status?: string | null
          title_deed_timeline?: string | null
          total_units?: number | null
          total_units_new?: number | null
          transfer_fee?: number | null
          translations?: Json | null
          unique_selling_points?: string[] | null
          unit_number?: string | null
          units?: Json[] | null
          units_available?: number | null
          units_available_new?: number | null
          units_sold?: number | null
          updated_at?: string
          url_slug?: string | null
          vat_included?: boolean | null
          vat_rate?: number | null
          vat_rate_new?: number | null
          video_tour_urls?: string[] | null
          video_url?: string | null
          view_count?: number | null
          view_count_new?: number | null
          vimeo_tour_url?: string | null
          virtual_tour?: string | null
          virtual_tour_url?: string | null
          virtual_tour_url_new?: string | null
          vr_tour_url?: string | null
          warranty_years?: number | null
          wellness_features?: string[] | null
          youtube_tour_url?: string | null
        }
        Update: {
          accessibility_features?: string[] | null
          after_sales_service?: boolean | null
          ai_chatbot_enabled?: boolean | null
          ai_content_disclosure?: string | null
          ai_description?: string | null
          ai_generated_at?: string | null
          ai_generated_content?: Json | null
          amenities?: string[] | null
          ar_experience_url?: string | null
          architect_license_number?: string | null
          architect_name?: string | null
          bathrooms_range?: string | null
          bedrooms_range?: string | null
          bim_model_url?: string | null
          builder_name?: string | null
          building_certification?: string | null
          building_id?: string | null
          building_insurance?: string | null
          building_permit_number?: string | null
          built_area_m2?: number | null
          categorized_photos?: Json | null
          city?: string | null
          commission_rate?: number | null
          community_features?: string[] | null
          completion_date?: string | null
          completion_date_new?: string | null
          compliance_certifications?: string[] | null
          construction_materials?: string[] | null
          construction_phase?: string | null
          construction_start?: string | null
          construction_year?: number | null
          created_at?: string
          cyprus_zone?: string | null
          description?: string
          design_style?: string | null
          detailed_description?: string | null
          detailed_features?: string[] | null
          developer_id?: string | null
          district?: string | null
          drone_footage_urls?: string[] | null
          energy_rating?: string | null
          engineer_license_number?: string | null
          environmental_permit?: string | null
          exclusive_commercialization?: boolean | null
          favorite_count?: number | null
          featured_new?: boolean | null
          featured_property?: boolean | null
          featured_until?: string | null
          features?: string[]
          financing_available?: boolean | null
          financing_options?: Json | null
          finishing_level?: string | null
          floor_number?: number | null
          floor_plan_3d_urls?: string[] | null
          floor_plan_urls?: string[] | null
          floors_total?: number | null
          full_address?: string | null
          furniture_status?: string | null
          golden_visa_eligible?: boolean | null
          golden_visa_eligible_new?: boolean | null
          gps_latitude?: number | null
          gps_longitude?: number | null
          hoa_fees_monthly?: number | null
          id?: string
          incentives?: string[] | null
          inquiry_count?: number | null
          interactive_map_url?: string | null
          interests?: Json[] | null
          internet_speed_mbps?: number | null
          land_area_m2?: number | null
          last_price_update?: string | null
          launch_date?: string | null
          legal_status?: string | null
          lifestyle_amenities?: string[] | null
          livability?: boolean | null
          location?: Json
          maintenance_fees_yearly?: number | null
          map_image?: string | null
          marketing_highlights?: string[] | null
          marketing_strategy?: Json | null
          meta_description?: string | null
          meta_description_new?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          meta_title_new?: string | null
          metaverse_preview_url?: string | null
          model_3d_urls?: string[] | null
          municipality?: string | null
          neighborhood?: string | null
          neighborhood_description?: string | null
          nft_ownership_available?: boolean | null
          og_image_url?: string | null
          parking_spaces?: number | null
          payment_plan?: Json | null
          permits_obtained?: string[] | null
          pet_policy?: string | null
          photo_count?: number | null
          photo_gallery_urls?: string[] | null
          photos?: string[]
          planning_permit_number?: string | null
          plans?: string[] | null
          price?: number
          price_from?: string | null
          price_from_new?: number | null
          price_per_m2?: number | null
          price_to?: number | null
          pricing_strategy_notes?: string | null
          project_code?: string | null
          project_narrative?: string | null
          project_phase?: string | null
          project_presentation_url?: string | null
          project_status?: string | null
          property_category?: string | null
          property_sub_type?: string[] | null
          property_tax_yearly?: number | null
          property_types?: string[] | null
          proximity_airport_km?: number | null
          proximity_city_center_km?: number | null
          proximity_highway_km?: number | null
          proximity_sea_km?: number | null
          region?: string | null
          renovation_year?: number | null
          rental_yield_percent?: number | null
          reservation_status?: string | null
          roi_estimate_percent?: number | null
          schema_markup?: Json | null
          search_ranking_weight?: number | null
          seasonal_features?: Json | null
          seismic_rating?: string | null
          smart_home_features?: Json | null
          smoking_policy?: string | null
          social_proof_stats?: Json | null
          status?: string
          status_project?: string | null
          statut_commercial?: string | null
          storage_spaces?: number | null
          subtitle?: string | null
          surrounding_amenities?: Json | null
          sustainability_certifications?: string[] | null
          target_audience?: string[] | null
          testimonials?: Json | null
          title?: string
          title_deed_available?: boolean | null
          title_deed_status?: string | null
          title_deed_timeline?: string | null
          total_units?: number | null
          total_units_new?: number | null
          transfer_fee?: number | null
          translations?: Json | null
          unique_selling_points?: string[] | null
          unit_number?: string | null
          units?: Json[] | null
          units_available?: number | null
          units_available_new?: number | null
          units_sold?: number | null
          updated_at?: string
          url_slug?: string | null
          vat_included?: boolean | null
          vat_rate?: number | null
          vat_rate_new?: number | null
          video_tour_urls?: string[] | null
          video_url?: string | null
          view_count?: number | null
          view_count_new?: number | null
          vimeo_tour_url?: string | null
          virtual_tour?: string | null
          virtual_tour_url?: string | null
          virtual_tour_url_new?: string | null
          vr_tour_url?: string | null
          warranty_years?: number | null
          wellness_features?: string[] | null
          youtube_tour_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_projects_developer_id"
            columns: ["developer_id"]
            isOneToOne: false
            referencedRelation: "developers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_building_id_fkey"
            columns: ["building_id"]
            isOneToOne: false
            referencedRelation: "buildings"
            referencedColumns: ["id"]
          },
        ]
      }
      promoters: {
        Row: {
          commission_rate: number
          contact: Json
          created_at: string
          id: string
          name: string
          projects: string[]
          updated_at: string
        }
        Insert: {
          commission_rate?: number
          contact?: Json
          created_at?: string
          id?: string
          name: string
          projects?: string[]
          updated_at?: string
        }
        Update: {
          commission_rate?: number
          contact?: Json
          created_at?: string
          id?: string
          name?: string
          projects?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          air_conditioning_type: string | null
          annual_property_tax: number | null
          appliances_list: Json | null
          balcony_area: number | null
          balcony_count: number | null
          basement_area: number | null
          bathroom_fixtures_brand: string | null
          bathrooms_count: number | null
          bedrooms_count: number | null
          building_id: string | null
          building_permit_number: string | null
          cadastral_reference: string | null
          ceiling_height: number | null
          commission_amount: number | null
          commission_rate: number | null
          communal_fees_monthly: number | null
          countertop_material: string | null
          covered_verandas: number | null
          created_at: string | null
          created_by: string | null
          current_price: number | null
          deposit_amount: number | null
          deposit_percentage: number | null
          developer_id: string | null
          discount_amount: number | null
          discount_percentage: number | null
          display_order: number | null
          distance_to_elevator: number | null
          distance_to_stairs: number | null
          doors_type: string | null
          en_suite_count: number | null
          energy_certificate_number: string | null
          energy_rating: string | null
          entrance_type: string | null
          estimated_utility_costs: number | null
          facing: string[] | null
          finance_available: boolean | null
          fireplace_type: string | null
          floor_number: number | null
          flooring_type: string | null
          furniture_package_value: number | null
          garden_type: string | null
          golden_visa_eligible: boolean | null
          has_alarm_system: boolean | null
          has_automatic_irrigation: boolean | null
          has_balcony: boolean | null
          has_bbq_area: boolean | null
          has_central_vacuum: boolean | null
          has_city_view: boolean | null
          has_disabled_access: boolean | null
          has_dressing_room: boolean | null
          has_electric_car_charger: boolean | null
          has_electric_shutters: boolean | null
          has_fiber_optic: boolean | null
          has_fireplace: boolean | null
          has_garden_view: boolean | null
          has_guest_wc: boolean | null
          has_home_cinema: boolean | null
          has_jacuzzi: boolean | null
          has_kitchen_appliances: boolean | null
          has_laundry_room: boolean | null
          has_maid_room: boolean | null
          has_mountain_view: boolean | null
          has_office: boolean | null
          has_outdoor_kitchen: boolean | null
          has_pantry: boolean | null
          has_pergola: boolean | null
          has_playroom: boolean | null
          has_pool_view: boolean | null
          has_private_elevator: boolean | null
          has_private_garden: boolean | null
          has_private_pool: boolean | null
          has_roof_terrace: boolean | null
          has_safe: boolean | null
          has_satellite_tv: boolean | null
          has_sauna: boolean | null
          has_sea_view: boolean | null
          has_security_door: boolean | null
          has_smart_home: boolean | null
          has_solar_panels: boolean | null
          has_storage_room: boolean | null
          has_storage_unit: boolean | null
          has_terrace: boolean | null
          has_underfloor_heating: boolean | null
          has_video_intercom: boolean | null
          has_water_softener: boolean | null
          has_wine_cellar: boolean | null
          has_wine_fridge: boolean | null
          heating_type: string | null
          hvac_type: string | null
          id: string
          internal_area: number | null
          internal_notes: string | null
          internet_ready: boolean | null
          investment_type: string | null
          is_available: boolean | null
          is_furnished: boolean | null
          kitchen_area: number | null
          kitchen_brand: string | null
          kitchen_type: string | null
          living_room_area: number | null
          maintenance_fee_monthly: number | null
          master_bedroom_area: number | null
          minimum_cash_required: number | null
          minimum_investment_met: boolean | null
          occupancy_certificate: string | null
          orientation: string | null
          original_price: number | null
          ownership_type: string | null
          parking_included: boolean | null
          parking_location: string | null
          parking_spaces: number | null
          parking_type: string | null
          parking_type_unit: string | null
          payment_plan_available: boolean | null
          payment_plan_details: Json | null
          planning_permit_number: string | null
          plot_area: number | null
          pool_size: string | null
          pool_type: string | null
          position_in_floor: string | null
          price_excluding_vat: number | null
          price_including_vat: number | null
          price_per_sqm: number | null
          private_garden_area: number | null
          project_id: string
          property_code: string | null
          property_status: string | null
          property_sub_type: string | null
          property_type: string
          public_description: string | null
          referral_commission: number | null
          referral_commission_rate: number | null
          reservation_date: string | null
          reservation_fee: number | null
          roof_garden_area: number | null
          sale_type: string | null
          security_features: Json | null
          smart_home_features: Json | null
          sold_date: string | null
          storage_area: number | null
          storage_location: string | null
          storage_spaces: number | null
          terrace_area: number | null
          terrace_count: number | null
          title_deed_number: string | null
          title_deed_status: string | null
          total_covered_area: number | null
          total_rooms: number | null
          transfer_fee_amount: number | null
          transfer_fee_percentage: number | null
          uncovered_verandas: number | null
          unit_number: string
          updated_at: string | null
          vat_amount: number | null
          vat_rate: number | null
          view_quality: string | null
          view_type: Json | null
          wall_finish: string | null
          wc_count: number | null
          windows_type: string | null
        }
        Insert: {
          air_conditioning_type?: string | null
          annual_property_tax?: number | null
          appliances_list?: Json | null
          balcony_area?: number | null
          balcony_count?: number | null
          basement_area?: number | null
          bathroom_fixtures_brand?: string | null
          bathrooms_count?: number | null
          bedrooms_count?: number | null
          building_id?: string | null
          building_permit_number?: string | null
          cadastral_reference?: string | null
          ceiling_height?: number | null
          commission_amount?: number | null
          commission_rate?: number | null
          communal_fees_monthly?: number | null
          countertop_material?: string | null
          covered_verandas?: number | null
          created_at?: string | null
          created_by?: string | null
          current_price?: number | null
          deposit_amount?: number | null
          deposit_percentage?: number | null
          developer_id?: string | null
          discount_amount?: number | null
          discount_percentage?: number | null
          display_order?: number | null
          distance_to_elevator?: number | null
          distance_to_stairs?: number | null
          doors_type?: string | null
          en_suite_count?: number | null
          energy_certificate_number?: string | null
          energy_rating?: string | null
          entrance_type?: string | null
          estimated_utility_costs?: number | null
          facing?: string[] | null
          finance_available?: boolean | null
          fireplace_type?: string | null
          floor_number?: number | null
          flooring_type?: string | null
          furniture_package_value?: number | null
          garden_type?: string | null
          golden_visa_eligible?: boolean | null
          has_alarm_system?: boolean | null
          has_automatic_irrigation?: boolean | null
          has_balcony?: boolean | null
          has_bbq_area?: boolean | null
          has_central_vacuum?: boolean | null
          has_city_view?: boolean | null
          has_disabled_access?: boolean | null
          has_dressing_room?: boolean | null
          has_electric_car_charger?: boolean | null
          has_electric_shutters?: boolean | null
          has_fiber_optic?: boolean | null
          has_fireplace?: boolean | null
          has_garden_view?: boolean | null
          has_guest_wc?: boolean | null
          has_home_cinema?: boolean | null
          has_jacuzzi?: boolean | null
          has_kitchen_appliances?: boolean | null
          has_laundry_room?: boolean | null
          has_maid_room?: boolean | null
          has_mountain_view?: boolean | null
          has_office?: boolean | null
          has_outdoor_kitchen?: boolean | null
          has_pantry?: boolean | null
          has_pergola?: boolean | null
          has_playroom?: boolean | null
          has_pool_view?: boolean | null
          has_private_elevator?: boolean | null
          has_private_garden?: boolean | null
          has_private_pool?: boolean | null
          has_roof_terrace?: boolean | null
          has_safe?: boolean | null
          has_satellite_tv?: boolean | null
          has_sauna?: boolean | null
          has_sea_view?: boolean | null
          has_security_door?: boolean | null
          has_smart_home?: boolean | null
          has_solar_panels?: boolean | null
          has_storage_room?: boolean | null
          has_storage_unit?: boolean | null
          has_terrace?: boolean | null
          has_underfloor_heating?: boolean | null
          has_video_intercom?: boolean | null
          has_water_softener?: boolean | null
          has_wine_cellar?: boolean | null
          has_wine_fridge?: boolean | null
          heating_type?: string | null
          hvac_type?: string | null
          id?: string
          internal_area?: number | null
          internal_notes?: string | null
          internet_ready?: boolean | null
          investment_type?: string | null
          is_available?: boolean | null
          is_furnished?: boolean | null
          kitchen_area?: number | null
          kitchen_brand?: string | null
          kitchen_type?: string | null
          living_room_area?: number | null
          maintenance_fee_monthly?: number | null
          master_bedroom_area?: number | null
          minimum_cash_required?: number | null
          minimum_investment_met?: boolean | null
          occupancy_certificate?: string | null
          orientation?: string | null
          original_price?: number | null
          ownership_type?: string | null
          parking_included?: boolean | null
          parking_location?: string | null
          parking_spaces?: number | null
          parking_type?: string | null
          parking_type_unit?: string | null
          payment_plan_available?: boolean | null
          payment_plan_details?: Json | null
          planning_permit_number?: string | null
          plot_area?: number | null
          pool_size?: string | null
          pool_type?: string | null
          position_in_floor?: string | null
          price_excluding_vat?: number | null
          price_including_vat?: number | null
          price_per_sqm?: number | null
          private_garden_area?: number | null
          project_id: string
          property_code?: string | null
          property_status?: string | null
          property_sub_type?: string | null
          property_type: string
          public_description?: string | null
          referral_commission?: number | null
          referral_commission_rate?: number | null
          reservation_date?: string | null
          reservation_fee?: number | null
          roof_garden_area?: number | null
          sale_type?: string | null
          security_features?: Json | null
          smart_home_features?: Json | null
          sold_date?: string | null
          storage_area?: number | null
          storage_location?: string | null
          storage_spaces?: number | null
          terrace_area?: number | null
          terrace_count?: number | null
          title_deed_number?: string | null
          title_deed_status?: string | null
          total_covered_area?: number | null
          total_rooms?: number | null
          transfer_fee_amount?: number | null
          transfer_fee_percentage?: number | null
          uncovered_verandas?: number | null
          unit_number: string
          updated_at?: string | null
          vat_amount?: number | null
          vat_rate?: number | null
          view_quality?: string | null
          view_type?: Json | null
          wall_finish?: string | null
          wc_count?: number | null
          windows_type?: string | null
        }
        Update: {
          air_conditioning_type?: string | null
          annual_property_tax?: number | null
          appliances_list?: Json | null
          balcony_area?: number | null
          balcony_count?: number | null
          basement_area?: number | null
          bathroom_fixtures_brand?: string | null
          bathrooms_count?: number | null
          bedrooms_count?: number | null
          building_id?: string | null
          building_permit_number?: string | null
          cadastral_reference?: string | null
          ceiling_height?: number | null
          commission_amount?: number | null
          commission_rate?: number | null
          communal_fees_monthly?: number | null
          countertop_material?: string | null
          covered_verandas?: number | null
          created_at?: string | null
          created_by?: string | null
          current_price?: number | null
          deposit_amount?: number | null
          deposit_percentage?: number | null
          developer_id?: string | null
          discount_amount?: number | null
          discount_percentage?: number | null
          display_order?: number | null
          distance_to_elevator?: number | null
          distance_to_stairs?: number | null
          doors_type?: string | null
          en_suite_count?: number | null
          energy_certificate_number?: string | null
          energy_rating?: string | null
          entrance_type?: string | null
          estimated_utility_costs?: number | null
          facing?: string[] | null
          finance_available?: boolean | null
          fireplace_type?: string | null
          floor_number?: number | null
          flooring_type?: string | null
          furniture_package_value?: number | null
          garden_type?: string | null
          golden_visa_eligible?: boolean | null
          has_alarm_system?: boolean | null
          has_automatic_irrigation?: boolean | null
          has_balcony?: boolean | null
          has_bbq_area?: boolean | null
          has_central_vacuum?: boolean | null
          has_city_view?: boolean | null
          has_disabled_access?: boolean | null
          has_dressing_room?: boolean | null
          has_electric_car_charger?: boolean | null
          has_electric_shutters?: boolean | null
          has_fiber_optic?: boolean | null
          has_fireplace?: boolean | null
          has_garden_view?: boolean | null
          has_guest_wc?: boolean | null
          has_home_cinema?: boolean | null
          has_jacuzzi?: boolean | null
          has_kitchen_appliances?: boolean | null
          has_laundry_room?: boolean | null
          has_maid_room?: boolean | null
          has_mountain_view?: boolean | null
          has_office?: boolean | null
          has_outdoor_kitchen?: boolean | null
          has_pantry?: boolean | null
          has_pergola?: boolean | null
          has_playroom?: boolean | null
          has_pool_view?: boolean | null
          has_private_elevator?: boolean | null
          has_private_garden?: boolean | null
          has_private_pool?: boolean | null
          has_roof_terrace?: boolean | null
          has_safe?: boolean | null
          has_satellite_tv?: boolean | null
          has_sauna?: boolean | null
          has_sea_view?: boolean | null
          has_security_door?: boolean | null
          has_smart_home?: boolean | null
          has_solar_panels?: boolean | null
          has_storage_room?: boolean | null
          has_storage_unit?: boolean | null
          has_terrace?: boolean | null
          has_underfloor_heating?: boolean | null
          has_video_intercom?: boolean | null
          has_water_softener?: boolean | null
          has_wine_cellar?: boolean | null
          has_wine_fridge?: boolean | null
          heating_type?: string | null
          hvac_type?: string | null
          id?: string
          internal_area?: number | null
          internal_notes?: string | null
          internet_ready?: boolean | null
          investment_type?: string | null
          is_available?: boolean | null
          is_furnished?: boolean | null
          kitchen_area?: number | null
          kitchen_brand?: string | null
          kitchen_type?: string | null
          living_room_area?: number | null
          maintenance_fee_monthly?: number | null
          master_bedroom_area?: number | null
          minimum_cash_required?: number | null
          minimum_investment_met?: boolean | null
          occupancy_certificate?: string | null
          orientation?: string | null
          original_price?: number | null
          ownership_type?: string | null
          parking_included?: boolean | null
          parking_location?: string | null
          parking_spaces?: number | null
          parking_type?: string | null
          parking_type_unit?: string | null
          payment_plan_available?: boolean | null
          payment_plan_details?: Json | null
          planning_permit_number?: string | null
          plot_area?: number | null
          pool_size?: string | null
          pool_type?: string | null
          position_in_floor?: string | null
          price_excluding_vat?: number | null
          price_including_vat?: number | null
          price_per_sqm?: number | null
          private_garden_area?: number | null
          project_id?: string
          property_code?: string | null
          property_status?: string | null
          property_sub_type?: string | null
          property_type?: string
          public_description?: string | null
          referral_commission?: number | null
          referral_commission_rate?: number | null
          reservation_date?: string | null
          reservation_fee?: number | null
          roof_garden_area?: number | null
          sale_type?: string | null
          security_features?: Json | null
          smart_home_features?: Json | null
          sold_date?: string | null
          storage_area?: number | null
          storage_location?: string | null
          storage_spaces?: number | null
          terrace_area?: number | null
          terrace_count?: number | null
          title_deed_number?: string | null
          title_deed_status?: string | null
          total_covered_area?: number | null
          total_rooms?: number | null
          transfer_fee_amount?: number | null
          transfer_fee_percentage?: number | null
          uncovered_verandas?: number | null
          unit_number?: string
          updated_at?: string | null
          vat_amount?: number | null
          vat_rate?: number | null
          view_quality?: string | null
          view_type?: Json | null
          wall_finish?: string | null
          wc_count?: number | null
          windows_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_building_id_fkey"
            columns: ["building_id"]
            isOneToOne: false
            referencedRelation: "buildings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_developer_id_fkey"
            columns: ["developer_id"]
            isOneToOne: false
            referencedRelation: "developers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      registration_drafts: {
        Row: {
          auto_save_enabled: boolean
          created_at: string
          email_attempted: string | null
          form_data: Json
          id: string
          session_id: string
          updated_at: string
        }
        Insert: {
          auto_save_enabled?: boolean
          created_at?: string
          email_attempted?: string | null
          form_data?: Json
          id?: string
          session_id: string
          updated_at?: string
        }
        Update: {
          auto_save_enabled?: boolean
          created_at?: string
          email_attempted?: string | null
          form_data?: Json
          id?: string
          session_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      search_drafts: {
        Row: {
          auto_save_enabled: boolean
          created_at: string
          form_data: Json
          id: string
          session_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          auto_save_enabled?: boolean
          created_at?: string
          form_data?: Json
          id?: string
          session_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          auto_save_enabled?: boolean
          created_at?: string
          form_data?: Json
          id?: string
          session_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_access_leads: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      can_view_audit_logs: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      check_rate_limit: {
        Args: {
          p_limit?: number
          p_session_id?: string
          p_user_id?: string
          p_window_minutes?: number
        }
        Returns: boolean
      }
      cleanup_old_drafts: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_audit_logs: {
        Args: { p_limit?: number; p_offset?: number }
        Returns: {
          action: string
          admin_email: string
          admin_name: string
          admin_user_id: string
          created_at: string
          details: Json
          id: string
          ip_address: unknown
          resource_id: string
          resource_type: string
          seconds_ago: number
          user_agent: string
        }[]
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      log_admin_action: {
        Args: {
          p_action: string
          p_details?: Json
          p_resource_id?: string
          p_resource_type: string
        }
        Returns: undefined
      }
      upsert_ab_test_assignment: {
        Args: { p_test_id: string; p_user_session: string; p_variant: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
