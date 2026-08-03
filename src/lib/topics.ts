import type { ArticleTopic, Database } from "@/lib/supabase/types";

type SiteSettingsRow = Database["public"]["Tables"]["site_settings"]["Row"];

export const TOPIC_LABELS: Record<ArticleTopic, string> = {
  production: "ייצור והספק",
  maintenance: "ניקיון ותחזוקה",
  economics: "חיסכון וכלכלה",
  troubleshooting: "תקלות ופתרונות",
};

export const TOPIC_ICONS: Record<ArticleTopic, string> = {
  production: "☀️",
  maintenance: "🧹",
  economics: "💰",
  troubleshooting: "⚡",
};

export const TOPIC_ORDER: ArticleTopic[] = [
  "production",
  "maintenance",
  "economics",
  "troubleshooting",
];

export function getTopicImage(
  settings: SiteSettingsRow | null | undefined,
  topic: ArticleTopic,
): string | null {
  if (!settings) return null;
  switch (topic) {
    case "production":
      return settings.topic_production_image_url;
    case "maintenance":
      return settings.topic_maintenance_image_url;
    case "economics":
      return settings.topic_economics_image_url;
    case "troubleshooting":
      return settings.topic_troubleshooting_image_url;
  }
}
