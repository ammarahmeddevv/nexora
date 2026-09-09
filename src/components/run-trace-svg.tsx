import { HERO_RUN } from "@/lib/content";

const STATE_COLOR: Record<string, string> = {
  done: "var(--iris)",
  running: "var(--state-run)",
  retry: "var(--state-retry)",
  sleeping: "var(--ink-faint)",
};

/** Static version of the hero run trace. Used below 640px, when WebGL is
 *  unavailable, and while the 3D scene loads. */
export function RunTraceSvg({ className = "" }: { className?: string }) {
  const rows = HERO_RUN.steps;
  const W = 720;
  const rowH = 46;
  const top = 26;
  const H = top + rows.length * rowH + 22;
  const padL = 150;
  const padR = 24;
  const barH = 18;
  const track = W - padL - padR;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      role="img"
      aria-label={`Run ${HERO_RUN.id} of workflow ${HERO_RUN.workflow}: five steps on a timeline, one retrying and one sleeping.`}
    >
      <rect x="0" y="0" width={W} height={H} fill="var(--panel)" />

      {/* time axis ticks */}
      {Array.from({ length: 9 }).map((_, i) => (
        <line
          key={i}
          x1={padL + (track / 8) * i}
          y1={top - 8}
          x2={padL + (track / 8) * i}
          y2={H - 20}
          stroke="var(--line-soft)"
        />
      ))}

      {rows.map((s, i) => {
        const y = top + i * rowH;
        const x = padL + s.start * track;
        const w = Math.max(s.span * track, 6);
        const color = STATE_COLOR[s.state];
        return (
          <g key={s.name}>
            <text
              x={padL - 14}
              y={y + barH - 3}
              fill="var(--ink-dim)"
              fontSize="12.5"
              textAnchor="end"
              fontFamily="var(--font-mono)"
            >
              {s.name}
            </text>
            {s.state === "sleeping" ? (
              <rect
                x={x}
                y={y}
                width={w}
                height={barH}
                rx="2"
                fill="none"
                stroke={color}
                strokeDasharray="3 3"
              />
            ) : (
              <rect x={x} y={y} width={w} height={barH} rx="2" fill={color} />
            )}
            {s.note && (
              <text
                x={x + w + 10}
                y={y + barH - 3}
                fill="var(--ink-faint)"
                fontSize="11.5"
                fontFamily="var(--font-mono)"
              >
                {s.note}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
