/* Page enhancements: theme, hero carousel, testimonials, FAQ, newsletter, back-to-top, reveal and parallax. */
(function () {
  "use strict";

  var SL = (window.SL = window.SL || {});
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var root = document.documentElement;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  var store = SL.store;
  var esc = SL.esc;

  /* ---------- theme ---------- */
  var themeBtn = $("#theme-toggle");
  function paintTheme() {
    var dark = root.getAttribute("data-theme") === "dark";
    themeBtn.setAttribute("aria-pressed", String(dark));
    themeBtn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    var meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", dark ? "#0e141b" : "#0b6fcf");
  }
  themeBtn.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("sl.theme", next); } catch (e) { /* ignore */ }
    paintTheme();
  });
  if (window.matchMedia) {
    var mq = window.matchMedia("(prefers-color-scheme: dark)");
    var onScheme = function (e) {
      var saved = null;
      try { saved = localStorage.getItem("sl.theme"); } catch (err) { /* ignore */ }
      if (!saved) { root.setAttribute("data-theme", e.matches ? "dark" : "light"); paintTheme(); }
    };
    if (mq.addEventListener) mq.addEventListener("change", onScheme);
  }
  paintTheme();

  /* ---------- sticky header state + back to top ---------- */
  var header = $("#site-header");
  var toTop = $("#to-top");
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.pageYOffset;
      header.classList.toggle("is-stuck", y > 40);
      toTop.hidden = y < 700;
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduced.matches ? "auto" : "smooth" });
    var main = $("#main");
    if (main) main.focus({ preventScroll: true });
  });

  /* ---------- hero carousel ---------- */
  (function () {
    var wrap = $("#hero-carousel");
    var slides = $$(".slide", wrap);
    var dotsBox = $("#car-dots");
    var pauseBtn = $("#car-pause");
    var live = $("#hero-slides");
    var idx = 0, timer = null, userPaused = reduced.matches, hoverPaused = false;
    var INTERVAL = 7000;

    slides.forEach(function (s, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "dot";
      b.setAttribute("aria-label", "Go to slide " + (i + 1));
      b.addEventListener("click", function () { show(i); });
      dotsBox.appendChild(b);
    });
    var dots = $$(".dot", dotsBox);

    function show(i) {
      idx = (i + slides.length) % slides.length;
      slides.forEach(function (s, n) {
        var on = n === idx;
        s.classList.toggle("is-active", on);
        if (on) { s.removeAttribute("inert"); s.removeAttribute("aria-hidden"); }
        else {
          s.setAttribute("inert", ""); s.setAttribute("aria-hidden", "true");
          var v = $("video", s); if (v && !v.paused) v.pause();
        }
      });
      dots.forEach(function (d, n) {
        if (n === idx) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current");
      });
      restart();
    }
    function anyVideoPlaying() { return $$("video", wrap).some(function (v) { return !v.paused && !v.ended; }); }
    function stop() { clearInterval(timer); timer = null; }
    function restart() {
      stop();
      if (userPaused || hoverPaused || reduced.matches) return;
      timer = setInterval(function () { if (!anyVideoPlaying() && !document.hidden) show(idx + 1); }, INTERVAL);
    }
    function paintPause() {
      pauseBtn.setAttribute("aria-pressed", String(userPaused));
      pauseBtn.setAttribute("aria-label", userPaused ? "Start automatic slide rotation" : "Pause automatic slide rotation");
      wrap.classList.toggle("is-paused", userPaused);
      live.setAttribute("aria-live", userPaused || hoverPaused ? "polite" : "off");
    }
    pauseBtn.addEventListener("click", function () { userPaused = !userPaused; paintPause(); restart(); });
    $("#car-prev").addEventListener("click", function () { show(idx - 1); });
    $("#car-next").addEventListener("click", function () { show(idx + 1); });
    wrap.addEventListener("mouseenter", function () { hoverPaused = true; paintPause(); restart(); });
    wrap.addEventListener("mouseleave", function () { hoverPaused = false; paintPause(); restart(); });
    wrap.addEventListener("focusin", function () { hoverPaused = true; paintPause(); restart(); });
    wrap.addEventListener("focusout", function (e) { if (!wrap.contains(e.relatedTarget)) { hoverPaused = false; paintPause(); restart(); } });
    wrap.addEventListener("keydown", function (e) {
      if (e.target.closest("video")) return;
      if (e.key === "ArrowLeft") { show(idx - 1); }
      else if (e.key === "ArrowRight") { show(idx + 1); }
    });
    reduced.addEventListener && reduced.addEventListener("change", function () { if (reduced.matches) userPaused = true; paintPause(); restart(); });
    paintPause();
    show(0);
  })();

  /* ---------- testimonials slider ---------- */
  (function () {
    var list = SL.data && SL.data.TESTIMONIALS;
    var track = $("#stories-track");
    var viewport = $("#stories-viewport");
    var dotsBox = $("#stories-dots");
    if (!list || !track) return;
    track.innerHTML = list.map(function (t, i) {
      var initials = t.name.split(" ").map(function (p) { return p.charAt(0); }).join("");
      return '<li class="story" aria-label="' + (i + 1) + " of " + list.length + '">' +
        '<blockquote><p>' + esc(t.quote) + '</p></blockquote>' +
        '<div class="story__who"><span class="avatar" aria-hidden="true">' + esc(initials) + '</span>' +
        '<div><b>' + esc(t.name) + '</b><span>' + esc(t.role) + '</span><em>' + esc(t.course) + '</em></div></div></li>';
    }).join("");
    var cards = $$(".story", track);
    cards.forEach(function (c, i) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "dot dot--dark";
      b.setAttribute("aria-label", "Show testimonial " + (i + 1));
      b.addEventListener("click", function () { go(i); });
      dotsBox.appendChild(b);
    });
    var dots = $$(".dot", dotsBox);
    function current() {
      var step = cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : viewport.clientWidth;
      return Math.max(0, Math.min(cards.length - 1, Math.round(viewport.scrollLeft / step)));
    }
    function paint() {
      var i = current();
      dots.forEach(function (d, n) { if (n === i) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current"); });
      $("#stories-prev").disabled = i === 0;
      var atEnd = viewport.scrollLeft + viewport.clientWidth >= viewport.scrollWidth - 4;
      $("#stories-next").disabled = atEnd;
    }
    function go(i) {
      i = Math.max(0, Math.min(cards.length - 1, i));
      viewport.scrollTo({ left: cards[i].offsetLeft - cards[0].offsetLeft, behavior: reduced.matches ? "auto" : "smooth" });
    }
    var raf;
    viewport.addEventListener("scroll", function () { cancelAnimationFrame(raf); raf = requestAnimationFrame(paint); }, { passive: true });
    $("#stories-prev").addEventListener("click", function () { go(current() - 1); });
    $("#stories-next").addEventListener("click", function () { go(current() + 1); });
    window.addEventListener("resize", paint);
    paint();
  })();

  /* ---------- FAQ accordion ---------- */
  (function () {
    var box = $("#faq-list");
    var btns = $$(".accordion__btn", box);
    box.addEventListener("click", function (e) {
      var b = e.target.closest(".accordion__btn");
      if (!b) return;
      var open = b.getAttribute("aria-expanded") === "true";
      b.setAttribute("aria-expanded", String(!open));
      var panel = document.getElementById(b.getAttribute("aria-controls"));
      panel.hidden = open;
      b.closest(".accordion__item").classList.toggle("is-open", !open);
    });
    box.addEventListener("keydown", function (e) {
      var i = btns.indexOf(document.activeElement);
      if (i < 0) return;
      var n = null;
      if (e.key === "ArrowDown") n = btns[(i + 1) % btns.length];
      else if (e.key === "ArrowUp") n = btns[(i - 1 + btns.length) % btns.length];
      else if (e.key === "Home") n = btns[0];
      else if (e.key === "End") n = btns[btns.length - 1];
      if (n) { e.preventDefault(); n.focus(); }
    });
  })();

  /* ---------- newsletter ---------- */
  (function () {
    var form = $("#news-form");
    var input = $("#news-email");
    var msg = $("#news-msg");
    function say(text, kind) {
      msg.textContent = text;
      msg.className = "form-msg" + (kind ? " form-msg--" + kind : "");
      input.setAttribute("aria-invalid", kind === "error" ? "true" : "false");
    }
    function check() {
      var v = input.value.trim();
      if (!v) { say("Please enter your email address.", "error"); return null; }
      if (!SL.emailValid(v)) { say("That does not look like a valid email. Example: you@example.com", "error"); return null; }
      return v.toLowerCase();
    }
    input.addEventListener("blur", function () { if (input.value) check(); });
    input.addEventListener("input", function () { if (input.getAttribute("aria-invalid") === "true") { if (check()) say("", ""); } });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = check();
      if (!v) { input.focus(); return; }
      var list = store.get("sl.newsletter", []);
      if (list.indexOf(v) > -1) { say("You are already subscribed with this address.", "info"); return; }
      list.push(v);
      store.set("sl.newsletter", list);
      form.reset();
      say("Thanks for subscribing. We saved your address in this browser (demo, no email is sent).", "success");
    });
  })();

  /* ---------- scroll reveal ---------- */
  var revealIO = null;
  function revealAll(nodes) { nodes.forEach(function (n) { n.classList.add("is-visible"); }); }
  if ("IntersectionObserver" in window) {
    revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); revealIO.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
  }
  function observe(nodes) {
    if (!revealIO || reduced.matches) { revealAll(nodes); return; }
    nodes.forEach(function (n) { if (!n.classList.contains("is-visible")) revealIO.observe(n); });
  }
  SL.observeReveal = function (container) {
    var cards = $$(".card:not(.card--skeleton)", container);
    cards.forEach(function (c, i) {
      if (!c.classList.contains("reveal")) { c.classList.add("reveal"); c.style.transitionDelay = (i % 3) * 70 + "ms"; }
    });
    observe(cards);
  };
  observe($$(".reveal"));

  /* ---------- parallax (translate only, rAF-driven, off for reduced motion / small / low-power screens) ---------- */
  (function () {
    var supportsTranslate = window.CSS && CSS.supports && CSS.supports("translate", "0 1px");
    var items = $$("[data-parallax], [data-parallax-x]").map(function (el) {
      return { el: el, y: parseFloat(el.getAttribute("data-parallax")) || 0, x: parseFloat(el.getAttribute("data-parallax-x")) || 0, vis: false, ax: 0, ay: 0 };
    });
    var visible = [];
    var io = null, raf = 0, active = false;
    
    function lowPower() {
      var c = navigator.connection;
      if (c && c.saveData) return true;
      if (navigator.deviceMemory && navigator.deviceMemory <= 2) return true;
      if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) return true;
      return false;
    }
    function shouldRun() {
      return supportsTranslate && !reduced.matches && window.innerWidth >= 900 && !lowPower() && "IntersectionObserver" in window;
    }
    function clamp(v, speed) { var m = Math.abs(speed) >= 0.1 ? 60 : 24; return Math.max(-m, Math.min(m, v)); }
    function frame() {
      raf = 0;
      var vh = window.innerHeight, vw = window.innerWidth;
      for (var i = 0; i < visible.length; i++) {
        var it = visible[i];
        var r = it.el.getBoundingClientRect();
        var cy = r.top + r.height / 2 - it.ay;
        var cx = r.left + r.width / 2 - it.ax;
        var ny = it.y ? Math.round(clamp(-(cy - vh / 2) * it.y, it.y) * 10) / 10 : 0;
        var nx = it.x ? Math.round(clamp(-(cx - vw / 2) * it.x, it.x) * 10) / 10 : 0;
        if (ny !== it.ay || nx !== it.ax) {
          it.ay = ny; it.ax = nx;
          it.el.style.translate = nx + "px " + ny + "px";
        }
      }
    }
    function request() { if (!raf && active) raf = requestAnimationFrame(frame); }
    function start() {
      if (active) return;
      active = true;
      root.classList.add("parallax-on");
      root.setAttribute("data-parallax-state", "on");
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          var it = items.filter(function (x) { return x.el === en.target; })[0];
          if (!it) return;
          it.vis = en.isIntersecting;
        });
        visible = items.filter(function (x) { return x.vis; });
        request();
      }, { rootMargin: "120px 0px 120px 0px" });
      items.forEach(function (it) { io.observe(it.el); });
      window.addEventListener("scroll", request, { passive: true });
      window.addEventListener("resize", onResize);
    }
    function stop() {
      if (!active) { root.setAttribute("data-parallax-state", "off"); return; }
      active = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      if (io) io.disconnect();
      io = null; visible = [];
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", onResize);
      items.forEach(function (it) { it.el.style.translate = ""; it.ax = 0; it.ay = 0; it.vis = false; });
      root.classList.remove("parallax-on");
      root.setAttribute("data-parallax-state", "off");
    }
    function onResize() { if (!shouldRun()) stop(); else request(); }
    function evaluate() { if (shouldRun()) start(); else stop(); }
    window.addEventListener("resize", function () { if (!active && shouldRun()) start(); });
    if (reduced.addEventListener) reduced.addEventListener("change", evaluate);
    evaluate();
  })();
})();
