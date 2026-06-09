import  { useState, useRef, useEffect } from "react";
import { useApp } from "../hooks/useApp";
import type { PageKey } from "../types";
import LocationPickerModal, { type Location } from "./LocationPickerModal";

import Logo from "../assets/Dosely-1.svg";
import SearchModal from "./SearchModal";
import {
    MapPin,
    Heart,
    UserRound,
    Globe,
    ChevronDown,
    ShoppingBag,
    LayoutGrid,
    Store,
    Building2,
    Search,
    LogOut,
    Settings,
    ClipboardList,
} from "lucide-react";

// ─── Cart Dropdown ────────────────────────────────────────────────────────────
function CartDropdown({ onClose }: { onClose: () => void }) {
    const { cartItems, cartTotal, navigateTo } = useApp();


    return (
        <div className="absolute top-[calc(100%+10px)] right-0 w-80 bg-white rounded-xl shadow-[0_20px_56px_rgba(6,30,41,0.16)] border border-gray-100 z-50 p-5 animate-slideDown">
            <p className="text-xs font-bold text-[#262626] mb-3 tracking-widest uppercase">
                Cart &mdash; {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
            </p>
            {cartItems.length === 0 ? (
                <p className="text-center py-6 text-[#262626]/60 text-xs epilogue-regular">Your cart is empty</p>
            ) : (
                <>
                    <div className="max-h-56 overflow-y-auto -mx-2 px-2 space-y-1">
                        {cartItems.map((item) => (
                            <div key={item.product.id} className="flex gap-2.5 px-2 py-2.5 border-b border-[#262626]/10 items-center last:border-b-0 hover:bg-[#F4F7F8] rounded-lg transition-colors duration-150">
                                <div className="w-11 h-11 bg-[#F4F7F8] rounded-lg flex items-center justify-center text-lg shrink-0">
                                    {item.product.image}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-[#262626] truncate leading-tight epilogue-regular">{item.product.brandName}</p>
                                    <p className="text-xs text-[#262626]/60 mt-0.5 epilogue-regular">Qty: {item.quantity}</p>
                                </div>
                                <span className="text-sm font-bold text-[#427b77] shrink-0">
                                        ₱{(item.product.price * item.quantity).toLocaleString()}
                                    </span>
                            </div>
                        ))}
                    </div>
                    <div className="pt-3 mt-1 border-t border-[#262626]/10">
                        <div className="flex justify-between mb-3">
                            <span className="text-sm text-[#262626]/70 epilogue-regular">Total</span>
                            <span className="text-base font-bold text-[#262626]">₱{cartTotal.toLocaleString()}</span>
                        </div>
                        <button
                            onClick={() => { navigateTo("cart"); onClose(); }}
                            className="w-full bg-[#2d2d2d] hover:bg-[#427b77] text-white rounded-lg py-3 text-xs font-semibold transition-colors duration-200 cursor-pointer tracking-wide"
                        >
                            View Cart &amp; Checkout
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

// ─── Account Dropdown ─────────────────────────────────────────────────────────
function AccountDropdown({ onClose, navigateTo }: { onClose: () => void; navigateTo: (p: PageKey) => void }) {
    const items = [
        { Icon: ClipboardList, label: "My Orders",  page: "orders"    as PageKey },
        { Icon: Heart,         label: "Favorites",  page: "favorites" as PageKey },
        { Icon: Settings,      label: "Settings",   page: "settings"  as PageKey },
    ];

    return (
        <div className="absolute top-[calc(100%+10px)] right-0 w-56 bg-white rounded-xl shadow-[0_20px_56px_rgba(6,30,41,0.16)] border border-gray-100 z-50 py-1.5 animate-slideDown">
            <div className="px-4 py-2.5 mb-0.5">
                <p className="text-sm font-semibold text-[#262626] leading-tight epilogue-regular">Ken Aldrey Quanico</p>
                <button className="text-xs text-[#3B82F6] mt-0.5 epilogue-subheader hover:text-[#2563EB]">View Profile</button>
            </div>
            <div className="px-1.5 py-0.5">
                {items.map(({ Icon, label, page }) => (
                    <button
                        key={label}
                        onClick={() => { navigateTo(page); onClose(); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs epilogue-regular text-[#262626]/70 hover:bg-[#F4F7F8] hover:text-[#262626] rounded-lg transition-colors duration-150 cursor-pointer"
                    >
                        <Icon size={15} strokeWidth={1.8} />
                        <span>{label}</span>
                    </button>
                ))}
            </div>
            <div className="border-t border-[#262626]/10 mx-3 my-1" />
            <div className="px-1.5 pb-1">
                <button className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs epilogue-regular text-red-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors duration-150 cursor-pointer">
                    <LogOut size={15} strokeWidth={1.8} />
                    <span>Log out</span>
                </button>
            </div>
        </div>
    );
}

// ─── Languages ────────────────────────────────────────────────────────────────
const LANGUAGES = [
    { code: "EN",  label: "English"  },
    { code: "FIL", label: "Filipino" },
    { code: "CEB", label: "Cebuano"  },
];

// ─── Nav Tabs Config ──────────────────────────────────────────────────────────
const NAV_TABS: {
    label: string;
    navigatesTo: PageKey;
    activeOn: PageKey[];
    Icon: typeof LayoutGrid;
}[] = [
    { label: "Medicines",  navigatesTo: "home",       activeOn: ["home", "medicines", "catalog", "product"], Icon: LayoutGrid },
    { label: "Pickup",     navigatesTo: "pickup",     activeOn: ["pickup"],      Icon: Store     },
    { label: "Pharmacies", navigatesTo: "pharmacies", activeOn: ["pharmacies"],  Icon: Building2 },
];

const DEFAULT_LOCATION_LABEL = "Cebu City, PH";
const SAVED_LOCATION_KEY = "dosely:selectedLocation";

function getNavbarLocationLabel(location: Location | null) {
    if (!location) return DEFAULT_LOCATION_LABEL;

    const parts = [
        location.name,
        location.city && location.city !== location.name ? location.city : null,
    ].filter(Boolean);

    return parts.join(", ");
}

function getSavedLocation() {
    try {
        const savedLocation = window.localStorage.getItem(SAVED_LOCATION_KEY);
        return savedLocation ? (JSON.parse(savedLocation) as Location) : null;
    } catch {
        return null;
    }
}

function saveLocation(location: Location) {
    window.localStorage.setItem(SAVED_LOCATION_KEY, JSON.stringify(location));
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
export default function Navbar({ compact = false }: { compact?: boolean }) {
    const { currentPage, navigateTo, cartCount, favoriteIds } = useApp();
    const hideSecondaryNav = compact || currentPage === "pickup" || currentPage === "pharmacies";
    const [cartOpen,      setCartOpen]      = useState(false);
    const [accountOpen,   setAccountOpen]   = useState(false);
    const [langOpen,      setLangOpen]      = useState(false);
    const [activeLang,    setActiveLang]    = useState("EN");
    const [searchOpen,    setSearchOpen]    = useState(false);
    const [locationOpen,   setLocationOpen]   = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(getSavedLocation);
    const activeLocation = getNavbarLocationLabel(selectedLocation);
    const cartRef    = useRef<HTMLDivElement>(null);
    const accountRef = useRef<HTMLDivElement>(null);
    const langRef    = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handler(e: MouseEvent) {
            if (cartRef.current    && !cartRef.current.contains(e.target as Node))    setCartOpen(false);
            if (accountRef.current && !accountRef.current.contains(e.target as Node)) setAccountOpen(false);
            if (langRef.current    && !langRef.current.contains(e.target as Node))    setLangOpen(false);
        }
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <>
            <nav className="sticky top-0 z-40 bg-white shadow-[0_4px_16px_rgba(6,30,41,0.10)]">

                {/* ── Top row ── */}
                <div className={hideSecondaryNav ? "px-12 py-4 flex items-center gap-5" : "px-12 pt-3.5 pb-0 flex items-center gap-5"}>

                    {/* Logo */}
                    <button onClick={() => navigateTo("home")} className="shrink-0 bg-transparent border-none p-0 cursor-pointer mr-1.5">
                        <img src={Logo} className="h-12 w-auto" alt="Dosely logo" />
                    </button>

                    {/* Location */}
                    <button
                        onClick={() => setLocationOpen(true)}
                        className="flex items-center gap-1.5 hover:bg-[#2d2d2d]/8 px-2.5 py-1.5 rounded-lg text-[#262626] shrink-0 whitespace-nowrap transition-all duration-200 cursor-pointer"
                    >
                        <MapPin size={20} className="text-[#262626]" strokeWidth={1.6} />
                        <span className="text-sm text-[#262626] epilogue-regular">{activeLocation}</span>
                        <ChevronDown size={22} strokeWidth={1.6} className="text-[#262626]" />
                    </button>

                    <div className="flex-1" />

                    {/* ── Right action groups ── */}
                    <div className="flex items-center gap-6 shrink-0">

                        {/* Group 1: Favorites + Cart */}
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => navigateTo("favorites" as PageKey)}
                                className="icon-btn"
                                title="Favorites"
                            >
                                <span className="relative">
                                    <Heart size={20} strokeWidth={1.8} />
                                    {favoriteIds.length > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none shadow-sm">
                                            {favoriteIds.length}
                                        </span>
                                    )}
                                </span>
                            </button>

                            <div className="relative" ref={cartRef}>
                                <button
                                    onClick={() => cartCount > 0 && setCartOpen((o) => !o)}
                                    className={["icon-btn", cartCount === 0 ? "opacity-35 cursor-not-allowed" : ""].join(" ")}
                                    title="Cart"
                                    disabled={cartCount === 0}
                                >
                                        <span className="relative">
                                            <ShoppingBag size={20} strokeWidth={1.8} />
                                            {cartCount > 0 && (
                                                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none shadow-sm">
                                                    {cartCount}
                                                </span>
                                            )}
                                        </span>
                                </button>
                                {cartOpen && <CartDropdown onClose={() => setCartOpen(false)} />}
                            </div>
                        </div>

                        {/* Group 2: Language + Account */}
                        <div className="flex items-center gap-1">

                            {/* Language */}
                            <div className="relative" ref={langRef}>
                                <button
                                    onClick={() => setLangOpen((o) => !o)}
                                    className="flex items-center gap-1.5 text-[#262626] hover:text-[#427b77] transition-colors duration-200 cursor-pointer px-2.5 py-1.5 rounded-lg hover:bg-[#2d2d2d]/8"
                                    title="Language"
                                >
                                        <span style={{ display: "inline-flex", alignItems: "center", width: 18, height: 18, transform: "rotate(-23deg)" }}>
                                            <Globe size={18} strokeWidth={1.8} />
                                        </span>
                                    <span className="text-sm epilogue-regular tracking-wide">{activeLang}</span>
                                    <ChevronDown size={22} strokeWidth={1.6} className="text-[#262626]" style={{ transform: langOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }} />
                                </button>
                                {langOpen && (
                                    <div className="absolute top-[calc(100%+10px)] right-0 w-40 bg-white rounded-xl shadow-[0_20px_56px_rgba(6,30,41,0.16)] border border-gray-100 z-50 py-1.5 animate-slideDown">
                                        <div className="px-1.5 py-1 space-y-0.5">
                                            {LANGUAGES.map((lang) => (
                                                <button
                                                    key={lang.code}
                                                    onClick={() => { setActiveLang(lang.code); setLangOpen(false); }}
                                                    className={[
                                                        "w-full flex items-center gap-2.5 px-3 py-2.5 text-xs epilogue-regular font-medium rounded-lg transition-colors duration-150 cursor-pointer text-left",
                                                        activeLang === lang.code ? "text-[#262626] bg-[#F4F7F8]" : "text-[#262626]/70 hover:bg-[#F4F7F8] hover:text-[#262626]",
                                                    ].join(" ")}
                                                >
                                                    <span className="text-[10px] tracking-wider w-7">{lang.code}</span>
                                                    <span>{lang.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Account */}
                            <div className="relative" ref={accountRef}>
                                <button
                                    onClick={() => setAccountOpen((o) => !o)}
                                    className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-lg hover:bg-[#2d2d2d]/8 transition-all duration-200 cursor-pointer"
                                >
                                    <span className="text-sm font-semibold text-[#262626] epilogue-regular leading-none">Ken</span>
                                    <span className="relative w-9 h-9 rounded-full bg-[#427b77] flex items-center justify-center shrink-0">
                                            <UserRound size={16} strokeWidth={2} className="text-white" />
                                            <span
                                                className="absolute -bottom-0.5 -right-0.5 w-[17px] h-[17px] rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm"
                                                style={{ transition: "transform 0.2s ease", transform: accountOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                                            >
                                                <ChevronDown size={22} strokeWidth={1.6} className="text-[#262626]" />
                                            </span>
                                        </span>
                                </button>
                                {accountOpen && (
                                    <AccountDropdown
                                        onClose={() => setAccountOpen(false)}
                                        navigateTo={navigateTo}
                                    />
                                )}
                            </div>
                        </div>

                    </div>
                </div>

                {!hideSecondaryNav && (
                    <div className="flex items-center gap-0.5 pl-12 pr-12 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {NAV_TABS.map((tab, index) => {
                            const isActive = tab.activeOn.includes(currentPage);
                            return (
                                <button
                                    key={tab.label}
                                    onClick={() => navigateTo(tab.navigatesTo)}
                                    className={[
                                        "nav-tab flex items-center py-2 text-sm whitespace-nowrap cursor-pointer bg-transparent border-none epilogue-regular",
                                        index === 0 ? "pl-0 pr-6" : "px-6",
                                        isActive ? "nav-tab--active" : "",
                                    ].join(" ")}
                                >
                                        <span className="nav-tab-inner">
                                            <tab.Icon size={18} className="nav-tab-icon" />
                                            <span className="nav-tab-label">{tab.label}</span>
                                        </span>
                                </button>
                            );
                        })}

                        {/* ── Search circle button ── */}
                        <div className="flex items-center gap-3 ml-auto shrink-0 py-2">
                            <button
                                onClick={() => setSearchOpen(true)}
                                className="icon-btn"
                                title="Search medicines"
                                aria-label="Open search"
                            >
                                <Search size={18} strokeWidth={1.8} />
                            </button>
                        </div>
                    </div>
                )}

                <style>{`
                    @keyframes slideDown {
                        from { opacity: 0; transform: translateY(-8px); }
                        to   { opacity: 1; transform: translateY(0); }
                    }
                    .animate-slideDown { animation: slideDown 0.18s ease-out; }

                    /* ── Nav tab base ── */
                    .nav-tab {
                        color: rgba(38,38,38,0.40);
                        font-weight: 400;
                        transition: color 0.2s ease;
                    }
                    .nav-tab:hover { color: rgba(38,38,38,0.70); }

                    /* Inner flex row: icon + label — fixed width so every tab is the same */
                    .nav-tab-inner {
                        position: relative;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        gap: 8px;
                        width: 110px;
                    }

                    /* Underline: fixed width centered under every tab — identical regardless of label length */
                    .nav-tab-inner::after {
                        content: "";
                        position: absolute;
                        bottom: -14px;
                        left: 50%;
                        width: 100%;
                        height: 2.5px;
                        border-radius: 3px 3px 0 0;
                        background: #262626;
                        transform: translateX(-50%) scaleX(0);
                        transform-origin: center;
                        transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease;
                        opacity: 0;
                    }

                    /* Active state */
                    .nav-tab--active {
                        color: #262626;
                        font-weight: 500;
                    }
                    .nav-tab--active .nav-tab-inner::after {
                        transform: translateX(-50%) scaleX(1);
                        opacity: 1;
                    }

                    /* Hover ghost underline (non-active only) */
                    .nav-tab:not(.nav-tab--active):hover .nav-tab-inner::after {
                        transform: translateX(-50%) scaleX(1);
                        opacity: 0.22;
                        transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease;
                    }

                    /* ── Icon button ── */
                    .icon-btn {
                        display: flex; align-items: center; justify-content: center;
                        width: 38px; height: 38px; border-radius: 50%; border: none;
                        background: transparent; color: #262626; cursor: pointer;
                        transition: background 0.15s ease, color 0.15s ease; flex-shrink: 0;
                    }
                    .icon-btn:hover { background: rgba(45,45,45,0.08); color: #427b77; }
                `}</style>
            </nav>

            {/* ── Search Modal ── */}
            <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
            <LocationPickerModal
                isOpen={locationOpen}
                onClose={() => setLocationOpen(false)}
                onSelect={(loc) => {
                    setSelectedLocation(loc);
                    saveLocation(loc);
                    setLocationOpen(false);
                }}
                initialSelectedLocation={selectedLocation}
            />
        </>
    );
}
