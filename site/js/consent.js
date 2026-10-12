// Google Analytics 4, behind an opt-in cookie banner.
//
// Nothing is requested from Google and no cookie is set until the visitor presses Accept. The choice
// is kept in local storage and can be changed at any time from the "Cookie settings" button in the
// footer. Rejecting after accepting switches Analytics off on the page and deletes its cookies.
//
// Consent Mode v2: everything is denied by default and only analytics storage is ever granted. Google
// signals and ad personalisation stay off.
(function () {
  "use strict";

  var MEASUREMENT_ID = "G-Y35MRWPQNZ";
  var STORAGE_KEY = "sds-analytics-consent";
  var CHOICE_VERSION = 1;
  var GRANTED = "granted";
  var DENIED = "denied";
  var POLICY_HREF = "privacy.html";

  var gaLoaded = false;
  var returnFocusTo = null;

  function readChoice() {
    try {
      var parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
      if (parsed && parsed.v === CHOICE_VERSION && (parsed.analytics === GRANTED || parsed.analytics === DENIED)) {
        return parsed.analytics;
      }
    } catch (e) { /* unreadable storage = no choice yet */ }
    return null;
  }

  function writeChoice(choice) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ v: CHOICE_VERSION, analytics: choice, at: new Date().toISOString() }));
    } catch (e) { /* storage blocked: the choice holds for this page view only */ }
  }

  function gtag() {
    // gtag.js reads ARGUMENTS objects off the dataLayer, never arrays.
    window.dataLayer.push(arguments);
  }

  function loadGoogleAnalytics() {
    if (gaLoaded) {
      return;
    }
    gaLoaded = true;
    window["ga-disable-" + MEASUREMENT_ID] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = gtag;
    gtag("consent", "default", {
      ad_storage: DENIED,
      ad_user_data: DENIED,
      ad_personalization: DENIED,
      analytics_storage: DENIED
    });
    gtag("consent", "update", { analytics_storage: GRANTED });
    gtag("js", new Date());
    gtag("config", MEASUREMENT_ID, { allow_google_signals: false, allow_ad_personalization_signals: false });
    var script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(MEASUREMENT_ID);
    document.head.appendChild(script);
  }

  function deleteAnalyticsCookies() {
    var names = (document.cookie || "").split(";").map(function (pair) {
      return pair.split("=")[0].trim();
    }).filter(function (name) {
      return /^_ga($|_)/.test(name) || name === "_gid" || /^_gat/.test(name);
    });
    var parts = String(window.location.hostname || "").split(".");
    var domains = [""];
    for (var i = 0; i < parts.length - 1; i++) {
      domains.push("; domain=." + parts.slice(i).join("."));
    }
    names.forEach(function (name) {
      domains.forEach(function (domain) {
        document.cookie = name + "=; Max-Age=0; path=/" + domain;
      });
    });
  }

  function stopGoogleAnalytics() {
    window["ga-disable-" + MEASUREMENT_ID] = true;
    if (gaLoaded) {
      gtag("consent", "update", { analytics_storage: DENIED });
    }
    deleteAnalyticsCookies();
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) {
      node.className = className;
    }
    if (text) {
      node.textContent = text;
    }
    return node;
  }

  function closeBanner() {
    var banner = document.getElementById("cookie-banner");
    if (banner) {
      banner.remove();
    }
    if (returnFocusTo) {
      returnFocusTo.focus();
    }
    returnFocusTo = null;
  }

  function choose(choice) {
    writeChoice(choice);
    closeBanner();
    if (choice === GRANTED) {
      loadGoogleAnalytics();
    } else {
      stopGoogleAnalytics();
    }
  }

  // Accept and Reject are the same size and style, so neither is easier to press than the other.
  function showBanner(focusIt) {
    if (document.getElementById("cookie-banner")) {
      return;
    }
    var banner = el("div", "cookie-banner");
    banner.id = "cookie-banner";
    banner.setAttribute("role", "region");
    banner.setAttribute("aria-labelledby", "cookie-banner-heading");

    var heading = el("h2", "", "Cookies on this website");
    heading.id = "cookie-banner-heading";
    banner.appendChild(heading);

    var text = el("p", "", "We would like to use Google Analytics cookies to see how people use this website, so we can improve it. They are optional: we only set them if you accept. ");
    var link = el("a", "", "Privacy and cookies");
    link.setAttribute("href", POLICY_HREF);
    text.appendChild(link);
    banner.appendChild(text);

    var actions = el("div", "cookie-actions");
    var accept = el("button", "btn btn-brand", "Accept analytics cookies");
    accept.type = "button";
    accept.addEventListener("click", function () {
      choose(GRANTED);
    });
    var reject = el("button", "btn btn-brand", "Reject analytics cookies");
    reject.type = "button";
    reject.addEventListener("click", function () {
      choose(DENIED);
    });
    actions.appendChild(accept);
    actions.appendChild(reject);
    banner.appendChild(actions);

    document.body.appendChild(banner);
    if (focusIt) {
      accept.focus();
    }
  }

  document.querySelectorAll("[data-cookie-settings]").forEach(function (button) {
    button.addEventListener("click", function () {
      closeBanner();
      returnFocusTo = button;
      showBanner(true);
    });
  });

  var choice = readChoice();
  if (choice === GRANTED) {
    loadGoogleAnalytics();
  } else if (choice === DENIED) {
    stopGoogleAnalytics();
  } else {
    showBanner(false);
  }
})();
