const BRANDS: Record<string, readonly [string, string]> = {
  v1: ['#5A4BE8', '#8B7DFB'],
  v2: ['#FF6B5E', '#FF9486'],
  v3: ['#3B82F6', '#60A5FA'],
  v4: ['#8B5CF6', '#A78BFA'],
  v5: ['#F59E0B', '#FBBF24'],
  v6: ['#14B8A6', '#2DD4BF'],
};

const FALLBACK: readonly [string, string] = ['#5A4BE8', '#8B7DFB'];

interface MonoProps {
  gradient: string | readonly [string, string];
  label: string;
  size?: number;
  radius?: number;
  fontSize?: number;
}

export function Mono({ gradient, label, size = 50, radius = 14, fontSize }: MonoProps) {
  const resolved = Array.isArray(gradient) ? gradient : (BRANDS[gradient as string] ?? FALLBACK);
  const [from, to] = resolved;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        flexShrink: 0,
        background: `linear-gradient(140deg, ${from}, ${to})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 800,
        fontSize: fontSize ?? size * 0.4,
        letterSpacing: '-0.02em',
      }}
    >
      {label}
    </div>
  );
}
