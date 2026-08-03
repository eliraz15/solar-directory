// Hand-written to match supabase/migrations/0001_init.sql, following the
// shape @supabase/postgrest-js's GenericSchema expects (Relationships /
// Views / Functions must be present, even empty, or Row types resolve to
// `never`). Replace with `generate_typescript_types` output once the
// Supabase project exists and this migration has been applied.

export type ArticleStatus = "draft" | "published";
export type BannerPlacement =
  | "article_inline"
  | "sidebar"
  | "category_top"
  | "homepage";
export type BannerEventType = "impression" | "click";
export type AdminRole = "owner" | "editor";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          sort_order: number;
          is_exclusive: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          sort_order?: number;
          is_exclusive?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>;
        Relationships: [];
      };
      professionals: {
        Row: {
          id: string;
          category_id: string;
          name: string;
          slug: string;
          description: string | null;
          logo_url: string | null;
          phone: string | null;
          whatsapp: string | null;
          website: string | null;
          service_areas: string | null;
          is_active: boolean;
          slot_position: number | null;
          is_house_brand: boolean;
          disclosure_text: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          name: string;
          slug: string;
          description?: string | null;
          logo_url?: string | null;
          phone?: string | null;
          whatsapp?: string | null;
          website?: string | null;
          service_areas?: string | null;
          is_active?: boolean;
          slot_position?: number | null;
          is_house_brand?: boolean;
          disclosure_text?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["professionals"]["Insert"]>;
        Relationships: [];
      };
      articles: {
        Row: {
          id: string;
          slug: string;
          title: string;
          content: string;
          excerpt: string | null;
          meta_description: string | null;
          related_category_id: string | null;
          status: ArticleStatus;
          faq_items: FaqItem[];
          published_at: string | null;
          updated_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          content?: string;
          excerpt?: string | null;
          meta_description?: string | null;
          related_category_id?: string | null;
          status?: ArticleStatus;
          faq_items?: FaqItem[];
          published_at?: string | null;
          updated_at?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["articles"]["Insert"]>;
        Relationships: [];
      };
      banners: {
        Row: {
          id: string;
          image_url: string;
          link_url: string;
          placement: BannerPlacement;
          category_id: string | null;
          starts_at: string | null;
          ends_at: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          image_url: string;
          link_url: string;
          placement: BannerPlacement;
          category_id?: string | null;
          starts_at?: string | null;
          ends_at?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["banners"]["Insert"]>;
        Relationships: [];
      };
      banner_events: {
        Row: {
          id: string;
          banner_id: string;
          event_type: BannerEventType;
          page_path: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          banner_id: string;
          event_type: BannerEventType;
          page_path?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["banner_events"]["Insert"]>;
        Relationships: [];
      };
      admin_profiles: {
        Row: {
          user_id: string;
          role: AdminRole;
          is_suspended: boolean;
          created_at: string;
        };
        Insert: {
          user_id: string;
          role?: AdminRole;
          is_suspended?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["admin_profiles"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
