export function CoverImage({
  src,
  icon,
  alt,
  className,
}: {
  src?: string | null;
  icon: string;
  alt: string;
  className?: string;
}) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className={`object-cover ${className ?? ""}`} />
    );
  }

  return (
    <div className={`hero-gradient flex items-center justify-center ${className ?? ""}`}>
      <span className="text-4xl">{icon}</span>
    </div>
  );
}
