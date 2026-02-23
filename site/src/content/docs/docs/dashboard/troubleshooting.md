---
title: Troubleshooting
description: Dashboard-side issues and fixes.
---

## Token Missing After Host Creation

Host token is one-time display only.

- Check secure notes/secret store first.
- If unavailable, recreate or rotate host credentials.

## Member Cannot Access Workspace

- Confirm user was added to the correct workspace.
- Confirm invitation link is valid and not expired.
- Add the user directly by user ID.

## Cannot Perform Admin Actions

Admin actions require `owner` role.

- Check current role.
- Ask existing owner to elevate permission if needed.
