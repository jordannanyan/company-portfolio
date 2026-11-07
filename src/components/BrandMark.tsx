type BrandMarkProps = {
  className?: string;
  /** Color of the "bt" letterform. */
  ink?: string;
  /** Color of the pencil cone. */
  accent?: string;
  title?: string;
};

/**
 * "bt" ligature: one stem shared by the t (crossbar) and the b (bowl),
 * topped with a pencil tip. Source artwork lives in ../brand/.
 */
export default function BrandMark({
  className,
  ink = "#FFFFFF",
  accent = "#FFC83D",
  title,
}: BrandMarkProps) {
  return (
    <svg
      viewBox="76 80 360 360"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <g transform="translate(14 2)">
        <path d="M174 140 L226 140 L200 88 Z" fill={accent} />
        <path d="M200 88 L193 102 L207 102 Z" fill={ink} />
        <line x1="200" y1="148" x2="200" y2="330" stroke={ink} strokeWidth="52" />
        <line
          x1="140"
          y1="192"
          x2="288"
          y2="192"
          stroke={ink}
          strokeWidth="52"
          strokeLinecap="round"
        />
        <circle cx="270" cy="330" r="70" fill="none" stroke={ink} strokeWidth="52" />
      </g>
    </svg>
  );
}
