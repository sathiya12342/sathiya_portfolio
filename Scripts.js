document.addEventListener("DOMContentLoaded", () => {
  console.log("Scripts.js loaded");

// ---------- TYPING EFFECT (Infinite Loop) ----------
const text = "Fresher | Full Stack Python Developer";
const typingElement = document.getElementById("typing-text");

if (typingElement) {
  let i = 0;
  let isDeleting = false;

  function type() {
    if (!isDeleting) {
      // typing forward
      typingElement.textContent = text.substring(0, i++);
      if (i > text.length) {
        isDeleting = true;
        setTimeout(type, 1200); // pause before deleting
        return;
      }
    } else {
      // deleting backward
      typingElement.textContent = text.substring(0, i--);
      if (i < 0) {
        isDeleting = false;
        i = 0;
      }
    }
    setTimeout(type, isDeleting ? 60 : 100); // faster delete
  }

  type();
}


  // ---------- PROJECTS INFINITE MARQUEE (requestAnimationFrame) ----------
  (function initProjectsMarquee() {
    const viewport = document.querySelector(".projects-viewport");
    const track = document.querySelector(".projects-track");
    if (!viewport || !track) {
      console.warn("Marquee: .projects-viewport or .projects-track not found.");
      return;
    }

    // clone only once
    if (!track.dataset.cloned) {
      const children = Array.from(track.children);
      children.forEach(node => track.appendChild(node.cloneNode(true)));
      track.dataset.cloned = "true";
      console.log("Marquee: cloned items");
    }

    // wait for images to be ready to measure correctly
    const imgs = track.querySelectorAll("img");
    let pending = imgs.length;
    if (pending === 0) {
      startMarquee();
    } else {
      imgs.forEach(img => {
        if (img.complete) {
          pending--;
        } else {
          img.addEventListener("load", () => { pending--; if (pending === 0) startMarquee(); });
          img.addEventListener("error", () => { pending--; if (pending === 0) startMarquee(); });
        }
      });
      // safety fallback
      setTimeout(() => { if (pending > 0) startMarquee(); }, 2000);
    }

   function startMarquee() {
  // measure the width of the original set (half of track after cloning)
  let originalWidth = track.scrollWidth / 2;
  if (!originalWidth || originalWidth < 10) {
    const kids = Array.from(track.children);
    const half = Math.floor(kids.length / 2);
    originalWidth = kids.slice(0, half).reduce((sum, el) => sum + el.getBoundingClientRect().width, 0);
  }
  console.log("Marquee start, width:", originalWidth);

  // animation state
  let offset = 0;
  let last = performance.now();
  let isPaused = false;
  const speed = 40; // px per second — tweak to change speed

  // ✅ reset transform before animation loop
  track.style.transform = "translateX(0)";

  function frame(now) {
    const dt = now - last;
    last = now;
    if (!isPaused && originalWidth > 0) {
      offset += (speed * dt) / 1000;
      if (offset >= originalWidth) offset -= originalWidth;
      track.style.transform = `translateX(-${offset}px)`;
    }
    requestAnimationFrame(frame);
  }

      // Pause on hover/touch
      viewport.addEventListener("mouseenter", () => { isPaused = true; viewport.classList.add("paused"); });
      viewport.addEventListener("mouseleave", () => { isPaused = false; viewport.classList.remove("paused"); });
      viewport.addEventListener("touchstart", () => { isPaused = true; viewport.classList.add("paused"); }, { passive: true });
      viewport.addEventListener("touchend", () => { isPaused = false; viewport.classList.remove("paused"); }, { passive: true });

      // recalc width on resize
      let rt;
      window.addEventListener("resize", () => {
        clearTimeout(rt);
        rt = setTimeout(() => {
          originalWidth = track.scrollWidth / 2;
          console.log("Marquee recalculated width:", originalWidth);
        }, 120);
      });

      requestAnimationFrame(frame);
    }
  })();

  // ---------- NAVBAR (hamburger) ----------
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => navLinks.classList.toggle("active"));
  }

  // ---------- SMOOTH SCROLL ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // ---------- SKILLS INTERSECTION OBSERVER ----------
  const skillCards = document.querySelectorAll(".skill-card");
  if (skillCards.length) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    skillCards.forEach(card => observer.observe(card));
  }

  // ---------- CONTACT FORM ----------
  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("✅ Thank you! Your message has been sent.");
      contactForm.reset();
    });
  }

  // ---------- ABOUT TABS ----------
  const tablinks = document.querySelectorAll(".tablinks");
  const tabcontents = document.querySelectorAll(".tabcontents");
  if (tablinks.length) {
    tablinks.forEach(link => {
      link.addEventListener("click", (e) => {
        tablinks.forEach(t => t.classList.remove("active-link"));
        tabcontents.forEach(c => c.classList.remove("active-tab"));
        e.currentTarget.classList.add("active-link");
        // fallback: support inline onclick format
        let targetId = e.currentTarget.dataset.target;
        if (!targetId) {
          const onclick = e.currentTarget.getAttribute("onclick");
          if (onclick) {
            const m = onclick.match(/opentab\(\s*event\s*,\s*['"]([^'"]+)['"]\s*\)/);
            if (m) targetId = m[1];
          }
        }
        if (targetId) {
          const target = document.getElementById(targetId);
          if (target) target.classList.add("active-tab");
        }
      });
    });
  }


  // ---------- FOOTER YEAR AUTO-UPDATE ----------
  const footerFirstP = document.querySelector(".footer-container p");
  if (footerFirstP) {
    footerFirstP.textContent = `© ${new Date().getFullYear()} J. SathiyaPriya | Python Full Stack Developer`;
  }
});
