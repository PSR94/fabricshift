import { useRunReconciliation, useListReconciliationResults, getListReconciliationResultsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Layout, PageHeader } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, CheckCircle2, XCircle, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function Reconciliation() {
  const qc = useQueryClient();
  const runRec = useRunReconciliation();
  const { data: results, isLoading } = useListReconciliationResults();
  const [expanded, setExpanded] = useState<string | null>(null);

  const totalPassed = results?.reduce((a, r) => a + r.passed_checks, 0) ?? 0;
  const totalFailed = results?.reduce((a, r) => a + r.failed_checks, 0) ?? 0;

  return (
    <Layout>
      <PageHeader
        title="Source-to-Target Reconciliation"
        subtitle="Validate source and target data alignment across all data products"
        action={
          <Button
            size="sm"
            onClick={() => runRec.mutate({ data: {} }, {
              onSuccess: () => qc.invalidateQueries({ queryKey: getListReconciliationResultsQueryKey() }),
            })}
            disabled={runRec.isPending}
          >
            <Play className="w-3.5 h-3.5 mr-1.5" />
            {runRec.isPending ? "Running..." : "Run Reconciliation"}
          </Button>
        }
      />

      <div className="p-6 space-y-4">
        {results && results.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-xs text-muted-foreground">Total Checks</p>
              <p className="text-2xl font-mono font-semibold text-cyan-400 mt-1">{totalPassed + totalFailed}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-xs text-muted-foreground">Passed</p>
              <p className="text-2xl font-mono font-semibold text-emerald-400 mt-1">{totalPassed}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-xs text-muted-foreground">Failed</p>
              <p className="text-2xl font-mono font-semibold text-red-400 mt-1">{totalFailed}</p>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
        ) : !results || results.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <p className="text-sm text-muted-foreground mb-3">No reconciliation results yet.</p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => runRec.mutate({ data: {} }, {
                onSuccess: () => qc.invalidateQueries({ queryKey: getListReconciliationResultsQueryKey() }),
              })}
              disabled={runRec.isPending}
            >
              <Play className="w-3.5 h-3.5 mr-1.5" />
              {runRec.isPending ? "Running..." : "Run now"}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {results.map((r) => (
              <div key={r.result_id} className="bg-card border border-border rounded-lg overflow-hidden">
                <div
                  className="flex items-center gap-4 p-4 cursor-pointer hover:bg-muted/20 transition-colors"
                  onClick={() => setExpanded(expanded === r.result_id ? null : r.result_id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-foreground">{r.product_name}</h3>
                      <StatusBadge status={r.overall_status} />
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-xs text-emerald-400"><CheckCircle2 className="w-3 h-3" />{r.passed_checks} passed</span>
                      {r.failed_checks > 0 && <span className="flex items-center gap-1 text-xs text-red-400"><XCircle className="w-3 h-3" />{r.failed_checks} failed</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {r.checks.map((c) => (
                        <div
                          key={c.check_id}
                          title={`${c.check_name}: ${c.passed ? "passed" : "failed"}`}
                          className={`w-2.5 h-2.5 rounded-sm ${c.passed ? "bg-emerald-500" : c.severity === "critical" ? "bg-rose-500" : c.severity === "high" ? "bg-red-500" : "bg-amber-500"}`}
                        />
                      ))}
                    </div>
                    {expanded === r.result_id
                      ? <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      : <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    }
                  </div>
                </div>

                {expanded === r.result_id && (
                  <div className="border-t border-border">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/30">
                          {["Status", "Check", "Type", "Severity", "Expected", "Observed", "Delta", "Action"].map((h) => (
                            <th key={h} className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {r.checks.map((c) => (
                          <tr key={c.check_id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                            <td className="py-2 px-3">
                              {c.passed
                                ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                : <XCircle className="w-4 h-4 text-red-400" />
                              }
                            </td>
                            <td className="py-2 px-3 font-medium text-foreground text-xs">{c.check_name}</td>
                            <td className="py-2 px-3"><span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">{c.check_type}</span></td>
                            <td className="py-2 px-3">
                              <span className={`text-xs font-medium ${
                                c.severity === "critical" ? "text-rose-400" :
                                c.severity === "high" ? "text-red-400" :
                                c.severity === "medium" ? "text-amber-400" : "text-muted-foreground"
                              }`}>{c.severity}</span>
                            </td>
                            <td className="py-2 px-3 font-mono text-xs text-muted-foreground max-w-[100px] truncate">{c.expected_value}</td>
                            <td className="py-2 px-3 font-mono text-xs max-w-[100px] truncate">{c.observed_value}</td>
                            <td className="py-2 px-3 font-mono text-xs text-amber-400">{c.delta ?? "—"}</td>
                            <td className="py-2 px-3 text-xs text-muted-foreground max-w-[180px] truncate">{c.recommended_action}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
