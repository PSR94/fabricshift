import { randomUUID } from "crypto";
import { WORKSPACES, PIPELINES, SQL_OBJECTS } from "./inventory.js";

interface MappingRequest {
  domain_filter?: string | null;
  asset_ids?: string[] | null;
}

export interface MappingResult {
  mapping_id: string;
  source_asset_id: string;
  source_asset_name: string;
  source_asset_type: string;
  business_domain: string;
  recommended_fabric_target: string;
  target_zone: string;
  migration_effort: string;
  risk_level: string;
  blockers: string[];
  recommended_action: string;
  rationale: string;
  medallion_layer: string;
}

function domainFromSchema(schema: string): string {
  const map: Record<string, string> = {
    reg: "Regulatory Reporting",
    claims: "Claims Finance",
    retail: "Retail Sales",
    customer: "Customer Analytics",
    ops: "Operations Monitoring",
  };
  return map[schema] ?? "Unknown";
}

function mapPipeline(p: (typeof PIPELINES)[0]): MappingResult {
  const isHighComplexity = p.complexity === "high";
  const hasManyDeps = p.dependency_count >= 4;
  const isEvent = p.trigger_type === "event";
  const isFailed = p.last_run_status === "failed";

  let risk_level = "low";
  let migration_effort = "low";
  let fabric_target = "Fabric Data Pipeline";
  const target_zone = "Bronze";
  const medallion_layer = "bronze";
  const blockers: string[] = [];
  let recommended_action =
    "Assess pipeline activities and map to Fabric Data Pipeline. Validate trigger compatibility.";
  let rationale =
    "Straightforward ingestion pipeline with low complexity. Map to Fabric Data Pipeline with minimal rework.";

  if (isHighComplexity) {
    migration_effort = "high";
    risk_level = "medium";
    fabric_target = "Fabric Data Pipeline + Dataflow Gen2";
    rationale =
      "High activity count requires decomposition into Fabric Data Pipeline orchestration with Dataflow Gen2 for transformation steps.";
  }

  if (hasManyDeps) {
    risk_level = isHighComplexity ? "high" : "medium";
    blockers.push("High dependency count — dependency ordering must be validated before migration.");
    rationale += " Upstream dependencies must be migrated first.";
  }

  if (isEvent) {
    blockers.push(
      "Event-based trigger — Fabric event-driven pipeline support must be verified for this trigger source.",
    );
    risk_level = "medium";
  }

  if (isFailed) {
    blockers.push(
      "Last run failed — pipeline stability must be resolved before migration to avoid propagating failures.",
    );
    risk_level = risk_level === "high" ? "critical" : "high";
  }

  if (p.average_runtime_minutes > 60) {
    migration_effort = "high";
    rationale +=
      " Long average runtime suggests complex transformations — consider Spark Notebook for heavy compute steps.";
  }

  return {
    mapping_id: `map-${p.pipeline_id}`,
    source_asset_id: p.pipeline_id,
    source_asset_name: p.pipeline_name,
    source_asset_type: "ADF Pipeline",
    business_domain: p.business_domain,
    recommended_fabric_target: fabric_target,
    target_zone,
    migration_effort,
    risk_level,
    blockers,
    recommended_action,
    rationale,
    medallion_layer,
  };
}

function mapSqlObject(o: (typeof SQL_OBJECTS)[0]): MappingResult {
  const isLarge = o.size_mb > 500;
  const hasSensitive = o.sensitive_data_flag;
  const isView = o.object_type === "view";
  const hasNoOwner = !o.owner;
  const hasDownstreamReports = o.downstream_reports > 3;

  let risk_level = "low";
  let migration_effort = "low";
  let fabric_target = "Fabric Lakehouse Delta Table";
  let target_zone = "Silver";
  let medallion_layer = "silver";
  const blockers: string[] = [];
  let recommended_action = "";
  let rationale = "";

  if (isView) {
    fabric_target = "Fabric Warehouse View";
    target_zone = "Gold";
    medallion_layer = "gold";
    recommended_action =
      "Re-implement as a semantic layer view or reporting mart in Fabric Warehouse Gold zone.";
    rationale =
      "Views typically represent aggregated or conformed entities. Map to Gold layer in Fabric Warehouse.";
  } else if (o.object_name.startsWith("stg_") || o.object_name.startsWith("raw_")) {
    target_zone = "Bronze";
    medallion_layer = "bronze";
    fabric_target = "Fabric Lakehouse Delta Table (Bronze)";
    recommended_action = "Land raw data to OneLake Bronze zone as Delta table. Preserve source schema.";
    rationale = "Staging/raw tables map to Bronze landing zone in the medallion architecture.";
  } else {
    recommended_action =
      "Migrate table to Fabric Lakehouse Silver zone as Delta table with partition strategy.";
    rationale =
      "Conformed fact/dimension tables map to Silver zone. Apply column-level data typing and null constraints.";
  }

  if (isLarge) {
    migration_effort = "high";
    risk_level = "medium";
    blockers.push(
      `Large table (${Math.round(o.size_mb)} MB) — validate OneLake partition strategy before migration.`,
    );
  }

  if (hasSensitive) {
    risk_level = risk_level === "low" ? "medium" : risk_level;
    blockers.push(
      "Sensitive data flag set — data classification and Fabric information protection labels required.",
    );
  }

  if (hasNoOwner) {
    blockers.push("No owner assigned — ownership must be established before migration.");
    risk_level = "high";
  }

  if (hasDownstreamReports) {
    blockers.push(
      "High downstream report dependency — report migration must be coordinated to prevent analytics outage.",
    );
    migration_effort = migration_effort === "low" ? "medium" : "high";
  }

  if (!o.primary_key && !isView) {
    blockers.push("No primary key — Delta table identity column strategy must be defined.");
    risk_level = risk_level === "low" ? "medium" : risk_level;
  }

  return {
    mapping_id: `map-${o.object_id}`,
    source_asset_id: o.object_id,
    source_asset_name: `${o.schema_name}.${o.object_name}`,
    source_asset_type: o.object_type === "view" ? "SQL View" : "SQL Table",
    business_domain: domainFromSchema(o.schema_name),
    recommended_fabric_target: fabric_target,
    target_zone,
    migration_effort,
    risk_level,
    blockers,
    recommended_action,
    rationale,
    medallion_layer,
  };
}

let cachedResults: MappingResult[] = [];

export function computeMappingRun(request?: MappingRequest) {
  const results: MappingResult[] = [];

  const pipelines = request?.domain_filter
    ? PIPELINES.filter((p) => p.business_domain === request.domain_filter)
    : PIPELINES;

  const sqlObjects = request?.domain_filter
    ? SQL_OBJECTS.filter((o) => domainFromSchema(o.schema_name) === request.domain_filter)
    : SQL_OBJECTS;

  for (const p of pipelines) {
    if (!request?.asset_ids || request.asset_ids.includes(p.pipeline_id)) {
      results.push(mapPipeline(p));
    }
  }

  for (const o of sqlObjects) {
    if (!request?.asset_ids || request.asset_ids.includes(o.object_id)) {
      results.push(mapSqlObject(o));
    }
  }

  const effort: Record<string, number> = { low: 0, medium: 0, high: 0 };
  const risk: Record<string, number> = { low: 0, medium: 0, high: 0, critical: 0 };
  for (const r of results) {
    effort[r.migration_effort] = (effort[r.migration_effort] ?? 0) + 1;
    risk[r.risk_level] = (risk[r.risk_level] ?? 0) + 1;
  }

  const run = {
    run_id: randomUUID(),
    run_at: new Date().toISOString(),
    total_mapped: results.length,
    results,
    effort_distribution: effort,
    risk_distribution: risk,
  };

  cachedResults = results;
  return run;
}

export function getCachedResults(): MappingResult[] {
  if (cachedResults.length === 0) {
    computeMappingRun();
  }
  return cachedResults;
}

export function getCachedResultById(mappingId: string): MappingResult | undefined {
  if (cachedResults.length === 0) {
    computeMappingRun();
  }
  return cachedResults.find((r) => r.mapping_id === mappingId);
}
