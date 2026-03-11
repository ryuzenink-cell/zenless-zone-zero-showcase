document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".hero");
  const visualFrame = document.querySelector(".hero__visual-frame");
  const glowOne = document.querySelector(".hero__glow--one");
  const glowTwo = document.querySelector(".hero__glow--two");
  const floatingCards = document.querySelectorAll(".hero__floating-card");
  const metaCards = document.querySelectorAll(".hero__meta-card");
  const infoCards = document.querySelectorAll(".hero__info-card");
  const buttons = document.querySelectorAll(".hero__button");
  const title = document.querySelector(".hero__title");
  const eyebrow = document.querySelector(".hero__eyebrow");
  const description = document.querySelector(".hero__description");
  const topbar = document.querySelector(".hero__topbar");
  const bottomCards = document.querySelector(".hero__bottom");

  if (!hero) return;

  const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* =========================
     REVEAL INICIAL
  ========================= */
  const introTargets = [
    topbar,
    eyebrow,
    title,
    description,
    ...buttons,
    ...metaCards,
    visualFrame,
    bottomCards
  ].filter(Boolean);

  introTargets.forEach((element) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(24px)";
    element.style.transition =
      "opacity 0.8s ease, transform 0.8s cubic-bezier(.2,.8,.2,1)";
  });

  const runIntroAnimation = () => {
    introTargets.forEach((element, index) => {
      setTimeout(() => {
        element.style.opacity = "1";
        element.style.transform = "translateY(0)";
      }, 120 * index);
    });
  };

  if (!isReducedMotion) {
    requestAnimationFrame(() => {
      setTimeout(runIntroAnimation, 150);
    });
  } else {
    introTargets.forEach((element) => {
      element.style.opacity = "1";
      element.style.transform = "translateY(0)";
    });
  }

  /* =========================
     PARALLAX SUAVE
     (sem mover o personagem)
  ========================= */
  if (!isReducedMotion) {
    hero.addEventListener("mousemove", (event) => {
      const rect = hero.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const moveX = (x - centerX) / centerX;
      const moveY = (y - centerY) / centerY;

      if (visualFrame) {
        visualFrame.style.transform = `
          translate3d(${moveX * 8}px, ${moveY * 8}px, 0)
          rotateX(${moveY * -2.5}deg)
          rotateY(${moveX * 3}deg)
        `;
      }

      if (glowOne) {
        glowOne.style.transform = `translate(${moveX * 16}px, ${moveY * 18}px)`;
      }

      if (glowTwo) {
        glowTwo.style.transform = `translate(${moveX * -14}px, ${moveY * -14}px)`;
      }

      floatingCards.forEach((card, index) => {
        const factor = index === 0 ? 10 : -10;
        card.style.transform = `translate3d(${moveX * factor}px, ${moveY * factor}px, 0)`;
      });
    });

    hero.addEventListener("mouseleave", () => {
      if (visualFrame) {
        visualFrame.style.transform = "translate3d(0,0,0) rotateX(0) rotateY(0)";
      }

      if (glowOne) {
        glowOne.style.transform = "translate(0,0)";
      }

      if (glowTwo) {
        glowTwo.style.transform = "translate(0,0)";
      }

      floatingCards.forEach((card) => {
        card.style.transform = "translate3d(0,0,0)";
      });
    });
  }

  /* =========================
     TILT NOS CARDS
  ========================= */
  const tiltElements = [...metaCards, ...infoCards];

  tiltElements.forEach((card) => {
    card.style.transition =
      "transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease";

    if (isReducedMotion) return;

    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const rotateX = ((y / rect.height) - 0.5) * -8;
      const rotateY = ((x / rect.width) - 0.5) * 10;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(800px) rotateX(0) rotateY(0) translateY(0)";
    });
  });

  /* =========================
     GLITCH SUTIL NO TÍTULO
  ========================= */
  const glitchTitle = () => {
    if (!title || isReducedMotion) return;

    title.style.transition = "transform 0.08s ease, filter 0.08s ease";
    title.style.transform = "translateX(2px) skewX(1deg)";
    title.style.filter =
      "drop-shadow(2px 0 rgba(255,122,0,.18)) drop-shadow(-2px 0 rgba(0,209,255,.18))";

    setTimeout(() => {
      title.style.transform = "translateX(-2px) skewX(-1deg)";
    }, 60);

    setTimeout(() => {
      title.style.transform = "translateX(0) skewX(0)";
      title.style.filter = "none";
    }, 120);
  };

  if (!isReducedMotion) {
    setInterval(glitchTitle, 5000);
  }

  /* =========================
     FLOAT AUTOMÁTICO
  ========================= */
  if (!isReducedMotion) {
    let time = 0;

    const animate = () => {
      time += 0.01;

      floatingCards.forEach((card, index) => {
        const offsetY = Math.sin(time * 1.8 + index) * 6;
        const offsetX = Math.cos(time * 1.3 + index) * 4;
        card.style.translate = `${offsetX}px ${offsetY}px`;
      });

      requestAnimationFrame(animate);
    };

    animate();
  }

  /* =========================
     SCROLL REVEAL
  ========================= */
  const revealElements = [...metaCards, ...infoCards, ...floatingCards];

  revealElements.forEach((element) => {
    element.style.opacity = "0";
    element.style.transform += " translateY(20px)";
    element.style.transition = "opacity 0.7s ease, transform 0.7s ease";
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = entry.target.style.transform.replace(" translateY(20px)", "");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18
    }
  );

  revealElements.forEach((element) => observer.observe(element));

  /* =========================
     EFEITO DE LUZ NO FRAME
  ========================= */
  if (visualFrame && !isReducedMotion) {
    const light = document.createElement("div");
    light.className = "hero__frame-light";
    light.style.position = "absolute";
    light.style.inset = "0";
    light.style.pointerEvents = "none";
    light.style.borderRadius = "inherit";
    light.style.background =
      "radial-gradient(circle at center, rgba(255,255,255,0.12), transparent 28%)";
    light.style.opacity = "0";
    light.style.transition = "opacity 0.25s ease";
    visualFrame.appendChild(light);

    visualFrame.addEventListener("mousemove", (event) => {
      const rect = visualFrame.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      light.style.opacity = "1";
      light.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.16), transparent 30%)`;
    });

    visualFrame.addEventListener("mouseleave", () => {
      light.style.opacity = "0";
    });
  }
});