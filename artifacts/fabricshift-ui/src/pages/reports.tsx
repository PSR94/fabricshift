import { useState } from "react";
import { useGenerateMigrationPacket, useGetReportMarkdown, useGetReportJson } from "@workspace/api-client-react";
import { getGetReportMarkdownQueryKey, getGetReportJsonQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Layout, PageHeader } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Download, AlertTriangle, Info, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { MigrationPacket } from "@workspace/api-client-react";

export default function Reports() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const generatePacket = useGenerateMigrationPacket();
  const [packetId, setPacketId] = useState<string | null>(null);
  const packet = generatePacket.data as MigrationPacket | undefined;

  const markdown = useGetReportMarkdown(packetId ?? "", {
    query: { enabled: !!packetId, queryKey: getGetReportMarkdownQueryKey(packetId ?? "") },
  });
  const json = useGetReportJson(packetId ?? "", {
    query: { enabled: !!packetId, queryKey: getGetReportJsonQueryKey(packetId ?? "") },
  });

  function handleGenerate() {
    generatePacket.mutate(
      { data: { packet_title: "FabricShift Migration Readiness Packet — Reference Assessment" } },
      {
        onSuccess: (data) => {
          const d = data as MigrationPacket;
          if (d?.packet_id) {
            setPacketId(d.packet_id);
            qc.invalidateQueries({ queryKey: getGetReportMarkdownQueryKey(d.packet_id) });
            qc.invalidateQueries({ queryKey: getGetReportJsonQueryKey(d.packet_id) });
          }
        },
      }
    );
  }

  function downloadText(content: string, filename: string, type: string) {
    const blob = new Blob([content], { type });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function copyText(content: string, label: string) {
    navigator.clipboard.writeText(content).then(() => {
      toast({ title: "Copied", description: `${label} copied to clipboard.` });
    });
  }

  const mdContent = (markdown.data as unknown as { content?: string })?.content ?? (markdown.data as unknown as string) ?? "";
  const jsonContent = (json.data as unknown as { content?: string })?.content ?? (json.data as unknown as string) ?? "";

  return (
    <Layout>
      <PageHeader
        title="Migration Readiness Report"
        subtitle="Generate a full migration readiness packet with findings, risks, and recommendations"
        action={
          <Button size="sm" onClick={handleGenerate} disabled={generatePacket.isPending}>
            <Play className="w-3.5 h-3.5 mr-1.5" />
            {generatePacket.isPending ? "Generating..." : "Generate Packet"}
          </Button>
        }
      />

      <div className="p-6 space-y-4">
        {!packet && !generatePacket.isPending && (
          <div className="bg-card border border-border rounded-lg p-10 text-center">
            <p className="text-sm text-muted-foreground mb-4">Generate a migration readiness packet to see a full assessment summary, key risks, and recommended next actions.</p>
            <Button onClick={handleGenerate} disabled={generatePacket.isPending}>
              <Play className="w-3.5 h-3.5 mr-1.5" />
              Generate Packet
            </Button>
          </div>
        )}

        {generatePacket.isPending && <Skeleton className="h-64" />}

        {packet && (
          <>
            {/* Summary */}
            <div className="bg-card border border-border rounded-lg p-5">
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-sm font-semibold text-foreground">{packet.packet_title}</h2>
                <span className="text-[10px] text-muted-foreground font-mono">{packet.packet_id?.slice(0, 8)}</span>
              </div>
              <p className="text-xs text-foreground leading-relaxed">{packet.summary}</p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Total Blockers", value: packet.total_blockers, color: "text-red-400" },
                { label: "Mapped Assets", value: packet.total_mapped_assets, color: "text-cyan-400" },
                { label: "Waves Planned", value: packet.total_waves, color: "text-violet-400" },
                { label: "Domains Assessed", value: packet.domains_assessed.length, color: "text-emerald-400" },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-card border border-border rounded-lg p-4">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className={`text-2xl font-mono font-semibold mt-1 ${color}`}>{value}</p>
                </div>
              ))}
            </div>

            {/* Key Risks, Actions, Assumptions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="bg-card border border-border rounded-lg p-5">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Key Risks</h3>
                <ul className="space-y-2">
                  {packet.key_risks.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs">
                      <AlertTriangle className="w-3 h-3 text-amber-400 mt-0.5 shrink-0" />
                      <span className="text-foreground">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-card border border-border rounded-lg p-5">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Recommended Next Actions</h3>
                <ol className="space-y-2">
                  {packet.recommended_next_actions.map((a, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs">
                      <span className="font-mono text-cyan-400 shrink-0 w-4">{i + 1}.</span>
                      <span className="text-foreground">{a}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="bg-card border border-border rounded-lg p-5">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Assumptions</h3>
                <ul className="space-y-2">
                  {packet.assumptions.map((a, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs">
                      <Info className="w-3 h-3 text-muted-foreground mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-3 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-400">{packet.data_notice}</p>
            </div>

            {packetId && (
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <Tabs defaultValue="markdown">
                  <div className="border-b border-border px-4 pt-1 flex items-center justify-between">
                    <TabsList className="bg-transparent border-none h-auto gap-1 p-0">
                      <TabsTrigger value="markdown" className="text-xs rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent bg-transparent text-muted-foreground px-3 pb-2 pt-1">
                        Markdown
                      </TabsTrigger>
                      <TabsTrigger value="json" className="text-xs rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent bg-transparent text-muted-foreground px-3 pb-2 pt-1">
                        JSON
                      </TabsTrigger>
                    </TabsList>
                    <div className="flex gap-1.5 py-1">
                      <Button size="sm" variant="ghost" className="h-7 text-xs gap-1.5" onClick={() => mdContent && copyText(mdContent, "Markdown")}>
                        <Copy className="w-3 h-3" />Copy
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 text-xs gap-1.5" onClick={() => mdContent && downloadText(mdContent, "fabricshift-report.md", "text/markdown")}>
                        <Download className="w-3 h-3" />Export .md
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 text-xs gap-1.5" onClick={() => jsonContent && downloadText(jsonContent, "fabricshift-report.json", "application/json")}>
                        <Download className="w-3 h-3" />Export .json
                      </Button>
                    </div>
                  </div>
                  <TabsContent value="markdown" className="mt-0">
                    {markdown.isLoading ? <div className="p-4"><Skeleton className="h-48" /></div> : (
                      <ScrollArea className="h-64">
                        <pre className="p-4 text-xs font-mono text-foreground whitespace-pre-wrap leading-relaxed">{mdContent}</pre>
                      </ScrollArea>
                    )}
                  </TabsContent>
                  <TabsContent value="json" className="mt-0">
                    {json.isLoading ? <div className="p-4"><Skeleton className="h-48" /></div> : (
                      <ScrollArea className="h-64">
                        <pre className="p-4 text-xs font-mono text-foreground whitespace-pre-wrap leading-relaxed">{jsonContent}</pre>
                      </ScrollArea>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
