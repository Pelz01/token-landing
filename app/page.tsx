"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import "./globals.css";

const AUTH_STORAGE_KEY = "baggable-auth";
const THEME_STORAGE_KEY = "baggable-theme";

const PLACEHOLDERS = [
  "Paste your contract address and I will build the site around it...",
  "Create a landing page for my Bags project with a strong hero and roadmap...",
  "Make a clean one-page site for my token with a Bags CTA...",
];

type PreviewState = {
  projectName: string;
  symbol: string;
  tagline: string;
  description: string;
  bagsUrl: string;
  contractAddress: string;
  sections: string[];
};

type Message = {
  role: "assistant" | "user";
  content: string;
};

function inferPreview(prompt: string): PreviewState {
  const cleaned = prompt.trim();
  const upper = cleaned.toUpperCase();
  const symbolMatch = upper.match(/\$([A-Z0-9]{2,10})\b/) || upper.match(/\b([A-Z]{2,6})\b/);
  const symbol = symbolMatch?.[1] ?? "TOKEN";

  const caMatch = cleaned.match(/\b[1-9A-HJ-NP-Za-km-z]{32,44}\b/)?.[0] ?? "";
  const nameFromCalled = cleaned.match(/called\s+([A-Za-z0-9-]+)/i)?.[1];
  const nameFromNamed = cleaned.match(/named\s+([A-Za-z0-9-]+)/i)?.[1];
  const projectName = nameFromCalled || nameFromNamed || "Your Project";

  return {
    projectName,
    symbol,
    tagline: `A clearer, more credible home for ${projectName}.`,
    description: cleaned,
    bagsUrl: "https://bags.fm/",
    contractAddress: caMatch || "Add a contract address to show token-specific details here.",
    sections: ["Hero", "About", "Tokenomics", "Roadmap", "Community", "Trade on Bags"],
  };
}

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

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [input, setInput] = useState("");
  const [displayText, setDisplayText] = useState("");
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [mode, setMode] = useState<"landing" | "building">("landing");
  const [isGenerating, setIsGenerating] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [preview, setPreview] = useState<PreviewState | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const typingRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const loggedIn = window.localStorage.getItem(AUTH_STORAGE_KEY) === "true";
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    setIsLoggedIn(loggedIn);
    if (storedTheme === "dark" || storedTheme === "light") {
      setTheme(storedTheme);
    }
    setIsReady(true);
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
        charIdx++;
        setDisplayText(target.slice(0, charIdx));
        if (charIdx === target.length) {
          forward = false;
          typingRef.current = setTimeout(tick, 2200);
        } else {
          typingRef.current = setTimeout(tick, 45);
        }
      } else {
        charIdx--;
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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isGenerating) return;

    if (!isLoggedIn) {
      router.push("/get-started");
      return;
    }

    setMode("building");
    setIsGenerating(true);
    setProcessingStep(0);
    setInput("");
    setPreview(null);
    setMessages([
      { role: "user", content: trimmed },
      {
        role: "assistant",
        content: "Building your website now. I’m shaping the hero, structure, and Bags-ready sections.",
      },
    ]);

    window.setTimeout(() => {
      setPreview(inferPreview(trimmed));
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: "Your first draft is ready. Keep prompting to refine the copy, structure, or visual direction.",
        },
      ]);
      setIsGenerating(false);
    }, 1500);
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
            </div>

            <div className="builder-preview-panel">
              {isGenerating ? (
                <div className="preview-processing">
                  <div className="preview-topline preview-topline-light">
                    <div className="preview-badge preview-badge-light">Building live preview</div>
                    <p className="preview-processing-status">
                      {
                        [
                          "Mapping layout",
                          "Generating sections",
                          "Finalizing first draft",
                        ][processingStep]
                      }
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
              ) : preview ? (
                <div className="preview-browser preview-browser-light builder-preview-browser">
                  <div className="preview-browser-bar preview-browser-bar-light">
                    <span />
                  </div>

                  <div className="preview-canvas preview-canvas-light">
                    <div className="preview-topline preview-topline-light">
                      <div className="preview-badge preview-badge-light">Bags-ready</div>
                      <a href={preview.bagsUrl} target="_blank" rel="noreferrer">
                        View on Bags
                      </a>
                    </div>

                    <div className="preview-hero-block preview-hero-block-light">
                      <p className="preview-symbol">{preview.symbol}</p>
                      <h2>{preview.projectName}</h2>
                      <p className="preview-tagline">{preview.tagline}</p>
                      <p className="preview-description">{preview.description}</p>
                    </div>

                    <div className="preview-grid">
                      <div className="preview-card preview-card-light">
                        <span className="panel-label">Contract</span>
                        <p>{preview.contractAddress}</p>
                      </div>

                      <div className="preview-card preview-card-light">
                        <span className="panel-label">Suggested sections</span>
                        <div className="preview-section-list">
                          {preview.sections.map((section) => (
                            <span key={section}>{section}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
        </section>
      </main>
    </div>
  );
}
