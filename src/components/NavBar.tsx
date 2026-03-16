import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../hooks/useApp";
import type { PageKey } from "../types";
import Logo from "../assets/dosely-4.svg";
import {
    Home,
    LayoutGrid,
    ShoppingCart,
    ShoppingBag,
    CheckCircle,
    Package,
    Truck,
    CreditCard,
    History,
    MapPin,
    Heart,
    UserRound,
    Globe,
    ChevronDown,
} from "lucide-react";

// ─── Cart Dropdown ────────────────────────────────────────────────────────────
function CartDropdown({ onClose }: { onClose: () => void }) {
    const { cartItems, cartTotal, navigateTo } = useApp();

    return (
        <div className="absolute top-[calc(100%+12px)] right-0 w-96 bg-white rounded-2xl shadow-[0_24px_64px_rgba(6,30,41,0.16)] border border-gray-100 z-50 p-6 animate-slideDown">
            <p className="text-xs font-bold text-[#2d2d2d] mb-4 tracking-widest uppercase">
                Cart &mdash; {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
            </p>

            {cartItems.length === 0 ? (
                <p className="text-center py-8 text-gray-400 text-sm">Your cart is empty</p>
            ) : (
                <>
                    <div className="max-h-64 overflow-y-auto -mx-1 px-1 space-y-1">
                        {cartItems.map((item) => (
                            <div
                                key={item.product.id}
                                className="flex gap-3 py-3 border-b border-gray-100 items-center last:border-b-0"
                            >
                                <div className="w-13 h-13 bg-[#F4F7F8] rounded-xl flex items-center justify-center text-xl shrink-0">
                                    {item.product.image}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-[#2d2d2d] truncate leading-tight">{item.product.brandName}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity}</p>
                                </div>
                                <span className="text-sm font-bold text-[#1D546D] shrink-0">
                                    ₱{(item.product.price * item.quantity).toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 mt-1">
                        <div className="flex justify-between mb-4">
                            <span className="text-sm text-gray-500">Total</span>
                            <span className="text-base font-bold text-[#2d2d2d]">₱{cartTotal.toLocaleString()}</span>
                        </div>
                        <button
                            onClick={() => { navigateTo("cart"); onClose(); }}
                            className="w-full bg-[#2d2d2d] hover:bg-[#1D546D] text-white rounded-xl py-3.5 text-sm font-semibold transition-colors duration-200 cursor-pointer tracking-wide"
                        >
                            View Cart &amp; Checkout
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

// ─── Languages ────────────────────────────────────────────────────────────────
const LANGUAGES = [
    { code: "EN", label: "English" },
    { code: "FIL", label: "Filipino" },
    { code: "CEB", label: "Cebuano" },
];

// ─── Nav Tabs Config ──────────────────────────────────────────────────────────
const NAV_TABS: { key: PageKey; label: string;  }[] = [
    { key: "medicines",     label: "Medicines"},
    { key: "pharmacy",     label: "Pharmacy"},
    { key: "pharmacy",     label: "Pharmacy"},
    { key: "pharmacy",     label: "Pharmacy"},

];

// ─── Navbar ───────────────────────────────────────────────────────────────────
export default function Navbar() {
    const { currentPage, navigateTo, cartCount } = useApp();
    const [cartOpen, setCartOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false);
    const [activeLang, setActiveLang] = useState("EN");
    const cartRef = useRef<HTMLDivElement>(null);
    const langRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handler(e: MouseEvent) {
            if (cartRef.current && !cartRef.current.contains(e.target as Node)) {
                setCartOpen(false);
            }
            if (langRef.current && !langRef.current.contains(e.target as Node)) {
                setLangOpen(false);
            }
        }
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div className="sticky top-0 z-40">
            {/* ── Top Bar ──────────────────────────────────────────────────────── */}
            <nav className="bg-white px-16 py-5 flex items-center gap-10 shadow-[0_2px_16px_rgba(6,30,41,0.10)] border-b border-gray-100">

                {/* Logo */}
                <button
                    onClick={() => navigateTo("home")}
                    className="shrink-0 bg-transparent border-none p-0 cursor-pointer mr-2"
                >
                    <img src={Logo} className="h-14 w-auto" alt="Dosely logo" />
                </button>

                {/* Address / Location */}
                <button className="flex items-center gap-2.5 hover:bg-[#2d2d2d]/8 px-3 py-2 rounded-xl text-[#2d2d2d] text-base shrink-0 whitespace-nowrap transition-all duration-200 cursor-pointer font-['Geist']">
                    <MapPin size={22} className="text-[#2d2d2d]" strokeWidth={2} />
                    <span className="text-sm text-[#2d2d2d] epilogue-regular">Cebu City, PH</span>
                </button>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Right Actions */}
                <div className="flex items-center gap-2 shrink-0">

                    <div className="relative" ref={langRef}>
                        <button
                            onClick={() => setLangOpen((o) => !o)}
                            className="flex items-center gap-1.5 text-[#2d2d2d] hover:text-[#1D546D] transition-colors duration-200 cursor-pointer font-['Geist'] px-3 py-2 rounded-xl hover:bg-[#2d2d2d]/8"
                            title="Language"
                        >
                            <span
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: 22,
                                    height: 22,
                                    transform: "rotate(-23deg)",
                                }}
                            >
                                <Globe size={22} strokeWidth={1.8} />
                            </span>
                            <span className="text-sm font-['Geist'] epilogue-regular tracking-wide">{activeLang}</span>
                            <ChevronDown
                                size={14}
                                strokeWidth={2}
                                style={{
                                    display: "block",
                                    transform: langOpen ? "rotate(180deg)" : "rotate(0deg)",
                                    transition: "transform 0.2s ease",
                                }}
                            />
                        </button>

                        {langOpen && (
                            <div className="absolute top-[calc(100%+12px)] px-4 right-0 w-44 bg-white rounded-2xl shadow-[0_24px_64px_rgba(6,30,41,0.16)] border border-gray-100 z-50 py-2 animate-slideDown">
                                {LANGUAGES.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => { setActiveLang(lang.code); setLangOpen(false); }}
                                        className={[
                                            "w-full flex items-center gap-3 px-4 py-2.5 text-sm epilogue-regular font-medium transition-colors duration-150 cursor-pointer text-left",
                                            activeLang === lang.code
                                                ? "text-[#2d2d2d] bg-[#F4F7F8]"
                                                : "text-gray-500 hover:bg-gray-50 hover:text-[#2d2d2d]",
                                        ].join(" ")}
                                    >
                                        <span className="text-xs epilogue-subheader tracking-wider w-8">{lang.code}</span>
                                        <span>{lang.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Favorites */}
                    <button
                        onClick={() => navigateTo("favorites" as PageKey)}
                        className="icon-btn"
                        title="Favorites"
                    >
                        <Heart size={22} strokeWidth={1.8} />
                    </button>

                    {/* Cart */}
                    <div className="relative" ref={cartRef}>
                        <button
                            onClick={() => setCartOpen((o) => !o)}
                            className="icon-btn icon-btn--active"
                            title="Cart"
                        >
                            <span className="relative">
                                <ShoppingBag size={22} strokeWidth={1.8} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center leading-none shadow-sm">
                                        {cartCount}
                                    </span>
                                )}
                            </span>
                        </button>
                        {cartOpen && <CartDropdown onClose={() => setCartOpen(false)} />}
                    </div>

                    {/* Account */}
                    <button
                        onClick={() => navigateTo("account")}
                        className="flex items-center epilogue-regular gap-2 text-[#2d2d2d] hover:text-[#1D546D] transition-colors duration-200 cursor-pointer font-['Geist'] font-semibold text-sm px-2 py-2 rounded-xl hover:bg-[#2d2d2d]/8"
                    >
                        <UserRound size={22} strokeWidth={1.8} />
                        <span>Account</span>
                    </button>
                </div>
            </nav>

            {/* ── Bottom Tab Nav ─────────────────────────────────────────────────── */}
            <div className="bg-[#0F3244] flex gap-0.5 px-24 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden border-b border-white/[0.06]">
                {NAV_TABS.map((tab) => {
                    const isActive = currentPage === tab.key;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => navigateTo(tab.key)}
                            className={[
                                "flex items-center gap-2.5 px-6 py-4 text-[15px] whitespace-nowrap cursor-pointer bg-transparent border-none font-['Geist'] transition-all duration-200 border-b-2 relative",
                                isActive
                                    ? "text-white font-semibold border-b-[#5F9598]"
                                    : "text-white/50 font-normal border-b-transparent hover:text-white/80",
                            ].join(" ")}
                        >
                            <tab.Icon size={19} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>



            <style>{`
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .animate-slideDown { animation: slideDown 0.18s ease-out; }

                .icon-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    border: none;
                    background: transparent;
                    color: #2d2d2d;
                    cursor: pointer;
                    transition: background 0.15s ease, color 0.15s ease;
                    flex-shrink: 0;
                }
                .icon-btn:hover {
                    background: rgba(45, 45, 45, 0.08);
                    color: #1D546D;
                }
                .icon-btn--active {
                    background: rgba(45, 45, 45, 0.08);
                }
                .icon-btn--active:hover {
                    background: rgba(45, 45, 45, 0.14);
                }
            `}</style>
        </div>
    );
}