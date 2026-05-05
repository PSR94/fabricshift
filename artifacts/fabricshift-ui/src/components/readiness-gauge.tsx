import { cn } from "@/lib/utils";

interface ReadinessGaugeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ReadinessGauge({ score, size = "md", className }: ReadinessGaugeProps) {
  const s = size === "sm" ? 48 : size === "lg" ? 80 : 64;
  const r = (s - 10) / 2;
  const circumference = 2 * Math.PI * r;
  const filled = (score / 100) * circumference * 0.75;
  const color = score >= 75 ? "#34d399" : score >= 50 ? "#fbbf24" : "#f87171";
  const startAngle = 135;
  const cx = s / 2;
  const cy = s / 2;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const arcStart = {
    x: cx + r * Math.cos(toRad(startAngle)),
    y: cy + r * Math.sin(toRad(startAngle)),
  };

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={s} height={s} className="rotate-0">
        <circle
          cx={cx} cy={cy} r={r}
          fill="none" stroke="hsl(222 16% 18%)" strokeWidth={size === "sm" ? 4 : 5}
          strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
          strokeDashoffset={0}
          strokeLinecap="round"
          style={{ transform: `rotate(${startAngle}deg)`, transformOrigin: `${cx}px ${cy}px` }}
        />
        <circle
          cx={cx} cy={cy} r={r}
          fill="none" stroke={color} strokeWidth={size === "sm" ? 4 : 5}
          strokeDasharray={`${filled} ${circumference - filled}`}
          strokeDashoffset={0}
          strokeLinecap="round"
          style={{ transform: `rotate(${startAngle}deg)`, transformOrigin: `${cx}px ${cy}px` }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={cn("font-mono font-semibold leading-none", size === "sm" ? "text-xs" : size === "lg" ? "text-lg" : "text-sm")}
          style={{ color }}
        >
          {score}
        </span>
      </div>
    </div>
  );
}
