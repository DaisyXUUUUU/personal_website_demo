type TreeEntry = {
  path: string
  mode: '100644'
  type: 'blob'
  sha: string
}

type PublishFile = {
  path: string
  content: Buffer
}

function githubConfig() {
  return {
    token: process.env.GITHUB_CONTENT_TOKEN ?? '',
    owner: process.env.GITHUB_CONTENT_OWNER ?? 'DaisyXUUUUU',
    repo: process.env.GITHUB_CONTENT_REPO ?? 'personal_website_demo',
    branch: process.env.GITHUB_CONTENT_BRANCH ?? 'main',
  }
}

async function githubRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const { token } = githubConfig()
  if (!token) throw new Error('GitHub publishing is not configured.')
  const response = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    cache: 'no-store',
  })
  if (!response.ok) {
    const detail = await response.text()
    throw new Error(`GitHub rejected the publish request (${response.status}): ${detail.slice(0, 300)}`)
  }
  return response.json() as Promise<T>
}

export async function publishFilesToGitHub(files: PublishFile[], message: string) {
  const { owner, repo, branch } = githubConfig()
  const base = `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`
  const ref = await githubRequest<{ object: { sha: string } }>(`${base}/git/ref/heads/${encodeURIComponent(branch)}`)
  const commit = await githubRequest<{ tree: { sha: string } }>(`${base}/git/commits/${ref.object.sha}`)

  const entries: TreeEntry[] = []
  for (const file of files) {
    const blob = await githubRequest<{ sha: string }>(`${base}/git/blobs`, {
      method: 'POST',
      body: JSON.stringify({ content: file.content.toString('base64'), encoding: 'base64' }),
    })
    entries.push({ path: file.path, mode: '100644', type: 'blob', sha: blob.sha })
  }

  const tree = await githubRequest<{ sha: string }>(`${base}/git/trees`, {
    method: 'POST',
    body: JSON.stringify({ base_tree: commit.tree.sha, tree: entries }),
  })
  const nextCommit = await githubRequest<{ sha: string; html_url: string }>(`${base}/git/commits`, {
    method: 'POST',
    body: JSON.stringify({ message, tree: tree.sha, parents: [ref.object.sha] }),
  })
  await githubRequest(`${base}/git/refs/heads/${encodeURIComponent(branch)}`, {
    method: 'PATCH',
    body: JSON.stringify({ sha: nextCommit.sha, force: false }),
  })

  return { sha: nextCommit.sha, url: nextCommit.html_url }
}
