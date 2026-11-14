/* ==========================================================================
   PALANI RAJ — Portfolio scripts
   ========================================================================== */

/* ---------- Settings you can edit ---------- */
const CONFIG = {
  // 1) Contact form: paste a free Formspree / Web3Forms endpoint here, e.g. "https://formspree.io/f/abcdwxyz".
  //    Leave it empty and the form opens the visitor's email app with the message filled in.
  formEndpoint: "",
  email: "v.palaniraj21@gmail.com",

  // 2) GitHub source links. Add a repository URL and its "Source Code" button appears automatically.
  repos: {
    frontend: "", // e.g. "https://github.com/palaniraj21/new-webpage"
    amazon: ""    // e.g. "https://github.com/palaniraj21/amazon"
  }
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
document.documentElement.classList.remove("no-js");

/* ---------- Footer year ---------- */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------- Source buttons appear only when a valid repo URL is set ---------- */
document.querySelectorAll("[data-repo]").forEach((btn) => {
  const url = CONFIG.repos[btn.dataset.repo];
  if (typeof url === "string" && /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/.test(url.trim())) {
    btn.href = url.trim();
    btn.hidden = false;
  }
});

/* ---------- Mobile navigation ---------- */
const nav = document.getElementById("nav");
const toggle = document.getElementById("navToggle");
const menu = document.getElementById("menu");

function setMenu(open) {
  menu.classList.toggle("is-open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}
toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
menu.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") { setMenu(false); toggle.focus(); } });
document.addEventListener("click", (e) => { if (!nav.contains(e.target)) setMenu(false); });
window.matchMedia("(min-width: 861px)").addEventListener("change", () => setMenu(false));

/* ---------- Active link, progress bar, back-to-top ---------- */
const progress = document.getElementById("progress");
const toTop = document.getElementById("toTop");
const links = [...document.querySelectorAll(".nav__links a")];
const sections = links.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);

let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    toTop.classList.toggle("is-shown", window.scrollY > 700);

    const probe = window.scrollY + window.innerHeight * 0.35;
    let current = null;
    sections.forEach((s) => { if (s.offsetTop <= probe) current = s.id; });
    links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${current}`));
    ticking = false;
  });
}
window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll);
onScroll();
toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));

/* ---------- Reveal on scroll ---------- */
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !reduceMotion) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); io.unobserve(entry.target); }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
  revealEls.forEach((el, i) => { el.style.transitionDelay = `${(i % 3) * 70}ms`; io.observe(el); });
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}

/* ---------- Typed hero role ---------- */
(function typeRole() {
  const el = document.getElementById("typed");
  if (!el || reduceMotion) return;
  const text = el.dataset.text;
  el.textContent = "";
  let i = 0;
  setTimeout(function step() {
    el.textContent = text.slice(0, ++i);
    if (i < text.length) setTimeout(step, 45 + Math.random() * 35);
  }, 900);
})();

/* ---------- Hero background: drifting code symbols ---------- */
(function codeField() {
  const canvas = document.getElementById("codeCanvas");
  if (!canvas || reduceMotion) return;
  const ctx = canvas.getContext("2d");
  const glyphs = ["{ }", "</>", "def", "()", "=>", "SQL", "py", "#", "[ ]", "css", "html", "js"];
  let w = 0, h = 0, dpr = 1, items = [], running = false, last = 0;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = w < 700 ? 12 : 24;
    items = Array.from({ length: count }, () => spawn(true));
  }
  function spawn(anywhere) {
    return {
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : h + 20,
      size: 12 + Math.random() * 10,
      speed: 6 + Math.random() * 14,
      alpha: 0.07 + Math.random() * 0.16,
      text: glyphs[(Math.random() * glyphs.length) | 0],
      orange: Math.random() < 0.18
    };
  }
  function frame(t) {
    if (!running) return;
    const dt = Math.min((t - last) / 1000, 0.05); last = t;
    ctx.clearRect(0, 0, w, h);
    items.forEach((p, i) => {
      p.y -= p.speed * dt;
      if (p.y < -20) items[i] = spawn(false);
      ctx.font = `500 ${p.size}px "JetBrains Mono", monospace`;
      ctx.fillStyle = p.orange ? `rgba(245,158,11,${p.alpha + 0.08})` : `rgba(160,174,192,${p.alpha})`;
      ctx.fillText(p.text, p.x, p.y);
    });
    requestAnimationFrame(frame);
  }
  function start() { if (running) return; running = true; last = performance.now(); requestAnimationFrame(frame); }
  function stop() { running = false; }

  resize();
  window.addEventListener("resize", resize);
  new IntersectionObserver(([e]) => (e.isIntersecting && !document.hidden ? start() : stop())).observe(canvas);
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
})();

/* ---------- Contact form ---------- */
(function contactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;
  const status = document.getElementById("formStatus");
  const btn = document.getElementById("submitBtn");
  const rules = {
    name: (v) => (v.trim().length >= 2 ? "" : "Enter your name."),
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Enter a valid email address."),
    subject: (v) => (v.trim().length >= 3 ? "" : "Enter a subject."),
    message: (v) => (v.trim().length >= 10 ? "" : "Write at least 10 characters.")
  };

  function check(name) {
    const input = form.elements[name];
    const msg = rules[name](input.value);
    input.closest(".field").classList.toggle("has-error", Boolean(msg));
    input.setAttribute("aria-invalid", String(Boolean(msg)));
    document.getElementById(`${name}-error`).textContent = msg;
    return !msg;
  }
  Object.keys(rules).forEach((n) => {
    form.elements[n].addEventListener("blur", () => check(n));
    form.elements[n].addEventListener("input", () => { if (form.elements[n].closest(".field").classList.contains("has-error")) check(n); });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.className = "form__status";
    status.textContent = "";
    const valid = Object.keys(rules).map(check).every(Boolean);
    if (!valid) { form.querySelector(".has-error input, .has-error textarea")?.focus(); return; }
    if (form.elements._gotcha.value) return; // bot

    const data = Object.fromEntries(["name", "email", "subject", "message"].map((n) => [n, form.elements[n].value.trim()]));

    if (!CONFIG.formEndpoint) {
      const body = `${data.message}\n\nFrom: ${data.name} (${data.email})`;
      window.location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(body)}`;
      status.textContent = "Opening your email app to send this message.";
      return;
    }

    btn.disabled = true; btn.textContent = "Sending...";
    try {
      const res = await fetch(CONFIG.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Request failed");
      form.reset();
      status.classList.add("is-ok");
      status.textContent = "Message sent. Thank you, I will reply soon.";
    } catch {
      status.classList.add("is-err");
      status.textContent = `The message was not sent. Email me directly at ${CONFIG.email}.`;
    } finally {
      btn.disabled = false; btn.textContent = "Send message";
    }
  });
})();
