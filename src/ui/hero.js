import { heroSlides } from "../data/storeData.js";
import { state } from "../state/storeState.js";

const d = document;

export const renderHero = () => {
    const heroTrack = d.getElementById("hero-track");
    const heroDots = d.getElementById("hero-dots");

    if (!heroTrack || !heroDots) return;

    heroTrack.innerHTML = heroSlides
        .map(
            (slide, index) => `
        <article class="hero-slide ${index === state.currentSlide ? "active" : ""}">
          <div class="hero-slide-overlay"></div>
          <img src="${slide.image}" alt="${slide.title}" />
          <div class="hero-copy">
            <p class="eyebrow">${slide.tag}</p>
            <h1>${slide.title}</h1>
            <p class="hero-text">${slide.text}</p>
            <div class="hero-actions">
              <a href="#tienda" class="cta primary">${slide.button}</a>
              <a href="#destacados" class="cta secondary">Ver oferta</a>
            </div>
            <ul class="hero-stats" aria-label="Estadísticas de la tienda">
              <li><strong>24h</strong><span>Envío</span></li>
              <li><strong>4.9/5</strong><span>Valoración</span></li>
              <li><strong>1200+</strong><span>Estilos</span></li>
            </ul>
          </div>
        </article>
      `
        )
        .join("");

    heroDots.innerHTML = heroSlides
        .map(
            (_, index) => `
        <button class="dot ${index === state.currentSlide ? "active" : ""}" type="button" data-index="${index}" aria-label="Ir al slide ${index + 1}"></button>
      `
        )
        .join("");

    d.querySelectorAll(".dot").forEach((dot) => {
        dot.addEventListener("click", () => {
            state.currentSlide = Number(dot.dataset.index);
            renderHero();
        });
    });
};

export const startHeroCarousel = () => {
    setInterval(() => {
        state.currentSlide = (state.currentSlide + 1) % heroSlides.length;
        renderHero();
    }, 4000);
};
