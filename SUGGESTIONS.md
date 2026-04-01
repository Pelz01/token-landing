# Baggable — Architecture & Product Suggestions

> This is a living document. All ideas, discussions, and decisions are recorded here. Treat as suggestions, not implementation mandates.

---

## Product Concept

**What it does:**
AI-powered landing page generator for Solana tokens. Paste a contract address or describe your token. Get a professional landing page. Push to GitHub or host on a subdomain.

**Core workflow:**
1. User pastes CA or describes their token
2. AI generates full landing page
3. User edits any section
4. Deploy to subdomain or push to GitHub

---

## Tech Stack

### Current (Next.js frontend)
- Next.js 16 + React 19
- TypeScript
- Tailwind CSS (or plain CSS)
- Geist Sans font

### Suggested Backend Additions

#### Database: Turso (SQLite on edge)
- Free tier: 9GB storage
- Global edge replicas, fast reads
- Schema suggestion:

```sql
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  ca TEXT NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  brief TEXT NOT NULL,       -- JSON blob
  files TEXT NOT NULL,       -- JSON: {hero, tokenomics, roadmap}
  subdomain TEXT UNIQUE,       -- e.g. "pepe"
  github_repo TEXT,           -- owner's GitHub repo URL
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

CREATE INDEX idx_ca ON projects(ca);
CREATE INDEX idx_subdomain ON projects(subdomain);
```

#### AI: Pollinations
- Stateless — no memory between calls
- Solution: send full brief + current file state with every request
- Supports text (qwen-coder) and images (flux)

```javascript
// Every request includes all context
{
  messages: [{
    role: "system",
    content: `You are a landing page copywriter for Solana tokens.
Token: ${brief.name}
CA: ${brief.ca}
Tone: ${brief.tone}
Current section: ${currentHTML}
Generate an improved version.`
  }]
}
```

---

## Subdomain Architecture

### Goal
```
pepe.baggable.app  →  renders PEPE token page
volt.baggable.app  →  renders VOLT token page
0x1234.baggable.app →  looks up by CA
```

### Solution: Cloudflare + Vercel

**Problem:** Vercel free tier has subdomain limits.

**Fix:** Cloudflare handles subdomains (free, unlimited).

1. Add `baggable.app` to Vercel
2. Point `*.baggable.app` CNAME to Vercel via Cloudflare
3. Cloudflare Worker rewrites subdomain to path:
```
pepe.baggable.app → baggable.app/view/pepe
```

**Worker (simple redirect):**
```javascript
addEventListener('fetch', event => {
  const url = new URL(event.request.url)
  const subdomain = url.hostname.split('.')[0]
  if (subdomain !== 'www' && subdomain !== 'app') {
    url.pathname = `/view/${subdomain}`
    return event.respondWith(Response.redirect(url.toString(), 301))
  }
  return fetch(event.request)
})
```

---

## Pricing Suggestions

### Target Audience
- Meme coin creators (low budget, fast turnaround)
- DeFi protocols (more budget, need credibility)
- Gaming/NFT projects

### Suggested Models

**Option 1: Per-deployment (recommended)**
- $5–$10 per live landing page
- Simple, no subscription commitment
- Works well for one-off meme coins

**Option 2: Subscription**
- $9/month — 5 deployments
- $19/month — unlimited deployments
- Good for power users launching multiple tokens

**Option 3: Freemium**
- Free: 1 deployment, basic
- Paid: $5/deployment or $9/month unlimited
- Captures both audiences

**Option 4: Gas + small fee**
- Cover near-zero Solana cost
- Add $1–$2 service fee
- Frictionless, feels almost free

**Avoid:**
- Monthly subscriptions feel heavy for meme coin creators
- High prices kill impulse buys
- Complex token-based systems add friction

### Recommended
- Low entry point ($5–$10)
- Instant value (see page live before paying)
- Premium: custom domain, analytics, no watermark

---

## Deployment Options

| Option | What user gets | Effort |
|---|---|---|
| **Subdomain** | `pepe.baggable.app` | Zero — instant |
| **GitHub** | Private/public repo | One-click OAuth |
| **Download** | ZIP of all files | Free, always |

### GitHub Integration
1. User clicks "Push to GitHub"
2. OAuth → Baggable gets access to their repos
3. Baggable creates repo: `baggable-{slug}`
4. Pushes all generated files
5. User gets repo URL instantly

```javascript
// Create repo under user's account
await fetch('https://api.github.com/user/repos', {
  method: 'POST',
  headers: { Authorization: `token ${user_token}` },
  body: JSON.stringify({ name: `baggable-${slug}`, private: false })
})

// Push files
await fetch(`https://api.github.com/repos/${username}/baggable-${slug}/contents/${file}`, {
  method: 'PUT',
  headers: { Authorization: `token ${user_token}` },
  body: JSON.stringify({ message: 'Deploy from Baggable', content: base64 })
})
```

---

## Data Storage Strategy

### What to store
```javascript
// In Turso DB + localStorage
{
  projectId: "abc123",
  tokenName: "PEPE",
  ca: "0x123...",
  supply: "1B",
  tone: "cult",
  files: {
    hero: "<html>...",
    tokenomics: "<html>...",
    roadmap: "<html>..."
  },
  subdomain: "pepe",
  created_at: timestamp,
  updated_at: timestamp
}
```

### Why this works
- Brief = the memory. No complex AI memory needed.
- AI gets full context in every request
- localStorage for client-side, Turso for persistence
- User's data = their project, not chat history

---

## UI/UX Notes

### Current state
- Lovable-style chat-first UI
- White background, green (#00E887) accent
- "Baggable" logo top left
- "Get started" button top right
- Typewriter placeholder cycling through Solana-specific prompts

### Screens
1. **Homepage** — headline + chat input + typewriter suggestions
2. **Get Started** — email, Google, GitHub, Connect Wallet (coming soon)
3. **Privacy Policy** — added ✅
4. **Terms of Service** — added ✅

### Branding
- Logo: checkmark in black square + "Baggable" text
- Green accent: #00E887
- Fonts: Geist Sans (fallback: Inter)
- Solana-only focus

### Reference
- Lovable.dev — chat-first landing page UI

---

## Open Questions / TODOs

- [ ] Wire Pollinations AI to chat input (currently demo response)
- [ ] Set up Turso database + schema
- [ ] Set up Cloudflare Worker for subdomain routing
- [ ] Add GitHub OAuth flow to Get Started page
- [ ] Add GitHub repo creation + push API routes
- [ ] Design "view project" page (`/view/[slug]`)
- [ ] Add pricing page or flow
- [ ] Add deploy confirmation / success screen
- [ ] Favicon — currently a checkmark icon (pending final brand review)

---

## Decisions Made

| Decision | Choice |
|---|---|
| AI provider | Pollinations (free, stateless) |
| Database | Turso (SQLite edge) |
| Subdomain handling | Cloudflare Worker redirect |
| Deployment options | Subdomain + GitHub + Download |
| Pricing | Per-deployment (not subscription) |
| Branding | Green #00E887 accent, Solana focus |

---

*Last updated: April 1, 2026*
