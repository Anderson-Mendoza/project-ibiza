import { products } from "../data/storeData.js";
import { saveState, state } from "../state/storeState.js";

const d = document;

export const updateCartCount = () => {
    const cartCount = d.getElementById("cart-count");
    if (!cartCount) return;
    cartCount.textContent = String(state.cart.reduce((sum, item) => sum + item.quantity, 0));
};

export const renderCart = () => {
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

export const addToCart = (productId) => {
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

export const decreaseCartItem = (productId) => {
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

export const removeCartItem = (productId) => {
    state.cart = state.cart.filter((item) => item.productId !== productId);
    saveState();
    renderCart();
    updateCartCount();
};

export const bindCartControls = () => {
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

export const closeModal = () => {
    const modal = d.getElementById("product-modal");
    if (!modal) return;
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
};
