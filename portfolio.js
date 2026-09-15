(() => {
  const menuButton = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector("#mobile-menu");
  menuButton?.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!open));
    menuButton.setAttribute("aria-label", open ? "Open menu" : "Close menu");
    mobileMenu.hidden = open;
  });
  mobileMenu?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    mobileMenu.hidden = true;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open menu");
  }));

  const motionAllowed = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (motionAllowed && "IntersectionObserver" in window) {
    const revealTargets = document.querySelectorAll(".section-intro, .skill-item, .projects-heading, .project, .contact-layout");
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: .12 });
    revealTargets.forEach(target => { target.classList.add("reveal"); revealObserver.observe(target); });
  }

  const navLinks = document.querySelectorAll(".nav a");
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    document.querySelectorAll("main > section[id]").forEach(section => sectionObserver.observe(section));
  }

  if (motionAllowed) {
    let queued = false;
    const update = () => {
      const progress = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1);
      document.querySelector(".about")?.style.setProperty("--scroll", String(progress));
      queued = false;
    };
    window.addEventListener("scroll", () => {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(update);
    }, { passive: true });
  }
  document.querySelector("#year").textContent = String(new Date().getFullYear());
})();

