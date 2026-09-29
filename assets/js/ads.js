/* MLStation · lightweight ad manager  (edit assets/ads/ads.json, never this file)
   Placements filled automatically:
     leaderboard   wide banner under the article title (sponsors only, no house ad)
     sidebar       under the table of contents (articles, wide screens)
     in-article    after the second section of longer articles
     article-end   at the end of an article
   Placements you add to any page with a div:
     <div class="ms-ad-slot" data-placement="home"></div>
     <div class="ms-ad-slot" data-placement="partners"></div>
   Creative types per ad:  logo + headline + text (card) · image 1200x628 (spotlight) · banner 1456x180 (leaderboard)
   Pages with  body-classes: ms-no-ads  never show ads. */
(function () {
  var offsetMeta = document.querySelector('meta[name="quarto:offset"]');
  var ROOT = offsetMeta ? offsetMeta.getAttribute("content") : "./";
  if (document.body.classList.contains("ms-no-ads")) return;

  var isArticle = !!document.querySelector("#title-block-header") && !!document.querySelector("nav#TOC");
  var section = (Array.from(document.body.classList).find(function (c) { return c.indexOf("sec-") === 0; }) || "").slice(4);
  var today = new Date().toISOString().slice(0, 10);

  function abs(u) { return !u ? "" : /^(https?:)?\/\//.test(u) || u.indexOf("mailto:") === 0 ? u : ROOT + u.replace(/^\//, ""); }
  function esc(s) { return String(s || "").replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function withUtm(url, id, placement, on) {
    if (!on || !/^https?:/.test(url)) return url;
    return url + (url.indexOf("?") > -1 ? "&" : "?") + "utm_source=mlstation&utm_medium=sponsor&utm_campaign=" +
      encodeURIComponent(id) + "&utm_content=" + placement;
  }
  function pick(list) {
    var total = list.reduce(function (s, a) { return s + (a.weight || 1); }, 0), r = Math.random() * total;
    for (var i = 0; i < list.length; i++) { r -= (list[i].weight || 1); if (r <= 0) return list[i]; }
    return list[0];
  }
  function live(a, placement) {
    if (a.active === false) return false;
    if ((a.placements || []).indexOf(placement) < 0) return false;
    if (a.start && today < a.start) return false;
    if (a.end && today > a.end) return false;
    if (a.sections && a.sections.length && a.sections.indexOf(section) < 0) return false;
    if (placement === "leaderboard" && !a.banner) return false;
    return true;
  }
  function track(a, placement) {                      // works once Google Analytics is added (Step 8)
    if (window.gtag) window.gtag("event", "sponsor_click", { ad_id: a.id, sponsor: a.sponsor, placement: placement });
  }

  function link(a, placement, cls, inner, utm) {
    var url = withUtm(abs(a.url), a.id, placement, utm && !a.house);
    var ext = /^https?:/.test(url);
    return '<a class="ms-ad ' + cls + (a.house ? " is-house" : "") + '" href="' + esc(url) + '"' +
      (ext ? ' target="_blank" rel="sponsored noopener"' : "") + ' data-ad-id="' + esc(a.id) + '" data-placement="' + placement + '">' + inner + "</a>";
  }
  function label(a) { return '<span class="ms-ad-label">' + (a.house ? "Advertise with MLStation" : "Sponsored · " + esc(a.sponsor)) + "</span>"; }
  function copy(a) {
    var logo = a.logo ? '<img class="ms-ad-logo" src="' + esc(abs(a.logo)) + '" alt="' + esc(a.sponsor) + ' logo" loading="lazy">' : "";
    return '<span class="ms-ad-body">' + logo + '<span class="ms-ad-copy"><strong>' + esc(a.headline) + "</strong><span>" + esc(a.text) + "</span></span></span>" +
      '<span class="ms-ad-cta">' + esc(a.cta || "Learn more") + ' <i class="bi bi-arrow-right"></i></span>';
  }

  function render(a, placement, utm) {
    if (placement === "leaderboard" || (placement === "home" && a.banner)) {
      return link(a, placement, "ms-ad-banner", label(a) +
        '<img class="ms-ad-banner-img" src="' + esc(abs(a.banner)) + '" alt="' + esc(a.sponsor + ": " + (a.headline || "")) + '" loading="lazy">', utm);
    }
    if (a.image && (placement === "sidebar" || placement === "in-article")) {
      return link(a, placement, "ms-ad-spotlight ms-ad-" + placement, label(a) +
        '<img class="ms-ad-image" src="' + esc(abs(a.image)) + '" alt="" loading="lazy"><span class="ms-ad-spot-copy">' + copy(a) + "</span>", utm);
    }
    return link(a, placement, "ms-ad-" + placement, label(a) + copy(a), utm);
  }

  var adsenseLoaded = false;
  function renderAdsense(cfg, placement) {
    if (!adsenseLoaded) {
      var s = document.createElement("script");
      s.async = true; s.crossOrigin = "anonymous";
      s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + cfg.adsense.client;
      document.head.appendChild(s); adsenseLoaded = true;
    }
    setTimeout(function () { try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {} }, 0);
    return '<div class="ms-ad ms-ad-' + placement + ' is-adsense"><span class="ms-ad-label">Advertisement</span>' +
      '<ins class="adsbygoogle" style="display:block" data-ad-client="' + esc(cfg.adsense.client) +
      '" data-ad-slot="' + esc(cfg.adsense.slots[placement]) + '" data-ad-format="auto" data-full-width-responsive="true"></ins></div>';
  }

  function renderPartners(cfg) {
    var list = (cfg.ads || []).filter(function (a) { return !a.house && a.logo && live(a, "partners"); });
    if (!list.length) return "";
    return '<div class="ms-partners"><span class="ms-ad-label">Our sponsors</span><div class="ms-partner-row">' +
      list.map(function (a) {
        var url = withUtm(abs(a.url), a.id, "partners", true);
        return '<a class="ms-partner" href="' + esc(url) + '" target="_blank" rel="sponsored noopener" data-ad-id="' + esc(a.id) + '">' +
          '<img src="' + esc(abs(a.logo)) + '" alt="' + esc(a.sponsor) + '" loading="lazy"><span>' + esc(a.sponsor) + "</span></a>";
      }).join("") + "</div></div>";
  }

  function fill(slot, cfg, placement, used) {
    var utm = !cfg.settings || cfg.settings.utm !== false;
    var html = "";
    if (placement === "partners") html = renderPartners(cfg);
    else {
      var all = (cfg.ads || []).filter(function (a) { return live(a, placement); });
      var list = all.filter(function (a) { return used.indexOf(a.id) < 0; });
      var sponsors = list.filter(function (a) { return !a.house; });
      if (!sponsors.length) sponsors = all.filter(function (a) { return !a.house; });   // a paid sponsor beats a house ad
      var ads = cfg.adsense || {};
      var houseOk = !(cfg.settings && cfg.settings.houseAdsIn && cfg.settings.houseAdsIn.indexOf(placement) < 0);
      if (sponsors.length) { var a = pick(sponsors); used.push(a.id); html = render(a, placement, utm); }
      else if (ads.enabled && ads.client && ads.slots && ads.slots[placement]) html = renderAdsense(cfg, placement);
      else if (houseOk && list.length) { var h = pick(list); used.push(h.id); html = render(h, placement, utm); }
    }
    if (!html) { slot.remove(); return; }
    slot.innerHTML = html; slot.classList.add("is-filled");
    slot.querySelectorAll("a[data-ad-id]").forEach(function (el) {
      el.addEventListener("click", function () {
        var a = (cfg.ads || []).find(function (x) { return x.id === el.getAttribute("data-ad-id"); });
        if (a) track(a, placement);
      });
    });
  }

  function makeSlot(placement) {
    var d = document.createElement("div");
    d.className = "ms-ad-slot"; d.setAttribute("data-placement", placement);
    d.setAttribute("aria-label", "Advertisement");
    return d;
  }

  fetch(ROOT + "assets/ads/ads.json", { cache: "no-cache" })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (cfg) {
      if (!cfg || (cfg.settings && cfg.settings.enabled === false)) return;
      var main = document.querySelector("main.content");
      if (isArticle && main) {
        var header = document.querySelector("#title-block-header");
        if (header && !document.querySelector('.ms-ad-slot[data-placement="leaderboard"]')) header.insertAdjacentElement("afterend", makeSlot("leaderboard"));
        var toc = document.querySelector("#quarto-margin-sidebar nav#TOC");
        if (toc && !document.querySelector('.ms-ad-slot[data-placement="sidebar"]')) toc.insertAdjacentElement("afterend", makeSlot("sidebar"));
        var h2s = main.querySelectorAll(":scope > section.level2, :scope > h2");
        if (h2s.length >= 4 && !main.querySelector('.ms-ad-slot[data-placement="in-article"]')) h2s[2].insertAdjacentElement("beforebegin", makeSlot("in-article"));
        if (!main.querySelector('.ms-ad-slot[data-placement="article-end"]')) {
          var end = main.querySelector("#quarto-appendix, section.footnotes, #quarto-bibliography");
          var endSlot = makeSlot("article-end");
          if (end) end.insertAdjacentElement("beforebegin", endSlot); else main.appendChild(endSlot);
        }
      }
      var used = [];
      document.querySelectorAll(".ms-ad-slot").forEach(function (slot) { fill(slot, cfg, slot.getAttribute("data-placement"), used); });
    })
    .catch(function () {});
})();
