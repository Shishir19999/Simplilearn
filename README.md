# Simplilearn homepage clone (practice project)

A static front-end practice clone of the Simplilearn homepage: header with mega menu, banner with video, partner logo scroller, program cards, bootcamp features and ratings.

## Files
- `index.html` - the page (uses `CSS/style.css`)
- `style.scss` - SCSS source, the single source of truth (includes the responsive `@media` rules)
- `CSS/style.css` (+ `.map`) - compiled output used by the page (do not edit by hand)
- `style.css` / `style.css.map` in the project root - an older, different compile output, NOT used by the page (kept, not deleted; it still has the old `/img/banner.avif` path and may be removed if you do not need it)
- `img/`, `video/` - assets

## Responsive behaviour
`@media` rules (at the end of `style.scss`) cover tablets (<=1200px, <=992px) and phones (<=600px). Below 992px the top links, "All Courses" and search collapse behind a hamburger button (small inline script at the bottom of `index.html`).

## Notes
- Links are placeholders pointing to in-page anchors (`#programs`, `#reviews`, `#career-partner-content`); "Simplilearn for Business", "Become an Instructor" and "Resources" remain `#`.
- CSS build: `npm install` once, then `npm run build:css` (runs `sass --style=expanded --source-map style.scss CSS/style.css`), which also refreshes `CSS/style.css.map`. The obsolete `::-moz-placeholder` rule from the old compile is no longer emitted; modern Firefox supports `::placeholder`.
- Open `index.html` directly in a browser; Google Fonts and a few images load from the internet.
