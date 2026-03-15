# Data Model: Personal Portfolio & Branding Website

**Feature**: `001-personal-portfolio-website`  
**Phase**: 1 — Design  
**Source**: [spec.md](spec.md) — Key Entities section + FR-012, FR-013  
**Date**: 2026-03-15

---

## Overview

All website content lives in a single TypeScript file: `src/content.ts`. It exports one root constant (`content`) typed via the `SiteContent` interface using the `satisfies` operator (TypeScript 4.9+). Every field is annotated with a JSDoc `@description`, `@type`, and `@example` comment so that an AI agent or human editor can update any field without reading any other file.

There is no database and no API. `content.ts` is the single source of truth for all textual and link content rendered on the site.

---

## Entity Definitions

### 1. `Profile`

Represents Karthik's personal identity displayed in the **Hero** section and browser metadata.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `string` | Yes | Full name (hero headline) |
| `title` | `string` | Yes | One-line professional title below the name |
| `tagline` | `string` | Yes | 2–3 sentence personal description for the hero body |
| `photo` | `string` | Yes | Path to profile photo relative to `/public/` |
| `photoAlt` | `string` | Yes | Accessibility alt text for the profile photo |

---

### 2. `SocialLinks`

Contact and social profile URLs used in the **Contact** section, footer, and hero CTAs.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | `string` | Yes | Professional email address (used as `mailto:` href) |
| `linkedin` | `string` | Yes | Full LinkedIn profile URL |
| `github` | `string` | Yes | GitHub profile URL |

---

### 3. `ExperienceEntry`

A single past or current role. Multiple entries form the **Experience** section, ordered most-recent-first.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `company` | `string` | Yes | Company or organisation name |
| `title` | `string` | Yes | Job title held |
| `startDate` | `string` | Yes | Start date in `"Month YYYY"` format |
| `endDate` | `string` | Yes | End date in `"Month YYYY"` format, or `"Present"` |
| `location` | `string` | No | Office location, e.g., `"Bangalore, India"` |
| `highlights` | `string[]` | Yes | 2–4 bullet strings describing responsibilities or achievements |

---

### 4. `EducationEntry`

A single academic credential. Multiple entries form the **Education** sub-section within the Experience section.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `institution` | `string` | Yes | Name of the institution |
| `degree` | `string` | Yes | Full degree name and field of study |
| `graduationYear` | `string` | Yes | Graduation year as a 4-digit string |
| `location` | `string` | No | City/country of the institution |

---

### 5. `SkillCategory`

A named group of skills. Multiple entries form the **Skills** section.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `category` | `string` | Yes | Display name for the skill group |
| `skills` | `string[]` | Yes | List of individual skill labels |

**Validation rule**: A `SkillCategory` must have at least one entry in `skills`.

---

### 6. `Project`

A notable piece of work. Multiple entries form the **Projects** section, displayed in entry order (curated by Karthik).

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | `string` | Yes | Project display name |
| `description` | `string` | Yes | 1–2 sentence description of what the project does |
| `tags` | `string[]` | Yes | Technology or domain labels |
| `liveUrl` | `string \| undefined` | No | URL to a live demo (static string, no API) |
| `repoUrl` | `string \| undefined` | No | GitHub repository URL (static string, no API) |
| `featured` | `boolean` | No | If `true`, the project is displayed prominently. Defaults to `false`. |

**Validation rule**: At least one of `liveUrl` or `repoUrl` should be present whenever possible. Neither is mandatory.

---

### 7. `ResumeConfig`

Configuration for the downloadable resume PDF (FR-005).

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `path` | `string` | Yes | Path to the PDF relative to `/public/` |
| `downloadName` | `string` | Yes | Filename the browser presents when the user downloads the file |

---

### 8. `SiteMetadata`

SEO and browser metadata rendered in `<head>`.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `siteTitle` | `string` | Yes | Browser tab title, e.g., `"Karthik A — Software Engineer"` |
| `description` | `string` | Yes | `<meta name="description">` content (max 160 chars) |
| `siteUrl` | `string` | Yes | Canonical base URL, e.g., `"https://karthika.github.io"` |
| `ogImage` | `string` | No | Path to Open Graph image for social sharing previews |

---

### 9. `SiteContent` *(root aggregate)*

The root type exported from `content.ts`. All other entities are fields of this type.

| Field | Type | Description |
|-------|------|-------------|
| `profile` | `Profile` | Hero section identity |
| `social` | `SocialLinks` | Contact and social links |
| `experience` | `ExperienceEntry[]` | Work history, most-recent-first |
| `education` | `EducationEntry[]` | Academic credentials |
| `skills` | `SkillCategory[]` | Grouped skill labels |
| `projects` | `Project[]` | Portfolio projects, curated order |
| `resume` | `ResumeConfig` | PDF download configuration |
| `meta` | `SiteMetadata` | SEO and browser metadata |

---

## State Transitions

This is a static read-only data file — there are no runtime state transitions. The only state change is an edit to `content.ts` (by a human or AI agent), which triggers a new GitHub Actions build and deploy.

```
content.ts edited
      │
      ▼
GitHub Actions build triggered (push to main)
      │
      ▼
Astro static build compiles content.ts → HTML/CSS
      │
      ▼
Site deployed to GitHub Pages
      │
      ▼
Visitor sees updated content
```

---

## TypeScript Schema (canonical reference)

This is the authoritative schema. The actual `src/content.ts` implementation MUST conform to this structure.

```typescript
// ─── Interfaces ──────────────────────────────────────────────────────────────

interface Profile {
  /** @description Full name shown as the hero headline. @example "Karthik A" */
  name: string;
  /** @description One-line professional title below the name. @example "Senior Software Engineer" */
  title: string;
  /** @description 2–3 sentence personal tagline for the hero body text. @example "I build..." */
  tagline: string;
  /** @description Path to profile photo relative to /public/. @example "/assets/karthik.jpg" */
  photo: string;
  /** @description Accessible alt text for the profile photo. @example "Karthik A, Software Engineer" */
  photoAlt: string;
}

interface SocialLinks {
  /** @description Professional email address (used as mailto: href). @example "karthik@example.com" */
  email: string;
  /** @description Full LinkedIn profile URL. @example "https://linkedin.com/in/karthik" */
  linkedin: string;
  /** @description GitHub profile URL. @example "https://github.com/karthik" */
  github: string;
}

interface ExperienceEntry {
  /** @description Company or organisation name. @example "Microsoft" */
  company: string;
  /** @description Job title. @example "Software Engineer II" */
  title: string;
  /** @description Start date in "Month YYYY" format. @example "January 2022" */
  startDate: string;
  /** @description End date in "Month YYYY" format, or "Present". @example "Present" */
  endDate: string;
  /** @description Optional office location. @example "Bangalore, India" */
  location?: string;
  /** @description 2–4 achievement or responsibility bullet strings. @example ["Built X", "Led Y"] */
  highlights: string[];
}

interface EducationEntry {
  /** @description Institution name. @example "IIT Madras" */
  institution: string;
  /** @description Full degree name and major. @example "B.Tech in Computer Science" */
  degree: string;
  /** @description Graduation year (4-digit string). @example "2018" */
  graduationYear: string;
  /** @description Optional city/country. @example "Chennai, India" */
  location?: string;
}

interface SkillCategory {
  /** @description Display name for the skill group, shown as a section heading. @example "Frontend" */
  category: string;
  /** @description Individual skill labels within this category. @example ["React", "TypeScript", "CSS"] */
  skills: string[];
}

interface Project {
  /** @description Project display name. @example "Portfolio Website" */
  title: string;
  /** @description 1–2 sentence description of what the project does. @example "A personal branding site..." */
  description: string;
  /** @description Technology or domain labels for this project. @example ["TypeScript", "Astro"] */
  tags: string[];
  /** @description Optional live demo URL (static string). @example "https://karthik.dev" */
  liveUrl?: string;
  /** @description Optional GitHub repository URL (static string, no API call). @example "https://github.com/karthik/portfolio" */
  repoUrl?: string;
  /** @description If true, this project is displayed prominently in the featured row. @default false */
  featured?: boolean;
}

interface ResumeConfig {
  /** @description Path to the resume PDF relative to /public/. @example "/assets/karthik-resume.pdf" */
  path: string;
  /** @description Filename the browser presents on download. @example "Karthik-Resume.pdf" */
  downloadName: string;
}

interface SiteMetadata {
  /** @description Browser tab title. @example "Karthik A — Software Engineer" */
  siteTitle: string;
  /** @description Meta description (max 160 chars). @example "Karthik A is a software engineer..." */
  description: string;
  /** @description Canonical base URL (no trailing slash). @example "https://karthika.github.io" */
  siteUrl: string;
  /** @description Optional path to Open Graph image. @example "/assets/og-image.png" */
  ogImage?: string;
}

export interface SiteContent {
  /** @description Hero section identity and photo. */
  profile: Profile;
  /** @description Contact and social profile links. */
  social: SocialLinks;
  /** @description Work history entries, ordered most-recent-first. */
  experience: ExperienceEntry[];
  /** @description Academic credentials. */
  education: EducationEntry[];
  /** @description Grouped skill categories for the Skills section. */
  skills: SkillCategory[];
  /** @description Portfolio projects in curated display order. */
  projects: Project[];
  /** @description Resume PDF download configuration. */
  resume: ResumeConfig;
  /** @description SEO and browser metadata. */
  meta: SiteMetadata;
}

// ─── Content (edit this object to update the site) ───────────────────────────

export const content = {
  profile: {
    name: "Karthik A",
    title: "Software Engineer",
    tagline: "Placeholder — replace with content from resume PDF.",
    photo: "/assets/karthik.jpg",
    photoAlt: "Karthik A, Software Engineer",
  },
  social: {
    email: "karthik@example.com",
    linkedin: "https://linkedin.com/in/karthik",
    github: "https://github.com/karthik",
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  resume: {
    path: "/assets/karthik-resume.pdf",
    downloadName: "Karthik-Resume.pdf",
  },
  meta: {
    siteTitle: "Karthik A — Software Engineer",
    description: "Personal portfolio of Karthik A, Software Engineer.",
    siteUrl: "https://karthika.github.io",
  },
} satisfies SiteContent;
```

---

## AI Agent Update Instructions

When an AI agent (e.g., GitHub Copilot) updates site content:

1. **Open only `src/content.ts`** — do not edit any `.astro` component or style file.
2. **Read the JSDoc comments** on each field to understand what to put there.
3. **Edit only the `content` object literal** — do not change the interface definitions.
4. **Arrays** (`experience`, `skills`, `projects`) can have entries added, removed, or reordered freely.
5. **Optional fields** (`location`, `liveUrl`, `repoUrl`, `ogImage`, `featured`) may be omitted entirely if not needed.
6. **After editing**, run `npm run build` to verify TypeScript type-checks pass before committing.
