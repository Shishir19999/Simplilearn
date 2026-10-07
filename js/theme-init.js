/* Runs before first paint to avoid a theme flash. */
(function () {
  var root = document.documentElement;
  var saved = null;
  try { saved = localStorage.getItem("sl.theme"); } catch (e) { /* storage unavailable */ }
  var dark = saved ? saved === "dark" : window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.setAttribute("data-theme", dark ? "dark" : "light");
  root.classList.add("js");
})();
