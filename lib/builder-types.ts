export type SiteTemplate = "brutal" | "minimal" | "neon3d" | "mono";

export type SectionKind =
  | "about"
  | "tokenomics"
  | "roadmap"
  | "community"
  | "faq"
  | "utility";

export type SiteSection = {
  id: string;
  kind: SectionKind;
  label: string;
  title: string;
  body: string;
  bullets: string[];
};

export type SiteDraft = {
  template: SiteTemplate;
  templateLabel: string;
  projectName: string;
  symbol: string;
  tagline: string;
  description: string;
  bagsUrl: string;
  contractAddress: string;
  heroEyebrow: string;
  heroTitle: string;
  heroHighlight: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  navItems: string[];
  sections: SiteSection[];
};

export type ProjectRecord = {
  id: string;
  slug: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  prompts: string[];
  draft: SiteDraft;
};

export type GenerateDraftResult = {
  project: ProjectRecord;
  assistantMessage: string;
};
