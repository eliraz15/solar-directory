import Link from "next/link";
import { CoverImage } from "@/components/cover-image";
import { TOPIC_LABELS, TOPIC_ORDER, TOPIC_BLURBS } from "@/lib/topics";
import { TOPIC_PHOTOS, TOPIC_PHOTO_ALT } from "@/lib/site-images";
import type { ArticleTopic } from "@/lib/supabase/types";

function guideCount(n: number) {
  if (n === 0) return "בקרוב";
  return n === 1 ? "מדריך אחד" : `${n} מדריכים`;
}

/**
 * The four topics as the four cells of one module: aluminium frame, hairline
 * mullions, glass over each cell. Hover sweeps a specular highlight across the
 * cell the way sun crosses a real panel.
 */
export function TopicModule({
  counts,
}: {
  counts: Record<ArticleTopic, number>;
}) {
  return (
    <div className="module grid-cols-1 sm:grid-cols-2">
      {TOPIC_ORDER.map((topic) => (
        <Link
          key={topic}
          href={`/madrichim?topic=${topic}`}
          className="cell group flex aspect-[16/10] items-end sm:aspect-[4/3]"
        >
          <CoverImage
            fallback={TOPIC_PHOTOS[topic]}
            alt={TOPIC_PHOTO_ALT[topic]}
            sizes="(max-width: 640px) 100vw, 50vw"
          />
          <div className="scrim-cell absolute inset-0 z-[2]" />
          <div className="relative z-[4] w-full p-5 sm:p-7">
            <h3 className="display text-[1.5rem] text-white sm:text-[1.75rem]">
              {TOPIC_LABELS[topic]}
            </h3>
            <p className="mt-1.5 max-w-[34ch] text-[0.9375rem] leading-snug text-white/75">
              {TOPIC_BLURBS[topic]}
            </p>
            <span className="unit mt-3 inline-block text-[0.6875rem] uppercase tracking-[0.14em] text-gold-500">
              {guideCount(counts[topic] ?? 0)}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
