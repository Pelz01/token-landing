"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import "./globals.css";

const PLACEHOLDERS = [
  "Create a landing page for my Solana meme coin...",
  "I want a landing page for my token, the CA is 0x...",
  "Make a gaming token page on Solana...",
  "Design a page for my NFT collection on Solana...",
  "Build a page for my DeFi protocol on Solana...",
];

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const typingRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Typewriter effect
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;

    setIsGenerating(true);
    router.push("/get-started");
  };

  return (
    <div className="app">
      <header className="landing-header">
        <div className="landing-header-inner">
          <Link href="/" className="logo">
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
          <Link href="/get-started" className="get-started-btn">
            Get started
          </Link>
        </div>
      </header>

      <main className="main">
        <div className="hero">
          <h1 className="headline">
            Ship a landing page for your
            <br />
            <span className="headline-accent">Bags project</span> in seconds
          </h1>
          <p className="subheadline">
            Describe your token or project in one prompt and turn it into a
            clean, launch-ready landing page for Bags.
          </p>
        </div>

        <div className="chat-area">
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.role}`}>
              <div className="message-avatar">
                {msg.role === "assistant" ? "B" : "You"}
              </div>
              <div className="message-content">{msg.content}</div>
            </div>
          ))}

          {isGenerating && (
            <div className="message assistant">
              <div className="message-avatar">B</div>
              <div className="message-content generating">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </div>
            </div>
          )}
        </div>

        <form className="input-area" onSubmit={handleSubmit}>
          <button type="button" className="attach-btn">
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
              displayText || "Sign up to start generating your Bags landing page"
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="chat-input"
          />
          <button
            type="submit"
            className="send-btn"
            disabled={!input.trim() || isGenerating}
          >
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
      </main>
    </div>
  );
}
