import type { StaticImageData } from "next/image";
import type { ArticleTopic } from "@/lib/supabase/types";

import roofSunrise from "../../public/images/roof-sunrise.jpg";
import panelRowsDusk from "../../public/images/panel-rows-dusk.jpg";
import panelDroplets from "../../public/images/panel-droplets.jpg";
import installersRoof from "../../public/images/installers-roof.jpg";
import installerPortrait from "../../public/images/installer-portrait.jpg";

import topicProduction from "../../public/images/topic-production.jpg";
import production2 from "../../public/images/production-2.jpg";
import production3 from "../../public/images/production-3.jpg";

import topicMaintenance from "../../public/images/topic-maintenance.jpg";
import maintenance2 from "../../public/images/maintenance-2.jpg";

import topicEconomics from "../../public/images/topic-economics.jpg";
import economics2 from "../../public/images/economics-2.jpg";
import economics3 from "../../public/images/economics-3.jpg";

import topicTroubleshooting from "../../public/images/topic-troubleshooting.jpg";
import troubleshooting2 from "../../public/images/troubleshooting-2.jpg";
import troubleshooting3 from "../../public/images/troubleshooting-3.jpg";

export const PHOTOS = {
  roofSunrise,
  panelRowsDusk,
  panelDroplets,
  installersRoof,
  installerPortrait,
};

/**
 * Several photographs per topic. The first is the canonical one used on the
 * topic module; article covers are spread across the set so a run of guides on
 * the same topic doesn't repeat one image down the page.
 */
const TOPIC_PHOTO_SETS: Record<ArticleTopic, StaticImageData[]> = {
  production: [topicProduction, production2, production3],
  maintenance: [topicMaintenance, panelDroplets, maintenance2],
  economics: [topicEconomics, economics2, economics3],
  troubleshooting: [
    topicTroubleshooting,
    troubleshooting2,
    troubleshooting3,
  ],
};

export const TOPIC_PHOTOS: Record<ArticleTopic, StaticImageData> = {
  production: TOPIC_PHOTO_SETS.production[0],
  maintenance: TOPIC_PHOTO_SETS.maintenance[0],
  economics: TOPIC_PHOTO_SETS.economics[0],
  troubleshooting: TOPIC_PHOTO_SETS.troubleshooting[0],
};

/** Alt text describes the photograph, not the name of the topic. */
export const TOPIC_PHOTO_ALT: Record<ArticleTopic, string> = {
  production: "פאנלים סולאריים משקפים שמי תכלת על גג מבנה",
  maintenance: "פאנל סולארי מלוכלך עם פסי אבק ומים",
  economics: "בית מגורים עם מערכת סולארית על הגג",
  troubleshooting: "טכנאי עם כפפות עבודה מטפל בפאנל סולארי",
};

function hash(value: string) {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) {
    h = (h * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/**
 * Stable per-article photo: the same slug always resolves to the same image,
 * so covers don't shuffle between renders.
 */
export function getArticlePhoto(
  topic: ArticleTopic | string | null | undefined,
  slug: string,
): StaticImageData {
  const set = TOPIC_PHOTO_SETS[topic as ArticleTopic];
  if (!set) return panelDroplets;
  return set[hash(slug) % set.length];
}

export const CATEGORY_PHOTOS: Record<string, StaticImageData> = {
  matkinim: installersRoof,
  chashmalaim: topicTroubleshooting,
  "nikuy-tachzuka": topicMaintenance,
  "yiutz-energia": topicEconomics,
  nitur: topicProduction,
};

export function getCategoryPhoto(slug: string): StaticImageData {
  return CATEGORY_PHOTOS[slug] ?? topicProduction;
}
