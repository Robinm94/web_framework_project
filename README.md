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

3. Set up environment variables:

   Create a `.env.local` file in the root directory and add your MongoDB URI:

   ```env
   MONGODB_URI=mongodb+srv://admin:999123@cluster0.ne8rj.mongodb.net/budget
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
