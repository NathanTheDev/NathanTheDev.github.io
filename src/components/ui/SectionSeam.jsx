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

      {/* Grey trace lines wind up out of the fill near the left/right
          margins and hand off — same x anchors (86 / 1354 in this same
          1440-wide coordinate space) and same stroke styling — to
          ZigzagTrace's continuation of them down through AboutSection. */}
      <g stroke="#ffffff" strokeOpacity="0.2" strokeWidth="2" fill="none">
        <path d="M86,60 L102,75 L70,90 L86,100" />
        <path d="M1354,60 L1338,75 L1370,90 L1354,100" />
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
