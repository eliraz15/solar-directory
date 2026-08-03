// Generated via the Supabase MCP `generate_typescript_types` tool against
// the live schema (supabase/migrations/0001_init.sql). Re-run and paste
// over this file whenever the schema changes - the only hand-edits are
// the `FaqItem[]` overrides on `faq_items` (generated as generic `Json`)
// and the convenience aliases at the bottom.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface FaqItem {
  question: string
  answer: string
}

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      admin_profiles: {
        Row: {
          created_at: string
          is_suspended: boolean
          role: Database["public"]["Enums"]["admin_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          is_suspended?: boolean
          role?: Database["public"]["Enums"]["admin_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          is_suspended?: boolean
          role?: Database["public"]["Enums"]["admin_role"]
          user_id?: string
        }
        Relationships: []
      }
      articles: {
        Row: {
          content: string
          created_at: string
          excerpt: string | null
          faq_items: FaqItem[]
          id: string
          meta_description: string | null
          published_at: string | null
          related_category_id: string | null
          slug: string
          status: Database["public"]["Enums"]["article_status"]
          title: string
          updated_at: string
        }
        Insert: {
          content?: string
          created_at?: string
          excerpt?: string | null
          faq_items?: FaqItem[]
          id?: string
          meta_description?: string | null
          published_at?: string | null
          related_category_id?: string | null
          slug: string
          status?: Database["public"]["Enums"]["article_status"]
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          excerpt?: string | null
          faq_items?: FaqItem[]
          id?: string
          meta_description?: string | null
          published_at?: string | null
          related_category_id?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["article_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "articles_related_category_id_fkey"
            columns: ["related_category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      banner_events: {
        Row: {
          banner_id: string
          created_at: string
          event_type: Database["public"]["Enums"]["banner_event_type"]
          id: string
          page_path: string | null
        }
        Insert: {
          banner_id: string
          created_at?: string
          event_type: Database["public"]["Enums"]["banner_event_type"]
          id?: string
          page_path?: string | null
        }
        Update: {
          banner_id?: string
          created_at?: string
          event_type?: Database["public"]["Enums"]["banner_event_type"]
          id?: string
          page_path?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "banner_events_banner_id_fkey"
            columns: ["banner_id"]
            isOneToOne: false
            referencedRelation: "banners"
            referencedColumns: ["id"]
          },
        ]
      }
      banners: {
        Row: {
          category_id: string | null
          created_at: string
          ends_at: string | null
          id: string
          image_url: string
          is_active: boolean
          link_url: string
          placement: Database["public"]["Enums"]["banner_placement"]
          starts_at: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          ends_at?: string | null
          id?: string
          image_url: string
          is_active?: boolean
          link_url: string
          placement: Database["public"]["Enums"]["banner_placement"]
          starts_at?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string
          ends_at?: string | null
          id?: string
          image_url?: string
          is_active?: boolean
          link_url?: string
          placement?: Database["public"]["Enums"]["banner_placement"]
          starts_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "banners_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_exclusive: boolean
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_exclusive?: boolean
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_exclusive?: boolean
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      professionals: {
        Row: {
          category_id: string
          created_at: string
          description: string | null
          disclosure_text: string | null
          id: string
          is_active: boolean
          is_house_brand: boolean
          logo_url: string | null
          name: string
          phone: string | null
          service_areas: string | null
          slot_position: number | null
          slug: string
          updated_at: string
          website: string | null
          whatsapp: string | null
        }
        Insert: {
          category_id: string
          created_at?: string
          description?: string | null
          disclosure_text?: string | null
          id?: string
          is_active?: boolean
          is_house_brand?: boolean
          logo_url?: string | null
          name: string
          phone?: string | null
          service_areas?: string | null
          slot_position?: number | null
          slug: string
          updated_at?: string
          website?: string | null
          whatsapp?: string | null
        }
        Update: {
          category_id?: string
          created_at?: string
          description?: string | null
          disclosure_text?: string | null
          id?: string
          is_active?: boolean
          is_house_brand?: boolean
          logo_url?: string | null
          name?: string
          phone?: string | null
          service_areas?: string | null
          slot_position?: number | null
          slug?: string
          updated_at?: string
          website?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "professionals_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_active_admin: { Args: never; Returns: boolean }
      is_owner: { Args: never; Returns: boolean }
    }
    Enums: {
      admin_role: "owner" | "editor"
      article_status: "draft" | "published"
      banner_event_type: "impression" | "click"
      banner_placement:
        | "article_inline"
        | "sidebar"
        | "category_top"
        | "homepage"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Convenience aliases used across the app instead of the verbose
// Database["public"]["Enums"][...] path.
export type ArticleStatus = Database["public"]["Enums"]["article_status"]
export type BannerPlacement = Database["public"]["Enums"]["banner_placement"]
export type BannerEventType = Database["public"]["Enums"]["banner_event_type"]
export type AdminRole = Database["public"]["Enums"]["admin_role"]
