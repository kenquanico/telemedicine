import { useState } from "react";
import { useApp } from "../hooks/useApp";
import { SectionHeader } from "../components/UI";
import Footer from "../components/Footer";
import FilterPanel from "../components/FilterPanel";
import { getDefaultFilters } from "../utils/filterState";
import { X, Filter, BadgeCheck } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
type ServiceTag = "delivery" | "pickup" | "24hrs" | "senior_discount" | "prescription";

interface Pharmacy {
    id: string;
    name: string;
    branch: string;
    address: string;
    distance: string;
    rating: number;
    reviewCount: number;
    isOpen: boolean;
    closingTime: string;
    phone: string;
    tags: ServiceTag[];
    deliveryTime: string;
    minOrder: number;
    logo: string;
    verified: boolean;
}

// ── Mock Data ─────────────────────────────────────────────────────────────────
const PHARMACIES: Pharmacy[] = [
    {
        id: "ph-1",
        name: "Mercury Drug",
        branch: "SM City Cebu",
        address: "North Reclamation Area, Cebu City",
        distance: "0.8 km",
        rating: 4.8,
        reviewCount: 1240,
        isOpen: true,
        closingTime: "10:00 PM",
        phone: "+63 32 234 5678",
        tags: ["delivery", "pickup", "24hrs", "prescription"],
        deliveryTime: "30–45 min",
        minOrder: 150,
        logo: "💊",
        verified: true,
    },
    {
        id: "ph-2",
        name: "Rose Pharmacy",
        branch: "Ayala Center Cebu",
        address: "Cardinal Rosales Ave, Cebu Business Park",
        distance: "1.2 km",
        rating: 4.7,
        reviewCount: 892,
        isOpen: true,
        closingTime: "9:00 PM",
        phone: "+63 32 233 1234",
        tags: ["delivery", "pickup", "senior_discount", "prescription"],
        deliveryTime: "25–40 min",
        minOrder: 200,
        logo: "🌹",
        verified: true,
    },
    {
        id: "ph-3",
        name: "Watsons",
        branch: "IT Park",
        address: "Cebu IT Park, Lahug, Cebu City",
        distance: "1.5 km",
        rating: 4.6,
        reviewCount: 634,
        isOpen: true,
        closingTime: "10:00 PM",
        phone: "+63 32 261 8890",
        tags: ["delivery", "pickup", "prescription"],
        deliveryTime: "35–50 min",
        minOrder: 250,
        logo: "🧴",
        verified: true,
    },
    {
        id: "ph-4",
        name: "Generika Drugstore",
        branch: "Colon Street",
        address: "Colon St, Downtown Cebu City",
        distance: "2.1 km",
        rating: 4.5,
        reviewCount: 418,
        isOpen: false,
        closingTime: "8:00 PM",
        phone: "+63 32 256 7890",
        tags: ["delivery", "senior_discount"],
        deliveryTime: "40–55 min",
        minOrder: 100,
        logo: "🏥",
        verified: true,
    },
    {
        id: "ph-5",
        name: "The Generics Pharmacy",
        branch: "Banilad Town Centre",
        address: "Banilad Road, Cebu City",
        distance: "2.4 km",
        rating: 4.4,
        reviewCount: 305,
        isOpen: true,
        closingTime: "9:30 PM",
        phone: "+63 32 265 4321",
        tags: ["delivery", "pickup"],
        deliveryTime: "45–60 min",
        minOrder: 100,
        logo: "💉",
        verified: false,
    },
    {
        id: "ph-6",
        name: "Southstar Drug",
        branch: "Mandaue City",
        address: "A.S. Fortuna St, Mandaue City",
        distance: "3.0 km",
        rating: 4.6,
        reviewCount: 521,
        isOpen: true,
        closingTime: "11:00 PM",
        phone: "+63 32 344 5678",
        tags: ["delivery", "pickup", "24hrs", "prescription", "senior_discount"],
        deliveryTime: "50–65 min",
        minOrder: 150,
        logo: "⭐",
        verified: true,
    },
];

const SERVICE_TAGS: { key: ServiceTag; label: string }[] = [
    { key: "delivery",        label: "Delivery"        },
    { key: "pickup",          label: "Pickup"          },
    { key: "24hrs",           label: "24 Hours"        },
    { key: "senior_discount", label: "Senior Discount" },
    { key: "prescription",    label: "Prescription"    },
];

// ── Pharmacy Card — same structure as VendorMedicineCard ──────────────────────
function PharmacyCard({ pharmacy, onView }: { pharmacy: Pharmacy; onView: () => void }) {
    return (
        <div className="group cursor-pointer" onClick={onView}>

            {/* ── Image block ── */}
            <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl bg-[#F0F5F4] mb-3">
                <div className="w-full h-full flex items-center justify-center text-5xl select-none transition-transform duration-300 group-hover:scale-105">
                    {pharmacy.logo}
                </div>

                {/* Open/Closed badge — top left, same position as Sale badge */}
                <div className={`absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-lg epilogue-header tracking-wide ${
                    pharmacy.isOpen
                        ? "bg-[#427b77] text-white"
                        : "bg-[#2d2d2d]/70 text-white/80"
                }`}>
                    {pharmacy.isOpen ? `Open · Closes ${pharmacy.closingTime}` : "Closed"}
                </div>

                {/* Delivery time — bottom left floating chip */}
                <div className="absolute bottom-2.5 left-2.5 bg-white/90 backdrop-blur-sm text-[#262626] text-[10px] font-bold px-2 py-0.5 rounded-lg epilogue-header shadow-sm">
                    🚚 {pharmacy.deliveryTime}
                </div>
            </div>

            {/* ── Text info ── */}
            <div className="px-0.5">
                {/* Name + distance */}
                <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1 flex-1 min-w-0">
                        <p className="text-[15px] font-bold text-[#262626] epilogue-header leading-snug truncate">
                            {pharmacy.name}
                        </p>
                        {pharmacy.verified && (
                            <BadgeCheck size={13} className="text-[#427b77] shrink-0" strokeWidth={2} />
                        )}
                    </div>
                    <span className="text-[14px] font-extrabold text-[#427b77] epilogue-header shrink-0">
                        {pharmacy.distance}
                    </span>
                </div>

                {/* Branch · address */}
                <p className="text-[13px] text-[#262626]/60 epilogue-regular mb-1.5 truncate">
                    {pharmacy.branch} · {pharmacy.address}
                </p>

                {/* Rating + tags row — same structure as rating + dosageForm + packSize */}
                <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1">
                        <svg width="11" height="11" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" fill="#f59e0b"
                                  d="M7.88486 12.1954L4.88943 13.7787C4.64763 13.9065 4.34857 13.813 4.22145 13.5699C4.17083 13.4731 4.15336 13.3622 4.17175 13.2544L4.74383 9.90101C4.75759 9.82035 4.73099 9.73805 4.6727 9.68092L2.24935 7.30602C2.05373 7.11431 2.04973 6.79947 2.24041 6.6028C2.31634 6.52448 2.41583 6.47352 2.52348 6.45779L5.87247 5.96853C5.95302 5.95676 6.02265 5.9059 6.05868 5.83251L7.55639 2.78147C7.67729 2.53518 7.97388 2.43406 8.21885 2.55561C8.3164 2.60402 8.39535 2.6834 8.4435 2.78147L9.94121 5.83251C9.97723 5.9059 10.0469 5.95676 10.1274 5.96853L13.4764 6.45779C13.7467 6.49728 13.9341 6.74963 13.8948 7.02142C13.8791 7.12965 13.8284 7.22968 13.7505 7.30602L11.3272 9.68092C11.2689 9.73805 11.2423 9.82035 11.2561 9.90101L11.8281 13.2544C11.8743 13.5251 11.6935 13.7822 11.4242 13.8286C11.317 13.8471 11.2067 13.8296 11.1105 13.7787L8.11503 12.1954C8.04298 12.1573 7.95691 12.1573 7.88486 12.1954Z"
                            />
                        </svg>
                        <span className="text-[13px] font-semibold text-[#262626] epilogue-header">{pharmacy.rating}</span>
                        <span className="text-[13px] text-[#262626]/60 epilogue-regular">({pharmacy.reviewCount}+)</span>
                    </div>

                    <span className="text-[12px] text-[#262626]/40">•</span>

                    <span className="text-[13px] text-[#262626]/60 epilogue-regular">
                        Min. ₱{pharmacy.minOrder}
                    </span>

                    {pharmacy.tags.includes("24hrs") && (
                        <>
                            <span className="text-[12px] text-[#262626]/40">•</span>
                            <span className="text-[13px] font-semibold text-[#427b77] epilogue-regular">24 hrs</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function PharmaciesPage() {
    const { navigateTo, showModal } = useApp();
    const [search, setSearch]               = useState("");
    const [activeFilters, setActiveFilters] = useState<ServiceTag[]>([]);
    const [sortBy, setSortBy]               = useState<"distance" | "rating" | "delivery">("distance");
    const [filters, setFilters]             = useState(getDefaultFilters);

    const filtered = PHARMACIES.filter((p) => {
        const matchSearch =
            search === "" ||
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.branch.toLowerCase().includes(search.toLowerCase());
        const matchTags =
            activeFilters.length === 0 ||
            activeFilters.every((f) => p.tags.includes(f));
        return matchSearch && matchTags;
    }).sort((a, b) => {
        if (sortBy === "rating")   return b.rating - a.rating;
        if (sortBy === "delivery") return parseInt(a.deliveryTime) - parseInt(b.deliveryTime);
        return parseFloat(a.distance) - parseFloat(b.distance);
    });

    const handleView = (pharmacy: Pharmacy) => {
        showModal?.({
            type: "info",
            icon: pharmacy.logo,
            title: `${pharmacy.name} — ${pharmacy.branch}`,
            message: `${pharmacy.address}\n${pharmacy.phone}\nDelivery: ${pharmacy.deliveryTime} · Min. order ₱${pharmacy.minOrder}`,
            actionLabel: "Browse Products",
            onAction: () => navigateTo("catalog"),
        });
    };

    return (
        <>
            <div className="relative flex items-start gap-7 px-5 sm:px-8 lg:px-16">
                <div className="flex-1 min-w-0">

                    <div className="mt-10 mb-8">
                        <p className="text-[11px] font-extrabold tracking-[0.14em] text-[#427b77] uppercase mb-2 epilogue-header">
                            Cebu City, PH
                        </p>
                        <h1 className="text-[28px] font-extrabold text-[#262626] epilogue-header leading-tight mb-2">
                            Partner Pharmacies
                        </h1>
                        <p className="text-[14px] text-[#262626]/60 epilogue-regular max-w-[480px]">
                            All partner pharmacies are FDA-registered. Order directly and get medicines delivered to your door.
                        </p>
                    </div>

                    {/* ── Trust bar ── */}
                    <div className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-3">
                        {[
                            { icon: "🛡️", title: "FDA Registered",      sub: "All verified partners"    },
                            { icon: "🚚", title: "Same-Day Delivery",    sub: "Order before 3PM"         },
                            { icon: "💊", title: "6 Partner Pharmacies", sub: "Across Cebu City"         },
                        ].map((f) => (
                            <div key={f.title} className="bg-white border border-[#EAEFEE] rounded-2xl px-[22px] py-5 flex items-center gap-3.5">
                                <div className="w-11 h-11 rounded-xl bg-[#F0F7F6] flex items-center justify-center text-xl shrink-0">
                                    {f.icon}
                                </div>
                                <div>
                                    <div className="text-[13px] font-bold text-[#262626] epilogue-header mb-0.5">{f.title}</div>
                                    <div className="text-xs text-[#262626]/60 epilogue-regular">{f.sub}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mb-5">
                        <div className="relative flex items-center flex-1">
                            <svg className="absolute left-3.5 pointer-events-none text-[#262626]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search pharmacies..."
                                className="w-full pl-9 pr-9 py-2.5 text-xs bg-white epilogue-regular border border-[#EAEFEE] rounded-xl text-[#262626] placeholder:text-[#262626]/30 outline-none transition-all duration-200 focus:border-[#427b77]/40 focus:shadow-[0_0_0_3px_rgba(66,123,119,0.10)]"
                            />
                            {search && (
                                <button onClick={() => setSearch("")} className="absolute right-3 w-4 h-4 rounded-full bg-[#427b77]/10 hover:bg-[#427b77]/20 flex items-center justify-center transition-colors">
                                    <X size={14} strokeWidth={1.6} className="text-[#262626]" />
                                </button>
                            )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            {(["distance", "rating", "delivery"] as const).map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setSortBy(s)}
                                    className={`px-3.5 py-2 rounded-xl text-[11px] font-bold epilogue-header capitalize transition-all duration-200 ${
                                        sortBy === s
                                            ? "bg-[#2d2d2d] text-white"
                                            : "bg-white border border-[#EAEFEE] text-[#262626]/60 hover:border-[#427b77]/30 hover:text-[#262626]"
                                    }`}
                                >
                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap mb-8">
                        <span className="text-[11px] text-[#262626]/60 epilogue-regular flex items-center gap-1">
                            <Filter size={20} strokeWidth={1.6} className="text-[#262626]" /> Filter:
                        </span>
                        {SERVICE_TAGS.map((t) => (
                            <button
                                key={t.key}
                                onClick={() => setActiveFilters((prev) =>
                                    prev.includes(t.key) ? prev.filter((x) => x !== t.key) : [...prev, t.key]
                                )}
                                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold epilogue-header transition-all duration-200 ${
                                    activeFilters.includes(t.key)
                                        ? "bg-[#427b77] text-white"
                                        : "bg-white border border-[#EAEFEE] text-[#262626]/60 hover:border-[#427b77]/30 hover:text-[#262626]"
                                }`}
                            >
                                {t.label}
                            </button>
                        ))}
                        {activeFilters.length > 0 && (
                            <button onClick={() => setActiveFilters([])} className="text-[11px] text-[#427b77] font-semibold epilogue-regular hover:underline">
                                Clear all
                            </button>
                        )}
                    </div>

                    <div className="mb-10 lg:hidden">
                        <FilterPanel filters={filters} onChange={setFilters} />
                    </div>

                    <div className="mb-[52px]">
                        <SectionHeader title="All Pharmacies" />
                        {filtered.length === 0 ? (
                            <div className="mt-5 rounded-[20px] border border-[#EAEFEE] bg-white px-6 py-14 text-center">
                                <div className="mb-1.5 text-[17px] font-bold text-[#262626] epilogue-header">
                                    No pharmacies match these filters
                                </div>
                                <button
                                    onClick={() => { setSearch(""); setActiveFilters([]); }}
                                    className="mt-4 rounded-xl border border-[#DCE6E4] px-4 py-2 text-[12px] font-bold text-[#427b77] epilogue-header"
                                >
                                    Clear filters
                                </button>
                            </div>
                        ) : (
                            <div className="mt-5 grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
                                {filtered.map((p) => (
                                    <PharmacyCard key={p.id} pharmacy={p} onView={() => handleView(p)} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Partner CTA ── */}
                    <div className="mb-16 rounded-2xl border border-[#EAEFEE] bg-white px-8 py-8 flex flex-col sm:flex-row items-center gap-6">
                        <div className="w-11 h-11 rounded-xl bg-[#F0F7F6] flex items-center justify-center text-xl shrink-0">🏪</div>
                        <div className="flex-1 text-center sm:text-left">
                            <div className="text-[13px] font-bold text-[#262626] epilogue-header mb-0.5">Own a pharmacy in Cebu?</div>
                            <div className="text-xs text-[#262626]/60 epilogue-regular">Partner with Dosely to reach more customers with same-day delivery.</div>
                        </div>
                        <button className="bg-[#2d2d2d] hover:bg-[#427b77] text-white rounded-xl px-5 py-2.5 text-[12px] font-bold cursor-pointer epilogue-header transition-colors duration-200 shrink-0 whitespace-nowrap">
                            Become a Partner
                        </button>
                    </div>

                </div>

                {/* ── Filter panel — sticky desktop ── */}
                <div
                    className="filter-scroll-wrap sticky top-[120px] hidden w-[260px] shrink-0 self-start lg:block"
                    style={{
                        height: "calc(100vh - 120px)",
                        overflowY: "auto",
                        overflowX: "hidden",
                        scrollbarWidth: "none",
                    }}
                >
                    <style>{`.filter-scroll-wrap::-webkit-scrollbar { display: none; }`}</style>
                    <div className="pt-10 pb-10">
                        <FilterPanel filters={filters} onChange={setFilters} />
                    </div>
                </div>

            </div>
            <Footer />
        </>
    );
}
