(function () {
  var header = document.querySelector(".site-header");

  function onScroll() {
    header.classList.toggle("is-stuck", window.scrollY > 8);
  }

  if (header) {
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Fade sections in as they scroll into view. Without IntersectionObserver, show everything.
  var items = document.querySelectorAll("[data-reveal]");
  if (!("IntersectionObserver" in window)) {
    items.forEach(function (el) {
      el.classList.add("is-visible");
    });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  items.forEach(function (el) {
    observer.observe(el);
  });
})();
