import { usePlanMigrationWaves, useListMigrationWaves, getListMigrationWavesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Layout, PageHeader } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { EffortBand, ReadinessBand } from "@/components/status-badge";
import { ReadinessGauge } from "@/components/readiness-gauge";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, ChevronDown, ChevronRight, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function Waves() {
  const qc = useQueryClient();
  const planWaves = usePlanMigrationWaves();
  const { data: waves, isLoading } = useListMigrationWaves();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <Layout>
      <PageHeader
        title="Migration Wave Plan"
        subtitle="Phased migration sequencing based on domain readiness and risk profiles"
        action={
          <Button
            size="sm"
            onClick={() => planWaves.mutate({ data: {} }, {
              onSuccess: () => qc.invalidateQueries({ queryKey: getListMigrationWavesQueryKey() }),
            })}
            disabled={planWaves.isPending}
          >
            <Play className="w-3.5 h-3.5 mr-1.5" />
            {planWaves.isPending ? "Planning..." : "Plan Waves"}
          </Button>
        }
      />

      <div className="p-6 space-y-4">
        {isLoading ? (
          <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />)}</div>
        ) : !waves || waves.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <p className="text-sm text-muted-foreground mb-3">No wave plan has been created yet.</p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => planWaves.mutate({ data: {} }, {
                onSuccess: () => qc.invalidateQueries({ queryKey: getListMigrationWavesQueryKey() }),
              })}
              disabled={planWaves.isPending}
            >
              <Play className="w-3.5 h-3.5 mr-1.5" />
              {planWaves.isPending ? "Planning..." : "Generate plan"}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {waves.map((w) => {
              const waveColors = ["#22d3ee", "#a78bfa", "#34d399", "#f87171"];
              const color = waveColors[(w.wave_number - 1) % waveColors.length];
              const isExp = expanded === w.wave_id;

              return (
                <div key={w.wave_id} className="bg-card border rounded-lg overflow-hidden" style={{ borderColor: `${color}30` }}>
                  <div
                    className="flex items-start gap-4 p-5 cursor-pointer hover:bg-muted/10 transition-colors"
                    onClick={() => setExpanded(isExp ? null : w.wave_id)}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                      style={{ backgroundColor: `${color}20`, color, border: `1.5px solid ${color}40` }}
                    >
                      W{w.wave_number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-semibold text-foreground">{w.wave_name}</h3>
                        <EffortBand effort={w.estimated_effort_band} />
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        {w.domain_coverage.map((d) => (
                          <span key={d} className="text-[11px] bg-muted px-2 py-0.5 rounded text-muted-foreground">{d}</span>
                        ))}
                        <span className="text-xs text-muted-foreground">{w.assets.length} asset{w.assets.length !== 1 ? "s" : ""}</span>
                        {w.blockers.length > 0 && (
                          <span className="text-xs text-amber-400 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />{w.blockers.length} blocker{w.blockers.length !== 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                    </div>
                    {isExp
                      ? <ChevronDown className="w-4 h-4 text-muted-foreground mt-1 shrink-0" />
                      : <ChevronRight className="w-4 h-4 text-muted-foreground mt-1 shrink-0" />
                    }
                  </div>

                  {isExp && (
                    <div className="border-t border-border px-5 pb-5 pt-4 space-y-5">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2">Rationale</p>
                        <p className="text-xs text-foreground leading-relaxed">{w.rationale}</p>
                      </div>

                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2">Risk Notes</p>
                        <p className="text-xs text-amber-400/80 leading-relaxed">{w.risk_notes}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-5">
                        {w.prerequisites.length > 0 && (
                          <div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2">Prerequisites</p>
                            <ul className="space-y-1.5">
                              {w.prerequisites.map((p, i) => (
                                <li key={i} className="flex items-start gap-1.5 text-xs text-foreground">
                                  <CheckCircle2 className="w-3 h-3 mt-0.5 shrink-0 text-emerald-400" />{p}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {w.blockers.length > 0 && (
                          <div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2">Blockers</p>
                            <ul className="space-y-1.5">
                              {w.blockers.map((b, i) => (
                                <li key={i} className="flex items-start gap-1.5 text-xs text-amber-400">
                                  <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />{b}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {w.assets.length > 0 && (
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2">Assets in this Wave</p>
                          <div className="space-y-1.5">
                            {w.assets.map((a) => (
                              <div key={a.asset_id} className="flex items-center gap-3 py-1.5 border-b border-border/40 last:border-0">
                                <ReadinessGauge score={a.readiness_score} size="sm" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium text-foreground">{a.asset_name}</p>
                                  <p className="text-[11px] text-muted-foreground">{a.business_domain}</p>
                                </div>
                                <EffortBand effort={a.effort_band} />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
