import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <div className="legal-shell">
        <Link href="/" className="legal-back">
          Back to home
        </Link>

        <div className="legal-eyebrow">Privacy Policy</div>
        <h1 className="legal-title">A straightforward explanation of what we collect and why.</h1>
        <p className="legal-intro">
          This Privacy Policy explains how Baggable collects, uses, and handles
          information when you use the product.
        </p>

        <section className="legal-section">
          <h2>What we collect</h2>
          <p>
            We may collect information such as your name, email address, login
            details, project prompts, generated content, usage activity, and
            technical data like browser type, device information, and IP address.
          </p>
        </section>

        <section className="legal-section">
          <h2>How we use it</h2>
          <p>
            We use this information to operate the product, create outputs for
            you, improve reliability and quality, prevent abuse, communicate with
            you, and understand how the product is being used.
          </p>
        </section>

        <section className="legal-section">
          <h2>Generated project data</h2>
          <p>
            If you enter project descriptions, token details, links, or other
            launch materials, we process that data to generate pages and related
            assets. Please avoid submitting highly sensitive information unless
            it is necessary.
          </p>
        </section>

        <section className="legal-section">
          <h2>Third-party services</h2>
          <p>
            We may use third-party providers for hosting, analytics,
            authentication, AI generation, and communication tools. Those
            providers may process data on our behalf under their own terms and
            privacy practices.
          </p>
        </section>

        <section className="legal-section">
          <h2>Cookies and similar technologies</h2>
          <p>
            We may use cookies or similar technologies to keep you signed in,
            remember preferences, measure traffic, and improve the experience.
          </p>
        </section>

        <section className="legal-section">
          <h2>How long we keep data</h2>
          <p>
            We keep information for as long as it is reasonably needed to
            provide the product, comply with legal obligations, resolve disputes,
            and protect the service.
          </p>
        </section>

        <section className="legal-section">
          <h2>Your choices</h2>
          <p>
            You can generally request access, correction, or deletion of your
            account information, subject to legal or operational limits. You can
            also choose not to provide certain information, though some features
            may not work properly.
          </p>
        </section>

        <section className="legal-section">
          <h2>Security</h2>
          <p>
            We take reasonable steps to protect your data, but no system is
            perfectly secure. Please use a strong password and be thoughtful
            about what you share.
          </p>
        </section>

        <section className="legal-section">
          <h2>Policy updates</h2>
          <p>
            We may update this Privacy Policy over time. When we do, we will post
            the updated version here and revise the effective date.
          </p>
        </section>

        <p className="legal-meta">Effective date: April 1, 2026</p>
      </div>
    </main>
  );
}
