import { Router, type IRouter, type Response } from "express";
import { DOMAINS, WORKSPACES, PIPELINES, SQL_OBJECTS, REPORTS } from "../lib/fabricshift/inventory.js";
import { computeMappingRun, getCachedResults, getCachedResultById } from "../lib/fabricshift/mapping.js";
import {
  DATA_PRODUCTS,
  getProductById,
  getContractById,
  getProfileById,
} from "../lib/fabricshift/dataproducts.js";
import {
  computeReadinessRun,
  getCachedReadinessResults,
  getCachedReadinessById,
} from "../lib/fabricshift/readiness.js";
import {
  runReconciliation,
  getCachedReconciliationRuns,
  getCachedReconciliationById,
} from "../lib/fabricshift/reconciliation.js";
import {
  getLineageGraph,
  getAssetLineage,
  runImpactAnalysis,
} from "../lib/fabricshift/lineage.js";
import {
  computeWavePlan,
  getCachedWaves,
  getCachedWaveById,
} from "../lib/fabricshift/waves.js";
import {
  generatePacket,
  getPacketById,
  getMarkdownById,
  getJsonById,
  getInventorySummary,
} from "../lib/fabricshift/reports.js";

const router: IRouter = Router();

const VALID_DOMAINS: Set<string> = new Set(DOMAINS.map((domain) => domain.domain_name));
const VALID_ASSET_IDS = new Set([
  ...PIPELINES.map((pipeline) => pipeline.pipeline_id),
  ...SQL_OBJECTS.map((object) => object.object_id),
  ...REPORTS.map((report) => report.report_id),
  ...DATA_PRODUCTS.map((product) => product.product_id),
]);

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string" && item.trim().length > 0);
}

function validateDomainFilter(value: unknown): string | null {
  if (value == null || value === "") return null;
  if (typeof value !== "string" || !VALID_DOMAINS.has(value)) {
    throw new Error("domain_filter must match a supported domain");
  }
  return value;
}

function validateAssetIds(value: unknown): string[] | null {
  if (value == null) return null;
  if (!isStringArray(value)) {
    throw new Error("asset_ids must be an array of strings");
  }
  const unknown = value.find((assetId) => !VALID_ASSET_IDS.has(assetId));
  if (unknown) {
    throw new Error(`Unknown asset_id: ${unknown}`);
  }
  return value;
}

function validateProductIds(value: unknown): string[] | null {
  if (value == null) return null;
  if (!isStringArray(value)) {
    throw new Error("product_ids must be an array of strings");
  }
  const validProductIds = new Set(DATA_PRODUCTS.map((product) => product.product_id));
  const unknown = value.find((productId) => !validProductIds.has(productId));
  if (unknown) {
    throw new Error(`Unknown product_id: ${unknown}`);
  }
  return value;
}

function validateMaxWaves(value: unknown): number | null {
  if (value == null) return null;
  if (typeof value !== "number" || !Number.isInteger(value) || value < 1 || value > 4) {
    throw new Error("max_waves must be an integer from 1 to 4");
  }
  return value;
}

function validatePacketTitle(value: unknown): string | null {
  if (value == null || value === "") return null;
  if (typeof value !== "string") {
    throw new Error("packet_title must be a string");
  }
  const title = value.trim();
  if (title.length < 4 || title.length > 120) {
    throw new Error("packet_title must be between 4 and 120 characters");
  }
  return title;
}

function badRequest(res: Response, message: string): void {
  res.status(400).json({ error: message });
}

router.get("/config", (_req, res): void => {
  res.json({
    version: "1.0.0",
    environment: process.env.NODE_ENV ?? "development",
    data_notice:
      "All inventory, contracts, and migration findings are reference fixtures. Not derived from a real Azure tenant.",
    domains_supported: ["Regulatory Reporting", "Claims Finance", "Retail Sales", "Customer Analytics", "Operations Monitoring"],
  });
});

// ── Inventory ────────────────────────────────────────────────────────────────

router.get("/inventory/summary", (_req, res): void => {
  res.json(getInventorySummary());
});

router.get("/inventory/domains", (_req, res): void => {
  res.json(DOMAINS);
});

router.get("/inventory/workspaces", (_req, res): void => {
  res.json(WORKSPACES);
});

router.get("/inventory/pipelines", (_req, res): void => {
  res.json(PIPELINES);
});

router.get("/inventory/sql-objects", (_req, res): void => {
  res.json(SQL_OBJECTS);
});

router.get("/inventory/reports", (_req, res): void => {
  res.json(REPORTS);
});

// ── Mapping ──────────────────────────────────────────────────────────────────

router.post("/mapping/fabric-targets", (req, res): void => {
  let domain_filter: string | null;
  let asset_ids: string[] | null;
  try {
    domain_filter = validateDomainFilter(req.body?.domain_filter);
    asset_ids = validateAssetIds(req.body?.asset_ids);
  } catch (error) {
    badRequest(res, error instanceof Error ? error.message : "Invalid mapping request");
    return;
  }

  const run = computeMappingRun({ domain_filter, asset_ids });
  res.json(run);
});

router.get("/mapping/results", (_req, res): void => {
  const results = getCachedResults();
  if (results.length === 0) computeMappingRun();
  res.json(getCachedResults());
});

router.get("/mapping/results/:mappingId", (req, res): void => {
  const raw = Array.isArray(req.params.mappingId) ? req.params.mappingId[0] : req.params.mappingId;
  if (getCachedResults().length === 0) computeMappingRun();
  const result = getCachedResultById(raw);
  if (!result) {
    res.status(404).json({ error: "Mapping result not found" });
    return;
  }
  res.json(result);
});

// ── Data Products ────────────────────────────────────────────────────────────

router.get("/data-products", (_req, res): void => {
  res.json(DATA_PRODUCTS);
});

router.get("/data-products/:productId", (req, res): void => {
  const raw = Array.isArray(req.params.productId) ? req.params.productId[0] : req.params.productId;
  const product = getProductById(raw);
  if (!product) {
    res.status(404).json({ error: "Data product not found" });
    return;
  }
  res.json(product);
});

router.get("/data-products/:productId/contract", (req, res): void => {
  const raw = Array.isArray(req.params.productId) ? req.params.productId[0] : req.params.productId;
  const contract = getContractById(raw);
  if (!contract) {
    res.status(404).json({ error: "Contract not found for this product" });
    return;
  }
  res.json(contract);
});

router.get("/data-products/:productId/profile", (req, res): void => {
  const raw = Array.isArray(req.params.productId) ? req.params.productId[0] : req.params.productId;
  const profile = getProfileById(raw);
  if (!profile) {
    res.status(404).json({ error: "Profile not found for this product" });
    return;
  }
  res.json(profile);
});

// ── Readiness ────────────────────────────────────────────────────────────────

router.post("/readiness/assess", (req, res): void => {
  const run = computeReadinessRun();
  res.json(run);
});

router.get("/readiness/results", (_req, res): void => {
  const results = getCachedReadinessResults();
  if (results.length === 0) computeReadinessRun();
  res.json(getCachedReadinessResults());
});

router.get("/readiness/results/:assessmentId", (req, res): void => {
  const raw = Array.isArray(req.params.assessmentId) ? req.params.assessmentId[0] : req.params.assessmentId;
  if (getCachedReadinessResults().length === 0) computeReadinessRun();
  const result = getCachedReadinessById(raw);
  if (!result) {
    res.status(404).json({ error: "Readiness result not found" });
    return;
  }
  res.json(result);
});

// ── Reconciliation ───────────────────────────────────────────────────────────

router.post("/reconciliation/run", (req, res): void => {
  let productIds: string[] | null;
  try {
    productIds = validateProductIds(req.body?.product_ids);
  } catch (error) {
    badRequest(res, error instanceof Error ? error.message : "Invalid reconciliation request");
    return;
  }

  const runs = runReconciliation(productIds);
  res.json(runs[0] ?? { error: "No products to reconcile" });
});

router.get("/reconciliation/results", (_req, res): void => {
  const runs = getCachedReconciliationRuns();
  if (runs.length === 0) runReconciliation();
  res.json(getCachedReconciliationRuns());
});

router.get("/reconciliation/results/:resultId", (req, res): void => {
  const raw = Array.isArray(req.params.resultId) ? req.params.resultId[0] : req.params.resultId;
  if (getCachedReconciliationRuns().length === 0) runReconciliation();
  const result = getCachedReconciliationById(raw);
  if (!result) {
    res.status(404).json({ error: "Reconciliation result not found" });
    return;
  }
  res.json(result);
});

// ── Lineage ──────────────────────────────────────────────────────────────────

router.get("/lineage", (_req, res): void => {
  res.json(getLineageGraph());
});

router.post("/lineage/impact", (req, res): void => {
  const { asset_id } = req.body ?? {};
  if (!asset_id) {
    res.status(400).json({ error: "asset_id is required" });
    return;
  }
  const result = runImpactAnalysis(asset_id);
  if (!result) {
    res.status(404).json({ error: "Asset not found in lineage graph" });
    return;
  }
  res.json(result);
});

router.get("/lineage/:assetId", (req, res): void => {
  const raw = Array.isArray(req.params.assetId) ? req.params.assetId[0] : req.params.assetId;
  const result = getAssetLineage(raw);
  if (!result) {
    res.status(404).json({ error: "Asset not found in lineage graph" });
    return;
  }
  res.json(result);
});

// ── Migration Waves ──────────────────────────────────────────────────────────

router.post("/migration-waves/plan", (req, res): void => {
  let domain_filter: string | null;
  let max_waves: number | null;
  try {
    domain_filter = validateDomainFilter(req.body?.domain_filter);
    max_waves = validateMaxWaves(req.body?.max_waves);
  } catch (error) {
    badRequest(res, error instanceof Error ? error.message : "Invalid wave plan request");
    return;
  }

  const plan = computeWavePlan({ domain_filter, max_waves });
  res.json(plan);
});

router.get("/migration-waves", (_req, res): void => {
  const waves = getCachedWaves();
  if (waves.length === 0) computeWavePlan();
  res.json(getCachedWaves());
});

router.get("/migration-waves/:waveId", (req, res): void => {
  const raw = Array.isArray(req.params.waveId) ? req.params.waveId[0] : req.params.waveId;
  if (getCachedWaves().length === 0) computeWavePlan();
  const wave = getCachedWaveById(raw);
  if (!wave) {
    res.status(404).json({ error: "Migration wave not found" });
    return;
  }
  res.json(wave);
});

// ── Reports ──────────────────────────────────────────────────────────────────

router.post("/reports/migration-readiness", (req, res): void => {
  let include_domains: string[] | null = null;
  let packet_title: string | null;
  try {
    if (req.body?.include_domains != null) {
      if (!isStringArray(req.body.include_domains)) {
        throw new Error("include_domains must be an array of strings");
      }
      const unknown = req.body.include_domains.find((domain: string) => !VALID_DOMAINS.has(domain));
      if (unknown) {
        throw new Error(`Unknown domain: ${unknown}`);
      }
      include_domains = req.body.include_domains;
    }
    packet_title = validatePacketTitle(req.body?.packet_title);
  } catch (error) {
    badRequest(res, error instanceof Error ? error.message : "Invalid report request");
    return;
  }

  const packet = generatePacket({ include_domains, packet_title });
  res.json(packet);
});

router.get("/reports/:reportId/markdown", (req, res): void => {
  const raw = Array.isArray(req.params.reportId) ? req.params.reportId[0] : req.params.reportId;
  const md = getMarkdownById(raw);
  if (!md) {
    res.status(404).json({ error: "Report not found. Generate a packet first via POST /reports/migration-readiness." });
    return;
  }
  res.json({ report_id: raw, format: "markdown", content: md, created_at: new Date().toISOString() });
});

router.get("/reports/:reportId/json", (req, res): void => {
  const raw = Array.isArray(req.params.reportId) ? req.params.reportId[0] : req.params.reportId;
  const json = getJsonById(raw);
  if (!json) {
    res.status(404).json({ error: "Report not found. Generate a packet first via POST /reports/migration-readiness." });
    return;
  }
  res.json({ report_id: raw, format: "json", content: json, created_at: new Date().toISOString() });
});

export default router;
