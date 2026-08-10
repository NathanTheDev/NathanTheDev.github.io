// Continues SectionSeam's two grey trace lines down through AboutSection —
// same 1440-wide coordinate space and x anchors (86 / 1354) as that seam so
// the hand-off at y=0 lines up pixel-for-pixel regardless of viewport
// width. Fades out before the section's lower third so it reads as a trace
// trailing off rather than an abrupt cut.
export default function ZigzagTrace({ className = "" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 1400"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    >
      <defs>
        <linearGradient id="zigzag-trace-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="60%" stopColor="#fff" stopOpacity="1" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="zigzag-trace-mask">
          <rect x="0" y="0" width="1440" height="1400" fill="url(#zigzag-trace-fade)" />
        </mask>
      </defs>
      <g stroke="#ffffff" strokeOpacity="0.2" strokeWidth="2" fill="none" mask="url(#zigzag-trace-mask)">
        <path d="M86,0 L126,70 L46,140 L126,210 L46,280 L126,350 L46,420 L126,490 L46,560 L126,630 L46,700 L126,770 L46,840 L126,910 L46,980 L126,1050 L46,1120 L126,1190 L46,1260 L126,1330 L46,1400" />
        <path d="M1354,0 L1314,70 L1394,140 L1314,210 L1394,280 L1314,350 L1394,420 L1314,490 L1394,560 L1314,630 L1394,700 L1314,770 L1394,840 L1314,910 L1394,980 L1314,1050 L1394,1120 L1314,1190 L1394,1260 L1314,1330 L1394,1400" />
      </g>
    </svg>
  );
}
