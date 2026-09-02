import { categories, featuredProducts, products } from "../data/storeData.js";
import { state, getFilteredProducts, saveState } from "../state/storeState.js";
import { addToCart, closeModal } from "./cart.js";

const d = document;

export const renderCategories = () => {
    const categoryGrid = d.getElementById("category-grid");
    if (!categoryGrid) return;

    categoryGrid.innerHTML = categories
        .map(
            ({ name, subtitle, image }) => `
        <article class="category-card">
          <img src="${image}" alt="${name}" />
          <div class="category-info">
            <span>${subtitle}</span>
            <h3>${name}</h3>
          </div>
        </article>
      `
        )
        .join("");
};

export const renderFeatured = () => {
    const featuredGrid = d.getElementById("featured-grid");
    if (!featuredGrid) return;

    featuredGrid.innerHTML = featuredProducts
        .map(
            ({ name, category, price, image }) => `
        <article class="mini-product">
          <img src="${image}" alt="${name}" />
          <div>
            <p>${category}</p>
            <h3>${name}</h3>
            <strong>$${price}</strong>
          </div>
        </article>
      `
        )
        .join("");
};

export const toggleFavorite = (productId) => {
    if (state.favorites.includes(productId)) {
        state.favorites = state.favorites.filter((id) => id !== productId);
    } else {
        state.favorites.push(productId);
    }

    saveState();
    renderProducts();
    renderProductDetail();
};

export const renderProductDetail = () => {
    const productDetail = d.getElementById("product-detail");
    if (!productDetail) return;

    const product = products.find((item) => item.id === state.selectedProductId) || products[0];
    const isFavorite = state.favorites.includes(product.id);

    productDetail.innerHTML = `
    <div class="detail-image-wrap">
      <img src="${product.image}" alt="${product.name}" />
    </div>
    <div class="detail-copy">
      <div class="detail-header-row">
        <div>
          <p class="detail-label">${product.badge}</p>
          <h3>${product.name}</h3>
        </div>
        <button class="favorite-btn ${isFavorite ? "active" : ""}" type="button" data-favorite-id="${product.id}" aria-label="Agregar a favoritos">
          ♡
        </button>
      </div>
      <p class="detail-category">${product.category}</p>
      <div class="detail-price-row">
        <strong>$${product.price}</strong>
        <span>$${product.oldPrice}</span>
      </div>
      <p class="detail-description">
        Diseño versátil con líneas limpias, tela suave y una silueta que se adapta a cualquier look.
      </p>
      <div class="swatches" aria-label="Colores disponibles">
        ${product.colors
            .map(
                (color) => `<span style="background:${color === "Negro" ? "#1c1c1c" :
                    color === "Blanco" ? "#f4f1eb" :
                        color === "Beige" ? "#d9c7a1" :
                            color === "Café" ? "#815d46" :
                                color === "Marrón" ? "#604335" :
                                    color === "Nude" ? "#dfc7b2" :
                                        color === "Rojo" ? "#be3e3e" :
                                            color === "Azul" ? "#4d678a" :
                                                color === "Verde" ? "#71856c" :
                                                    color === "Camel" ? "#b58d5f" :
                                                        color === "Crema" ? "#e7dcc5" :
                                                            color === "Gris" ? "#b8b8b8" : "#d6c5ca"};"></span>`
            )
            .join("")}
      </div>
      <button class="cta primary full" type="button" data-add-to-cart="${product.id}">Agregar al carrito</button>
    </div>
  `;

    d.querySelector("[data-add-to-cart]")?.addEventListener("click", () => {
        addToCart(product.id);
    });

    d.querySelector("[data-favorite-id]")?.addEventListener("click", () => {
        toggleFavorite(Number(d.querySelector("[data-favorite-id]").dataset.favoriteId));
    });
};

export const renderProducts = () => {
    const productGrid = d.getElementById("product-grid");
    if (!productGrid) return;

    const filteredProducts = getFilteredProducts();

    productGrid.innerHTML = filteredProducts
        .map(
            (product) => `
        <article class="product-card ${product.id === state.selectedProductId ? "selected" : ""}" data-id="${product.id}" tabindex="0">
          <button class="favorite-btn small ${state.favorites.includes(product.id) ? "active" : ""}" type="button" data-favorite-id="${product.id}" aria-label="Agregar a favoritos">
            ♡
          </button>
          <span class="product-badge">${product.badge}</span>
          <img src="${product.image}" alt="${product.name}" />
          <div class="product-info">
            <div>
              <p>${product.category}</p>
              <h3>${product.name}</h3>
            </div>
            <div class="product-meta">
              <strong>$${product.price}</strong>
              <span>$${product.oldPrice}</span>
            </div>
          </div>
        </article>
      `
        )
        .join("");

    d.querySelectorAll(".product-card").forEach((card) => {
        card.addEventListener("click", (e) => {
            if (e.target.closest("[data-favorite-id]")) return;
            state.selectedProductId = Number(card.dataset.id);
            renderProducts();
            renderProductDetail();
            openProductModal(state.selectedProductId);
        });
    });

    d.querySelectorAll("[data-favorite-id]").forEach((favoriteButton) => {
        favoriteButton.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleFavorite(Number(favoriteButton.dataset.favoriteId));
        });
    });
};

export const openProductModal = (productId) => {
    const modal = d.getElementById("product-modal");
    const modalContent = d.getElementById("modal-content");
    const product = products.find((item) => item.id === productId);

    if (!modal || !modalContent || !product) return;

    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");

    modalContent.innerHTML = `
    <div class="modal-image-wrap">
      <img src="${product.image}" alt="${product.name}" />
    </div>
    <div class="modal-copy">
      <p class="detail-label">${product.badge}</p>
      <h3 id="modal-title">${product.name}</h3>
      <p class="detail-category">${product.category}</p>
      <div class="detail-price-row">
        <strong>$${product.price}</strong>
        <span>$${product.oldPrice}</span>
      </div>
      <p class="detail-description">${product.name} combina estilo, confort y versatilidad para tu día a día.</p>
      <button class="cta primary full" type="button" data-add-to-cart="${product.id}">Agregar al carrito</button>
    </div>
  `;

    modalContent.querySelector("[data-add-to-cart]")?.addEventListener("click", () => {
        addToCart(product.id);
        closeModal();
    });
};

export const bindFilters = () => {
    d.querySelectorAll(".filter").forEach((button) => {
        button.addEventListener("click", () => {
            state.currentFilter = button.dataset.filter;
            d.querySelectorAll(".filter").forEach((btn) => btn.classList.toggle("active", btn === button));
            renderProducts();
        });
    });
};
