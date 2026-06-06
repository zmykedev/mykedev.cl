(function () {
  // ── Translations ───────────────────────────────────────
  // Spanish is NOT stored here: it lives in the HTML (single source
  // of truth) and is read from the DOM at startup (see below). This
  // dictionary only holds the English overrides for each key.
  var i18n = {
    en: {
      navStack: "Stack",
      navProjects: "Projects",
      navAbout: "About",
      navContact: "Contact",
      heroTitle:
        "I build products<br />that <em>just</em><br />work.",
      heroDesc:
        "Five years designing and building systems from the database to the pixel. Focused on clean code, performance, and authentic experiences.",
      heroCtaPrimary: "View projects →",
      heroCtaGhost: "Let's talk",
      stackCount: "14 technologies",
      lvlExpert: "Expert",
      lvlAdvanced: "Advanced",
      lvlIntermediate: "Intermediate",
      lvlBasic: "Basic",
      projectsCount: "Selected — 2024",
      proj1Desc:
        "Resume builder that generates a CV in minutes — ATS format or styled templates — and exports it to PDF or DOCX. Free and friction-free.",
      proj2Desc:
        "Real-time planning poker for agile estimation ceremonies. Born from the team's own need to estimate stories collaboratively and without distractions.",
      projView: "View →",
      aboutP1:
        "I'm a fullstack developer in <strong>Santiago, Chile</strong>, with over five years taking products from idea to production. I started out building interfaces, so I read designs in a particular way: I structure them in my head before translating them into clean, maintainable code.",
      aboutP2:
        "I build robust things <strong>that people actually want to use</strong>: fast, clear, and easy to understand. I don't just write code; I sweat every detail and every flow, and I test the product thinking like the customer who'll use it.",
      aboutP3:
        "Outside of code: lots of travel, lots of sport, and a good-coffee fanatic.",
      aboutExpTitle: "Experience",
      aboutEduTitle: "Education",
      aboutCertTitle: "Certifications",
      exp1Date: "2023 — Present",
      exp1Role: "Full Stack Developer",
      exp2Role: "Frontend Developer",
      exp3Role: "Freelance Developer",
      edu1Field:
        "Mechanical, Automotive & Electronic Systems Engineering",
      contactTitle: "Let's work<br /><em>together.</em>",
      contactDesc:
        "Available for freelance projects, collaborations, and remote positions. I reply in under 24 hours.",
      contactResume: "Resume →"
    }
  };

  // ── Spanish = the HTML itself ──────────────────────────
  // Read the original markup once and cache it as the "es" set, so
  // the Spanish copy is never duplicated in this file. Must run
  // before any applyLang() call, while the DOM still holds the
  // markup defaults.
  i18n.es = {};
  document.querySelectorAll("[data-i18n]").forEach(function (el) {
    i18n.es[el.getAttribute("data-i18n")] = el.textContent.trim();
  });
  document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
    i18n.es[el.getAttribute("data-i18n-html")] = el.innerHTML.trim();
  });

  // ── Region detection (no libraries, no network) ────────
  // US timezones → English. Other America/* zones (Latin
  // America) → Spanish. Otherwise fall back to the browser
  // language, defaulting to Spanish.
  var US_ZONES = {
    "America/New_York": 1,
    "America/Detroit": 1,
    "America/Kentucky/Louisville": 1,
    "America/Kentucky/Monticello": 1,
    "America/Indiana/Indianapolis": 1,
    "America/Chicago": 1,
    "America/Menominee": 1,
    "America/Denver": 1,
    "America/Boise": 1,
    "America/Phoenix": 1,
    "America/Los_Angeles": 1,
    "America/Anchorage": 1,
    "America/Adak": 1,
    "America/Juneau": 1,
    "America/Sitka": 1,
    "America/Nome": 1,
    "Pacific/Honolulu": 1
  };

  function detectLang() {
    var tz = "";
    try {
      tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    } catch (e) {}
    if (US_ZONES[tz]) return "en";
    if (tz.indexOf("America/") === 0) return "es"; // Latin America
    var nav = (navigator.language || "es").toLowerCase();
    return nav.indexOf("en") === 0 ? "en" : "es";
  }

  // ── Apply a language across the page ────────────────────
  var sw = document.querySelector(".lang-switch");
  var opts = sw ? sw.querySelectorAll(".lang-opt") : [];

  function applyLang(lang) {
    var dict = i18n[lang] || i18n.es;
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var v = dict[el.getAttribute("data-i18n")];
      if (v != null) el.textContent = v;
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var v = dict[el.getAttribute("data-i18n-html")];
      if (v != null) el.innerHTML = v;
    });

    if (sw) sw.setAttribute("data-active", lang);
    opts.forEach(function (o) {
      o.setAttribute(
        "aria-pressed",
        o.getAttribute("data-lang") === lang ? "true" : "false"
      );
    });
  }

  // ── Init: saved choice wins, else auto-detect ──────────
  var saved = null;
  try {
    saved = localStorage.getItem("lang");
  } catch (e) {}
  applyLang(saved || detectLang());

  // ── Manual selection persists and overrides detection ──
  opts.forEach(function (o) {
    o.addEventListener("click", function () {
      var lang = o.getAttribute("data-lang");
      applyLang(lang);
      try {
        localStorage.setItem("lang", lang);
      } catch (e) {}
    });
  });

  // ── Smooth scroll for in-page nav links ────────────────
  // Eases slowly at the start, then accelerates (ease-in-out
  // cubic). Offsets for the sticky nav so headings aren't hidden.
  var NAV_OFFSET = 80; // px ≈ sticky nav height
  var SCROLL_MS = 900; // higher = slower / more dramatic

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function smoothScrollTo(targetY) {
    var startY = window.pageYOffset;
    var diff = targetY - startY;
    var startTime = null;
    function step(now) {
      if (startTime === null) startTime = now;
      var t = Math.min((now - startTime) / SCROLL_MS, 1);
      window.scrollTo(0, startY + diff * easeInOutCubic(t));
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (!id || id.length < 2) return; // ignore bare "#"
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      // En móvil el nav está abajo (barra inferior): casi sin offset.
      var offset = window.innerWidth <= 640 ? 16 : NAV_OFFSET;
      var top =
        target.getBoundingClientRect().top + window.pageYOffset - offset;
      if (reduceMotion) {
        window.scrollTo(0, top);
      } else {
        smoothScrollTo(top);
      }
    });
  });
})();
