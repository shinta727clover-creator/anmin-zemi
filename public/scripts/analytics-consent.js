/* 安眠ゼミ：Google Analytics 4 基本同意モード（同意前はタグ未読込） */
(function () {
  "use strict";

  const panel = document.getElementById("analytics-consent");
  const preferences = document.getElementById("analytics-preferences");
  const accept = document.getElementById("analytics-accept");
  const decline = document.getElementById("analytics-decline");
  if (!panel || !preferences || !accept || !decline) return;

  const measurementId = panel.getAttribute("data-ga-id");
  if (!measurementId || !/^G-[A-Z0-9]+$/.test(measurementId)) return;

  const storageKey = "anmin-zemi-ga4-consent-v1";
  let tagLoaded = false;

  function getChoice() {
    try {
      return localStorage.getItem(storageKey);
    } catch (_) {
      return null;
    }
  }

  function rememberChoice(choice) {
    try {
      localStorage.setItem(storageKey, choice);
    } catch (_) {
      // Browsers with blocked storage can still use this page's selection.
    }
  }

  function gtag() {
    window.dataLayer.push(arguments);
  }

  function activateAnalytics() {
    window["ga-disable-" + measurementId] = false;
    if (tagLoaded) {
      gtag("consent", "update", { analytics_storage: "granted" });
      return;
    }

    // Consent commands are queued before the Google tag is fetched.
    window.dataLayer = window.dataLayer || [];
    gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied"
    });
    gtag("consent", "update", { analytics_storage: "granted" });
    gtag("js", new Date());
    gtag("config", measurementId);

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(measurementId);
    document.head.appendChild(script);
    tagLoaded = true;
  }

  function disableAnalytics() {
    window["ga-disable-" + measurementId] = true;
    if (tagLoaded) {
      gtag("consent", "update", { analytics_storage: "denied" });
    }
  }

  function choose(value) {
    rememberChoice(value);
    panel.hidden = true;
    if (value === "accepted") activateAnalytics();
    else disableAnalytics();
    preferences.focus();
  }

  accept.addEventListener("click", function () { choose("accepted"); });
  decline.addEventListener("click", function () { choose("declined"); });
  preferences.addEventListener("click", function () {
    panel.hidden = false;
    accept.focus();
  });

  const initialChoice = getChoice();
  if (initialChoice === "accepted") activateAnalytics();
  else if (initialChoice === "declined") disableAnalytics();
  else panel.hidden = false;
})();
