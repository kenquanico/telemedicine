import  { useState, useRef, useEffect } from "react";
import { useApp } from "../hooks/useApp";
import type { PageKey } from "../types";
import Logo from "../assets/dosely-4.svg";
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
    ListFilter,
    LogOut,
    Settings,
    ClipboardList,
    X,
    SlidersHorizontal,
} from "lucide-react";

// ─── Cart Dropdown ────────────────────────────────────────────────────────────
function CartDropdown({ onClose }: { onClose: () => void }) {
    const { cartItems, cartTotal, navigateTo } = useApp();

    return (
        <div className="absolute top-[calc(100%+12px)] right-0 w-96 bg-white rounded-2xl shadow-[0_24px_64px_rgba(6,30,41,0.16)] border border-gray-100 z-50 p-6 animate-slideDown">
            <p className="text-sm font-bold text-[#2d2d2d] mb-4 tracking-widest uppercase">
                Cart &mdash; {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
            </p>
            {cartItems.length === 0 ? (
                <p className="text-center py-8 text-gray-400 text-sm epilogue-regular">Your cart is empty</p>
            ) : (
                <>
                    <div className="max-h-64 overflow-y-auto -mx-2 px-2 space-y-1">
                        {cartItems.map((item) => (
                            <div key={item.product.id} className="flex gap-3 px-2 py-3 border-b border-[#262626]/10 items-center last:border-b-0 hover:bg-[#F4F7F8] rounded-xl transition-colors duration-150">
                                <div className="w-13 h-13 bg-[#F4F7F8] rounded-xl flex items-center justify-center text-xl shrink-0">
                                    {item.product.image}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-base font-semibold text-[#2d2d2d] truncate leading-tight epilogue-regular">{item.product.brandName}</p>
                                    <p className="text-sm text-gray-400 mt-0.5 epilogue-regular">Qty: {item.quantity}</p>
                                </div>
                                <span className="text-base font-bold text-[#427b77] shrink-0">
                                    ₱{(item.product.price * item.quantity).toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="pt-4 mt-1 border-t border-[#262626]/10">
                        <div className="flex justify-between mb-4">
                            <span className="text-base text-gray-500 epilogue-regular">Total</span>
                            <span className="text-lg font-bold text-[#2d2d2d]">₱{cartTotal.toLocaleString()}</span>
                        </div>
                        <button
                            onClick={() => { navigateTo("cart"); onClose(); }}
                            className="w-full bg-[#2d2d2d] hover:bg-[#427b77] text-white rounded-xl py-3.5 text-sm font-semibold transition-colors duration-200 cursor-pointer tracking-wide"
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
        <div className="absolute top-[calc(100%+12px)] right-0 w-64 bg-white rounded-2xl shadow-[0_24px_64px_rgba(6,30,41,0.16)] border border-gray-100 z-50 py-2 animate-slideDown">
            <div className="px-5 py-3 mb-1">
                <p className="text-base font-semibold text-[#2d2d2d] leading-tight epilogue-regular">Ken Aldrey Quanico</p>
                <button className="text-sm text-[#3B82F6] mt-0.5 epilogue-subheader hover:text-[#2563EB]">View Profile</button>
            </div>
            <div className="px-2 py-1">
                {items.map(({ Icon, label, page }) => (
                    <button
                        key={label}
                        onClick={() => { navigateTo(page); onClose(); }}
                        className="w-full flex items-center gap-3 px-3 py-3 text-sm epilogue-regular text-gray-500 hover:bg-[#F4F7F8] hover:text-[#2d2d2d] rounded-xl transition-colors duration-150 cursor-pointer"
                    >
                        <Icon size={17} strokeWidth={1.8} />
                        <span>{label}</span>
                    </button>
                ))}
            </div>
            <div className="border-t border-[#262626]/10 mx-3 my-1" />
            <div className="px-2 pb-1">
                <button className="w-full flex items-center gap-3 px-3 py-3 text-sm epilogue-regular text-red-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors duration-150 cursor-pointer">
                    <LogOut size={17} strokeWidth={1.8} />
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

// ─── Navbar ───────────────────────────────────────────────────────────────────
export default function Navbar() {
    const { currentPage, navigateTo, cartCount, filterOpen, setFilterOpen } = useApp();
    const [cartOpen,    setCartOpen]    = useState(false);
    const [accountOpen, setAccountOpen] = useState(false);
    const [langOpen,    setLangOpen]    = useState(false);
    const [activeLang,  setActiveLang]  = useState("EN");
    const [searchValue, setSearchValue] = useState("");
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
        <nav className="sticky top-0 z-40 bg-white shadow-[0_4px_16px_rgba(6,30,41,0.10)]">

            {/* ── Top row ── */}
            <div className="px-16 pt-5 pb-0 flex items-center gap-6">

                {/* Logo */}
                <button onClick={() => navigateTo("home")} className="shrink-0 bg-transparent border-none p-0 cursor-pointer mr-2">
                    <img src={Logo} className="h-16 w-auto" alt="Dosely logo" />
                </button>

                {/* Location */}
                <button className="flex items-center gap-2 hover:bg-[#2d2d2d]/8 px-3 py-2 rounded-xl text-[#2d2d2d] shrink-0 whitespace-nowrap transition-all duration-200 cursor-pointer">
                    <MapPin size={22} className="text-[#2d2d2d]" strokeWidth={2} />
                    <span className="text-base text-[#2d2d2d] epilogue-regular">Cebu City, PH</span>
                    <ChevronDown size={15} strokeWidth={2} />
                </button>

                <div className="flex-1" />

                {/* ── Right action groups ── */}
                <div className="flex items-center gap-8 shrink-0">

                    {/* Group 1: Favorites + Cart */}
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => navigateTo("favorites" as PageKey)}
                            className="icon-btn"
                            title="Favorites"
                        >
                            <Heart size={24} strokeWidth={1.8} />
                        </button>

                        <div className="relative" ref={cartRef}>
                            <button
                                onClick={() => cartCount > 0 && setCartOpen((o) => !o)}
                                className={["icon-btn", cartCount === 0 ? "opacity-35 cursor-not-allowed" : ""].join(" ")}
                                title="Cart"
                                disabled={cartCount === 0}
                            >
                                <span className="relative">
                                    <ShoppingBag size={24} strokeWidth={1.8} />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center leading-none shadow-sm">
                                            {cartCount}
                                        </span>
                                    )}
                                </span>
                            </button>
                            {cartOpen && <CartDropdown onClose={() => setCartOpen(false)} />}
                        </div>
                    </div>

                    {/* Group 2: Language + Account */}
                    <div className="flex items-center gap-1.5">

                        {/* Language */}
                        <div className="relative" ref={langRef}>
                            <button
                                onClick={() => setLangOpen((o) => !o)}
                                className="flex items-center gap-1.5 text-[#2d2d2d] hover:text-[#427b77] transition-colors duration-200 cursor-pointer px-3 py-2 rounded-xl hover:bg-[#2d2d2d]/8"
                                title="Language"
                            >
                                <span style={{ display: "inline-flex", alignItems: "center", width: 22, height: 22, transform: "rotate(-23deg)" }}>
                                    <Globe size={22} strokeWidth={1.8} />
                                </span>
                                <span className="text-base epilogue-regular tracking-wide">{activeLang}</span>
                                <ChevronDown size={14} strokeWidth={2} style={{ transform: langOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }} />
                            </button>
                            {langOpen && (
                                <div className="absolute top-[calc(100%+12px)] right-0 w-44 bg-white rounded-2xl shadow-[0_24px_64px_rgba(6,30,41,0.16)] border border-gray-100 z-50 py-2 animate-slideDown">
                                    <div className="px-2 py-2 space-y-1">
                                        {LANGUAGES.map((lang) => (
                                            <button
                                                key={lang.code}
                                                onClick={() => { setActiveLang(lang.code); setLangOpen(false); }}
                                                className={[
                                                    "w-full flex items-center gap-3 px-3 py-3 text-sm epilogue-regular font-medium rounded-xl transition-colors duration-150 cursor-pointer text-left",
                                                    activeLang === lang.code ? "text-[#2d2d2d] bg-[#F4F7F8]" : "text-gray-500 hover:bg-[#F4F7F8] hover:text-[#2d2d2d]",
                                                ].join(" ")}
                                            >
                                                <span className="text-xs tracking-wider w-8">{lang.code}</span>
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
                                className="flex items-center gap-2.5 pl-2.5 pr-2 py-1.5 rounded-xl hover:bg-[#2d2d2d]/8 transition-all duration-200 cursor-pointer"
                            >
                                <span className="text-base font-semibold text-[#2d2d2d] epilogue-regular leading-none">Ken</span>
                                <span className="relative w-11 h-11 rounded-full bg-[#427b77] flex items-center justify-center shrink-0">
                                    <UserRound size={20} strokeWidth={2} className="text-white" />
                                    <span
                                        className="absolute -bottom-0.5 -right-0.5 w-[20px] h-[20px] rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm"
                                        style={{ transition: "transform 0.2s ease", transform: accountOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                                    >
                                        <ChevronDown size={11} strokeWidth={2.5} className="text-[#2d2d2d]" />
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

            {/* ── Tab row ── */}
            <div className="flex items-center gap-0.5 pl-16 pr-16 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {NAV_TABS.map((tab, index) => {
                    const isActive = tab.activeOn.includes(currentPage);
                    return (
                        <button
                            key={tab.label}
                            onClick={() => navigateTo(tab.navigatesTo)}
                            className={[
                                "nav-tab flex items-center py-[19px] text-base whitespace-nowrap cursor-pointer bg-transparent border-none font-['Geist'] epilogue-regular",
                                index === 0 ? "pl-0 pr-7" : "px-7",
                                isActive ? "nav-tab--active" : "",
                            ].join(" ")}
                        >
                            <span className="nav-tab-inner">
                                <tab.Icon size={22} />
                                <span className="nav-tab-label">{tab.label}</span>
                                <span className="nav-tab-underline" />
                            </span>
                        </button>
                    );
                })}

                {/* ── Search + Filter ── */}
                <div className="flex items-center gap-4 ml-auto shrink-0 py-[9px]">
                    <div className="relative flex items-center">
                        <Search
                            size={17}
                            strokeWidth={2}
                            className="absolute left-4 pointer-events-none text-[#427b77]/60 z-10"
                        />
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder="Search medicines..."
                            className="w-84 pl-11 pr-9 py-3 text-sm bg-white epilogue-regular border border-gray-200 rounded-full text-[#2d2d2d] placeholder:text-[#2d2d2d]/35 font-['Geist'] outline-none shadow-[0_0_0_3px_rgba(66,123,119,0.08)] transition-all duration-200 focus:shadow-[0_0_0_4px_rgba(66,123,119,0.13)]"
                        />
                        {searchValue && (
                            <button
                                onClick={() => setSearchValue("")}
                                className="absolute right-3 flex items-center justify-center w-5 h-5 rounded-full bg-[#427b77]/10 hover:bg-[#427b77]/20 text-[#427b77] transition-colors duration-150 cursor-pointer"
                            >
                                <X size={11} strokeWidth={2.5} />
                            </button>
                        )}
                    </div>

                    {/* Filter button — active when filterOpen */}
                    <button
                        onClick={() => setFilterOpen((o: boolean) => !o)}
                        className={[
                            "flex items-center justify-center w-11 h-11 rounded-full cursor-pointer shrink-0 border transition-all duration-200",
                            filterOpen
                                ? "bg-[#427b77] border-[#427b77] text-white shadow-[0_0_0_4px_rgba(66,123,119,0.18)]"
                                : "bg-white border-gray-200 shadow-[0_0_0_3px_rgba(66,123,119,0.08)] text-[#427b77] hover:shadow-[0_0_0_4px_rgba(66,123,119,0.13)]",
                        ].join(" ")}
                        title="Filter"
                    >
                        <SlidersHorizontal size={18} strokeWidth={2} />
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .animate-slideDown { animation: slideDown 0.18s ease-out; }

                .nav-tab {
                    color: rgba(45,45,45,0.40);
                    font-weight: 400;
                    transition: color 0.2s ease;
                }
                .nav-tab:hover { color: rgba(45,45,45,0.70); }

                .nav-tab-inner {
                    position: relative;
                    display: inline-flex;
                    align-items: center;
                    gap: 12px;
                    padding-bottom: 2px;
                }

                .nav-tab-underline {
                    position: absolute;
                    bottom: -18px;
                    left: 0;
                    width: 100%;
                    height: 3px;
                    border-radius: 3px 3px 0 0;
                    background: #2d2d2d;
                    transform: scaleX(0);
                    transform-origin: center;
                    transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s ease;
                    opacity: 0;
                }
                .nav-tab--active { color: #2d2d2d; font-weight: 500; }
                .nav-tab--active .nav-tab-underline { transform: scaleX(1); opacity: 1; }
                .nav-tab:not(.nav-tab--active):hover .nav-tab-underline {
                    transform: scaleX(1);
                    opacity: 0.22;
                    transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s ease;
                }

                .icon-btn {
                    display: flex; align-items: center; justify-content: center;
                    width: 44px; height: 44px; border-radius: 50%; border: none;
                    background: transparent; color: #2d2d2d; cursor: pointer;
                    transition: background 0.15s ease, color 0.15s ease; flex-shrink: 0;
                }
                .icon-btn:hover { background: rgba(45,45,45,0.08); color: #427b77; }
            `}</style>
        </nav>
    );
}