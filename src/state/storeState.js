import { products } from "../data/storeData.js";

export const STORAGE_KEY = "ibiza-store-state";

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

export const state = {
    selectedProductId: products[0].id,
    currentFilter: "Todo",
    currentSlide: 0,
    cart: loadStoredState().cart,
    favorites: loadStoredState().favorites
};

export const saveState = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
        cart: state.cart,
        favorites: state.favorites
    }));
};

export const getFilteredProducts = () => {
    if (state.currentFilter === "Todo") return products;
    return products.filter((product) => product.category === state.currentFilter);
};
