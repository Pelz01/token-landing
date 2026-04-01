"use client";

import { ChangeEvent, useMemo, useState } from "react";

type ToneKey = "cult" | "studio" | "protocol" | "riot";

type ProjectForm = {
  projectName: string;
  symbol: string;
  tagline: string;
  category: string;
  oneLiner: string;
  audience: string;
  utility: string;
  tokenomics: string;
  roadmap: string;
  community: string;
  bagsUrl: string;
  xUrl: string;
  telegramUrl: string;
  tone: ToneKey;
};

type ToneConfig = {
  label: string;
  kicker: string;
  manifestoLead: string;
  cta: string;
  note: string;
};

const tones: Record<ToneKey, ToneConfig> = {
  cult: {
    label: "Cult Brand",
    kicker: "Designed like a movement, not a memo.",
    manifestoLead: "This is a narrative weapon for fast-moving internet believers.",
    cta: "Join the first wave",
    note: "High energy, community-first, language built to spread.",
  },
  studio: {
    label: "Creative Studio",
    kicker: "Built like a launch campaign with taste.",
    manifestoLead: "This is brand-first token storytelling for people who care how the project feels.",
    cta: "See the drop",
    note: "Editorial, polished, visual, and intentionally cultural.",
  },
  protocol: {
    label: "Protocol Grade",
    kicker: "Structured for conviction and clarity.",
    manifestoLead: "This is a disciplined story for serious operators, early users, and ecosystem partners.",
    cta: "Read the thesis",
    note: "Clear utility, credible framing, and an institutional edge.",
  },
  riot: {
    label: "Riot Mode",
    kicker: "A homepage built to punch through noise.",
    manifestoLead: "This is loud, sharp, and engineered for launch-day attention capture.",
    cta: "Enter the raid",
    note: "Fast, aggressive, meme-aware, and highly social.",
  },
};

const initialForm: ProjectForm = {
  projectName: "BAGSTORM",
  symbol: "BAG",
  tagline: "A Bags-native launch engine for community-run Solana momentum.",
  category: "Community token",
  oneLiner:
    "BAGSTORM turns internet attention into a member-owned signal machine with quests, gated calls, creator raids, and launch-day media loops.",
  audience: "Solana traders, creator collectives, raid teams, and onchain communities that move fast.",
  utility:
    "Use BAG for campaign access, token-gated research rooms, creator collabs, reward drops, and community activations that keep attention compounding.",
  tokenomics:
    "1B total supply. 55% community and quest rewards. 20% liquidity. 15% growth initiatives and creators. 10% team vesting across 18 months.",
  roadmap:
    "Q1: launch the identity, mint the community, and start social quests. Q2: creator campaigns, leaderboard loops, and gated rooms. Q3: partner drops, rewards tooling, and brand expansion.",
  community:
    "Unapologetically online, reward-heavy, and built around fast execution. Every holder should feel like a co-conspirator in the project story.",
  bagsUrl: "https://bags.fm/",
  xUrl: "https://x.com/",
  telegramUrl: "https://t.me/",
  tone: "cult",
};

function updateForm(
  event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  setForm: (updater: (current: ProjectForm) => ProjectForm) => void,
) {
  const { name, value } = event.target;
  setForm((current) => ({ ...current, [name]: value }));
}

function splitRoadmap(roadmap: string) {
  return roadmap
    .split(".")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 3);
}

export default function Home() {
  const [form, setForm] = useState<ProjectForm>(initialForm);
  const tone = tones[form.tone];

  const projectStats = useMemo(
    () => [
      { label: "Site tone", value: tone.label },
      { label: "Core audience", value: form.audience.split(",")[0] ?? form.audience },
      { label: "Launch surface", value: "Bags / X / Telegram" },
    ],
    [form.audience, tone.label],
  );

  const roadmapItems = splitRoadmap(form.roadmap);

  return (
    <main className="studio-shell">
      <section className="builder-column">
        <div className="builder-frame">
          <div className="micro-label">Bags site composer</div>
          <h1>
            Build the kind of website a Bags project would actually want to share.
          </h1>
          <p className="builder-intro">
            This generator is aimed at Bags launches, meme campaigns, and token
            communities that need something more convincing than a generic landing
            page. Shape the brief and the live preview updates instantly.
          </p>

          <div className="builder-meter">
            <div>
              <span>Output</span>
              <strong>Launch-ready homepage</strong>
            </div>
            <div>
              <span>Style</span>
              <strong>{tone.note}</strong>
            </div>
          </div>

          <div className="form-grid">
            <label>
              Project name
              <input
                name="projectName"
                value={form.projectName}
                onChange={(event) => updateForm(event, setForm)}
              />
            </label>

            <label>
              Symbol
              <input
                name="symbol"
                value={form.symbol}
                onChange={(event) => updateForm(event, setForm)}
              />
            </label>

            <label className="full">
              Tagline
              <input
                name="tagline"
                value={form.tagline}
                onChange={(event) => updateForm(event, setForm)}
              />
            </label>

            <label>
              Category
              <input
                name="category"
                value={form.category}
                onChange={(event) => updateForm(event, setForm)}
              />
            </label>

            <label>
              Tone
              <select
                name="tone"
                value={form.tone}
                onChange={(event) => updateForm(event, setForm)}
              >
                {Object.entries(tones).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="full">
              One-line description
              <textarea
                name="oneLiner"
                rows={3}
                value={form.oneLiner}
                onChange={(event) => updateForm(event, setForm)}
              />
            </label>

            <label className="full">
              Audience
              <textarea
                name="audience"
                rows={3}
                value={form.audience}
                onChange={(event) => updateForm(event, setForm)}
              />
            </label>

            <label className="full">
              Utility
              <textarea
                name="utility"
                rows={4}
                value={form.utility}
                onChange={(event) => updateForm(event, setForm)}
              />
            </label>

            <label className="full">
              Tokenomics
              <textarea
                name="tokenomics"
                rows={4}
                value={form.tokenomics}
                onChange={(event) => updateForm(event, setForm)}
              />
            </label>

            <label className="full">
              Roadmap
              <textarea
                name="roadmap"
                rows={4}
                value={form.roadmap}
                onChange={(event) => updateForm(event, setForm)}
              />
            </label>

            <label className="full">
              Community vibe
              <textarea
                name="community"
                rows={3}
                value={form.community}
                onChange={(event) => updateForm(event, setForm)}
              />
            </label>

            <label>
              Bags URL
              <input
                name="bagsUrl"
                value={form.bagsUrl}
                onChange={(event) => updateForm(event, setForm)}
              />
            </label>

            <label>
              X URL
              <input
                name="xUrl"
                value={form.xUrl}
                onChange={(event) => updateForm(event, setForm)}
              />
            </label>

            <label className="full">
              Telegram URL
              <input
                name="telegramUrl"
                value={form.telegramUrl}
                onChange={(event) => updateForm(event, setForm)}
              />
            </label>
          </div>
        </div>
      </section>

      <section className="preview-column">
        <div className="poster">
          <div className="poster-grid">
            <div className="poster-topline">
              <span>{form.category}</span>
              <span>{tone.kicker}</span>
            </div>

            <div className="poster-hero">
              <div className="hero-left">
                <div className="symbol-pill">{form.symbol}</div>
                <h2>{form.projectName}</h2>
                <p className="hero-tagline">{form.tagline}</p>
                <p className="hero-summary">{form.oneLiner}</p>

                <div className="hero-actions">
                  <a href={form.bagsUrl} target="_blank" rel="noreferrer">
                    Open on Bags
                  </a>
                  <a href={form.xUrl} target="_blank" rel="noreferrer">
                    {tone.cta}
                  </a>
                </div>
              </div>

              <div className="hero-right">
                <div className="signal-card signal-card-cream">
                  <span className="card-kicker">Manifesto</span>
                  <p>{tone.manifestoLead}</p>
                </div>
                <div className="signal-card signal-card-ink">
                  <span className="card-kicker">Community temperature</span>
                  <p>{form.community}</p>
                </div>
              </div>
            </div>

            <div className="stat-row">
              {projectStats.map((item) => (
                <div key={item.label} className="stat-tile">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>

            <div className="editorial-grid">
              <article className="panel panel-utility">
                <span className="panel-label">Why it exists</span>
                <p>{form.utility}</p>
              </article>

              <article className="panel panel-tokenomics">
                <span className="panel-label">Tokenomics</span>
                <p>{form.tokenomics}</p>
              </article>

              <article className="panel panel-roadmap">
                <span className="panel-label">Roadmap</span>
                <div className="roadmap-list">
                  {roadmapItems.map((item, index) => (
                    <div key={`${item}-${index}`} className="roadmap-step">
                      <span>0{index + 1}</span>
                      <p>{item}</p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="panel panel-audience">
                <span className="panel-label">Built for</span>
                <p>{form.audience}</p>
              </article>

              <article className="panel panel-links">
                <span className="panel-label">Launch stack</span>
                <div className="link-stack">
                  <a href={form.bagsUrl} target="_blank" rel="noreferrer">
                    Bags
                  </a>
                  <a href={form.xUrl} target="_blank" rel="noreferrer">
                    X
                  </a>
                  <a href={form.telegramUrl} target="_blank" rel="noreferrer">
                    Telegram
                  </a>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
