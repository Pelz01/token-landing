"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import "../globals.css";

type Message = {
  role: "assistant" | "user";
  content: string;
};

type PreviewState = {
  projectName: string;
  symbol: string;
  tagline: string;
  description: string;
  bagsUrl: string;
  contractAddress: string;
  sections: string[];
};

const initialPreview: PreviewState = {
  projectName: "BAGSTORM",
  symbol: "BAG",
  tagline: "A fast-moving Bags-native project built for internet-native communities.",
  description:
    "BAGSTORM turns attention into momentum with a sharp brand, a live community, and a better home for the token than a generic launch page.",
  bagsUrl: "https://bags.fm/",
  contractAddress: "Paste contract address to personalize this section",
  sections: ["Hero", "About", "Tokenomics", "Roadmap", "Community", "Trade on Bags"],
};

function inferPreview(prompt: string): PreviewState {
  const cleaned = prompt.trim();
  const upper = cleaned.toUpperCase();
  const symbolMatch = upper.match(/\$([A-Z0-9]{2,10})\b/) || upper.match(/\b([A-Z]{2,6})\b/);
  const symbol = symbolMatch?.[1] ?? "BAG";

  const nameFromCalled = cleaned.match(/called\s+([A-Za-z0-9-]+)/i)?.[1];
  const nameFromNamed = cleaned.match(/named\s+([A-Za-z0-9-]+)/i)?.[1];
  const projectName = nameFromCalled || nameFromNamed || "Your Project";

  const lower = cleaned.toLowerCase();
  const sections = ["Hero", "About", "Tokenomics", "Roadmap", "Community", "Trade on Bags"];

  if (lower.includes("defi")) {
    sections.splice(2, 0, "How it works");
  }

  if (lower.includes("game") || lower.includes("gaming")) {
    sections.splice(3, 0, "Gameplay loop");
  }

  return {
    projectName,
    symbol,
    tagline: `A Bags-ready website for ${projectName} with a clear story, sharper branding, and stronger conversion.`,
    description: cleaned,
    bagsUrl: "https://bags.fm/",
    contractAddress: "Add contract address and Bags URL to fully personalize the generated site",
    sections,
  };
}

export default function LaunchPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Describe your project and I’ll turn it into a Bags-ready website. You can paste a contract address, tone, token details, or just explain the vibe you want.",
    },
  ]);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [preview, setPreview] = useState<PreviewState>(initialPreview);

  const submitPrompt = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed || isGenerating) return;

    setMessages((current) => [...current, { role: "user", content: trimmed }]);
    setPrompt("");
    setIsGenerating(true);

    window.setTimeout(() => {
      const nextPreview = inferPreview(trimmed);
      setPreview(nextPreview);
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            "I’ve mapped that into a homepage structure with a stronger hero, clearer token narrative, and a Bags CTA. Next, I’d let you refine sections one by one and regenerate the copy.",
        },
      ]);
      setIsGenerating(false);
    }, 900);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitPrompt(prompt);
  };

  return (
    <div className="workspace-page">
      <main className="lovable-shell">
        <section className="lovable-chat">
          <div className="lovable-sidebar-top">
            <Link href="/" className="logo logo-inverse">
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
            <p className="lovable-project-label">Previewing latest workspace version</p>
          </div>

          <div className="lovable-tabs">
            <button type="button" className="lovable-tab">
              Details
            </button>
            <button type="button" className="lovable-tab lovable-tab-active">
              Preview
            </button>
          </div>

          <div className="lovable-chat-head">
            <h1 className="lovable-title">Build with chat.</h1>
          </div>

          <div className="lovable-chat-log">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`message ${message.role}`}>
                <div className="message-avatar">{message.role === "assistant" ? "B" : "You"}</div>
                <div className="message-content">{message.content}</div>
              </div>
            ))}

            {isGenerating ? (
              <div className="message assistant">
                <div className="message-avatar">B</div>
                <div className="message-content generating">
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                </div>
              </div>
            ) : null}
          </div>

          <form className="input-area lovable-input" onSubmit={handleSubmit}>
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
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Describe your Bags project or paste a contract address..."
            />
            <button type="submit" className="send-btn" disabled={!prompt.trim() || isGenerating}>
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

        <section className="lovable-preview">
          <div className="preview-toolbar">
            <div className="preview-toolbar-left">
              <button type="button" className="preview-toolbar-pill preview-toolbar-pill-active">
                Preview
              </button>
              <button type="button" className="preview-toolbar-icon">
                {"</>"}
              </button>
              <button type="button" className="preview-toolbar-icon">
                ...
              </button>
            </div>
            <div className="preview-toolbar-url">/</div>
          </div>

          <div className="preview-browser">
            <div className="preview-browser-bar">
              <span />
            </div>

            <div className="preview-canvas">
              <div className="preview-topline">
                <div className="preview-badge">Bags-ready</div>
                <a href={preview.bagsUrl} target="_blank" rel="noreferrer">
                  View on Bags
                </a>
              </div>

              <div className="preview-hero-block">
                <p className="preview-symbol">{preview.symbol}</p>
                <h2>{preview.projectName}</h2>
                <p className="preview-tagline">{preview.tagline}</p>
                <p className="preview-description">{preview.description}</p>
              </div>

              <div className="preview-grid">
                <div className="preview-card">
                  <span className="panel-label">Contract</span>
                  <p>{preview.contractAddress}</p>
                </div>

                <div className="preview-card">
                  <span className="panel-label">Suggested sections</span>
                  <div className="preview-section-list">
                    {preview.sections.map((section) => (
                      <span key={section}>{section}</span>
                    ))}
                  </div>
                </div>

                <div className="preview-card preview-card-wide">
                  <span className="panel-label">What this page should do</span>
                  <p>
                    Turn the project into something people can understand fast, trust quickly, and
                    click through to trade on Bags without confusion.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
