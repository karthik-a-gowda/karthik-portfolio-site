# portfolia-website-karthik Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-03-15

## Active Technologies
- **Language**: TypeScript 5.x (strict mode)
- **Framework**: Astro 5.x, Tailwind CSS v4, `@astrojs/tailwind`
- **Testing**: `@axe-core/playwright`, Playwright, `eslint-plugin-jsx-a11y`, Lighthouse CI
- **Storage**: Static files only — `src/content.ts` (all site content) + `/public/assets/` (photo, resume PDF). No database.
- **Deployment**: GitHub Pages via GitHub Actions (`upload-pages-artifact@v3` + `deploy-pages@v4`)

## Project Structure

```text
src/
  content.ts          ← ALL site content lives here (single source of truth)
  layouts/
    Layout.astro
  components/
    Nav.astro
    Hero.astro
    Skills.astro
    Experience.astro
    Projects.astro
    Contact.astro
  pages/
    index.astro       ← Single page, assembles all components
public/
  assets/             ← karthik.jpg, karthik-resume.pdf
tests/
  a11y.test.ts        ← WCAG 2.1 AA audit (axe-core/Playwright)
.github/
  workflows/
    deploy.yml        ← Build + deploy to GitHub Pages on push to main
```

## Commands

```bash
npm run dev       # local dev server (http://localhost:4321)
npm run build     # production build → ./dist/
npm run preview   # preview production build locally
npx playwright test tests/a11y.test.ts  # accessibility audit
```

## Code Style

- TypeScript strict mode (`"strict": true` in tsconfig.json)
- Tailwind CSS v4 utility classes for all styling (no separate stylesheet files)
- Astro components (`.astro`) for all UI — no React/Vue/Svelte needed
- JSDoc comments on every field in `content.ts` interfaces

## Content Update Rule

**To update site content**: edit ONLY `src/content.ts` — the `content` object literal.  
Do NOT edit any `.astro` component or style file for content changes.  
The JSDoc comment on each field describes what value to put there.

## Accessibility Requirements

All components MUST meet WCAG 2.1 Level AA:
- All `<img>` elements must have descriptive `alt` text
- All interactive elements must be keyboard-accessible
- Color contrast must be ≥ 4.5:1 for body text
- All focusable elements must have visible focus indicators

## Recent Changes
- 2026-03-15 (001-personal-portfolio-website): Initial plan — Astro 5 + Tailwind CSS v4 + TypeScript 5, GitHub Pages deploy, WCAG 2.1 AA

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->

