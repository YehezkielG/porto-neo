# Yehezkiel Haganta Portfolio

Public portfolio built with Next.js, React, TypeScript, and Tailwind CSS. Portfolio content is maintained in `app/data/portfolio.ts`, so the site does not need the PHP API.

## Run locally

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

The browser sends chat requests to this app's `/api/ask-kiel` route. That server route forwards them to the existing chatbot endpoint at `KIRO_BACKEND_URL`, so a secret key can stay on the server and is never bundled into browser JavaScript. Set `KIRO_API_SECRET_KEY` in `.env.local` or the Vercel server environment when the upstream endpoint requires it; the route sends it as a Bearer token. Neither environment variable uses the `NEXT_PUBLIC_` prefix. The upstream endpoint must allow server-to-server requests from this deployment if it has additional access rules.
