import { pickBanner } from "@/lib/banners";
import { BannerImpressionPing } from "@/components/banner-impression-ping";
import type { BannerPlacement } from "@/lib/supabase/types";

export async function BannerDisplay({
  placement,
  categoryId,
  pagePath,
  className,
}: {
  placement: BannerPlacement;
  categoryId?: string | null;
  pagePath: string;
  className?: string;
}) {
  const banner = await pickBanner(placement, categoryId);
  if (!banner) return null;

  return (
    <div className={className}>
      <BannerImpressionPing bannerId={banner.id} pagePath={pagePath} />
      <a
        href={`/api/banner-click/${banner.id}?from=${encodeURIComponent(pagePath)}`}
        rel="sponsored noopener"
        className="block"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={banner.image_url} alt="" className="w-full rounded-xl object-cover shadow-sm" />
      </a>
    </div>
  );
}
