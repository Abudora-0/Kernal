# DevPulse

A GitHub-integrated developer dashboard that turns your public GitHub activity into a beautiful, data-rich profile — contribution graphs, coding streaks, language breakdowns, and a developer score, all in one place.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-3ECF8E?logo=supabase&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma&logoColor=white)

## Features

- **Developer Score** — letter grade (S / A / B / C / D) derived from real GitHub metrics
- **Contribution Graph** — GitHub-style heatmap of your yearly activity
- **Coding Streak** — current and longest streak tracking
- **Language Breakdown** — pie / bar chart of languages used across all repositories
- **Top Repositories** — sorted by stars with description and language tags
- **Activity Feed** — recent commits and pull requests
- **Hourly Heatmap** — activity distribution across hours of the day
- **Public Profile URLs** — shareable pages at `/u/[username]`
- **Search Any Profile** — look up any public GitHub user
- **OAuth Login** — sign in with GitHub to unlock your personalized dashboard

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 3 |
| Auth | NextAuth.js 4 (GitHub OAuth) |
| Database | PostgreSQL via Supabase |
| ORM | Prisma 5 |
| Charts | Recharts |
| API | GitHub REST + GraphQL |
| Icons | Lucide React |

## Getting Started

### Prerequisites

- Node.js 18+
- A PostgreSQL database (e.g. [Supabase](https://supabase.com/) free tier)
- A GitHub OAuth App ([create one here](https://github.com/settings/developers))

### Installation

```bash
git clone https://github.com/yourusername/dev-dashboard.git
cd dev-dashboard
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your_random_secret
NEXTAUTH_URL=http://localhost:3000
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_TOKEN=your_github_pat          # optional — increases API rate limits
```

### Database Setup

```bash
npx prisma migrate dev
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/   # GitHub OAuth
│   │   └── github/               # Data fetching routes
│   ├── dashboard/                # Authenticated dashboard
│   └── u/[username]/             # Public shareable profile
├── components/
│   ├── ContributionGraph.tsx
│   ├── LanguageChart.tsx
│   ├── StreakCard.tsx
│   └── ...
├── lib/
│   ├── auth.ts                   # NextAuth config
│   └── github.ts                 # GitHub API helpers
└── prisma/schema.prisma
```

## License

MIT
