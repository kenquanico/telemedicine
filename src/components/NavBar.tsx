import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../hooks/useApp";
import type { PageKey } from "../types";
import Logo from "../assets/dosely.svg";

// ─── Cart Dropdown ────────────────────────────────────────────────────────────
function CartDropdown({ onClose }: { onClose: () => void }) {
    const { cartItems, cartTotal, navigateTo } = useApp();

    return (
        <div className="absolute top-[calc(100%+8px)] right-0 w-80 bg-white rounded-2xl shadow-[0_20px_60px_rgba(6,30,41,0.18)] border border-gray-200 z-50 p-4 animate-slideDown">
            <p className="text-sm font-bold mb-3">
                Cart ({cartItems.length} item{cartItems.length !== 1 ? "s" : ""})
            </p>

            {cartItems.length === 0 ? (
                <p className="text-center py-5 text-gray-500 text-sm">Your cart is empty</p>
            ) : (
                <>
                    {/* Items */}
                    <div className="max-h-60 overflow-y-auto">
                        {cartItems.map((item) => (
                            <div
                                key={item.product.id}
                                className="flex gap-2.5 py-2.5 border-b border-gray-200 items-center last:border-b-0"
                            >
                                <div className="w-11 h-11 bg-neutral-100 rounded-lg flex items-center justify-center text-xl shrink-0">
                                    {item.product.image}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate">{item.product.brandName}</p>
                                    <p className="text-xs text-gray-500">×{item.quantity}</p>
                                </div>
                                <span className="text-sm font-semibold text-[#1D546D] shrink-0">
                  ₱{(item.product.price * item.quantity).toLocaleString()}
                </span>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="pt-3">
                        <div className="flex justify-between mb-2.5 text-sm font-bold">
                            <span>Total</span>
                            <span className="text-[#1D546D]">₱{cartTotal.toLocaleString()}</span>
                        </div>
                        <button
                            onClick={() => { navigateTo("cart"); onClose(); }}
                            className="w-full bg-[#061E29] hover:bg-[#1D546D] text-white rounded-xl py-3 text-sm font-semibold transition-colors duration-200 cursor-pointer"
                        >
                            View Cart &amp; Checkout
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

// ─── Nav Tabs Config ──────────────────────────────────────────────────────────
const NAV_TABS: { key: PageKey; label: string; icon: string }[] = [
    { key: "home",     label: "Home",            icon: "🏠" },
    { key: "catalog",  label: "Medicine Catalog", icon: "📋" },
    { key: "cart",     label: "Cart",             icon: "🛒" },
    { key: "checkout", label: "Checkout",         icon: "✅" },
    { key: "orders",   label: "Orders",           icon: "📦" },
    { key: "tracking", label: "Track Order",      icon: "🚚" },
    { key: "payment",  label: "Payment",          icon: "💳" },
    { key: "history",  label: "History",          icon: "🕐" },
];

// ─── Navbar ───────────────────────────────────────────────────────────────────
export default function Navbar() {
    const { currentPage, navigateTo, cartCount } = useApp();
    const [cartOpen, setCartOpen] = useState(false);
    const [search, setSearch]     = useState("");
    const cartRef = useRef<HTMLDivElement>(null);

    // Close cart dropdown on outside click
    useEffect(() => {
        function handler(e: MouseEvent) {
            if (cartRef.current && !cartRef.current.contains(e.target as Node)) {
                setCartOpen(false);
            }
        }
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && search.trim()) navigateTo("catalog");
    };

    return (
        <>
            {/* ── Top Bar ───────────────────────────────────────────────────────── */}
            <nav className="sticky top-0 z-40 bg-[#061E29] px-6 py-3 flex items-center gap-4 shadow-[0_2px_16px_rgba(6,30,41,0.22)]">

                {/* Logo */}
                <button
                    onClick={() => navigateTo("home")}
                    className="shrink-0 bg-transparent border-none p-0 cursor-pointer"
                >
                    <img src={Logo} className="h-10 w-auto" alt="Dosely logo" />
                </button>

                {/* Location */}
                <button className="flex items-center gap-1.5 bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.12] rounded-xl px-3 py-1.5 text-white text-xs shrink-0 whitespace-nowrap transition-colors duration-200 cursor-pointer font-['DM_Sans']">
                    📍 Cebu City, PH ▾
                </button>

                {/* Search Bar */}
                <div className="flex-1 flex items-center bg-white rounded-xl overflow-hidden min-w-0">
                    <span className="ml-3 text-base shrink-0">🔍</span>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={handleSearch}
                        placeholder="Search medicines, vitamins, health products..."
                        className="flex-1 border-none outline-none px-3 py-2.5 text-sm font-['DM_Sans'] bg-transparent min-w-0 text-[#061E29] placeholder:text-gray-400"
                    />
                    <button
                        onClick={() => navigateTo("catalog")}
                        className="bg-[#5F9598] hover:bg-[#1D546D] text-white px-5 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors duration-200 cursor-pointer font-['DM_Sans']"
                    >
                        Search
                    </button>
                </div>

                {/* Cart Button */}
                <div className="relative" ref={cartRef}>
                    <button
                        onClick={() => setCartOpen((o) => !o)}
                        className="relative flex items-center gap-1.5 bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.12] rounded-xl px-3.5 py-2 text-white text-sm cursor-pointer transition-colors duration-200 font-['DM_Sans']"
                    >
                        🛒 Cart
                        {cartCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center leading-none">
                {cartCount}
              </span>
                        )}
                    </button>
                    {cartOpen && <CartDropdown onClose={() => setCartOpen(false)} />}
                </div>

                {/* Account */}
                <button
                    onClick={() => navigateTo("account")}
                    className="flex items-center gap-1.5 bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.12] rounded-xl px-3.5 py-2 text-white text-sm cursor-pointer transition-colors duration-200 font-['DM_Sans']"
                >
                    👤 Account
                </button>
            </nav>

            {/* ── Bottom Tab Nav ─────────────────────────────────────────────────── */}
            <div className="bg-[#1D546D] flex gap-1 px-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {NAV_TABS.map((tab) => {
                    const isActive = currentPage === tab.key;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => navigateTo(tab.key)}
                            className={[
                                "flex items-center gap-1.5 px-4 py-3 text-sm whitespace-nowrap cursor-pointer bg-transparent border-none font-['DM_Sans'] transition-colors duration-200 border-b-[3px]",
                                isActive
                                    ? "text-white font-semibold border-b-[#5F9598]"
                                    : "text-white/65 font-normal border-b-transparent hover:text-white",
                            ].join(" ")}
                        >
                            <span>{tab.icon}</span>
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Slide-down animation for cart dropdown */}
            <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown { animation: slideDown 0.18s ease-out; }
      `}</style>
        </>
    );
}