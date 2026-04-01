import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="legal-page">
      <div className="legal-shell">
        <Link href="/" className="legal-back">
          Back to home
        </Link>

        <div className="legal-eyebrow">Terms of Service</div>
        <h1 className="legal-title">Terms built for a product that helps people launch fast.</h1>
        <p className="legal-intro">
          These Terms of Service govern your use of Baggable. We wrote them to
          be clear, fair, and readable. By using the product, you agree to these
          terms.
        </p>

        <section className="legal-section">
          <h2>Using Baggable</h2>
          <p>
            Baggable helps users create landing pages and related launch assets
            for Bags projects and other crypto products. You may use the product
            only in a lawful way and only for content you have the right to use.
          </p>
        </section>

        <section className="legal-section">
          <h2>Your account</h2>
          <p>
            You are responsible for the activity under your account and for
            keeping your login details secure. If you think someone accessed your
            account without permission, contact us as soon as possible.
          </p>
        </section>

        <section className="legal-section">
          <h2>Your content</h2>
          <p>
            You keep ownership of the prompts, copy, images, logos, and other
            materials you submit to Baggable. You give us permission to process
            that content as needed to operate, improve, and support the product.
          </p>
        </section>

        <section className="legal-section">
          <h2>Generated output</h2>
          <p>
            You may use the websites, copy, and other outputs generated for you,
            subject to any third-party rights that may apply. Because AI tools
            can be imperfect, you are responsible for reviewing outputs before
            publishing or using them publicly.
          </p>
        </section>

        <section className="legal-section">
          <h2>Things you should not do</h2>
          <p>
            Please do not use Baggable to create illegal, fraudulent, deceptive,
            infringing, or harmful content. That includes impersonation, scams,
            malware, market manipulation, or anything that violates applicable
            law or platform rules.
          </p>
        </section>

        <section className="legal-section">
          <h2>Availability</h2>
          <p>
            We are building this product quickly, which means features may
            change, improve, pause, or disappear from time to time. We do our
            best to keep things running, but we cannot promise uninterrupted
            service.
          </p>
        </section>

        <section className="legal-section">
          <h2>No legal or financial advice</h2>
          <p>
            Baggable is a software tool. It does not provide legal, tax,
            compliance, investment, or financial advice. If you are launching a
            token or project, please do your own diligence and speak with the
            right professionals where needed.
          </p>
        </section>

        <section className="legal-section">
          <h2>Liability</h2>
          <p>
            To the fullest extent allowed by law, Baggable is provided “as is.”
            We are not liable for indirect, incidental, special, consequential,
            or punitive damages, or for losses related to your use of the
            product, generated content, or third-party platforms.
          </p>
        </section>

        <section className="legal-section">
          <h2>Updates to these terms</h2>
          <p>
            We may update these terms as the product evolves. If we make a
            meaningful change, we will update this page and revise the effective
            date below.
          </p>
        </section>

        <p className="legal-meta">Effective date: April 1, 2026</p>
      </div>
    </main>
  );
}
