"""Migration readiness scoring engine — reference implementation."""
from __future__ import annotations
import uuid
from dataclasses import dataclass
from typing import Optional
from .models import DataProduct, ReadinessResult, ReadinessEvidence


READINESS_SIGNALS = [
    ("has_contract",       20, "Data contract present"),
    ("has_gold_marts",     15, "Gold mart layer defined"),
    ("has_bronze_entities", 10, "Bronze ingestion layer defined"),
    ("has_silver_entities", 10, "Silver transformation layer defined"),
    ("multiple_sources",   -5, "Multiple source systems increase complexity"),
    ("no_consumer_reports",-10,"No downstream consumer reports detected"),
    ("missing_owner",      -5, "Owner not clearly defined"),
]


def score_product(product: DataProduct, domain_criticality: str = "medium") -> ReadinessResult:
    """Score a single DataProduct for migration readiness.

    Returns a ReadinessResult with a 0–100 score, band, blockers, and evidence.
    """
    score = 50.0
    evidence: list[ReadinessEvidence] = []
    blockers: list[str] = []
    risks: list[str] = []

    if product.has_contract:
        score += 20
        evidence.append(ReadinessEvidence("has_contract", "true", 20, "Data contract present — schema and reconciliation rules defined"))
    else:
        blockers.append("No data contract defined — schema validation not possible")
        evidence.append(ReadinessEvidence("has_contract", "false", 0, "Missing data contract"))

    if product.gold_marts:
        score += 15
        evidence.append(ReadinessEvidence("has_gold_marts", str(len(product.gold_marts)), 15, f"{len(product.gold_marts)} Gold mart(s) defined"))
    else:
        blockers.append("No Gold mart layer — business consumers have no target")

    if product.bronze_entities:
        score += 10
        evidence.append(ReadinessEvidence("has_bronze_entities", str(len(product.bronze_entities)), 10, "Bronze ingestion layer present"))

    if product.silver_entities:
        score += 10
        evidence.append(ReadinessEvidence("has_silver_entities", str(len(product.silver_entities)), 10, "Silver transformation layer present"))

    if len(product.source_systems) > 2:
        score -= 5
        risks.append(f"Complex source fan-in: {len(product.source_systems)} source systems")
        evidence.append(ReadinessEvidence("multiple_sources", str(len(product.source_systems)), -5, "More than 2 source systems increases migration complexity"))

    if not product.consumer_reports:
        score -= 10
        risks.append("No downstream report consumers registered — impact radius unclear")

    if domain_criticality == "critical":
        risks.append("Domain is marked critical — migration requires executive sign-off")
        score -= 5

    score = max(0.0, min(100.0, score))

    if score >= 75:
        band = "ready"
        wave = 1
        target_arch = "Fabric Lakehouse (Delta) with DirectLake Power BI datasets"
    elif score >= 50:
        band = "needs_review"
        wave = 2
        target_arch = "Fabric Lakehouse (Delta) — remediate blockers before migration"
    else:
        band = "blocked"
        wave = 3
        target_arch = "Requires significant rework before Fabric migration is viable"

    return ReadinessResult(
        assessment_id=str(uuid.uuid4()),
        asset_id=product.product_id,
        asset_name=product.product_name,
        business_domain=product.business_domain,
        readiness_score=round(score, 1),
        readiness_band=band,
        blockers=blockers,
        risks=risks,
        recommended_target_architecture=target_arch,
        suggested_migration_wave=wave,
        evidence=evidence,
    )


def assess_all(products: list[DataProduct], domain_criticalities: Optional[dict[str, str]] = None) -> list[ReadinessResult]:
    """Run readiness assessment across all products."""
    criticalities = domain_criticalities or {}
    return [
        score_product(p, criticalities.get(p.business_domain, "medium"))
        for p in products
    ]
