import { lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

const Dashboard = lazy(() => import("@/pages/dashboard"));
const Domains = lazy(() => import("@/pages/domains"));
const Inventory = lazy(() => import("@/pages/inventory"));
const DataProducts = lazy(() => import("@/pages/data-products"));
const DataProductDetail = lazy(() => import("@/pages/data-product-detail"));
const Mapping = lazy(() => import("@/pages/mapping"));
const Readiness = lazy(() => import("@/pages/readiness"));
const Reconciliation = lazy(() => import("@/pages/reconciliation"));
const Lineage = lazy(() => import("@/pages/lineage"));
const Waves = lazy(() => import("@/pages/waves"));
const Reports = lazy(() => import("@/pages/reports"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<Loading />}>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/domains" component={Domains} />
        <Route path="/inventory" component={Inventory} />
        <Route path="/data-products/:productId" component={DataProductDetail} />
        <Route path="/data-products" component={DataProducts} />
        <Route path="/mapping" component={Mapping} />
        <Route path="/readiness" component={Readiness} />
        <Route path="/reconciliation" component={Reconciliation} />
        <Route path="/lineage" component={Lineage} />
        <Route path="/waves" component={Waves} />
        <Route path="/reports" component={Reports} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
