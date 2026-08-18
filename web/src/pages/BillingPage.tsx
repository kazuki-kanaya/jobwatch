import { ArrowLeft, ExternalLink } from "lucide-react";
import type { ReactNode } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useCreateCheckoutBillingCheckoutPost,
  useCreatePortalBillingPortalPost,
  useGetBillingBillingGet,
} from "@/generated/api";
import { useLocale } from "@/i18n/LocaleProvider";
import { getAuthorizedRequestOptions } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function BillingPage() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const { t } = useLocale();
  const accessToken = user?.access_token;
  const enabled = isAuthenticated && !isAuthLoading && Boolean(accessToken);
  const request = getAuthorizedRequestOptions(accessToken);
  const billingQuery = useGetBillingBillingGet({ query: { enabled }, request });
  const checkoutMutation = useCreateCheckoutBillingCheckoutPost({ request });
  const portalMutation = useCreatePortalBillingPortalPost({ request });

  const redirectToHostedSession = async (createSession: () => Promise<{ url: string }>) => {
    try {
      const session = await createSession();
      window.location.assign(session.url);
    } catch {
      toast.error(t("billing_error"));
    }
  };

  if (billingQuery.isLoading || isAuthLoading) {
    return (
      <BillingShell
        backLabel={t("billing_back_to_dashboard")}
        title={t("billing_title")}
        onBack={() => navigate("/dashboard")}
      >
        <p>{t("billing_loading")}</p>
      </BillingShell>
    );
  }

  if (billingQuery.isError || !billingQuery.data) {
    return (
      <BillingShell
        backLabel={t("billing_back_to_dashboard")}
        title={t("billing_title")}
        onBack={() => navigate("/dashboard")}
      >
        <p>{t("billing_error")}</p>
      </BillingShell>
    );
  }

  const billing = billingQuery.data;
  const isPro = billing.plan === "pro";
  const planLabel = isPro ? t("billing_pro") : t("billing_free");

  return (
    <BillingShell
      backLabel={t("billing_back_to_dashboard")}
      title={t("billing_title")}
      subtitle={t("billing_subtitle")}
      onBack={() => navigate("/dashboard")}
    >
      <div className={cn("grid gap-4 md:grid-cols-2")}>
        <Card className={cn("border-cyan-400/30 bg-slate-950/70")}>
          <CardHeader>
            <CardDescription>{t("billing_plan")}</CardDescription>
            <CardTitle className={cn("flex items-center gap-3 text-2xl text-slate-100")}>
              {planLabel}
              <Badge variant={isPro ? "default" : "outline"}>{billing.plan}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className={cn("space-y-2 text-sm text-slate-300")}>
            <p>
              {t("billing_workspace_usage")}: {billing.workspace_count} / {billing.limits.max_workspaces}
            </p>
            {billing.subscription_status ? <p>{billing.subscription_status}</p> : null}
            {!billing.checkout_available && !isPro ? <p>{t("billing_unavailable")}</p> : null}
          </CardContent>
          <CardFooter className={cn("gap-2")}>
            {!isPro && billing.checkout_available ? (
              <Button
                type="button"
                disabled={checkoutMutation.isPending}
                onClick={() => redirectToHostedSession(() => checkoutMutation.mutateAsync())}
              >
                <ExternalLink className={cn("size-4")} />
                {t("billing_upgrade")}
              </Button>
            ) : null}
            {billing.portal_available ? (
              <Button
                type="button"
                variant="outline"
                disabled={portalMutation.isPending}
                onClick={() => redirectToHostedSession(() => portalMutation.mutateAsync())}
              >
                <ExternalLink className={cn("size-4")} />
                {t("billing_manage")}
              </Button>
            ) : null}
          </CardFooter>
        </Card>

        <Card className={cn("border-slate-700/60 bg-slate-950/70")}>
          <CardHeader>
            <CardTitle className={cn("text-slate-100")}>{t("billing_workspace_usage")}</CardTitle>
          </CardHeader>
          <CardContent className={cn("grid gap-3 text-sm text-slate-300")}>
            <LimitRow label={t("billing_hosts_limit")} value={billing.limits.max_hosts_per_workspace} />
            <LimitRow label={t("billing_jobs_limit")} value={billing.limits.max_jobs_per_workspace} />
            <LimitRow label={t("billing_log_lines_limit")} value={billing.limits.max_log_lines_per_job} />
            <LimitRow label={t("billing_retention_limit")} value={billing.limits.retention_days} />
          </CardContent>
        </Card>
      </div>
    </BillingShell>
  );
}

function BillingShell({
  children,
  backLabel,
  onBack,
  subtitle,
  title,
}: {
  children: ReactNode;
  backLabel: string;
  onBack: () => void;
  subtitle?: string;
  title: string;
}) {
  return (
    <main className={cn("min-h-screen bg-slate-950 px-4 py-8 text-slate-100 md:px-8")}>
      <div className={cn("mx-auto grid w-full max-w-4xl gap-6")}>
        <div className={cn("flex flex-wrap items-start justify-between gap-4")}>
          <div>
            <h1 className={cn("text-3xl font-semibold")}>{title}</h1>
            {subtitle ? <p className={cn("mt-2 text-slate-400")}>{subtitle}</p> : null}
          </div>
          <Button type="button" variant="ghost" onClick={onBack}>
            <ArrowLeft className={cn("size-4")} />
            {backLabel}
          </Button>
        </div>
        {children}
      </div>
    </main>
  );
}

function LimitRow({ label, value }: { label: string; value: number }) {
  return (
    <div
      className={cn("flex items-center justify-between rounded-md border border-slate-800 bg-slate-900/70 px-3 py-2")}
    >
      <span>{label}</span>
      <span className={cn("font-medium text-cyan-200")}>{value.toLocaleString()}</span>
    </div>
  );
}
