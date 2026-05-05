import { useListDomains } from "@workspace/api-client-react";
import { Layout, PageHeader } from "@/components/layout";
import { ReadinessBand, CriticalityBadge } from "@/components/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Database, GitMerge, Users } from "lucide-react";

export default function Domains() {
  const { data, isLoading } = useListDomains();

  return (
    <Layout>
      <PageHeader title="Business Domains" subtitle="Registered data domains and their migration readiness status" />
      <div className="p-6">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-44" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {data?.map((d) => (
              <div key={d.domain_id} className="bg-card border border-border rounded-lg p-5 hover:border-border/80 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{d.domain_name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{d.description}</p>
                  </div>
                  <CriticalityBadge criticality={d.criticality} className="ml-2 shrink-0" />
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <ReadinessBand band={d.readiness_band} />
                </div>

                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                      <Database className="w-3 h-3" />
                    </div>
                    <p className="text-lg font-semibold font-mono text-foreground">{d.asset_count}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Assets</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                      <GitMerge className="w-3 h-3" />
                    </div>
                    <p className="text-lg font-semibold font-mono text-foreground">{d.pipeline_count}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Pipelines</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                      <Users className="w-3 h-3" />
                    </div>
                    <p className="text-sm font-medium text-foreground truncate">{d.owner.split(" ")[0]}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Owner</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
