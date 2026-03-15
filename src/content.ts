/**
 * Site content for Karthik A's personal portfolio.
 *
 * This is the ONLY file you need to edit to update the website.
 * Each field is documented with @description and @example tags.
 * Do NOT modify the TypeScript interface definitions — only edit the `content` object literal below.
 *
 * AI Agent Update Instruction:
 * "Read src/content.ts. Find the relevant field(s) and update them.
 *  Keep all other content unchanged. Preserve the `satisfies SiteContent` pattern."
 */

// ---------------------------------------------------------------------------
// Type Definitions
// ---------------------------------------------------------------------------

/**
 * Hero section — Karthik's personal identity and photo.
 */
export interface Profile {
  /** @description Full name rendered as the hero <h1> heading. @example "Karthik A" */
  name: string;
  /** @description One-line professional title shown below the name. @example "Senior Cloud Ops Engineer" */
  title: string;
  /** @description 2–3 sentence personal branding description for the hero body paragraph. */
  tagline: string;
  /** @description Path to the profile photo relative to /public/. @example "/assets/karthik.jpg" */
  photo: string;
  /** @description Accessibility alt text for the profile photo. @example "Karthik A — Senior Cloud Ops Engineer" */
  photoAlt: string;
}

/**
 * Contact and social profile URLs used in the Hero CTAs, Contact section, and footer.
 */
export interface SocialLinks {
  /** @description Professional email address used as a mailto: href. @example "karthikag021@gmail.com" */
  email: string;
  /** @description Full LinkedIn profile URL. @example "https://linkedin.com/in/karthik-a" */
  linkedin: string;
  /** @description GitHub profile URL. @example "https://github.com/karthikag021" */
  github: string;
}

/**
 * A single work role. Multiple entries form the Experience section, ordered most-recent-first.
 */
export interface ExperienceEntry {
  /** @description Company or organisation name. @example "Kongsberg Digital India" */
  company: string;
  /** @description Job title held. @example "Senior Cloud Ops Engineer" */
  title: string;
  /** @description Start date in "Month YYYY" format. @example "July 2022" */
  startDate: string;
  /** @description End date in "Month YYYY" format, or "Present". @example "Present" */
  endDate: string;
  /** @description Optional office location. @example "Bengaluru, India" */
  location?: string;
  /** @description 2–4 bullet strings describing responsibilities or achievements. */
  highlights: string[];
}

/**
 * A single academic credential. Multiple entries form the Education sub-section.
 */
export interface EducationEntry {
  /** @description Name of the institution. @example "ATME College of Engineering, Mysuru" */
  institution: string;
  /** @description Full degree name and field of study. @example "Bachelor of Engineering in Electronics and Communication" */
  degree: string;
  /** @description Graduation year as a 4-digit string. @example "2015" */
  graduationYear: string;
  /** @description Optional city/country of the institution. @example "Mysuru, India" */
  location?: string;
}

/**
 * A named group of skills. Multiple entries form the Skills section.
 * Must contain at least one skill.
 */
export interface SkillCategory {
  /** @description Display name for the skill group. @example "Cloud Platforms" */
  category: string;
  /** @description List of individual skill labels (at least one). @example ["Azure", "Kubernetes"] */
  skills: string[];
}

/**
 * A notable project. Multiple entries form the Projects section in curated order.
 */
export interface Project {
  /** @description Project display name. @example "Edge Observability Platform" */
  title: string;
  /** @description 1–2 sentence description of what the project does. */
  description: string;
  /** @description Technology or domain labels. @example ["Kubernetes", "Prometheus"] */
  tags: string[];
  /** @description URL to a live demo (optional). */
  liveUrl?: string;
  /** @description GitHub repository URL (optional). */
  repoUrl?: string;
  /** @description If true, the project is highlighted prominently in the grid. Defaults to false. */
  featured?: boolean;
}

/**
 * Downloadable resume PDF configuration (FR-005).
 */
export interface ResumeConfig {
  /** @description Path to the PDF relative to /public/. @example "/assets/karthik-resume.pdf" */
  path: string;
  /** @description Filename the browser presents when the user downloads the file. @example "Karthik_A_Resume.pdf" */
  downloadName: string;
}

/**
 * SEO and browser <head> metadata.
 */
export interface SiteMetadata {
  /** @description Browser tab title. @example "Karthik A — Senior Cloud Ops Engineer" */
  siteTitle: string;
  /** @description <meta name="description"> content (max 160 chars). */
  description: string;
  /** @description Canonical base URL for the deployed site. @example "https://karthikag021.github.io" */
  siteUrl: string;
  /** @description Optional Open Graph image path for social sharing previews. @example "/assets/og-image.png" */
  ogImage?: string;
}

/**
 * Root aggregate type for all site content.
 * The exported `content` constant must satisfy this type.
 */
export interface SiteContent {
  profile: Profile;
  social: SocialLinks;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: SkillCategory[];
  projects: Project[];
  resume: ResumeConfig;
  meta: SiteMetadata;
}

// ---------------------------------------------------------------------------
// Site Content — Edit ONLY below this line
// ---------------------------------------------------------------------------

export const content = {

  // ─── Hero Identity ─────────────────────────────────────────────────────────
  profile: {
    name: "Karthik A",
    title: "Senior Cloud Ops Engineer",
    tagline:
      "Results-driven DevOps and Cloud-Native Engineer with 10+ years of experience designing and operating scalable, secure Kubernetes platforms on Azure. Specialized in LLM infrastructure, edge observability with the LGTM stack, and GitOps — recently spoke at KubeCon 2025 and contributing to enterprise AI workloads.",
    photo: "/assets/karthik.jpg",          // Replace with real photo at public/assets/karthik.jpg
    photoAlt: "Karthik A — Senior Cloud Ops Engineer",
  },

  // ─── Contact & Social ──────────────────────────────────────────────────────
  social: {
    email: "karthikag021@gmail.com",
    linkedin: "https://www.linkedin.com/in/karthik-a-bb9516100",
    github: "https://github.com/karthik-a-gowda",
  },

  // ─── Work Experience ───────────────────────────────────────────────────────
  experience: [
    {
      company: "Kongsberg Digital India",
      title: "Senior Cloud Ops Engineer",
      startDate: "July 2022",
      endDate: "Present",
      location: "Bengaluru, India",
      highlights: [
        "Designed hybrid cloud architectures for a Norway-based IoT high-technology systems company, integrating Azure and edge environments; automated infrastructure with Terraform and Pulumi, achieving a 30% cost reduction across development and production.",
        "Led GitOps transformation using ArgoCD and implemented a comprehensive LGTM observability stack (Prometheus, Grafana, Mimir, Loki, Tempo, Alertmanager) across cloud and edge workloads; delivered a technical session on Edge Observability at KubeCon 2025 (Hyderabad).",
        "Designed and operated production-grade Azure OpenAI infrastructure enabling secure LLM inference; provisioned RAG pipelines backed by PgVector and Qdrant, and engineered GPU-optimized Ollama hosting on Kubernetes for high-demand AI workloads.",
        "Embedded DevSecOps practices integrating Trivy, SonarQube, Mend, Snyk, and Falco into CI/CD pipelines; managed Azure cloud security using Microsoft Threat Modeling Tool and Azure Defender.",
      ],
    },
    {
      company: "Siemens Technology and Services",
      title: "Senior Software Engineer",
      startDate: "July 2018",
      endDate: "June 2022",
      location: "Bengaluru, India",
      highlights: [
        "Designed and deployed end-to-end web application hosting on Azure (Key Vault, App Services, Function Apps, Application Gateway, Azure PostgreSQL).",
        "Automated infrastructure deployment using Terraform, ARM templates, and Azure modules; streamlined AKS microservices deployments with Helm charts.",
        "Built fully automated CI/CD pipelines with Azure DevOps and GitLab CI; enforced code quality gates with SonarQube and managed secure artifact repositories with Artifactory.",
      ],
    },
    {
      company: "DXC Technology",
      title: "Technology Consultant",
      startDate: "December 2015",
      endDate: "June 2018",
      highlights: [
        "Managed enterprise application packaging and virtualization using AdminStudio Repackager, InstallShield 2015, and App-V.",
        "Repackaged legacy installers and in-house applications for enterprise deployment pipelines.",
      ],
    },
  ],

  // ─── Education ─────────────────────────────────────────────────────────────
  education: [
    {
      institution: "ATME College of Engineering, Mysuru",
      degree: "Bachelor of Engineering in Electronics and Communication",
      graduationYear: "2015",
      location: "Mysuru, India",
    },
  ],

  // ─── Skills ────────────────────────────────────────────────────────────────
  skills: [
    {
      category: "Cloud Platforms",
      skills: [
        "Microsoft Azure",
        "Azure Kubernetes Service (AKS)",
        "Azure Functions",
        "Azure App Services",
        "Kubernetes (k8s / k3s)",
        "Docker",
        "Rancher",
        "Helm",
      ],
    },
    {
      category: "Infrastructure as Code & GitOps",
      skills: [
        "Terraform",
        "Pulumi",
        "Azure ARM Templates",
        "ArgoCD",
        "Argo Workflows",
        "GitOps",
        "Policy as Code",
      ],
    },
    {
      category: "AI & LLM Engineering",
      skills: [
        "Azure OpenAI Service",
        "Azure AI Studio",
        "Ollama",
        "LLaMA",
        "vLLM",
        "RAG Pipelines",
        "Embeddings & Vector Databases",
        "Prompt Engineering",
        "Semantic Routing",
        "Document Intelligence",
      ],
    },
    {
      category: "Observability (LGTM Stack)",
      skills: [
        "Prometheus",
        "Grafana",
        "Loki",
        "Tempo",
        "Mimir",
        "Alertmanager",
        "Fluent Bit",
        "Promtail",
        "SLI / SLO",
        "Incident Response",
      ],
    },
    {
      category: "CI/CD & DevSecOps",
      skills: [
        "Azure DevOps",
        "GitHub Actions",
        "GitLab CI",
        "Trivy",
        "SonarQube",
        "OWASP ZAP",
        "Falco",
        "Snyk",
        "Mend",
        "Harbor Registry",
      ],
    },
    {
      category: "Security & IAM",
      skills: [
        "Azure Entra ID",
        "Keycloak",
        "SAML",
        "OAuth2",
        "RBAC / ABAC",
        "MFA & SSO",
        "Service Mesh (Istio, Gloo Mesh)",
        "Network Policies",
      ],
    },
    {
      category: "Databases & Messaging",
      skills: [
        "PostgreSQL",
        "MongoDB",
        "TimescaleDB",
        "PgVector",
        "Qdrant",
        "Kafka",
        "RabbitMQ",
        "Redis",
        "MySQL",
      ],
    },
    {
      category: "Programming & Scripting",
      skills: ["Python", "PowerShell", "Bash / Shell", "Go (foundational)"],
    },
  ],

  // ─── Projects ──────────────────────────────────────────────────────────────
  projects: [
    {
      title: "Edge Observability with LGTM Stack — KubeCon 2025",
      description:
        "Technical session delivered at KubeCon 2025 (Hyderabad) showcasing a scalable, production-grade monitoring architecture for distributed edge environments using Prometheus, Grafana, Loki, and Tempo.",
      tags: ["Kubernetes", "Prometheus", "Grafana", "Loki", "Edge Computing", "LGTM"],
      featured: true,
    },
    {
      title: "Multi-modal AI Agent — Enterprise Hackathon Runner-up",
      description:
        "Designed a multi-modal AI agent with intelligent skill selection, dynamic routing, and context-aware response generation using LLM orchestration principles — achieved runner-up in an enterprise AI hackathon.",
      tags: ["Azure OpenAI", "LLM Orchestration", "Python", "AI Gateway", "Semantic Routing"],
      featured: true,
    },
    {
      title: "GPU-Optimized LLM Inference Platform",
      description:
        "Engineered GPU-enabled Kubernetes clusters hosting Ollama, Docling, and 3D rendering services; implemented GPU scheduling, autoscaling, and performance tuning to deliver high-availability, low-latency AI workloads.",
      tags: ["Kubernetes", "Ollama", "GPU Computing", "Azure", "LLM", "vLLM"],
    },
    {
      title: "Azure OpenAI RAG Infrastructure",
      description:
        "Provisioned and managed production-grade Azure OpenAI infrastructure enabling secure, scalable LLM inference with RAG pipelines backed by PgVector and Qdrant for enterprise document intelligence.",
      tags: ["Azure OpenAI", "RAG", "PgVector", "Qdrant", "Kubernetes", "Document Intelligence"],
    },
    {
      title: "Internal Developer Portal — SRE & Platform Engineering",
      description:
        "Core DevOps and SRE team member for an in-house developer portal serving 300+ engineers; delivered golden paths, self-service provisioning, standardized CI/CD templates, and observability blueprints.",
      tags: ["Platform Engineering", "SRE", "ArgoCD", "Kubernetes", "DevOps", "Developer Experience"],
    },
  ],

  // ─── Resume PDF ────────────────────────────────────────────────────────────
  resume: {
    path: "/assets/karthik-resume.pdf",   // Place the PDF at public/assets/karthik-resume.pdf
    downloadName: "Karthik_A_Resume.pdf",
  },

  // ─── SEO & Browser Metadata ────────────────────────────────────────────────
  meta: {
    siteTitle: "Karthik A — Senior Cloud Ops Engineer",
    description:
      "Senior Cloud Ops Engineer with 10+ years in Kubernetes, Azure, DevSecOps, and LLM infrastructure. CKA certified. KubeCon 2025 speaker. Based in Mysuru, India.",
    siteUrl: "https://karthik-a-gowda.github.io/karthik-portfolio-site",
    ogImage: "/assets/og-image.png",
  },

} satisfies SiteContent;
