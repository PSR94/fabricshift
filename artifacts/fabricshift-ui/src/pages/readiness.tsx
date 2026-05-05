import { useRunReadinessAssessment, useListReadinessResults, getListReadinessResultsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Layout, PageHeader } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ReadinessBand } from "@/components/status-badge";
import { ReadinessGauge } from "@/components/readiness-gauge";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, ChevronDown, ChevronRight, AlertTriangle, Info } from "lucide-react";
import { useState } from "react";

export default function Readiness() {
  const qc = useQueryClient();
  const runAssessment = useRunReadinessAssessment();
  const { data: results, isLoading } = useListReadinessResults();
  const [expanded, setExpanded] = useState<string | null>(null);

  const dist = { ready: 0, needs_review: 0, blocked: 0 };
  results?.forEach((r) => { dist[r.readiness_band as keyof typeof dist]++; });
  const totalBlockers = results?.reduce((a, r) => a + r.blockers.length, 0) ?? 0;

  return (
    <Layout>
      <PageHeader
        title="Migration Readiness Assessment"
        subtitle="Score data products against migration criteria and identify blockers"
        action={
          <Button
            size="sm"
            onClick={() => runAssessment.mutate({ data: {} }, {
              onSuccess: () => qc.invalidateQueries({ queryKey: getListReadinessResultsQueryKey() }),
            })}
            disabled={runAssessment.isPending}
          >
            <Play className="w-3.5 h-3.5 mr-1.5" />
            {runAssessment.isPending ? "Assessing..." : "Run Assessment"}
          </Button>
        }
      />

      <div className="p-6 space-y-4">
        {results && results.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Ready", value: dist.ready, color: "text-emerald-400" },
              { label: "Needs Review", value: dist.needs_review, color: "text-amber-400" },
              { label: "Blocked", value: dist.blocked, color: "text-red-400" },
              { label: "Total Blockers", value: totalBlockers, color: "text-rose-400" },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-card border border-border rounded-lg p-4">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className={`text-2xl font-mono font-semibold mt-1 ${color}`}>{value}</p>
              </div>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
          </div>
        ) : !results || results.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <p className="text-sm text-muted-foreground mb-3">No assessment results yet.</p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => runAssessment.mutate({ data: {} }, {
                onSuccess: () => qc.invalidateQueries({ queryKey: getListReadinessResultsQueryKey() }),
              })}
              disabled={runAssessment.isPending}
            >
              <Play className="w-3.5 h-3.5 mr-1.5" />
              {runAssessment.isPending ? "Assessing..." : "Run assessment now"}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {results.map((r) => (
              <div key={r.assessment_id} className="bg-card border border-border rounded-lg overflow-hidden">
                <div
                  className="flex items-center gap-4 p-4 cursor-pointer hover:bg-muted/20 transition-colors"
                  onClick={() => setExpanded(expanded === r.assessment_id ? null : r.assessment_id)}
                >
                  <ReadinessGauge score={r.readiness_score} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-foreground">{r.asset_name}</h3>
                      <ReadinessBand band={r.readiness_band} />
                      <span className="text-xs text-muted-foreground">Wave {r.suggested_migration_wave}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{r.business_domain}</p>
                    {r.blockers.length > 0 && (
                      <p className="text-xs text-amber-400 mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />{r.blockers.length} blocker{r.blockers.length !== 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground max-w-[240px] truncate">{r.recommended_target_architecture}</span>
                    {expanded === r.assessment_id
                      ? <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      : <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    }
                  </div>
                </div>

                {expanded === r.assessment_id && (
                  <div className="border-t border-border px-4 pb-4 pt-3 space-y-4">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1.5">Target Architecture</p>
                      <p className="text-xs text-foreground bg-muted rounded px-3 py-2 font-mono">{r.recommended_target_architecture}</p>
                    </div>

                    {r.blockers.length > 0 && (
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1.5">Blockers</p>
                        <ul className="space-y-1.5">
                          {r.blockers.map((b, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-red-400">
                              <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />{b}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {r.risks.length > 0 && (
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1.5">Risks</p>
                        <ul className="space-y-1.5">
                          {r.risks.map((risk, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-amber-400">
                              <Info className="w-3 h-3 mt-0.5 shrink-0" />{risk}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2">Evidence Signals</p>
                      <div className="space-y-1.5">
                        {r.evidence.map((ev, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs">
                            <span className={`font-mono shrink-0 w-8 text-right ${ev.score_contribution > 0 ? "text-emerald-400" : ev.score_contribution < 0 ? "text-red-400" : "text-muted-foreground"}`}>
                              {ev.score_contribution > 0 ? `+${ev.score_contribution}` : ev.score_contribution}
                            </span>
                            <span className="text-muted-foreground font-mono w-40 shrink-0 truncate">{ev.signal}</span>
                            <span className="text-foreground">{ev.notes}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
