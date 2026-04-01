"use client";

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

    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsGenerating(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Got it. Building your Bags landing page now... This is a demo — AI generation coming soon.",
        },
      ]);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="app">
      {/* Header — matches Get Started layout */}
      <header className="auth-header">
        <div className="logo">
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="28" height="28" rx="8" fill="currentColor" />
            <path
              d="M8 14L12.5 18.5L20 10.5"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Baggable</span>
        </div>
        <a href="/get-started" className="get-started-btn">
          Get started
        </a>
      </header>

      {/* Main */}
      <main className="main">
        {/* Hero */}
        <div className="hero">
          <h1 className="headline">
            Ship your Bags token landing page
            <br />
            in seconds
          </h1>
        </div>

        {/* Chat area */}
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

        {/* Input */}
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
            placeholder={displayText}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="chat-input"
          />
          <button
            type="submit"
            className="send-btn"
            disabled={!input.trim() && !displayText}
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
