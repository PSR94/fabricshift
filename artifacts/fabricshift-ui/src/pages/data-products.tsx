import { useListDataProducts } from "@workspace/api-client-react";
import { Layout, PageHeader } from "@/components/layout";
import { ReadinessBand } from "@/components/status-badge";
import { ReadinessGauge } from "@/components/readiness-gauge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { CheckCircle2, Circle, ChevronRight } from "lucide-react";

export default function DataProducts() {
  const { data, isLoading } = useListDataProducts();

  return (
    <Layout>
      <PageHeader title="Data Product Catalog" subtitle="Registered data products and their migration readiness status" />
      <div className="p-6">
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-52" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {data?.map((p) => (
              <Link key={p.product_id} href={`/data-products/${p.product_id}`}>
                <div className="bg-card border border-border rounded-lg p-5 hover:border-primary/40 transition-colors cursor-pointer group">
                  <div className="flex items-start gap-4">
                    <ReadinessGauge score={p.readiness_score} size="md" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{p.product_name}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5">{p.business_domain}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <ReadinessBand band={p.readiness_band} />
                          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-muted-foreground">Owner: <span className="text-foreground">{p.owner}</span></span>
                        <span className="text-xs text-muted-foreground">·</span>
                        <span className="text-xs text-muted-foreground">{p.freshness_target}</span>
                      </div>

                      <div className="flex items-center gap-2 mt-3">
                        {p.has_contract
                          ? <span className="flex items-center gap-1 text-[11px] text-emerald-400"><CheckCircle2 className="w-3 h-3" />Contract</span>
                          : <span className="flex items-center gap-1 text-[11px] text-muted-foreground"><Circle className="w-3 h-3" />No contract</span>
                        }
                        <span className="text-muted-foreground">·</span>
                        <span className="text-[11px] text-muted-foreground">{p.consumer_reports.length} report{p.consumer_reports.length !== 1 ? "s" : ""}</span>
                      </div>

                      <div className="flex gap-1.5 mt-3">
                        {p.bronze_entities.length > 0 && <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">Bronze</span>}
                        {p.silver_entities.length > 0 && <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-400/10 text-slate-300 border border-slate-400/20">Silver</span>}
                        {p.gold_marts.length > 0 && <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">Gold</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
