/* Core app: catalog, filters, course details, wishlist, cart, checkout, menus. Plain JS, no dependencies. */
(function () {
  "use strict";

  var SL = (window.SL = window.SL || {});
  var data = SL.data;
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  var money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  var compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });
  function formatDuration(weeks) {
    return weeks <= 8 ? weeks + " weeks" : Math.round(weeks / 4) + " months";
  }
  function cohortDate(days) {
    var d = new Date();
    d.setDate(d.getDate() + days);
    return d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
  }
  function durationBucket(weeks) { return weeks <= 8 ? "short" : weeks <= 24 ? "medium" : "long"; }
  function emailValid(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }

  var store = {
    get: function (key, fallback) {
      try {
        var raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch (e) { return fallback; }
    },
    set: function (key, val) {
      try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* ignore quota/privacy errors */ }
    }
  };

  function toast(msg) {
    var box = $("#toasts");
    var el = document.createElement("div");
    el.className = "toast";
    el.textContent = msg;
    box.appendChild(el);
    setTimeout(function () { el.classList.add("is-out"); }, 2600);
    setTimeout(function () { el.remove(); }, 3100);
  }

  function scrollToEl(el) {
    el.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "start" });
  }

  /* ---------- layers (modal, drawer, side panel) ---------- */
  var layerStack = [];
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function focusables(root) {
    return $$(FOCUSABLE, root).filter(function (n) { return n.offsetParent !== null || n === document.activeElement; });
  }
  function openLayer(el, trigger, focusSel) {
    if (!el.hidden) return;
    el.hidden = false;
    el._trigger = trigger || document.activeElement;
    layerStack.push(el);
    document.body.classList.add("is-locked");
    var panel = $(".layer__panel", el);
    var target = (focusSel && $(focusSel, el)) || panel;
    setTimeout(function () { target.focus({ preventScroll: true }); }, 30);
  }
  function closeLayer(el) {
    if (el.hidden) return;
    el.hidden = true;
    layerStack = layerStack.filter(function (l) { return l !== el; });
    if (!layerStack.length) document.body.classList.remove("is-locked");
    var t = el._trigger;
    if (t && document.contains(t) && t.offsetParent !== null) t.focus({ preventScroll: true });
  }
  document.addEventListener("click", function (e) {
    var closer = e.target.closest("[data-close]");
    if (closer) {
      var layer = closer.closest(".layer");
      if (layer) closeLayer(layer);
    }
  });
  document.addEventListener("keydown", function (e) {
    var top = layerStack[layerStack.length - 1];
    if (!top) return;
    if (e.key === "Escape") { e.preventDefault(); closeLayer(top); return; }
    if (e.key === "Tab") {
      var f = focusables($(".layer__panel", top));
      if (!f.length) { e.preventDefault(); return; }
      var first = f[0], last = f[f.length - 1];
      var panel = $(".layer__panel", top);
      if (e.shiftKey && (document.activeElement === first || document.activeElement === panel)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  SL.openLayer = openLayer;
  SL.closeLayer = closeLayer;
  SL.toast = toast;
  SL.esc = esc;
  SL.store = store;
  SL.emailValid = emailValid;
  SL.reducedMotion = reducedMotion;

  /* ---------- state ---------- */
  var COURSES = data && data.COURSES ? data.COURSES : null;
  var CATS = data ? data.CATEGORIES : [];
  var byId = {};
  (COURSES || []).forEach(function (c) { byId[c.id] = c; });
  var catName = {};
  CATS.forEach(function (c) { catName[c.id] = c.name; });

  var wishlist = store.get("sl.wishlist", []).filter(function (id) { return byId[id]; });
  var cart = store.get("sl.cart", []).filter(function (id) { return byId[id]; });

  var PAGE = 9;
  var state = { q: "", cat: "all", levels: [], durations: [], sort: "popular", shown: PAGE };
  var LEVELS = ["Beginner", "Intermediate", "Advanced"];
  var DURATIONS = [
    { id: "short", label: "Up to 8 weeks" },
    { id: "medium", label: "2 to 6 months" },
    { id: "long", label: "More than 6 months" }
  ];
  var durationLabel = {};
  DURATIONS.forEach(function (d) { durationLabel[d.id] = d.label; });

  /* ---------- filtering ---------- */
  function filtered() {
    var tokens = state.q.toLowerCase().split(/\s+/).filter(Boolean);
    var list = COURSES.filter(function (c) {
      if (state.cat === "popular" && !c.popular) return false;
      if (state.cat !== "all" && state.cat !== "popular" && c.category !== state.cat) return false;
      if (state.levels.length && state.levels.indexOf(c.level) < 0) return false;
      if (state.durations.length && state.durations.indexOf(durationBucket(c.weeks)) < 0) return false;
      if (tokens.length) {
        var hay = (c.title + " " + c.provider + " " + c.skills.join(" ") + " " + catName[c.category] + " " + c.summary).toLowerCase();
        for (var i = 0; i < tokens.length; i++) if (hay.indexOf(tokens[i]) < 0) return false;
      }
      return true;
    });
    var sorters = {
      popular: function (a, b) { return b.learners - a.learners; },
      rating: function (a, b) { return b.rating - a.rating || b.ratings - a.ratings; },
      "price-asc": function (a, b) { return a.price - b.price; },
      "price-desc": function (a, b) { return b.price - a.price; },
      "duration-asc": function (a, b) { return a.weeks - b.weeks; },
      title: function (a, b) { return a.title.localeCompare(b.title); }
    };
    return list.sort(sorters[state.sort] || sorters.popular);
  }

  /* ---------- rendering: cards ---------- */
  function starIcon() { return '<svg class="i i--sm" aria-hidden="true"><use href="#i-star"/></svg>'; }

  function cardHTML(c) {
    var wished = wishlist.indexOf(c.id) > -1;
    var inCart = cart.indexOf(c.id) > -1;
    var banner = c.image
      ? '<img src="' + esc(c.image) + '" alt="" width="320" height="140" loading="lazy" decoding="async" />'
      : '<div class="card__banner-art" aria-hidden="true"></div>';
    return (
      '<article class="card" data-id="' + c.id + '">' +
        '<div class="card__banner">' + banner +
          '<button type="button" class="wish' + (wished ? " is-on" : "") + '" data-wish="' + c.id + '" aria-pressed="' + wished + '" aria-label="' + (wished ? "Remove " : "Add ") + esc(c.title) + (wished ? " from" : " to") + ' wishlist">' +
            '<svg class="i" aria-hidden="true"><use href="#i-heart"/></svg></button>' +
        '</div>' +
        '<div class="card__body">' +
          '<span class="card__logo"><img src="' + esc(c.logo) + '" alt="' + esc(c.provider) + ' logo" height="32" loading="lazy" decoding="async" /></span>' +
          '<h3 class="card__title"><button type="button" class="card__link" data-detail="' + c.id + '">' + esc(c.title) + '</button></h3>' +
          '<p class="card__cat">' + esc(catName[c.category]) + '</p>' +
          '<ul class="card__list">' + c.highlights.map(function (h) { return "<li>" + esc(h) + "</li>"; }).join("") + '</ul>' +
          '<ul class="card__meta">' +
            '<li><svg class="i i--sm" aria-hidden="true"><use href="#i-clock"/></svg>' + formatDuration(c.weeks) + '</li>' +
            '<li><svg class="i i--sm" aria-hidden="true"><use href="#i-level"/></svg>' + c.level + '</li>' +
          '</ul>' +
          '<p class="card__rating">' + starIcon() + '<b>' + c.rating.toFixed(1) + '</b> <span>(' + c.ratings.toLocaleString("en-US") + ' ratings) &middot; ' + compact.format(c.learners) + ' learners</span></p>' +
        '</div>' +
        '<div class="card__foot">' +
          '<div class="card__price"><b>' + money.format(c.price) + '</b><span>Cohort starts ' + cohortDate(c.cohort) + '</span></div>' +
          '<div class="card__actions">' +
            '<button type="button" class="btn btn--outline btn--sm" data-detail="' + c.id + '">Details</button>' +
            '<button type="button" class="btn btn--primary btn--sm" data-add="' + c.id + '"' + (inCart ? ' disabled aria-label="' + esc(c.title) + ' is in your cart"' : ' aria-label="Add ' + esc(c.title) + ' to cart"') + '>' + (inCart ? "In cart" : "Enroll") + '</button>' +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }

  function skeletons(n) {
    var s = "";
    for (var i = 0; i < n; i++) s += '<div class="card card--skeleton" aria-hidden="true"><div class="sk sk--banner"></div><div class="sk sk--line"></div><div class="sk sk--line sk--short"></div><div class="sk sk--line"></div></div>';
    return s;
  }

  var grid = $("#course-grid");
  var countEl = $("#results-count");
  var moreBtn = $("#load-more");

  function renderCatalog() {
    if (!COURSES) return;
    var list = filtered();
    var visible = list.slice(0, state.shown);
    grid.setAttribute("aria-busy", "false");
    if (!list.length) {
      grid.innerHTML =
        '<div class="state state--empty"><h3>No programs match your search</h3><p>Try a different keyword or remove some filters.</p><button type="button" class="btn btn--primary" data-reset>Reset search and filters</button></div>';
      countEl.textContent = "No programs found.";
    } else {
      grid.innerHTML = visible.map(cardHTML).join("");
      countEl.textContent = "Showing " + visible.length + " of " + list.length + " program" + (list.length === 1 ? "" : "s");
    }
    moreBtn.hidden = visible.length >= list.length;
    renderFilters();
    renderChips();
    revealNew();
  }
  function revealNew() {
    if (SL.observeReveal) SL.observeReveal(grid);
  }

  function renderFilters() {
    var catList = $("#cat-list");
    var counts = {};
    COURSES.forEach(function (c) { counts[c.category] = (counts[c.category] || 0) + 1; });
    var items = [{ id: "all", name: "All programs", n: COURSES.length }, { id: "popular", name: "Most Popular", n: COURSES.filter(function (c) { return c.popular; }).length }]
      .concat(CATS.filter(function (c) { return counts[c.id]; }).map(function (c) { return { id: c.id, name: c.name, n: counts[c.id] }; }));
    catList.innerHTML = items.map(function (it) {
      return '<li><button type="button" class="cat-btn' + (state.cat === it.id ? " is-active" : "") + '" data-cat="' + it.id + '" aria-pressed="' + (state.cat === it.id) + '"><span>' + esc(it.name) + '</span><em>' + it.n + '</em></button></li>';
    }).join("");

    $("#level-filters").innerHTML = LEVELS.map(function (l) {
      return '<label class="check"><input type="checkbox" data-level="' + l + '"' + (state.levels.indexOf(l) > -1 ? " checked" : "") + ' /><span>' + l + '</span></label>';
    }).join("");
    $("#duration-filters").innerHTML = DURATIONS.map(function (d) {
      return '<label class="check"><input type="checkbox" data-duration="' + d.id + '"' + (state.durations.indexOf(d.id) > -1 ? " checked" : "") + ' /><span>' + d.label + '</span></label>';
    }).join("");
    var any = state.cat !== "all" || state.levels.length || state.durations.length || state.q;
    $("#clear-filters").disabled = !any;
  }

  function renderChips() {
    var chips = [];
    if (state.cat !== "all") chips.push(["cat", state.cat === "popular" ? "Most Popular" : catName[state.cat]]);
    state.levels.forEach(function (l) { chips.push(["level:" + l, l]); });
    state.durations.forEach(function (d) { chips.push(["duration:" + d, durationLabel[d]]); });
    if (state.q) chips.push(["q", 'Search: "' + state.q + '"']);
    $("#active-chips").innerHTML = chips.map(function (c) {
      return '<button type="button" class="chip" data-chip="' + esc(c[0]) + '" aria-label="Remove filter: ' + esc(c[1]) + '">' + esc(c[1]) + ' <svg class="i i--sm" aria-hidden="true"><use href="#i-close"/></svg></button>';
    }).join("");
  }

  function setState(patch, opts) {
    Object.keys(patch).forEach(function (k) { state[k] = patch[k]; });
    if (!opts || !opts.keepPage) state.shown = PAGE;
    renderCatalog();
    syncSearchInputs();
  }
  var searchInput = $("#catalog-search");
  function syncSearchInputs() {
    [$("#header-search-input"), $("#drawer-search-input"), searchInput].forEach(function (i) {
      if (i && i.value !== state.q && document.activeElement !== i) i.value = state.q;
    });
  }
  function resetAll() {
    state.q = ""; state.cat = "all"; state.levels = []; state.durations = []; state.shown = PAGE;
    searchInput.value = "";
    renderCatalog();
    syncSearchInputs();
  }
  SL.applyFilter = function (patch, scroll) {
    setState(patch);
    if (scroll) scrollToEl($("#programs"));
  };

  /* ---------- catalog events ---------- */
  var searchTimer;
  searchInput.addEventListener("input", function () {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(function () { setState({ q: searchInput.value.trim() }); }, 160);
  });
  $("#catalog-sort").addEventListener("change", function (e) { setState({ sort: e.target.value }); });
  moreBtn.addEventListener("click", function () {
    var before = state.shown;
    state.shown += PAGE;
    renderCatalog();
    var cards = $$(".card", grid);
    if (cards[before]) { var a = $(".card__link", cards[before]); if (a) a.focus({ preventScroll: true }); }
  });
  $("#clear-filters").addEventListener("click", resetAll);

  function toggleIn(arr, v) {
    var i = arr.indexOf(v);
    return i > -1 ? arr.filter(function (x) { return x !== v; }) : arr.concat(v);
  }
  $(".filters").addEventListener("click", function (e) {
    var b = e.target.closest("[data-cat]");
    if (b) setState({ cat: b.getAttribute("data-cat") });
  });
  $(".filters").addEventListener("change", function (e) {
    var t = e.target;
    if (t.hasAttribute("data-level")) setState({ levels: toggleIn(state.levels, t.getAttribute("data-level")) });
    if (t.hasAttribute("data-duration")) setState({ durations: toggleIn(state.durations, t.getAttribute("data-duration")) });
  });
  $("#active-chips").addEventListener("click", function (e) {
    var b = e.target.closest("[data-chip]");
    if (!b) return;
    var k = b.getAttribute("data-chip");
    if (k === "cat") setState({ cat: "all" });
    else if (k === "q") { searchInput.value = ""; setState({ q: "" }); }
    else if (k.indexOf("level:") === 0) setState({ levels: toggleIn(state.levels, k.slice(6)) });
    else if (k.indexOf("duration:") === 0) setState({ durations: toggleIn(state.durations, k.slice(9)) });
  });

  grid.addEventListener("click", function (e) {
    var t = e.target;
    var reset = t.closest("[data-reset]");
    if (reset) { resetAll(); return; }
    var retry = t.closest("[data-retry]");
    if (retry) { init(); return; }
    var w = t.closest("[data-wish]");
    if (w) { toggleWish(w.getAttribute("data-wish")); return; }
    var a = t.closest("[data-add]");
    if (a) { addToCart(a.getAttribute("data-add")); return; }
    var d = t.closest("[data-detail]");
    if (d) openCourse(d.getAttribute("data-detail"), d);
  });

  /* ---------- wishlist and cart ---------- */
  function persist() {
    store.set("sl.wishlist", wishlist);
    store.set("sl.cart", cart);
  }
  function updateCounts() {
    [["#wishlist-count", wishlist.length, "Wishlist", "#open-wishlist"], ["#cart-count", cart.length, "Cart", "#open-cart"]].forEach(function (x) {
      var el = $(x[0]);
      el.textContent = x[1];
      el.hidden = !x[1];
      $(x[3]).setAttribute("aria-label", x[2] + ", " + x[1] + " item" + (x[1] === 1 ? "" : "s"));
    });
  }
  function refreshAll() {
    persist();
    updateCounts();
    renderCatalog();
    if (!$("#side-panel").hidden) renderSide();
    if (!$("#course-modal").hidden && currentCourse) renderCourse(currentCourse);
  }
  function toggleWish(id) {
    var c = byId[id];
    if (!c) return;
    if (wishlist.indexOf(id) > -1) { wishlist = wishlist.filter(function (x) { return x !== id; }); toast("Removed from wishlist"); }
    else { wishlist.push(id); toast("Saved to wishlist"); }
    var focusSel = document.activeElement && document.activeElement.getAttribute("data-wish");
    refreshAll();
    if (focusSel) { var n = $('[data-wish="' + focusSel + '"]', grid); if (n) n.focus({ preventScroll: true }); }
  }
  function addToCart(id) {
    if (!byId[id] || cart.indexOf(id) > -1) return;
    cart.push(id);
    toast("Added to cart: " + byId[id].title);
    var focusSel = document.activeElement && document.activeElement.getAttribute("data-add");
    refreshAll();
    if (focusSel) { var n = $('[data-detail="' + focusSel + '"]', grid); if (n) n.focus({ preventScroll: true }); }
  }
  function removeFromCart(id) {
    cart = cart.filter(function (x) { return x !== id; });
    refreshAll();
  }
  SL.toggleWish = toggleWish;

  /* ---------- course detail modal ---------- */
  var currentCourse = null;
  var modal = $("#course-modal");
  function renderCourse(id) {
    var c = byId[id];
    var wished = wishlist.indexOf(id) > -1;
    var inCart = cart.indexOf(id) > -1;
    $("#course-modal-body").innerHTML =
      '<div class="detail">' +
        (c.image ? '<div class="detail__banner"><img src="' + esc(c.image) + '" alt="" width="640" height="200" /></div>' : '<div class="detail__banner detail__banner--art" aria-hidden="true"></div>') +
        '<div class="detail__head">' +
          '<span class="card__logo card__logo--lg"><img src="' + esc(c.logo) + '" alt="' + esc(c.provider) + ' logo" height="40" /></span>' +
          '<div><p class="eyebrow">' + esc(catName[c.category]) + ' &middot; ' + esc(c.provider) + '</p>' +
          '<h2 id="course-modal-title">' + esc(c.title) + '</h2></div>' +
        '</div>' +
        '<p class="card__rating">' + starIcon() + '<b>' + c.rating.toFixed(1) + '</b> <span>(' + c.ratings.toLocaleString("en-US") + ' ratings) &middot; ' + c.learners.toLocaleString("en-US") + ' learners</span></p>' +
        '<ul class="detail__facts">' +
          '<li><span>Duration</span><b>' + formatDuration(c.weeks) + '</b></li>' +
          '<li><span>Level</span><b>' + c.level + '</b></li>' +
          '<li><span>Format</span><b>' + esc(c.format) + '</b></li>' +
          '<li><span>Next cohort</span><b>' + cohortDate(c.cohort) + '</b></li>' +
        '</ul>' +
        '<p>' + esc(c.summary) + '</p>' +
        '<h3>What is included</h3><ul class="ticks">' + c.highlights.map(function (h) { return '<li><svg class="i i--sm" aria-hidden="true"><use href="#i-check"/></svg>' + esc(h) + '</li>'; }).join("") + '</ul>' +
        '<h3>Skills you will practise</h3><ul class="tags">' + c.skills.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join("") + '</ul>' +
        '<h3>Curriculum</h3><ol class="modules">' + c.modules.map(function (m) { return '<li>' + esc(m) + '</li>'; }).join("") + '</ol>' +
        '<div class="detail__foot">' +
          '<div class="card__price"><b>' + money.format(c.price) + '</b><span>One-time, demo price</span></div>' +
          '<div class="card__actions">' +
            '<button type="button" class="btn btn--outline" data-m-wish="' + id + '" aria-pressed="' + wished + '">' + (wished ? "Remove from wishlist" : "Save to wishlist") + '</button>' +
            (inCart ? '<button type="button" class="btn btn--primary" data-m-cart>View cart</button>' : '<button type="button" class="btn btn--primary" data-m-add="' + id + '">Enroll now</button>') +
          '</div>' +
        '</div>' +
      '</div>';
  }
  function openCourse(id, trigger) {
    if (!byId[id]) return;
    currentCourse = id;
    renderCourse(id);
    openLayer(modal, trigger, "#course-modal-title");
    var h = $("#course-modal-title");
    if (h) { h.setAttribute("tabindex", "-1"); }
  }
  SL.openCourse = openCourse;
  modal.addEventListener("click", function (e) {
    var w = e.target.closest("[data-m-wish]");
    if (w) { var wasFocus = true; toggleWish(w.getAttribute("data-m-wish")); var nb = $("[data-m-wish]", modal); if (wasFocus && nb) nb.focus(); return; }
    var a = e.target.closest("[data-m-add]");
    if (a) { addToCart(a.getAttribute("data-m-add")); var nb2 = $("[data-m-cart]", modal); if (nb2) nb2.focus(); return; }
    if (e.target.closest("[data-m-cart]")) { closeLayer(modal); openSide("cart", $("#open-cart")); }
  });

  /* ---------- side panel: cart, wishlist, checkout ---------- */
  var side = $("#side-panel");
  var sideMode = "cart";
  var sideBody = $("#side-body");
  function openSide(mode, trigger) {
    sideMode = mode;
    renderSide();
    if (side.hidden) openLayer(side, trigger, ".layer__body");
    else $(".layer__panel", side).focus();
  }
  function totals() {
    var subtotal = cart.reduce(function (s, id) { return s + byId[id].price; }, 0);
    var discount = cart.length >= 2 ? Math.round(subtotal * 0.1) : 0;
    return { subtotal: subtotal, discount: discount, total: subtotal - discount };
  }
  function summaryHTML() {
    var t = totals();
    return '<dl class="summary"><div><dt>Subtotal</dt><dd>' + money.format(t.subtotal) + '</dd></div>' +
      (t.discount ? '<div class="summary__disc"><dt>Bundle discount (10%)</dt><dd>-' + money.format(t.discount) + '</dd></div>' : '<div class="summary__hint"><dt>Add a second program for 10% off</dt><dd></dd></div>') +
      '<div class="summary__total"><dt>Total</dt><dd>' + money.format(t.total) + '</dd></div></dl>';
  }
  function lineHTML(c, mode) {
    return '<li class="line"><span class="card__logo"><img src="' + esc(c.logo) + '" alt="" height="28" /></span>' +
      '<div class="line__info"><button type="button" class="link-btn" data-s-detail="' + c.id + '">' + esc(c.title) + '</button>' +
      '<span>' + formatDuration(c.weeks) + ' &middot; ' + c.level + '</span><b>' + money.format(c.price) + '</b></div>' +
      '<div class="line__actions">' +
        (mode === "wishlist"
          ? (cart.indexOf(c.id) > -1 ? '<span class="muted">In cart</span>' : '<button type="button" class="btn btn--primary btn--sm" data-s-add="' + c.id + '">Add to cart</button>') +
            '<button type="button" class="btn btn--ghost btn--sm" data-s-unwish="' + c.id + '" aria-label="Remove ' + esc(c.title) + ' from wishlist">Remove</button>'
          : '<button type="button" class="btn btn--ghost btn--sm" data-s-remove="' + c.id + '" aria-label="Remove ' + esc(c.title) + ' from cart">Remove</button>') +
      '</div></li>';
  }
  function renderSide() {
    var title = $("#side-title");
    if (sideMode === "wishlist") {
      title.textContent = "Wishlist";
      sideBody.innerHTML = wishlist.length
        ? '<ul class="lines">' + wishlist.map(function (id) { return lineHTML(byId[id], "wishlist"); }).join("") + '</ul>'
        : '<div class="state state--empty"><h3>Your wishlist is empty</h3><p>Tap the heart on any program to save it for later.</p><button type="button" class="btn btn--primary" data-s-browse>Browse programs</button></div>';
    } else if (sideMode === "cart") {
      title.textContent = "Cart";
      sideBody.innerHTML = cart.length
        ? '<ul class="lines">' + cart.map(function (id) { return lineHTML(byId[id], "cart"); }).join("") + '</ul>' + summaryHTML() +
          '<button type="button" class="btn btn--primary btn--block" data-s-checkout>Continue to enrollment</button>'
        : '<div class="state state--empty"><h3>Your cart is empty</h3><p>Pick a program and choose Enroll to add it here.</p><button type="button" class="btn btn--primary" data-s-browse>Browse programs</button></div>';
    } else if (sideMode === "checkout") {
      title.textContent = "Enrollment";
      sideBody.innerHTML =
        '<ul class="lines lines--compact">' + cart.map(function (id) { return '<li class="line"><div class="line__info"><span class="line__t">' + esc(byId[id].title) + '</span><b>' + money.format(byId[id].price) + '</b></div></li>'; }).join("") + '</ul>' +
        summaryHTML() +
        '<form id="checkout-form" novalidate>' +
          '<div class="field"><label for="co-name">Full name</label><input id="co-name" type="text" autocomplete="name" required aria-describedby="co-name-err" /><p class="field__err" id="co-name-err" hidden></p></div>' +
          '<div class="field"><label for="co-email">Email</label><input id="co-email" type="email" autocomplete="email" placeholder="you@example.com" required aria-describedby="co-email-err" /><p class="field__err" id="co-email-err" hidden></p></div>' +
          '<div class="field field--check"><label class="check"><input id="co-ack" type="checkbox" aria-describedby="co-ack-err" /><span>I understand this is a demo and no payment is taken.</span></label><p class="field__err" id="co-ack-err" hidden></p></div>' +
          '<div class="btn-row"><button type="button" class="btn btn--outline" data-s-back>Back to cart</button><button type="submit" class="btn btn--primary">Confirm enrollment</button></div>' +
        '</form>';
    } else if (sideMode === "done") {
      var o = store.get("sl.lastOrder", null);
      title.textContent = "Enrollment confirmed";
      sideBody.innerHTML = o
        ? '<div class="confirm"><div class="confirm__icon" aria-hidden="true"><svg class="i" aria-hidden="true"><use href="#i-check"/></svg></div>' +
          '<h3 id="confirm-title" tabindex="-1">Thanks, ' + esc(o.name) + '. You are enrolled.</h3>' +
          '<p>Confirmation reference <b>' + esc(o.ref) + '</b>. A real confirmation email is not sent in this demo.</p>' +
          '<ul class="lines lines--compact">' + o.items.map(function (i) { return '<li class="line"><div class="line__info"><span class="line__t">' + esc(i.title) + '</span><b>' + money.format(i.price) + '</b></div></li>'; }).join("") + '</ul>' +
          '<dl class="summary"><div class="summary__total"><dt>Total</dt><dd>' + money.format(o.total) + '</dd></div></dl>' +
          '<button type="button" class="btn btn--primary btn--block" data-close>Continue browsing</button></div>'
        : "";
    }
  }
  $("#open-cart").addEventListener("click", function (e) { openSide("cart", e.currentTarget); });
  $("#open-wishlist").addEventListener("click", function (e) { openSide("wishlist", e.currentTarget); });

  function fieldError(id, msg) {
    var input = $("#" + id);
    var err = $("#" + id + "-err");
    if (!input || !err) return !msg;
    err.textContent = msg || "";
    err.hidden = !msg;
    input.setAttribute("aria-invalid", msg ? "true" : "false");
    return !msg;
  }
  function validators() {
    return {
      "co-name": function (v) { return v.trim().length < 2 ? "Enter your full name." : ""; },
      "co-email": function (v) { return !v.trim() ? "Enter your email address." : emailValid(v.trim()) ? "" : "Enter a valid email, for example you@example.com."; }
    };
  }
  sideBody.addEventListener("focusout", function (e) {
    var id = e.target.id, v = validators();
    if (v[id] && e.target.value) fieldError(id, v[id](e.target.value));
  });
  sideBody.addEventListener("input", function (e) {
    var id = e.target.id, v = validators();
    if (v[id] && e.target.getAttribute("aria-invalid") === "true") fieldError(id, v[id](e.target.value));
  });
  sideBody.addEventListener("submit", function (e) {
    if (e.target.id !== "checkout-form") return;
    e.preventDefault();
    var v = validators();
    var ok = true, firstBad = null;
    ["co-name", "co-email"].forEach(function (id) {
      var msg = v[id]($("#" + id).value);
      if (!fieldError(id, msg)) { ok = false; firstBad = firstBad || $("#" + id); }
    });
    var ack = $("#co-ack");
    var ackOk = fieldError("co-ack", ack.checked ? "" : "Please confirm to continue.");
    if (!ackOk) { ok = false; firstBad = firstBad || ack; }
    if (!ok) { firstBad.focus(); return; }
    var t = totals();
    var ref = "SL-" + Date.now().toString(36).toUpperCase().slice(-5) + Math.random().toString(36).slice(2, 5).toUpperCase();
    store.set("sl.lastOrder", {
      ref: ref, name: $("#co-name").value.trim().split(/\s+/)[0],
      items: cart.map(function (id) { return { title: byId[id].title, price: byId[id].price }; }), total: t.total
    });
    cart = [];
    sideMode = "done";
    refreshAll();
    var h = $("#confirm-title");
    if (h) h.focus();
  });
  sideBody.addEventListener("click", function (e) {
    var t = e.target;
    var x;
    if ((x = t.closest("[data-s-remove]"))) removeFromCart(x.getAttribute("data-s-remove"));
    else if ((x = t.closest("[data-s-unwish]"))) toggleWish(x.getAttribute("data-s-unwish"));
    else if ((x = t.closest("[data-s-add]"))) addToCart(x.getAttribute("data-s-add"));
    else if ((x = t.closest("[data-s-detail]"))) openCourse(x.getAttribute("data-s-detail"), x);
    else if (t.closest("[data-s-checkout]")) { sideMode = "checkout"; renderSide(); var n = $("#co-name"); if (n) n.focus(); }
    else if (t.closest("[data-s-back]")) { sideMode = "cart"; renderSide(); $(".layer__panel", side).focus(); }
    else if (t.closest("[data-s-browse]")) { closeLayer(side); scrollToEl($("#programs")); }
  });

  /* ---------- mega menu (desktop) ---------- */
  var mega = $("#mega");
  var megaToggle = $("#mega-toggle");
  var megaPanel = $("#mega-panel");
  var megaCat = "popular";
  function megaCats() {
    var items = [{ id: "popular", name: "Most Popular" }].concat(CATS);
    $("#mega-cats").innerHTML = items.map(function (c) {
      return '<li><button type="button" class="mega__cat' + (c.id === megaCat ? " is-active" : "") + '" data-mcat="' + c.id + '">' + esc(c.name) + '</button></li>';
    }).join("");
  }
  function megaCourses() {
    var list = COURSES.filter(function (c) { return megaCat === "popular" ? c.popular : c.category === megaCat; }).slice(0, 8);
    var name = megaCat === "popular" ? "Most Popular" : catName[megaCat];
    $("#mega-courses").innerHTML = list.length ? list.map(function (c) {
      return '<li><button type="button" class="mega__course" data-mcourse="' + c.id + '"><b>' + esc(c.title) + '</b><span>' + esc(c.provider) + ' &middot; ' + c.level + '</span><em>' + formatDuration(c.weeks) + ' &middot; ' + money.format(c.price) + '</em></button></li>';
    }).join("") : '<li class="muted">No programs in this category yet.</li>';
    $("#mega-viewall").textContent = "View all " + name + " programs";
  }
  function setMegaCat(id) {
    if (id === megaCat) return;
    megaCat = id;
    megaCats();
    megaCourses();
  }
  function openMega() {
    megaPanel.hidden = false;
    megaToggle.setAttribute("aria-expanded", "true");
  }
  function closeMega(returnFocus) {
    if (megaPanel.hidden) return;
    megaPanel.hidden = true;
    megaToggle.setAttribute("aria-expanded", "false");
    if (returnFocus) megaToggle.focus();
  }
  var hoverTimer;
  var canHover = window.matchMedia("(hover: hover) and (pointer: fine)");
  megaToggle.addEventListener("click", function () { megaPanel.hidden ? openMega() : closeMega(); });
  mega.addEventListener("mouseenter", function () { if (canHover.matches) { clearTimeout(hoverTimer); openMega(); } });
  mega.addEventListener("mouseleave", function () { if (canHover.matches) hoverTimer = setTimeout(function () { closeMega(); }, 180); });
  mega.addEventListener("focusout", function (e) { if (e.relatedTarget && !mega.contains(e.relatedTarget)) closeMega(); });
  mega.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !megaPanel.hidden) { closeMega(true); }
    if ((e.key === "ArrowDown" || e.key === "ArrowUp") && e.target.classList.contains("mega__cat")) {
      var btns = $$(".mega__cat", megaPanel), i = btns.indexOf(e.target);
      var n = btns[(i + (e.key === "ArrowDown" ? 1 : -1) + btns.length) % btns.length];
      e.preventDefault(); n.focus();
    }
  });
  document.addEventListener("click", function (e) { if (!mega.contains(e.target)) closeMega(); });
  megaPanel.addEventListener("mouseover", function (e) { var b = e.target.closest("[data-mcat]"); if (b) setMegaCat(b.getAttribute("data-mcat")); });
  megaPanel.addEventListener("focusin", function (e) { var b = e.target.closest("[data-mcat]"); if (b) setMegaCat(b.getAttribute("data-mcat")); });
  megaPanel.addEventListener("click", function (e) {
    var b = e.target.closest("[data-mcat]");
    if (b) { setMegaCat(b.getAttribute("data-mcat")); return; }
    var c = e.target.closest("[data-mcourse]");
    if (c) { var id = c.getAttribute("data-mcourse"); closeMega(); openCourse(id, megaToggle); return; }
  });
  $("#mega-viewall").addEventListener("click", function () {
    closeMega();
    SL.applyFilter({ cat: megaCat }, true);
  });

  /* ---------- drawer ---------- */
  var drawer = $("#drawer");
  var navToggle = $("#nav-toggle");
  navToggle.addEventListener("click", function () {
    openLayer(drawer, navToggle);
    navToggle.setAttribute("aria-expanded", "true");
  });
  var drawerObserver = new MutationObserver(function () {
    if (drawer.hidden) navToggle.setAttribute("aria-expanded", "false");
  });
  drawerObserver.observe(drawer, { attributes: true, attributeFilter: ["hidden"] });
  drawer.addEventListener("click", function (e) {
    var cat = e.target.closest("[data-dcat]");
    if (cat) { closeLayer(drawer); SL.applyFilter({ cat: cat.getAttribute("data-dcat") }, true); return; }
    if (e.target.closest(".drawer-links a")) closeLayer(drawer);
  });
  $("#drawer-login").addEventListener("click", function () { closeLayer(drawer); handleLoginClick($("#nav-toggle")); });
  window.addEventListener("resize", function () { if (window.innerWidth >= 992 && !drawer.hidden) closeLayer(drawer); });

  /* ---------- header search ---------- */
  function wireSearch(formSel, inputSel, afterSubmit) {
    var form = $(formSel), input = $(inputSel);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      setState({ q: input.value.trim() });
      searchInput.value = state.q;
      if (afterSubmit) afterSubmit();
      scrollToEl($("#programs"));
    });
  }
  wireSearch("#header-search", "#header-search-input");
  wireSearch("#drawer-search", "#drawer-search-input", function () { closeLayer(drawer); });

  /* ---------- login (demo) ---------- */
  var loginModal = $("#login-modal");
  var loginBtn = $("#open-login");
  var user = store.get("sl.user", null);
  function paintLogin() {
    loginBtn.textContent = user ? "Log out" : "Log in";
    loginBtn.setAttribute("aria-label", user ? "Log out " + user : "Log in");
    loginBtn.removeAttribute("aria-haspopup");
    if (!user) loginBtn.setAttribute("aria-haspopup", "dialog");
    $("#drawer-login").textContent = user ? "Log out (" + user + ")" : "Log in";
  }
  function handleLoginClick(trigger) {
    if (user) { user = null; store.set("sl.user", null); paintLogin(); toast("Logged out"); }
    else openLayer(loginModal, trigger, "#login-email");
  }
  loginBtn.addEventListener("click", function (e) { handleLoginClick(e.currentTarget); });
  function loginValidate() {
    var e = $("#login-email").value.trim(), p = $("#login-pass").value;
    var okE = fieldError("login-email", !e ? "Enter your email address." : emailValid(e) ? "" : "Enter a valid email, for example you@example.com.");
    var okP = fieldError("login-pass", p.length >= 6 ? "" : "Password must be at least 6 characters.");
    return { ok: okE && okP, firstBad: !okE ? $("#login-email") : $("#login-pass") };
  }
  $("#login-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var r = loginValidate();
    if (!r.ok) { r.firstBad.focus(); return; }
    var local = $("#login-email").value.trim().split("@")[0].replace(/[^a-zA-Z0-9]+/g, " ").trim().split(" ")[0] || "learner";
    user = local.charAt(0).toUpperCase() + local.slice(1);
    store.set("sl.user", user);
    $("#login-form").reset();
    closeLayer(loginModal);
    paintLogin();
    toast("Welcome, " + user + " (demo login)");
  });
  $("#login-form").addEventListener("focusout", function (e) {
    if ((e.target.id === "login-email" || e.target.id === "login-pass") && e.target.value) loginValidate();
  });

  /* ---------- hero shortcuts ---------- */
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-goto-programs]");
    if (!b) return;
    var kind = b.getAttribute("data-goto-programs");
    if (kind === "popular") SL.applyFilter({ cat: "popular", durations: [], levels: [], q: "" }, true);
    else if (kind === "short") SL.applyFilter({ cat: "all", durations: ["short"], levels: [], q: "" }, true);
  });

  /* ---------- init ---------- */
  function init() {
    updateCounts();
    paintLogin();
    if (!COURSES || !COURSES.length) {
      grid.setAttribute("aria-busy", "false");
      grid.innerHTML = '<div class="state state--error" role="alert"><h3>We could not load the programs</h3><p>Check your connection and try again.</p><button type="button" class="btn btn--primary" data-retry>Try again</button></div>';
      return;
    }
    megaCats();
    megaCourses();
    $("#drawer-cats").innerHTML = [{ id: "popular", name: "Most Popular" }].concat(CATS).map(function (c) {
      return '<li><button type="button" data-dcat="' + c.id + '">' + esc(c.name) + '</button></li>';
    }).join("");
    grid.setAttribute("aria-busy", "true");
    grid.innerHTML = skeletons(6);
    renderFilters();
    setTimeout(renderCatalog, reducedMotion.matches ? 0 : 450);
  }
  init();
})();
