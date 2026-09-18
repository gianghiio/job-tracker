# Resume Tailor

A tool to help tailor resumes and applications to specific job postings. Paste a job description, and Claude (Anthropic's AI) extracts the key requirements, skills, and qualifications so you know exactly what to emphasize. Every analysis is saved, so you can build a searchable history of every job you've applied to.

## Features

- **AI-powered analysis** — paste any job description and get a clean, structured breakdown of key requirements using Claude
- **Application history** — every analyzed job is saved automatically, with company name, job title, and the full original description
- **Search** — filter your history by company name or job title
- **Detail view** — click any history entry to view the full job description and analysis in a popup
- **Delete with confirmation** — remove entries you no longer need

## Tech Stack

- **Frontend:** Next.js (App Router), React, TypeScript
- **Backend:** Next.js API routes
- **Database:** PostgreSQL (hosted on [Neon](https://neon.tech)), accessed via [Prisma](https://prisma.io) ORM
- **AI:** [Anthropic Claude API](https://console.anthropic.com)
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
```

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
