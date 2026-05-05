import { randomUUID } from "crypto";
import { DOMAINS, WORKSPACES, PIPELINES, SQL_OBJECTS, REPORTS } from "./inventory.js";
import { DATA_PRODUCTS } from "./dataproducts.js";
import { getCachedReadinessResults, computeReadinessRun } from "./readiness.js";
import { computeMappingRun } from "./mapping.js";
import { computeWavePlan } from "./waves.js";

interface PacketRequest {
  include_domains?: string[] | null;
  packet_title?: string | null;
}

const cachedPackets = new Map<string, ReturnType<typeof buildPacket>>();
const cachedMarkdown = new Map<string, string>();

export function getInventorySummary() {
  let readinessResults = getCachedReadinessResults();
  if (readinessResults.length === 0) {
    readinessResults = computeReadinessRun().results;
  }

  const dist = { ready: 0, needs_review: 0, blocked: 0 };
  for (const r of readinessResults) {
    dist[r.readiness_band as keyof typeof dist]++;
  }

  const totalBlockers = readinessResults.reduce((acc, r) => acc + r.blockers.length, 0);
  const totalCost = WORKSPACES.reduce((acc, w) => acc + w.estimated_monthly_cost, 0);
  const candidates = WORKSPACES.filter((w) => w.migration_candidate).length;

  return {
    total_workspaces: WORKSPACES.length,
    total_pipelines: PIPELINES.length,
    total_sql_objects: SQL_OBJECTS.length,
    total_reports: REPORTS.length,
    total_data_products: DATA_PRODUCTS.length,
    total_domains: DOMAINS.length,
    readiness_distribution: dist,
    critical_blockers: totalBlockers,
    estimated_total_monthly_cost: totalCost,
    migration_candidates: candidates,
    top_domain_by_complexity: "Regulatory Reporting",
    first_wave_candidates: 2,
  };
}

function buildMarkdown(packet: ReturnType<typeof buildPacket>): string {
  const lines: string[] = [];
  lines.push(`# ${packet.packet_title}`);
  lines.push(`\n> **Data note:** ${packet.data_notice}\n`);
  lines.push(`**Created:** ${new Date(packet.created_at).toUTCString()}  `);
  lines.push(`**Report ID:** \`${packet.packet_id}\``);
  lines.push("\n---\n");
  lines.push("## Executive Summary");
  lines.push(`\n${packet.summary}\n`);
  lines.push("## Domains Assessed");
  for (const d of packet.domains_assessed) lines.push(`- ${d}`);
  lines.push("\n## Inventory Summary");
  const s = packet.inventory_summary;
  lines.push(`| Metric | Count |`);
  lines.push(`|---|---|`);
  lines.push(`| Synapse Workspaces | ${s.total_workspaces} |`);
  lines.push(`| ADF Pipelines | ${s.total_pipelines} |`);
  lines.push(`| SQL Objects | ${s.total_sql_objects} |`);
  lines.push(`| Power BI Reports | ${s.total_reports} |`);
  lines.push(`| Data Products | ${s.total_data_products} |`);
  lines.push(`| Estimated Monthly Cost | £${s.estimated_total_monthly_cost.toLocaleString()} |`);
  lines.push("\n## Readiness Distribution");
  lines.push(`| Band | Products |`);
  lines.push(`|---|---|`);
  lines.push(`| Ready | ${packet.readiness_distribution.ready} |`);
  lines.push(`| Needs Review | ${packet.readiness_distribution.needs_review} |`);
  lines.push(`| Blocked | ${packet.readiness_distribution.blocked} |`);
  lines.push(`\n**Total blockers identified:** ${packet.total_blockers}  `);
  lines.push(`**Total assets mapped:** ${packet.total_mapped_assets}  `);
  lines.push(`**Migration waves planned:** ${packet.total_waves}`);
  lines.push("\n## Key Risks");
  for (const r of packet.key_risks) lines.push(`- ${r}`);
  lines.push("\n## Recommended Next Actions");
  for (const a of packet.recommended_next_actions) lines.push(`1. ${a}`);
  lines.push("\n## Assumptions");
  for (const a of packet.assumptions) lines.push(`- ${a}`);
  lines.push("\n---");
  lines.push(
    "\n*This packet was created by FabricShift using reference metadata. All findings require validation against real tenant data before any migration decision is made.*",
  );
  return lines.join("\n");
}

function buildPacket(request?: PacketRequest) {
  let readiness = getCachedReadinessResults();
  if (readiness.length === 0) readiness = computeReadinessRun().results;
  const mapping = computeMappingRun();
  const wavePlan = computeWavePlan();
  const summary = getInventorySummary();
  const domains = DOMAINS.map((d) => d.domain_name);
  const title = request?.packet_title ?? "FabricShift Migration Readiness Packet — Reference Assessment";

  const dist = { ready: 0, needs_review: 0, blocked: 0 };
  for (const r of readiness) {
    dist[r.readiness_band as keyof typeof dist]++;
  }

  return {
    packet_id: randomUUID(),
    created_at: new Date().toISOString(),
    packet_title: title,
    summary:
      `This assessment covers ${domains.length} reference legacy domains across ${summary.total_workspaces} Synapse workspaces, ` +
      `${summary.total_pipelines} ADF pipelines, ${summary.total_sql_objects} SQL objects, and ${summary.total_reports} Power BI reports. ` +
      `${dist.ready} of ${readiness.length} data products are assessed as ready for migration, ${dist.needs_review} require review, and ${dist.blocked} are currently blocked. ` +
      `${readiness.reduce((a, r) => a + r.blockers.length, 0)} blockers were identified across the platform. A ${wavePlan.total_waves}-wave migration plan has been created.`,
    domains_assessed: domains,
    inventory_summary: summary,
    readiness_distribution: dist,
    total_blockers: readiness.reduce((a, r) => a + r.blockers.length, 0),
    total_mapped_assets: mapping.total_mapped,
    total_waves: wavePlan.total_waves,
    key_risks: [
      "Claims Finance domain has 2 pipelines in failed state — migration blocked until stability is restored.",
      "Regulatory Reporting carries critical sensitivity — PII/capital data requires classification labels before Fabric migration.",
      "High-complexity pipelines (activity count >18) require detailed decomposition mapping — underestimation risk.",
      "DirectQuery Power BI reports must be re-evaluated for Direct Lake compatibility before semantic model migration.",
      "Pipeline dependency ordering across domains not yet validated — cross-domain dependency risk in waves 3 and 4.",
    ],
    recommended_next_actions: [
      "Resolve Claims Finance pipeline failures (PL_CLAIMS_PAYMENTS_INGEST, PL_CLAIMS_FRAUD_SCORE) before scheduling Wave 4.",
      "Author data contracts for Customer Analytics and Operations Monitoring data products.",
      "Provision Fabric capacity and validate OneLake storage account connectivity before Wave 1.",
      "Run schema drift checks on all Silver-layer SQL objects against proposed Fabric Lakehouse Delta schemas.",
      "Engage Regulatory Reporting compliance team to obtain sign-off on reconciliation evidence framework.",
      "Evaluate all DirectQuery reports for Direct Lake semantic model readiness — identify any incompatible DAX patterns.",
    ],
    assumptions: [
      "All pipeline metadata is reference data and does not represent a real Azure Data Factory deployment.",
      "Row counts, cost estimates, and performance metrics are illustrative and should not be used for capacity planning.",
      "Data contracts are authored as examples — real contracts require formal review by domain data owners.",
      "Reconciliation sample datasets contain 90-day reference windows — production validation requires full historical data.",
      "Migration wave sequencing assumes all wave prerequisites are met before each wave begins.",
      "Effort bands (low/medium/high) are indicative — actual effort requires detailed technical scoping.",
    ],
    data_notice:
      "All inventory, contracts, sample datasets, and migration findings in this packet are reference fixtures. They are not derived from a real Azure tenant.",
  };
}

export function generatePacket(request?: PacketRequest) {
  const packet = buildPacket(request);
  cachedPackets.set(packet.packet_id, packet);
  cachedMarkdown.set(packet.packet_id, buildMarkdown(packet));
  return packet;
}

export function getPacketById(packetId: string) {
  return cachedPackets.get(packetId);
}

export function getMarkdownById(packetId: string) {
  return cachedMarkdown.get(packetId);
}

export function getJsonById(packetId: string) {
  const packet = cachedPackets.get(packetId);
  if (!packet) return undefined;
  return JSON.stringify(packet, null, 2);
}
