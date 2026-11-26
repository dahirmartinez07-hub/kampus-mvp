Kampus — Academic Fintech MVP for University Students
Kampus is an academic web MVP exploring a simpler way for university students in Mexico to view and organize their money. The current application demonstrates account access, a financial dashboard, incoming transactions, card-purchase flows, savings movements, and expense categorization using fictional data.
Demo only: Kampus is not a bank, SOFIPO, payment institution, or other licensed financial institution. It does not hold customer funds, issue real accounts or cards, execute SPEI transfers, process real payments, or pay contractual interest.

1. Current MVP scope
The application currently includes:
1. Registration: name, phone number, and password, plus demo consent confirmations.
2. Authentication: Supabase Auth configured for the academic prototype.
3. Demo verification code: an OTP is displayed in the application. It is not sent by SMS and is not production-grade MFA.
4. Demo account: a fictional account record associated with the authenticated test user.
5. Dashboard: demo balances and transaction history.
6. Receive money: records a fictional incoming transaction and updates the demo balance.
7. Make a payment: records a fictional purchase, checks available demo balance, and categorizes the expense using merchant-name keyword rules.
8. Savings: moves demo funds between available balance and the savings pocket.
9. Expense view: displays transaction information and categories.
10. Logout: signs out through Supabase and clears application form/state data.
The prototype does not provide a real bank account, operational CLABE, physical or virtual debit card, real KYC, real transfer rails, university tuition collection, or a paid Kampus Plus subscription.
2. Technology stack
- React
- TypeScript
- Vite
- CSS
- Supabase Auth
- Supabase PostgreSQL
- Supabase Row Level Security (RLS) and database RPC functions
- Git and GitHub
- GitHub Actions for install/build checks
- Vercel for hosting/deployment
- npm for package management
Persistence: user profiles, demo accounts, and demo transactions are stored in Supabase/PostgreSQL. The current application does not use LocalStorage as its account database.
3. Requirements
- Node.js (use a version supported by the Vite version installed in the repository)
- npm
- A modern web browser
- Access to the Kampus Supabase project, or your own configured Supabase project
- Git, if cloning the repository
Visual Studio Code is optional; any editor can be used.
4. Environment configuration
The frontend expects:
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
Create a local .env.local file in the project root and add the values supplied by the project administrator.

Security rules:
- Never commit .env.local.
- Never put a Supabase service_role key or other server secret in frontend environment variables.
- Use only the publishable/anon client key intended for browser use, with RLS and database permissions correctly configured.
- Do not put test-account passwords in this repository. Share evaluator credentials only through the course submission/private channel.
5. Installation and local development
git clone https://github.com/dahirmartinez07-hub/kampus-mvp.git
cd kampus-mvp
npm ci
Configure .env.local, then start the development server:
npm run dev
Open the local URL printed by Vite. It is commonly http://localhost:5173/, but Vite may choose another port if that port is already in use.
6. Production build
npm run build
This checks that Vite can compile the frontend. GitHub Actions runs the configured install/build workflow on the relevant push and pull-request events.

A successful build does not by itself prove that Supabase credentials, database policies, authentication, or the deployed user flow are configured correctly. Those require runtime testing.
7. Supabase data model
The MVP uses three main tables:
- profiles: user profile and demo consent metadata.
- kampus_accounts: demo account owner, fictional CLABE, available balance, and savings balance.
- transactions: demo transaction description, amount, type, category, and timestamp.
The database also uses RPC functions for account creation, consent recording, and transaction registration. RLS policies are intended to restrict user data to its owner.

Review database policies and RPC permissions together with frontend changes, especially functions running with elevated privileges.
8. Demo data and limitations
- All balances, account identifiers/CLABE values, and transactions are fictional.
- Incoming transfers and card purchases are simulated; no money moves.
- Savings movements update only the demo ledger.
- The displayed savings return is illustrative, not an actual rate or contractual yield.
- The OTP is shown on screen; it is not delivered by SMS.
- Identity-document/selfie selection is a UI demonstration only. Files are not uploaded to a KYC provider or verified.
- No bank/SOFIPO or BaaS partner is currently contracted for production.
- Kampus Plus at MXN $49/month is a financial-model assumption only. It is not enabled and users are not charged.
- Expense categories use keyword-based rules and may be inaccurate.
- Demo consent text is not a substitute for production legal terms or a reviewed privacy notice.
Use invented test information only. Do not enter real banking credentials, payment-card details, identity documents, or sensitive personal information.
9. Testing checklist
- [ ] A test user can register and sign in from a clean browser.
- [ ] Account and transaction data persist in Supabase after signing out and signing in again.
- [ ] Receiving demo money updates the balance and transaction list.
- [ ] A demo purchase is rejected when the available balance is insufficient.
- [ ] A valid demo purchase updates the balance and transaction list.
- [ ] Savings deposit and withdrawal validate balances and update the demo account.
- [ ] Logout clears the session and form state.
- [ ] User A cannot read or modify User B's records. Keep evidence of this cross-user test.
- [ ] No secrets or test passwords are committed to GitHub.
- [ ] The deployed URL points to the intended commit/branch and the flow works in the hosted environment.
10. Repository workflow
- Work on a feature/phase branch rather than committing directly to main.
- Open a Pull Request targeting main.
- Ask the project partner to review and approve changes.
- Resolve conflicts carefully and preserve intended application behavior.
- Confirm automated checks pass.
- Merge only after the agreed partner review.
- Vercel production is configured to deploy from main; verify production after a merge.
11. Future product and regulatory work
The longer-term concept may require a bank or SOFIPO partner, payment and card providers, identity/KYC services, university agreements, legal review, privacy documentation, AML responsibilities, customer-support arrangements, corporate formation, and intellectual-property work.

These are future dependencies and open decisions, not current MVP integrations. See SPEC.md, DECISIONS.md, and BITACORA.md.
12. Project documents

AGENTS.md — instructions and guidelines for AI coding agents, including project context, development rules, technical conventions, and security requirements.

SPEC.md — current product specification, implemented flow, data model, scope, and regulatory/legal issues.

DECISIONS.md — product and technical decisions, rationale, consequences, and open questions.

BITACORA.md — chronological project and AI-assisted work log.

README.md — setup, run instructions, architecture summary, and demo limitations.
13. Academic-use notice
Kampus is an academic prototype. It is not production-ready and must not be used to store real funds, make real payments, collect real identity documents, or provide financial services. Any future pilot involving real users, money, or personal data requires appropriate legal, regulatory, security, and partner review.
