# Baggable — Architecture & Product Suggestions

> This is a living document. All ideas, discussions, and decisions are recorded here.
> Updated after a docs/research pass on April 1, 2026.
> Treat verified facts, product suggestions, and open assumptions differently.

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

#### Database: Turso (libSQL / SQLite-compatible cloud database)
- Current official pricing shows:
  - Free: 5 GB storage
  - Developer: 9 GB storage
- Good fit for MVP persistence with SQLite-style ergonomics
- Official docs support Next.js and Drizzle integration
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
- Viable option for text and image generation
- We were able to verify public API/docs entry points, but not every product assumption below
- Recommended implementation pattern:
  send the full brief + current file state on every request so generation stays deterministic even if provider behavior changes

#### Smart Context Hierarchy (from Pollinations bot)

Pollinations bot shared this pattern to keep AI grounded without burning tokens:

| Priority | What | Why |
|---|---|---|
| 🔴 Critical | File tree / directory structure | AI needs to know what exists |
| 🔴 Critical | Current active file (full code) | What they're editing right now |
| 🟡 Important | Key imports/dependencies | package.json, main imports |
| 🟡 Important | Last 2-3 turns (raw) | Immediate conversation flow |
| 🟢 Summarized | Older conversation history | Intent/context only |

**Token math example:**

| Approach | Input Tokens | Cost (qwen-coder) |
|---|---|---|
| Full 20-message history | ~4,000 | ~0.00024 pollen |
| Smart hierarchy | ~800 | ~0.00005 pollen |
| Savings | 80% | |

**For Baggable's context injection:**

```javascript
const contextWindow = [
  // 1. File tree (always fresh)
  { role: 'system', content: `Project structure:\n${generateFileTree(files)}` },

  // 2. Active section being edited (full)
  { role: 'system', content: `Editing: ${activeFilePath}\n${files[activeFilePath]}` },

  // 3. Brief (summarized, stored)
  { role: 'system', content: `Brief: ${JSON.stringify(brief)}` },

  // 4. Last 2 exchanges (raw for continuity)
  ...lastTwoMessages,

  // 5. Current user prompt
  { role: 'user', content: userPrompt }
];
```

**Pro tips from Pollinations bot:**
- Refresh file tree every turn (~50 tokens) — prevents hallucinations
- Include errors when preview breaks — AI needs to see what failed
- Use `system` role for code context — weights heavier in attention
- Summarize into "technical spec" not raw chat history when hitting limits:
  - Project purpose, tech stack, key files, design requirements, known issues

---

## Subdomain Architecture

### Goal
```
pepe.baggable.app  →  renders PEPE token page
volt.baggable.app  →  renders VOLT token page
0x1234.baggable.app →  looks up by CA
```

### Solution Option: Vercel wildcard domains, with Cloudflare if needed

**Verified:**
- Vercel supports wildcard domains
- Wildcard SSL requires using Vercel nameservers
- Cloudflare is optional, not mandatory

**Use Cloudflare if you want:**
- extra DNS/routing control
- Worker-based redirects or rewrites
- a custom subdomain routing layer outside Vercel

1. Add `baggable.app` to Vercel
2. Choose one of:
   - native Vercel wildcard domain setup
   - Cloudflare-managed wildcard DNS pointing to Vercel
3. If using Cloudflare Workers, rewrite subdomain to path:
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
- Brief = the memory. This is a strong implementation approach even if the AI provider changes.
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
- Logo: green B-style mark in black rounded square + "Baggable" text
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
- [ ] Validate Pollinations output quality and reliability before locking it in as the default provider

---

## Verified Facts

| Topic | Verified status |
|---|---|
| Turso pricing | Free is 5 GB, Developer is 9 GB |
| Turso for Next.js | Official Next.js integration docs exist |
| Turso with Drizzle | Official Drizzle docs exist |
| Vercel wildcard domains | Supported |
| Wildcard SSL on Vercel | Requires Vercel nameservers |
| Cloudflare Workers redirects | Supported |

## Product Suggestions

| Suggestion | Notes |
|---|---|
| Use Turso for MVP | Strong fit for low-ops persistence |
| Use per-deployment pricing | Likely better than subscriptions for meme-coin creators |
| Offer subdomain + GitHub + ZIP | Good deployment surface area for launch tools |
| Keep chat-first UI | Fits the Lovable-style workflow |

## Needs Validation

| Assumption | Why it still needs checking |
|---|---|
| Pollinations should be the default AI provider | Need to test quality, latency, uptime, and prompt control |
| Cloudflare Worker routing is the best production subdomain setup | Native Vercel wildcard support may be enough |
| Deployment pricing should be $5–$10 | This is a product bet, not a verified market fact |

## Decisions Made

| Decision | Choice |
|---|---|
| AI provider | Not finalized |
| Database | Turso is the leading option |
| Subdomain handling | Not finalized |
| Deployment options | Subdomain + GitHub + Download |
| Pricing | Lean toward per-deployment |
| Branding | Green #00E887 accent, Solana focus |

---

*Last updated: April 1, 2026*
