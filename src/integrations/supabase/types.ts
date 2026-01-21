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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          exam_type: string
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          exam_type: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          exam_type?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      current_affairs: {
        Row: {
          created_at: string | null
          id: string
          questions: Json
          updated_at: string | null
          upload_date: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          questions: Json
          updated_at?: string | null
          upload_date: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          questions?: Json
          updated_at?: string | null
          upload_date?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_graphs: {
        Row: {
          created_at: string | null
          file_url: string | null
          html_content: Json
          id: string
          title: string | null
          updated_at: string | null
          upload_date: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          file_url?: string | null
          html_content: Json
          id?: string
          title?: string | null
          updated_at?: string | null
          upload_date: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          file_url?: string | null
          html_content?: Json
          id?: string
          title?: string | null
          updated_at?: string | null
          upload_date?: string
          user_id?: string
        }
        Relationships: []
      }
      test_sets_consolidated: {
        Row: {
          category_id: string
          created_at: string | null
          duration_minutes: number
          id: string
          is_active: boolean | null
          negative_marks: number | null
          positive_marks: number | null
          questions: Json | null
          series_description: string | null
          series_icon: string | null
          series_name: string
          series_order: number | null
          set_name: string
          set_order: number | null
          updated_at: string | null
          year: string
          year_order: number | null
        }
        Insert: {
          category_id: string
          created_at?: string | null
          duration_minutes: number
          id?: string
          is_active?: boolean | null
          negative_marks?: number | null
          positive_marks?: number | null
          questions?: Json | null
          series_description?: string | null
          series_icon?: string | null
          series_name: string
          series_order?: number | null
          set_name: string
          set_order?: number | null
          updated_at?: string | null
          year: string
          year_order?: number | null
        }
        Update: {
          category_id?: string
          created_at?: string | null
          duration_minutes?: number
          id?: string
          is_active?: boolean | null
          negative_marks?: number | null
          positive_marks?: number | null
          questions?: Json | null
          series_description?: string | null
          series_icon?: string | null
          series_name?: string
          series_order?: number | null
          set_name?: string
          set_order?: number | null
          updated_at?: string | null
          year?: string
          year_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "test_sets_consolidated_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      topicwise: {
        Row: {
          created_at: string | null
          id: string
          questions: Json
          updated_at: string | null
          upload_date: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          questions: Json
          updated_at?: string | null
          upload_date: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          questions?: Json
          updated_at?: string | null
          upload_date?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_test_attempts: {
        Row: {
          answers: Json | null
          attempted_questions: number | null
          created_at: string | null
          end_time: string | null
          id: string
          score: number | null
          start_time: string | null
          status: string
          test_set_id: string
          time_remaining_seconds: number | null
          total_questions: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          answers?: Json | null
          attempted_questions?: number | null
          created_at?: string | null
          end_time?: string | null
          id?: string
          score?: number | null
          start_time?: string | null
          status?: string
          test_set_id: string
          time_remaining_seconds?: number | null
          total_questions?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          answers?: Json | null
          attempted_questions?: number | null
          created_at?: string | null
          end_time?: string | null
          id?: string
          score?: number | null
          start_time?: string | null
          status?: string
          test_set_id?: string
          time_remaining_seconds?: number | null
          total_questions?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_test_attempts_test_set_id_fkey"
            columns: ["test_set_id"]
            isOneToOne: false
            referencedRelation: "test_sets_consolidated"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_test_attempts_test_set_id_fkey"
            columns: ["test_set_id"]
            isOneToOne: false
            referencedRelation: "test_sets_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_test_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          exam_preparing_for: string | null
          full_name: string
          id: string
          mobile_number: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          exam_preparing_for?: string | null
          full_name: string
          id: string
          mobile_number: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          exam_preparing_for?: string | null
          full_name?: string
          id?: string
          mobile_number?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      test_sets_safe: {
        Row: {
          category_id: string | null
          created_at: string | null
          duration_minutes: number | null
          id: string | null
          is_active: boolean | null
          negative_marks: number | null
          positive_marks: number | null
          questions: Json | null
          series_description: string | null
          series_icon: string | null
          series_name: string | null
          series_order: number | null
          set_name: string | null
          set_order: number | null
          updated_at: string | null
          year: string | null
          year_order: number | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string | null
          is_active?: boolean | null
          negative_marks?: number | null
          positive_marks?: number | null
          questions?: never
          series_description?: string | null
          series_icon?: string | null
          series_name?: string | null
          series_order?: number | null
          set_name?: string | null
          set_order?: number | null
          updated_at?: string | null
          year?: string | null
          year_order?: number | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string | null
          is_active?: boolean | null
          negative_marks?: number | null
          positive_marks?: number | null
          questions?: never
          series_description?: string | null
          series_icon?: string | null
          series_name?: string | null
          series_order?: number | null
          set_name?: string | null
          set_order?: number | null
          updated_at?: string | null
          year?: string | null
          year_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "test_sets_consolidated_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      get_test_questions_safe: { Args: { test_set_id: string }; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { user_uuid: string }; Returns: boolean }
      validate_and_score_test: {
        Args: { p_answers: Json; p_attempt_id: string }
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
