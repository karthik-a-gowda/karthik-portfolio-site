# Quickstart: Personal Portfolio & Branding Website

**Feature**: `001-personal-portfolio-website`  
**Stack**: Astro 5.x · Tailwind CSS v4 · TypeScript 5.x · GitHub Pages  
**Date**: 2026-03-15

---

## Prerequisites

| Tool | Version | Check |
|------|---------|-------|
| Node.js | 20 LTS or later | `node --version` |
| npm | 10+ (bundled with Node 20) | `npm --version` |
| Git | Any recent version | `git --version` |

---

## 1. Scaffold the Project

From the repository root:

```bash
npm create astro@latest . -- --template minimal --typescript strict --no-git --install
```

> Accept all prompts. The `--typescript strict` flag enables strict mode, which is required for the `satisfies` operator used in `content.ts`.

---

## 2. Install Dependencies

```bash
# Tailwind CSS v4 + Astro integration
npm install tailwindcss @astrojs/tailwind

# Accessibility linting (development only)
npm install -D eslint eslint-plugin-jsx-a11y

# Accessibility testing (CI and local)
npm install -D @axe-core/playwright playwright
npx playwright install chromium
```

---

## 3. Configure Astro for GitHub Pages

Edit `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://<your-github-username>.github.io',
  // If deploying to a project page (not user page), add:
  // base: '/portfolia-website-karthik',
  output: 'static',
  integrations: [tailwind()],
});
```

> Replace `<your-github-username>` with your actual GitHub username. If the site is deployed to `https://username.github.io/portfolia-website-karthik`, uncomment the `base` line.

---

## 4. Populate `src/content.ts`

Open your resume PDF and populate every field in `src/content.ts`. The file ships with placeholder values; every field has a JSDoc comment explaining what to put there.

Key things to fill in:

- `profile.name`, `profile.title`, `profile.tagline`
- `social.email`, `social.linkedin`, `social.github`
- `experience[]` — one entry per role, most-recent-first
- `education[]` — all academic credentials
- `skills[]` — grouped by category
- `projects[]` — top projects from resume

Place assets in `/public/assets/`:

```
public/
└── assets/
    ├── karthik.jpg          ← profile photo
    └── karthik-resume.pdf   ← resume PDF for download
```

---

## 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:4321](http://localhost:4321). The dev server hot-reloads on any file save, including changes to `content.ts`.

---

## 6. Build for Production

```bash
npm run build
npm run preview   # preview the production build locally
```

The built site is in `./dist/`. Open `dist/index.html` to inspect the output.

---

## 7. Run Accessibility Checks

```bash
# After `npm run build`:
npx playwright test tests/a11y.test.ts
```

The accessibility test file (`tests/a11y.test.ts`) uses `@axe-core/playwright` to audit the built site against WCAG 2.1 AA. It must report zero violations before the site is published.

To run a Lighthouse audit locally:

```bash
npx lighthouse http://localhost:4321 --only-categories=accessibility --output=html --output-path=./lighthouse-report.html
open ./lighthouse-report.html
```

---

## 8. Deploy to GitHub Pages

Deployment is automatic. On every push to `main`:

1. GitHub Actions runs the `deploy.yml` workflow.
2. It installs dependencies, runs `npm run build`, and uploads `./dist`.
3. GitHub Pages serves the uploaded artifact over HTTPS.

**One-time repository setup** (do once in GitHub Settings):
- Go to **Settings → Pages → Source**
- Select **"GitHub Actions"** (not "Deploy from branch")

---

## 9. Update Content (AI Agent Workflow)

To update any content on the site (e.g., add a new job, add a project):

1. Open `src/content.ts` in the editor or ask an AI agent (e.g., GitHub Copilot) to edit it.
2. Read the JSDoc comments on each field to know what to change.
3. Edit only the `content` object literal — do not touch the interface definitions.
4. Commit and push to `main`. The site redeploys automatically within ~2 minutes.

**Example prompt for an AI agent**:
> "Read src/content.ts. Add a new project entry for [Project Name]: description is '[description]', tags are [tags], repoUrl is '[url]'. Keep all other content unchanged."

---

## Project Structure Reference

```
portfolia-website-karthik/
├── src/
│   ├── content.ts              ← ALL site content lives here
│   ├── layouts/
│   │   └── Layout.astro        ← Base HTML: <head>, nav, footer
│   ├── components/
│   │   ├── Hero.astro
│   │   ├── Nav.astro
│   │   ├── Skills.astro
│   │   ├── Experience.astro
│   │   ├── Projects.astro
│   │   └── Contact.astro
│   └── pages/
│       └── index.astro         ← Single page, assembles all components
├── public/
│   └── assets/
│       ├── karthik.jpg
│       └── karthik-resume.pdf
├── tests/
│   └── a11y.test.ts            ← axe-core/Playwright WCAG 2.1 AA audit
├── .github/
│   └── workflows/
│       └── deploy.yml          ← GitHub Actions: build + deploy to Pages
├── astro.config.mjs
├── tailwind.config.mjs         ← (if using v3; v4 is zero-config)
├── tsconfig.json
└── package.json
```

---

## Common Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| `satisfies` type error in `content.ts` | A required field is missing or has the wrong type | Read the TypeScript error — it points to the exact field. Check the JSDoc comment for the expected value. |
| Images not loading in production | Wrong `base` path in `astro.config.mjs` | If deploying to a sub-path (project page), set `base: '/repo-name'` and use Astro's `<Image>` component or `import.meta.env.BASE_URL`. |
| Accessibility test failures | Missing `alt` text, low contrast, or missing focus indicators | Run `npx playwright test` locally to get the specific axe-core violation and line number. |
| GitHub Pages showing old content | Workflow ran but Pages not set to "GitHub Actions" source | Go to Settings → Pages → Source → select "GitHub Actions". |
