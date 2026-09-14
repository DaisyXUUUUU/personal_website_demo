# personal_website_demo

This is a [Next.js](https://nextjs.org) project bootstrapped with [v0](https://v0.app).

## Built with v0

This repository is linked to a [v0](https://v0.app) project. You can continue developing by visiting the link below -- start new chats to make changes, and v0 will push commits directly to this repo. Every merge to `main` will automatically deploy.

[Continue working on v0 →](https://v0.app/chat/projects/prj_5EUTrugaHTxK7rL5xCvLqbGSk3Yi)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Portfolio Studio

The private content manager lives at `/admin`. It manages education, skills, work experience,
projects, hobbies, and their images. Drafts stay in the current browser until the owner previews
and publishes them. Publishing creates one GitHub commit on `main`, which triggers the existing
automatic deployment.

### One-time production setup

1. Create a GitHub OAuth App. Set its homepage to the deployed site URL and its callback URL to
   `https://your-domain.com/api/admin/auth/callback`.
2. Create a fine-grained GitHub token limited to this repository with **Contents: Read and write**.
3. Generate a long random value for `ADMIN_SESSION_SECRET`.
4. Choose a private publish command, then run:

   ```bash
   pnpm admin:hash-command "your private publish command"
   ```

   Store only the resulting SHA-256 hash as `ADMIN_PUBLISH_COMMAND_HASH`.
5. Add all Portfolio Studio variables listed in `.env.example` to the deployment environment.
   Never prefix these values with `NEXT_PUBLIC_`.

For local UI testing only, `ADMIN_DEV_BYPASS=true` bypasses GitHub login when `NODE_ENV` is not
`production`. This flag is deliberately ignored in production.

## Learn More

To learn more, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [v0 Documentation](https://v0.app/docs) - learn about v0 and how to use it.
