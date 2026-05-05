"""Migration wave planner — groups data products into phased waves."""
from __future__ import annotations
import uuid
from .models import DataProduct, MigrationWave, WaveAsset, ReadinessResult


def plan_waves(
    products: list[DataProduct],
    readiness_results: list[ReadinessResult],
    max_waves: int = 4,
) -> list[MigrationWave]:
    """Group data products into migration waves based on readiness scores."""

    score_map = {r.asset_id: r for r in readiness_results}

    ready = [p for p in products if score_map.get(p.product_id, None) and score_map[p.product_id].readiness_band == "ready"]
    review = [p for p in products if score_map.get(p.product_id, None) and score_map[p.product_id].readiness_band == "needs_review"]
    blocked = [p for p in products if score_map.get(p.product_id, None) and score_map[p.product_id].readiness_band == "blocked"]

    waves: list[MigrationWave] = []

    def make_wave(number: int, name: str, prods: list[DataProduct], rationale: str, prereqs: list[str], blockers_: list[str], effort: str, risk_notes: str) -> MigrationWave:
        assets = []
        domains: set[str] = set()
        for prod in prods:
            r = score_map.get(prod.product_id)
            score = r.readiness_score if r else 50.0
            effort_band = "low" if score >= 75 else "medium" if score >= 50 else "high"
            assets.append(WaveAsset(
                asset_id=prod.product_id,
                asset_name=prod.product_name,
                asset_type="Data Product",
                business_domain=prod.business_domain,
                readiness_score=score,
                effort_band=effort_band,
            ))
            domains.add(prod.business_domain)
        return MigrationWave(
            wave_id=str(uuid.uuid4()),
            wave_number=number,
            wave_name=name,
            assets=assets,
            rationale=rationale,
            blockers=blockers_,
            prerequisites=prereqs,
            estimated_effort_band=effort,
            risk_notes=risk_notes,
            domain_coverage=sorted(domains),
        )

    if ready:
        waves.append(make_wave(
            1, "Pilot Wave — Ready Assets",
            ready,
            "Assets with highest readiness scores and full data contracts. Lowest migration risk.",
            ["Fabric workspace provisioned", "OneLake enabled", "Purview workspace connected"],
            [],
            "low",
            "Pilot wave. Focus on quick wins to build team confidence. Monitor for unexpected schema drift.",
        ))

    if review:
        waves.append(make_wave(
            2, "Core Wave — Needs Review",
            review,
            "Assets requiring remediation before migration. Resolve blockers before executing.",
            ["Wave 1 complete and validated", "Data contracts drafted", "Reconciliation baseline established"],
            [f"Resolve blockers in {len(review)} product(s) before scheduling"],
            "medium",
            "Medium risk. Ensure business sign-off on reconciliation rules before cutover.",
        ))

    if blocked:
        waves.append(make_wave(
            3, "Remediation Wave — Blocked Assets",
            blocked,
            "Assets with significant blockers requiring architectural changes or data governance work.",
            ["Wave 2 complete", "PII classification approved", "Architecture review board sign-off"],
            [f"{len(blocked)} product(s) have critical blockers requiring resolution"],
            "high",
            "High risk. Executive sign-off required. Maintain parallel run for minimum 4 weeks post-migration.",
        ))

    return waves[:max_waves]
