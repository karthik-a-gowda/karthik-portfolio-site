---
description: "Implementation tasks for Personal Portfolio & Branding Website"
---

# Tasks: Personal Portfolio & Branding Website

**Feature**: `001-personal-portfolio-website`  
**Input**: Design documents from `specs/001-personal-portfolio-website/`  
**Date**: 2026-03-15  
**Prerequisites used**: plan.md ✅ · spec.md ✅ · research.md ✅ · data-model.md ✅ · contracts/ui-contract.md ✅ · quickstart.md ✅

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no unmet dependencies)
- **[US#]**: User story this task belongs to
- Exact file paths are included in every task description

---

## Phase 1: Setup

**Purpose**: Scaffold the Astro project, configure tooling, and establish the directory structure from plan.md. No user story work begins until this phase is complete.

- [x] T001 Scaffold Astro 5 project at repository root: `npm create astro@latest . -- --template minimal --typescript strict --no-git --install`
- [x] T002 Install Tailwind CSS v4 and Astro integration: `npm install tailwindcss @astrojs/tailwind`
- [x] T003 [P] Install accessibility tooling: `npm install -D eslint eslint-plugin-jsx-a11y @axe-core/playwright playwright` and run `npx playwright install chromium`
- [x] T004 [P] Configure `astro.config.mjs` — set `output: 'static'`, `site` URL placeholder, add `@astrojs/tailwind` integration
- [x] T005 [P] Configure `tsconfig.json` — ensure `"strict": true` and `"moduleResolution": "bundler"` are set
- [x] T006 Create directory structure per plan.md: `src/layouts/`, `src/components/`, `src/pages/`, `public/assets/`, `tests/`, `.github/workflows/`
- [x] T007 Add placeholder assets to `public/assets/`: `placeholder-profile.jpg` and `karthik-resume.pdf` (empty or sample PDF so build does not break)

**Checkpoint**: `npm run dev` starts without errors; `npm run build` produces `./dist/index.html`

---

## Phase 2: Foundational

**Purpose**: Create `src/content.ts` (the schema + placeholder data) and `src/layouts/Layout.astro` (the base HTML shell). Every user story component depends on both of these.

**⚠️ CRITICAL**: No user story phase can begin until this phase is complete.

- [x] T008 Create `src/content.ts` — define all 8 TypeScript interfaces (`Profile`, `SocialLinks`, `ExperienceEntry`, `EducationEntry`, `SkillCategory`, `Project`, `ResumeConfig`, `SiteMetadata`) and `SiteContent` root interface, each field annotated with JSDoc `@description`, `@example` as specified in `specs/001-personal-portfolio-website/data-model.md`
- [x] T009 Populate `src/content.ts` — export `content` object literal using `satisfies SiteContent`; fill all scalar fields with visible placeholder strings (e.g., `"Karthik A"`, `"Software Engineer"`); set arrays (`experience`, `education`, `skills`, `projects`) to empty `[]` for now
- [x] T010 Create `src/layouts/Layout.astro` — full HTML shell with `<head>` reading from `content.meta` (title, description, canonical URL, optional OG image), `<Nav />` slot, default `<slot />` for page body, and footer with copyright line
- [x] T011 Create `src/components/Nav.astro` — sticky navigation bar with anchor links: `#hero` (logo/name), `#skills`, `#experience`, `#projects`, `#contact`; keyboard-accessible; visible focus indicators; collapses to hamburger on mobile (375px)
- [x] T012 Create `src/pages/index.astro` — single page that imports `Layout` and all 5 section components in order; passes `content` prop to each; each section wrapped in `<section id="...">` matching Nav anchors

**Checkpoint**: `npm run build` succeeds; visiting `dist/index.html` shows the page structure with Nav; no TypeScript errors; all Nav links are rendered

---

## Phase 3: User Story 1 — First Impression & Professional Identity (Priority: P1) 🎯 MVP

**Goal**: A recruiter lands on the site and immediately sees Karthik's name, professional title/tagline, photo, and at least one CTA (Download Resume + Connect on LinkedIn) above the fold — on any screen size ≥ 375px.

**Independent Test**: Build and open `dist/index.html`. Without scrolling, verify: Karthik's name (h1), professional title, tagline paragraph, profile photo with alt text, "Download Resume" button, and "Connect on LinkedIn" button are all visible. Resize to 375px width — same content must be visible without horizontal scroll.

### Implementation for User Story 1

- [x] T013 [US1] Create `src/components/Hero.astro` — accepts `profile: Profile`, `social: SocialLinks`, `resume: ResumeConfig` props; renders: `<img>` with `src={profile.photo}` and `alt={profile.photoAlt}`, `<h1>{profile.name}</h1>`, subtitle `<p>{profile.title}</p>`, tagline `<p>{profile.tagline}</p>`, "Download Resume" `<a href={resume.path} download={resume.downloadName}>` button, "Connect on LinkedIn" `<a href={social.linkedin} target="_blank" rel="noopener noreferrer">` button
- [x] T014 [US1] Wire `Hero.astro` into `src/pages/index.astro` — import and render `<Hero profile={content.profile} social={content.social} resume={content.resume} />` inside `<section id="hero">`
- [x] T015 [US1] Apply Tailwind CSS responsive layout to `Hero.astro` — two-column (photo left, text right) on desktop; single column (photo top, text below) on mobile ≥ 375px; no horizontal overflow at any viewport
- [x] T016 [US1] Verify WCAG 2.1 AA for Hero — check: `alt` on `<img>` is present and descriptive; both CTA buttons are keyboard-focusable with visible focus ring; button contrast ≥ 4.5:1; run `eslint --ext .astro src/components/Hero.astro` with `eslint-plugin-jsx-a11y`
- [x] T017 [US1] Populate `content.profile`, `content.social`, `content.resume` in `src/content.ts` with real values from resume PDF: name, title, tagline, email, LinkedIn URL, GitHub URL, resume PDF path

**Checkpoint**: User Story 1 independently testable — homepage hero section renders with real content, both CTAs functional, mobile-responsive, no a11y lint errors

---

## Phase 4: User Story 2 — Skills & Professional Experience (Priority: P2)

**Goal**: A recruiter can scroll to the Skills and Experience sections and see Karthik's categorised skills, full work history (company, title, dates, highlights), and education credentials. "Download Resume" is accessible from this section.

**Independent Test**: Navigate to `#skills` — verify skill categories render as headings with labelled skill pills. Navigate to `#experience` — verify each role shows company, title, date range, and bullet highlights in reverse-chronological order. Verify education entries appear beneath experience.

### Implementation for User Story 2

- [x] T018 [P] [US2] Create `src/components/Skills.astro` — accepts `skills: SkillCategory[]` prop; renders a grid of category cards, each with a `<h3>{category}</h3>` heading and a row of `<span>` pill elements for each skill label
- [x] T019 [P] [US2] Create `src/components/Experience.astro` — accepts `experience: ExperienceEntry[]` and `education: EducationEntry[]` props; renders a vertical timeline of experience cards (company, title, `startDate–endDate`, optional location, `<ul>` of highlights), most-recent-first; renders education entries as compact cards beneath the timeline
- [x] T020 [US2] Wire both components into `src/pages/index.astro` — `<Skills skills={content.skills} />` inside `<section id="skills">`, `<Experience experience={content.experience} education={content.education} />` inside `<section id="experience">`
- [x] T021 [US2] Apply Tailwind CSS responsive layout to `Skills.astro` — 2-column grid on tablet, 3-column on desktop, 1-column on mobile
- [x] T022 [US2] Apply Tailwind CSS responsive layout to `Experience.astro` — single column timeline with left border accent; compact education cards in a 2-column grid on desktop
- [x] T023 [US2] Populate `content.experience`, `content.education`, and `content.skills` in `src/content.ts` with real values from resume PDF — every past role, all degrees, all skill categories and individual skills
- [x] T024 [US2] Verify WCAG 2.1 AA for Skills and Experience — semantic headings hierarchy (`h2` section, `h3` category/company); list elements for skill pills and highlights; contrast ≥ 4.5:1; run `eslint-plugin-jsx-a11y` on both components

**Checkpoint**: User Story 2 independently testable — Skills and Experience sections render with real resume content, correct order, responsive layout, no a11y errors

---

## Phase 5: User Story 3 — Work & Project Showcase (Priority: P3)

**Goal**: A potential client or technical collaborator sees Karthik's top projects as scannable cards in a grid. Each card shows title, description, technology tags, and optional live/repo links that open in a new tab.

**Independent Test**: Navigate to `#projects` — verify at least one project card is visible with title, description, at least one technology tag, and at least one link (live demo or repo). Click a link — it opens in a new tab. Resize to 375px — cards remain readable with no overflow.

### Implementation for User Story 3

- [x] T025 [US3] Create `src/components/Projects.astro` — accepts `projects: Project[]` prop; renders a responsive card grid; each card shows: `<h3>{title}</h3>`, `<p>{description}</p>`, technology tag pills, conditionally rendered "Live Demo" `<a href={liveUrl} target="_blank" rel="noopener noreferrer">` and "View Code" `<a href={repoUrl} target="_blank" rel="noopener noreferrer">` buttons; featured projects get a visual highlight (border or badge)
- [x] T026 [US3] Wire `Projects.astro` into `src/pages/index.astro` — `<Projects projects={content.projects} />` inside `<section id="projects">`
- [x] T027 [US3] Apply Tailwind CSS responsive layout to `Projects.astro` — 1-column on mobile, 2-column on tablet, 3-column on desktop; card height consistent within each row
- [x] T028 [US3] Populate `content.projects` in `src/content.ts` with real projects from resume PDF — title, description, tags, and any available `liveUrl`/`repoUrl`; mark top 2-3 as `featured: true`
- [x] T029 [US3] Verify WCAG 2.1 AA for Projects — all external links have `target="_blank"` with `rel="noopener noreferrer"` and visually distinguishable text (not just colour); keyboard-focusable cards; visible focus indicators; contrast ≥ 4.5:1; run `eslint-plugin-jsx-a11y`

**Checkpoint**: User Story 3 independently testable — Projects section renders with real project data, external links open in new tab, responsive grid, no a11y errors

---

## Phase 6: User Story 4 — Contact & Outreach (Priority: P4)

**Goal**: A recruiter can reach the Contact section with one click from anywhere on the page and immediately see Karthik's email address, LinkedIn link, and GitHub link as clear, clickable elements.

**Independent Test**: From any scroll position, click "Contact" in the Nav — verify smooth scroll to `#contact`. Verify 3 elements are visible: email `mailto:` link, LinkedIn URL link, GitHub URL link. Click the email link — default mail client opens with the address pre-filled.

### Implementation for User Story 4

- [x] T030 [US4] Create `src/components/Contact.astro` — accepts `social: SocialLinks` prop; renders a centred contact card with: email as `<a href={mailto:social.email}>{social.email}</a>`, LinkedIn as `<a href={social.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>`, GitHub as `<a href={social.github} target="_blank" rel="noopener noreferrer">GitHub</a>`; clear visual hierarchy with intro heading and short invite text
- [x] T031 [US4] Wire `Contact.astro` into `src/pages/index.astro` — `<Contact social={content.social} />` inside `<section id="contact">`
- [x] T032 [US4] Apply Tailwind CSS layout to `Contact.astro` — centred single-column layout, large readable link buttons, sufficient padding on mobile
- [x] T033 [US4] Verify social links in `content.social` are final production values (not placeholders) — email, LinkedIn URL, GitHub URL must match actual accounts
- [x] T034 [US4] Verify WCAG 2.1 AA for Contact — all links keyboard-accessible with visible focus indicators; links have descriptive text (not just "click here"); contrast ≥ 4.5:1; `mailto:` link opens correctly

**Checkpoint**: User Story 4 independently testable — Contact section renders and all 3 links are functional; Nav "Contact" anchor works from any scroll position

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Full-site integration checks, accessibility audit, SEO, performance, and deployment setup.

- [x] T035 [P] Create `tests/a11y.test.ts` — Playwright + `@axe-core/playwright` test that: starts a local `preview` server, navigates to `http://localhost:4321`, runs `checkA11y` with WCAG 2.1 AA rule set, asserts zero violations; test must pass before any deploy
- [x] T036 [P] Create `.github/workflows/deploy.yml` — two-job GitHub Actions workflow: `build` job (`actions/checkout@v4` → `actions/setup-node@v4` (Node 20 LTS) → `npm ci` → `npm run build` → `actions/upload-pages-artifact@v3` targeting `./dist`); `deploy` job (`actions/deploy-pages@v4`, needs: build, permissions: pages: write, id-token: write)
- [ ] T037 Update `astro.config.mjs` — set final `site` value to the real GitHub Pages URL (e.g., `https://<username>.github.io` or `https://<username>.github.io/portfolia-website-karthik`) and set `base` if deploying to a sub-path
- [ ] T038 Update `content.meta` in `src/content.ts` — set real `siteTitle`, `description` (≤ 160 chars), and `siteUrl` matching the final GitHub Pages URL
- [ ] T039 Add `public/assets/og-image.png` (1200×630px) — used as Open Graph preview when the site link is shared on LinkedIn; update `content.meta.ogImage` to `/assets/og-image.png`
- [ ] T040 Replace placeholder profile photo — add real `karthik.jpg` to `public/assets/`; verify `content.profile.photo` and `content.profile.photoAlt` are set correctly
- [x] T041 [P] Run full accessibility audit locally: `npm run build && npm run preview` in one terminal, then `npx playwright test tests/a11y.test.ts` — fix any WCAG 2.1 AA violations before proceeding
- [ ] T042 [P] Run Lighthouse locally against `http://localhost:4321` — verify Performance ≥ 90 and Accessibility = 1.0; fix any regressions
- [ ] T043 Final content review against resume PDF — verify SC-005: all text on the published site is traceable to the source PDF, no placeholder text remains (search for "Placeholder", "example.com", "TODO" in `src/content.ts`)
- [ ] T044 Follow `specs/001-personal-portfolio-website/quickstart.md` step 8 — set GitHub Pages source to "GitHub Actions" in repository Settings → Pages; push to `main`; verify the Actions workflow runs successfully
- [ ] T045 Verify live site at GitHub Pages URL — all 5 sections render, all links work, resume PDF downloads, site is served over HTTPS, Lighthouse accessibility score = 1.0

**Checkpoint**: All success criteria (SC-001 through SC-008) met; site is live on GitHub Pages

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Requires Phase 1 complete — blocks all user story phases
- **User Story Phases (3–6)**: All require Phase 2 complete; can proceed in P1→P2→P3→P4 order (or in parallel if multiple contributors)
- **Polish (Phase 7)**: Requires all user story phases complete

### User Story Dependencies

- **US1 (P1)**: Can start after Phase 2 — no dependency on US2/US3/US4
- **US2 (P2)**: Can start after Phase 2 — no dependency on US1/US3/US4
- **US3 (P3)**: Can start after Phase 2 — no dependency on US1/US2/US4
- **US4 (P4)**: Can start after Phase 2 — no dependency on US1/US2/US3

All 4 user stories share `content.ts` (read-only) and `index.astro` (write); if working sequentially, implement in order P1→P2→P3→P4. If parallel, claim separate component files and integrate into `index.astro` at the end of each story.

### Parallel Opportunities Per Phase

**Phase 1**: T003, T004, T005 can run in parallel after T001/T002  
**Phase 2**: T008/T009 (content.ts) is independent of T010/T011 (Layout/Nav); complete both before T012  
**Phase 4 (US2)**: T018 Skills and T019 Experience components are fully parallel (different files)  
**Phase 7**: T035 (a11y test), T036 (deploy.yml), T041 (audit), T042 (Lighthouse) can all run in parallel

---

## Parallel Execution Examples

### Phase 1 — Setup (after T001, T002 complete)
```
T003 (a11y deps) ─────────────────┐
T004 (astro.config.mjs) ──────────┤── all complete ──► T006 dirs ──► T007 assets
T005 (tsconfig.json) ─────────────┘
```

### Phase 2 — Foundational
```
T008+T009 (content.ts schema + placeholder data) ─┐
                                                   ├── both complete ──► T012 (index.astro)
T010+T011 (Layout.astro + Nav.astro) ─────────────┘
```

### Phase 4 — US2 (after Phase 2 complete)
```
T018 (Skills.astro) ──────────────┐
T019 (Experience.astro) ──────────┤── both complete ──► T020 (wire) ──► T021/T022 ──► T023 content ──► T024 a11y
```

### Phase 7 — Polish (after all user stories complete)
```
T035 (a11y test file) ────────────┐
T036 (deploy.yml) ────────────────┤
T039 (OG image) ──────────────────┤── all complete ──► T043 content review ──► T044 deploy ──► T045 verify
T041 (a11y audit) ────────────────┤
T042 (Lighthouse) ────────────────┘
```

---

## Implementation Strategy

**MVP scope (Phase 1 + Phase 2 + Phase 3 / US1 only)**:  
Phases 1–3 deliver a fully functional "online business card" — hero with name, title, tagline, photo, and two CTAs. This is independently deployable and satisfies SC-001, SC-003, SC-004, SC-006 immediately.

**Incremental delivery order**:
1. Phases 1+2: Scaffold + schema → site builds, nav renders
2. Phase 3 (US1): Hero → MVP live on GitHub Pages
3. Phase 4 (US2): Skills + Experience → recruiter value complete
4. Phase 5 (US3): Projects → proof-of-work complete
5. Phase 6 (US4): Contact → conversion path complete
6. Phase 7: Polish + deploy → all 8 success criteria met

**Total task count**: 45 tasks  
**Tasks per user story**: US1 = 5 · US2 = 7 · US3 = 5 · US4 = 5  
**Setup + Foundational**: 12 tasks  
**Polish**: 11 tasks
