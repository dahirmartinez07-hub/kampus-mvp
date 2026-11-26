# SPEC.md — Kampus

> **Version:** 2.0  
> **Updated:** November 25, 2026  
> **Status:** Academic web MVP running in a test environment; not a production banking product.

---

## 1. Purpose and problem

Kampus is an academic web MVP exploring a digital financial experience for university students in Mexico. It aims to address the challenges students face when managing irregular or variable income, keeping track of expenses, and building savings habits. Students may rely on fragmented tools or manual methods to organize their finances, making it difficult to maintain a clear overview of their financial situation.

Kampus seeks to provide a simple, centralized platform where students can manage their money, monitor transactions, organize savings, and eventually access financial services connected to their university experience.

The size of the problem, willingness to use the product, and willingness to pay remain hypotheses to be validated through documented interviews and evidence.

## 2. Reference user

**Mariana Torres, age 20.** A fifth-semester Accounting student at Universidad Panamericana, Guadalajara Campus. She gives part-time math tutoring and receives variable income. The original persona describes her as combining cash and transfers and tracking expenses manually.

Mariana is a design persona, not market-validation evidence by herself. Interviews, dates, participant counts, and findings must only be recorded when the team has actually conducted and documented them.

## 3. Value proposition

The MVP explores how a student can:

- Create an account to access the prototype.
- View a demo balance and transaction history.
- Record simulated incoming funds.
- Record simulated purchases and validate available balance.
- Set money aside in savings and withdraw it.
- Review transactions and spending categories.

The future vision may include integrations with financial and university services through qualified providers. That vision must not be confused with the current MVP capabilities.

## 4. Current MVP scope

### 4.1 Implemented

1. **Registration:** form with name, phone number, and password; includes demo confirmations for legal age, terms, and privacy notice. Identity/selfie files may be selected as part of the prototype experience, but they are not uploaded or verified.
2. **Authentication:** Supabase Auth configured for the prototype. The login identifier is constructed from the phone number and an internal domain reserved for the demo.
3. **Demo OTP:** a code is displayed on screen; it is not sent by SMS and is not production-grade multi-factor authentication.
4. **Demo account:** a demo account record is created/retrieved for the authenticated user.
5. **Dashboard:** displays demo balances and transactions.
6. **Demo incoming funds:** records a fictional incoming transaction and updates the demo balance.
7. **Demo payment:** records a fictional purchase, validates available balance, and categorizes spending using merchant-name keyword rules.
8. **Demo savings:** allows users to set money aside and withdraw it, subject to balance validation.
9. **Persistence:** profiles, demo accounts, and transactions are stored in Supabase/PostgreSQL; LocalStorage is not used as the account persistence database.
10. **Data isolation:** RLS and RPC functions have been configured to restrict operations to the authenticated user. The course evaluation also requires retained evidence of a cross-user test.

### 4.2 Not available

- There is no real bank account or operational CLABE that can receive transfers.
- No customer funds are held and no SPEI transfers or real payments are executed.
- No physical/virtual card is issued and no real card-network processing is connected.
- No bank, SOFIPO, or BaaS provider has been contracted for production.
- No real KYC takes place: selected files are not transmitted or verified.
- The OTP is not sent by SMS and is not production-grade MFA.
- Any displayed return is illustrative, not contractual or guaranteed.
- There is no tuition collection or university commission agreement.
- Kampus Plus at MXN $49/month is a financial-model hypothesis; it is not enabled or charged.
- Kampus has no proprietary financial authorization and does not operate commercially.

## 5. Main MVP flow

1. The user opens the application and chooses to register or sign in.
2. During registration, the user enters test data, a password, and confirms the demo consent checkboxes.
3. Supabase Auth creates/authenticates the user.
4. The prototype calls the database functions needed to create/retrieve the demo account.
5. The user reaches the dashboard and views the balance and transaction history.
6. The user can record fictional incoming funds; the balance and history update.
7. The user can record a fictional payment; available balance is validated and the balance/history update.
8. The user can deposit money into or withdraw money from the savings pocket, subject to validation.
9. The user can sign out; the Supabase session is closed and application form/state data is cleared.

**Acceptance criterion:** the flow must work in the test environment using invented data, without manually editing the database. The evaluator must be able to sign in with a test account prepared by the team. Credentials must be submitted through Blackboard or another private course channel, never in the repository.

## 6. Current data model

- **`profiles`:** Supabase user ID, name, phone number, and consent confirmation/version fields.
- **`kampus_accounts`:** account ID, owner user ID, fictional CLABE, available balance in cents, savings balance in cents, and creation date.
- **`transactions`:** associated account and user, description, amount in cents, transaction type, optional category, and timestamp.

Supported transaction types:

- `transfer-in`
- `purchase`
- `savings-deposit`
- `savings-withdrawal`

The MVP database is the source of truth for demo balances. In a future product, the source of truth for real funds would be the entity/provider maintaining the account, according to the relevant agreement.

## 7. Current architecture and dependencies

- **Frontend:** React, TypeScript, Vite, and CSS.
- **Authentication and data:** Supabase Auth and PostgreSQL.
- **Data security:** Row Level Security (RLS), RPC functions, and database permissions.
- **Repository:** GitHub.
- **Continuous integration:** GitHub Actions runs installation and build checks on configured push and pull-request events.
- **Hosting:** Vercel.
- **Package manager:** npm.

### Environment variables

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Actual values are configured locally in a Git-ignored file and in the deployment environment. Never store private keys, `service_role` keys, or secrets in the repository.

## 8. Future vision and dependencies not yet contracted

The future vision may require:

- An authorized bank or SOFIPO with permissions appropriate to the specific product.
- A BaaS/API provider and service agreements.
- A qualified SPEI/transfer participant or provider.
- A card issuer, processor, and card network.
- An identity/KYC provider and AML/CTF controls, according to the legal allocation of responsibilities.
- A university and tuition collection/reconciliation provider.
- Monitoring, support, security, and analytics tools.

These dependencies are not currently contracted. Before selecting an entity, verify its legal name, authorization, sector, and status through CNBV and SIPRES.

## 9. Mexican legal framework: preliminary analysis

> This is an academic issue-spotting guide, not a legal opinion, authorization, or confirmation that Kampus may conduct financial activities. Classification depends on actual fund flows, contracts, marketing, operational control, and each party's functions. Specialized legal advice is required before any pilot involving real money or personal data.

### 9.1 Personal data

The general reference for private-sector data controllers is the **Federal Law on Protection of Personal Data Held by Private Parties, issued by the decree published on March 20, 2025**, together with applicable regulations and subsequent amendments.

**Open items:**

- Identify the controller and processor for each data-processing activity.
- Prepare comprehensive and simplified privacy notices and make them available when data is collected.
- Specify purposes, data categories, transfers, and methods for exercising ARCO rights.
- Determine the legal basis and required consent for financial/patrimonial data, identity documents, and sensitive data.
- Apply data minimization, access controls, security, confidentiality, retention, and deletion rules.
- Document incidents, ARCO requests, and processor/vendor agreements.
- Define where data is stored, who can access it, and for how long.

The consent screens in the MVP are demonstrative and do not replace legally reviewed documents for an operating product.

### 9.2 Financial activity and partner

The future hypothesis is that an authorized institution would maintain the financial relationship and funds while Kampus provides a technology layer/interface, subject to legal and contractual review. This does not automatically establish that all Kampus activities fall outside regulation.

**The analysis must determine:**

- Whether the product involves deposit-taking, issuance of electronic payment funds, money transmission, payment services, or another regulated activity.
- Which entity opens/maintains the account, safeguards funds, issues cards, and executes transfers.
- Which entity determines and performs KYC/AML/CTF, transaction monitoring, recordkeeping, and reporting.
- Which activities Kampus performs and under what agreement or legal structure.
- Costs, integration timelines, minimums, limits, service levels, and responsibilities.

No bank or SOFIPO has been selected or contracted. Do not identify an entity as a partner without contractual evidence and due diligence.

### 9.3 Payments, cards, and yield

- SPEI, operational CLABE accounts, cards, and real payments depend on qualified institutions/providers and applicable agreements.
- Do not advertise guaranteed returns without identifying the product, responsible entity, contract, conditions, limits, term, taxes, and risks.
- Any remuneration paid to Kampus by a partner and any return paid to users must be contractually defined and legally reviewed.
- Fees must be disclosed before a user contracts or confirms a transaction.

### 9.4 AML/CTF, KYC, and customer support

Applicable obligations depend on each participant's entity type and activities. Do not assume all obligations transfer to the partner simply because the model is called BaaS.

**Open item:** prepare a responsibility matrix identifying who verifies customers, monitors transactions, retains files, handles alerts, submits reports, and responds to complaints. Define support channels and, where applicable, the UNE and CONDUSEF processes.

### 9.5 Corporate structure and intellectual property

Before operating:

- Compare corporate structures (for example, S.A.P.I. de C.V. and S.A.S.) based on revenue, permitted shareholders, investment, governance, taxes, and costs.
- Verify current limits and requirements for the selected entity type.
- Sign a founders' agreement covering ownership percentages, contributions, vesting, departures, decision-making, and ownership of developments.
- Document ownership/assignment of code, designs, brand, domains, and other assets.
- Conduct a trademark clearance search and assess registering Kampus with IMPI.
- Review third-party licenses and software dependencies.

### 9.6 Kampus Plus

- **Financial-model price:** MXN $49 per month.
- **Status:** unvalidated monetization assumption; not offered or charged in the MVP.
- **Before activation:** define benefits, validate willingness to pay, review costs/margins, and disclose price, renewal, cancellation, billing, and payment consent.

## 10. Security and acceptance criteria

- Each user must access only their own data.
- Keep RLS enabled and review table/function permissions, especially `SECURITY DEFINER` RPC functions.
- Run and retain evidence that User A cannot read or modify User B's data, including outside the UI.
- Do not expose secrets in GitHub, frontend code, logs, or URLs.
- Use invented data and test accounts only.
- Verify logout clears forms and sensitive state.
- Verify the main flow on the test URL and across browsers/devices.
- Do not represent the demo OTP as real MFA.

## 11. Official references

- Decree issuing the LFPDPPP, DOF, March 20, 2025: [Official publication](https://www.dof.gob.mx/nota_detalle.php?codigo=5752569&fecha=20/03/2025)
- Law on Popular Savings and Credit: [Chamber of Deputies](https://www.diputados.gob.mx/LeyesBiblio/pdf/LACP.pdf)
- CNBV, Register of Supervised Entities: [CNBV](https://www.cnbv.gob.mx/Paginas/InfoPES.aspx)
- CNBV, Authorized Entities: [CNBV](https://www.cnbv.gob.mx/Entidades-Autorizadas/Paginas/default.aspx)
- CONDUSEF, SIPRES: [SIPRES](https://webapps.condusef.gob.mx/SIPRES/jsp/pub/index.jsp)

