// Jagged "torn" boundary at the Hero/About seam — same two tones already in
// use there (surface black over the hero's bright vignette), just a more
// detailed edge than a flat gradient cut. Purely decorative overlay, no
// layout impact.
export default function SectionSeam({ className = "" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 100"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-x-0 bottom-0 z-[6] w-full ${className}`}
    >
      <path
        fill="var(--color-surface)"
        d="M0,78 L100,78 L124,40 L148,78 L230,78 L250,10 L266,50 L280,78 L350,78 L368,60 L382,78 L460,78 L480,55 L494,78 L560,78 L578,18 L592,78 L650,78 L668,36 L686,78 L760,78 L774,58 L784,40 L794,60 L806,78 L900,78 L916,66 L924,76 L932,60 L940,76 L948,66 L958,78 L1010,78 L1024,63 L1038,78 L1080,78 L1098,45 L1114,78 L1150,78 L1168,52 L1186,78 L1240,78 L1256,12 L1272,78 L1440,78 L1440,100 L0,100 Z"
      />

      {/* Scanline texture on the black fill — same x positions (in this same
          1440-wide coordinate space) as TraceLines' continuation of them
          down through AboutSection. Straight down to y=100 (the section's
          bottom edge) so it touches TraceLines' y=0 start with no dead gap
          — the diagonal jogs only start once TraceLines has room for them.
          Two variants, swapped by breakpoint rather than media-queried
          coordinates, because the x positions themselves differ (see the
          mobile-spacing comment in TraceLines) — not just their styling. */}
      <g stroke="#ffffff" strokeOpacity="0.2" strokeWidth="2" className="hidden sm:block">
        <line x1="400" y1="84" x2="400" y2="100" />
        <line x1="414" y1="84" x2="414" y2="100" />
        <line x1="428" y1="84" x2="428" y2="100" />
        <line x1="860" y1="84" x2="860" y2="100" />
        <line x1="874" y1="84" x2="874" y2="100" />
      </g>
      <g stroke="#ffffff" strokeOpacity="0.2" strokeWidth="2" className="sm:hidden">
        <line x1="400" y1="84" x2="400" y2="100" />
        <line x1="452" y1="84" x2="452" y2="100" />
        <line x1="504" y1="84" x2="504" y2="100" />
        <line x1="860" y1="84" x2="860" y2="100" />
        <line x1="912" y1="84" x2="912" y2="100" />
      </g>

      {/* Debris flecks breaking off a few of the spikes, sitting in the
          bright zone above the fill. */}
      <g fill="var(--color-surface)" opacity="0.5">
        <rect x="268" y="24" width="3" height="10" />
        <rect x="672" y="20" width="3" height="10" />
        <rect x="1274" y="26" width="3" height="9" />
      </g>
    </svg>
  );
}
