const GITHUB_API = "https://api.github.com";

export async function githubFetch(path: string, token?: string) {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${GITHUB_API}${path}`, { headers, next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status} ${path}`);
  return res.json();
}

export async function getUserProfile(username: string, token?: string) {
  return githubFetch(`/users/${username}`, token);
}

export async function getUserRepos(username: string, token?: string) {
  return githubFetch(`/users/${username}/repos?sort=updated&per_page=100`, token);
}

export async function getUserEvents(username: string, token?: string) {
  return githubFetch(`/users/${username}/events?per_page=100`, token);
}

export async function getRepoLanguages(owner: string, repo: string, token?: string) {
  return githubFetch(`/repos/${owner}/${repo}/languages`, token);
}

export async function getContributions(username: string, token: string) {
  // Use GraphQL for contribution data
  const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
                color
              }
            }
          }
        }
      }
    }
  `;

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables: { username } }),
    next: { revalidate: 300 },
  });

  if (!res.ok) throw new Error("GraphQL error");
  const data = await res.json();
  return data.data?.user?.contributionsCollection?.contributionCalendar;
}
