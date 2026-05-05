import { useGetInventorySummary, useListDomains } from "@workspace/api-client-react";
import { Layout, PageHeader } from "@/components/layout";
import { ReadinessBand } from "@/components/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import {
  Database, ArrowRightLeft, ShieldCheck, FlaskConical,
  Layers, AlertTriangle, DollarSign, Server, GitFork, FileText
} from "lucide-react";

function StatCard({ label, value, sub, icon: Icon, color }: {
  label: string; value: string | number; sub?: string;
  icon: React.ElementType; color: string;
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-semibold font-mono mt-1" style={{ color }}>{value}</p>
          {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
        </div>
        <div className="w-9 h-9 rounded-md flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
      </div>
    </div>
  );
}

function QuickAction({ href, label, icon: Icon, description }: {
  href: string; label: string; icon: React.ElementType; description: string;
}) {
  return (
    <Link href={href}>
      <div className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 hover:bg-card/80 transition-colors cursor-pointer group">
        <div className="flex items-center gap-3 mb-2">
          <Icon className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{label}</span>
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </Link>
  );
}

export default function Dashboard() {
  const summary = useGetInventorySummary();
  const domains = useListDomains();
  const s = summary.data;

  return (
    <Layout>
      <PageHeader
        title="Mission Control"
        subtitle="Synapse-to-Fabric migration readiness overview — reference data"
      />

      <div className="p-6 space-y-6">
        {/* Inventory Stats */}
        <div>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Platform Inventory</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {summary.isLoading ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24" />) : <>
              <StatCard label="Workspaces" value={s?.total_workspaces ?? 0} icon={Server} color="#22d3ee" />
              <StatCard label="Pipelines" value={s?.total_pipelines ?? 0} icon={ArrowRightLeft} color="#a78bfa" />
              <StatCard label="SQL Objects" value={s?.total_sql_objects ?? 0} icon={Database} color="#34d399" />
              <StatCard label="Power BI Reports" value={s?.total_reports ?? 0} icon={FileText} color="#fb923c" />
              <StatCard label="Data Products" value={s?.total_data_products ?? 0} icon={GitFork} color="#f472b6" />
              <StatCard label="Domains" value={s?.total_domains ?? 0} icon={Layers} color="#60a5fa" />
            </>}
          </div>
        </div>

        {/* Readiness + Cost row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Readiness Distribution */}
          <div className="lg:col-span-2 bg-card border border-border rounded-lg p-5">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">Readiness Distribution</h2>
            {summary.isLoading ? <Skeleton className="h-24" /> : s && (() => {
              const total = s.total_data_products;
              const readyPct = (s.readiness_distribution.ready / total) * 100;
              const reviewPct = (s.readiness_distribution.needs_review / total) * 100;
              const blockedPct = (s.readiness_distribution.blocked / total) * 100;
              return (
                <>
                  <div className="flex rounded-full overflow-hidden h-3 mb-4">
                    <div className="bg-emerald-500 transition-all" style={{ width: `${readyPct}%` }} />
                    <div className="bg-amber-500 transition-all" style={{ width: `${reviewPct}%` }} />
                    <div className="bg-red-500 transition-all" style={{ width: `${blockedPct}%` }} />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "Ready", count: s.readiness_distribution.ready, color: "#34d399", pct: readyPct },
                      { label: "Needs Review", count: s.readiness_distribution.needs_review, color: "#fbbf24", pct: reviewPct },
                      { label: "Blocked", count: s.readiness_distribution.blocked, color: "#f87171", pct: blockedPct },
                    ].map(({ label, count, color, pct }) => (
                      <div key={label}>
                        <p className="text-xl font-semibold font-mono" style={{ color }}>{count}</p>
                        <p className="text-xs text-muted-foreground">{label}</p>
                        <p className="text-xs font-mono mt-0.5" style={{ color }}>{pct.toFixed(0)}%</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Critical Blockers</p>
                      <p className="text-lg font-mono font-semibold text-red-400">{s.critical_blockers}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Wave 1 Candidates</p>
                      <p className="text-lg font-mono font-semibold text-cyan-400">{s.first_wave_candidates}</p>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>

          {/* Cost + Migration */}
          <div className="bg-card border border-border rounded-lg p-5">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">Cost & Migration</h2>
            {summary.isLoading ? <Skeleton className="h-24" /> : s && (
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground">Est. Monthly Cost</p>
                  <p className="text-2xl font-semibold font-mono text-amber-400">£{s.estimated_total_monthly_cost.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Migration Candidates</p>
                  <p className="text-2xl font-semibold font-mono text-cyan-400">{s.migration_candidates}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">of {s.total_workspaces} workspaces</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Most Complex Domain</p>
                  <p className="text-sm font-medium text-foreground mt-0.5">{s.top_domain_by_complexity}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Domain Readiness */}
        <div className="bg-card border border-border rounded-lg p-5">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">Domain Readiness Snapshot</h2>
          {domains.isLoading ? <Skeleton className="h-20" /> : (
            <div className="space-y-2">
              {domains.data?.map((d) => (
                <div key={d.domain_id} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground truncate">{d.domain_name}</span>
                      <ReadinessBand band={d.readiness_band} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{d.owner} · {d.asset_count} assets · {d.pipeline_count} pipelines</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded border ${
                    d.criticality === "critical" ? "text-rose-400 border-rose-500/30 bg-rose-500/10" :
                    d.criticality === "high" ? "text-red-400 border-red-500/30 bg-red-500/10" :
                    d.criticality === "medium" ? "text-amber-400 border-amber-500/30 bg-amber-500/10" :
                    "text-slate-400 border-slate-500/30 bg-slate-500/10"
                  }`}>{d.criticality}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Quick Launch</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <QuickAction href="/mapping" label="Run Fabric Mapping" icon={ArrowRightLeft} description="Map Synapse assets to Fabric targets" />
            <QuickAction href="/readiness" label="Assess Readiness" icon={ShieldCheck} description="Score all data products for migration" />
            <QuickAction href="/reconciliation" label="Run Reconciliation" icon={FlaskConical} description="Source-to-target data validation" />
            <QuickAction href="/waves" label="Plan Waves" icon={Layers} description="Generate phased migration wave plan" />
          </div>
        </div>
      </div>
    </Layout>
  );
}
