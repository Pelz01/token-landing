import { SiteDraft, SiteSection, SiteTemplate } from "./builder-types";

type GenerateDraftInput = {
  prompt: string;
  currentDraft?: SiteDraft;
};

type PromptSignals = {
  cleanedPrompt: string;
  projectName: string;
  symbol: string;
  contractAddress: string;
  bagsUrl: string;
  websiteUrl: string;
  xUrl: string;
  telegramUrl: string;
  profile: "community" | "defi" | "utility";
  template: SiteTemplate;
  wantsFaq: boolean;
  wantsRoadmap: boolean;
  wantsTokenomics: boolean;
  wantsUtility: boolean;
};

const SOLANA_CA_PATTERN = /\b[1-9A-HJ-NP-Za-km-z]{32,44}\b/;

function titleCase(value: string) {
  return value
    .split(/[\s-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function slugToName(value: string) {
  return titleCase(value.replace(/[^a-zA-Z0-9-_ ]/g, " "));
}

function extractUrl(prompt: string, matcher: RegExp) {
  return prompt.match(matcher)?.[0] ?? "";
}

function inferProjectName(prompt: string, currentDraft?: SiteDraft) {
  const called = prompt.match(/called\s+([A-Za-z0-9-]+)/i)?.[1];
  const named = prompt.match(/named\s+([A-Za-z0-9-]+)/i)?.[1];
  const ticker = prompt.match(/\$([A-Z0-9]{2,10})\b/)?.[1];

  if (called) return slugToName(called);
  if (named) return slugToName(named);
  if (ticker) return ticker;
  if (currentDraft?.projectName) return currentDraft.projectName;
  return "Your Project";
}

function inferSymbol(prompt: string, projectName: string, currentDraft?: SiteDraft) {
  const ticker = prompt.match(/\$([A-Z0-9]{2,10})\b/)?.[1];
  const uppercaseWord = prompt.toUpperCase().match(/\b([A-Z]{2,6})\b/)?.[1];

  if (ticker) return ticker;
  if (uppercaseWord && uppercaseWord !== "BAGS") return uppercaseWord;
  if (currentDraft?.symbol) return currentDraft.symbol;
  return projectName.replace(/[^A-Za-z0-9]/g, "").slice(0, 5).toUpperCase() || "TOKEN";
}

function collectSignals({ prompt, currentDraft }: GenerateDraftInput): PromptSignals {
  const cleanedPrompt = prompt.trim();
  const lower = cleanedPrompt.toLowerCase();
  const projectName = inferProjectName(cleanedPrompt, currentDraft);
  const symbol = inferSymbol(cleanedPrompt, projectName, currentDraft);
  const contractAddress =
    cleanedPrompt.match(SOLANA_CA_PATTERN)?.[0] ??
    currentDraft?.contractAddress ??
    "Add a contract address to personalize this section.";
  const bagsUrl =
    extractUrl(cleanedPrompt, /https?:\/\/(?:www\.)?bags\.fm\/[^\s)]+/i) ||
    currentDraft?.bagsUrl ||
    "https://bags.fm/";
  const websiteUrl =
    extractUrl(cleanedPrompt, /https?:\/\/(?!(?:www\.)?bags\.fm\/)[^\s)]+/i) ||
    currentDraft?.secondaryCtaHref ||
    "";
  const xUrl = extractUrl(cleanedPrompt, /https?:\/\/(?:www\.)?(?:x\.com|twitter\.com)\/[^\s)]+/i);
  const telegramUrl = extractUrl(cleanedPrompt, /https?:\/\/t\.me\/[^\s)]+/i);
  const profile = lower.includes("defi")
    ? "defi"
    : lower.includes("utility") || lower.includes("infrastructure")
      ? "utility"
      : "community";
  const template = inferTemplate(lower, profile, currentDraft?.template);

  return {
    cleanedPrompt,
    projectName,
    symbol,
    contractAddress,
    bagsUrl,
    websiteUrl,
    xUrl,
    telegramUrl,
    profile,
    template,
    wantsFaq: lower.includes("faq"),
    wantsRoadmap: !lower.includes("no roadmap"),
    wantsTokenomics: !lower.includes("no tokenomics"),
    wantsUtility:
      profile !== "community" || lower.includes("utility") || lower.includes("use case"),
  };
}

function inferTemplate(
  lowerPrompt: string,
  _profile: PromptSignals["profile"],
  currentTemplate?: SiteTemplate,
): SiteTemplate {
  if (/neo brutal|neo-brutal|brutalism|brutalist|bold poster|chunky/.test(lowerPrompt)) {
    return "brutal";
  }

  if (/minimal|minimalistic|refined|soft|clean|elegant|airy|editorial|premium/.test(lowerPrompt)) {
    return "minimal";
  }

  if (/3d|neon|glow|futuristic|cyber|cyberpunk|holographic|electric/.test(lowerPrompt)) {
    return "neon3d";
  }

  if (/black and white|black & white|monochrome|mono|grayscale|greyscale/.test(lowerPrompt)) {
    return "mono";
  }

  return currentTemplate || "minimal";
}

function templateLabel(template: SiteTemplate) {
  switch (template) {
    case "brutal":
      return "Neo Brutalism";
    case "neon3d":
      return "3D Neon";
    case "mono":
      return "Black & White";
    default:
      return "Minimal";
  }
}

function buildTagline(signals: PromptSignals) {
  if (signals.profile === "defi") {
    return `A sharper Bags-ready front door for ${signals.projectName}, built to explain the product fast and convert attention into action.`;
  }

  if (signals.profile === "utility") {
    return `A clearer home for ${signals.projectName}, turning the project story into something people can understand and trust in one pass.`;
  }

  return `A stronger, cleaner home for ${signals.projectName}, built to move fast, look credible, and send traffic where it matters.`;
}

function buildDescription(signals: PromptSignals, currentDraft?: SiteDraft) {
  const existing = currentDraft?.description;
  const cleaned = signals.cleanedPrompt.replace(/\s+/g, " ").trim();

  if (cleaned.length > 180) {
    return cleaned;
  }

  if (signals.profile === "defi") {
    return `${signals.projectName} needs a landing page that explains the product clearly, frames the token in context, and gives people a direct path to explore or trade on Bags.`;
  }

  if (signals.profile === "utility") {
    return `${signals.projectName} needs a website that makes the project feel real, organized, and easy to understand without losing momentum.`;
  }

  return existing || `${signals.projectName} needs a landing page that keeps the energy high while making the project feel more polished, real, and easy to share.`;
}

function section(id: string, kind: SiteSection["kind"], label: string, title: string, body: string, bullets: string[]): SiteSection {
  return { id, kind, label, title, body, bullets };
}

function buildSections(signals: PromptSignals, description: string) {
  const sections: SiteSection[] = [];

  sections.push(
    section(
      "about",
      "about",
      "About",
      `What ${signals.projectName} is building`,
      description,
      signals.profile === "defi"
        ? [
            "Explain the core product in plain language.",
            "Show why the token exists inside the system.",
            "Point users to the Bags trading flow without friction.",
          ]
        : [
            "Make the story readable in a few seconds.",
            "Clarify the tone, culture, and reason the token exists.",
            "Give new visitors one obvious next step.",
          ],
    ),
  );

  if (signals.wantsUtility) {
    sections.push(
      section(
        "utility",
        "utility",
        "Utility",
        "Why the token matters",
        `${signals.symbol} should be framed as part of the project story, not just a ticker on a chart.`,
        signals.profile === "defi"
          ? [
              "Access, governance, or protocol participation.",
              "Rewards, incentives, or aligned user behavior.",
              "A clear relationship between product and token.",
            ]
          : [
              "Community coordination and shared momentum.",
              "Utility that feels practical, not over-explained.",
              "A reason for visitors to care beyond the ticker.",
            ],
      ),
    );
  }

  if (signals.wantsTokenomics) {
    sections.push(
      section(
        "tokenomics",
        "tokenomics",
        "Tokenomics",
        "A cleaner way to present the token",
        `The token page should summarize the essentials without burying visitors in numbers.`,
        [
          `Symbol: ${signals.symbol}`,
          `Contract: ${signals.contractAddress}`,
          "Trade path: direct Bags call-to-action",
        ],
      ),
    );
  }

  if (signals.wantsRoadmap) {
    sections.push(
      section(
        "roadmap",
        "roadmap",
        "Roadmap",
        "What comes next",
        "The roadmap should look credible, direct, and easy to skim.",
        [
          "Launch a sharper public-facing site.",
          "Tighten community conversion with clearer calls to action.",
          "Keep shipping updates that reinforce trust and momentum.",
        ],
      ),
    );
  }

  sections.push(
    section(
      "community",
      "community",
      "Community",
      "Keep the community close to the action",
      "The page should make it obvious where people join, watch, and trade.",
      [
        signals.xUrl || "Add an X link for ongoing updates.",
        signals.telegramUrl || "Add a Telegram or community link.",
        "Give people a Bags CTA that sits near the rest of the action.",
      ],
    ),
  );

  if (signals.wantsFaq) {
    sections.push(
      section(
        "faq",
        "faq",
        "FAQ",
        "Answer the fast questions early",
        "A short FAQ helps the site feel complete without making it heavy.",
        [
          "What is the project?",
          "Where can I trade it on Bags?",
          "How should new people follow updates?",
        ],
      ),
    );
  }

  return sections;
}

export function generateDraft({ prompt, currentDraft }: GenerateDraftInput): SiteDraft {
  const signals = collectSignals({ prompt, currentDraft });
  const description = buildDescription(signals, currentDraft);
  const sections = buildSections(signals, description);

  return {
    template: signals.template,
    templateLabel: templateLabel(signals.template),
    projectName: signals.projectName,
    symbol: signals.symbol,
    tagline: buildTagline(signals),
    description,
    bagsUrl: signals.bagsUrl,
    contractAddress: signals.contractAddress,
    heroEyebrow: "Bags-ready website",
    heroTitle: signals.projectName,
    heroHighlight: signals.symbol,
    primaryCtaLabel: "Trade on Bags",
    primaryCtaHref: signals.bagsUrl,
    secondaryCtaLabel: signals.websiteUrl ? "Visit project link" : "View contract",
    secondaryCtaHref: signals.websiteUrl || "#contract",
    navItems: sections.map((item) => item.label),
    sections,
  };
}

export function createAssistantMessage(draft: SiteDraft) {
  return `First draft ready for ${draft.projectName}. I set it in the ${draft.templateLabel} template with a hero, section structure, and Bags call-to-action. Keep prompting to refine the copy, add sections, or switch the visual direction.`;
}
