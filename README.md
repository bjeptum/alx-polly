# ALX Polly - Polling App with QR Code Sharing

A modern polling application built with Next.js, Supabase, and TypeScript. Create polls, share them via QR codes, and collect votes from users.

## Features

- 🔐 User authentication and registration
- 📊 Create and manage polls with multiple options
- 🗳️ Vote on polls (authenticated and anonymous)
- 📱 Share polls via QR codes
- 📈 View poll results with interactive charts
- 🎨 Modern UI with Tailwind CSS and shadcn/ui

## Tech Stack

- **Frontend**: Next.js 15.5.2 (App Router), React 19, TypeScript
- **Backend**: Supabase (Database, Auth, Real-time)
- **Styling**: Tailwind CSS, shadcn/ui components
- **QR Codes**: qrcode.react
- **Forms**: React Hook Form with Zod validation

## Getting Started

### Prerequisites

- Node.js 18+ 
- A Supabase account and project

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd alx-polly
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to your project's API settings: `https://supabase.com/dashboard/project/_/settings/api`
3. Copy your project URL and anon key

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Optional: Service role key for server-side operations
# SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 4. Database Setup

1. Open the Supabase SQL editor in your project dashboard
2. Copy and paste the contents of `supabase/schema.sql`
3. Run the SQL to create the database schema

### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
