import Link from "next/link";

import { SiteDraft } from "../lib/builder-types";

export function SitePreview({
  draft,
  published = false,
}: {
  draft: SiteDraft;
  published?: boolean;
}) {
  const template = draft.template || "minimal";
  const templateLabel = draft.templateLabel || "Minimal";

  return (
    <div className={`site-frame${published ? " site-frame-published" : ""}`}>
      <div className={`site-shell site-shell-${template}`}>
        <header className={`site-header site-header-${template}`}>
          <div className="site-header-brand">
            <span className="site-eyebrow">
              {draft.heroEyebrow} / {templateLabel}
            </span>
            <h1>{draft.projectName}</h1>
          </div>

          <nav className="site-nav" aria-label="Preview navigation">
            {draft.navItems.slice(0, 4).map((item) => (
              <span key={item}>{item}</span>
            ))}
          </nav>

          <a href={draft.primaryCtaHref} target="_blank" rel="noreferrer" className="site-cta">
            {draft.primaryCtaLabel}
          </a>
        </header>

        <section className={`site-hero site-hero-${template}`}>
          <div className="site-hero-copy">
            <div className="site-hero-pill">{draft.symbol}</div>
            <h2>
              {draft.heroTitle}
              <span>{draft.heroHighlight}</span>
            </h2>
            <p>{draft.tagline}</p>

            <div className="site-hero-actions">
              <a href={draft.primaryCtaHref} target="_blank" rel="noreferrer" className="site-cta">
                {draft.primaryCtaLabel}
              </a>
              <a href={draft.secondaryCtaHref} className="site-secondary-cta">
                {draft.secondaryCtaLabel}
              </a>
            </div>
          </div>

          <div className="site-fact-card">
            <span className="panel-label">Template</span>
            <p>{templateLabel}</p>
            <div className="site-fact-divider" />
            <span className="panel-label">Contract</span>
            <p id="contract">{draft.contractAddress}</p>
            <div className="site-fact-divider" />
            <span className="panel-label">About</span>
            <p>{draft.description}</p>
          </div>
        </section>

        <section className={`site-sections site-sections-${template}`}>
          {draft.sections.map((section) => (
            <article key={section.id} className="site-section-card">
              <span className="site-section-label">{section.label}</span>
              <h3>{section.title}</h3>
              <p>{section.body}</p>
              <ul>
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        {published ? (
          <footer className="site-footer">
            <p>{draft.projectName} on Baggable</p>
            <Link href="/">Create your own</Link>
          </footer>
        ) : null}
      </div>
    </div>
  );
}
