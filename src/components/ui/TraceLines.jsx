// Continues SectionSeam's scanline ticks down through AboutSection — same
// 1440-wide coordinate space and x positions as that seam so the hand-off
// at y=0 lines up pixel-for-pixel regardless of viewport width. Mostly
// vertical, with one or two small diagonal jogs at staggered heights per
// line so they read as traces rather than a ruled grid. Stays at full
// opacity all the way down (no fade-out here) — GalleryTraceLines picks
// each line up at the exact x it ends on and keeps it going, and the
// fade only happens at the very end of the page, in ContactTraceLines.
//
// preserveAspectRatio="none" stretches this 1440-wide viewBox to whatever
// the actual container width is, independently of its (roughly
// viewport-height-sized) vertical stretch. On a ~400px phone that's a
// horizontal squash of ~0.27x against a vertical squash of ~0.55x — every
// dx in the paths below reads at under half the angle it does on a ~1440px
// desktop, and the three/two-line clusters (14 and 24 raw units apart)
// collapse to a few px, reading as one line rather than a bundle of
// traces. The sm:hidden group re-derives the same shapes with dx values
// (both the jog depths and the baseline spacing between lines in a
// cluster) scaled up by roughly the inverse of that squash ratio, so the
// on-screen angle and spacing land close to what the desktop group already
// gets "for free" from its near-1:1 aspect ratio. Every downstream file in
// this chain (GalleryTraceLines, ContactTraceLines) picks up each line at
// the exact x it ends on here, so their sm:hidden groups have to carry the
// same widened baseline forward.
export default function TraceLines({ className = "" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 1400"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    >
      <g stroke="#ffffff" strokeOpacity="0.2" strokeWidth="2" fill="none" className="hidden sm:block">
        <path d="M400,0 L400,300 L410,340 L410,700 L400,740 L400,1400" />
        <path d="M414,0 L414,550 L404,600 L404,1000 L414,1040 L414,1400" />
        <path d="M428,0 L428,150 L438,190 L438,900 L428,940 L428,1400" />
        <path d="M860,0 L860,400 L850,450 L850,1400" />
        <path d="M874,0 L874,250 L884,300 L884,800 L874,850 L874,1400" />
      </g>
      <g stroke="#ffffff" strokeOpacity="0.2" strokeWidth="2" fill="none" className="sm:hidden">
        <path d="M400,0 L400,300 L436,340 L436,700 L400,740 L400,1400" />
        <path d="M452,0 L452,550 L416,600 L416,1000 L452,1040 L452,1400" />
        <path d="M504,0 L504,150 L540,190 L540,900 L504,940 L504,1400" />
        <path d="M860,0 L860,400 L824,450 L824,1400" />
        <path d="M912,0 L912,250 L948,300 L948,800 L912,850 L912,1400" />
      </g>
    </svg>
  );
}
