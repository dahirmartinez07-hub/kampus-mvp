# DECISIONS.md — Kampus

> Record of product, architecture, operations, and documentation decisions. This document distinguishes decisions implemented in the current MVP from future proposals and items awaiting validation.

---

## Status definitions

- **Accepted:** Decision adopted for the current project scope.
- **Pending:** Requires evidence, team approval, a contract, or implementation.
- **Hypothesis:** Business or product assumption that has not yet been validated.

---

## Architecture and technology decisions

### ADR-001 — Web MVP before native mobile app

- **Status:** Accepted.
- **Decision:** Build the MVP as a web application using React, TypeScript, and Vite.
- **Context and rationale:** Demonstrate the core flow in a test environment with less complexity than a native mobile app.
- **Consequence:** The current project is not a Flutter app published in app stores.

### ADR-002 — Supabase for authentication and persistence

- **Status:** Accepted.
- **Decision:** Use Supabase Auth and PostgreSQL for prototype authentication and persistence of profiles, demo accounts, and transactions.
- **Alternatives considered:** LocalStorage, a custom backend, or Supabase.
- **Rationale:** Managed authentication and database without building additional infrastructure for the MVP.
- **Consequence:** The app depends on Supabase configuration and availability. Supabase is not a financial institution and does not safeguard real funds.

### ADR-003 — Demo operations through RPC functions

- **Status:** Accepted.
- **Decision:** Record transactions and update demo balances through PostgreSQL RPC functions.
- **Rationale:** Centralize validations and related updates in the database.
- **Consequence:** Every function requires permission review, user validation, and testing. No real money is moved.

### ADR-004 — RLS for data separation

- **Status:** Accepted; retained evidence of a cross-user test is still pending.
- **Decision:** Use Row Level Security (RLS) to restrict access to records associated with the authenticated user.
- **Consequence:** Review new tables, views, and functions; pay special attention to `SECURITY DEFINER` functions.
- **Required test:** Demonstrate that User A cannot read or modify User B's data.

---

## Security and identity decisions

### ADR-005 — Demonstration-only OTP

- **Status:** Accepted as a limitation.
- **Decision:** Keep the on-screen OTP to demonstrate a verification step.
- **Consequence:** It must not be described as SMS delivery or production multi-factor authentication (MFA). A pilot requires appropriate authentication and a real second factor if warranted.

### ADR-006 — Identity documents are not transmitted in the MVP

- **Status:** Accepted.
- **Decision:** Allow test-file selection, but do not upload files or validate them through a KYC provider.
- **Rationale:** Avoid collecting real identity documents in an academic demo.
- **Consequence:** File selection must not be presented as identity verification.

### ADR-007 — Fictional account, CLABE, and transactions

- **Status:** Accepted.
- **Decision:** Label account data and transactions as demonstrative.
- **Consequence:** No real bank account, operational CLABE, SPEI transfers, issued cards, real payments, or custody of funds.

---

## Business model and product decisions

### ADR-008 — Financial partner as the target route

- **Status:** Hypothesis / Pending.
- **Proposed decision:** Evaluate a model in which an authorized institution opens and maintains the account and funds, while Kampus provides the interface and university integration.
- **Open items:**
  - Legal analysis of the actual financial flow.
  - Institution selection and CNBV/SIPRES verification.
  - Costs and integration timelines.
  - Contractual terms and service levels.
  - KYC/AML responsibility matrix.
- **Regulatory boundary:** Calling the model BaaS does not determine its regulatory treatment by itself.

### ADR-009 — Kampus Plus remains a hypothesis

- **Status:** Hypothesis.
- **Decision:** Retain MXN $49 per month in the financial model, without enabling subscriptions or charges in the MVP.
- **Consequence:** Modeled penetration and price are not proven demand. Validate benefits, willingness to pay, and costs before launch.

---

## Project management and deployment decisions

### ADR-010 — Do not expand the frozen scope

- **Status:** Accepted for the FIN506 submission.
- **Decision:** Fix and complete the existing core flow; do not add new features during finalization.
- **Context:** The final course instructions state that scope was frozen at Avance 2.
- **Consequence:** Prioritize fixes, stability, documentation, and testing.

### ADR-011 — Pull Requests for integration

- **Status:** Accepted.
- **Decision:** Work on phase branches and request partner review before integrating into `main`.
- **Consequence:** Each Pull Request should state its purpose, affected files, tests, and limitations. It is not considered merged until GitHub confirms the merge.

### ADR-012 — `main` as the production branch

- **Status:** Accepted.
- **Decision:** Use `main` as the Vercel production branch and work branches for previews.
- **Consequence:** After merging, verify that Vercel deploys the new `main` commit. Redeploying does not include changes that exist only on another branch.

---

## Open decisions

The following items require further research, validation, agreements, or implementation before Kampus can move toward a real financial service.

| ID | Topic | Evidence required |
|---|---|---|
| OPEN-01 | Problem and user | Documented interviews and published data. |
| OPEN-02 | Financial partner | Candidates, verified authorization, written fees, and timelines. |
| OPEN-03 | KYC and AML/CTF | Legal opinion and responsibility matrix. |
| OPEN-04 | Personal data | Privacy notices, consents, data map, agreements, and ARCO process. |
| OPEN-05 | SPEI and cards | Agreements and qualified providers. |
| OPEN-06 | Yield | Contractual product, rate, conditions, and taxes. |
| OPEN-07 | University | Agreement, commission, reconciliation, and willingness-to-pay evidence. |
| OPEN-08 | Corporate structure and founders | Legal/tax comparison and founders' agreement. |
| OPEN-09 | Intellectual property | Code/brand ownership, licenses, and IMPI search. |
| OPEN-10 | Kampus Plus | Benefits, pricing test, margin, and terms. |
| OPEN-11 | Security | Cross-user test, RLS/RPC review, and security assessment. |

---

## Change log

- **November 25, 2026:** Documented the actual web stack, Supabase, simulated operations, OTP/KYC limitations, uncontracted financial partner, Kampus Plus as a hypothesis, and PR workflow.
