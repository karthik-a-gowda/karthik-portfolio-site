# Architecture Research: Personal Portfolio & Branding Website

**Feature**: `001-personal-portfolio-website`
**Phase**: 0 — Pre-implementation research
**Date**: 2026-03-15
**Purpose**: Inform framework, tooling, and pattern decisions before implementation planning

---

## Decision 1 — Frontend Framework

**Decision: Astro (static output mode)**

**Rationale**:
Astro is purpose-built for content-focused static sites and ships **zero JavaScript by default** — only the JS you explicitly opt into is sent to the browser. This directly satisfies SC-003 (sub-3s load time) and FR-015 (accessibility, since less JS means fewer hydration-related a11y pitfalls). Astro imports TypeScript files natively without any adapter, so `content.ts` is a first-class citizen: you can `import { content } from '../content.ts'` directly inside `.astro` components. Its `output: 'static'` mode + official `@astrojs/github-pages` adapter produces a `dist/` folder ready for GitHub Pages with a single config line. Single-page anchor navigation is handled simply by writing one `index.astro` page with section IDs — there is no routing framework to fight.

**Evaluation against all criteria**:

| Criterion | Astro | Next.js (export) | Vite + React |
|---|---|---|---|
| Static GitHub Pages deploy | ✅ Official adapter, zero config | ⚠️ Requires `basePath` + `assetPrefix` hacks | ✅ Straightforward |
| Import `content.ts` | ✅ Native TS support in `.astro` | ✅ Works | ✅ Works |
| Zero/minimal JS by default | ✅ Islands: zero JS unless you add it | ❌ Ships full React runtime | ❌ Ships full React runtime |
| WCAG 2.1 AA tooling | ✅ Works with axe, eslint-plugin-jsx-a11y via React islands | ✅ eslint-plugin-jsx-a11y native | ⚠️ eslint-plugin-jsx-a11y native |
| Single-page anchor nav | ✅ One `index.astro`, section IDs | ⚠️ Fights file-based `app/` router | ✅ Natural SPA |

**Alternatives considered**:

- **Next.js (static export)**: Ships the full React runtime (~140 kB) even for a page with no interactivity. `output: 'export'` for GitHub Pages requires careful `basePath`/`assetPrefix` configuration and still fights against the framework's multi-page routing model for a single-page site. Rejected: over-engineered and heavier than needed.
- **Vite + React**: Excellent DX and simple GitHub Pages deploy, but React renders everything client-side — the browser must download and execute JS before seeing content, hurting performance and a11y load metrics. No hybrid partial-hydration model. Rejected: unnecessary JS weight for what is essentially a document.

---

## Decision 2 — CSS Approach

**Decision: Tailwind CSS v4**

**Rationale**:
Tailwind v4 (current as of 2025/2026) is a CSS-first, zero-config rewrite — no `tailwind.config.js` is needed; you just import it as a CSS file (`@import "tailwindcss"`). Its utility-class model makes responsive design and dark mode **colocated with markup**, which is the most AI-agent-friendly pattern: an agent editing a component can read `class="text-gray-900 dark:text-white md:text-xl"` and understand the intent without cross-referencing a separate stylesheet. Astro has first-class Tailwind v4 integration via `@astrojs/tailwind`. The production bundle contains only the classes actually used, keeping CSS payload minimal.

**Evaluation against all criteria**:

| Criterion | Tailwind v4 | CSS Modules | Plain CSS |
|---|---|---|---|
| Responsive design | ✅ `sm:` `md:` `lg:` prefixes inline | ⚠️ Media queries in `.module.css` files | ⚠️ Media queries in `.css` files |
| Dark mode | ✅ `dark:` variant, CSS layer-based | ✅ Possible with `:root[data-theme]` | ✅ Possible with custom properties |
| AI-agent update friendliness | ✅ Classes are self-documenting inline | ⚠️ Must cross-reference module file | ⚠️ Must cross-reference stylesheet |
| Bundle size | ✅ Only used utilities shipped | ✅ Per-module, tree-shaken | ✅ All rules shipped (no tree-shaking) |
| Astro integration | ✅ Official `@astrojs/tailwind` pkg | ✅ Built into Astro natively | ✅ Built into Astro natively |
| v4 config overhead | ✅ Zero config files | ✅ Zero config files | ✅ Zero config files |

**Alternatives considered**:

- **CSS Modules**: Excellent style isolation, but styles are separated from markup, requiring an AI agent to navigate between two files to understand and modify a component's appearance. Naming is arbitrary (`.heroTitle`, `.skillCard`), providing no self-documenting signal about what the style does. Rejected: poor AI-agent ergonomics.
- **Plain CSS**: Simple, but global scope creates naming collision risk as the stylesheet grows. Responsive breakpoints must be written repeatedly across the file. No systematic dark mode story without significant custom property discipline. Rejected: doesn't scale well and offers no advantage over Tailwind for this use case.

---

## Decision 3 — Accessibility Testing Tools

**Decision: axe-core (Playwright integration) + eslint-plugin-jsx-a11y + Lighthouse CI**

A layered strategy is required to cover WCAG 2.1 AA at different points in the development workflow:

### Layer 1 — Static Analysis (catch at code-write time)

**Tool**: `eslint-plugin-jsx-a11y`
- **What it checks**: Missing `alt` on images, non-interactive elements with click handlers, missing `aria-*` labels, unlabeled form elements, keyboard-unreachable controls.
- **Integration**: Install as a dev dependency; add to `.eslintrc` or `eslint.config.mjs`. Runs on every save in VS Code and in CI on `npm run lint`.
- **Applies to**: All `.tsx`/`.jsx` files (React islands inside Astro components).
- **Install**: `npm i -D eslint-plugin-jsx-a11y`
- **Limitation**: Does not check plain `.astro` files (HTML syntax). Use `astro check` for those.

### Layer 2 — Automated DOM Audit (catch at build-and-serve time)

**Tool**: `@axe-core/playwright`
- **What it checks**: Full WCAG 2.1 AA ruleset against the rendered DOM — contrast ratios, ARIA roles, landmark regions, focus order, skip-link presence.
- **Integration**: Write a Playwright test (`tests/a11y.spec.ts`) that opens the built site and calls `checkA11y(page)`. Run via `npx playwright test` in CI.
- **Install**: `npm i -D @playwright/test axe-playwright`
- **Example**:
  ```ts
  import { test, expect } from '@playwright/test';
  import AxeBuilder from '@axe-core/playwright';

  test('homepage has no WCAG AA violations', async ({ page }) => {
    await page.goto('/');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });
  ```

### Layer 3 — CI Performance + Accessibility Score

**Tool**: Lighthouse CI (`treosh/lighthouse-ci-action`)
- **What it checks**: Lighthouse accessibility score (targets 100), performance metrics (LCP, FID, CLS), SEO basics.
- **Integration**: GitHub Actions step runs after deploy or against a preview URL. Fails the workflow if accessibility score drops below threshold.
- **Config** (`lighthouserc.json`):
  ```json
  {
    "ci": {
      "assert": {
        "assertions": {
          "categories:accessibility": ["error", { "minScore": 1.0 }],
          "categories:performance": ["warn", { "minScore": 0.9 }]
        }
      }
    }
  }
  ```

### Layer 4 — Manual / Exploratory (periodic)

- **WAVE browser extension** (WebAIM): Visual overlay showing errors, contrast issues, landmark regions; useful during active development.
- **axe DevTools** browser extension: In-browser axe-core runner with guided remediation.
- **Keyboard-only walkthrough**: Tab through every interactive element manually to verify focus order and visible focus indicators (FR-015 requirement).

**Summary table**:

| Tool | Phase | What it catches | Integration effort |
|---|---|---|---|
| `eslint-plugin-jsx-a11y` | Code-write | Missing alt, ARIA labels, keyboard handlers | Low — add to ESLint config |
| `@axe-core/playwright` | Post-build test | Full WCAG 2.1 AA DOM audit | Medium — one test file |
| Lighthouse CI | CI/CD | Score regression, perf + a11y | Low — one Actions step |
| WAVE extension | Development | Visual contrast, structure | None — browser extension |

---

## Decision 4 — GitHub Pages + GitHub Actions Deployment

**Decision: `withastro/action@v3` with `actions/deploy-pages@v4` using built-in Pages workflow**

### Astro Config (`astro.config.mjs`)

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  // Required: tells Astro the deployment URL for sitemap, canonical tags
  site: 'https://<username>.github.io',
  // Required IF deploying to a project page (not a user/org page):
  // base: '/<repo-name>',
  output: 'static',          // default; explicit for clarity
  // No adapter needed for static output — Astro's default handles it
});
```

**Rules**:
- If deploying to `https://<username>.github.io` (user/org page, repo named `<username>.github.io`): omit `base`.
- If deploying to `https://<username>.github.io/portfolio` (project page): set `base: '/portfolio'`.

### GitHub Actions Workflow (`.github/workflows/deploy.yml`)

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist           # Astro's default output directory

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

### Repository Setup (one-time)

1. **Settings → Pages → Source**: Set to **"GitHub Actions"** (not the legacy "Deploy from branch" option).
2. No secrets needed — the `GITHUB_TOKEN` provided automatically has `pages:write` when the workflow runs.

### Key Action Versions (2025/2026)

| Action | Version | Purpose |
|---|---|---|
| `actions/checkout` | v4 | Clone repository |
| `actions/setup-node` | v4 | Install Node.js 22 LTS |
| `actions/upload-pages-artifact` | v3 | Package `dist/` for Pages |
| `actions/deploy-pages` | v4 | Publish to GitHub Pages |

**Why not `withastro/action`**: The official Astro action wraps the above in one step, which is convenient but less transparent and harder to customize (e.g., adding Lighthouse CI between build and deploy). The explicit multi-step pattern above is recommended for maintainability and composability.

---

## Decision 5 — `content.ts` Schema Pattern

**Decision: TypeScript `interface` + `satisfies` operator + exported `const`**

**Rationale**:
This pattern provides compile-time type safety, IDE autocomplete, and — critically — a self-documenting schema that an AI agent can read and understand without any other context. The `interface` defines the schema with JSDoc on every property; the `satisfies` operator (TypeScript 4.9+, default in all modern setups) validates the object against the interface while preserving the literal types of values (preventing widening from `"TypeScript"` to `string`). No runtime library (like Zod) is needed for a pure static site where there is no API boundary to validate.

**Recommended Structure**:

```ts
// content.ts

/**
 * Root schema for all portfolio site content.
 * An AI agent editing this file should update values inside `export const content`.
 * Do not change field names or structure — those are defined by the interfaces below.
 */

// ─── Interfaces (schema documentation) ───────────────────────────────────────

interface Profile {
  /** Full display name shown in the hero section. Example: "Karthik Annamalai" */
  name: string;
  /** Professional title shown below the name. Example: "Senior Software Engineer" */
  title: string;
  /** One-sentence value proposition shown in the hero tagline. */
  tagline: string;
  /** URL to the profile photo or avatar image (relative path or absolute URL). */
  avatarUrl: string;
  /** Email address used in the contact section and mailto: links. */
  email: string;
  /** Full LinkedIn profile URL. Example: "https://linkedin.com/in/karthik-a" */
  linkedInUrl: string;
  /** Full GitHub profile URL. Example: "https://github.com/karthik-a" */
  gitHubUrl: string;
  /** Path to the downloadable resume PDF. Example: "/resume.pdf" */
  resumePdfPath: string;
}

interface ExperienceEntry {
  /** Company or organisation name. Example: "Acme Corp" */
  company: string;
  /** Job title held. Example: "Staff Engineer" */
  title: string;
  /** Employment start date in "Mon YYYY" format. Example: "Jan 2022" */
  startDate: string;
  /** Employment end date or "Present". Example: "Present" */
  endDate: string;
  /** 2-4 bullet points describing key responsibilities or achievements. */
  description: string[];
}

interface EducationEntry {
  /** Name of the institution. Example: "University of Madras" */
  institution: string;
  /** Degree awarded. Example: "B.E. Computer Science" */
  degree: string;
  /** Four-digit graduation year. Example: "2018" */
  graduationYear: string;
}

interface SkillGroup {
  /** Category label shown as a heading. Example: "Frontend" */
  category: string;
  /** List of skills within this category. Example: ["React", "TypeScript", "CSS"] */
  skills: string[];
}

interface Project {
  /** Project display name. Example: "Portfolio Website" */
  name: string;
  /** One to three sentence description of what the project does. */
  description: string;
  /** Technologies or domains used. Example: ["Astro", "TypeScript", "Tailwind CSS"] */
  tags: string[];
  /** Optional: URL of the deployed live site. Leave undefined if not deployed. */
  liveUrl?: string;
  /** Optional: URL of the source code repository. Leave undefined if private. */
  repoUrl?: string;
}

export interface SiteContent {
  profile: Profile;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: SkillGroup[];
  projects: Project[];
}

// ─── Content (edit values here) ──────────────────────────────────────────────

export const content = {
  profile: {
    name: "Karthik Annamalai",
    title: "...",
    // ... remaining fields
  },
  experience: [/* ... */],
  education: [/* ... */],
  skills: [/* ... */],
  projects: [/* ... */],
} satisfies SiteContent;
```

**Why `satisfies` instead of `: SiteContent`**:
- `const content: SiteContent = { ... }` — TypeScript widens literal types; `content.profile.name` has type `string`, losing the actual value.
- `const content = { ... } satisfies SiteContent` — TypeScript validates the shape but keeps literal types. Autocomplete works; errors are caught; `content.profile.name` type is `"Karthik Annamalai"` (useful for type-level tests).

**Alternatives considered**:

- **Zod schema**: Provides runtime validation + TypeScript types via `z.infer<typeof schema>`. Valuable when content arrives from an external source (API, CMS, user input). For a static file edited by a trusted agent, runtime validation adds a dependency and complexity with no safety benefit — the TypeScript compiler already validates the shape at build time. Rejected: unnecessary dependency for this use case.
- **Plain object with no interface**: No schema documentation, no IDE autocomplete, no type errors when a field is misspelled or the wrong type is used. An AI agent has no structured contract to reference. Rejected: violates FR-013 (self-documenting schema requirement).
- **Separate `schema.ts` + `content.ts`**: Splitting the interface and data into two files is an option but requires the AI agent to read both files to understand context. Collocating interfaces and data in one file (interfaces at top, data at bottom) keeps the contract and the values together. Rejected: unnecessary file split for a small content file.

---

## Summary of Decisions

| # | Question | Decision |
|---|---|---|
| 1 | Frontend framework | **Astro** (static output) |
| 2 | CSS approach | **Tailwind CSS v4** |
| 3 | Accessibility testing | **axe-core/Playwright + eslint-plugin-jsx-a11y + Lighthouse CI** |
| 4 | GitHub Pages deployment | **GitHub Actions: `upload-pages-artifact` + `deploy-pages`** |
| 5 | `content.ts` pattern | **TypeScript interfaces + `satisfies` + exported `const`** |

**Technology stack summary**:
```
Astro 5.x          → framework + build
Tailwind CSS v4    → styling
TypeScript 5.x     → language
Playwright + axe   → a11y testing
Lighthouse CI      → CI quality gate
GitHub Actions     → CI/CD
GitHub Pages       → hosting
```
