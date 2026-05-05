import { randomUUID } from "crypto";
import { DATA_PRODUCTS } from "./dataproducts.js";
import { PIPELINES } from "./inventory.js";

interface Signal {
  signal: string;
  value: string;
  score_contribution: number;
  notes: string;
}

function scoreProduct(product: (typeof DATA_PRODUCTS)[0]) {
  const signals: Signal[] = [];
  let score = 0;

  if (product.has_contract) {
    signals.push({ signal: "data_contract_present", value: "true", score_contribution: 15, notes: "Data contract is defined for this product." });
    score += 15;
  } else {
    signals.push({ signal: "data_contract_present", value: "false", score_contribution: 0, notes: "No data contract found. Contract must be authored before migration." });
  }

  if (product.owner) {
    signals.push({ signal: "owner_present", value: product.owner, score_contribution: 10, notes: "Ownership is assigned and documented." });
    score += 10;
  } else {
    signals.push({ signal: "owner_present", value: "unassigned", score_contribution: 0, notes: "Owner not assigned. Escalate to domain lead." });
  }

  const medallionParts = [product.bronze_entities.length > 0, product.silver_entities.length > 0, product.gold_marts.length > 0];
  const medallionScore = medallionParts.filter(Boolean).length / 3;
  const medallionContrib = Math.round(medallionScore * 20);
  signals.push({ signal: "medallion_completeness", value: `${medallionParts.filter(Boolean).length}/3 layers defined`, score_contribution: medallionContrib, notes: "Bronze/Silver/Gold entity mapping completeness." });
  score += medallionContrib;

  const domainPipelines = PIPELINES.filter((p) => p.business_domain === product.business_domain);
  const failedPipelines = domainPipelines.filter((p) => p.last_run_status === "failed");
  if (failedPipelines.length === 0) {
    signals.push({ signal: "pipeline_stability", value: "all_passing", score_contribution: 15, notes: `All ${domainPipelines.length} pipelines in this domain have stable last run.` });
    score += 15;
  } else {
    const contrib = Math.max(0, 15 - failedPipelines.length * 8);
    signals.push({ signal: "pipeline_stability", value: `${failedPipelines.length} failed`, score_contribution: contrib, notes: `${failedPipelines.length} pipeline(s) in failed state: ${failedPipelines.map((p) => p.pipeline_name).join(", ")}` });
    score += contrib;
  }

  const freshnessDays: Record<string, number> = { "T+0 every 4 hours": 0, "Hourly": 0, "T+1 by 08:00 UTC": 1, "T+1 by 06:00 UTC": 1, "T+1 weekly refresh": 7 };
  const days = freshnessDays[product.freshness_target] ?? 3;
  const freshnessScore = days === 0 ? 10 : days <= 1 ? 8 : days <= 3 ? 5 : 2;
  signals.push({ signal: "source_freshness", value: product.freshness_target, score_contribution: freshnessScore, notes: `Freshness target: ${product.freshness_target}` });
  score += freshnessScore;

  const highComplexPipelines = domainPipelines.filter((p) => p.complexity === "high");
  const complexityPenalty = Math.min(15, highComplexPipelines.length * 5);
  if (complexityPenalty > 0) {
    signals.push({ signal: "pipeline_complexity", value: `${highComplexPipelines.length} high-complexity pipelines`, score_contribution: -complexityPenalty, notes: `High-complexity pipelines require detailed activity mapping: ${highComplexPipelines.map((p) => p.pipeline_name).join(", ")}` });
  } else {
    signals.push({ signal: "pipeline_complexity", value: "low-medium", score_contribution: 0, notes: "No high-complexity pipelines in this domain." });
  }
  score -= complexityPenalty;

  const highDepPipelines = domainPipelines.filter((p) => p.dependency_count >= 4);
  const depPenalty = Math.min(10, highDepPipelines.length * 5);
  if (depPenalty > 0) {
    signals.push({ signal: "dependency_risk", value: `${highDepPipelines.length} high-dep pipelines`, score_contribution: -depPenalty, notes: "High dependency counts require careful migration ordering." });
    score -= depPenalty;
  } else {
    signals.push({ signal: "dependency_risk", value: "low", score_contribution: 0, notes: "Dependency counts are manageable." });
  }

  const hasSensitive = ["Regulatory Reporting", "Claims Finance", "Customer Analytics"].includes(product.business_domain);
  if (hasSensitive && !product.has_contract) {
    signals.push({ signal: "sensitive_data_classification", value: "sensitive_without_contract", score_contribution: -5, notes: "Domain contains sensitive data but no contract — classification and governance gap." });
    score -= 5;
  } else if (hasSensitive && product.has_contract) {
    signals.push({ signal: "sensitive_data_classification", value: "sensitive_with_contract", score_contribution: 5, notes: "Sensitive data domain with an active contract in place." });
    score += 5;
  } else {
    signals.push({ signal: "sensitive_data_classification", value: "non_sensitive", score_contribution: 5, notes: "Domain does not carry PII or sensitive data flags." });
    score += 5;
  }

  score = Math.max(0, Math.min(100, score));

  const band = score >= 75 ? "ready" : score >= 50 ? "needs_review" : "blocked";

  const blockers: string[] = [];
  const risks: string[] = [];

  if (!product.has_contract) blockers.push("Data contract missing — required before migration can be scheduled.");
  if (failedPipelines.length > 0) blockers.push(`${failedPipelines.length} pipeline(s) in failed state — stability required before migration.`);
  if (hasSensitive && !product.has_contract) blockers.push("Sensitive data without classification contract — governance review required.");
  if (highComplexPipelines.length >= 3) risks.push("Multiple high-complexity pipelines — increased mapping effort expected.");
  if (highDepPipelines.length >= 2) risks.push("High inter-pipeline dependency count — sequencing risk if ordering is incorrect.");
  if (days >= 7) risks.push("Weekly refresh cadence — post-migration freshness SLA must be validated.");

  const archMap: Record<string, string> = {
    "Regulatory Reporting": "Fabric Lakehouse (Silver/Gold) + Fabric Warehouse for reporting marts + DirectLake semantic model",
    "Claims Finance": "Fabric Lakehouse (Bronze/Silver) + Fabric Warehouse Gold + Fabric Data Pipeline",
    "Retail Sales": "Fabric Lakehouse (all layers) + Fabric Data Pipeline + DirectLake semantic model",
    "Customer Analytics": "Fabric Lakehouse + Fabric Notebooks for ML pipelines + DirectLake semantic model",
    "Operations Monitoring": "Fabric Lakehouse + Fabric Data Pipeline + Fabric Real-Time Analytics (KQL)",
  };

  const waveMap: Record<string, number> = {
    "Retail Sales": 1,
    "Operations Monitoring": 1,
    "Customer Analytics": 2,
    "Regulatory Reporting": 3,
    "Claims Finance": 4,
  };

  return {
    assessment_id: `assess-${product.product_id}`,
    asset_id: product.product_id,
    asset_name: product.product_name,
    asset_type: "Data Product",
    business_domain: product.business_domain,
    readiness_score: parseFloat(score.toFixed(1)),
    readiness_band: band,
    blockers,
    risks,
    recommended_target_architecture: archMap[product.business_domain] ?? "Fabric Lakehouse + Fabric Data Pipeline",
    suggested_migration_wave: waveMap[product.business_domain] ?? 3,
    evidence: signals,
  };
}

let cachedResults: ReturnType<typeof scoreProduct>[] = [];

export function computeReadinessRun() {
  const results = DATA_PRODUCTS.map(scoreProduct);

  const dist = { ready: 0, needs_review: 0, blocked: 0 };
  for (const r of results) {
    dist[r.readiness_band as keyof typeof dist]++;
  }

  const totalBlockers = results.reduce((acc, r) => acc + r.blockers.length, 0);

  cachedResults = results;

  return {
    run_id: randomUUID(),
    run_at: new Date().toISOString(),
    total_assessed: results.length,
    results,
    distribution: dist,
    total_blockers: totalBlockers,
  };
}

export function getCachedReadinessResults() {
  if (cachedResults.length === 0) computeReadinessRun();
  return cachedResults;
}

export function getCachedReadinessById(assessmentId: string) {
  if (cachedResults.length === 0) computeReadinessRun();
  return cachedResults.find((r) => r.assessment_id === assessmentId);
}
