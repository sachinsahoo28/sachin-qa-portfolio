# Sachin Sahoo QA: QA Engineer portfolio

A static React + Vite portfolio for Sachin Sahoo, QA Engineer. Plain CSS, no UI framework, no analytics, no backend.
Dependencies: `react`, `react-dom`, `lucide-react` (icons) and three self-hosted font packages from `@fontsource`.

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build + pre-rendered HTML + sitemap.xml + robots.txt
npm run preview    # serve dist/ locally
npm run validate   # SEO and content checks against dist/ (run after build)
npm test           # unit checks for the QA Bug Hunter data and scoring
```

Requires Node 20.19 or newer (developed on Node 22).

## Add your real details

Copy `.env.example` to `.env` and fill it in. Anything left empty is simply not shown (no dead or fake links).

| Variable | What it does |
| --- | --- |
| `VITE_SITE_URL` | Production URL, no trailing slash. Drives canonical, Open Graph URL and image, JSON-LD, `sitemap.xml`, `robots.txt`. |
| `VITE_BASE_PATH` | Only for sub-path hosting such as `https://user.github.io/portfolio/` (set `/portfolio/`). |
| `VITE_CONTACT_EMAIL` | Email shown in Contact and used by the "Email me" mailto link. |
| `VITE_CONTACT_PHONE` | Phone shown in Contact as a tap-to-call `tel:` link, e.g. `+91 98765 43210`. Empty shows the `YOUR_PHONE_NUMBER` placeholder. |
| `VITE_GITHUB_URL` | GitHub profile link (hero, contact, footer, JSON-LD `sameAs`). |
| `VITE_LINKEDIN_URL` | LinkedIn profile link (same places). |
| `VITE_RESUME_URL` | File name of a real PDF in `public/`, e.g. `Sachin-Sahoo-QA-Resume.pdf`. The Download Resume button appears only when set. |

If `VITE_SITE_URL` is empty the build still succeeds, but it deliberately omits the canonical URL, `og:url`, `og:image`,
the sitemap and the sitemap line in robots.txt, rather than publishing a wrong domain. Set it before going live.

### Checklist before publishing

1. Set the variables above (including `VITE_CONTACT_PHONE`), then `npm run build && npm run validate`.
2. Review `src/data/projects.js`. The `tools` listed per project (Postman, Browser Developer Tools) are inferred from each
   testing scope. Edit them to match what you actually used. `dravya-ro` has no tools listed because none were supplied.
3. Review the About copy in `src/components/About.jsx` and the hero copy in `src/components/Hero.jsx`.
4. Portrait: the hero uses `public/profile-320` and `profile-640` (WebP and JPEG, 4:5 crops of your photo). To swap it, replace those four files at the same sizes. To hide it, set `profilePhoto = null` in `src/data/site.js`; the test-run panel then takes its place in the hero. Update the `alt` text if you change the photo.
5. Replace `public/og-image.png` (1200x630) if you want a different share image.
6. Confirm you are allowed to name each project publicly. The cards say "project experience" and show no client details.

## Project structure

```
index.html              theme bootstrap + <!--seo-head--> and <!--app-html--> markers
vite.config.js          React plugin + SEO head injection (dev and build)
scripts/prerender.mjs   renders the app to static HTML, writes sitemap.xml and robots.txt
scripts/validate.mjs    post-build SEO/content checks
public/                 favicon.svg, og-image.png, profile-320/640 .webp/.jpg (put your resume PDF here)
src/
  main.jsx              hydrates the pre-rendered HTML (or renders fresh in dev)
  entry-server.jsx      build-time render entry
  seo.js                title, description, JSON-LD, sitemap and robots generators
  hooks.js              theme + active-section hooks
  data/                 site config, projects, skills, approach, expertise (all copy lives here)
  data/game/            QA Bug Hunter question banks: findBug.js, apiDetective.js, testCases.js
  components/           Header, Hero, TestRunPanel, About, Skills, Projects, ProjectCard,
                        Approach, Expertise, QaGame, Contact, Footer, BrandIcons
  components/game/      GameSetup, GameRound, ChoiceQuestion, CaseQuestion, GameResults, AppWindow,
                        ApiViewer, BugNote, StatusBadge, gameLogic.js (pure scoring and round logic)
  styles/global.css     tokens, light/dark themes, layout, motion
```

## QA Bug Hunter game

A dedicated section (nav link "QA Game") with three modes: Find the Bug (12 scenarios), API Detective (12) and Test Case Challenge (5).
Each has Beginner, Intermediate and Advanced questions, randomised order and answer positions, an optional countdown (off by default),
a score, progress bar, per-answer explanations and a final score with accuracy. Everything is fictional and runs in the browser.
No network requests are made, nothing is stored, and no external game library is used.

- Scoring: 10, 15 or 20 points per correct answer by level. A test-case challenge is worth double, scaled by how valuable the chosen cases are.
  Wrong answers never lose points. Each question can be scored only once per round.
- Edit or add scenarios in `src/data/game/`. Each multiple-choice question needs four options with exactly one `correct: true`.
  Keep option lengths similar; `npm test` fails if the correct answer is usually the longest.
- Accessibility: answers are native buttons, test cases are native checkboxes, focus moves to the feedback after answering,
  status always has an icon and text, and animations stop under `prefers-reduced-motion`.

## Rendering strategy and trade-offs

A plain Vite SPA ships an empty `<div id="root">`, and Google then has to run JavaScript to see your content. To avoid
depending on that, `npm run build` pre-renders the page: it builds the app twice (client and server entry) and writes the
rendered HTML into `dist/index.html`. The browser then hydrates it.

| Option | Pros | Cons |
| --- | --- | --- |
| Build-time pre-render (used here) | No extra dependencies or server. Full content in page source. Works on any static host. | Content only changes on rebuild. Single page only. |
| Client-only SPA | Simplest | Weakest for crawlers and link previews |
| Next.js / Astro | Best if you later add many pages or a blog | Bigger migration and more tooling than one landing page needs |

Project details open in native `<dialog>` elements that are present in the HTML, so they are in the page source too.

## Accessibility notes

Skip link, semantic landmarks and one `h1`, visible focus rings, keyboard-operable menu (Escape closes it), native `<dialog>`
for project details (focus trapping, Escape, focus return), `prefers-reduced-motion` disables all animation, and the colour
pairs in both themes were checked at 6.5:1 or better for text. The hero "test run" is labelled as an illustration.
Run Lighthouse and a screen reader pass on your deployed site, because scores depend on hosting and are not claimed here.

## Deploy

All three hosts serve the `dist/` folder.

**Vercel**: import the repo. Framework preset "Vite", build command `npm run build`, output `dist`. Add the `VITE_*` variables in Project Settings > Environment Variables.

**Netlify**: build command `npm run build`, publish directory `dist`, add the `VITE_*` variables in Site configuration > Environment variables.

**GitHub Pages**: push to GitHub, set Settings > Pages > Source to "GitHub Actions", and add the `VITE_*` values under Settings > Secrets and variables > Actions > Variables. `.github/workflows/deploy.yml` builds, validates and deploys. For a project site (`user.github.io/repo/`) set `VITE_BASE_PATH=/repo/` and `VITE_SITE_URL=https://user.github.io/repo`.

**Custom domain**: add the domain in the host's dashboard, create the DNS records the host shows (CNAME for a subdomain, A/ALIAS records for an apex domain), wait for HTTPS to be issued, then set `VITE_SITE_URL` to the final `https://` address and redeploy so canonical, sitemap and JSON-LD all match.

## Google Search Console

1. Go to search.google.com/search-console and add your site. A Domain property (DNS TXT record) covers all variants. A URL-prefix property also works.
2. Verify ownership via the DNS TXT record, or for URL-prefix by uploading the HTML file Google gives you into `public/` and redeploying.
3. Open Sitemaps and submit `sitemap.xml`.
4. Use URL Inspection on your home page, check "Page indexing", and use "Request indexing" if it is not indexed yet.
5. After a few days, use Performance to see queries, clicks, impressions and average position. Check Page indexing for problems.

No ranking is promised. Where you appear depends on competition for the terms, whether Google indexes the page, content quality
and relevance, links from other sites (authority), and time. Links from your LinkedIn, GitHub profile and any
articles you write help more than metadata alone.

## SEO and security summary

Title, description, robots, canonical, Open Graph, Twitter card, theme colour and favicon are generated from `src/seo.js`.
JSON-LD contains `Person` and `WebSite` only, with no reviews, ratings, employers or credentials. External links use
`rel="noopener noreferrer"`. Link and email values from `.env` are validated (only `http(s)` URLs). No secrets, no cookies,
no analytics, no contact form (Contact uses a `mailto:` link). The only browser storage is the theme choice in `localStorage`.
If you add analytics later, document it and add a privacy notice.
