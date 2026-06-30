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
        <path d="M32 58 C28 54 16 50 12 42 C6 32 10 20 18 16 C14 12 12 6 18 4 C24 2 28 8 32 10 C36 8 40 2 46 4 C52 6 50 12 46 16 C54 20 58 32 52 42 C48 50 36 54 32 58 Z" />
        <line x1="32" y1="10" x2="32" y2="58" />
        <path d="M32 26 L18 16" />
        <path d="M32 26 L46 16" />
        <path d="M32 38 L16 34" />
        <path d="M32 38 L48 34" />
        <path d="M32 48 L20 48" />
        <path d="M32 48 L44 48" />
      </g>
    </svg>
  )
}
