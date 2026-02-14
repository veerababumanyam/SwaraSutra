
export const swarasutra_LOGO_SVG = `
<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#06b6d4" />
      <stop offset="100%" stop-color="#0891b2" />
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  
  <!-- Film Strip Aesthetics -->
  <rect x="10" y="20" width="80" height="60" rx="6" stroke="#0891b2" stroke-width="1.5" stroke-opacity="0.3" />
  <circle cx="15" cy="25" r="2" fill="#22d3ee" opacity="0.6" />
  <circle cx="15" cy="75" r="2" fill="#22d3ee" opacity="0.6" />
  <circle cx="85" cy="25" r="2" fill="#22d3ee" opacity="0.6" />
  <circle cx="85" cy="75" r="2" fill="#22d3ee" opacity="0.6" />

  <!-- The Resonant 'G' -->
  <path d="M70 35C67 28 60 24 50 24C35.5 24 24 35.5 24 50C24 64.5 35.5 76 50 76C62 76 71 68 74 57" 
        stroke="url(#g-gradient)" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" />
  <path d="M74 50H50" stroke="#06b6d4" stroke-width="8" stroke-linecap="round" />
  
  <!-- Secondary Accents -->
  <path d="M45 45L55 50L45 55V45Z" fill="#22d3ee" filter="url(#glow)" />
</svg>
`;