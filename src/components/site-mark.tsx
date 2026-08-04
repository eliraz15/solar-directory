/** Sun over a module in perspective — the two objects the whole site is about. */
export function SiteMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <circle cx="16" cy="11" r="6.5" fill="var(--gold-500)" />
      <path
        d="M4 27.5 L10.5 20.5 L27.5 20.5 L23 27.5 Z"
        fill="currentColor"
        opacity="0.92"
      />
      <path
        d="M13.4 20.5 L11.2 27.5 M18.4 20.5 L17.4 27.5"
        stroke="var(--background)"
        strokeWidth="1.1"
        opacity="0.7"
      />
    </svg>
  );
}

export function Wordmark({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <span dir="ltr" className="flex items-center gap-2">
      <SiteMark
        className={`h-7 w-7 ${tone === "light" ? "text-white" : "text-heading"}`}
      />
      <span className="display text-[1.35rem] leading-none tracking-tight">
        <span className={tone === "light" ? "text-white" : "text-heading"}>
          solar
        </span>
        <span className="text-gold-500">.org.il</span>
      </span>
    </span>
  );
}
