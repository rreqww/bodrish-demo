document.body.classList.add("is-loading");

const loader = document.querySelector(".loader");

window.addEventListener("load", () => {
  window.setTimeout(() => {
    loader?.classList.add("is-hidden");
    document.body.classList.remove("is-loading");
  }, 420);
});

window.setTimeout(() => {
  loader?.classList.add("is-hidden");
  document.body.classList.remove("is-loading");
}, 3200);

const progress = document.querySelector(".scroll-progress");

const updateProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
  if (progress) progress.style.transform = `scaleX(${Math.min(1, ratio)})`;
};

window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

const revealItems = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14, rootMargin: "0px 0px -7%" });

revealItems.forEach((item) => revealObserver.observe(item));

const cursor = document.querySelector(".cursor");
let pointerX = window.innerWidth / 2;
let pointerY = window.innerHeight / 2;
let cursorX = pointerX;
let cursorY = pointerY;

const followCursor = () => {
  cursorX += (pointerX - cursorX) * 0.18;
  cursorY += (pointerY - cursorY) * 0.18;
  if (cursor) cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
  requestAnimationFrame(followCursor);
};

if (window.matchMedia("(pointer:fine)").matches) {
  document.addEventListener("pointermove", (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
  });
  document.querySelectorAll("a, button, .product-card").forEach((item) => {
    item.addEventListener("pointerenter", () => cursor?.classList.add("is-active"));
    item.addEventListener("pointerleave", () => cursor?.classList.remove("is-active"));
  });
  requestAnimationFrame(followCursor);
}

const depthItems = document.querySelectorAll("[data-depth]");
let parallaxFrame;

document.addEventListener("pointermove", (event) => {
  if (!window.matchMedia("(pointer:fine)").matches) return;
  cancelAnimationFrame(parallaxFrame);
  parallaxFrame = requestAnimationFrame(() => {
    const x = (event.clientX / window.innerWidth - 0.5) * 2;
    const y = (event.clientY / window.innerHeight - 0.5) * 2;
    depthItems.forEach((item) => {
      const depth = Number(item.dataset.depth || 0);
      item.style.translate = `${x * depth * 42}px ${y * depth * 30}px`;
    });
  });
});

const rail = document.querySelector(".product-rail");
const previousButton = document.querySelector(".rail-button--prev");
const nextButton = document.querySelector(".rail-button--next");

const moveRail = (direction) => {
  if (!rail) return;
  const firstCard = rail.querySelector(".product-card");
  const gap = parseFloat(getComputedStyle(rail).columnGap) || 0;
  const distance = (firstCard?.getBoundingClientRect().width || rail.clientWidth * 0.8) + gap;
  rail.scrollBy({ left: distance * direction, behavior: "smooth" });
};

previousButton?.addEventListener("click", () => moveRail(-1));
nextButton?.addEventListener("click", () => moveRail(1));

document.querySelectorAll(".product-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    if (!window.matchMedia("(pointer:fine)").matches) return;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(1100px) rotateY(${x * 5}deg) rotateX(${y * -4}deg)`;
  });
  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

document.querySelectorAll(".magnetic").forEach((item) => {
  item.addEventListener("pointermove", (event) => {
    if (!window.matchMedia("(pointer:fine)").matches) return;
    const rect = item.getBoundingClientRect();
    const x = event.clientX - (rect.left + rect.width / 2);
    const y = event.clientY - (rect.top + rect.height / 2);
    item.style.translate = `${x * 0.12}px ${y * 0.12}px`;
  });
  item.addEventListener("pointerleave", () => {
    item.style.translate = "0 0";
  });
});

const film = document.querySelector(".film video");
const soundButton = document.querySelector(".sound-toggle");

soundButton?.addEventListener("click", () => {
  if (!film) return;
  film.muted = !film.muted;
  soundButton.textContent = film.muted ? "Sound off" : "Sound on";
  soundButton.setAttribute("aria-label", film.muted ? "Включить звук видео" : "Выключить звук видео");
  if (film.paused) film.play().catch(() => {});
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});
