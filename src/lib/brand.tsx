import { useId } from "react";

/* ------------------------- Primary isometric mark ------------------------- */

export function SynapseMark({ size = 120, className = "" }: { size?: number; className?: string }) {
  const id = useId().replace(/[:]/g, "");
  return (
    <svg
      width={size}
      height={(size * 140) / 120}
      viewBox="0 0 120 140"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}a`} x1="8" y1="8" x2="112" y2="68" gradientUnits="userSpaceOnUse">
          <stop stopColor="#dd0000" />
          <stop offset="1" stopColor="#ff6a00" />
        </linearGradient>
        <linearGradient id={`${id}b`} x1="8" y1="69" x2="60" y2="130" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00d6c8" />
          <stop offset="1" stopColor="#003c5e" />
        </linearGradient>
        <linearGradient id={`${id}c`} x1="112" y1="69" x2="60" y2="130" gradientUnits="userSpaceOnUse">
          <stop stopColor="#01314e" />
          <stop offset="1" stopColor="#091c31" />
        </linearGradient>
      </defs>
      {/* top half — red to orange */}
      <path d="M60 8 112 38 60 68 8 38Z" fill={`url(#${id}a)`} />
      <path d="M8 38 60 68v31L8 69Z" fill="#6e0a24" />
      <path d="M112 38v31L60 99V68Z" fill="#a31400" />
      {/* bottom half — teal to deep blue */}
      <path d="M8 69 60 99v31L8 100Z" fill={`url(#${id}b)`} />
      <path d="M112 69v31L60 130V99Z" fill={`url(#${id}c)`} />
      {/* edge highlights */}
      <path d="M60 8 112 38 60 68 8 38Z" stroke="#ffd9bf" strokeOpacity="0.35" strokeWidth="1" />
      <path d="M8 69 60 99v31L8 100Z" stroke="#9ff5ee" strokeOpacity="0.3" strokeWidth="1" />
      {/* glowing S */}
      <path
        d="M84 30 40 54l40 24-40 24"
        stroke="#00d6c8"
        strokeOpacity="0.4"
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M84 30 40 54l40 24-40 24"
        stroke="#f4fffd"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="84" cy="30" r="4.5" fill="#ff6a00" />
      <circle cx="40" cy="102" r="4.5" fill="#00d6c8" />
    </svg>
  );
}

/* --------------------- outline / monochrome submark ----------------------- */

export function SynapseOutline({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={(size * 140) / 120} viewBox="0 0 120 140" fill="none" className={className} aria-hidden="true">
      <path d="M60 8 112 38v62L60 130 8 100V38Z" stroke="currentColor" strokeWidth="3" />
      <path d="M8 38 60 68l52-30M60 68v62" stroke="currentColor" strokeWidth="3" />
      <path d="M84 30 40 54l40 24-40 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* --------------------- decorative isometric wireframe ---------------------- */

export function IsoWire({ className = "", stroke = "#00d6c8" }: { className?: string; stroke?: string }) {
  return (
    <svg viewBox="0 0 220 250" fill="none" className={className} aria-hidden="true">
      <path d="M110 10 210 68v114L110 240 10 182V68Z" stroke={stroke} strokeOpacity="0.35" strokeWidth="1.5" />
      <path d="M10 68l100 58 100-58M110 126v114" stroke={stroke} strokeOpacity="0.25" strokeWidth="1.5" />
      <path
        d="M60 39l100 58M60 211l100-58"
        stroke={stroke}
        strokeOpacity="0.5"
        strokeWidth="1.5"
        className="dash-flow"
      />
      <circle cx="110" cy="10" r="4" fill={stroke} />
      <circle cx="10" cy="182" r="4" fill="#ff6a00" />
      <circle cx="210" cy="68" r="4" fill="#dd0000" />
    </svg>
  );
}

/* ------------------------ isometric founder avatar ------------------------ */

export type AvatarPalette = {
  topA: string;
  topB: string;
  botA: string;
  botB: string;
  dark: string;
  accent: string;
};

export function IsoAvatar({
  palette,
  initials,
  index,
  className = "",
}: {
  palette: AvatarPalette;
  initials: string;
  index: string;
  className?: string;
}) {
  const id = useId().replace(/[:]/g, "");
  const p = palette;
  return (
    <svg viewBox="0 0 240 240" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}h`} x1="82" y1="44" x2="158" y2="138" gradientUnits="userSpaceOnUse">
          <stop stopColor={p.topA} />
          <stop offset="1" stopColor={p.topB} />
        </linearGradient>
        <linearGradient id={`${id}s`} x1="44" y1="148" x2="196" y2="240" gradientUnits="userSpaceOnUse">
          <stop stopColor={p.botA} />
          <stop offset="1" stopColor={p.botB} />
        </linearGradient>
        <linearGradient id={`${id}bg`} x1="0" y1="0" x2="240" y2="240" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0c2440" />
          <stop offset="1" stopColor="#071829" />
        </linearGradient>
      </defs>

      <rect width="240" height="240" fill={`url(#${id}bg)`} />
      {/* faint iso grid */}
      <g stroke="#9fb4c7" strokeOpacity="0.07">
        <path d="M-20 60 260 220M-20 120 260 280M-20 0 260 160" />
        <path d="M260 60-20 220M260 0-20 160M260 120-20 280" />
      </g>

      {/* halo */}
      <circle cx="120" cy="88" r="58" fill={p.accent} opacity="0.08" />
      <circle
        cx="120"
        cy="88"
        r="68"
        fill="none"
        stroke={p.accent}
        strokeOpacity="0.45"
        strokeWidth="1.5"
        strokeDasharray="3 10"
        className="animate-orbit"
      />

      {/* shoulders */}
      <path d="M120 148 196 184 120 220 44 184Z" fill={`url(#${id}s)`} />
      <path d="M44 184 120 220v20H44v-36Z" fill={p.dark} />
      <path d="M196 184v20l-76 36v-20Z" fill={p.botB} />
      <path d="M120 148 196 184 120 220 44 184Z" stroke={p.accent} strokeOpacity="0.25" strokeWidth="1" />

      {/* neck */}
      <path d="M108 130h24l8 30h-40Z" fill="#0a1f36" />

      {/* head cube */}
      <path d="M120 44 158 66 120 88 82 66Z" fill={p.topA} />
      <path d="M82 66 120 88v50L82 116Z" fill={`url(#${id}h)`} />
      <path d="M158 66v50l-38 22V88Z" fill={p.topB} />
      <path d="M120 44 158 66 120 88 82 66Z" stroke="#ffffff" strokeOpacity="0.22" strokeWidth="1" />

      {/* visor */}
      <path d="M84 86 120 107l36-21" stroke={p.accent} strokeOpacity="0.35" strokeWidth="8" strokeLinecap="round" />
      <path d="M84 86 120 107l36-21" stroke={p.accent} strokeWidth="3" strokeLinecap="round" />

      {/* chest S */}
      <path d="M152 172 96 192l52 16" stroke={p.accent} strokeOpacity="0.3" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M152 172 96 192l52 16" stroke={p.accent} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

      {/* labels */}
      <rect x="14" y="16" width="8" height="8" fill={p.accent} />
      <text x="28" y="24.5" fontFamily="Oswald, sans-serif" fontSize="12" letterSpacing="2" fill={p.accent}>
        {index}
      </text>
      <text
        x="226"
        y="25"
        textAnchor="end"
        fontFamily="Michroma, sans-serif"
        fontSize="13"
        fill="#e9f2f9"
        opacity="0.85"
      >
        {initials}
      </text>
    </svg>
  );
}

/* ------------------------------ custom icons ------------------------------ */

type IconProps = { className?: string };
const S = (props: IconProps & { children: React.ReactNode; vb?: string }) => (
  <svg
    viewBox={props.vb ?? "0 0 24 24"}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className ?? "h-5 w-5"}
    aria-hidden="true"
  >
    {props.children}
  </svg>
);

export const IconCube = (p: IconProps) => (
  <S {...p}>
    <path d="M12 2.5 21 7.5v9L12 21.5 3 16.5v-9Z" />
    <path d="M3 7.5l9 5 9-5M12 12.5v9" />
  </S>
);
export const IconSpark = (p: IconProps) => (
  <S {...p}>
    <path d="M12 2v6M12 16v6M2 12h6M16 12h6" />
    <path d="M12 8.5 15.5 12 12 15.5 8.5 12Z" fill="currentColor" stroke="none" />
  </S>
);
export const IconSignal = (p: IconProps) => (
  <S {...p}>
    <path d="m4 5 7 7-7 7M13 5l7 7-7 7" />
  </S>
);
export const IconLink = (p: IconProps) => (
  <S {...p}>
    <circle cx="6" cy="6" r="2.5" />
    <circle cx="18" cy="6" r="2.5" />
    <circle cx="12" cy="18" r="2.5" />
    <path d="M7.8 7.5 10.9 16M16.2 7.5 13.1 16M8.5 6h7" />
  </S>
);
export const IconTarget = (p: IconProps) => (
  <S {...p}>
    <path d="M12 2.5 20.2 7v10L12 21.5 3.8 17V7Z" />
    <circle cx="12" cy="12" r="4.2" />
    <circle cx="12" cy="12" r="0.6" fill="currentColor" />
  </S>
);
export const IconLayers = (p: IconProps) => (
  <S {...p}>
    <path d="M12 3 21 8l-9 5-9-5Z" />
    <path d="m3 12.5 9 5 9-5M3 17l9 5 9-5" strokeOpacity="0.65" />
  </S>
);
export const IconGame = (p: IconProps) => (
  <S {...p}>
    <path d="M7 6h10l4 6v3.5L17.5 19h-11L3 15.5V12Z" />
    <path d="M8 10.5v3M6.5 12h3" />
    <circle cx="15.5" cy="11" r="0.6" fill="currentColor" />
    <circle cx="17.5" cy="13.5" r="0.6" fill="currentColor" />
  </S>
);
export const IconQuill = (p: IconProps) => (
  <S {...p}>
    <path d="M20 4c-6 0-12 5-14 13l-2 3 3-2c8-2 13-8 13-14Z" />
    <path d="M6 17c3-5 7-9 11-11" strokeOpacity="0.65" />
  </S>
);
export const IconMail = (p: IconProps) => (
  <S {...p}>
    <rect x="3" y="5.5" width="18" height="13" />
    <path d="m3.5 6.5 8.5 7 8.5-7" />
  </S>
);
export const IconAt = (p: IconProps) => (
  <S {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-3.5 7.1" />
  </S>
);
export const IconPin = (p: IconProps) => (
  <S {...p}>
    <path d="M12 21.5s-7-6.6-7-11.5a7 7 0 0 1 14 0c0 4.9-7 11.5-7 11.5Z" />
    <path d="M12 6.5 15.5 10 12 13.5 8.5 10Z" />
  </S>
);
export const IconClock = (p: IconProps) => (
  <S {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7v5l3.5 2.5" />
  </S>
);
export const IconCopy = (p: IconProps) => (
  <S {...p}>
    <rect x="8" y="8" width="12" height="12" />
    <path d="M16 8V4H4v12h4" />
  </S>
);
export const IconCheck = (p: IconProps) => (
  <S {...p}>
    <path d="m4 12.5 5.5 5.5L20 6.5" />
  </S>
);
export const IconArrowUp = (p: IconProps) => (
  <S {...p}>
    <path d="M12 20V4M5 11l7-7 7 7" />
  </S>
);
export const IconChevron = (p: IconProps) => (
  <S {...p}>
    <path d="m9 5 7 7-7 7" />
  </S>
);
export const IconClose = (p: IconProps) => (
  <S {...p}>
    <path d="M5 5l14 14M19 5 5 19" />
  </S>
);
export const IconSend = (p: IconProps) => (
  <S {...p}>
    <path d="M21 3 10.5 13.5M21 3l-7 18-3.5-7.5L3 10Z" />
  </S>
);

export * from "./MainLogo";
export * from "./ExtendedLogo";
