/* MLStation home page: live gradient-descent lab, article counts, recency labels */
(function () {
  const css = v => getComputedStyle(document.querySelector(".ms-home") || document.body).getPropertyValue(v).trim();

  /* ---------- simulated data ---------- */
  let s = 7;
  const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const xs = [], ys = [];
  for (let i = 0; i < 40; i++) {
    const x = rnd() * 4 - 2;
    const g = Math.sqrt(-2 * Math.log(rnd() + 1e-9)) * Math.cos(6.283 * rnd());
    xs.push(x); ys.push(1.6 * x + 0.8 + g * 0.55);
  }

  /* ---------- live lab ---------- */
  const root = document.querySelector("[data-mh-lab]");
  if (root) {
    root.innerHTML =
      '<div class="mh-out-top"><button type="button" class="mh-btn mh-btn-primary mh-sm" data-run>▶ Train</button>' +
      '<button type="button" class="mh-btn mh-btn-ghost mh-sm" data-reset>Reset</button>' +
      '<label>Learning rate η <input type="range" min="0.005" max="0.5" step="0.005" value="0.05" data-lr><b data-lrv>0.05</b></label></div>' +
      '<div class="mh-plots"><canvas data-fit height="170"></canvas><canvas data-loss height="170"></canvas></div>' +
      '<div class="mh-readout"><span>epoch <b data-ep>0</b></span><span>loss <b data-ls>–</b></span><span>w <b data-w>0.00</b></span><span>b <b data-b>0.00</b></span></div>' +
      '<p class="mh-hint">Try η = 0.45 to watch it overshoot, or η = 0.01 to see slow learning.</p>';
    const q = sel => root.querySelector(sel);
    const fit = q("[data-fit]"), loss = q("[data-loss]");
    let w = 0, b = 0, ep = 0, hist = [], timer = null, lr = 0.05;
    const L = () => xs.reduce((a, x, i) => a + ((w * x + b) - ys[i]) ** 2, 0) / xs.length;
    const size = c => {
      const r = c.getBoundingClientRect(), d = window.devicePixelRatio || 1, h = +c.getAttribute("height");
      c.width = Math.max(1, r.width * d); c.height = h * d; c.style.height = h + "px";
      const g = c.getContext("2d"); g.setTransform(d, 0, 0, d, 0, 0); return [g, r.width, h];
    };
    function draw() {
      let [g, W, H] = size(fit);
      const p = 14, X = x => p + (x + 2.2) / 4.4 * (W - 2 * p), Y = y => H - p - (y + 3.5) / 8 * (H - 2 * p);
      g.strokeStyle = css("--mh-border"); g.lineWidth = 1;
      g.beginPath(); g.moveTo(p, Y(0)); g.lineTo(W - p, Y(0)); g.moveTo(X(0), p); g.lineTo(X(0), H - p); g.stroke();
      g.fillStyle = css("--mh-accent"); g.globalAlpha = .75;
      xs.forEach((x, i) => { g.beginPath(); g.arc(X(x), Y(ys[i]), 3.6, 0, 7); g.fill(); });
      g.globalAlpha = 1; g.strokeStyle = css("--mh-accent-2"); g.lineWidth = 3;
      g.beginPath(); g.moveTo(X(-2.2), Y(-2.2 * w + b)); g.lineTo(X(2.2), Y(2.2 * w + b)); g.stroke();
      g.fillStyle = css("--mh-muted"); g.font = "600 11px Inter, sans-serif"; g.fillText("data + fitted line", p + 2, p + 8);
      [g, W, H] = size(loss);
      g.fillStyle = css("--mh-muted"); g.font = "600 11px Inter, sans-serif"; g.fillText("loss over epochs", 14, 18);
      if (hist.length > 1) {
        const m = Math.max(...hist, 1);
        g.strokeStyle = css("--mh-accent-3"); g.lineWidth = 2.5; g.beginPath();
        hist.forEach((v, i) => { const px = 12 + i / 200 * (W - 24), py = H - 12 - Math.min(v / m, 1) * (H - 36); i ? g.lineTo(px, py) : g.moveTo(px, py); });
        g.stroke();
      }
      q("[data-ep]").textContent = ep; q("[data-ls]").textContent = hist.length ? L().toFixed(3) : "–";
      q("[data-w]").textContent = w.toFixed(2); q("[data-b]").textContent = b.toFixed(2);
    }
    function stepOnce() {
      let gw = 0, gb = 0;
      xs.forEach((x, i) => { const e = (w * x + b) - ys[i]; gw += e * x; gb += e; });
      w -= lr * 2 * gw / xs.length; b -= lr * 2 * gb / xs.length; ep++; hist.push(L());
      if (!isFinite(w) || Math.abs(w) > 50) { w = Math.sign(w) * 50; stop(); }
    }
    function stop() { clearInterval(timer); timer = null; q("[data-run]").textContent = "▶ Train"; }
    function run() {
      if (timer) { stop(); return; }
      if (ep >= 200) reset();
      q("[data-run]").textContent = "❚❚ Pause";
      timer = setInterval(() => { stepOnce(); draw(); if (ep >= 200) stop(); }, 35);
    }
    function reset() { stop(); w = 0; b = 0; ep = 0; hist = []; draw(); }
    q("[data-run]").onclick = run; q("[data-reset]").onclick = reset;
    q("[data-lr]").oninput = e => { lr = +e.target.value; q("[data-lrv]").textContent = String(+lr.toFixed(3)); };
    new ResizeObserver(draw).observe(fit);
    new MutationObserver(draw).observe(document.body, { attributes: true, attributeFilter: ["class"] });
    draw();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce && "IntersectionObserver" in window) {
      const io = new IntersectionObserver(es => { if (es[0].isIntersecting) { io.disconnect(); setTimeout(run, 500); } });
      io.observe(root);
    }
  }

  /* ---------- recency labels on the recent-articles listing ---------- */
  const SECTIONS = {
    ml: ["Machine Learning", "--mh-ml", "bi-cpu"], ai: ["AI", "--mh-ai", "bi-stars"],
    statistics: ["Statistics", "--mh-st", "bi-bar-chart-line"], software: ["Software", "--mh-sw", "bi-code-slash"],
    deployment: ["Deployment", "--mh-dp", "bi-rocket-takeoff"], resources: ["Resources", "--mh-rs", "bi-journal-bookmark"]
  };
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const days = d => Math.round((today - new Date(d + "T00:00:00")) / 864e5);
  const ago = n => n <= 0 ? "today" : n === 1 ? "yesterday" : n < 30 ? n + " days ago" : new Date(today - n * 864e5).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  let newest = null;
  document.querySelectorAll(".mh-recent [data-date]").forEach(a => {
    const d = a.dataset.date; if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return;
    const n = days(d); newest = newest === null ? n : Math.min(newest, n);
    const seg = (a.getAttribute("href") || "").replace(/^(\.\.\/|\.\/|\/)+/, "").split("/")[0];
    const sec = SECTIONS[seg] || ["Article", "--mh-accent", "bi-file-text"];
    a.style.setProperty("--tint", `var(${sec[1]})`);
    const s1 = a.querySelector("[data-sec]"); if (s1) s1.textContent = sec[0];
    const s2 = a.querySelector("[data-ago]"); if (s2) s2.textContent = ago(n);
    const nb = a.querySelector(".mh-new"); if (nb && n <= 14) nb.hidden = false;
    const dot = a.querySelector(".mh-dot"); if (dot) dot.innerHTML = `<i class="bi ${sec[2]}"></i>`;
  });
  const up = document.querySelector("[data-mh-updated]");
  if (up && newest !== null) up.textContent = `Updated ${ago(newest)} · new end-to-end articles every week`;

  /* ---------- article counts from the site search index ---------- */
  fetch("search.json").then(r => r.ok ? r.json() : []).then(docs => {
    const seen = new Set(), per = {};
    docs.forEach(d => {
      const href = (d.href || "").split("#")[0];
      if (!href || seen.has(href) || /(^|\/)index\.html$/.test(href)) return;
      const seg = href.split("/")[0];
      if (!SECTIONS[seg]) return;
      seen.add(href); per[seg] = (per[seg] || 0) + 1;
    });
    document.querySelectorAll("[data-count]").forEach(el => {
      const n = per[el.dataset.count] || 0;
      el.textContent = n ? `${n} article${n > 1 ? "s" : ""}` : "New topics soon";
    });
    const all = document.querySelector("[data-count-all]");
    if (all && seen.size) all.textContent = seen.size;
  }).catch(() => {});
})();
