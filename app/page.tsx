"use client";

import { useState } from "react";
import "./globals.css";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;

    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsGenerating(true);

    // Simulate AI response — wire to Pollinations here
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Got it. Building your token landing page now... This is a demo response — AI generation coming soon.",
        },
      ]);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="24" height="24" rx="6" fill="currentColor" />
            <path
              d="M7 12L10.5 15.5L17 8.5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Baggable</span>
        </div>
        <button className="get-started-btn">Get started</button>
      </header>

      {/* Hero */}
      <main className="main">
        <div className="hero">
          <h1 className="headline">
            Build your token&rsquo;s
            <br />
            landing page
          </h1>
          <p className="subheadline">
            Describe your token in plain English.
            <br />
            Deploy a professional landing page in minutes.
          </p>
        </div>

        {/* Chat area */}
        <div className="chat-area">
          {messages.length === 0 && (
            <div className="chat-placeholder">
              <div className="suggestion-chips">
                <button
                  onClick={() =>
                    setInput(
                      "Create a landing page for a Solana meme coin called PEPE with 1B supply"
                    )
                  }
                >
                  Create a meme coin landing page
                </button>
                <button
                  onClick={() =>
                    setInput(
                      "Build a page for a DeFi protocol on Base called VOLT with 5% fees"
                    )
                  }
                >
                  DeFi protocol page
                </button>
                <button
                  onClick={() =>
                    setInput(
                      "Make a landing page for a gaming token on Arbitrum called SHARD"
                    )
                  }
                >
                  Gaming token page
                </button>
              </div>
            </div>
          )}

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
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
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
            placeholder="Describe your token..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="chat-input"
          />
          <button type="submit" className="send-btn" disabled={!input.trim()}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
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
