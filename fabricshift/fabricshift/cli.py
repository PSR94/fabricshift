"""FabricShift CLI — run assessments from the command line."""
from __future__ import annotations
import json
import argparse
import sys
from .fixtures import get_data_products, get_domains
from .readiness import assess_all
from .mapping import map_workspace, map_pipeline, map_sql_object, map_report
from .waves import plan_waves


def cmd_assess(args: argparse.Namespace) -> None:
    products = get_data_products()
    domains = {d.domain_name: d.criticality for d in get_domains()}
    results = assess_all(products, domains)

    for r in results:
        print(f"[{r.readiness_band.upper():12}] {r.asset_name:40} score={r.readiness_score:5.1f}  wave={r.suggested_migration_wave}")
        for b in r.blockers:
            print(f"    BLOCKER: {b}")
        for risk in r.risks:
            print(f"    RISK:    {risk}")


def cmd_waves(args: argparse.Namespace) -> None:
    products = get_data_products()
    domains = {d.domain_name: d.criticality for d in get_domains()}
    results = assess_all(products, domains)
    waves = plan_waves(products, results, max_waves=args.max_waves)

    for w in waves:
        print(f"\nWave {w.wave_number}: {w.wave_name}  [{w.estimated_effort_band} effort]")
        print(f"  Rationale: {w.rationale}")
        for a in w.assets:
            print(f"  - {a.asset_name} (score={a.readiness_score}, effort={a.effort_band})")
        if w.blockers:
            for b in w.blockers:
                print(f"  BLOCKER: {b}")


def cmd_export(args: argparse.Namespace) -> None:
    products = get_data_products()
    domains_list = get_domains()
    domains = {d.domain_name: d.criticality for d in domains_list}
    results = assess_all(products, domains)
    waves = plan_waves(products, results)

    report = {
        "domains": [vars(d) for d in domains_list],
        "products": [vars(p) for p in products],
        "readiness": [vars(r) for r in results],
        "waves": [vars(w) for w in waves],
    }
    output = args.output or "fabricshift_export.json"
    with open(output, "w") as f:
        json.dump(report, f, indent=2, default=str)
    print(f"Exported to {output}")


def main() -> None:
    parser = argparse.ArgumentParser(prog="fabricshift", description="FabricShift Migration CLI")
    sub = parser.add_subparsers(dest="command")

    sub.add_parser("assess", help="Run readiness assessment against all data products")

    waves_p = sub.add_parser("waves", help="Generate migration wave plan")
    waves_p.add_argument("--max-waves", type=int, default=4)

    export_p = sub.add_parser("export", help="Export full assessment to JSON")
    export_p.add_argument("--output", type=str, default=None)

    args = parser.parse_args()

    if args.command == "assess":
        cmd_assess(args)
    elif args.command == "waves":
        cmd_waves(args)
    elif args.command == "export":
        cmd_export(args)
    else:
        parser.print_help()
        sys.exit(1)


if __name__ == "__main__":
    main()
