# Kampus — Digital Banking for University Students

## 1. Project Overview

Kampus is an academic prototype of a digital banking application designed for university students in Mexico.

Its purpose is to help students manage their money independently through a digital account, money transfers, debit card payments, savings, and expense tracking.

**Important:** Kampus is an academic prototype. It is not a financial institution, does not process real money, and does not provide actual banking services.

## 2. MVP Features

The prototype includes six main stages:

1. **User Registration:** Users create an account using their full name, mobile phone number, and password. Identity verification is simulated.
2. **Account Opening:** Simulates the opening of an account through a financial partner.
3. **Receiving Money:** Simulates incoming transfers and updates the account balance.
4. **Card Payments:** Simulates purchases and validates the available balance.
5. **Savings:** Allows users to move money between their available balance and savings, including an illustrative return simulation.
6. **Expense Management:** Automatically categorizes purchases and displays a monthly expense summary by category.

The application also includes an expandable section to view recent transactions.

## 3. Technologies Used

- React
- TypeScript
- Vite
- CSS
- LocalStorage for saving demo data in the browser.
- Git for version control.

## 4. Requirements

To run the project, you need:

- Node.js
- npm
- Visual Studio Code (recommended)
- An updated web browser.

## 5. Installation and Setup

### Step 1. Download the Project

Download or clone the Kampus repository and open the project folder in Visual Studio Code.

### Step 2. Install Dependencies

Open a terminal inside the project folder and run:

```bash
npm install
```

### Step 3. Run the Application

Execute:

```bash
npm run dev
```

Open the local address displayed in the terminal, usually:

`http://localhost:5173/`

### Step 4. Build for Production

To verify that the project compiles successfully, run:

```bash
npm run build
```

## 6. Demo Mode

The application uses fictional data to simulate financial operations.

- KYC identity verification is simulated.
- The CLABE is fictional and cannot receive real transfers.
- The card is illustrative and cannot make actual purchases.
- Transfers and payments are demo operations.
- The illustrative 5% annual return is hypothetical and is not an actual or guaranteed rate.
- Expense categorization uses keyword-based rules based on merchant names.
- Data is stored locally in the browser using LocalStorage.

Users should not enter real banking information or personal passwords.

## 7. Scope and Limitations

This project represents an academic MVP and is not a production-ready banking application.

Commercial operation would require, among other elements, an authorized financial partner, real KYC services, secure infrastructure, banking APIs,