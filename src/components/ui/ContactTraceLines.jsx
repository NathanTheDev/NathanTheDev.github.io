// Final leg of the trace lines that started at the Hero/About seam — picks
// each one up at the exact x GalleryTraceLines ended on (400 / 414 / 428 /
// 858 / 874) and carries it through ContactSection, which is the last
// section on the page. This is the only one of the four trace pieces that
// fades out, since there's nothing after it to hand off to.
export default function ContactTraceLines({ className = "" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 1000"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    >
      <defs>
        <linearGradient id="contact-trace-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="65%" stopColor="#fff" stopOpacity="1" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="contact-trace-mask">
          <rect x="0" y="0" width="1440" height="1000" fill="url(#contact-trace-fade)" />
        </mask>
      </defs>
      <g stroke="#ffffff" strokeOpacity="0.2" strokeWidth="2" fill="none" mask="url(#contact-trace-mask)">
        <path d="M400,0 L400,250 L408,285 L408,650 L400,685 L400,1000" />
        <path d="M414,0 L414,180 L406,215 L406,700 L414,735 L414,1000" />
        <path d="M428,0 L428,400 L436,435 L436,800 L428,835 L428,1000" />
        <path d="M858,0 L858,220 L850,255 L850,750 L858,785 L858,1000" />
        <path d="M874,0 L874,380 L882,415 L882,780 L874,815 L874,1000" />
      </g>
    </svg>
  );
}
