window.fadeOut = function (selector) {
  const el = document.querySelector(selector);

  if (!el) return;

  el.style.opacity = 1;

  (function fade() {
    if ((el.style.opacity -= 0.1) < 0) {
      el.style.display = "";
    } else {
      requestAnimationFrame(fade);
    }
  })();
};

window.fadeIn = function (selector, display = "block") {
  const el = document.querySelector(selector);

  if (!el) return;

  el.style.opacity = 0;
  el.style.display = display;

  (function fade() {
    var val = parseFloat(el.style.opacity);
    if (!((val += 0.1) > 1)) {
      el.style.opacity = val;
      requestAnimationFrame(fade);
    }
  })();
};
