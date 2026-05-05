import { useState, useRef, useEffect, useCallback } from "react";
import { useGetLineageGraph, useGetAssetLineage, useRunImpactAnalysis, getGetAssetLineageQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Layout, PageHeader } from "@/components/layout";
import { MedallionBadge } from "@/components/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Zap } from "lucide-react";

const LAYER_ORDER = ["source", "pipeline", "bronze", "silver", "gold", "product", "report"];
const LAYER_COLORS: Record<string, string> = {
  source:   "#6b7280",
  pipeline: "#fbbf24",
  bronze:   "#f97316",
  silver:   "#94a3b8",
  gold:     "#eab308",
  product:  "#34d399",
  report:   "#f472b6",
};

interface NodePos { x: number; y: number; node: { node_id: string; node_name: string; node_type: string; layer: string; business_domain: string; owner?: string | null } }

export default function Lineage() {
  const { data: graph, isLoading } = useGetLineageGraph();
  const qc = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(0.85);
  const dragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const assetLineage = useGetAssetLineage(selectedId ?? "", {
    query: { enabled: !!selectedId, queryKey: getGetAssetLineageQueryKey(selectedId ?? "") },
  });

  const impactMutation = useRunImpactAnalysis();

  const positions = useCallback((): NodePos[] => {
    if (!graph) return [];
    const byLayer: Record<string, typeof graph.nodes[0][]> = {};
    for (const n of graph.nodes) {
      const l = n.layer ?? "source";
      if (!byLayer[l]) byLayer[l] = [];
      byLayer[l].push(n);
    }
    const W = 160;
    const H = 80;
    const COLS = LAYER_ORDER.length;
    const result: NodePos[] = [];
    LAYER_ORDER.forEach((layer, colIdx) => {
      const nodes = byLayer[layer] ?? [];
      const colW = W;
      const totalH = nodes.length * H;
      nodes.forEach((n, rowIdx) => {
        result.push({
          x: 80 + colIdx * colW,
          y: 40 + rowIdx * H - totalH / 2 + 300,
          node: n,
        });
      });
    });
    return result;
  }, [graph]);

  const posMap = useCallback((): Map<string, { x: number; y: number }> => {
    const m = new Map<string, { x: number; y: number }>();
    for (const p of positions()) m.set(p.node.node_id, { x: p.x, y: p.y });
    return m;
  }, [positions]);

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    lastMouse.current = { x: e.clientX, y: e.clientY };
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current) return;
    setPan((p) => ({ x: p.x + e.clientX - lastMouse.current.x, y: p.y + e.clientY - lastMouse.current.y }));
    lastMouse.current = { x: e.clientX, y: e.clientY };
  };
  const onMouseUp = () => { dragging.current = false; };
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((z) => Math.min(2, Math.max(0.3, z - e.deltaY * 0.001)));
  };

  const highlightIds = new Set<string>();
  if (selectedId && assetLineage.data) {
    highlightIds.add(selectedId);
    assetLineage.data.upstream.forEach((n) => highlightIds.add(n.node_id));
    assetLineage.data.downstream.forEach((n) => highlightIds.add(n.node_id));
  }

  const pos = positions();
  const pm = posMap();
  const svgW = LAYER_ORDER.length * 160 + 160;
  const svgH = 800;

  return (
    <Layout>
      <PageHeader title="Data Lineage Graph" subtitle="End-to-end lineage from source systems to Power BI reports" />
      <div className="flex h-[calc(100vh-120px)]">
        {/* Graph */}
        <div className="flex-1 relative overflow-hidden bg-background/50">
          {isLoading ? (
            <div className="p-6"><Skeleton className="h-96" /></div>
          ) : !graph ? (
            <div className="p-6 text-center text-muted-foreground">No lineage data available.</div>
          ) : (
            <>
              {/* Layer labels */}
              <div className="absolute top-3 left-4 right-4 flex justify-around z-10 pointer-events-none">
                {LAYER_ORDER.map((layer) => (
                  <div key={layer} className="text-center" style={{ width: 120 }}>
                    <MedallionBadge layer={layer} className="text-[9px]" />
                  </div>
                ))}
              </div>

              <svg
                ref={svgRef}
                className="w-full h-full cursor-grab active:cursor-grabbing select-none"
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
                onWheel={onWheel}
              >
                <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
                  {/* Edges */}
                  {graph.edges.map((e) => {
                    const s = pm.get(e.source_id);
                    const t = pm.get(e.target_id);
                    if (!s || !t) return null;
                    const isHighlight = selectedId && (highlightIds.has(e.source_id) && highlightIds.has(e.target_id));
                    return (
                      <path
                        key={e.edge_id}
                        d={`M ${s.x + 56} ${s.y + 14} C ${(s.x + t.x) / 2 + 56} ${s.y + 14}, ${(s.x + t.x) / 2 + 56} ${t.y + 14}, ${t.x + 4} ${t.y + 14}`}
                        fill="none"
                        stroke={isHighlight ? "#22d3ee" : "hsl(222 16% 22%)"}
                        strokeWidth={isHighlight ? 1.5 : 0.8}
                        opacity={selectedId && !isHighlight ? 0.2 : 1}
                      />
                    );
                  })}

                  {/* Nodes */}
                  {pos.map(({ x, y, node }) => {
                    const color = LAYER_COLORS[node.layer] ?? "#6b7280";
                    const isSelected = node.node_id === selectedId;
                    const isDimmed = selectedId && !highlightIds.has(node.node_id);
                    return (
                      <g
                        key={node.node_id}
                        transform={`translate(${x}, ${y})`}
                        onClick={() => setSelectedId(isSelected ? null : node.node_id)}
                        className="cursor-pointer"
                        opacity={isDimmed ? 0.3 : 1}
                      >
                        <rect
                          x={4} y={4}
                          width={108} height={28}
                          rx={5}
                          fill={isSelected ? `${color}33` : "hsl(222 20% 12%)"}
                          stroke={isSelected ? color : "hsl(222 16% 22%)"}
                          strokeWidth={isSelected ? 1.5 : 0.8}
                        />
                        <circle cx={16} cy={18} r={4} fill={color} />
                        <text x={24} y={22} fontSize={9} fill={isSelected ? color : "#94a3b8"} fontFamily="JetBrains Mono, monospace" className="select-none">
                          {node.node_name.length > 14 ? node.node_name.slice(0, 13) + "…" : node.node_name}
                        </text>
                      </g>
                    );
                  })}
                </g>
              </svg>

              <div className="absolute bottom-4 right-4 flex gap-1.5 z-10">
                <button className="bg-card border border-border px-2 py-1 rounded text-xs text-muted-foreground hover:text-foreground" onClick={() => setZoom((z) => Math.min(2, z + 0.1))}>+</button>
                <button className="bg-card border border-border px-2 py-1 rounded text-xs text-muted-foreground hover:text-foreground" onClick={() => setZoom((z) => Math.max(0.3, z - 0.1))}>−</button>
                <button className="bg-card border border-border px-2 py-1 rounded text-xs text-muted-foreground hover:text-foreground" onClick={() => { setZoom(0.85); setPan({ x: 0, y: 0 }); }}>Reset</button>
              </div>
            </>
          )}
        </div>

        {/* Side panel */}
        {selectedId && (
          <div className="w-72 border-l border-border bg-card flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">Asset Detail</h3>
              <button onClick={() => setSelectedId(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <ScrollArea className="flex-1 p-4">
              {assetLineage.isLoading ? <Skeleton className="h-32" /> : assetLineage.data ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Asset</p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">{assetLineage.data.asset_name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1.5">Upstream ({assetLineage.data.upstream.length})</p>
                    {assetLineage.data.upstream.map((n) => (
                      <div key={n.node_id} className="flex items-center gap-1.5 py-1 border-b border-border/40 last:border-0">
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: LAYER_COLORS[n.layer] }} />
                        <span className="text-xs text-foreground truncate">{n.node_name}</span>
                      </div>
                    ))}
                    {assetLineage.data.upstream.length === 0 && <p className="text-xs text-muted-foreground">None</p>}
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1.5">Downstream ({assetLineage.data.downstream.length})</p>
                    {assetLineage.data.downstream.map((n) => (
                      <div key={n.node_id} className="flex items-center gap-1.5 py-1 border-b border-border/40 last:border-0">
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: LAYER_COLORS[n.layer] }} />
                        <span className="text-xs text-foreground truncate">{n.node_name}</span>
                      </div>
                    ))}
                    {assetLineage.data.downstream.length === 0 && <p className="text-xs text-muted-foreground">None</p>}
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => impactMutation.mutate({ data: { asset_id: selectedId! } })}
                    disabled={impactMutation.isPending}
                  >
                    <Zap className="w-3.5 h-3.5 mr-1.5" />
                    {impactMutation.isPending ? "Analysing..." : "Impact Analysis"}
                  </Button>

                  {impactMutation.data && (
                    <div className="bg-muted rounded-lg p-3 space-y-2">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Impact Result</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div><p className="text-[10px] text-muted-foreground">Pipelines</p><p className="text-sm font-mono text-amber-400">{impactMutation.data.impacted_pipelines.length}</p></div>
                        <div><p className="text-[10px] text-muted-foreground">Reports</p><p className="text-sm font-mono text-rose-400">{impactMutation.data.impacted_reports.length}</p></div>
                        <div><p className="text-[10px] text-muted-foreground">Products</p><p className="text-sm font-mono text-emerald-400">{impactMutation.data.impacted_data_products.length}</p></div>
                        <div><p className="text-[10px] text-muted-foreground">Risk</p><p className={`text-sm font-mono ${impactMutation.data.risk_level === "critical" ? "text-rose-400" : impactMutation.data.risk_level === "high" ? "text-red-400" : "text-amber-400"}`}>{impactMutation.data.risk_level}</p></div>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </ScrollArea>
          </div>
        )}
      </div>
    </Layout>
  );
}
