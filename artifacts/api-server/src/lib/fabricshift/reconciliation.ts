import { randomUUID } from "crypto";
import { DATA_PRODUCTS, DATA_PROFILES } from "./dataproducts.js";

interface SampleStats {
  sourceRows: number;
  targetRows: number;
  sourceBalance: number;
  targetBalance: number;
  sourceNullRate: number;
  targetNullRate: number;
  targetDuplicateKeys: number;
  regionDist: { src: Record<string, number>; tgt: Record<string, number> };
}

const SAMPLE_STATS: Record<string, SampleStats> = {
  "dp-reg-positions": {
    sourceRows: 48200,
    targetRows: 48187,
    sourceBalance: 2480340000,
    targetBalance: 2480335200,
    sourceNullRate: 0.001,
    targetNullRate: 0.002,
    targetDuplicateKeys: 0,
    regionDist: { src: {}, tgt: {} },
  },
  "dp-claims-payments": {
    sourceRows: 12480,
    targetRows: 12480,
    sourceBalance: 48200000,
    targetBalance: 48196500,
    sourceNullRate: 0.0,
    targetNullRate: 0.0,
    targetDuplicateKeys: 2,
    regionDist: { src: {}, tgt: {} },
  },
  "dp-retail-sales": {
    sourceRows: 92000,
    targetRows: 92000,
    sourceBalance: 18400000,
    targetBalance: 18400000,
    sourceNullRate: 0.0,
    targetNullRate: 0.0,
    targetDuplicateKeys: 0,
    regionDist: {
      src: { NORTH: 0.22, SOUTH: 0.19, EAST: 0.21, WEST: 0.18, ONLINE: 0.20 },
      tgt: { NORTH: 0.22, SOUTH: 0.19, EAST: 0.21, WEST: 0.18, ONLINE: 0.20 },
    },
  },
  "dp-customer-segments": {
    sourceRows: 67000,
    targetRows: 67000,
    sourceBalance: 0,
    targetBalance: 0,
    sourceNullRate: 0.005,
    targetNullRate: 0.005,
    targetDuplicateKeys: 0,
    regionDist: { src: {}, tgt: {} },
  },
  "dp-ops-health": {
    sourceRows: 142000,
    targetRows: 142000,
    sourceBalance: 0,
    targetBalance: 0,
    sourceNullRate: 0.0,
    targetNullRate: 0.0,
    targetDuplicateKeys: 0,
    regionDist: { src: {}, tgt: {} },
  },
};

function buildChecks(productId: string, stats: SampleStats) {
  const checks = [];

  const rowDelta = Math.abs(stats.targetRows - stats.sourceRows);
  const rowDeltaPct = rowDelta / stats.sourceRows;
  checks.push({
    check_id: `chk-${productId}-rowcount`,
    check_name: "Row Count Match",
    check_type: "row_count",
    passed: rowDeltaPct <= 0.001,
    severity: rowDeltaPct > 0.01 ? "critical" : rowDeltaPct > 0.001 ? "high" : "medium",
    expected_value: `${stats.sourceRows.toLocaleString()} rows`,
    observed_value: `${stats.targetRows.toLocaleString()} rows`,
    delta: `${rowDelta > 0 ? "-" : "+"}${rowDelta} rows (${(rowDeltaPct * 100).toFixed(4)}%)`,
    evidence: `Source: ${stats.sourceRows.toLocaleString()} | Target: ${stats.targetRows.toLocaleString()} | Delta: ${rowDelta} rows`,
    recommended_action:
      rowDeltaPct > 0
        ? "Investigate missing records in last pipeline batch. Replay from source if confirmed."
        : "No action required.",
  });

  checks.push({
    check_id: `chk-${productId}-pk`,
    check_name: "Primary Key Uniqueness",
    check_type: "duplicate_key",
    passed: stats.targetDuplicateKeys === 0,
    severity: stats.targetDuplicateKeys > 0 ? "critical" : "medium",
    expected_value: "0 duplicate keys",
    observed_value: `${stats.targetDuplicateKeys} duplicate keys`,
    delta: stats.targetDuplicateKeys > 0 ? `+${stats.targetDuplicateKeys} duplicates` : null,
    evidence: `Scanned primary key column across all ${stats.targetRows.toLocaleString()} target rows.`,
    recommended_action:
      stats.targetDuplicateKeys > 0
        ? "Identify duplicate key origins. Apply deduplication strategy — last-write-wins or error on conflict."
        : "No action required.",
  });

  const nullDelta = Math.abs(stats.targetNullRate - stats.sourceNullRate);
  checks.push({
    check_id: `chk-${productId}-null`,
    check_name: "Null Rate Comparison",
    check_type: "null_rate",
    passed: nullDelta <= 0.002,
    severity: nullDelta > 0.01 ? "high" : nullDelta > 0.002 ? "medium" : "low",
    expected_value: `≤${(stats.sourceNullRate * 100).toFixed(2)}% null rate`,
    observed_value: `${(stats.targetNullRate * 100).toFixed(2)}% null rate`,
    delta: `+${(nullDelta * 100).toFixed(3)}%`,
    evidence: `Source null rate: ${(stats.sourceNullRate * 100).toFixed(3)}% | Target null rate: ${(stats.targetNullRate * 100).toFixed(3)}%`,
    recommended_action:
      nullDelta > 0.002
        ? "Investigate NULL propagation in ETL transformation step. Check join cardinality."
        : "Within acceptable threshold.",
  });

  const balDelta = Math.abs(stats.targetBalance - stats.sourceBalance);
  const balPct = balDelta / (stats.sourceBalance || 1);
  checks.push({
    check_id: `chk-${productId}-balance`,
    check_name: "Numeric Balance Comparison",
    check_type: "balance_check",
    passed: balPct <= 0.005,
    severity: balPct > 0.01 ? "critical" : balPct > 0.005 ? "high" : "low",
    expected_value: `${stats.sourceBalance.toLocaleString("en-GB", { maximumFractionDigits: 0 })}`,
    observed_value: `${stats.targetBalance.toLocaleString("en-GB", { maximumFractionDigits: 0 })}`,
    delta: balDelta > 0 ? `-${balDelta.toLocaleString("en-GB", { maximumFractionDigits: 0 })} (${(balPct * 100).toFixed(4)}%)` : "0",
    evidence: `SUM of primary numeric column. Source: ${stats.sourceBalance.toLocaleString()} | Target: ${stats.targetBalance.toLocaleString()}`,
    recommended_action:
      balPct > 0.005
        ? "Investigate rounding or truncation in transformation. Check for partial row loads."
        : "Within tolerance.",
  });

  const profiles = DATA_PROFILES[productId];
  const daysSinceRefresh = profiles ? 0 : 3;
  checks.push({
    check_id: `chk-${productId}-freshness`,
    check_name: "Source Freshness Check",
    check_type: "freshness_comparison",
    passed: daysSinceRefresh <= 1,
    severity: daysSinceRefresh > 5 ? "high" : daysSinceRefresh > 1 ? "medium" : "low",
    expected_value: "Last load within 1 day",
    observed_value: `Last load ${daysSinceRefresh === 0 ? "today" : `${daysSinceRefresh} days ago`}`,
    delta: daysSinceRefresh > 0 ? `+${daysSinceRefresh} days` : null,
    evidence: `Profile date: ${(profiles as Record<string, string>)?.profile_date ?? "unknown"}`,
    recommended_action:
      daysSinceRefresh > 1
        ? "Verify pipeline schedule and confirm source availability."
        : "No action required.",
  });

  const { src, tgt } = stats.regionDist;
  if (Object.keys(src).length > 0) {
    const maxShift = Object.keys(src).reduce((max, k) => {
      return Math.max(max, Math.abs((tgt[k] ?? 0) - (src[k] ?? 0)));
    }, 0);
    checks.push({
      check_id: `chk-${productId}-catdist`,
      check_name: "Category Distribution Comparison",
      check_type: "category_distribution",
      passed: maxShift <= 0.05,
      severity: maxShift > 0.1 ? "high" : maxShift > 0.05 ? "medium" : "low",
      expected_value: "Max category shift ≤5%",
      observed_value: `Max observed shift: ${(maxShift * 100).toFixed(2)}%`,
      delta: `${(maxShift * 100).toFixed(2)}% max shift`,
      evidence: `Category distribution compared across region dimension.`,
      recommended_action:
        maxShift <= 0.05
          ? "Distributions are aligned."
          : "Investigate category mapping in transformation layer.",
    });
  }

  const checksumPassed = rowDeltaPct < 0.001 && stats.targetDuplicateKeys === 0 && balPct < 0.005;
  checks.push({
    check_id: `chk-${productId}-checksum`,
    check_name: "Composite Reconciliation Signal",
    check_type: "checksum",
    passed: checksumPassed,
    severity: checksumPassed ? "low" : "high",
    expected_value: "All primary checks pass",
    observed_value: checksumPassed ? "All clear" : "One or more checks failed",
    delta: null,
    evidence: `Composite of row count, balance, PK uniqueness, and null rate results.`,
    recommended_action: checksumPassed
      ? "Reconciliation signal is positive. Product can advance to readiness gate."
      : "Resolve individual check failures before advancing to migration wave.",
  });

  return checks;
}

type ReconciliationRun = NonNullable<ReturnType<typeof runSingle>>;

let cachedRuns: ReconciliationRun[] = [];

function runSingle(product: (typeof DATA_PRODUCTS)[0]) {
  const stats = SAMPLE_STATS[product.product_id];
  if (!stats) return null;

  const checks = buildChecks(product.product_id, stats);
  const passed = checks.filter((c) => c.passed).length;
  const failed = checks.filter((c) => !c.passed).length;

  return {
    result_id: `rec-${product.product_id}`,
    product_id: product.product_id,
    product_name: product.product_name,
    run_at: new Date().toISOString(),
    total_checks: checks.length,
    passed_checks: passed,
    failed_checks: failed,
    checks,
    overall_status: failed === 0 ? "passed" : failed <= 2 ? "warnings" : "failed",
  };
}

export function runReconciliation(productIds?: string[] | null) {
  const products = DATA_PRODUCTS.filter((p) => !productIds || productIds.includes(p.product_id));
  const runs = products.map(runSingle).filter(Boolean) as ReconciliationRun[];
  cachedRuns = runs;
  return runs;
}

export function getCachedReconciliationRuns() {
  if (cachedRuns.length === 0) runReconciliation();
  return cachedRuns;
}

export function getCachedReconciliationById(resultId: string) {
  if (cachedRuns.length === 0) runReconciliation();
  return cachedRuns.find((r) => r.result_id === resultId);
}
