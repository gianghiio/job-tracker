# Resume Tailor

A tool to help tailor resumes and applications to specific job postings. Upload your resume once, paste a job description, and Claude (Anthropic's AI) extracts the key requirements and shows which points in your resume to emphasize. Every analysis is saved to your own account, so you build a searchable history of every job you've applied to.

Live Demo:
https://job-tracker-hazel-one.vercel.app

## Features

- **Sign in with Google or email** — accounts are handled by Clerk, and every resume and analysis belongs to the signed-in user only
- **Resume upload** — upload a PDF once (up to 4 MB); the text is extracted on the server and shown back as the sections found (Summary, Skills, Experience and so on)
- **Resume matching** — with a resume on file, each analysis returns the job's key requirements plus the resume points most relevant to that job and how to phrase them
- **AI-powered analysis** — paste any job description and get a clean, structured breakdown of key requirements using Claude
- **Application history** — every analyzed job is saved automatically, with company name, job title, and the full original description
- **Search** — filter your history by company name or job title
- **Detail view** — click any history entry to view the full job description and analysis in a popup
- **Delete with confirmation** — remove history entries or your uploaded resume

## Tech Stack

- **Frontend:** Next.js (App Router), React, TypeScript
- **Backend:** Next.js API routes
- **Authentication:** [Clerk](https://clerk.com) (Google and email sign-in)
- **Database:** PostgreSQL (hosted on [Neon](https://neon.tech)), accessed via [Prisma](https://prisma.io) ORM
- **AI:** [Anthropic Claude API](https://console.anthropic.com)
- **PDF parsing:** pdf-parse
- **Markdown rendering:** react-markdown + remark-gfm (for tables)

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/gianghiio/job-tracker.git
cd job-tracker
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the root directory with:

```
DATABASE_URL="your-neon-postgres-connection-string"
ANTHROPIC_API_KEY="your-anthropic-api-key"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your-clerk-publishable-key"
CLERK_SECRET_KEY="your-clerk-secret-key"
```

Get the Clerk keys by creating a free application at [clerk.com](https://clerk.com) and enabling Google and email sign-in.

Also create a plain `.env` file with the same `DATABASE_URL` value, since Prisma CLI reads from `.env` for migrations.

### 3. Set up the database

```bash
npx prisma generate
npx prisma migrate dev
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Roadmap

- [x] Job analysis with Claude
- [x] PDF resume upload and resume-to-job matching
- [x] History with search and delete
- [x] Landing page with FAQ
- [x] Sign in with Google and email (Clerk)
- [x] Per-user resumes and history
- [x] Delete my resume button
- [ ] Application status tracking (Applied / Interviewing / Rejected / Offer)
- [ ] Suggested rewrites for resume bullets
