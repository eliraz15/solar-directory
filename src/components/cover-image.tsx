import Image, { type StaticImageData } from "next/image";

/**
 * Fills its parent (which must be positioned). `src` is an admin-uploaded URL
 * when one exists; otherwise the site's own photograph for that subject is used,
 * so a card is never left without an image.
 */
export function CoverImage({
  src,
  fallback,
  alt,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  priority = false,
  className = "",
}: {
  src?: string | null;
  fallback: StaticImageData;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const common = {
    sizes,
    priority,
    className: `object-cover ${className}`,
  };

  if (src) {
    return <Image {...common} alt={alt} src={src} fill />;
  }

  return <Image {...common} alt={alt} src={fallback} fill placeholder="blur" />;
}
