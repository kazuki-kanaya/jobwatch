# Billing Foundation Specification

## Goal

Add the first production-oriented billing foundation for Obsern: a user-level Free/Pro subscription, Stripe-hosted checkout and customer portal, webhook-driven subscription state, and an account-level workspace quota.

## Product boundary

The repository remains public. The hosted product is monetized through the managed dashboard, authentication, reliable long-running job monitoring, data retention, and operational support. This change must not put Stripe secrets, customer payment data, or production credentials in the repository.

## Plans

The subscription belongs to the authenticated user account, not to an individual workspace. This is required because Pro permits three workspaces under one subscription.

| Entitlement | Free | Pro |
| --- | ---: | ---: |
| Workspaces owned by an account | 1 | 3 |
| Hosts per workspace | 1 | 5 |
| Stored jobs per workspace | 30 | 3000 |
| Retained log lines per job | 15 | 50 |
| Retention period | 7 days | 30 days |

PR1 exposes the complete plan definition but enforces only the workspace limit. Host/job/log/retention enforcement belongs to PR2 so that usage accounting and DynamoDB TTL behavior can be reviewed separately.

## Billing lifecycle

- `GET /billing` returns the current plan, subscription state, workspace usage, and all plan limits.
- `POST /billing/checkout` creates a Stripe-hosted subscription Checkout Session for the configured Pro price.
- `POST /billing/portal` creates a Stripe-hosted Customer Portal Session for an existing Stripe customer.
- `POST /webhooks/stripe` verifies the raw request signature before processing subscription events.
- Stripe event handling is safe to retry: repeated events converge to the same billing account state.
- Subscription state is stored under the user's existing DynamoDB partition as a billing item.

## Downgrade behavior

Downgrading never deletes workspaces or data. If an account has more than one workspace when it becomes Free, the account can continue reading existing workspaces but cannot create another workspace until it returns within the Free limit or upgrades to Pro.

## Design constraints

- Stripe API calls live behind a small gateway boundary; domain services do not construct Stripe payloads directly.
- Plan limits are pure application policy and do not depend on Stripe or DynamoDB.
- Stripe customer/subscription identifiers are stored server-side only.
- Webhook authentication uses Stripe's signature verification against the unmodified request body.
- Checkout and Portal URLs are returned to the frontend; the API never handles card data.
- PR1 must not change CLI authentication or job ingestion behavior.
