# Blog Content — ReproStats

This folder contains source drafts for all blog posts published at reprostats.org/blog.

Each `.md` file is the canonical source for its corresponding HTML file in `/blog/`.
Write and review content here first, then convert to HTML for publishing.

## Workflow

1. Draft post in Markdown here (`blog-content/post-name.md`)
2. Verify all code examples against actual package documentation before publishing
3. Convert to HTML (`blog/post-name.html`) using the shared template
4. Add post card to `blog.html` listing and the blog preview section in `index.html`

## Published posts

| File | Status | Published |
|------|--------|-----------|
| `bayesian-priors-clinical-trials.md` | ✅ Published | 22 Jun 2026 |

## Planned posts

| Title | Status | Target date |
|-------|--------|-------------|
| Getting started with reproducr | Draft pending | Jul 2026 |
| ICH E9(R1) in practice: implementing estimands in R | Draft pending | Jul 2026 |
| 21 CFR Part 11 for R users | Draft pending | Aug 2026 |
| SAS to R migration in regulated environments | Draft pending | Aug 2026 |
| Bayesian adaptive designs: power priors | Draft pending | Sep 2026 |

## Template

Each post HTML file should follow the structure in `blog/bayesian-priors-clinical-trials.html`.
Shared styles and JS are in `style.css` and `main.js` at the root.

## Note on code examples

Always verify function signatures against package documentation before including in a post:
- bayprior: https://ndohpenngit.github.io/bayprior/reference/index.html
- reproducr: https://github.com/repro-stats/reproducr
- Other packages: check CRAN or pkgdown sites
