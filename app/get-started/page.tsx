"use client";

import { useState } from "react";
import Link from "next/link";
import "../globals.css";

export default function GetStarted() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    // TODO: wire to auth
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <div className="auth-page">
      <header className="auth-header">
        <div className="auth-header-inner">
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
        </div>
      </header>

      <main className="auth-main">
        <div className="auth-card">
          <h1 className="auth-title">Get started</h1>
          <p className="auth-subtitle">
            Create your token landing page in minutes.
          </p>

          {/* Social auth */}
          <div className="auth-buttons">
            <button className="auth-btn social google">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>

            <button className="auth-btn social github">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Continue with GitHub
            </button>

            <button className="auth-btn social web3 disabled" disabled>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12H3M21 12L14 5M21 12L14 19" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Connect Wallet
              <span className="coming-soon">Coming soon</span>
            </button>
          </div>

          <div className="auth-divider">
            <span>or</span>
          </div>

          {/* Email */}
          <form onSubmit={handleEmailSubmit} className="email-form">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="email-input"
              required
            />
            <button type="submit" className="email-submit" disabled={isLoading || !email}>
              {isLoading ? "..." : "Continue"}
            </button>
          </form>

          <p className="auth-terms">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="inline-link">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="inline-link">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
