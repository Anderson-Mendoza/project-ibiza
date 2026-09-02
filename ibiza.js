import hamburgerMenu from "./menu_desplegable.js";

const d = document;

const heroSlides = [
    {
        title: "Tu estilo, mejorado.",
        text: "Descubrí colecciones premium para días de oficina, noches y escapadas de fin de semana.",
        button: "Comprar ahora",
        image: "./assets/img_models/model1.jpg",
        tag: "Nueva temporada"
    },
    {
        title: "Summer Edit 2026",
        text: "Prendas ligeras, colores cálidos y cortes modernos para una temporada más fresca.",
        button: "Ver novedades",
        image: "./assets/img_models/model2.jpg",
        tag: "Colección nueva"
    },
    {
        title: "Essentials con actitud",
        text: "Básicos impecables con detalles premium que se adaptan a cada outfit.",
        button: "Explorar",
        image: "./assets/img_models/model3.jpg",
        tag: "Top sellers"
    }
];

const categories = [
    { name: "Abrigos", subtitle: "Chaquetas premium", image: "./assets/img_models/model1.jpg" },
    { name: "Vestidos", subtitle: "Looks de noche", image: "./assets/img_models/model2.jpg" },
    { name: "Accesorios", subtitle: "Detalles clave", image: "./assets/img_models/model3.jpg" },
    { name: "Básicos", subtitle: "Básicos elegantes", image: "./assets/img_models/model4.jpg" }
];

const featuredProducts = [
    { id: 1, name: "Abrigo Luna", category: "Abrigos", price: 129, image: "./assets/img_models/model1.jpg" },
    { id: 2, name: "Vestido Velvet", category: "Vestidos", price: 98, image: "./assets/img_models/model2.jpg" },
    { id: 3, name: "Cuero Noir", category: "Accesorios", price: 74, image: "./assets/img_models/model3.jpg" }
];

const products = [
    { id: 1, name: "Abrigo Luna", category: "Abrigos", price: 129, oldPrice: 169, colors: ["Beige", "Negro", "Blanco"], image: "./assets/img_models/model1.jpg", badge: "Nuevo" },
    { id: 2, name: "Vestido Velvet", category: "Vestidos", price: 98, oldPrice: 140, colors: ["Café", "Marrón", "Nude"], image: "./assets/img_models/model2.jpg", badge: "Top" },
    { id: 3, name: "Cuero Noir", category: "Accesorios", price: 74, oldPrice: 99, colors: ["Negro", "Cognac"], image: "./assets/img_models/model3.jpg", badge: "Hot" },
    { id: 4, name: "Knit Solis", category: "Básicos", price: 82, oldPrice: 110, colors: ["Crema", "Gris"], image: "./assets/img_models/model4.jpg", badge: "Popular" },
    { id: 5, name: "Chaqueta Aster", category: "Abrigos", price: 145, oldPrice: 180, colors: ["Negro", "Camel"], image: "./assets/img_models/model1.jpg", badge: "Edit" },
    { id: 6, name: "Vestido Mila", category: "Vestidos", price: 110, oldPrice: 150, colors: ["Rojo", "Negro"], image: "./assets/img_models/model2.jpg", badge: "Limited" },
    { id: 7, name: "Bolso Gala", category: "Accesorios", price: 68, oldPrice: 92, colors: ["Blanco", "Marrón"], image: "./assets/img_models/model3.jpg", badge: "Fresh" },
    { id: 8, name: "Set Harbor", category: "Básicos", price: 96, oldPrice: 128, colors: ["Azul", "Verde"], image: "./assets/img_models/model4.jpg", badge: "New" }
];

const STORAGE_KEY = "ibiza-store-state";

const loadStoredState = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return { cart: [], favorites: [] };

        const parsed = JSON.parse(raw);
        return {
            cart: Array.isArray(parsed.cart) ? parsed.cart : [],
            favorites: Array.isArray(parsed.favorites) ? parsed.favorites : []
        };
    } catch (error) {
        return { cart: [], favorites: [] };
    }
};

const state = {
    selectedProductId: products[0].id,
    currentFilter: "Todo",
    currentSlide: 0,
    cart: loadStoredState().cart,
    favorites: loadStoredState().favorites
};

const saveState = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
        cart: state.cart,
        favorites: state.favorites
    }));
};

const getFilteredProducts = () => {
    if (state.currentFilter === "Todo") return products;
    return products.filter((product) => product.category === state.currentFilter);
};

const renderHero = () => {
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

const startHeroCarousel = () => {
    setInterval(() => {
        state.currentSlide = (state.currentSlide + 1) % heroSlides.length;
        renderHero();
    }, 4000);
};

const renderCategories = () => {
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

const renderFeatured = () => {
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

const renderProductDetail = () => {
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

const renderProducts = () => {
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

const renderCart = () => {
    const cartPanel = d.getElementById("cart-panel");
    const cartItems = d.getElementById("cart-items");
    const cartTotal = d.getElementById("cart-total");

    if (!cartItems || !cartTotal || !cartPanel) return;

    if (state.cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Tu carrito está vacío.</p>';
        cartTotal.textContent = "$0";
        return;
    }

    const total = state.cart.reduce((sum, item) => {
        const product = products.find((entry) => entry.id === item.productId);
        return sum + (product ? product.price * item.quantity : 0);
    }, 0);

    cartItems.innerHTML = state.cart
        .map(({ productId, quantity }) => {
            const product = products.find((item) => item.id === productId);
            if (!product) return "";

            return `
        <div class="cart-item" data-product-id="${productId}">
          <img src="${product.image}" alt="${product.name}" />
          <div class="cart-item-details">
            <div class="cart-item-head">
              <h4>${product.name}</h4>
              <button type="button" data-remove-cart-item="${productId}" class="cart-remove-btn" aria-label="Eliminar producto">✕</button>
            </div>
            <p>${product.category}</p>
            <div class="cart-item-controls">
              <div class="qty-control">
                <button type="button" data-decrease-qty="${productId}" aria-label="Disminuir cantidad">−</button>
                <span>${quantity}</span>
                <button type="button" data-increase-qty="${productId}" aria-label="Aumentar cantidad">+</button>
              </div>
              <strong>$${product.price * quantity}</strong>
            </div>
          </div>
        </div>
      `;
        })
        .join("");

    d.querySelectorAll("[data-increase-qty]").forEach((button) => {
        button.addEventListener("click", () => addToCart(Number(button.dataset.increaseQty)));
    });

    d.querySelectorAll("[data-decrease-qty]").forEach((button) => {
        button.addEventListener("click", () => decreaseCartItem(Number(button.dataset.decreaseQty)));
    });

    d.querySelectorAll("[data-remove-cart-item]").forEach((button) => {
        button.addEventListener("click", () => removeCartItem(Number(button.dataset.removeCartItem)));
    });

    cartTotal.textContent = `$${total}`;
};

const addToCart = (productId) => {
    const product = products.find((item) => item.id === productId);
    if (!product) return;

    const existingItem = state.cart.find((item) => item.productId === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        state.cart.push({ productId, quantity: 1 });
    }

    saveState();
    renderCart();
    updateCartCount();
    d.getElementById("cart-panel")?.classList.add("is-open");
};

const decreaseCartItem = (productId) => {
    const item = state.cart.find((entry) => entry.productId === productId);
    if (!item) return;

    if (item.quantity > 1) {
        item.quantity -= 1;
    } else {
        removeCartItem(productId);
        return;
    }

    saveState();
    renderCart();
    updateCartCount();
};

const removeCartItem = (productId) => {
    state.cart = state.cart.filter((item) => item.productId !== productId);
    saveState();
    renderCart();
    updateCartCount();
};

const toggleFavorite = (productId) => {
    if (state.favorites.includes(productId)) {
        state.favorites = state.favorites.filter((id) => id !== productId);
    } else {
        state.favorites.push(productId);
    }

    saveState();
    renderProducts();
    renderProductDetail();
};

const updateCartCount = () => {
    const cartCount = d.getElementById("cart-count");
    if (!cartCount) return;
    cartCount.textContent = String(state.cart.reduce((sum, item) => sum + item.quantity, 0));
};

const openProductModal = (productId) => {
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

const closeModal = () => {
    const modal = d.getElementById("product-modal");
    if (!modal) return;
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
};

const bindFilters = () => {
    d.querySelectorAll(".filter").forEach((button) => {
        button.addEventListener("click", () => {
            state.currentFilter = button.dataset.filter;
            d.querySelectorAll(".filter").forEach((btn) => btn.classList.toggle("active", btn === button));
            renderProducts();
        });
    });
};

const bindCartControls = () => {
    const cartPanel = d.getElementById("cart-panel");
    const cartToggle = d.querySelector(".mini-btn:last-child");
    const cartClose = d.getElementById("cart-close");
    const modalClose = d.getElementById("modal-close");

    cartToggle?.addEventListener("click", () => {
        cartPanel?.classList.toggle("is-open");
    });

    cartClose?.addEventListener("click", () => {
        cartPanel?.classList.remove("is-open");
    });

    modalClose?.addEventListener("click", closeModal);

    d.getElementById("product-modal")?.addEventListener("click", (event) => {
        if (event.target.id === "product-modal") closeModal();
    });
};

const bindHeaderBehavior = () => {
    const header = d.querySelector(".topbar");
    if (!header) return;

    let lastScrollY = window.scrollY;

    const revealHeader = () => {
        header.classList.remove("is-hidden");
    };

    const hideHeader = () => {
        if (window.scrollY > 80 && window.scrollY > lastScrollY) {
            header.classList.add("is-hidden");
        }
    };

    window.addEventListener("scroll", () => {
        if (window.scrollY <= 20) {
            revealHeader();
        } else if (window.scrollY > lastScrollY) {
            hideHeader();
        } else {
            revealHeader();
        }

        lastScrollY = window.scrollY;
    });

    window.addEventListener("mousemove", (event) => {
        if (event.clientY < 110) {
            revealHeader();
        }
    });

    header.addEventListener("mouseenter", revealHeader);
};

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
