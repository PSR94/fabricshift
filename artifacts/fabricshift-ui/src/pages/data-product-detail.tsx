import { useRoute } from "wouter";
import {
  useGetDataProduct,
  useGetDataProductContract,
  useGetDataProductProfile,
  getGetDataProductQueryKey,
  getGetDataProductContractQueryKey,
  getGetDataProductProfileQueryKey,
} from "@workspace/api-client-react";
import { Layout, PageHeader } from "@/components/layout";
import { ReadinessBand } from "@/components/status-badge";
import { ReadinessGauge } from "@/components/readiness-gauge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

export default function DataProductDetail() {
  const [, params] = useRoute("/data-products/:productId");
  const productId = params?.productId ?? "";

  const product = useGetDataProduct(productId, {
    query: { enabled: !!productId, queryKey: getGetDataProductQueryKey(productId) },
  });
  const contract = useGetDataProductContract(productId, {
    query: { enabled: !!productId, queryKey: getGetDataProductContractQueryKey(productId) },
  });
  const profile = useGetDataProductProfile(productId, {
    query: { enabled: !!productId, queryKey: getGetDataProductProfileQueryKey(productId) },
  });

  const p = product.data;
  const c = contract.data;
  const pr = profile.data;

  return (
    <Layout>
      <PageHeader
        title={product.isLoading ? "Loading..." : (p?.product_name ?? "Product Not Found")}
        subtitle={p ? `${p.business_domain} · Owner: ${p.owner}` : undefined}
        action={p && (
          <div className="flex items-center gap-2">
            <ReadinessGauge score={p.readiness_score} size="sm" />
            <ReadinessBand band={p.readiness_band} />
          </div>
        )}
      />

      {product.isLoading ? (
        <div className="p-6"><Skeleton className="h-64" /></div>
      ) : !p ? (
        <div className="p-6 text-center text-muted-foreground">Product not found.</div>
      ) : (
        <div className="p-6">
          <Tabs defaultValue="overview">
            <TabsList className="bg-card border border-border mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="contract">Contract</TabsTrigger>
              <TabsTrigger value="profile">Data Profile</TabsTrigger>
            </TabsList>

            {/* Overview */}
            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-card border border-border rounded-lg p-5">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Description</h3>
                    <p className="text-sm text-foreground">{p.description}</p>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-5">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Medallion Architecture</h3>
                    <div className="space-y-3">
                      {[
                        { layer: "Bronze", items: p.bronze_entities, color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
                        { layer: "Silver", items: p.silver_entities, color: "text-slate-300", bg: "bg-slate-400/10 border-slate-400/20" },
                        { layer: "Gold", items: p.gold_marts, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
                      ].map(({ layer, items, color, bg }) => (
                        <div key={layer} className="flex items-start gap-3">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded border ${bg} ${color} w-14 text-center shrink-0`}>{layer}</span>
                          <div className="flex flex-wrap gap-1.5">
                            {items.map((item) => (
                              <span key={item} className="text-xs font-mono bg-muted px-2 py-0.5 rounded text-foreground border border-border">{item}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-card border border-border rounded-lg p-5">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Source Systems</h3>
                    <div className="space-y-1.5">
                      {p.source_systems.map((s) => (
                        <div key={s} className="text-xs text-foreground font-mono bg-muted rounded px-2 py-1">{s}</div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-5">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">Freshness</span><span className="text-foreground text-xs">{p.freshness_target}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Contract</span>
                        {p.has_contract
                          ? <span className="flex items-center gap-1 text-emerald-400 text-xs"><CheckCircle2 className="w-3 h-3" />Yes</span>
                          : <span className="flex items-center gap-1 text-muted-foreground text-xs"><XCircle className="w-3 h-3" />None</span>
                        }
                      </div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Consumers</span><span className="text-foreground">{p.consumer_reports.length}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Contract */}
            <TabsContent value="contract">
              {contract.isLoading ? <Skeleton className="h-64" /> : !c ? (
                <p className="text-sm text-muted-foreground">No contract available for this product.</p>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: "Primary Key", value: c.primary_key },
                      { label: "Freshness", value: c.freshness_expectation },
                      { label: "Source Systems", value: c.source_systems.join(", ") },
                      { label: "Downstream", value: `${c.downstream_consumers.length} consumers` },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-card border border-border rounded-lg p-3">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p>
                        <p className="text-xs text-foreground mt-1 font-mono">{value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-card border border-border rounded-lg overflow-hidden">
                    <div className="px-4 py-3 border-b border-border">
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Schema Columns</h3>
                    </div>
                    <ScrollArea className="max-h-64">
                      <table className="w-full text-sm">
                        <thead><tr className="border-b border-border">
                          {["Column", "Type", "Nullable", "Description"].map((h) => (
                            <th key={h} className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">{h}</th>
                          ))}
                        </tr></thead>
                        <tbody>
                          {c.columns.map((col) => (
                            <tr key={col.name} className="border-b border-border/50 hover:bg-muted/30">
                              <td className="py-2 px-3 font-mono text-xs text-cyan-400">{col.name}</td>
                              <td className="py-2 px-3 font-mono text-xs text-violet-400">{col.data_type}</td>
                              <td className="py-2 px-3 text-xs">{col.nullable ? "Yes" : <span className="text-amber-400 font-medium">No</span>}</td>
                              <td className="py-2 px-3 text-xs text-muted-foreground">{col.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </ScrollArea>
                  </div>

                  <div className="bg-card border border-border rounded-lg overflow-hidden">
                    <div className="px-4 py-3 border-b border-border">
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Reconciliation Rules</h3>
                    </div>
                    <div className="divide-y divide-border">
                      {c.reconciliation_rules.map((r) => (
                        <div key={r.rule_id} className="px-4 py-3 flex items-start gap-3">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border shrink-0 ${
                            r.severity === "critical" ? "text-rose-400 border-rose-500/30 bg-rose-500/10" :
                            r.severity === "high" ? "text-red-400 border-red-500/30 bg-red-500/10" :
                            "text-amber-400 border-amber-500/30 bg-amber-500/10"
                          }`}>{r.severity}</span>
                          <div>
                            <p className="text-xs font-medium text-foreground">{r.description}</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">
                              type: {r.rule_type}
                              {r.column ? ` · column: ${r.column}` : ""}
                              {r.threshold != null ? ` · threshold: ${r.threshold}` : ""}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Profile */}
            <TabsContent value="profile">
              {profile.isLoading ? <Skeleton className="h-64" /> : !pr ? (
                <p className="text-sm text-muted-foreground">No data profile available for this product.</p>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Source Rows", value: pr.source_row_count.toLocaleString(), color: "text-cyan-400" },
                      { label: "Target Rows", value: pr.target_row_count.toLocaleString(), color: "text-emerald-400" },
                      { label: "Profile Date", value: pr.profile_date, color: "text-foreground" },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="bg-card border border-border rounded-lg p-3">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p>
                        <p className={`text-lg font-mono font-semibold mt-1 ${color}`}>{value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-card border border-border rounded-lg overflow-hidden">
                    <div className="px-4 py-3 border-b border-border">
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Column Statistics</h3>
                    </div>
                    <ScrollArea className="max-h-64">
                      <table className="w-full text-sm">
                        <thead><tr className="border-b border-border">
                          {["Column", "Type", "Null Rate", "Distinct", "Min", "Max", "Samples"].map((h) => (
                            <th key={h} className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap">{h}</th>
                          ))}
                        </tr></thead>
                        <tbody>
                          {pr.columns.map((col) => (
                            <tr key={col.column_name} className="border-b border-border/50 hover:bg-muted/30">
                              <td className="py-2 px-3 font-mono text-xs text-cyan-400">{col.column_name}</td>
                              <td className="py-2 px-3 font-mono text-xs text-violet-400">{col.data_type}</td>
                              <td className="py-2 px-3 font-mono text-xs">{(col.null_rate * 100).toFixed(2)}%</td>
                              <td className="py-2 px-3 font-mono text-xs">{col.distinct_count.toLocaleString()}</td>
                              <td className="py-2 px-3 font-mono text-xs text-muted-foreground">{col.min_value ?? "—"}</td>
                              <td className="py-2 px-3 font-mono text-xs text-muted-foreground">{col.max_value ?? "—"}</td>
                              <td className="py-2 px-3 text-xs text-muted-foreground">{col.sample_values.slice(0, 2).join(", ")}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </ScrollArea>
                  </div>

                  {pr.quality_findings.length > 0 && (
                    <div className="bg-card border border-border rounded-lg overflow-hidden">
                      <div className="px-4 py-3 border-b border-border">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Quality Findings</h3>
                      </div>
                      <div className="divide-y divide-border">
                        {pr.quality_findings.map((f) => (
                          <div key={f.finding_id} className="px-4 py-3">
                            <div className="flex items-center gap-2 mb-1.5">
                              <AlertTriangle className={`w-3.5 h-3.5 ${f.severity === "critical" ? "text-rose-400" : "text-red-400"}`} />
                              <span className={`text-xs font-medium uppercase ${f.severity === "critical" ? "text-rose-400" : "text-red-400"}`}>{f.severity}</span>
                              <span className="text-xs text-muted-foreground">·</span>
                              <span className="text-xs text-muted-foreground font-mono">{f.category}</span>
                              <span className="text-xs text-muted-foreground">·</span>
                              <span className="text-xs text-foreground">{f.asset}</span>
                            </div>
                            <p className="text-xs text-foreground">{f.evidence}</p>
                            <p className="text-xs text-muted-foreground mt-1">{f.recommended_action}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </Layout>
  );
}
