# Implementation Plan: Personal Portfolio & Branding Website

**Branch**: `001-personal-portfolio-website` | **Date**: 2026-03-15 | **Spec**: [spec.md](spec.md)  
**Input**: Feature specification from `/specs/001-personal-portfolio-website/spec.md`

## Summary

Build a static, single-page personal branding website for Karthik using **Astro 5 + Tailwind CSS v4 + TypeScript**. All site content (profile, experience, education, skills, projects, contact links) lives in a single `src/content.ts` file with TypeScript types and JSDoc schema comments, enabling AI-agent-driven content updates without touching any layout or style code. The site deploys to **GitHub Pages** via GitHub Actions on every push to `main` and meets **WCAG 2.1 Level AA** accessibility standards.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)  
**Primary Dependencies**: Astro 5.x, Tailwind CSS v4, `@astrojs/tailwind`, `@axe-core/playwright`, Playwright  
**Storage**: Static files only — `src/content.ts` (content), `/public/assets/` (photo, resume PDF). No database.  
**Testing**: Playwright + `@axe-core/playwright` (WCAG 2.1 AA audit); Lighthouse CI (CI accessibility gate); `eslint-plugin-jsx-a11y` (static analysis)  
**Target Platform**: Static site — GitHub Pages (HTTPS, CDN-served). Browsers: modern evergreen (Chrome, Firefox, Safari, Edge). Mobile: 375px minimum viewport.  
**Project Type**: Static web site (personal portfolio / personal branding)  
**Performance Goals**: Primary content visible in < 3 s on standard broadband (SC-003); Lighthouse Performance score ≥ 90  
**Constraints**: Zero runtime backend; no API calls at build or run time; no contact form; single-page with anchor navigation; content editable exclusively via `src/content.ts`  
**Scale/Scope**: Single developer (Karthik); 6 sections; ~8 TypeScript interfaces; 1 GitHub Actions workflow; ~10 Astro components

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Status**: ✅ PASS (Pre-design and Post-design)  
**Basis**: The project constitution (`/.specify/memory/constitution.md`) has not yet been customised — it contains only the default placeholder template with no project-specific principles, gates, or constraints. No violations are possible against an empty ruleset. This check should be repeated once the constitution is populated.

## Project Structure

### Documentation (this feature)

```text
specs/001-personal-portfolio-website/
├── plan.md              ← This file
├── research.md          ← Phase 0: framework, CSS, testing, deploy, schema decisions
├── data-model.md        ← Phase 1: SiteContent TypeScript schema (canonical reference)
├── quickstart.md        ← Phase 1: setup, local dev, deploy, AI-agent update guide
├── contracts/
│   └── ui-contract.md   ← Phase 1: content.ts ↔ component binding contract
└── tasks.md             ← Phase 2 output (created by /speckit.tasks — NOT yet created)
```

### Source Code (repository root)

```text
portfolia-website-karthik/
├── src/
│   ├── content.ts              ← Single source of truth for all site content
│   ├── layouts/
│   │   └── Layout.astro        ← Base HTML shell: <head> meta, Nav, footer
│   ├── components/
│   │   ├── Nav.astro           ← Sticky nav with anchor links to all sections
│   │   ├── Hero.astro          ← Name, title, tagline, photo, CTAs
│   │   ├── Skills.astro        ← Skill category cards with pill labels
│   │   ├── Experience.astro    ← Work history timeline + Education sub-section
│   │   ├── Projects.astro      ← Project cards grid with tags and links
│   │   └── Contact.astro       ← Email + LinkedIn + GitHub links
│   └── pages/
│       └── index.astro         ← Single page: assembles all section components
├── public/
│   └── assets/
│       ├── karthik.jpg         ← Profile photo (provided by Karthik)
│       └── karthik-resume.pdf  ← Resume PDF (provided by Karthik)
├── tests/
│   └── a11y.test.ts            ← axe-core/Playwright WCAG 2.1 AA audit
├── .github/
│   └── workflows/
│       └── deploy.yml          ← Build + deploy to GitHub Pages on push to main
├── astro.config.mjs            ← site URL, output: static, Tailwind integration
├── tsconfig.json               ← strict: true
└── package.json
```

**Structure Decision**: Single-project Astro static site. No monorepo, no backend, no separate frontend/backend split. All content flows from one TypeScript file through Astro components to static HTML at build time.

## Phase 0: Research Summary

All unknowns resolved. See [research.md](research.md) for full rationale.

| Decision | Choice | Key Reason |
|---|---|---|
| Frontend Framework | **Astro 5 (static output)** | Zero-JS by default; native TS imports; single `index.astro` for SPA-style anchor nav; GitHub Pages ready |
| CSS Approach | **Tailwind CSS v4** | Zero-config; inline responsive + dark-mode classes; most AI-agent-friendly (no separate stylesheet lookup) |
| Accessibility Testing | **axe-core/Playwright + Lighthouse CI + eslint-plugin-jsx-a11y** | Three-layer coverage: static lint → DOM audit → CI gate |
| GitHub Pages Deploy | **`upload-pages-artifact@v3` + `deploy-pages@v4`** | Official GitHub Actions pattern; two-job workflow (build → deploy) |
| `content.ts` Pattern | **TypeScript interfaces + `satisfies` + exported `const`** | Type safety without widening; JSDoc as inline schema docs; no Zod overhead |

## Phase 1: Design Artifacts

| Artifact | File | Status |
|---|---|---|
| TypeScript schema (canonical) | [data-model.md](data-model.md) | ✅ Complete |
| UI data-binding contract | [contracts/ui-contract.md](contracts/ui-contract.md) | ✅ Complete |
| Developer quickstart | [quickstart.md](quickstart.md) | ✅ Complete |

### Key Design Decisions

**1. `content.ts` is the AI-agent update surface**  
All 8 TypeScript interfaces (`Profile`, `SocialLinks`, `ExperienceEntry`, `EducationEntry`, `SkillCategory`, `Project`, `ResumeConfig`, `SiteMetadata`) have JSDoc on every field. An AI agent opens `content.ts`, reads the comments, edits the `content` object literal, and commits. No other file needs to change for content updates.

**2. Single-file, no CMS**  
No headless CMS, no database, no API. The `satisfies SiteContent` constraint catches any structural errors at compile time before they reach production.

**3. Accessibility baked in from the start**  
`eslint-plugin-jsx-a11y` catches missing `alt` text and ARIA at code-time. `@axe-core/playwright` runs a full WCAG 2.1 AA DOM audit in CI. The Lighthouse CI action gates the `main` branch at `accessibility: 1.0`.

**4. No GitHub API integration**  
Project repository links are plain `string` fields in `content.ts`. No OAuth token, no build-time fetch, no rate limit risk.

## Constitution Check (Post-Design)

**Status**: ✅ PASS  
Same basis as pre-design check — constitution not yet populated. No violations introduced by design.

## Complexity Tracking

No constitution violations to justify. The design deliberately avoids all unnecessary complexity:
- No backend (static only)
- No CMS (single `content.ts`)
- No routing (single-page)
- No external API calls
- No authentication
