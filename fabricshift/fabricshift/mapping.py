"""Fabric target mapping engine — maps Synapse assets to Fabric targets."""
from __future__ import annotations
import uuid
from .models import (
    SynapseWorkspace, AdfPipeline, SqlObject, PowerBiReport,
    DataProduct, MappingResult
)


def _effort_from_complexity(complexity: str) -> str:
    return {"high": "high", "medium": "medium", "low": "low"}.get(complexity, "medium")


def map_workspace(w: SynapseWorkspace) -> MappingResult:
    target = "Fabric Workspace (Lakehouse + Warehouse)"
    zone = "Analytics"
    effort = "high" if w.sql_pool_count > 1 else "medium"
    risk = "high" if w.criticality in ("critical", "high") else "medium"
    blockers: list[str] = []
    if not w.migration_candidate:
        blockers.append("Workspace not flagged as a migration candidate")
    return MappingResult(
        mapping_id=str(uuid.uuid4()),
        source_asset_name=w.workspace_name,
        source_asset_type="Synapse Workspace",
        business_domain=w.business_domain,
        recommended_fabric_target=target,
        target_zone=zone,
        migration_effort=effort,
        risk_level=risk,
        blockers=blockers,
        recommended_action="Provision Fabric workspace, enable OneLake, migrate SQL pools",
        rationale="Synapse dedicated SQL pools map directly to Fabric Warehouse; Spark pools map to Fabric notebooks/lakehouses",
        medallion_layer="source",
    )


def map_pipeline(p: AdfPipeline) -> MappingResult:
    effort = _effort_from_complexity(p.complexity)
    risk = "critical" if p.dependency_count > 5 else "high" if p.dependency_count > 2 else "medium"
    blockers: list[str] = []
    if p.last_run_status == "failed":
        blockers.append("Pipeline last run failed — must resolve before migration")
    return MappingResult(
        mapping_id=str(uuid.uuid4()),
        source_asset_name=p.pipeline_name,
        source_asset_type="ADF Pipeline",
        business_domain=p.business_domain,
        recommended_fabric_target="Fabric Data Pipeline (ADF-compatible)",
        target_zone="Ingestion",
        migration_effort=effort,
        risk_level=risk,
        blockers=blockers,
        recommended_action="Re-create pipeline in Fabric using the ADF-compatible pipeline editor",
        rationale=f"ADF-compatible pipelines supported natively in Fabric. {p.activity_count} activities, {p.dependency_count} dependencies.",
        medallion_layer="pipeline",
    )


def map_sql_object(o: SqlObject) -> MappingResult:
    effort = "high" if o.size_mb > 500 else "medium"
    risk = "critical" if o.sensitive_data_flag else "high" if o.downstream_reports > 3 else "medium"
    blockers: list[str] = []
    if o.sensitive_data_flag:
        blockers.append("Contains sensitive/PII data — Purview classification required before migration")
    layer = "gold" if o.object_type in ("VIEW", "MATERIALIZED_VIEW") else "silver"
    return MappingResult(
        mapping_id=str(uuid.uuid4()),
        source_asset_name=f"{o.schema_name}.{o.object_name}",
        source_asset_type=f"SQL {o.object_type}",
        business_domain="Unknown",
        recommended_fabric_target="Fabric Warehouse (Delta table)" if o.object_type == "TABLE" else "Fabric Lakehouse (Delta view)",
        target_zone="Warehouse",
        migration_effort=effort,
        risk_level=risk,
        blockers=blockers,
        recommended_action="Use CTAS or CETAS to migrate to Fabric Warehouse / Lakehouse Delta tables",
        rationale=f"{o.row_count:,} rows, {o.size_mb} MB. {o.downstream_reports} downstream reports.",
        medallion_layer=layer,
    )


def map_report(r: PowerBiReport) -> MappingResult:
    risk = "critical" if r.row_level_security and r.direct_query_flag else "high" if r.direct_query_flag else "medium"
    blockers: list[str] = []
    if r.direct_query_flag:
        blockers.append("DirectQuery mode — must migrate dataset to Fabric before report migration")
    if r.row_level_security:
        blockers.append("Row-level security rules must be re-validated in Fabric")
    return MappingResult(
        mapping_id=str(uuid.uuid4()),
        source_asset_name=r.report_name,
        source_asset_type="Power BI Report",
        business_domain="Unknown",
        recommended_fabric_target="Fabric Power BI Report (DirectLake)",
        target_zone="Reporting",
        migration_effort="medium",
        risk_level=risk,
        blockers=blockers,
        recommended_action="Migrate dataset to Fabric Lakehouse, switch report to DirectLake mode",
        rationale=f"Dataset: {r.dataset_name}. Refresh: {r.refresh_frequency}. DirectQuery: {r.direct_query_flag}.",
        medallion_layer="report",
    )
