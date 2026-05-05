import { useState } from "react";
import { useRunFabricMapping, useListMappingResults } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getListMappingResultsQueryKey } from "@workspace/api-client-react";
import { Layout, PageHeader } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { EffortBand, RiskBadge, MedallionBadge } from "@/components/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Play, Search, ChevronDown, ChevronRight } from "lucide-react";

export default function Mapping() {
  const qc = useQueryClient();
  const runMapping = useRunFabricMapping();
  const { data: results, isLoading } = useListMappingResults();
  const [q, setQ] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = results?.filter((r) =>
    !q ||
    r.source_asset_name.toLowerCase().includes(q.toLowerCase()) ||
    r.business_domain.toLowerCase().includes(q.toLowerCase()) ||
    r.recommended_fabric_target.toLowerCase().includes(q.toLowerCase())
  );

  const effort = { low: 0, medium: 0, high: 0 };
  const risk = { low: 0, medium: 0, high: 0, critical: 0 };
  results?.forEach((r) => {
    effort[r.migration_effort as keyof typeof effort] = (effort[r.migration_effort as keyof typeof effort] ?? 0) + 1;
    risk[r.risk_level as keyof typeof risk] = (risk[r.risk_level as keyof typeof risk] ?? 0) + 1;
  });

  return (
    <Layout>
      <PageHeader
        title="Fabric Target Mapping"
        subtitle="Map Synapse assets to their recommended Microsoft Fabric targets"
        action={
          <Button
            size="sm"
            onClick={() => runMapping.mutate({ data: {} }, {
              onSuccess: () => qc.invalidateQueries({ queryKey: getListMappingResultsQueryKey() }),
            })}
            disabled={runMapping.isPending}
          >
            <Play className="w-3.5 h-3.5 mr-1.5" />
            {runMapping.isPending ? "Running..." : "Run Mapping"}
          </Button>
        }
      />

      <div className="p-6 space-y-4">
        {results && results.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Total Mapped", value: results.length, color: "text-cyan-400" },
              { label: "Low Effort", value: effort.low, color: "text-emerald-400" },
              { label: "High Risk", value: risk.high + risk.critical, color: "text-red-400" },
              { label: "With Blockers", value: results.filter((r) => r.blockers.length > 0).length, color: "text-amber-400" },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-card border border-border rounded-lg p-4">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className={`text-2xl font-mono font-semibold mt-1 ${color}`}>{value}</p>
              </div>
            ))}
          </div>
        )}

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
              <Input placeholder="Filter assets..." className="pl-8 h-8 text-sm" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            {results && <span className="text-xs text-muted-foreground">{filtered?.length} assets</span>}
          </div>

          {isLoading ? (
            <div className="p-4"><Skeleton className="h-48" /></div>
          ) : !results || results.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-muted-foreground mb-3">No mapping results yet.</p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => runMapping.mutate({ data: {} }, {
                  onSuccess: () => qc.invalidateQueries({ queryKey: getListMappingResultsQueryKey() }),
                })}
                disabled={runMapping.isPending}
              >
                <Play className="w-3.5 h-3.5 mr-1.5" />
                {runMapping.isPending ? "Running..." : "Run mapping now"}
              </Button>
            </div>
          ) : (
            <ScrollArea className="max-h-[calc(100vh-360px)]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-5"></th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Asset</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Type</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Domain</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Fabric Target</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Layer</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Effort</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Risk</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Blockers</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered?.map((r) => (
                    <>
                      <tr
                        key={r.mapping_id}
                        className="border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer"
                        onClick={() => setExpanded(expanded === r.mapping_id ? null : r.mapping_id)}
                      >
                        <td className="py-2 px-3">
                          {expanded === r.mapping_id
                            ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                            : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                          }
                        </td>
                        <td className="py-2 px-3 font-mono text-xs text-cyan-400">{r.source_asset_name}</td>
                        <td className="py-2 px-3"><span className="text-xs bg-muted px-1.5 py-0.5 rounded">{r.source_asset_type}</span></td>
                        <td className="py-2 px-3 text-xs text-muted-foreground">{r.business_domain}</td>
                        <td className="py-2 px-3 text-xs text-foreground max-w-[180px] truncate">{r.recommended_fabric_target}</td>
                        <td className="py-2 px-3"><MedallionBadge layer={r.medallion_layer} /></td>
                        <td className="py-2 px-3"><EffortBand effort={r.migration_effort} /></td>
                        <td className="py-2 px-3"><RiskBadge risk={r.risk_level} /></td>
                        <td className="py-2 px-3">
                          {r.blockers.length > 0
                            ? <span className="text-xs font-medium text-amber-400">{r.blockers.length}</span>
                            : <span className="text-xs text-muted-foreground">—</span>
                          }
                        </td>
                      </tr>
                      {expanded === r.mapping_id && (
                        <tr key={`${r.mapping_id}-detail`} className="bg-muted/20 border-b border-border">
                          <td colSpan={9} className="px-6 py-4">
                            <div className="space-y-3">
                              <div>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Rationale</p>
                                <p className="text-xs text-foreground">{r.rationale}</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Recommended Action</p>
                                <p className="text-xs text-foreground">{r.recommended_action}</p>
                              </div>
                              {r.blockers.length > 0 && (
                                <div>
                                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Blockers</p>
                                  <ul className="space-y-1">
                                    {r.blockers.map((b, i) => (
                                      <li key={i} className="text-xs text-amber-400 flex gap-1.5 items-start">
                                        <span className="mt-0.5 shrink-0">›</span>{b}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </ScrollArea>
          )}
        </div>
      </div>
    </Layout>
  );
}
