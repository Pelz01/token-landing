"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { SitePreview } from "../components/site-preview";
import { ProjectRecord } from "../lib/builder-types";
import "./globals.css";

const AUTH_STORAGE_KEY = "baggable-auth";
const THEME_STORAGE_KEY = "baggable-theme";
const PROJECT_STORAGE_KEY = "baggable-current-project-id";
const MODE_STORAGE_KEY = "baggable-mode";

const PLACEHOLDERS = [
  "Paste your contract address and I will build the site around it...",
  "Create a landing page for my Bags project with a strong hero and roadmap...",
  "Make a clean one-page site for my token with a Bags CTA...",
];

const LANDING_STEPS = [
  {
    number: "01",
    title: "Start with what you have",
    body: "Paste a contract address, a Bags link, or just describe the project in plain language.",
  },
  {
    number: "02",
    title: "Choose the visual direction",
    body: "Pick from Neo Brutalism, Minimal, 3D Neon, or Black & White and refine the copy as you go.",
  },
  {
    number: "03",
    title: "Publish when it feels right",
    body: "Keep editing in the builder, then publish the same preview to a live project page.",
  },
];

const LANDING_FEATURES = [
  "Contract-ready page structure",
  "Four distinct template directions",
  "Bags call-to-action built in",
  "Saved drafts and follow-up edits",
  "Preview and publish use the same renderer",
  "Mobile-friendly landing pages by default",
];

const LANDING_TEMPLATES = [
  {
    key: "brutal",
    name: "Neo Brutalism",
    note: "Loud, blocky, impossible to ignore",
  },
  {
    key: "minimal",
    name: "Minimal",
    note: "Soft, calm, product-first",
  },
  {
    key: "neon3d",
    name: "3D Neon",
    note: "Futuristic glow with depth",
  },
  {
    key: "mono",
    name: "Black & White",
    note: "Editorial, sharp, stripped back",
  },
];

const LANDING_PRICING = [
  {
    name: "Builder",
    price: "Start free",
    body: "Create drafts, test prompts, and shape the page before you commit to going live.",
    bullets: ["Generate website drafts", "Try the four styles", "Refine with follow-up prompts"],
  },
  {
    name: "Publish",
    price: "Pay when you launch",
    body: "Use the builder until the page feels ready, then publish the live version from the same preview.",
    bullets: ["Live published page", "Bags-ready CTA and structure", "Shareable public URL"],
  },
  {
    name: "Studio",
    price: "For repeat launches",
    body: "Best for teams or creators shipping more than one project and needing a cleaner workflow.",
    bullets: ["Multiple project drafts", "Faster iteration across launches", "Consistent page quality"],
  },
];

const LANDING_FAQ = [
  {
    question: "Do I need a contract address first?",
    answer: "No. You can start from a plain-language prompt, then add the address and links later.",
  },
  {
    question: "Can I change the style after generation?",
    answer: "Yes. The builder is meant to keep iterating until the page actually feels right.",
  },
  {
    question: "Is the preview the same thing that gets published?",
    answer: "Yes. The live page uses the same renderer as the preview, so you are not designing twice.",
  },
  {
    question: "Is this only for brand new tokens?",
    answer: "No. It is designed for projects that already exist and need a better public-facing site fast.",
  },
];

type Message = {
  role: "assistant" | "user";
  content: string;
};

function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link href="/" className={`logo${inverse ? " logo-inverse" : ""}`}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect width="28" height="28" rx="8" fill="#0A0A0A" />
        <path
          d="M9.2 6.6C9.2 5.94 9.74 5.4 10.4 5.4H14.1C18.72 5.4 21.4 7.5 21.4 11C21.4 13.46 19.92 14.92 17.52 15.46C20.28 15.92 22.1 17.56 22.1 20.52C22.1 24.38 19.14 26.6 14.34 26.6H10.4C9.74 26.6 9.2 26.06 9.2 25.4V6.6Z"
          fill="#00E887"
        />
        <path
          d="M12 9.3H13.24C15.88 9.3 17.34 10.2 17.34 12.16C17.34 14.02 15.86 14.96 13.08 14.96H12V9.3Z"
          fill="#0A0A0A"
        />
        <path
          d="M12 17.38H13.64C16.54 17.38 18.02 18.28 18.02 20.48C18.02 22.56 16.42 23.68 13.52 23.68H12V17.38Z"
          fill="#0A0A0A"
        />
      </svg>
      <span>Baggable</span>
    </Link>
  );
}

async function readJson<T>(response: Response) {
  const data = (await response.json()) as T & { error?: string };

  if (!response.ok) {
    throw new Error(data.error || "Request failed.");
  }

  return data;
}

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [input, setInput] = useState("");
  const [displayText, setDisplayText] = useState("");
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [mode, setMode] = useState<"landing" | "building">("landing");
  const [project, setProject] = useState<ProjectRecord | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const typingRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const loggedIn = window.localStorage.getItem(AUTH_STORAGE_KEY) === "true";
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    const storedProjectId = window.localStorage.getItem(PROJECT_STORAGE_KEY);
    const storedMode = window.localStorage.getItem(MODE_STORAGE_KEY);

    setIsLoggedIn(loggedIn);
    if (storedTheme === "dark" || storedTheme === "light") {
      setTheme(storedTheme);
    }
    setIsReady(true);

    if (loggedIn && storedProjectId && storedMode === "building") {
      void (async () => {
        try {
          const data = await readJson<{ project: ProjectRecord }>(
            await fetch(`/api/projects/${storedProjectId}`, { cache: "no-store" }),
          );
          setProject(data.project);
          setMode("building");
          setMessages([
            {
              role: "assistant",
              content: `Restored your latest draft for ${data.project.draft.projectName}. Continue prompting to refine it.`,
            },
          ]);
        } catch {
          window.localStorage.removeItem(PROJECT_STORAGE_KEY);
          window.localStorage.removeItem(MODE_STORAGE_KEY);
        }
      })();
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  };

  useEffect(() => {
    const target = PLACEHOLDERS[placeholderIdx];
    let charIdx = 0;
    let forward = true;

    const tick = () => {
      if (forward) {
        charIdx += 1;
        setDisplayText(target.slice(0, charIdx));
        if (charIdx === target.length) {
          forward = false;
          typingRef.current = setTimeout(tick, 2200);
        } else {
          typingRef.current = setTimeout(tick, 45);
        }
      } else {
        charIdx -= 1;
        setDisplayText(target.slice(0, charIdx));
        if (charIdx === 0) {
          setPlaceholderIdx((prev) => (prev + 1) % PLACEHOLDERS.length);
        } else {
          typingRef.current = setTimeout(tick, 25);
        }
      }
    };

    typingRef.current = setTimeout(tick, 500);
    return () => {
      if (typingRef.current) clearTimeout(typingRef.current);
    };
  }, [placeholderIdx]);

  useEffect(() => {
    if (!isGenerating) {
      setProcessingStep(0);
      return;
    }

    const interval = window.setInterval(() => {
      setProcessingStep((current) => (current + 1) % 3);
    }, 700);

    return () => window.clearInterval(interval);
  }, [isGenerating]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isGenerating) return;

    if (!isLoggedIn) {
      router.push("/get-started");
      return;
    }

    setMode("building");
    setError(null);
    setIsGenerating(true);
    setInput("");
    setMessages((current) => [...current, { role: "user", content: trimmed }]);

    try {
      const minimumDelay = new Promise((resolve) => window.setTimeout(resolve, 1200));
      const request = readJson<{ project: ProjectRecord; assistantMessage: string }>(
        await fetch("/api/projects/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: trimmed,
            projectId: project?.id,
          }),
        }),
      );

      const [data] = await Promise.all([request, minimumDelay]);
      setProject(data.project);
      setMessages((current) => [
        ...current,
        { role: "assistant", content: data.assistantMessage },
      ]);
      window.localStorage.setItem(PROJECT_STORAGE_KEY, data.project.id);
      window.localStorage.setItem(MODE_STORAGE_KEY, "building");
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : "Unable to build this project.";
      setError(message);
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: `The draft could not be generated yet. ${message}`,
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = async () => {
    if (!project || isPublishing) return;

    setIsPublishing(true);
    setError(null);

    try {
      const data = await readJson<{ project: ProjectRecord }>(
        await fetch(`/api/projects/${project.id}/publish`, {
          method: "POST",
        }),
      );

      setProject(data.project);
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: `Published. Your site is now live at /p/${data.project.slug}.`,
        },
      ]);
    } catch (publishError) {
      const message =
        publishError instanceof Error ? publishError.message : "Unable to publish this project.";
      setError(message);
    } finally {
      setIsPublishing(false);
    }
  };

  if (!isReady) {
    return null;
  }

  if (mode === "building") {
    return (
      <div className={`workspace-page theme-${theme}`}>
        <main className="builder-shell">
          <section className="builder-left">
            <div className="builder-left-top">
              <Logo inverse />
              <button type="button" className="theme-toggle" onClick={toggleTheme}>
                {theme === "light" ? "Dark" : "Light"}
              </button>
            </div>

            <div className="builder-thread">
              {messages.map((message, index) => (
                <div key={`${message.role}-${index}`} className={`message ${message.role}`}>
                  <div className="message-avatar">{message.role === "assistant" ? "B" : "You"}</div>
                  <div className="message-content">{message.content}</div>
                </div>
              ))}

              {isGenerating ? (
                <div className="builder-working-card">
                  <div className="build-status-line">
                    <span className="build-status-dot" />
                    <p>Building your preview</p>
                  </div>
                  <p className="build-status-text">
                    {
                      [
                        "Shaping the first pass of your landing page.",
                        "Writing copy and arranging the page sections.",
                        "Polishing the preview before it appears.",
                      ][processingStep]
                    }
                  </p>
                </div>
              ) : null}

              {error ? <p className="builder-error">{error}</p> : null}
            </div>

            <form className="input-area builder-input" onSubmit={handleSubmit}>
              <button type="button" className="attach-btn" aria-label="Add context">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M10 4V16M4 10H16"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
              <input
                type="text"
                className="chat-input"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Refine the page..."
              />
              <button type="submit" className="send-btn" disabled={!input.trim() || isGenerating}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M3 10L17 10M17 10L11 4M17 10L11 16"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </form>
          </section>

          <section className="builder-right">
            <div className="builder-preview-toolbar">
              <div className="builder-preview-pill">Preview</div>
              <div className="builder-preview-actions">
                {project?.slug ? (
                  <Link href={`/p/${project.slug}`} className="builder-open-link" target="_blank">
                    Open site
                  </Link>
                ) : null}
                <button
                  type="button"
                  className="builder-publish-button"
                  onClick={handlePublish}
                  disabled={!project || isGenerating || isPublishing}
                >
                  {isPublishing ? "Publishing..." : project?.slug ? "Published" : "Publish"}
                </button>
              </div>
            </div>

            <div className="builder-preview-panel">
              {isGenerating ? (
                <div className="preview-processing">
                  <div className="preview-topline preview-topline-light">
                    <div className="preview-badge preview-badge-light">Building live preview</div>
                    <p className="preview-processing-status">
                      {["Mapping layout", "Generating sections", "Finalizing first draft"][processingStep]}
                    </p>
                  </div>

                  <div className="preview-processing-hero">
                    <div className="preview-processing-orb" aria-hidden="true">
                      <span />
                      <span />
                      <span />
                    </div>
                    <div className="skeleton-pill shimmer" />
                    <div className="skeleton-title shimmer" />
                    <div className="skeleton-title skeleton-title-short shimmer" />
                    <div className="skeleton-copy shimmer" />
                    <div className="skeleton-copy skeleton-copy-short shimmer" />
                  </div>

                  <div className="preview-grid">
                    <div className="preview-card preview-card-light preview-card-processing">
                      <div className="skeleton-label shimmer" />
                      <div className="skeleton-copy shimmer" />
                      <div className="skeleton-copy skeleton-copy-short shimmer" />
                    </div>

                    <div className="preview-card preview-card-light preview-card-processing">
                      <div className="skeleton-label shimmer" />
                      <div className="preview-section-list">
                        <span className="skeleton-chip shimmer" />
                        <span className="skeleton-chip shimmer" />
                        <span className="skeleton-chip shimmer" />
                        <span className="skeleton-chip shimmer" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : project ? (
                <SitePreview draft={project.draft} />
              ) : null}
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className={`app app-minimal theme-${theme}`}>
      <header className="landing-header">
        <div className="landing-header-inner">
          <Logo />
          <div className="header-actions">
            <button type="button" className="theme-toggle" onClick={toggleTheme}>
              {theme === "light" ? "Dark" : "Light"}
            </button>
            <Link href="/get-started" className="get-started-btn">
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main className="main main-minimal">
        <section className="minimal-left">
          <div className="hero hero-minimal">
            <h1 className="headline">
              Ship a landing page for your
              <br />
              <span className="headline-accent">Bags project</span> in seconds
            </h1>
            <p className="subheadline">
              Paste your CA or describe your project and we’ll turn it into a clean,
              launch-ready landing page for Bags.
            </p>
          </div>

          <form className="input-area input-area-minimal" onSubmit={handleSubmit}>
            <button type="button" className="attach-btn" aria-label="Add context">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 4V16M4 10H16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <input
              type="text"
              placeholder={
                displayText ||
                (isLoggedIn
                  ? "Paste your CA or describe your project..."
                  : "Sign up to start generating your Bags landing page")
              }
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="chat-input"
            />
            <button type="submit" className="send-btn" disabled={!input.trim()}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M3 10L17 10M17 10L11 4M17 10L11 16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </form>

          <p className="input-helper">
            Try a style in your prompt: <span>neo brutalism</span>, <span>minimal</span>,{" "}
            <span>3D neon</span>, or <span>black &amp; white</span>.
          </p>

          <section className="landing-block">
            <div className="section-heading">
              <span>How it works</span>
              <h2>Made for fast launches, not messy setup.</h2>
            </div>

            <div className="steps-grid">
              {LANDING_STEPS.map((step) => (
                <article key={step.number} className="step-card">
                  <span className="step-number">{step.number}</span>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="landing-block">
            <div className="section-heading">
              <span>Templates</span>
              <h2>Four distinct directions, not four tiny variations.</h2>
            </div>

            <div className="template-grid">
              {LANDING_TEMPLATES.map((template) => (
                <article key={template.key} className="template-card">
                  <div className={`template-preview template-preview-${template.key}`}>
                    <div className="template-preview-bar" />
                    <div className="template-preview-body">
                      <div className="template-preview-kicker">Template</div>
                      <div className="template-preview-title">{template.name}</div>
                      <div className="template-preview-lines">
                        <span />
                        <span />
                        <span />
                      </div>
                    </div>
                  </div>
                  <h3>{template.name}</h3>
                  <p>{template.note}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="landing-block">
            <div className="section-heading">
              <span>What you get</span>
              <h2>A product flow that stays useful after the first prompt.</h2>
            </div>

            <div className="feature-grid">
              {LANDING_FEATURES.map((feature) => (
                <article key={feature} className="feature-card">
                  <span className="feature-dot" />
                  <p>{feature}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="landing-block">
            <div className="section-heading">
              <span>Pricing</span>
              <h2>Simple pricing logic that matches the product.</h2>
            </div>

            <div className="pricing-grid">
              {LANDING_PRICING.map((tier) => (
                <article key={tier.name} className="pricing-card">
                  <div className="pricing-card-top">
                    <span>{tier.name}</span>
                    <strong>{tier.price}</strong>
                  </div>
                  <p>{tier.body}</p>
                  <ul>
                    {tier.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section className="landing-block landing-block-faq">
            <div className="section-heading">
              <span>FAQ</span>
              <h2>The questions people usually ask before they try it.</h2>
            </div>

            <div className="faq-list">
              {LANDING_FAQ.map((item) => (
                <article key={item.question} className="faq-card">
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </article>
              ))}
            </div>
          </section>

          <footer className="landing-footer">
            <div className="landing-footer-brand">
              <Logo />
              <p>
                Build a sharper home for your Bags project with a cleaner preview, better structure,
                and faster publishing.
              </p>
            </div>

            <div className="landing-footer-links">
              <Link href="/get-started">Get started</Link>
              <Link href="/terms">Terms</Link>
              <Link href="/privacy">Privacy</Link>
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
}
