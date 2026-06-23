/* ═══════════════════════════════════════════════
   ReproStats — Shared JavaScript
   reprostats.org
   ═══════════════════════════════════════════════ */

(function () {
  'use strict';

  const HTML = document.documentElement;

  /* Live CRAN versions — updated by fetchVersion(), read by runTerminal() */
  const CRAN_VERSIONS = {
    reproducr: '0.2.1',    // fallback
    bayprior:  '0.2.12',   // fallback
  };
  const THEME_KEY = 'reprostats-theme';

  /* Apply theme before paint */
  const saved = localStorage.getItem(THEME_KEY) || 'light';
  HTML.setAttribute('data-theme', saved);

  document.addEventListener('DOMContentLoaded', () => {

    /* Theme toggle */
    const toggleBtn = document.querySelector('.theme-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const next = HTML.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        HTML.setAttribute('data-theme', next);
        localStorage.setItem(THEME_KEY, next);
      });
    }

    /* Mobile nav */
    const burger = document.querySelector('.nav-burger');
    const drawer = document.querySelector('.nav-drawer');
    if (burger && drawer) {
      burger.addEventListener('click', () => {
        const open = drawer.classList.toggle('open');
        burger.classList.toggle('open', open);
        burger.setAttribute('aria-expanded', String(open));
      });
      drawer.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          drawer.classList.remove('open');
          burger.classList.remove('open');
          burger.setAttribute('aria-expanded', 'false');
        });
      });
    }

    /* Scroll reveal */
    const revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length && 'IntersectionObserver' in window) {
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
      revealEls.forEach(el => obs.observe(el));
    } else {
      revealEls.forEach(el => el.classList.add('in'));
    }

    /* Terminal typewriter */
    const termBody = document.getElementById('term-body');
    if (termBody) runTerminal(termBody);

  });

  function runTerminal(body) {
    const lines = [
      { type: 'cmd', text: 'library(<fn>reproducr</fn>)' },
      { type: 'out', text: `✓ reproducr ${CRAN_VERSIONS.reproducr} loaded` },
      { type: 'blank' },
      { type: 'cmd', text: 'report <- <fn>audit_script</fn>(<str>"analysis.R"</str>)' },
      { type: 'out', text: '  Files scanned:   1' },
      { type: 'out', text: '  Calls detected:  23' },
      { type: 'blank' },
      { type: 'cmd', text: 'risks <- <fn>risk_score</fn>(report)' },
      { type: 'out', text: '  HIGH: 0  MEDIUM: 1  LOW: 2' },
      { type: 'blank' },
      { type: 'cmd', text: '<fn>certify</fn>(outputs=list(coefs=coef(model)), tag=<str>"v1"</str>)' },
      { type: 'ok',  text: '✓ certified 3 output(s) under tag \'v1\'' },
      { type: 'blank' },
      { type: 'cmd', text: '<fn>check_drift</fn>(outputs=list(coefs=coef(model)), against=<str>"v1"</str>)' },
      { type: 'ok',  text: '  Verdict: ALL OUTPUTS MATCH' },
    ];

    let li = 0, ci = 0, el = null;

    function stripTags(h) { return h.replace(/<[^>]+>/g, ''); }

    function buildVisible(html, n) {
      let vis = '', count = 0, i = 0;
      while (i < html.length && count < n) {
        if (html[i] === '<') {
          const end = html.indexOf('>', i);
          if (end === -1) {
            // No closing > — treat < as a literal character (e.g. <- in R)
            vis += html[i]; count++; i++;
          } else {
            vis += html.slice(i, end + 1); i = end + 1;
          }
        } else { vis += html[i]; count++; i++; }
      }
      return vis;
    }

    function addRow(line) {
      const row = document.createElement('div');
      row.className = 't-line';
      if (line.type === 'blank') { body.appendChild(row); return null; }
      if (line.type === 'cmd')  row.innerHTML = `<span class="t-prompt">&gt;</span><span class="t-cmd"></span>`;
      if (line.type === 'out')  row.innerHTML = `<span class="t-out"></span>`;
      if (line.type === 'ok')   row.innerHTML = `<span class="t-ok"></span>`;
      body.appendChild(row);
      return row.querySelector('.t-cmd,.t-out,.t-ok');
    }

    function render(html, n) {
      return buildVisible(html, n)
        .replace(/<fn>/g, '<span class="t-fn">').replace(/<\/fn>/g, '</span>')
        .replace(/<str>/g, '<span class="t-str">').replace(/<\/str>/g, '</span>');
    }

    function tick() {
      if (li >= lines.length) return;
      const line = lines[li];
      if (!el) {
        el = addRow(line); ci = 0;
        if (!el) { li++; setTimeout(tick, 80); return; }
      }
      const raw = stripTags(line.text);
      if (ci <= raw.length) {
        el.innerHTML = render(line.text, ci);
        ci++;
        setTimeout(tick, ci <= raw.length ? 36 : 20);
      } else {
        li++; el = null;
        setTimeout(tick, line.type === 'cmd' ? 220 : 55);
      }
    }

    setTimeout(tick, 700);
  }

})();

/* ─── AUTO-UPDATE CRAN VERSIONS ───────────────────────────────
   Fetches latest versions from CRAN JSON API on page load.
   Hardcoded fallback values stay visible until fetch resolves.
   Fails silently if CRAN is unreachable.
   ─────────────────────────────────────────────────────────── */
(function () {
  const PACKAGES = ['reproducr', 'bayprior'];

  async function fetchVersion(pkg) {
    try {
      const res = await fetch(`https://cran.r-project.org/package=${pkg}/json`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.Version || null;
    } catch {
      return null;
    }
  }

  async function updateVersions() {
    for (const pkg of PACKAGES) {
      const version = await fetchVersion(pkg);
      if (!version) continue;

      // Store in global so terminal can use it
      CRAN_VERSIONS[pkg] = version;

      // Update all elements tagged with data-cran-version
      document.querySelectorAll(`[data-cran-version="${pkg}"]`)
        .forEach(el => { el.textContent = version; });

      // Update terminal output lines if already rendered
      document.querySelectorAll('.t-out').forEach(el => {
        if (el.textContent.includes(pkg) && el.textContent.includes('loaded')) {
          el.textContent = `✓ ${pkg} ${version} loaded`;
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateVersions);
  } else {
    updateVersions();
  }
})();