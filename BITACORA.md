# BITACORA.md — Kampus

Log of AI-assisted work sessions for this project. Each entry documents the objective, the work performed by AI, and the decisions made by the team as a result.

---

## Entry 1 — August 27, 2026

**Objective:** Define Kampus' regulatory framework and prepare the presentation deck for the August 30 submission (slides 1–7, including diagrams on slides 3 and 5), as well as configure `AGENTS.md`, `SPEC.md`, and `BITACORA.md`.

**What the AI did:**

- Helped answer the three regulatory questions (Do we hold funds? Yes; Do we lend money? No; Do we pay returns? Yes) and justify each answer based on the product rather than theory.
- Proposed the operating model: operate as a technology layer (Banking-as-a-Service) on top of an already licensed bank or SOFIPO, rather than having Kampus obtain its own license, as this was the most realistic route for a team at the academic project/MVP stage.
- Created the money flow diagram (user, Kampus, partner institution, merchant + card network), including the four numbered payment steps and their explanations.
- Calculated the metrics for slide 6 (CAC, ARPU, margin, churn, LTV, LTV/CAC, and payback) based on explicit assumptions, and pointed out that net interest margin does not directly apply to the Kampus model because we do not invest deposits ourselves.
- Generated the `.pptx` file with all 7 slides and the three project files (`AGENTS.md`, `SPEC.md`, and `BITACORA.md`) configured for Kampus.

**What the team decided:**

- Accept the BaaS model as the answer for slide 4, understanding that it could be revised in class on Tuesday if the professor identified a more appropriate structure.
- Use Mariana Torres (Accounting student, Guadalajara Campus) as the named user persona on slide 2, and confirm that she is someone the team could actually contact and interview in September.
- Leave the following task for the next entry: validate the MXN $150 CAC and 4% churn assumptions through at least three informal conversations with campus students before the Tuesday presentation of the financial figures.

---

## Entry 2 — September 22, 2026

**Objective:** Move the project forward on two fronts: formally document the regulatory reasoning and build the in-class sprint deliverable (job statements, interview guide, competitor table + 2×2 matrix, and ranked hypotheses), following the methodology covered in Session 14.

**What was requested from the AI and what it did, in order:**

1. The team requested that the content from slides 2 and 3 (user/problem and the three regulatory questions) be separated into an independent document, so it could serve as written supporting material alongside the diagram. The AI extracted that content into a new document.
2. The team requested a more technical memo documenting all the reasoning discussed up to that point, including not only the decisions but also the rationale behind each one. The AI drafted a formal memo covering the regulatory scope, selection of the operating model, fund flow architecture, unit economics, and risks.
3. The team requested that both documents be delivered in Word format rather than Markdown, so they could be submitted or printed directly. The AI recreated them as `.docx` files with formatted tables.
4. The team shared a photo of the professor's slide ("Today's sprint: build your interview guide") and requested that the deliverable be built using the work already completed for Kampus and Mariana. The AI generated the job statements, a 10-question interview guide, a table of 6 competitors with a 2×2 matrix, and 3 ranked hypotheses.
5. The team subsequently shared the professor's complete presentation, which included the exact interview structure, time allocation for each section, and hypothesis template, and requested adjustments to match that format. The AI rewrote the interview guide using 5/5/15/5-minute sections and Mom Test-style questions, reclassified competitors as Direct/Indirect/Incumbent/Status quo, and rewrote the hypotheses using the exact format: "We believe... struggles with... when... We'll know we're right if...".
6. The team requested an update to this log so that it would reflect the questions and adjustments made during the session in greater detail, rather than summarizing everything in one generic entry.

**What the team decided:**

- Keep the Value hypothesis as the riskiest assumption and the first one to validate through interviews.
- Treat the positions in the 2×2 matrix as a starting point rather than a definitive answer; they will be adjusted based on interview findings.
- Schedule the first two interviews before the next class, as requested by the professor.

---

## Entry 3 — November 11, 2026

**Objective:** Prepare the development environment for the Kampus MVP, organize the project documentation, and implement the first step of the core user flow: user registration.

**What the AI did:**

- Guided the team through creating the web project using React and TypeScript with Vite.
- Helped configure the registration screen with full name and mobile phone number fields.
- Implemented a simulated verification process and a registration confirmation screen.
- Based on the decisions, instructions, and visual preferences shared by the team, helped develop and document Kampus' design guidelines in `design.md`.
- Helped create and organize the `AGENTS.md`, `SPEC.md`, `BITACORA.md`, and `design.md` files.
- Guided the initialization of Git and the creation of the first commit.

**What the team decided:**

- Use a web application built with React and TypeScript as the prototype for this sprint.
- Keep identity verification in demonstration mode, without performing an actual KYC process.
- Consider the first functional registration milestone complete.
- Save the progress in commit `26c1903`, with the message "Primer avance: registro funcional de Kampus".

---

## Entry 4 — November 11, 2026

**Objective:** Continue developing the Kampus MVP, expand the main digital account features, and verify that the project compiles correctly.

**What the AI did:**

- Helped implement simulated incoming transfers, updating the available balance and recording transactions.
- Developed the demonstration-mode card payment functionality, including validation to ensure sufficient balance before processing a payment.
- Added a savings section that allows users to move money between their available balance and savings.
- Implemented a simulation of monthly savings returns using an illustrative annual rate of 5%.
- Added automatic expense categorization using keyword-based rules, with categories such as food, transportation, education, entertainment, and others.
- Added a monthly expense summary and the option to view or hide recent transactions.
- Made visual adjustments to improve contrast, readability, and the presentation of the account summary.

**What the team decided:**

- Keep transfers, payments, and returns as simulations, without connecting to real banking services.
- Include the savings section and expense tracking as part of the prototype's functionality.
- Display recent transactions only when the user selects that option, keeping the main dashboard cleaner.
- Maintain keyword-based expense categorization without presenting it as artificial intelligence.
- Continue developing the MVP as an academic prototype rather than a banking application ready for commercial operation.

---

## Entry 5 — November 16, 2026

**Session objective:** Improve the visualization of financial information and the navigation experience of the Kampus MVP.

**Activities performed:**

- Added a pie chart to visualize the user's expenses by category, such as food, transportation, education, and entertainment.
- Added a line chart to display the evolution of savings over time.
- Adjusted the chart calculations so that they reflect the transactions recorded in the application.
- Removed numerical labels from the steps in the user flow to create a more natural navigation experience.
- Verified that the project compiled successfully using `npm run build`, with no errors.
- Committed the changes to Git and successfully pushed them to GitHub.

**Team decisions:**

The team decided to keep the charts within the MVP to help users understand their spending habits and the evolution of their savings. The team also chose to remove the step numbering so that the experience would feel more like a banking application and less like a form.

**Result:**

The MVP's visual features were updated. The changes were saved to GitHub in commit `d94eea3`.

---

## Entry 6 — November 25, 2026

**Objective:** Update and improve Kampus project documentation to reflect the current product vision, technical decisions, and Mexican regulatory considerations.

**What the AI did:**

- Revised the problem statement in `SPEC.md` to focus on the financial management challenges university students face when handling irregular or variable income, tracking expenses, and building savings habits.
- Updated the value proposition to describe Kampus as a centralized platform for managing money, monitoring transactions, organizing savings, and potentially accessing financial services connected to university services.
- Removed the previous problem-framing discussion and replaced it with the updated problem statement.
- Added a Project Documents section to `SPEC.md`, referencing `AGENTS.md`, `README.md`, `DECISIONS.md`, and `BITACORA.md`.
- Reviewed and improved the structure and formatting of `DECISIONS.md`, preserving the 12 existing Architecture Decision Records (ADRs), their statuses, consequences, and open decisions.
- Reviewed the regulatory considerations documented in `SPEC.md`, including personal data protection, financial activities, potential banking or SOFIPO partnerships, SPEI, cards, KYC, AML/CTF, corporate structure, and intellectual property.
- Discussed the relevance of the Mexican Fintech Law and the need to assess the regulatory treatment of Kampus according to its actual activities and financial flows.

**What the team decided:**

- Describe the problem around students' financial organization needs, particularly irregular income, expenses, and savings.
- Keep the distinction between currently implemented MVP functionality and future financial services.
- Maintain the existing technical and product decisions documented in `DECISIONS.md`, without presenting pending decisions or business hypotheses as implemented features.
- Preserve the Mexican regulatory analysis as part of the project documentation and consider applicable legal requirements before moving toward real financial operations.
- Keep the MVP scope focused on completing and documenting the existing functionality rather than introducing unnecessary features.

**Result:**

The project documentation was updated to better reflect Kampus' current product direction, technical architecture, and regulatory considerations. The changes improve consistency across `SPEC.md` and `DECISIONS.md` and provide clearer context for future development and AI-assisted work.
