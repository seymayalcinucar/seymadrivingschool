(function () {
  var header = document.querySelector(".site-header");

  function onScroll() {
    header.classList.toggle("is-stuck", window.scrollY > 8);
  }

  if (header) {
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  enquiryForm();
  revealOnScroll();

  // Every WhatsApp button opens the enquiry form. Its answers become the WhatsApp message, so
  // nothing leaves the visitor's device until they press send in WhatsApp. Without <dialog>
  // support the buttons stay plain WhatsApp links with the same questions as blanks.
  function enquiryForm() {
    var dialog = document.getElementById("enquiry");
    var links = document.querySelectorAll("a[data-enquiry]");
    if (!dialog || !links.length || typeof dialog.showModal !== "function") {
      return;
    }

    var form = dialog.querySelector("form");
    var fields = form.elements;
    var hoursRow = dialog.querySelector("[data-hours]");
    var whatsapp = links[0].href.split("?")[0];

    links.forEach(function (link) {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        dialog.showModal();
      });
    });

    // seymadrivingschool.com/#enquiry opens the form directly.
    if (window.location.hash === "#enquiry") {
      dialog.showModal();
    }

    dialog.querySelector("[data-close]").addEventListener("click", function () {
      dialog.close();
    });

    // A click on the dimmed backdrop lands on the dialog element itself.
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) {
        dialog.close();
      }
    });

    form.addEventListener("change", function () {
      hoursRow.hidden = fields.before.value !== "yes";
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var hours = fields.hours.value.trim();
      var before = fields.before.value === "yes" ? "Yes" + (hours ? " (" + hours + ")" : "") : "No";
      var message = [
        "Hi Seyma, I'd like to arrange automatic driving lessons.",
        "",
        "Name: " + fields.name.value.trim(),
        "Area/postcode: " + fields.area.value.trim(),
        "Lessons before: " + before,
        "Available: " + fields.times.value.trim()
      ].join("\n");
      var url = whatsapp + "?text=" + encodeURIComponent(message);

      var opened = window.open(url, "_blank");
      if (opened) {
        opened.opener = null;
      } else {
        window.location.href = url;
      }
      dialog.close();
    });
  }

  // Fade sections in as they scroll into view. Without IntersectionObserver, show everything.
  function revealOnScroll() {
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
  }
})();
