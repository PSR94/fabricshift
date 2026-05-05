"""FabricShift data models — mirrors the TypeScript API schemas."""
from dataclasses import dataclass, field
from typing import Optional


@dataclass
class DataDomain:
    domain_id: str
    domain_name: str
    description: str
    owner: str
    criticality: str
    asset_count: int
    pipeline_count: int
    readiness_band: str


@dataclass
class SynapseWorkspace:
    workspace_id: str
    workspace_name: str
    business_domain: str
    environment: str
    sql_pool_count: int
    spark_pool_count: int
    linked_storage: str
    owner: str
    criticality: str
    estimated_monthly_cost: float
    migration_candidate: bool


@dataclass
class AdfPipeline:
    pipeline_id: str
    pipeline_name: str
    source_system: str
    target_system: str
    schedule: str
    trigger_type: str
    activity_count: int
    dependency_count: int
    last_run_status: str
    average_runtime_minutes: float
    owner: str
    business_domain: str
    complexity: str


@dataclass
class SqlObject:
    object_id: str
    schema_name: str
    object_name: str
    object_type: str
    row_count: int
    size_mb: float
    primary_key: Optional[str]
    partition_column: Optional[str]
    last_updated: str
    downstream_reports: int
    sensitive_data_flag: bool
    owner: str


@dataclass
class PowerBiReport:
    report_id: str
    report_name: str
    workspace_name: str
    dataset_name: str
    refresh_frequency: str
    dependent_tables: list[str]
    row_level_security: bool
    direct_query_flag: bool
    business_owner: str
    criticality: str


@dataclass
class DataProduct:
    product_id: str
    product_name: str
    business_domain: str
    owner: str
    description: str
    source_systems: list[str]
    bronze_entities: list[str]
    silver_entities: list[str]
    gold_marts: list[str]
    freshness_target: str
    has_contract: bool
    readiness_score: float
    readiness_band: str
    consumer_reports: list[str]


@dataclass
class ReadinessEvidence:
    signal: str
    value: str
    score_contribution: float
    notes: str


@dataclass
class ReadinessResult:
    assessment_id: str
    asset_id: str
    asset_name: str
    business_domain: str
    readiness_score: float
    readiness_band: str
    blockers: list[str]
    risks: list[str]
    recommended_target_architecture: str
    suggested_migration_wave: int
    evidence: list[ReadinessEvidence]


@dataclass
class MappingResult:
    mapping_id: str
    source_asset_name: str
    source_asset_type: str
    business_domain: str
    recommended_fabric_target: str
    target_zone: str
    migration_effort: str
    risk_level: str
    blockers: list[str]
    recommended_action: str
    rationale: str
    medallion_layer: str


@dataclass
class ReconciliationCheck:
    check_id: str
    check_name: str
    check_type: str
    passed: bool
    severity: str
    expected_value: str
    observed_value: str
    delta: Optional[str]
    evidence: str
    recommended_action: str


@dataclass
class ReconciliationRun:
    result_id: str
    product_name: str
    total_checks: int
    passed_checks: int
    failed_checks: int
    checks: list[ReconciliationCheck]
    overall_status: str


@dataclass
class LineageNode:
    node_id: str
    node_name: str
    node_type: str
    business_domain: str
    layer: str
    owner: Optional[str]


@dataclass
class LineageEdge:
    edge_id: str
    source_id: str
    target_id: str
    relationship: str


@dataclass
class LineageGraph:
    nodes: list[LineageNode]
    edges: list[LineageEdge]


@dataclass
class WaveAsset:
    asset_id: str
    asset_name: str
    asset_type: str
    business_domain: str
    readiness_score: float
    effort_band: str


@dataclass
class MigrationWave:
    wave_id: str
    wave_number: int
    wave_name: str
    assets: list[WaveAsset]
    rationale: str
    blockers: list[str]
    prerequisites: list[str]
    estimated_effort_band: str
    risk_notes: str
    domain_coverage: list[str]


@dataclass
class MigrationPacket:
    packet_id: str
    created_at: str
    packet_title: str
    summary: str
    domains_assessed: list[str]
    total_blockers: int
    total_mapped_assets: int
    total_waves: int
    key_risks: list[str]
    recommended_next_actions: list[str]
    assumptions: list[str]
    data_notice: str
