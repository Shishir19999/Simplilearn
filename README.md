# Simplilearn Clone (practice project)

A front-end practice clone of an online-learning homepage, extended into a small working site: searchable course catalog, filters, wishlist, a mock enrollment flow, light and dark themes. Plain HTML, SCSS and vanilla JavaScript, no frameworks.

**Live demo:** https://shishir19999.github.io/Simplilearn/

> Program names, prices and statistics are sample content. The cart and enrollment are simulated: nothing is sent anywhere, and no payment is taken. Not affiliated with the original company.

## Features

- **Course catalog** (29 sample programs in `js/data.js`) with live search, category, level and duration filters, six sort orders, active-filter chips, "show more" paging, skeleton loading, empty and error states
- **Course detail modal** with facts, inclusions, skills and curriculum
- **Wishlist** and **cart** persisted in `localStorage`, bundle discount, and an enrollment flow with inline validation and a confirmation summary
- **Mega menu** (hover, click and keyboard) that lists programs per category, plus a **mobile drawer** with search and categories
- **Hero carousel** with pause/play, previous/next, dots, arrow keys, and pause on hover or focus
- **Testimonials slider** (scroll-snap, buttons, dots), **FAQ accordion**, **newsletter form** with validation (addresses stored locally only), demo log-in form
- **Light and dark theme** toggle that follows the system setting and remembers your choice
- **Scroll reveal and parallax**: fade/slide-ins for cards and sections, and a gentle depth effect on the hero, partner logos, bootcamp cards, testimonials and section backgrounds. It only uses `translate`, `transform` and `opacity`, is driven by `IntersectionObserver` and `requestAnimationFrame`, never hijacks scrolling, and is fully switched off for `prefers-reduced-motion`, small screens (under 900px) and low-power or data-saver devices
- **Accessibility**: skip link, labelled controls, visible focus rings, focus trapping and return in dialogs, `aria-live` status messages, AA contrast, keyboard support, reduced-motion support
- **Responsive** from 320px, lazy-loaded images, video with poster and `preload="none"`, favicon, Open Graph and Twitter tags, and a `404.html`

## Run locally

Any static server works (the site uses relative paths, so it also runs under a sub-path such as `/Simplilearn/`):

```bash
npx serve .
# or
python -m http.server 8000
```

Opening `index.html` directly also works.

## Build the CSS

`style.scss` is the single source of truth; `CSS/style.css` (and its `.map`) is the compiled output used by the page. Do not edit the compiled file by hand.

```bash
npm install        # once
npm run build:css  # sass --style=expanded --source-map style.scss CSS/style.css
```

## Project structure

```
index.html        page markup
404.html          not-found page
style.scss        styles (design tokens, components, themes, responsive rules)
CSS/              compiled CSS + source map
js/theme-init.js  sets the theme before first paint
js/data.js        categories, courses, testimonials
js/app.js         catalog, filters, modal, wishlist, cart, menus, forms
js/enhance.js     theme toggle, carousel, slider, FAQ, newsletter, reveal, parallax
img/, video/      assets
```

## Deploy (GitHub Pages)

Publish the repository root from the main branch (Settings, Pages). All links and assets are relative, so the site works at `https://<user>.github.io/Simplilearn/`. The `404.html` links back to `/Simplilearn/`; change that path if you host elsewhere.

Note: icon files that were stored as `.svgz` are also provided as plain `.svg` (the page uses the `.svg` copies) because static hosts often do not send the gzip header those files need.
