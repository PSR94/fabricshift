import { useState } from "react";
import { useListWorkspaces, useListPipelines, useListSqlObjects, useListReports } from "@workspace/api-client-react";
import { Layout, PageHeader } from "@/components/layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { CriticalityBadge, StatusBadge } from "@/components/status-badge";
import { Search, Shield } from "lucide-react";

function Tbl({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {headers.map((h) => (
              <th key={h} className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function Td({ children, mono }: { children: React.ReactNode; mono?: boolean }) {
  return <td className={`py-2 px-3 text-sm border-b border-border/50 ${mono ? "font-mono" : ""}`}>{children}</td>;
}

function WorkspacesTab() {
  const { data, isLoading } = useListWorkspaces();
  const [q, setQ] = useState("");
  const rows = data?.filter((w) =>
    !q || w.workspace_name.toLowerCase().includes(q) || w.business_domain.toLowerCase().includes(q)
  );

  return (
    <div>
      <div className="px-4 py-3">
        <div className="relative max-w-xs">
          <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
          <Input placeholder="Filter workspaces..." className="pl-8 h-8 text-sm" value={q} onChange={(e) => setQ(e.target.value.toLowerCase())} />
        </div>
      </div>
      {isLoading ? <div className="px-4"><Skeleton className="h-48" /></div> : (
        <Tbl headers={["Workspace", "Domain", "Env", "SQL Pools", "Spark Pools", "Cost/mo", "Candidate", "Criticality"]}>
          {rows?.map((w) => (
            <tr key={w.workspace_id} className="hover:bg-muted/30 transition-colors">
              <Td><span className="font-mono text-xs text-cyan-400">{w.workspace_name}</span></Td>
              <Td>{w.business_domain}</Td>
              <Td><span className="text-xs bg-muted px-1.5 py-0.5 rounded">{w.environment}</span></Td>
              <Td mono>{w.sql_pool_count}</Td>
              <Td mono>{w.spark_pool_count}</Td>
              <Td><span className="font-mono text-amber-400">£{w.estimated_monthly_cost.toLocaleString()}</span></Td>
              <Td>
                <span className={`text-xs font-medium ${w.migration_candidate ? "text-emerald-400" : "text-muted-foreground"}`}>
                  {w.migration_candidate ? "Yes" : "No"}
                </span>
              </Td>
              <Td><CriticalityBadge criticality={w.criticality} /></Td>
            </tr>
          ))}
        </Tbl>
      )}
    </div>
  );
}

function PipelinesTab() {
  const { data, isLoading } = useListPipelines();
  const [q, setQ] = useState("");
  const rows = data?.filter((p) =>
    !q || p.pipeline_name.toLowerCase().includes(q) || p.business_domain.toLowerCase().includes(q)
  );

  return (
    <div>
      <div className="px-4 py-3">
        <div className="relative max-w-xs">
          <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
          <Input placeholder="Filter pipelines..." className="pl-8 h-8 text-sm" value={q} onChange={(e) => setQ(e.target.value.toLowerCase())} />
        </div>
      </div>
      {isLoading ? <div className="px-4"><Skeleton className="h-48" /></div> : (
        <Tbl headers={["Pipeline", "Domain", "Source", "Target", "Complexity", "Activities", "Deps", "Avg Runtime", "Last Run"]}>
          {rows?.map((p) => (
            <tr key={p.pipeline_id} className="hover:bg-muted/30 transition-colors">
              <Td><span className="font-mono text-xs text-violet-400">{p.pipeline_name}</span></Td>
              <Td>{p.business_domain}</Td>
              <Td><span className="text-xs text-muted-foreground">{p.source_system}</span></Td>
              <Td><span className="text-xs text-muted-foreground truncate max-w-[120px] block">{p.target_system}</span></Td>
              <Td>
                <span className={`text-xs font-medium ${
                  p.complexity === "high" ? "text-red-400" : p.complexity === "medium" ? "text-amber-400" : "text-emerald-400"
                }`}>{p.complexity}</span>
              </Td>
              <Td mono>{p.activity_count}</Td>
              <Td mono>{p.dependency_count}</Td>
              <Td><span className="font-mono text-xs">{p.average_runtime_minutes}m</span></Td>
              <Td><StatusBadge status={p.last_run_status} /></Td>
            </tr>
          ))}
        </Tbl>
      )}
    </div>
  );
}

function SqlObjectsTab() {
  const { data, isLoading } = useListSqlObjects();
  const [q, setQ] = useState("");
  const rows = data?.filter((o) =>
    !q || `${o.schema_name}.${o.object_name}`.toLowerCase().includes(q)
  );

  return (
    <div>
      <div className="px-4 py-3">
        <div className="relative max-w-xs">
          <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
          <Input placeholder="Filter objects..." className="pl-8 h-8 text-sm" value={q} onChange={(e) => setQ(e.target.value.toLowerCase())} />
        </div>
      </div>
      {isLoading ? <div className="px-4"><Skeleton className="h-48" /></div> : (
        <Tbl headers={["Object", "Type", "Rows", "Size", "Primary Key", "Partition", "Reports", "Sensitive"]}>
          {rows?.map((o) => (
            <tr key={o.object_id} className="hover:bg-muted/30 transition-colors">
              <Td><span className="font-mono text-xs text-emerald-400">{o.schema_name}.{o.object_name}</span></Td>
              <Td><span className="text-xs bg-muted px-1.5 py-0.5 rounded">{o.object_type}</span></Td>
              <Td mono>{o.row_count.toLocaleString()}</Td>
              <Td mono>{o.size_mb.toLocaleString()} MB</Td>
              <Td><span className="font-mono text-xs text-muted-foreground">{o.primary_key ?? "—"}</span></Td>
              <Td><span className="font-mono text-xs text-muted-foreground">{o.partition_column ?? "—"}</span></Td>
              <Td mono>{o.downstream_reports}</Td>
              <Td>
                {o.sensitive_data_flag
                  ? <span className="flex items-center gap-1 text-rose-400 text-xs"><Shield className="w-3 h-3" />PII</span>
                  : <span className="text-xs text-muted-foreground">—</span>
                }
              </Td>
            </tr>
          ))}
        </Tbl>
      )}
    </div>
  );
}

function ReportsTab() {
  const { data, isLoading } = useListReports();
  const [q, setQ] = useState("");
  const rows = data?.filter((r) =>
    !q || r.report_name.toLowerCase().includes(q) || r.workspace_name.toLowerCase().includes(q)
  );

  return (
    <div>
      <div className="px-4 py-3">
        <div className="relative max-w-xs">
          <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
          <Input placeholder="Filter reports..." className="pl-8 h-8 text-sm" value={q} onChange={(e) => setQ(e.target.value.toLowerCase())} />
        </div>
      </div>
      {isLoading ? <div className="px-4"><Skeleton className="h-48" /></div> : (
        <Tbl headers={["Report", "Workspace", "Dataset", "Refresh", "RLS", "DirectQuery", "Criticality"]}>
          {rows?.map((r) => (
            <tr key={r.report_id} className="hover:bg-muted/30 transition-colors">
              <Td><span className="font-medium text-foreground">{r.report_name}</span></Td>
              <Td><span className="text-xs text-muted-foreground">{r.workspace_name}</span></Td>
              <Td><span className="text-xs font-mono text-muted-foreground">{r.dataset_name}</span></Td>
              <Td><span className="text-xs bg-muted px-1.5 py-0.5 rounded">{r.refresh_frequency}</span></Td>
              <Td>
                <span className={`text-xs ${r.row_level_security ? "text-amber-400" : "text-muted-foreground"}`}>
                  {r.row_level_security ? "Yes" : "No"}
                </span>
              </Td>
              <Td>
                <span className={`text-xs ${r.direct_query_flag ? "text-rose-400" : "text-muted-foreground"}`}>
                  {r.direct_query_flag ? "Yes" : "No"}
                </span>
              </Td>
              <Td><CriticalityBadge criticality={r.criticality} /></Td>
            </tr>
          ))}
        </Tbl>
      )}
    </div>
  );
}

export default function Inventory() {
  return (
    <Layout>
      <PageHeader title="Inventory Browser" subtitle="All Synapse workspaces, pipelines, SQL objects, and Power BI reports" />
      <div className="p-6">
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <Tabs defaultValue="workspaces">
            <div className="border-b border-border px-4 pt-1">
              <TabsList className="bg-transparent border-none h-auto gap-1 p-0">
                {[
                  { value: "workspaces", label: "Workspaces" },
                  { value: "pipelines", label: "Pipelines" },
                  { value: "sql", label: "SQL Objects" },
                  { value: "reports", label: "Power BI Reports" },
                ].map(({ value, label }) => (
                  <TabsTrigger
                    key={value}
                    value={value}
                    className="text-xs rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent bg-transparent text-muted-foreground px-3 pb-2 pt-1"
                  >
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            <ScrollArea className="max-h-[calc(100vh-280px)]">
              <TabsContent value="workspaces" className="mt-0"><WorkspacesTab /></TabsContent>
              <TabsContent value="pipelines" className="mt-0"><PipelinesTab /></TabsContent>
              <TabsContent value="sql" className="mt-0"><SqlObjectsTab /></TabsContent>
              <TabsContent value="reports" className="mt-0"><ReportsTab /></TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
