"""reference fixtures — mirrors the Node.js backend fixtures."""
from .models import DataDomain, DataProduct, SynapseWorkspace


def get_domains() -> list[DataDomain]:
    return [
        DataDomain("dom-001", "Finance & Risk", "Core financial reporting and risk management", "Sarah Chen", "critical", 8, 4, "needs_review"),
        DataDomain("dom-002", "Customer Analytics", "Customer behaviour, segmentation, and CLV", "Marcus Rodriguez", "high", 6, 3, "needs_review"),
        DataDomain("dom-003", "Supply Chain", "Inventory, logistics, and supplier performance", "Emma Thompson", "high", 5, 2, "blocked"),
        DataDomain("dom-004", "HR & Workforce", "Headcount, payroll, and talent analytics", "James Liu", "medium", 4, 2, "ready"),
        DataDomain("dom-005", "Regulatory Reporting", "Compliance, audit, and regulatory submissions", "Priya Sharma", "critical", 7, 5, "blocked"),
    ]


def get_data_products() -> list[DataProduct]:
    return [
        DataProduct(
            "prod-001", "Financial Performance Dashboard", "Finance & Risk",
            "Sarah Chen", "Consolidated P&L, balance sheet, and cash flow metrics for executive reporting.",
            ["Synapse-Finance-Prod"], ["bronze_gl_transactions", "bronze_cost_centres"],
            ["silver_trial_balance", "silver_ledger_movements"],
            ["gold_pnl_monthly", "gold_balance_sheet"],
            "Daily by 06:00 UTC", True, 72.0, "needs_review",
            ["Exec Dashboard", "CFO Monthly Pack"],
        ),
        DataProduct(
            "prod-002", "Customer 360 Product", "Customer Analytics",
            "Marcus Rodriguez", "Unified customer view across CRM, transactions, and digital touchpoints.",
            ["Synapse-CRM-Prod", "Synapse-Commerce-Dev"],
            ["bronze_crm_contacts", "bronze_transaction_events"],
            ["silver_customer_profile", "silver_transaction_history"],
            ["gold_customer_360", "gold_clv_segments"],
            "Hourly", False, 43.0, "blocked",
            ["Customer Insights Report", "Churn Prediction Dashboard"],
        ),
        DataProduct(
            "prod-003", "Supply Chain Visibility", "Supply Chain",
            "Emma Thompson", "End-to-end supply chain tracking from supplier PO to warehouse receipt.",
            ["Synapse-SupplyChain-Prod"],
            ["bronze_purchase_orders", "bronze_inventory_movements"],
            ["silver_supplier_performance", "silver_stock_levels"],
            ["gold_supply_chain_kpis"],
            "Every 4 hours", True, 68.0, "needs_review",
            ["Operations Dashboard", "Supplier Scorecard"],
        ),
        DataProduct(
            "prod-004", "HR Analytics Product", "HR & Workforce",
            "James Liu", "Headcount, attrition, and talent pipeline analytics.",
            ["Synapse-HR-Prod"],
            ["bronze_hr_core", "bronze_payroll"],
            ["silver_headcount_history", "silver_attrition_signals"],
            ["gold_hr_dashboard", "gold_talent_pipeline"],
            "Weekly on Sunday", True, 81.0, "ready",
            ["HR Executive Dashboard", "Talent Acquisition Report"],
        ),
        DataProduct(
            "prod-005", "Regulatory Compliance Product", "Regulatory Reporting",
            "Priya Sharma", "Basel III, GDPR, and local regulatory submissions with full audit trail.",
            ["Synapse-Finance-Prod", "Synapse-Risk-Prod", "Synapse-Compliance-Dev"],
            ["bronze_regulatory_positions", "bronze_compliance_events"],
            ["silver_regulatory_calculations", "silver_audit_events"],
            ["gold_regulatory_submissions", "gold_audit_trail"],
            "Real-time (streaming)", False, 31.0, "blocked",
            ["Regulatory Submission Report", "Audit Trail Dashboard", "Basel III Report"],
        ),
    ]


def get_workspaces() -> list[SynapseWorkspace]:
    return [
        SynapseWorkspace("ws-001", "Synapse-Finance-Prod", "Finance & Risk", "production", 2, 1, "adls-finance-prod", "Sarah Chen", "critical", 2800.0, True),
        SynapseWorkspace("ws-002", "Synapse-CRM-Prod", "Customer Analytics", "production", 1, 2, "adls-crm-prod", "Marcus Rodriguez", "high", 1950.0, True),
        SynapseWorkspace("ws-003", "Synapse-SupplyChain-Prod", "Supply Chain", "production", 1, 1, "adls-sc-prod", "Emma Thompson", "high", 1600.0, True),
        SynapseWorkspace("ws-004", "Synapse-HR-Prod", "HR & Workforce", "production", 1, 0, "adls-hr-prod", "James Liu", "medium", 950.0, True),
        SynapseWorkspace("ws-005", "Synapse-Risk-Prod", "Regulatory Reporting", "production", 2, 2, "adls-risk-prod", "Priya Sharma", "critical", 2400.0, False),
        SynapseWorkspace("ws-006", "Synapse-Commerce-Dev", "Customer Analytics", "development", 0, 1, "adls-commerce-dev", "Marcus Rodriguez", "medium", 350.0, False),
    ]
