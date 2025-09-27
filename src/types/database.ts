export interface Database {
  public: {
    Tables: {
      urls: {
        Row: {
          id: string
          original_url: string
          short_code: string
          custom_alias: string | null
          click_count: number
          created_at: string
          expires_at: string | null
          is_active: boolean
          user_ip: string | null
          user_agent: string | null
        }
        Insert: {
          id?: string
          original_url: string
          short_code: string
          custom_alias?: string | null
          click_count?: number
          created_at?: string
          expires_at?: string | null
          is_active?: boolean
          user_ip?: string | null
          user_agent?: string | null
        }
        Update: {
          id?: string
          original_url?: string
          short_code?: string
          custom_alias?: string | null
          click_count?: number
          created_at?: string
          expires_at?: string | null
          is_active?: boolean
          user_ip?: string | null
          user_agent?: string | null
        }
      }
      clicks: {
        Row: {
          id: string
          url_id: string
          clicked_at: string
          user_ip: string | null
          user_agent: string | null
          referer: string | null
          country: string | null
          city: string | null
        }
        Insert: {
          id?: string
          url_id: string
          clicked_at?: string
          user_ip?: string | null
          user_agent?: string | null
          referer?: string | null
          country?: string | null
          city?: string | null
        }
        Update: {
          id?: string
          url_id?: string
          clicked_at?: string
          user_ip?: string | null
          user_agent?: string | null
          referer?: string | null
          country?: string | null
          city?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_click_count: {
        Args: {
          url_id_param: string
        }
        Returns: void
      }
      is_url_expired: {
        Args: {
          expires_at_param: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Url = Database['public']['Tables']['urls']['Row']
export type UrlInsert = Database['public']['Tables']['urls']['Insert']
export type UrlUpdate = Database['public']['Tables']['urls']['Update']

export type Click = Database['public']['Tables']['clicks']['Row']
export type ClickInsert = Database['public']['Tables']['clicks']['Insert']
