/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { CartItem, Product, Order, Address, PageKey } from "../types";
import { ORDERS, ADDRESSES } from "../data/mockData";
import { getPathForPage, getRouteFromPath } from "../utils/pageRoutes";

// ─── Context Shape ────────────────────────────────────────────────────────────
interface AppContextValue {
    // Navigation
    currentPage: PageKey;
    navigateTo: (page: PageKey, productId?: string) => void;
    navigateBack: () => void;
    selectedProductId: string | null;

    // Cart
    cartItems: CartItem[];
    addToCart: (product: Product, qty?: number) => boolean;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, qty: number) => void;
    cartTotal: number;
    cartCount: number;
    cartRequiresPrescription: boolean;
    hasUploadedPrescription: boolean;
    proceedToCheckout: () => boolean;
    ensurePrescriptionForOrder: () => boolean;
    completePrescriptionUpload: () => void;

    // Favorites
    favoriteIds: string[];
    toggleFavorite: (productId: string) => void;
    removeFavorite: (productId: string) => void;
    clearFavorites: () => void;

    // Orders
    orders: Order[];
    selectedOrderId: string | null;
    setSelectedOrderId: (id: string | null) => void;

    // Address
    addresses: Address[];
    selectedAddressId: string;
    setSelectedAddressId: (id: string) => void;

    // Notification modal
    modal: ModalState | null;
    showModal: (modal: ModalState) => void;
    closeModal: () => void;
}

type PrescriptionIntent =
    | { type: "add_to_cart"; product: Product; qty: number }
    | { type: "checkout" }
    | { type: "place_order" };

export interface ModalState {
    type: "success" | "info" | "warning" | "error" | "added";
    icon: React.ReactNode;
    title: string;
    message: string;
    actionLabel?: string;
    onAction?: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────
const AppContext = createContext<AppContextValue | null>(null);
const FAVORITES_STORAGE_KEY = "dosely:favorites";

function getSavedFavoriteIds() {
    try {
        const saved = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
        return saved ? (JSON.parse(saved) as string[]) : [];
    } catch {
        return [];
    }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
    const initialRoute = getRouteFromPath(window.location.pathname);
    const [currentPage, setCurrentPage] = useState<PageKey>(initialRoute.page);
    const [previousPage, setPreviousPage] = useState<PageKey | null>(null);
    const [selectedProductId, setSelectedProductId] = useState<string | null>(initialRoute.productId ?? null);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [orders] = useState<Order[]>(ORDERS);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [addresses] = useState<Address[]>(ADDRESSES);
    const [selectedAddressId, setSelectedAddressId] = useState<string>(ADDRESSES[0].id);
    const [modal, setModal] = useState<ModalState | null>(null);
    const [favoriteIds, setFavoriteIds] = useState<string[]>(getSavedFavoriteIds);
    const [hasUploadedPrescription, setHasUploadedPrescription] = useState(false);
    const [pendingPrescriptionIntent, setPendingPrescriptionIntent] = useState<PrescriptionIntent | null>(null);

    const saveFavoriteIds = useCallback((ids: string[]) => {
        try {
            window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids));
        } catch {
            // Favorites still work for the session if storage is unavailable.
        }
    }, []);

    const navigateTo = useCallback((page: PageKey, productId?: string) => {
        setCurrentPage((prev) => {
            if (prev !== page) setPreviousPage(prev);
            return page;
        });
        if (productId) setSelectedProductId(productId);
        const nextPath = getPathForPage(page, productId);
        if (window.location.pathname !== nextPath) {
            window.history.pushState({ page, productId: productId ?? null }, "", nextPath);
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const navigateBack = useCallback(() => {
        const destination = previousPage ?? "home";
        setCurrentPage((current) => {
            setPreviousPage(current);
            return destination;
        });
        const nextPath = getPathForPage(destination);
        if (window.location.pathname !== nextPath) {
            window.history.pushState({ page: destination, productId: null }, "", nextPath);
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [previousPage]);

    useEffect(() => {
        const route = getRouteFromPath(window.location.pathname);
        window.history.replaceState(
            { page: route.page, productId: route.productId ?? null },
            "",
            getPathForPage(route.page, route.productId ?? undefined)
        );

        function handlePopState() {
            const nextRoute = getRouteFromPath(window.location.pathname);
            setCurrentPage((current) => {
                if (current !== nextRoute.page) setPreviousPage(current);
                return nextRoute.page;
            });
            setSelectedProductId(nextRoute.productId ?? null);
            window.scrollTo({ top: 0, behavior: "auto" });
        }

        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, []);

    const addItemToCart = useCallback((product: Product, qty = 1) => {
        setCartItems((prev) => {
            const existing = prev.find((i) => i.product.id === product.id);
            if (existing) {
                return prev.map((i) =>
                    i.product.id === product.id
                        ? { ...i, quantity: i.quantity + qty }
                        : i
                );
            }
            return [...prev, { product, quantity: qty }];
        });
    }, []);

    const addToCart = useCallback((product: Product, qty = 1) => {
        if (product.requiresPrescription && !hasUploadedPrescription) {
            setPendingPrescriptionIntent({ type: "add_to_cart", product, qty });
            navigateTo("prescription_upload");
            return false;
        }

        addItemToCart(product, qty);
        return true;
    }, [addItemToCart, hasUploadedPrescription, navigateTo]);

    const removeFromCart = useCallback((productId: string) => {
        setCartItems((prev) => prev.filter((i) => i.product.id !== productId));
    }, []);

    const updateQuantity = useCallback((productId: string, qty: number) => {
        if (qty <= 0) {
            setCartItems((prev) => prev.filter((i) => i.product.id !== productId));
        } else {
            setCartItems((prev) =>
                prev.map((i) =>
                    i.product.id === productId ? { ...i, quantity: qty } : i
                )
            );
        }
    }, []);

    const toggleFavorite = useCallback((productId: string) => {
        setFavoriteIds((prev) => {
            const next = prev.includes(productId)
                ? prev.filter((id) => id !== productId)
                : [...prev, productId];
            saveFavoriteIds(next);
            return next;
        });
    }, [saveFavoriteIds]);

    const removeFavorite = useCallback((productId: string) => {
        setFavoriteIds((prev) => {
            const next = prev.filter((id) => id !== productId);
            saveFavoriteIds(next);
            return next;
        });
    }, [saveFavoriteIds]);

    const clearFavorites = useCallback(() => {
        setFavoriteIds([]);
        saveFavoriteIds([]);
    }, [saveFavoriteIds]);

    const cartTotal = cartItems.reduce(
        (sum, i) => sum + i.product.price * i.quantity,
        0
    );
    const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
    const cartRequiresPrescription = cartItems.some((i) => i.product.requiresPrescription);

    const proceedToCheckout = useCallback(() => {
        if (cartRequiresPrescription && !hasUploadedPrescription) {
            setPendingPrescriptionIntent({ type: "checkout" });
            navigateTo("prescription_upload");
            return false;
        }

        navigateTo("checkout");
        return true;
    }, [cartRequiresPrescription, hasUploadedPrescription, navigateTo]);

    const ensurePrescriptionForOrder = useCallback(() => {
        if (cartRequiresPrescription && !hasUploadedPrescription) {
            setPendingPrescriptionIntent({ type: "place_order" });
            navigateTo("prescription_upload");
            return false;
        }

        return true;
    }, [cartRequiresPrescription, hasUploadedPrescription, navigateTo]);

    const showModal = useCallback((m: ModalState) => setModal(m), []);
    const closeModal = useCallback(() => setModal(null), []);

    const completePrescriptionUpload = useCallback(() => {
        setHasUploadedPrescription(true);
        const intent = pendingPrescriptionIntent;
        setPendingPrescriptionIntent(null);

        if (intent?.type === "add_to_cart") {
            addItemToCart(intent.product, intent.qty);
            navigateTo("cart");
            return;
        }

        if (intent?.type === "checkout" || intent?.type === "place_order") {
            navigateTo("checkout");
        }
    }, [addItemToCart, navigateTo, pendingPrescriptionIntent]);

    return (
        <AppContext.Provider
            value={{
                currentPage,
                navigateTo,
                navigateBack,
                selectedProductId,
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                cartTotal,
                cartCount,
                cartRequiresPrescription,
                hasUploadedPrescription,
                proceedToCheckout,
                ensurePrescriptionForOrder,
                completePrescriptionUpload,
                favoriteIds,
                toggleFavorite,
                removeFavorite,
                clearFavorites,
                orders,
                selectedOrderId,
                setSelectedOrderId,
                addresses,
                selectedAddressId,
                setSelectedAddressId,
                modal,
                showModal,
                closeModal,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useApp(): AppContextValue {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error("useApp must be used within AppProvider");
    return ctx;
}
