import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Globe,
  Database,
  Package,
  ArrowRightLeft,
  ShieldCheck,
  FlaskConical,
  GitFork,
  Layers,
  FileText,
  ChevronRight,
} from "lucide-react";

const NAV = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/domains", label: "Domains", icon: Globe },
  { href: "/inventory", label: "Inventory", icon: Database },
  { href: "/data-products", label: "Data Products", icon: Package },
  { href: "/mapping", label: "Fabric Mapping", icon: ArrowRightLeft },
  { href: "/readiness", label: "Readiness", icon: ShieldCheck },
  { href: "/reconciliation", label: "Reconciliation", icon: FlaskConical },
  { href: "/lineage", label: "Lineage", icon: GitFork },
  { href: "/waves", label: "Migration Waves", icon: Layers },
  { href: "/reports", label: "Reports", icon: FileText },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-60 shrink-0 border-r border-border bg-sidebar flex flex-col">
        <div className="px-5 py-5 border-b border-sidebar-border">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center shrink-0">
              <span className="text-primary-foreground font-bold text-xs font-mono">FS</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-sidebar-foreground leading-none">FabricShift</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 leading-none">Migration Workbench</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = location === href || (href !== "/" && location.startsWith(href));
            return (
              <Link key={href} href={href}>
                <div
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm cursor-pointer transition-colors select-none group",
                    active
                      ? "bg-sidebar-accent text-primary font-medium"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                  )}
                >
                  <Icon
                    className={cn("w-4 h-4 shrink-0", active ? "text-primary" : "text-muted-foreground group-hover:text-sidebar-foreground")}
                  />
                  <span className="flex-1 truncate">{label}</span>
                  {active && <ChevronRight className="w-3 h-3 text-primary opacity-60" />}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-3 border-t border-sidebar-border">
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Assessment workspace
            <br />v1.0
          </p>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto min-w-0">
        {children}
      </main>
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-border">
      <div>
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="mt-0.5">{action}</div>}
    </div>
  );
}
