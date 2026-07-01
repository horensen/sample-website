/* ===================================================================
   QuickBite — marketing site interactions
   Pure vanilla JS, no dependencies
   =================================================================== */
(function () {
  "use strict";

  /* ---- Current year in footer ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Sticky header shadow on scroll ---- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (window.scrollY > 8) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Mobile nav toggle ---- */
  var toggle = document.getElementById("navToggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });
    // Close the menu after picking a link
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        nav.classList.remove("open");
        toggle.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---- FAQ accordion ---- */
  var accItems = document.querySelectorAll(".acc-item");
  accItems.forEach(function (item) {
    var q = item.querySelector(".acc-q");
    var a = item.querySelector(".acc-a");
    q.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");
      // Close all (single-open accordion)
      accItems.forEach(function (other) {
        other.classList.remove("open");
        other.querySelector(".acc-q").setAttribute("aria-expanded", "false");
        other.querySelector(".acc-a").style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add("open");
        q.setAttribute("aria-expanded", "true");
        a.style.maxHeight = a.scrollHeight + "px";
      }
    });
  });

  /* ---- Reveal-on-scroll ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---- Animated stat counters ---- */
  var counters = document.querySelectorAll(".stat-num");
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1400;
    var start = null;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      var value = Math.round(target * eased);
      el.textContent = value.toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if ("IntersectionObserver" in window && counters.length) {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { countObserver.observe(el); });
  }

  /* ---- Live ETA ticker in the hero phone ---- */
  var eta = document.getElementById("etaClock");
  if (eta) {
    var minutes = 12;
    setInterval(function () {
      minutes = minutes > 4 ? minutes - 1 : 12;
      eta.textContent = minutes + " min";
    }, 2600);
  }

  /* ---- Email capture form (demo only) ---- */
  var form = document.getElementById("orderForm");
  var note = document.getElementById("formNote");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = document.getElementById("emailInput");
      var value = (input.value || "").trim();
      var valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      if (!valid) {
        note.style.color = "#c0392b";
        note.textContent = "Please enter a valid email address.";
        input.focus();
        return;
      }
      note.style.color = "#16a36a";
      note.textContent = "🎉 Thanks! We'll send your download link to " + value + ".";
      form.reset();
    });
  }
})();
