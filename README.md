# reprostats.org — Quarto Site

## File structure

```
reprostats/
  _quarto.yml                    ← Site config, nav, theme
  styles.scss                    ← IBM Plex fonts, colours, overrides
  index.qmd                      ← Homepage
  blog.qmd                       ← Blog listing (auto-generated from posts/)
  posts/                         ← Blog posts — one folder per post
    bayesian-priors-clinical-trials/
      index.qmd                  ← Post content
  blog-content/                  ← Source Markdown drafts (not rendered)
    bayesian-priors-clinical-trials.md
    README.md
  .github/
    workflows/
      publish.yml                ← GitHub Actions: render + deploy on push
```

## Local setup (one time)

1. **Install Quarto CLI**: https://quarto.org/docs/get-started/
2. **Install R packages**:
   ```r
   install.packages(c("bayprior", "reproducr", "knitr", "rmarkdown"))
   ```
3. **Preview locally**:
   ```bash
   quarto preview
   ```
   This opens a live preview in your browser. Changes update automatically.

## Writing a new blog post

1. Create a new folder in `posts/`:
   ```
   posts/my-new-post/
     index.qmd
   ```

2. Add YAML frontmatter at the top of `index.qmd`:
   ```yaml
   ---
   title: "Your post title"
   date: "2026-07-15"
   author: "Ndoh Penn"
   description: "One sentence summary shown in the blog listing."
   categories: [Bayesian, reproducr, Regulatory]
   ---
   ```

3. Write the post in Markdown below the frontmatter.
   - Use ` ```{r} ` code chunks for R code
   - Set `#| eval: false` if you don't want the code to execute
   - Set `#| eval: true` and the code runs and output is embedded

4. **Always verify function signatures** before publishing:
   - bayprior: https://ndohpenngit.github.io/bayprior/reference/index.html
   - reproducr: https://github.com/repro-stats/reproducr

5. Push to `main` — GitHub Actions renders and deploys automatically.

## GitHub Pages setup

After the first push with GitHub Actions:

1. Go to your repo → **Settings** → **Pages**
2. Set **Source** to: **Deploy from a branch** → `gh-pages` / `/ (root)`
3. Save

The site will be live at `reprostats.org` once DNS is configured.

## Freeze

Quarto uses `freeze: auto` (set in `_quarto.yml`), which means:
- R code is only re-executed when the source `.qmd` file changes
- Rendered outputs are cached in `_freeze/`
- Commit `_freeze/` to git — this avoids re-running R on every deploy

## Adding R packages

If a new post uses a package not yet in the GitHub Actions workflow,
add it to `.github/workflows/publish.yml` under `packages:`:

```yaml
- name: Install R packages
  uses: r-lib/actions/setup-r-dependencies@v2
  with:
    packages: |
      any::bayprior
      any::reproducr
      any::your-new-package   ← add here
      any::knitr
      any::rmarkdown
```
