import { randomUUID } from "crypto";
import { DATA_PRODUCTS } from "./dataproducts.js";
import { getCachedReadinessResults } from "./readiness.js";

interface WavePlanRequest {
  domain_filter?: string | null;
  max_waves?: number | null;
}

const WAVE_CONFIGS = [
  {
    wave_number: 1,
    wave_name: "Foundation Wave — Low Risk Domains",
    domains: ["Retail Sales", "Operations Monitoring"],
    rationale:
      "Retail Sales and Operations Monitoring carry the lowest sensitivity, stable pipeline history, and complete ownership. These domains should be migrated first to establish Fabric Lakehouse patterns and validate the migration toolchain before higher-risk domains are tackled.",
    risk_notes: "Minimal PII. No critical regulatory dependencies. Safe wave to validate migration runbooks.",
    estimated_effort_band: "medium",
  },
  {
    wave_number: 2,
    wave_name: "Analytics Wave — Customer & Segmentation",
    domains: ["Customer Analytics"],
    rationale:
      "Customer Analytics carries sensitive PII but has lower regulatory criticality than Regulatory Reporting or Claims Finance. Migration in wave 2 allows PII governance controls to be validated on a non-critical domain before they are applied to critical domains.",
    risk_notes:
      "PII data classification and Fabric information protection labels must be validated before go-live.",
    estimated_effort_band: "medium",
  },
  {
    wave_number: 3,
    wave_name: "Regulatory Wave — Compliance Positions",
    domains: ["Regulatory Reporting"],
    rationale:
      "Regulatory Reporting requires the most thorough migration validation due to capital adequacy and counterparty data sensitivity. Migration in wave 3 benefits from runbook patterns proven in waves 1 and 2. Parallel reconciliation runs are mandatory before cutover.",
    risk_notes:
      "Critical domain. Requires sign-off from risk and compliance teams. Reconciliation evidence must be documented before cutover.",
    estimated_effort_band: "high",
  },
  {
    wave_number: 4,
    wave_name: "Claims Wave — Finance Critical Path",
    domains: ["Claims Finance"],
    rationale:
      "Claims Finance is blocked by pipeline failures and fraud model coverage gaps that must be resolved before migration. Scheduling in wave 4 provides time for Claims to resolve these blockers while other domains progress.",
    risk_notes:
      "Two pipelines in failed state. Fraud model null rate issue must be resolved. Reserve calculation pipeline has the highest complexity in the platform.",
    estimated_effort_band: "high",
  },
];

let cachedWaves: ReturnType<typeof buildWave>[] = [];

function buildWave(config: (typeof WAVE_CONFIGS)[0], request?: WavePlanRequest) {
  const readinessResults = getCachedReadinessResults();

  const products = DATA_PRODUCTS.filter((p) => {
    if (request?.domain_filter && p.business_domain !== request.domain_filter) return false;
    return config.domains.includes(p.business_domain);
  });

  const assets = products.map((p) => {
    const readiness = readinessResults.find((r) => r.asset_id === p.product_id);
    return {
      asset_id: p.product_id,
      asset_name: p.product_name,
      asset_type: "Data Product",
      business_domain: p.business_domain,
      readiness_score: readiness?.readiness_score ?? p.readiness_score,
      effort_band:
        readiness?.readiness_band === "ready"
          ? "low"
          : readiness?.readiness_band === "needs_review"
            ? "medium"
            : "high",
    };
  });

  const blockers = [
    ...new Set(
      products.flatMap((p) => {
        const r = readinessResults.find((x) => x.asset_id === p.product_id);
        return r?.blockers ?? [];
      }),
    ),
  ];

  const prerequisites =
    config.wave_number === 1
      ? ["Fabric capacity provisioned", "OneLake storage account configured", "Migration runbook reviewed"]
      : config.wave_number === 2
        ? ["Wave 1 completed and validated", "PII data classification labels configured in Fabric"]
        : config.wave_number === 3
          ? [
              "Wave 2 completed",
              "Reconciliation sign-off framework approved by Risk team",
              "Regulatory compliance team briefed",
            ]
          : [
              "Wave 3 completed and audited",
              "Claims Finance pipeline failures resolved",
              "Fraud model coverage gap remediated",
            ];

  return {
    wave_id: `wave-${config.wave_number}`,
    wave_number: config.wave_number,
    wave_name: config.wave_name,
    assets,
    rationale: config.rationale,
    blockers,
    prerequisites,
    estimated_effort_band: config.estimated_effort_band,
    risk_notes: config.risk_notes,
    domain_coverage: config.domains,
  };
}

export function computeWavePlan(request?: WavePlanRequest) {
  const waves = WAVE_CONFIGS.map((c) => buildWave(c, request));
  const filtered = request?.max_waves ? waves.slice(0, request.max_waves) : waves;

  cachedWaves = filtered;

  return {
    plan_id: randomUUID(),
    planned_at: new Date().toISOString(),
    total_waves: filtered.length,
    total_assets: filtered.reduce((acc, w) => acc + w.assets.length, 0),
    waves: filtered,
    planning_notes:
      "Wave plan is based on reference migration readiness scores, domain risk profiles, and dependency ordering from the FabricShift readiness engine. All timelines are represented as effort bands (low/medium/high) — actual calendar durations require validation against real tenant metadata and team capacity.",
  };
}

export function getCachedWaves() {
  if (cachedWaves.length === 0) computeWavePlan();
  return cachedWaves;
}

export function getCachedWaveById(waveId: string) {
  if (cachedWaves.length === 0) computeWavePlan();
  return cachedWaves.find((w) => w.wave_id === waveId);
}
