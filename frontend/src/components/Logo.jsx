const Logo = ({ size = 32 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="22" r="14" fill="#2e7d32" />
      <circle cx="20" cy="30" r="10" fill="#43a047" />
      <circle cx="44" cy="30" r="10" fill="#43a047" />
      <rect x="29" y="34" width="6" height="18" rx="2" fill="#6d4c26" />
      <path d="M32 40 L26 46 M32 40 L38 46" stroke="#4e342e" strokeWidth="2" strokeLinecap="round" />
    </svg>
    <span style={{ fontSize: size * 0.55, fontWeight: 800, color: "#2e7d32", letterSpacing: "-0.5px" }}>
      Eco<span style={{ color: "#f9a825" }}>Recycle</span>
    </span>
  </div>
);

export default Logo;