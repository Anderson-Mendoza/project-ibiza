import hamburgerMenu from "../menu_desplegable.js";
import { renderHero, startHeroCarousel } from "./ui/hero.js";
import { bindHeaderBehavior } from "./ui/header.js";
import { bindCartControls, renderCart, updateCartCount } from "./ui/cart.js";
import { bindFilters, renderCategories, renderFeatured, renderProductDetail, renderProducts } from "./ui/catalog.js";

const d = document;

d.addEventListener("DOMContentLoaded", () => {
    hamburgerMenu(".panel-btn", ".panel", ".menu a");
    renderHero();
    startHeroCarousel();
    renderCategories();
    renderFeatured();
    renderProducts();
    renderProductDetail();
    renderCart();
    updateCartCount();
    bindFilters();
    bindCartControls();
    bindHeaderBehavior();
});
