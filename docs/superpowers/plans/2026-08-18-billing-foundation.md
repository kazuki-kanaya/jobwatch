# Billing Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add user-level Free/Pro billing with Stripe Checkout, Customer Portal, verified webhooks, and a Pro three-workspace quota.

**Architecture:** Store one `BillingAccount` item in the user's DynamoDB partition. Keep plan limits in pure billing policy models, resolve account limits and usage in an `EntitlementService`, keep Stripe API calls in a `StripeGateway`, and let `BillingService` coordinate persistence and external events. `WorkspaceService` depends only on `EntitlementService`, while host/job limits remain defined but unenforced until PR2.

**Tech Stack:** Python 3.11, FastAPI, Pydantic v2, boto3/DynamoDB, Stripe Python SDK, pytest, Ruff, existing OpenAPI generation.

**Spec:** `docs/superpowers/specs/2026-08-18-billing-foundation.md`

## Global Constraints

- Billing scope is the authenticated user account, not a workspace.
- Free allows 1 owned workspace; Pro allows 3 owned workspaces.
- Free/Pro policy values must be centralized and immutable.
- No Stripe secret, payment method, or production credential may be returned by an API response or committed to the repository.
- Webhook processing must verify the raw request body and be safe to retry.
- Existing unrelated working-tree changes must never be staged.
- No merge or deployment is part of this plan; only a reviewable branch and draft PR are allowed.

### Task 1: Add tested plan policy and billing persistence

**Files:**
- Create: `api/app/models/billing.py`
- Create: `api/app/database/billing_repository.py`
- Create: `api/app/services/entitlement_service.py`
- Modify: `api/app/database/client.py`
- Create: `api/tests/test_billing_policy.py`
- Create: `api/tests/test_billing_repository.py`
- Create: `api/tests/test_entitlement_service.py`

**Interfaces:**
- Produces `Plan`, `SubscriptionStatus`, `PlanLimits`, `BillingAccount`, `get_plan_limits()`, `BillingRepository.get()/upsert()`, and `EntitlementService.get_for_user()/assert_can_create_workspace()`.
- `DynamoDBKeys.billing_sk()` returns `META#BILLING`.

- [ ] **Step 1: Write failing policy tests**

  Test that Free returns workspace limit 1, job limit 30, log limit 15 and Pro returns workspace limit 3, job limit 3000, log limit 50. Test that a missing billing record represents Free.

- [ ] **Step 2: Run the policy tests and confirm the expected missing-module failure**

  Run: `uv run pytest tests/test_billing_policy.py -q`

- [ ] **Step 3: Implement the minimum pure billing models and policy table**

  Define the enums, immutable `PlanLimits`, `BillingAccount`, and `get_plan_limits(plan)` without importing Stripe, boto3, or FastAPI.

- [ ] **Step 4: Run the policy tests and confirm they pass**

  Run: `uv run pytest tests/test_billing_policy.py -q`

- [ ] **Step 5: Write failing repository mapping tests**

  Use a fake table to verify `BillingRepository.get(user_id)` reads `USER#{user_id}`/`META#BILLING`, converts DynamoDB items to `BillingAccount`, and `upsert()` writes the same key pair.

- [ ] **Step 6: Run the repository tests and confirm the expected missing-module failure**

  Run: `uv run pytest tests/test_billing_repository.py -q`

- [ ] **Step 7: Implement the key helper and repository**

  Follow the existing repository/mapping pattern and omit absent optional fields through `DynamoDBMappers`.

- [ ] **Step 8: Run both test files**

  Run: `uv run pytest tests/test_billing_policy.py tests/test_billing_repository.py -q`

- [ ] **Step 9: Write failing entitlement service tests**

  Use fake billing and membership repositories to verify a missing account resolves to Free, a stored Pro account resolves to Pro limits, owner memberships are counted, and a member-only workspace does not consume the owned-workspace quota.

- [ ] **Step 10: Run the entitlement tests and confirm the expected missing-module failure**

  Run: `uv run pytest tests/test_entitlement_service.py -q`

- [ ] **Step 11: Implement `EntitlementService`**

  Keep it independent of Stripe. It reads the billing account and owner memberships, returns a billing entitlement snapshot, and raises `QuotaExceededError` only for an actual workspace creation limit violation.

- [ ] **Step 12: Run all Task 1 tests**

  Run: `uv run pytest tests/test_billing_policy.py tests/test_billing_repository.py tests/test_entitlement_service.py -q`

- [ ] **Step 13: Commit the policy and repository slice**

  Run: `git add api/app/models/billing.py api/app/database/billing_repository.py api/app/services/entitlement_service.py api/app/database/client.py api/tests/test_billing_policy.py api/tests/test_billing_repository.py api/tests/test_entitlement_service.py && git commit -m "feat(api): add billing plan policy"`

### Task 2: Add entitlement-aware workspace creation

**Files:**
- Modify: `api/app/models/exceptions.py`
- Modify: `api/app/exception_handlers.py`
- Modify: `api/app/services/workspace_service.py`
- Modify: `api/app/dependencies/repositories.py`
- Modify: `api/app/dependencies/services.py`
- Create: `api/tests/test_workspace_quota.py`

**Interfaces:**
- Produces `QuotaExceededError` mapped to HTTP 402.
- `EntitlementService.get_for_user(user_id)` returns Free limits when no billing item exists.
- `WorkspaceService` accepts `EntitlementService` and counts only memberships whose role is `OWNER`.

- [ ] **Step 1: Write failing workspace quota tests**

  Test that a Free user with one owned workspace receives `QuotaExceededError`, a Free user with no owned workspace can create one, and a Pro user with two owned workspaces can create a third. Memberships where the user is an editor/viewer must not consume the owned-workspace quota.

- [ ] **Step 2: Run the workspace quota tests and confirm the expected failure**

  Run: `uv run pytest tests/test_workspace_quota.py -q`

- [ ] **Step 3: Implement quota exception and workspace gating**

  Add a domain exception and handler, inject `EntitlementService` into `WorkspaceService`, resolve limits from the account plan, count owner memberships, and check the limit before calling the existing transactional workspace repository method.

- [ ] **Step 4: Run the workspace quota tests and confirm they pass**

  Run: `uv run pytest tests/test_workspace_quota.py -q`

- [ ] **Step 5: Run the API test suite**

  Run: `uv run pytest -q`

- [ ] **Step 6: Commit the workspace quota slice**

  Run: `git add api/app/models/exceptions.py api/app/exception_handlers.py api/app/services/workspace_service.py api/app/dependencies/repositories.py api/app/dependencies/services.py api/tests/test_workspace_quota.py && git commit -m "feat(api): enforce workspace entitlement"`

### Task 3: Add Stripe gateway and billing HTTP API

**Files:**
- Modify: `api/pyproject.toml`
- Modify: `api/uv.lock`
- Modify: `api/app/config.py`
- Create: `api/app/integrations/stripe_gateway.py`
- Create: `api/app/schemas/billing.py`
- Create: `api/app/services/billing_service.py`
- Create: `api/app/routers/billing.py`
- Modify: `api/app/dependencies/services.py`
- Modify: `api/app/routers/register.py`
- Create: `api/tests/test_billing_service.py`
- Create: `api/tests/test_billing_router.py`

**Interfaces:**
- `StripeGateway.create_checkout_session(user_id, customer_id)` returns a hosted URL.
- `StripeGateway.create_portal_session(customer_id)` returns a hosted URL.
- `StripeGateway.construct_event(payload, signature)` verifies and parses a webhook.
- `BillingService.get_billing(user)`, `create_checkout(user)`, `create_portal(user)`, and `handle_webhook(payload, signature)` expose domain behavior to the router. It uses `EntitlementService` for plan limits and workspace usage.
- API endpoints are `GET /billing`, `POST /billing/checkout`, `POST /billing/portal`, and `POST /webhooks/stripe`.

- [ ] **Step 1: Add the Stripe dependency and configuration fields**

  Add the Stripe SDK to the API dependency list and lock file. Add optional settings for secret key, webhook secret, Pro price ID, checkout success/cancel URLs, and portal return URL. Billing actions must return a configuration error if required settings are missing.

- [ ] **Step 2: Write failing Stripe gateway and service tests**

  Patch only the gateway boundary in tests. Verify checkout uses subscription mode, the configured Pro price, account user metadata, and the existing Stripe customer when available. Verify portal requires an existing customer. Verify subscription webhook events update the billing account and repeated delivery converges without duplicate records.

- [ ] **Step 3: Run the billing service tests and confirm the expected failure**

  Run: `uv run pytest tests/test_billing_service.py -q`

- [ ] **Step 4: Implement the Stripe gateway**

  Configure the SDK per request, create hosted Checkout/Portal sessions, and call `stripe.Webhook.construct_event` with the raw payload and signature. Do not expose the secret key in exceptions or responses.

- [ ] **Step 5: Implement billing service webhook state transitions**

  Handle `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, and `customer.subscription.deleted`. Persist the Stripe customer/subscription IDs, subscription status, cancellation flag, period end, and Pro/Free plan. Treat repeated events as idempotent state updates.

- [ ] **Step 6: Run the billing service tests and confirm they pass**

  Run: `uv run pytest tests/test_billing_service.py -q`

- [ ] **Step 7: Write failing router tests**

  Verify authenticated billing status is returned, checkout and portal return a URL, and invalid webhook signatures return a client error without mutating the repository.

- [ ] **Step 8: Implement schemas, dependencies, router, and registration**

  Use existing auth/dependency patterns. Read the webhook body via `await request.body()` before parsing, and keep the webhook endpoint unauthenticated because Stripe calls it directly.

- [ ] **Step 9: Run router and full API tests**

  Run: `uv run pytest tests/test_billing_router.py tests/test_billing_service.py tests/test_workspace_quota.py -q` and then `uv run pytest -q`.

- [ ] **Step 10: Commit the Stripe API slice**

  Run: `git add api/pyproject.toml api/uv.lock api/app/config.py api/app/integrations/stripe_gateway.py api/app/schemas/billing.py api/app/services/billing_service.py api/app/routers/billing.py api/app/dependencies/services.py api/app/routers/register.py api/tests/test_billing_service.py api/tests/test_billing_router.py && git commit -m "feat(api): add Stripe billing endpoints"`

### Task 4: Refresh API contract and deployment documentation

**Files:**
- Modify: `web/openapi.json`
- Modify: `web/src/generated/api.ts`
- Modify: `web/src/App.tsx`
- Create: `web/src/pages/BillingPage.tsx`
- Modify: `web/src/features/header/components/HeaderFeature.tsx`
- Modify: `web/src/features/header/components/HeaderControls/HeaderControls.tsx`
- Modify: `web/src/i18n/messages/types.ts`
- Modify: `web/src/i18n/messages/en.ts`
- Modify: `web/src/i18n/messages/ja.ts`
- Modify: `api/.env.example`
- Modify: `infra/envs/prod/aws/20-core/terraform.tfvars.example`
- Modify: `README.md`
- Modify: `README.ja.md`
- Create: `api/tests/test_billing_configuration.py`

**Interfaces:**
- OpenAPI includes all four billing endpoints and the billing response schemas.
- The authenticated web app exposes `/billing`, links to it from the dashboard header, and redirects users to Stripe-hosted Checkout/Portal URLs.
- Documentation names every required `OBSERN_` environment variable and the Stripe webhook endpoint.

- [ ] **Step 1: Write failing configuration tests**

  Verify the default settings leave billing disabled and a fully configured settings object exposes the expected price, URL, secret, and webhook values.

- [ ] **Step 2: Run configuration tests and confirm the expected failure**

  Run: `uv run pytest tests/test_billing_configuration.py -q`

- [ ] **Step 3: Add configuration test coverage and deployment examples**

  Document `OBSERN_STRIPE_SECRET_KEY`, `OBSERN_STRIPE_WEBHOOK_SECRET`, `OBSERN_STRIPE_PRO_PRICE_ID`, `OBSERN_BILLING_SUCCESS_URL`, `OBSERN_BILLING_CANCEL_URL`, and `OBSERN_BILLING_PORTAL_RETURN_URL`. Keep secret values as placeholders and do not add them to Terraform state examples.

- [ ] **Step 4: Regenerate the OpenAPI document**

  Run: `task openapi` from `api` and inspect that only the intended contract changes are present.

- [ ] **Step 5: Regenerate the typed web client and add the billing screen**

  Run: `pnpm generate:api` from `web`. Use the generated query/mutation hooks in `BillingPage.tsx`, keep card handling on Stripe-hosted pages, and add the authenticated `/billing` route plus a dashboard header link. Display the account plan, workspace usage, and the limits returned by the API.

- [ ] **Step 6: Run API/web formatting, lint, type checks, builds, and tests**

  Run `uv run ruff format --check .`, `uv run ruff check .`, `uv run ty check .`, and `uv run pytest -q` from `api`; run `pnpm exec biome check` on changed web files and `pnpm build` from `web`.

- [ ] **Step 7: Commit the contract/documentation slice**

  Run: `git add api/.env.example web/openapi.json web/src/generated/api.ts web/src/App.tsx web/src/pages/BillingPage.tsx web/src/features/header/components/HeaderFeature.tsx web/src/features/header/components/HeaderControls/HeaderControls.tsx web/src/i18n/messages/types.ts web/src/i18n/messages/en.ts web/src/i18n/messages/ja.ts infra/envs/prod/aws/20-core/terraform.tfvars.example README.md README.ja.md api/tests/test_billing_configuration.py && git commit -m "feat(web): add hosted billing screen"`

### Task 5: Review and publish a draft PR

**Files:**
- No source files; review the complete branch diff.

- [ ] **Step 1: Inspect the intended diff and confirm unrelated files are absent**

  Run: `git status --short`, `git diff main...HEAD --stat`, and `git diff main...HEAD --check`.

- [ ] **Step 2: Run final verification**

  Run API tests/lint/type checks, `pnpm build` from `web`, and the repository's relevant infrastructure validation without applying infrastructure changes.

- [ ] **Step 3: Push the feature branch**

  Run: `git push -u origin agent/billing-foundation`.

- [ ] **Step 4: Open a draft PR targeting `main`**

  Use the GitHub publishing workflow to create a Draft PR describing billing scope, downgrade behavior, required Stripe configuration, tests, and the fact that no deployment or merge was performed.

- [ ] **Step 5: Stop for user review**

  Do not merge, deploy, or start PR2 until the user has reviewed this PR.
