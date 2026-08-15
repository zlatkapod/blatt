# Deploying Blatt to Cloudflare

Blatt is a static, backend-free app. There is no server code, no database, no
secrets, and nothing to configure at runtime — so deployment is "upload a folder of
files to the edge" and nothing more.

Two routes are covered:

- **[Workers](#route-a--workers-recommended)** — deploy from your machine with `wrangler`. Recommended.
- **[Pages](#route-b--pages-with-git-push-to-deploy)** — connect a Git repo, push to deploy.

Pick one. Do not do both, for reasons explained in
[Pick your hostname first](#-pick-your-hostname-first).

---

## Before you start

You need:

- A Cloudflare account (the free plan is more than enough).
- Node 20 or newer. Check with `node -v`.
- The project installed and building:

```bash
cd ~/PycharmProjects/blatt
npm install
npm run build
```

You should see `dist/` appear with `index.html` and an `assets/` folder. If the
build fails, fix that before going anywhere near Cloudflare.

---

## ⚠️ Pick your hostname first

Read this before your first deploy. It is the one decision that is genuinely
annoying to reverse.

Your tutorials are stored in the browser's **IndexedDB**, which is scoped to the
**origin** — the exact scheme + hostname serving the app. That means:

| If you… | Then… |
| --- | --- |
| Deploy to `blatt.yourname.workers.dev` and use it | Tutorials are tied to that hostname |
| Later move to `blatt.example.com` | The new address has a **fresh, empty library** |
| Use it on your laptop and your phone | Each has its own separate library — there is no sync |
| Clear site data for the origin | The library goes with it |

Nothing is corrupted or lost from Cloudflare's side — the old data still sits in the
old origin's database. But you would have to go back to the old URL to reach it.

**So:** if you know you want `blatt.example.com`, set the custom domain up
(step 5 below) *before* you write twenty tutorials.

If you don't want to decide yet, that's fine too — just remember the exported
`.blatt.html` files are the durable store. Export what you care about into a synced
folder (iCloud, Dropbox, a Git repo) and moving hostnames costs you one afternoon of
re-importing rather than your whole library.

---

## Route A — Workers (recommended)

`wrangler.jsonc` in the project root is already configured. It has no `main` field,
which makes this an **assets-only Worker**: Cloudflare serves the files and never
runs any code.

```jsonc
{
  "name": "blatt",
  "compatibility_date": "2026-08-15",
  "assets": {
    "directory": "./dist",
    "not_found_handling": "single-page-application"
  },
  "observability": { "enabled": true }
}
```

### 1. Log in

```bash
npx wrangler login
```

This opens a browser window asking you to authorise Wrangler against your Cloudflare
account. Approve it, then return to the terminal. Confirm it worked:

```bash
npx wrangler whoami
```

You should see your account email and account ID.

### 2. Deploy

```bash
npm run deploy
```

That runs `npm run build && wrangler deploy` — so it always ships a fresh build
rather than whatever happened to be in `dist/`.

**On your very first deploy**, if you have never used `workers.dev` before, Cloudflare
will ask you to register a subdomain (e.g. `yourname`). Pick something and confirm;
it applies to your whole account, not just this project.

Expected output, roughly:

```
Total Upload: xx KiB / gzip: xx KiB
Uploaded blatt (x.xx sec)
Deployed blatt triggers (x.xx sec)
  https://blatt.yourname.workers.dev
Current Version ID: 0f3c…
```

Open that URL. You should get the Blatt library screen.

### 3. Check it actually works

```bash
# Should return 200 and text/html
curl -sI https://blatt.yourname.workers.dev | head -n 5

# Hashed assets should be cached forever
curl -sI https://blatt.yourname.workers.dev/assets/index-XXXX.js | grep -i cache-control

# The shell must NOT be cached, or deploys won't reach you
curl -sI https://blatt.yourname.workers.dev/ | grep -i cache-control
```

Those cache rules come from `public/_headers`, which Vite copies into `dist/` at
build time. If the headers don't look right, see
[Troubleshooting](#troubleshooting).

Then check the app itself:

1. Visit `/#/sample` — you should see the worked example sheet.
2. Click **Copy to my library**, then **Export**. A `.blatt.html` file downloads.
3. Open that file directly from your Downloads folder. It should render with no app
   and no network.
4. Back in the app, click **Import** and select it. It should round-trip cleanly.

If all four work, the deploy is genuinely fine.

### 4. Preview locally through Cloudflare's runtime

Before deploying a change, you can serve the built app through the real edge runtime:

```bash
npm run cf:preview     # build + wrangler dev
```

This is closer to production than `npm run dev`, because it applies the same asset
handling and headers. Use `npm run dev` for day-to-day work — it has hot reload.

### 5. Add a custom domain (optional, but decide early)

Your domain must already be on Cloudflare (its nameservers pointing at Cloudflare).

1. Cloudflare dashboard → **Workers & Pages** → click **blatt**.
2. **Settings** → **Domains & Routes** → **Add** → **Custom domain**.
3. Enter e.g. `blatt.example.com` and save.

Cloudflare creates the DNS record and issues the certificate automatically. It is
usually live within a minute or two.

Re-read [Pick your hostname first](#-pick-your-hostname-first) before doing this if
you have already been using the `workers.dev` address for real work.

### 6. Make it private (optional)

The app is local-first, so a stranger who finds the URL gets their own empty
database — they cannot see your tutorials. But if you would rather it not be
publicly reachable at all:

1. Cloudflare dashboard → **Zero Trust** → **Access** → **Applications**.
2. **Add an application** → **Self-hosted**.
3. Set the domain to your Worker's hostname.
4. Add a policy: action **Allow**, rule **Emails** → your email address.

Now anyone hitting the URL gets a login gate first. The free Zero Trust tier covers
50 users, which is ample for a household.

### 7. Rolling back

Every deploy creates a version. To go back:

```bash
npx wrangler deployments list   # find the version you want
npx wrangler rollback           # interactive, or pass a version ID
```

### 8. Logs

`observability` is enabled in `wrangler.jsonc`, so requests are logged. To watch live:

```bash
npx wrangler tail
```

For a static app there is very little to see, but it's useful for confirming requests
are arriving at all.

---

## Route B — Pages (with Git push-to-deploy)

Use this instead of Route A if you want "push to the repo, it deploys itself" and
you don't mind giving Cloudflare access to your Git host.

1. Put the project in a Git repo and push it to GitHub or GitLab.
2. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** →
   **Connect to Git**.
3. Authorise and pick the repository.
4. Configure the build:

   | Setting | Value |
   | --- | --- |
   | Framework preset | None (or Vite) |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Root directory | *(leave blank)* |
   | Node version | Set env var `NODE_VERSION` = `20` if the build fails |

5. **Save and Deploy.**

You get `blatt.pages.dev`, plus a unique preview URL for every branch and pull
request.

⚠️ **Preview deployments each get their own hostname** (`abc123.blatt.pages.dev`),
which means each one has its own empty IndexedDB. Do your real work on the production
URL only, or you will wonder where your tutorials went.

`wrangler.jsonc` is ignored by Pages — it belongs to Route A. `public/_headers` still
applies.

---

## Deploying from CI (optional)

If you'd rather have a pipeline deploy Route A for you:

### Create an API token

1. Cloudflare dashboard → **My Profile** → **API Tokens** → **Create Token**.
2. Use the **Edit Cloudflare Workers** template.
3. Scope it to your account, create it, and **copy the token now** — it is shown once.
4. Note your **Account ID** from the Workers & Pages overview page.

### GitLab CI

Add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as masked, protected CI/CD
variables (Settings → CI/CD → Variables), then:

```yaml
deploy:
  image: node:20
  stage: deploy
  only:
    - main
  script:
    - npm ci
    - npm test
    - npx wrangler deploy
```

### GitHub Actions

Add the same two values as repository secrets, then `.github/workflows/deploy.yml`:

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm test
      - run: npx wrangler deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

`npm test` before `wrangler deploy` is deliberate: the round-trip tests guard the
export format, which is the one thing in this app you cannot fix after the fact if
people have already saved files.

---

## Troubleshooting

| Symptom | Cause and fix |
| --- | --- |
| `wrangler login` hangs or fails | Run `npx wrangler login --browser=false` and paste the URL into a browser manually. |
| `You need to register a workers.dev subdomain` | Expected on a brand-new account. Follow the prompt, or set one in the dashboard under Workers & Pages → your subdomain. |
| Deploy succeeds, page is blank | Almost always a stale `dist/`. Run `rm -rf dist && npm run build && npx wrangler deploy`. Check the browser console for a 404 on the JS bundle. |
| Deploy succeeds, but I see the old version | `index.html` got cached. Confirm with the `curl -sI …/ \| grep -i cache-control` check above; it must be `no-cache`. Hard-reload (Cmd-Shift-R) to confirm it's a cache issue and not a failed upload. |
| `_headers` rules not applied | Confirm the file landed in the build: `cat dist/_headers`. It lives in `public/`, and Vite copies `public/` into `dist/` — if it isn't there, the build didn't run. |
| A deep link like `/t/abc` 404s | Shouldn't happen — Blatt uses hash routes (`/#/t/abc`), so the edge only ever sees `/`. If you see this, check `not_found_handling` is still `"single-page-application"` in `wrangler.jsonc`. |
| Build fails in CI but works locally | Node version mismatch. Pin Node 20+ in the pipeline, and use `npm ci` rather than `npm install`. |
| **My tutorials disappeared** | You changed origin — see [Pick your hostname first](#-pick-your-hostname-first). Go back to the previous URL, export everything, then import at the new one. |

---

## What you do *not* need to configure

Worth stating plainly, because most deploy guides bury you in this and none of it
applies here:

- **No environment variables.** The app reads none.
- **No secrets or API keys.** There is no backend to authenticate against.
- **No database, KV, R2, or D1 bindings.** Storage is the visitor's own browser.
- **No build configuration on Cloudflare's side** for Route A — you build locally and
  upload the result.
- **No CORS, no origin rules, no Workers routes.** One hostname, static files.

The free Workers plan allows 100,000 requests a day. A handful of static files for a
household will not come close.
