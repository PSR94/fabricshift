import { cn } from "@/lib/utils";

type Band = "ready" | "needs_review" | "blocked" | "critical" | string;
type Effort = "low" | "medium" | "high" | string;
type Status = "passed" | "warnings" | "failed" | "succeeded" | "running" | string;

const BAND_STYLES: Record<string, string> = {
  ready:        "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  needs_review: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  blocked:      "bg-red-500/15 text-red-400 border border-red-500/30",
  critical:     "bg-rose-500/15 text-rose-400 border border-rose-500/30",
};

const EFFORT_STYLES: Record<string, string> = {
  low:    "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  medium: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  high:   "bg-red-500/15 text-red-400 border border-red-500/30",
};

const STATUS_STYLES: Record<string, string> = {
  passed:    "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  succeeded: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  warnings:  "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  failed:    "bg-red-500/15 text-red-400 border border-red-500/30",
  running:   "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30",
};

const CRITICALITY_STYLES: Record<string, string> = {
  critical: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
  high:     "bg-red-500/15 text-red-400 border border-red-500/30",
  medium:   "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  low:      "bg-slate-500/15 text-slate-400 border border-slate-500/30",
};

function badge(label: string, style: string, className?: string) {
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium uppercase tracking-wide", style, className)}>
      {label.replace("_", " ")}
    </span>
  );
}

export function ReadinessBand({ band, className }: { band: Band; className?: string }) {
  return badge(band, BAND_STYLES[band] ?? "bg-muted text-muted-foreground border border-border", className);
}

export function EffortBand({ effort, className }: { effort: Effort; className?: string }) {
  return badge(effort, EFFORT_STYLES[effort] ?? "bg-muted text-muted-foreground border border-border", className);
}

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  return badge(status, STATUS_STYLES[status] ?? "bg-muted text-muted-foreground border border-border", className);
}

export function CriticalityBadge({ criticality, className }: { criticality: string; className?: string }) {
  return badge(criticality, CRITICALITY_STYLES[criticality] ?? "bg-muted text-muted-foreground border border-border", className);
}

export function MedallionBadge({ layer, className }: { layer: "bronze" | "silver" | "gold" | string; className?: string }) {
  const styles: Record<string, string> = {
    bronze: "bg-orange-500/15 text-orange-400 border border-orange-500/30",
    silver: "bg-slate-400/15 text-slate-300 border border-slate-400/30",
    gold:   "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
    source: "bg-slate-500/15 text-slate-400 border border-slate-500/30",
    product:"bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    report: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
    pipeline:"bg-amber-500/15 text-amber-400 border border-amber-500/30",
  };
  return badge(layer, styles[layer] ?? "bg-muted text-muted-foreground border border-border", className);
}

export function RiskBadge({ risk, className }: { risk: string; className?: string }) {
  const styles: Record<string, string> = {
    low:      "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    medium:   "bg-amber-500/15 text-amber-400 border border-amber-500/30",
    high:     "bg-red-500/15 text-red-400 border border-red-500/30",
    critical: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
  };
  return badge(risk, styles[risk] ?? "bg-muted text-muted-foreground border border-border", className);
}
