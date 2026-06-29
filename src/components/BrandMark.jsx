export default function BrandMark({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M32 10c7 0 12-6 12-6-1 7-5 12-12 12" />
        <path d="M32 12v8" />
        <path d="M32 24c-4-5-11-5-15-1 1 7 8 11 15 10" />
        <path d="M32 24c4-5 11-5 15-1-1 7-8 11-15 10" />
        <circle cx="24" cy="38" r="6" />
        <circle cx="32" cy="38" r="6" />
        <circle cx="40" cy="38" r="6" />
        <circle cx="28" cy="46" r="6" />
        <circle cx="36" cy="46" r="6" />
        <circle cx="32" cy="54" r="6" />
      </g>
    </svg>
  )
}
