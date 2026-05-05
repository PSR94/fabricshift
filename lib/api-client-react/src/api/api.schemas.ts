export interface HealthStatus {
  status: string;
}

export interface AppConfig {
  version: string;
  environment: string;
  data_notice: string;
  domains_supported: string[];
}

export interface ErrorResponse {
  error: string;
}

export interface DataDomain {
  domain_id: string;
  domain_name: string;
  description: string;
  owner: string;
  criticality: string;
  asset_count: number;
  pipeline_count: number;
  readiness_band: string;
}

export interface SynapseWorkspace {
  workspace_id: string;
  workspace_name: string;
  business_domain: string;
  environment: string;
  sql_pool_count: number;
  spark_pool_count: number;
  linked_storage: string;
  owner: string;
  criticality: string;
  estimated_monthly_cost: number;
  migration_candidate: boolean;
}

export interface AdfPipeline {
  pipeline_id: string;
  pipeline_name: string;
  source_system: string;
  target_system: string;
  schedule: string;
  trigger_type: string;
  activity_count: number;
  dependency_count: number;
  last_run_status: string;
  average_runtime_minutes: number;
  owner: string;
  business_domain: string;
  complexity: string;
}

export interface SqlObject {
  object_id: string;
  schema_name: string;
  object_name: string;
  object_type: string;
  row_count: number;
  size_mb: number;
  /** @nullable */
  primary_key: string | null;
  /** @nullable */
  partition_column: string | null;
  last_updated: string;
  downstream_reports: number;
  sensitive_data_flag: boolean;
  owner: string;
}

export interface PowerBiReport {
  report_id: string;
  report_name: string;
  workspace_name: string;
  dataset_name: string;
  refresh_frequency: string;
  dependent_tables: string[];
  row_level_security: boolean;
  direct_query_flag: boolean;
  business_owner: string;
  criticality: string;
}

export interface ReadinessDistribution {
  ready: number;
  needs_review: number;
  blocked: number;
}

export interface InventorySummary {
  total_workspaces: number;
  total_pipelines: number;
  total_sql_objects: number;
  total_reports: number;
  total_data_products: number;
  total_domains: number;
  readiness_distribution: ReadinessDistribution;
  critical_blockers: number;
  estimated_total_monthly_cost: number;
  migration_candidates: number;
  top_domain_by_complexity: string;
  first_wave_candidates: number;
}

export interface MappingRequest {
  /** @nullable */
  domain_filter?: string | null;
  /** @nullable */
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

export interface EffortDistribution {
  low: number;
  medium: number;
  high: number;
}

export interface RiskDistribution {
  low: number;
  medium: number;
  high: number;
  critical: number;
}

export interface MappingRun {
  run_id: string;
  run_at: string;
  total_mapped: number;
  results: MappingResult[];
  effort_distribution: EffortDistribution;
  risk_distribution: RiskDistribution;
}

export interface DataProduct {
  product_id: string;
  product_name: string;
  business_domain: string;
  owner: string;
  description: string;
  source_systems: string[];
  bronze_entities: string[];
  silver_entities: string[];
  gold_marts: string[];
  freshness_target: string;
  has_contract: boolean;
  readiness_score: number;
  readiness_band: string;
  consumer_reports: string[];
}

export interface ContractColumn {
  name: string;
  data_type: string;
  nullable: boolean;
  description: string;
  /** @nullable */
  allowed_range?: string | null;
  /** @nullable */
  allowed_categories?: string[] | null;
}

export interface ReconciliationRule {
  rule_id: string;
  rule_type: string;
  description: string;
  severity: string;
  /** @nullable */
  column?: string | null;
  /** @nullable */
  threshold?: number | null;
}

export interface DataContract {
  product_id: string;
  product_name: string;
  owner: string;
  business_domain: string;
  source_systems: string[];
  primary_key: string;
  freshness_expectation: string;
  columns: ContractColumn[];
  reconciliation_rules: ReconciliationRule[];
  downstream_consumers: string[];
}

export interface ColumnProfile {
  column_name: string;
  data_type: string;
  null_rate: number;
  distinct_count: number;
  /** @nullable */
  min_value?: string | null;
  /** @nullable */
  max_value?: string | null;
  sample_values: string[];
}

export interface QualityFinding {
  finding_id: string;
  severity: string;
  category: string;
  asset: string;
  expected_value: string;
  observed_value: string;
  evidence: string;
  recommended_action: string;
}

export interface DataProfile {
  product_id: string;
  profile_date: string;
  source_row_count: number;
  target_row_count: number;
  columns: ColumnProfile[];
  quality_findings: QualityFinding[];
}

export interface ReadinessRequest {
  /** @nullable */
  domain_filter?: string | null;
  /** @nullable */
  product_ids?: string[] | null;
}

export interface ReadinessEvidence {
  signal: string;
  value: string;
  score_contribution: number;
  notes: string;
}

export interface ReadinessResult {
  assessment_id: string;
  asset_id: string;
  asset_name: string;
  asset_type: string;
  business_domain: string;
  readiness_score: number;
  readiness_band: string;
  blockers: string[];
  risks: string[];
  recommended_target_architecture: string;
  suggested_migration_wave: number;
  evidence: ReadinessEvidence[];
}

export interface ReadinessRun {
  run_id: string;
  run_at: string;
  total_assessed: number;
  results: ReadinessResult[];
  distribution: ReadinessDistribution;
  total_blockers: number;
}

export interface ReconciliationRequest {
  /** @nullable */
  product_ids?: string[] | null;
}

export interface ReconciliationCheck {
  check_id: string;
  check_name: string;
  check_type: string;
  passed: boolean;
  severity: string;
  expected_value: string;
  observed_value: string;
  /** @nullable */
  delta?: string | null;
  evidence: string;
  recommended_action: string;
}

export interface ReconciliationRun {
  result_id: string;
  product_id: string;
  product_name: string;
  run_at: string;
  total_checks: number;
  passed_checks: number;
  failed_checks: number;
  checks: ReconciliationCheck[];
  overall_status: string;
}

export interface LineageNode {
  node_id: string;
  node_name: string;
  node_type: string;
  business_domain: string;
  layer: string;
  /** @nullable */
  owner?: string | null;
}

export interface LineageEdge {
  edge_id: string;
  source_id: string;
  target_id: string;
  relationship: string;
}

export interface LineageGraph {
  nodes: LineageNode[];
  edges: LineageEdge[];
  total_nodes: number;
  total_edges: number;
}

export interface AssetLineage {
  asset_id: string;
  asset_name: string;
  upstream: LineageNode[];
  downstream: LineageNode[];
  depth_upstream: number;
  depth_downstream: number;
}

export interface ImpactRequest {
  asset_id: string;
  direction?: string;
}

export interface ImpactResult {
  asset_id: string;
  asset_name: string;
  impacted_pipelines: string[];
  impacted_targets: string[];
  impacted_reports: string[];
  impacted_data_products: string[];
  total_impacted: number;
  risk_level: string;
}

export interface WavePlanRequest {
  /** @nullable */
  domain_filter?: string | null;
  /** @nullable */
  max_waves?: number | null;
}

export interface WaveAsset {
  asset_id: string;
  asset_name: string;
  asset_type: string;
  business_domain: string;
  readiness_score: number;
  effort_band: string;
}

export interface MigrationWave {
  wave_id: string;
  wave_number: number;
  wave_name: string;
  assets: WaveAsset[];
  rationale: string;
  blockers: string[];
  prerequisites: string[];
  estimated_effort_band: string;
  risk_notes: string;
  domain_coverage: string[];
}

export interface WavePlan {
  plan_id: string;
  planned_at: string;
  total_waves: number;
  total_assets: number;
  waves: MigrationWave[];
  planning_notes: string;
}

export interface PacketRequest {
  /** @nullable */
  include_domains?: string[] | null;
  /** @nullable */
  packet_title?: string | null;
}

export interface MigrationPacket {
  packet_id: string;
  created_at: string;
  packet_title: string;
  summary: string;
  domains_assessed: string[];
  inventory_summary: InventorySummary;
  readiness_distribution: ReadinessDistribution;
  total_blockers: number;
  total_mapped_assets: number;
  total_waves: number;
  key_risks: string[];
  recommended_next_actions: string[];
  assumptions: string[];
  data_notice: string;
}

export interface ReportExport {
  report_id: string;
  format: string;
  content: string;
  created_at: string;
}
