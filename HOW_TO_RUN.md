# DevPulse — How to Run

## Prerequisites
- Node.js v18+ installed
- A GitHub account
- A Supabase account (free)

---

## 1. Install Dependencies

```powershell
cd D:\Projects\dev-dashboard
npm install
```

---

## 2. Set Up Environment Variables

The `.env` file is already configured. Make sure it exists at `D:\Projects\dev-dashboard\.env` with the following:

```env
DATABASE_URL="your-supabase-connection-string"
DIRECT_URL="your-supabase-connection-string"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret"
GITHUB_ID="your-github-oauth-app-client-id"
GITHUB_SECRET="your-github-oauth-app-client-secret"
```

---

## 3. Set Up GitHub OAuth App

1. Go to https://github.com/settings/developers
2. Click **"New OAuth App"**
3. Fill in:
   - **Application name:** `Dev Dashboard`
   - **Homepage URL:** `http://localhost:3000`
   - **Authorization callback URL:** `http://localhost:3000/api/auth/callback/github`
4. Copy the **Client ID** and **Client Secret** into `.env`

---

## 4. Push Database Schema

```powershell
npx prisma db push
```

This creates all required tables in your Supabase database.

---

## 5. Run the App

```powershell
npm run dev
```

Open your browser and go to:
```
http://localhost:3000
```

---

## 6. Sign In

- Click **"Continue with GitHub"**
- Authorize the app
- You'll be redirected to your personal dashboard

---

## Features

| Feature | Description |
|---------|-------------|
| 📊 Contribution Graph | GitHub-style heatmap of your yearly activity |
| 🏆 Developer Score | Grade (S/A/B/C/D) based on your GitHub stats |
| 🔥 Coding Streak | Current and longest contribution streak |
| 🕐 Coding Hours | Activity heatmap by hour of the day |
| 💻 Top Languages | Languages used across your repositories |
| 📁 Repositories | Top repos sorted by stars |
| 📝 Recent Commits | Latest commits across all your repos |
| 🔀 Pull Requests | Recent PR activity with status |
| 🔍 Search Any User | Search any public GitHub profile |
| 🌐 Shareable Profile | Public profile at `/u/your-username` |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma |
| Auth | NextAuth.js (GitHub OAuth) |
| Charts | Recharts |
| Icons | Lucide React |
| API | GitHub REST + GraphQL API |

---

## Folder Structure

```
dev-dashboard/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/   # NextAuth handler
│   │   ├── github/               # Authenticated user data
│   │   └── user/[username]/      # Public user data
│   ├── dashboard/                # Main dashboard page
│   ├── login/                    # Login page
│   └── u/[username]/             # Public profile page
├── components/
│   ├── CommitFeed.tsx
│   ├── ContributionGraph.tsx
│   ├── HourlyHeatmap.tsx
│   ├── LanguageChart.tsx
│   ├── PRFeed.tsx
│   ├── RepoCard.tsx
│   ├── ScoreCard.tsx
│   ├── StatCard.tsx
│   └── StreakCard.tsx
├── lib/
│   ├── auth.ts                   # NextAuth config
│   ├── github.ts                 # GitHub API helpers
│   └── prisma.ts                 # Prisma client
├── prisma/
│   └── schema.prisma             # Database schema
└── .env                          # Environment variables
```
