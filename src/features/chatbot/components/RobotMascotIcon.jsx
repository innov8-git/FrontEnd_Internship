import { cn } from '@/shared/utils/cn';

/**
 * High-precision vector SVG of the ALFRE AI Robot Mascot.
 * Faithfully matches the user's mascot character (antenna, rounded head,
 * side ear caps, pill visor with circular eyes, and tapered body with 'AI').
 *
 * Designed for professional clarity at any resolution with zero raster blur.
 */
export function RobotMascotIcon({
  className,
  variant = 'light', // 'light' (white robot for colored/dark buttons) | 'dark' (original black robot)
  size = 32,
}) {
  const isLight = variant === 'light';

  // Palette tokens
  const bodyFill = isLight ? '#ffffff' : '#0f172a';
  const visorFill = isLight ? '#0f172a' : '#ffffff';
  const eyeFill = isLight ? '#38bdf8' : '#0f172a'; // glowing tech cyan or dark
  const textFill = isLight ? '#0f172a' : '#ffffff';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 115"
      width={size}
      height={size}
      className={cn('shrink-0 drop-shadow-sm', className)}
      aria-hidden="true"
    >
      {/* ── Antenna ── */}
      {/* Ball */}
      <circle cx="50" cy="7" r="4.5" fill={bodyFill} />
      {/* Stem */}
      <rect x="48.5" y="11" width="3" height="7.5" rx="1.5" fill={bodyFill} />
      {/* Triangular Base Connector */}
      <path d="M43 18.5 h14 l-2.5 4 h-9 z" fill={bodyFill} />

      {/* ── Head ── */}
      {/* Main Head Ellipse */}
      <ellipse cx="50" cy="38" rx="27" ry="22.5" fill={bodyFill} />
      {/* Left Ear Cap */}
      <rect x="19.5" y="31.5" width="6" height="13" rx="3" fill={bodyFill} />
      {/* Right Ear Cap */}
      <rect x="74.5" y="31.5" width="6" height="13" rx="3" fill={bodyFill} />

      {/* ── Face Visor ── */}
      <rect x="31" y="28.5" width="38" height="19" rx="9.5" fill={visorFill} />
      {/* Eyes */}
      <circle cx="42" cy="38" r="4" fill={eyeFill} />
      <circle cx="58" cy="38" r="4" fill={eyeFill} />
      {/* Subtle eye gleams */}
      {isLight ? (
        <>
          <circle cx="43.2" cy="36.8" r="1.2" fill="#ffffff" opacity="0.8" />
          <circle cx="59.2" cy="36.8" r="1.2" fill="#ffffff" opacity="0.8" />
        </>
      ) : null}

      {/* ── Body (Floating Torso) ── */}
      <path
        d="M34.5 66 c-2.8 0 -4.8 3.2 -3.4 7.2 c2.6 7.8 8.8 19.8 18.9 19.8 s16.3 -12 18.9 -19.8 c1.4 -4 -0.6 -7.2 -3.4 -7.2 h-31 z"
        fill={bodyFill}
      />

      {/* ── "AI" Vector Lettering on Body ── */}
      {/* Vector 'A' */}
      <path
        d="M42 85.5 L46.5 73.5 H49 L53.5 85.5 H50.8 L49.9 82.8 H45.6 L44.7 85.5 H42 Z M46.3 80.6 H49.2 L47.75 76 Z"
        fill={textFill}
      />
      {/* Vector 'I' */}
      <path d="M55.5 73.5 H58.2 V85.5 H55.5 Z" fill={textFill} />
    </svg>
  );
}

export default RobotMascotIcon;

