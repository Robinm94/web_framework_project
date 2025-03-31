# Finance Tracker

Finance Tracker is a web application built with Next.js that helps users manage their budgets and expenses effortlessly. The application allows users to register, log in, and track their financial activities through a user-friendly dashboard.

## Features

- User Authentication: Secure login and registration system.
- Expense & Income Tracking: Categorized records of all financial transactions.
- Budget Management: Set and monitor spending limits.
- Financial Goal Setting: Define and track savings goals.
- Data Export: Export financial records in CSV or PDF formats.
- Notifications & Reminders: Alerts for upcoming bills and savings targets.
- Analytics Dashboard: Visual representation of financial data using charts.

## List of Features & Team Responsibilities

- User Authentication and Secure Data Storage

Description: Users can sign up, log in, and securely store their financial data with encryption measures.
Assigned to: Robin Mathew

- Expense and Income Tracking with Categories

Description: Users can track their income and expenses by categorizing them into different segments such as rent, food, and entertainment.
Assigned to: Robin Mathew

- Budget Creation and Monitoring

Description: Allows users to set monthly budgets, track their spending, and compare actual expenses with budgeted amounts.
Assigned to: Abhisha Mathew

Alerts

Description: Provides alerts to remind users of their spending habits, offering insights into expenses to help manage finances effectively.
Assigned to: Abhisha Mathew

- Export Data as CSV or PDF for Offline Use

Description: Enables users to download their financial records in CSV or PDF format for personal use or record-keeping.
Assigned to: Jisna Mathew

- Notifications and Reminders for Bills or Saving Goals

Description: Provides alerts and reminders for upcoming bill payments or financial goal milestones.
Assigned to: Jisna Mathew

## Tech Stack

- Frontend: Next.js (TypeScript)
- Backend: Node.js with Express.js
- Database: MongoDB (MongoDB Atlas)
- Authentication: JWT
- Styling: Tailwind CSS
- Deployment: Vercel

## Getting Started

### Prerequisites

- Node.js
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/finance-tracker.git
   cd finance-tracker
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

### Running the Development Server

To start the development server, run:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

To build the application for production, run:

```bash
npm run build
# or
yarn build
```

To start the production server, run:

```bash
npm start
# or
yarn start
```

## Project Structure

- `app`: Contains the main application components and pages.
  - `api/`: API routes for authentication, budgets, and expenses.
  - `dashboard/`: Dashboard components and pages for budgets and expenses.
  - `login/`: Login page.
  - `signup/`: Signup page.
  - `app/dashboard/layout.tsx`: Main layout component.
  - `app/globals.css`: Global CSS styles.
- `components`: Reusable components.
  - `dashboard/`: Dashboard-specific components.
- `lib`: Utility functions and database connection logic.
- `models`: Mongoose models for MongoDB collections.
- `public`: Public assets.
- `styles/`: Additional styles.
- `README.md`: Project documentation.
- `package.json`: Project dependencies and scripts.
- `tsconfig.json`: TypeScript configuration.
- `next.config.ts`: Next.js configuration.
- `.env.local`: Environment variables.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
