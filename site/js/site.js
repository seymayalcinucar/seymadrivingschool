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

  document.querySelectorAll('a[href^="tel:"]').forEach(function (link) {
    link.addEventListener("click", function () {
      track("call_tap");
    });
  });

  // js/consent.js defines gtag only after the visitor accepts analytics cookies, so nothing is
  // counted for anyone else.
  function track(name, params) {
    if (typeof window.gtag === "function") {
      window.gtag("event", name, params || {});
    }
  }

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
    // The Turkish pages (site/tr/) write the same message in Turkish.
    var words = document.documentElement.lang === "tr" ? {
      hello: "Merhaba Seyma Hanım, otomatik vites direksiyon dersi almak istiyorum.",
      name: "Ad soyad",
      area: "Semt/posta kodu",
      before: "Daha önce ders",
      yes: "Evet",
      no: "Hayır",
      times: "Uygun zamanlar"
    } : {
      hello: "Hi Seyma, I'd like to arrange automatic driving lessons.",
      name: "Name",
      area: "Area/postcode",
      before: "Lessons before",
      yes: "Yes",
      no: "No",
      times: "Available"
    };

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
      var before = fields.before.value === "yes" ? words.yes + (hours ? " (" + hours + ")" : "") : words.no;
      var message = [
        words.hello,
        "",
        words.name + ": " + fields.name.value.trim(),
        words.area + ": " + fields.area.value.trim(),
        words.before + ": " + before,
        words.times + ": " + fields.times.value.trim()
      ].join("\n");
      var url = whatsapp + "?text=" + encodeURIComponent(message);
      track("generate_lead", { method: "whatsapp" });

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
