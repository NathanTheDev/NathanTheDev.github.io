// Continues TraceLines' five lines down through GallerySection — same
// 1440-wide coordinate space, picking up at the exact x each one ended on
// (400 / 414 / 428 / 850 / 874). Different jog depths than AboutSection's
// so the pattern doesn't repeat identically section to section. Full
// opacity throughout — ContactTraceLines carries these on again and is
// where the fade-out at the very end of the page lives.
//
// The sm:hidden group mirrors TraceLines' mobile compensation (see the
// comment there) — same widened dx and baseline spacing so the lines stay
// visibly diagonal and separated instead of collapsing under the
// horizontal squash preserveAspectRatio="none" applies on narrow
// viewports. Its baseline picks up at TraceLines' mobile end x (400 / 452
// / 504 / 824 / 912), same as the desktop group does at its own end x.
export default function GalleryTraceLines({ className = "" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 1000"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    >
      <g stroke="#ffffff" strokeOpacity="0.2" strokeWidth="2" fill="none" className="hidden sm:block">
        <path d="M400,0 L400,200 L392,235 L392,600 L400,635 L400,1000" />
        <path d="M414,0 L414,450 L422,485 L422,850 L414,885 L414,1000" />
        <path d="M428,0 L428,100 L420,135 L420,750 L428,785 L428,1000" />
        <path d="M850,0 L850,350 L858,385 L858,1000" />
        <path d="M874,0 L874,150 L866,185 L866,700 L874,735 L874,1000" />
      </g>
      <g stroke="#ffffff" strokeOpacity="0.2" strokeWidth="2" fill="none" className="sm:hidden">
        <path d="M400,0 L400,200 L370,235 L370,600 L400,635 L400,1000" />
        <path d="M452,0 L452,450 L482,485 L482,850 L452,885 L452,1000" />
        <path d="M504,0 L504,100 L474,135 L474,750 L504,785 L504,1000" />
        <path d="M824,0 L824,350 L854,385 L854,1000" />
        <path d="M912,0 L912,150 L882,185 L882,700 L912,735 L912,1000" />
      </g>
    </svg>
  );
}
