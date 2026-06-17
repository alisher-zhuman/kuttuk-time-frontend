export type IconName =
  | 'back'
  | 'search'
  | 'chevron'
  | 'chevdown'
  | 'copy'
  | 'share'
  | 'check'
  | 'gift'
  | 'user'
  | 'globe'
  | 'clock'
  | 'store'
  | 'list'
  | 'wallet'
  | 'plus'
  | 'arrow'
  | 'cal';

interface IconProps {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export function Icon({ name, size = 22, strokeWidth = 2, color = 'currentColor' }: IconProps) {
  const s = {
    fill: 'none' as const,
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  const icons: Record<IconName, React.ReactNode> = {
    back: <path d="M15 5l-7 7 7 7" {...s} />,
    search: (
      <g {...s}>
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.5-3.5" />
      </g>
    ),
    chevron: <path d="M9 5l7 7-7 7" {...s} />,
    chevdown: <path d="M5 9l7 7 7-7" {...s} />,
    copy: (
      <g {...s}>
        <rect x="8" y="8" width="12" height="12" rx="3" />
        <path d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2" />
      </g>
    ),
    share: (
      <g {...s}>
        <path d="M12 15V4" />
        <path d="M8 8l4-4 4 4" />
        <path d="M5 13v5a2 2 0 002 2h10a2 2 0 002-2v-5" />
      </g>
    ),
    check: <path d="M5 13l4 4 10-11" {...s} />,
    gift: (
      <g {...s}>
        <path d="M4 11h16v9a1 1 0 01-1 1H5a1 1 0 01-1-1v-9z" />
        <path d="M3 7h18v4H3z" />
        <path d="M12 7v14" />
        <path d="M12 7S10.5 3 8 3.5 7 7 7 7h5zM12 7s1.5-4 4-3.5S17 7 17 7h-5z" />
      </g>
    ),
    user: (
      <g {...s}>
        <circle cx="12" cy="8.5" r="3.6" />
        <path d="M5 20c0-3.6 3.2-5.5 7-5.5s7 1.9 7 5.5" />
      </g>
    ),
    globe: (
      <g {...s}>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M3.5 12h17M12 3.5c2.3 2.3 2.3 14.7 0 17M12 3.5c-2.3 2.3-2.3 14.7 0 17" />
      </g>
    ),
    clock: (
      <g {...s}>
        <circle cx="12" cy="12" r="8.2" />
        <path d="M12 7.5V12l3 2" />
      </g>
    ),
    store: (
      <g {...s}>
        <path d="M4 9.5V20a1 1 0 001 1h14a1 1 0 001-1V9.5" />
        <path d="M3.5 9.5l1.2-4.2A1 1 0 015.6 4.5h12.8a1 1 0 011 .8l1.1 4.2" />
        <path d="M9 21v-5a1 1 0 011-1h4a1 1 0 011 1v5" />
      </g>
    ),
    list: (
      <g>
        <path d="M8 7h12M8 12h12M8 17h12" {...s} />
        <circle cx="4.2" cy="7" r="1.1" fill={color} stroke="none" />
        <circle cx="4.2" cy="12" r="1.1" fill={color} stroke="none" />
        <circle cx="4.2" cy="17" r="1.1" fill={color} stroke="none" />
      </g>
    ),
    wallet: (
      <g>
        <rect x="3" y="6" width="18" height="13" rx="3" {...s} />
        <path d="M3 10h18" {...s} />
        <circle cx="16.5" cy="14" r="1.3" fill={color} stroke="none" />
      </g>
    ),
    plus: <path d="M12 5v14M5 12h14" {...s} />,
    arrow: (
      <g {...s}>
        <path d="M5 12h14" />
        <path d="M13 6l6 6-6 6" />
      </g>
    ),
    cal: (
      <g {...s}>
        <rect x="4" y="5" width="16" height="16" rx="3" />
        <path d="M4 9.5h16M8 3.5v3M16 3.5v3" />
      </g>
    ),
  };

  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      {icons[name]}
    </svg>
  );
}
