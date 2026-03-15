# UI Contract: `content.ts` ↔ Astro Components

**Feature**: `001-personal-portfolio-website`  
**Contract type**: Static data-to-UI binding contract  
**Phase**: 1 — Design  
**Date**: 2026-03-15

---

## Purpose

This is a purely static site with no external API or backend. The "external interface" that must be documented is the contract between **`src/content.ts`** (the data file) and the **Astro components** that consume it. This contract defines exactly which fields each component reads, what shape it expects, and what happens when a field is missing or malformed.

This is the file an AI agent or human developer MUST consult when:
- Adding a new section to the site (what fields to add to `content.ts` and `SiteContent`)
- Modifying a component (what fields it already depends on)
- Updating content (which fields to edit; see [data-model.md](../data-model.md))

---

## Contract: Hero Component (`Hero.astro`)

**Reads from**: `content.profile`, `content.social`, `content.resume`

| Field path | Type | Usage | Required |
|---|---|---|---|
| `content.profile.name` | `string` | `<h1>` headline | Yes |
| `content.profile.title` | `string` | Subtitle below headline | Yes |
| `content.profile.tagline` | `string` | Body paragraph | Yes |
| `content.profile.photo` | `string` | `<img src>` | Yes |
| `content.profile.photoAlt` | `string` | `<img alt>` — accessibility | Yes |
| `content.social.linkedin` | `string` | "Connect" CTA link href | Yes |
| `content.resume.path` | `string` | "Download Resume" button href | Yes |

**Renders**: Full-width hero with photo, name, title, tagline, and two CTAs (Download Resume + Connect on LinkedIn).

**Null/empty behaviour**: If `photo` is an empty string or the file is missing, the `<img>` tag still renders — a broken image placeholder appears. A placeholder image must be committed to `/public/assets/` during development.

---

## Contract: Skills Component (`Skills.astro`)

**Reads from**: `content.skills`

| Field path | Type | Usage | Required |
|---|---|---|---|
| `content.skills` | `SkillCategory[]` | Array of category groups to render | Yes |
| `content.skills[n].category` | `string` | Category heading | Yes |
| `content.skills[n].skills` | `string[]` | Skill pill labels | Yes (≥ 1 item) |

**Renders**: Grid of skill category cards, each with a heading and pill-style skill labels.

**Null/empty behaviour**: If `content.skills` is an empty array, the Skills section renders with no cards. The section heading still renders. This is acceptable during content migration.

---

## Contract: Experience Component (`Experience.astro`)

**Reads from**: `content.experience`

| Field path | Type | Usage | Required |
|---|---|---|---|
| `content.experience` | `ExperienceEntry[]` | Work history list | Yes |
| `content.experience[n].company` | `string` | Company name heading | Yes |
| `content.experience[n].title` | `string` | Job title | Yes |
| `content.experience[n].startDate` | `string` | Date range start | Yes |
| `content.experience[n].endDate` | `string` | Date range end | Yes |
| `content.experience[n].location` | `string \| undefined` | Optional location sub-line | No |
| `content.experience[n].highlights` | `string[]` | Bullet list of achievements | Yes (≥ 1 item) |

**Renders**: Vertical timeline of experience cards, most-recent-first.

**Null/empty behaviour**: Empty array renders an empty section body. Acceptable during content migration.

---

## Contract: Education Component (rendered inside `Experience.astro` or standalone)

**Reads from**: `content.education`

| Field path | Type | Usage | Required |
|---|---|---|---|
| `content.education` | `EducationEntry[]` | Education list | Yes |
| `content.education[n].institution` | `string` | Institution name | Yes |
| `content.education[n].degree` | `string` | Degree name | Yes |
| `content.education[n].graduationYear` | `string` | Graduation year | Yes |
| `content.education[n].location` | `string \| undefined` | Optional location | No |

**Renders**: Compact education cards below the experience timeline.

---

## Contract: Projects Component (`Projects.astro`)

**Reads from**: `content.projects`

| Field path | Type | Usage | Required |
|---|---|---|---|
| `content.projects` | `Project[]` | Project cards | Yes |
| `content.projects[n].title` | `string` | Card heading | Yes |
| `content.projects[n].description` | `string` | Card body text | Yes |
| `content.projects[n].tags` | `string[]` | Technology pill labels | Yes (≥ 1 item) |
| `content.projects[n].liveUrl` | `string \| undefined` | "Live Demo" link href | No |
| `content.projects[n].repoUrl` | `string \| undefined` | "View Code" link href | No |
| `content.projects[n].featured` | `boolean \| undefined` | Featured row highlight | No |

**Renders**: Card grid, featured projects highlighted. Each card shows title, description, tags, and any available links opening in `target="_blank" rel="noopener noreferrer"`.

**Null/empty behaviour**: If both `liveUrl` and `repoUrl` are absent, the card renders without any link buttons. Empty array renders an empty section body.

---

## Contract: Contact Component (`Contact.astro`)

**Reads from**: `content.social`

| Field path | Type | Usage | Required |
|---|---|---|---|
| `content.social.email` | `string` | `mailto:` link | Yes |
| `content.social.linkedin` | `string` | LinkedIn profile link | Yes |
| `content.social.github` | `string` | GitHub profile link | No (shown if present) |

**Renders**: Contact section with email button (`mailto:`), LinkedIn link, and GitHub link, all opening in `target="_blank"` (except the `mailto:`).

---

## Contract: Navigation Component (`Nav.astro`)

**Reads from**: Static hardcoded section IDs — does **not** read from `content.ts`.

**Section anchor map** (hardcoded in component):

| Section | Anchor ID | Nav label |
|---|---|---|
| Hero | `#hero` | (logo/name only, no nav item) |
| Skills | `#skills` | Skills |
| Experience | `#experience` | Experience |
| Projects | `#projects` | Projects |
| Contact | `#contact` | Contact |

**Note**: The nav labels are static strings inside `Nav.astro`. If a new section is added, both `index.astro` (new section component) and `Nav.astro` (new anchor link) must be updated together.

---

## Contract: Layout Component (`Layout.astro`)

**Reads from**: `content.meta`

| Field path | Type | Usage | Required |
|---|---|---|---|
| `content.meta.siteTitle` | `string` | `<title>` tag | Yes |
| `content.meta.description` | `string` | `<meta name="description">` | Yes |
| `content.meta.siteUrl` | `string` | Canonical `<link rel="canonical">` | Yes |
| `content.meta.ogImage` | `string \| undefined` | `<meta property="og:image">` | No |

---

## Breaking Change Rules

A change to `content.ts` is **non-breaking** if it:
- Adds an optional field (`?`) to an existing interface
- Adds a new entry to an array (experience, projects, skills)
- Edits any string value

A change is **breaking** if it:
- Renames or removes a required field from an interface
- Changes the type of an existing field
- Restructures `SiteContent` (e.g., moving `social` under `profile`)

**Breaking changes require**: updating all consuming `.astro` components before the TypeScript build will succeed. The `satisfies SiteContent` constraint on `content` ensures any breaking change surfaces immediately as a compile-time error.
