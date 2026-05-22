# Open Journal System (OJS) - SaaS Edition

A modern, production-ready Open Journal System built with Next.js 15, PostgreSQL, Drizzle ORM, and Tailwind CSS.

## Features

- **Role-Based Authentication**: Secure login/registration for Authors, Editors, and Reviewers.
- **Blind Peer Review**: Reviewers see anonymized submissions.
- **Dashboard**: Specialized views for each role.
- **Submission Workflow**: PDF uploads, metadata management.
- **Review Cycle**: Assignment, Feedback, Decision Support.

## Setup Instructions

### 1. Database Configuration

Ensure you have PostgreSQL installed and running. Update `.env` with your connection string:

```env
DATABASE_URL=postgres://user:password@localhost:5432/ojs_db
JWT_SECRET=your_secure_secret_key
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Migration

Run the following command to push schema changes to your database:

```bash
npx drizzle-kit push
```

### 4. Running the Application

Start the development server:

```bash
npm run dev
```

Visit `http://localhost:3000`.

## User Roles

- **Author**: Sign up as an author to submit manuscripts.
- **Editor**: Sign up as an editor to manage submissions and assign reviewers.
- **Reviewer**: Sign up as a reviewer to evaluate assigned papers.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Styling**: Tailwind CSS
- **Authentication**: Custom JWT Session (jose + cookies)
- **Validation**: Zod
