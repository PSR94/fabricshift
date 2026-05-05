const NODES = [
  { node_id: "src-oracle", node_name: "Oracle Financials", node_type: "source_system", business_domain: "Regulatory Reporting", layer: "source", owner: "IT Operations" },
  { node_id: "src-risk", node_name: "Risk Platform", node_type: "source_system", business_domain: "Regulatory Reporting", layer: "source", owner: "Risk Technology" },
  { node_id: "src-pms", node_name: "Policy Management System", node_type: "source_system", business_domain: "Claims Finance", layer: "source", owner: "Policy IT" },
  { node_id: "src-ml", node_name: "ML Platform", node_type: "source_system", business_domain: "Claims Finance", layer: "source", owner: "Data Science" },
  { node_id: "src-pos", node_name: "POS System", node_type: "source_system", business_domain: "Retail Sales", layer: "source", owner: "Retail IT" },
  { node_id: "src-erp", node_name: "ERP", node_type: "source_system", business_domain: "Retail Sales", layer: "source", owner: "ERP Team" },
  { node_id: "src-crm", node_name: "CRM", node_type: "source_system", business_domain: "Customer Analytics", layer: "source", owner: "CRM Team" },
  { node_id: "src-azure-monitor", node_name: "Azure Monitor", node_type: "source_system", business_domain: "Operations Monitoring", layer: "source", owner: "Platform Ops" },
  { node_id: "src-azure-cost", node_name: "Azure Cost Management", node_type: "source_system", business_domain: "Operations Monitoring", layer: "source", owner: "Platform Ops" },
  { node_id: "adf-001", node_name: "PL_REG_POSITIONS_DAILY", node_type: "adf_pipeline", business_domain: "Regulatory Reporting", layer: "pipeline", owner: "Priya Sharma" },
  { node_id: "adf-002", node_name: "PL_REG_CAPITAL_CALC", node_type: "adf_pipeline", business_domain: "Regulatory Reporting", layer: "pipeline", owner: "Priya Sharma" },
  { node_id: "adf-003", node_name: "PL_CLAIMS_PAYMENTS_INGEST", node_type: "adf_pipeline", business_domain: "Claims Finance", layer: "pipeline", owner: "Marcus Chen" },
  { node_id: "adf-004", node_name: "PL_CLAIMS_RESERVE_CALC", node_type: "adf_pipeline", business_domain: "Claims Finance", layer: "pipeline", owner: "Marcus Chen" },
  { node_id: "adf-005", node_name: "PL_RETAIL_SALES_DAILY", node_type: "adf_pipeline", business_domain: "Retail Sales", layer: "pipeline", owner: "Fatima Al-Rashid" },
  { node_id: "adf-007", node_name: "PL_CUSTOMER_SEGMENTATION", node_type: "adf_pipeline", business_domain: "Customer Analytics", layer: "pipeline", owner: "James Okonkwo" },
  { node_id: "adf-008", node_name: "PL_OPS_COST_ATTRIBUTION", node_type: "adf_pipeline", business_domain: "Operations Monitoring", layer: "pipeline", owner: "Lin Wei" },
  { node_id: "adf-009", node_name: "PL_REG_COUNTERPARTY_EXPOSURE", node_type: "adf_pipeline", business_domain: "Regulatory Reporting", layer: "pipeline", owner: "Priya Sharma" },
  { node_id: "adf-010", node_name: "PL_CLAIMS_FRAUD_SCORE", node_type: "adf_pipeline", business_domain: "Claims Finance", layer: "pipeline", owner: "Marcus Chen" },
  { node_id: "sql-001", node_name: "reg.fact_positions", node_type: "sql_table", business_domain: "Regulatory Reporting", layer: "silver", owner: "Priya Sharma" },
  { node_id: "sql-002", node_name: "reg.dim_counterparty", node_type: "sql_table", business_domain: "Regulatory Reporting", layer: "silver", owner: "Priya Sharma" },
  { node_id: "sql-003", node_name: "reg.agg_capital_requirements", node_type: "sql_view", business_domain: "Regulatory Reporting", layer: "gold", owner: "Priya Sharma" },
  { node_id: "sql-004", node_name: "claims.fact_payments", node_type: "sql_table", business_domain: "Claims Finance", layer: "silver", owner: "Marcus Chen" },
  { node_id: "sql-005", node_name: "claims.dim_policy", node_type: "sql_table", business_domain: "Claims Finance", layer: "silver", owner: "Marcus Chen" },
  { node_id: "sql-006", node_name: "claims.agg_reserve_summary", node_type: "sql_view", business_domain: "Claims Finance", layer: "gold", owner: "Marcus Chen" },
  { node_id: "sql-007", node_name: "retail.fact_sales_orders", node_type: "sql_table", business_domain: "Retail Sales", layer: "silver", owner: "Fatima Al-Rashid" },
  { node_id: "sql-008", node_name: "retail.dim_product", node_type: "sql_table", business_domain: "Retail Sales", layer: "silver", owner: "Fatima Al-Rashid" },
  { node_id: "sql-009", node_name: "retail.agg_sales_by_region", node_type: "sql_view", business_domain: "Retail Sales", layer: "gold", owner: "Fatima Al-Rashid" },
  { node_id: "sql-010", node_name: "customer.fact_customer_events", node_type: "sql_table", business_domain: "Customer Analytics", layer: "silver", owner: "James Okonkwo" },
  { node_id: "sql-011", node_name: "customer.dim_customer", node_type: "sql_table", business_domain: "Customer Analytics", layer: "silver", owner: "James Okonkwo" },
  { node_id: "sql-012", node_name: "ops.fact_pipeline_runs", node_type: "sql_table", business_domain: "Operations Monitoring", layer: "silver", owner: "Lin Wei" },
  { node_id: "dp-reg-positions", node_name: "Regulatory Positions", node_type: "data_product", business_domain: "Regulatory Reporting", layer: "product", owner: "Priya Sharma" },
  { node_id: "dp-claims-payments", node_name: "Claims Payment Analytics", node_type: "data_product", business_domain: "Claims Finance", layer: "product", owner: "Marcus Chen" },
  { node_id: "dp-retail-sales", node_name: "Retail Sales Performance", node_type: "data_product", business_domain: "Retail Sales", layer: "product", owner: "Fatima Al-Rashid" },
  { node_id: "dp-customer-segments", node_name: "Customer Segment Analytics", node_type: "data_product", business_domain: "Customer Analytics", layer: "product", owner: "James Okonkwo" },
  { node_id: "dp-ops-health", node_name: "Operations Health", node_type: "data_product", business_domain: "Operations Monitoring", layer: "product", owner: "Lin Wei" },
  { node_id: "pbi-001", node_name: "Regulatory Capital Dashboard", node_type: "powerbi_report", business_domain: "Regulatory Reporting", layer: "report", owner: "Priya Sharma" },
  { node_id: "pbi-002", node_name: "Counterparty Exposure Monitor", node_type: "powerbi_report", business_domain: "Regulatory Reporting", layer: "report", owner: "Priya Sharma" },
  { node_id: "pbi-003", node_name: "Claims Payment Analysis", node_type: "powerbi_report", business_domain: "Claims Finance", layer: "report", owner: "Marcus Chen" },
  { node_id: "pbi-004", node_name: "Reserve Adequacy Report", node_type: "powerbi_report", business_domain: "Claims Finance", layer: "report", owner: "Marcus Chen" },
  { node_id: "pbi-005", node_name: "Retail Sales Performance", node_type: "powerbi_report", business_domain: "Retail Sales", layer: "report", owner: "Fatima Al-Rashid" },
  { node_id: "pbi-007", node_name: "Customer Segmentation View", node_type: "powerbi_report", business_domain: "Customer Analytics", layer: "report", owner: "James Okonkwo" },
  { node_id: "pbi-008", node_name: "Operations Health Monitor", node_type: "powerbi_report", business_domain: "Operations Monitoring", layer: "report", owner: "Lin Wei" },
];

const EDGES = [
  { edge_id: "e001", source_id: "src-oracle", target_id: "adf-001", relationship: "feeds" },
  { edge_id: "e002", source_id: "src-risk", target_id: "adf-009", relationship: "feeds" },
  { edge_id: "e003", source_id: "src-pms", target_id: "adf-003", relationship: "feeds" },
  { edge_id: "e004", source_id: "src-ml", target_id: "adf-010", relationship: "feeds" },
  { edge_id: "e005", source_id: "src-pos", target_id: "adf-005", relationship: "feeds" },
  { edge_id: "e006", source_id: "src-erp", target_id: "adf-005", relationship: "feeds" },
  { edge_id: "e007", source_id: "src-crm", target_id: "adf-007", relationship: "feeds" },
  { edge_id: "e008", source_id: "src-azure-monitor", target_id: "adf-008", relationship: "feeds" },
  { edge_id: "e009", source_id: "src-azure-cost", target_id: "adf-008", relationship: "feeds" },
  { edge_id: "e010", source_id: "adf-001", target_id: "sql-001", relationship: "writes_to" },
  { edge_id: "e011", source_id: "adf-009", target_id: "sql-002", relationship: "writes_to" },
  { edge_id: "e012", source_id: "adf-002", target_id: "sql-003", relationship: "produces" },
  { edge_id: "e013", source_id: "adf-003", target_id: "sql-004", relationship: "writes_to" },
  { edge_id: "e014", source_id: "adf-003", target_id: "sql-005", relationship: "writes_to" },
  { edge_id: "e015", source_id: "adf-004", target_id: "sql-006", relationship: "produces" },
  { edge_id: "e016", source_id: "adf-010", target_id: "sql-004", relationship: "enriches" },
  { edge_id: "e017", source_id: "adf-005", target_id: "sql-007", relationship: "writes_to" },
  { edge_id: "e018", source_id: "adf-005", target_id: "sql-008", relationship: "writes_to" },
  { edge_id: "e019", source_id: "adf-007", target_id: "sql-010", relationship: "writes_to" },
  { edge_id: "e020", source_id: "adf-007", target_id: "sql-011", relationship: "writes_to" },
  { edge_id: "e021", source_id: "adf-008", target_id: "sql-012", relationship: "writes_to" },
  { edge_id: "e022", source_id: "sql-001", target_id: "dp-reg-positions", relationship: "populates" },
  { edge_id: "e023", source_id: "sql-002", target_id: "dp-reg-positions", relationship: "populates" },
  { edge_id: "e024", source_id: "sql-003", target_id: "dp-reg-positions", relationship: "populates" },
  { edge_id: "e025", source_id: "sql-004", target_id: "dp-claims-payments", relationship: "populates" },
  { edge_id: "e026", source_id: "sql-005", target_id: "dp-claims-payments", relationship: "populates" },
  { edge_id: "e027", source_id: "sql-006", target_id: "dp-claims-payments", relationship: "populates" },
  { edge_id: "e028", source_id: "sql-007", target_id: "dp-retail-sales", relationship: "populates" },
  { edge_id: "e029", source_id: "sql-008", target_id: "dp-retail-sales", relationship: "populates" },
  { edge_id: "e030", source_id: "sql-009", target_id: "dp-retail-sales", relationship: "populates" },
  { edge_id: "e031", source_id: "sql-010", target_id: "dp-customer-segments", relationship: "populates" },
  { edge_id: "e032", source_id: "sql-011", target_id: "dp-customer-segments", relationship: "populates" },
  { edge_id: "e033", source_id: "sql-012", target_id: "dp-ops-health", relationship: "populates" },
  { edge_id: "e034", source_id: "dp-reg-positions", target_id: "pbi-001", relationship: "serves" },
  { edge_id: "e035", source_id: "dp-reg-positions", target_id: "pbi-002", relationship: "serves" },
  { edge_id: "e036", source_id: "dp-claims-payments", target_id: "pbi-003", relationship: "serves" },
  { edge_id: "e037", source_id: "dp-claims-payments", target_id: "pbi-004", relationship: "serves" },
  { edge_id: "e038", source_id: "dp-retail-sales", target_id: "pbi-005", relationship: "serves" },
  { edge_id: "e039", source_id: "dp-customer-segments", target_id: "pbi-007", relationship: "serves" },
  { edge_id: "e040", source_id: "dp-ops-health", target_id: "pbi-008", relationship: "serves" },
];

function buildAdjacency() {
  const outbound = new Map<string, string[]>();
  const inbound = new Map<string, string[]>();
  for (const e of EDGES) {
    if (!outbound.has(e.source_id)) outbound.set(e.source_id, []);
    if (!inbound.has(e.target_id)) inbound.set(e.target_id, []);
    outbound.get(e.source_id)!.push(e.target_id);
    inbound.get(e.target_id)!.push(e.source_id);
  }
  return { outbound, inbound };
}

function traverse(start: string, adj: Map<string, string[]>, maxDepth = 5): string[] {
  const visited = new Set<string>();
  const queue: [string, number][] = [[start, 0]];
  while (queue.length > 0) {
    const [cur, depth] = queue.shift()!;
    if (visited.has(cur) || depth >= maxDepth) continue;
    visited.add(cur);
    for (const n of adj.get(cur) ?? []) {
      if (!visited.has(n)) queue.push([n, depth + 1]);
    }
  }
  visited.delete(start);
  return Array.from(visited);
}

export function getLineageGraph() {
  return { nodes: NODES, edges: EDGES, total_nodes: NODES.length, total_edges: EDGES.length };
}

export function getAssetLineage(assetId: string) {
  const node = NODES.find((n) => n.node_id === assetId);
  if (!node) return null;

  const { outbound, inbound } = buildAdjacency();
  const upstreamIds = traverse(assetId, inbound);
  const downstreamIds = traverse(assetId, outbound);

  const upstream = upstreamIds.map((id) => NODES.find((n) => n.node_id === id)!).filter(Boolean);
  const downstream = downstreamIds.map((id) => NODES.find((n) => n.node_id === id)!).filter(Boolean);

  return {
    asset_id: assetId,
    asset_name: node.node_name,
    upstream,
    downstream,
    depth_upstream: upstream.length > 0 ? 3 : 0,
    depth_downstream: downstream.length > 0 ? 3 : 0,
  };
}

export function runImpactAnalysis(assetId: string) {
  const node = NODES.find((n) => n.node_id === assetId);
  if (!node) return null;

  const { outbound } = buildAdjacency();
  const downstreamIds = traverse(assetId, outbound);
  const downstream = downstreamIds.map((id) => NODES.find((n) => n.node_id === id)!).filter(Boolean);

  const pipelines = downstream.filter((n) => n.node_type === "adf_pipeline").map((n) => n.node_name);
  const targets = downstream.filter((n) => n.node_type.startsWith("sql_")).map((n) => n.node_name);
  const reports = downstream.filter((n) => n.node_type === "powerbi_report").map((n) => n.node_name);
  const products = downstream.filter((n) => n.node_type === "data_product").map((n) => n.node_name);

  const total = pipelines.length + targets.length + reports.length + products.length;
  const risk = total > 8 ? "critical" : total > 4 ? "high" : total > 1 ? "medium" : "low";

  return {
    asset_id: assetId,
    asset_name: node.node_name,
    impacted_pipelines: pipelines,
    impacted_targets: targets,
    impacted_reports: reports,
    impacted_data_products: products,
    total_impacted: total,
    risk_level: risk,
  };
}

export function getLineageNodes() {
  return NODES;
}
