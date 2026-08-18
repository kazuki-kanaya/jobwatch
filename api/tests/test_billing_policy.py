from app.models.billing import BillingAccount, Plan, get_plan_limits


def test_free_plan_limits_are_the_free_tier_values() -> None:
    limits = get_plan_limits(Plan.FREE)

    assert limits.max_workspaces == 1
    assert limits.max_hosts_per_workspace == 1
    assert limits.max_jobs_per_workspace == 30
    assert limits.max_log_lines_per_job == 15
    assert limits.retention_days == 7


def test_pro_plan_limits_are_the_pro_tier_values() -> None:
    limits = get_plan_limits(Plan.PRO)

    assert limits.max_workspaces == 3
    assert limits.max_hosts_per_workspace == 5
    assert limits.max_jobs_per_workspace == 3000
    assert limits.max_log_lines_per_job == 50
    assert limits.retention_days == 30


def test_billing_account_defaults_to_free_without_stripe_state() -> None:
    account = BillingAccount(user_id="user-1")

    assert account.plan is Plan.FREE
    assert account.subscription_status is None
