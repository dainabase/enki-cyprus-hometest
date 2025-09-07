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
          building_type: string | null
          construction_status: string | null
          created_at: string | null
          energy_rating: string | null
          id: string
          name: string
          project_id: string | null
          total_floors: number | null
          total_units: number | null
          updated_at: string | null
        }
        Insert: {
          building_type?: string | null
          construction_status?: string | null
          created_at?: string | null
          energy_rating?: string | null
          id?: string
          name: string
          project_id?: string | null
          total_floors?: number | null
          total_units?: number | null
          updated_at?: string | null
        }
        Update: {
          building_type?: string | null
          construction_status?: string | null
          created_at?: string | null
          energy_rating?: string | null
          id?: string
          name?: string
          project_id?: string | null
          total_floors?: number | null
          total_units?: number | null
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
      developers: {
        Row: {
          commission_rate: number | null
          contact_info: Json | null
          created_at: string | null
          id: string
          logo: string | null
          name: string
          payment_terms: string | null
          status: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          commission_rate?: number | null
          contact_info?: Json | null
          created_at?: string | null
          id?: string
          logo?: string | null
          name: string
          payment_terms?: string | null
          status?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          commission_rate?: number | null
          contact_info?: Json | null
          created_at?: string | null
          id?: string
          logo?: string | null
          name?: string
          payment_terms?: string | null
          status?: string | null
          updated_at?: string | null
          website?: string | null
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
      projects: {
        Row: {
          amenities: string[] | null
          building_id: string | null
          commission_rate: number | null
          completion_date: string | null
          construction_phase: string | null
          construction_start: string | null
          created_at: string
          cyprus_zone: string | null
          description: string
          detailed_description: string | null
          detailed_features: string[] | null
          developer_id: string | null
          featured_property: boolean | null
          features: string[]
          floor_number: number | null
          furniture_status: string | null
          golden_visa_eligible: boolean | null
          id: string
          interests: Json[] | null
          livability: boolean | null
          location: Json
          map_image: string | null
          meta_description: string | null
          meta_title: string | null
          photos: string[]
          plans: string[] | null
          price: number
          price_from: string | null
          project_status: string | null
          reservation_status: string | null
          status: string
          subtitle: string | null
          title: string
          title_deed_status: string | null
          total_units: number | null
          transfer_fee: number | null
          translations: Json | null
          type: string
          unit_number: string | null
          units: Json[] | null
          units_available: number | null
          units_sold: number | null
          updated_at: string
          url_slug: string | null
          vat_rate: number | null
          video_url: string | null
          view_count: number | null
          virtual_tour: string | null
          virtual_tour_url: string | null
        }
        Insert: {
          amenities?: string[] | null
          building_id?: string | null
          commission_rate?: number | null
          completion_date?: string | null
          construction_phase?: string | null
          construction_start?: string | null
          created_at?: string
          cyprus_zone?: string | null
          description: string
          detailed_description?: string | null
          detailed_features?: string[] | null
          developer_id?: string | null
          featured_property?: boolean | null
          features?: string[]
          floor_number?: number | null
          furniture_status?: string | null
          golden_visa_eligible?: boolean | null
          id?: string
          interests?: Json[] | null
          livability?: boolean | null
          location: Json
          map_image?: string | null
          meta_description?: string | null
          meta_title?: string | null
          photos?: string[]
          plans?: string[] | null
          price: number
          price_from?: string | null
          project_status?: string | null
          reservation_status?: string | null
          status?: string
          subtitle?: string | null
          title: string
          title_deed_status?: string | null
          total_units?: number | null
          transfer_fee?: number | null
          translations?: Json | null
          type: string
          unit_number?: string | null
          units?: Json[] | null
          units_available?: number | null
          units_sold?: number | null
          updated_at?: string
          url_slug?: string | null
          vat_rate?: number | null
          video_url?: string | null
          view_count?: number | null
          virtual_tour?: string | null
          virtual_tour_url?: string | null
        }
        Update: {
          amenities?: string[] | null
          building_id?: string | null
          commission_rate?: number | null
          completion_date?: string | null
          construction_phase?: string | null
          construction_start?: string | null
          created_at?: string
          cyprus_zone?: string | null
          description?: string
          detailed_description?: string | null
          detailed_features?: string[] | null
          developer_id?: string | null
          featured_property?: boolean | null
          features?: string[]
          floor_number?: number | null
          furniture_status?: string | null
          golden_visa_eligible?: boolean | null
          id?: string
          interests?: Json[] | null
          livability?: boolean | null
          location?: Json
          map_image?: string | null
          meta_description?: string | null
          meta_title?: string | null
          photos?: string[]
          plans?: string[] | null
          price?: number
          price_from?: string | null
          project_status?: string | null
          reservation_status?: string | null
          status?: string
          subtitle?: string | null
          title?: string
          title_deed_status?: string | null
          total_units?: number | null
          transfer_fee?: number | null
          translations?: Json | null
          type?: string
          unit_number?: string | null
          units?: Json[] | null
          units_available?: number | null
          units_sold?: number | null
          updated_at?: string
          url_slug?: string | null
          vat_rate?: number | null
          video_url?: string | null
          view_count?: number | null
          virtual_tour?: string | null
          virtual_tour_url?: string | null
        }
        Relationships: [
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
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
