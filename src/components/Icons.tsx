import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const base = (p: P) => ({
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...p,
});

export const IconHome = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V21h14V9.5" />
  </svg>
);
export const IconBook = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v18H6.5A2.5 2.5 0 0 0 4 22z" />
    <path d="M4 17.5A2.5 2.5 0 0 1 6.5 15H20" />
  </svg>
);
export const IconPlay = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 4.5v15l13-7.5z" />
  </svg>
);
export const IconCheck = (p: P) => (
  <svg {...base(p)}>
    <path d="m4 12.5 5 5L20 6.5" />
  </svg>
);
export const IconAward = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="9" r="6" />
    <path d="m8.5 14-1.5 7 5-2.5 5 2.5-1.5-7" />
  </svg>
);
export const IconUsers = (p: P) => (
  <svg {...base(p)}>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
    <path d="M16 5.5a3.5 3.5 0 0 1 0 7M17.5 14.5A6.5 6.5 0 0 1 21.5 20" />
  </svg>
);
export const IconBuilding = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 21h18M5 21V4a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v17M14 9h4a1 1 0 0 1 1 1v11" />
    <path d="M8 7h3M8 11h3M8 15h3" />
  </svg>
);
export const IconChart = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 21h18" />
    <path d="M6 17V9M11 17V4M16 17v-6M21 17v-3" />
  </svg>
);
export const IconShield = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 2.5 20 6v6c0 5-3.5 8-8 9.5C7.5 20 4 17 4 12V6z" />
    <path d="m8.8 12 2.2 2.2 4.2-4.4" />
  </svg>
);
export const IconClipboard = (p: P) => (
  <svg {...base(p)}>
    <path d="M9 3.5h6v3H9z" />
    <path d="M9 5H6.5A1.5 1.5 0 0 0 5 6.5v14A1.5 1.5 0 0 0 6.5 22h11a1.5 1.5 0 0 0 1.5-1.5v-14A1.5 1.5 0 0 0 17.5 5H15" />
    <path d="M8.5 11h7M8.5 15h5" />
  </svg>
);
export const IconSettings = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-2.87 1.2V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 7.1 19.3l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15H4.5a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.2-2.87l-.06-.06A2 2 0 1 1 8.57 5.24l.06.06A1.7 1.7 0 0 0 10.5 5.6V5.5a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 2.87 1.2l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 13H21a2 2 0 1 1 0 4z" />
  </svg>
);
export const IconLogout = (p: P) => (
  <svg {...base(p)}>
    <path d="M9 21H5.5A1.5 1.5 0 0 1 4 19.5v-15A1.5 1.5 0 0 1 5.5 3H9" />
    <path d="m15 16 4-4-4-4M19 12H9" />
  </svg>
);
export const IconBell = (p: P) => (
  <svg {...base(p)}>
    <path d="M18 9a6 6 0 1 0-12 0c0 6-2 7-2 7h16s-2-1-2-7" />
    <path d="M10.5 20.5a2 2 0 0 0 3 0" />
  </svg>
);
export const IconSearch = (p: P) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);
export const IconArrowRight = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
export const IconClock = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5.5l3.5 2" />
  </svg>
);
export const IconFile = (p: P) => (
  <svg {...base(p)}>
    <path d="M14 3H7.5A1.5 1.5 0 0 0 6 4.5v15A1.5 1.5 0 0 0 7.5 21h9a1.5 1.5 0 0 0 1.5-1.5V7z" />
    <path d="M14 3v4h4" />
  </svg>
);
export const IconSpark = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
  </svg>
);
export const IconFire = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 22c4 0 6.5-2.7 6.5-6.2 0-4.6-4.3-6.3-4-11.3-2.6 1.4-4 3.6-4 6-1 0-2-1-2.3-2.6C6.6 9.5 5.5 12 5.5 15.8 5.5 19.3 8 22 12 22" />
  </svg>
);
export const IconQr = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z" />
    <path d="M14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z" />
  </svg>
);
export const IconUpload = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 16V4M8 8l4-4 4 4" />
    <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
  </svg>
);
export const IconDownload = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 4v12M8 12l4 4 4-4" />
    <path d="M4 20h16" />
  </svg>
);
export const IconLock = (p: P) => (
  <svg {...base(p)}>
    <rect x="4.5" y="10" width="15" height="11" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </svg>
);
export const IconGraduation = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 4 2 9l10 5 10-5z" />
    <path d="M6 11.5V17c0 1.7 2.7 3 6 3s6-1.3 6-3v-5.5" />
  </svg>
);
export const IconHeart = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 20s-7-4.4-7-9.2A4 4 0 0 1 12 8a4 4 0 0 1 7 2.8C19 15.6 12 20 12 20" />
  </svg>
);
export const IconLayers = (p: P) => (
  <svg {...base(p)}>
    <path d="m12 3 9 5-9 5-9-5z" />
    <path d="m3 13 9 5 9-5M3 17.5l9 5 9-5" />
  </svg>
);
export const IconAlert = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 4 2.5 20h19z" />
    <path d="M12 10v4M12 17h.01" />
  </svg>
);
export const IconMenu = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);
export const IconX = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
export const IconEye = (p: P) => (
  <svg {...base(p)}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
