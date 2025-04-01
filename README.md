# Finance Tracker

The Personal Finance Tracker is a web application designed to help users manage their finances efficiently. It allows users to track income and expenses, set budgets, establish savings goals, and receive notifications for bill payments or savings milestones. With an intuitive user interface and data visualization, users can gain insights into their spending habits and make informed financial decisions.

## Features

- **User Authentication**: Users can create an account and log in securely.
- **Expense Tracking**: Users can input and categorize their income and expenses to monitor cash flow.
- **Budget Management**: Users can set monthly budgets and receive alerts when they approach spending limits.
- **Alerts**: Users can set spending thresholds, and the system will notify them when they exceed their limits.
- **Notifications**: The app sends alerts related to budget thresholds.
- **Data Visualization**: Graphs and charts provide an overview of financial trends, with expenses categorized for better insights.
- **Export & Reports**: Users can export financial data as CSV or PDF for better analysis.

## Documentation

### Overview
Finance Tracker allows users to take control of their finances by providing an intuitive interface for tracking expenses, setting budgets, and monitoring financial goals.

### How to Run the Application Locally

#### Prerequisites

- Node.js
- npm or yarn

#### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/finance-tracker.git
   cd finance-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

4. To build the application for production, run:
   ```bash
   npm run build
   # or
   yarn build
   ```

5. To start the production server, run:
   ```bash
   npm start
   # or
   yarn start
   ```

### Deployment
The application is deployed on Vercel and can be accessed here:

```
https://web-framework-project.vercel.app/
```

## Project Structure

- `app/`: Main application components and pages.
  - `api/`: API routes for authentication, budgets, and expenses.
  - `dashboard/`: Dashboard components and pages for budgets and expenses.
  - `login/`: Login page.
  - `signup/`: Signup page.
  - `app/dashboard/layout.tsx`: Main layout component.
  - `app/globals.css`: Global CSS styles.
- `components/`: Reusable components.
  - `dashboard/`: Dashboard-specific components.
- `lib/`: Utility functions and database connection logic.
- `models/`: Mongoose models for MongoDB collections.
- `public/`: Public assets.
- `styles/`: Additional styles.
- `README.md`: Project documentation.
- `package.json`: Project dependencies and scripts.
- `tsconfig.json`: TypeScript configuration.
- `next.config.ts`: Next.js configuration.
- `.env.local`: Environment variables.

## Team Contributions

| Feature                                      | Description | Assigned to |
|----------------------------------------------|-------------|-------------|
| User Authentication & Secure Data Storage   | Users can sign up, log in, and securely store financial data with encryption measures. | Robin Mathew |
| Expense                      | Can track expenses for each budget. | Jisna Mathew |
| Budget Creation and Monitoring              | Allows users to set monthly budgets, track spending, and compare actual expenses with budgeted amounts. | Abhisha Mathew |
| Alerts                                      | Users can set spending thresholds, and the system notifies them when they exceed their limits. | Robin Mathew |
| Notifications                 | Alerts for budget threshold warnings. | Robin Mathew |
| Analytics Dashboard                         | Visual representation of financial data using charts. | Jisna Mathew |
| Export Data                                 | Users can export financial records as PDF or CSV for budget and expense tracking. | Abhisha Mathew |

## Tech Stack

- **Frontend**: Next.js (TypeScript)
- **Backend**: Node.js with Express.js
- **Database**: MongoDB (MongoDB Atlas)
- **Authentication**: JWT
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Learn More

To learn more about Next.js, check out:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - Interactive Next.js tutorial.
- [Next.js GitHub Repository](https://github.com/2025-Winter-ITE-5425-IRA/project-phases-the-mathews) - Feedback and contributions are welcome!

