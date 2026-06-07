/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback } from "react";
import type { CartItem, Product, Order, Address, PageKey } from "../types";
import { ORDERS, ADDRESSES } from "../data/mockData";

// ─── Context Shape ────────────────────────────────────────────────────────────
interface AppContextValue {
    // Navigation
    currentPage: PageKey;
    navigateTo: (page: PageKey, productId?: string) => void;
    selectedProductId: string | null;

    // Cart
    cartItems: CartItem[];
    addToCart: (product: Product, qty?: number) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, qty: number) => void;
    cartTotal: number;
    cartCount: number;

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

export interface ModalState {
    type: "success" | "info" | "warning" | "error" | "added";
    icon: string;
    title: string;
    message: string;
    actionLabel?: string;
    onAction?: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────
const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [currentPage, setCurrentPage] = useState<PageKey>("home");
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [orders] = useState<Order[]>(ORDERS);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [addresses] = useState<Address[]>(ADDRESSES);
    const [selectedAddressId, setSelectedAddressId] = useState<string>(ADDRESSES[0].id);
    const [modal, setModal] = useState<ModalState | null>(null);

    const navigateTo = useCallback((page: PageKey, productId?: string) => {
        setCurrentPage(page);
        if (productId) setSelectedProductId(productId);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const addToCart = useCallback((product: Product, qty = 1) => {
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

    const cartTotal = cartItems.reduce(
        (sum, i) => sum + i.product.price * i.quantity,
        0
    );
    const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

    const showModal = useCallback((m: ModalState) => setModal(m), []);
    const closeModal = useCallback(() => setModal(null), []);

    return (
        <AppContext.Provider
            value={{
                currentPage,
                navigateTo,
                selectedProductId,
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                cartTotal,
                cartCount,
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
