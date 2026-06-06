import { useCallback, useState, useEffect, useRef } from "react";
import { MapPin, Search, Star, X, ChevronRight, Clock, Truck, CircleParking, Car, Navigation, Phone, Globe, ExternalLink, ChevronLeft } from "lucide-react";

const API_KEY = "AIzaSyATaHhW1zDWipZm7SgzjAFNS5j0ta3zDmA";

const FILTERS = ["Open Now", "24 Hours", "Has Parking", "Drive-Through", "Near Me"] as const;
const FILTER_ICONS = {
    "Open Now": Clock,
    "24 Hours": Clock,
    "Has Parking": CircleParking,
    "Drive-Through": Car,
    "Near Me": Navigation,
} as const;

const PHARMACY_COLORS: Record<string, string> = {
    Rose: "#e11d48",
    Mercury: "#0f766e",
    Watsons: "#005baa",
    Generika: "#16a34a",
    TGP: "#b45309",
    "St. Luke's": "#6d28d9",
    Default: "#427b77",
};

const DELIVERY_BRANDS = ["Watsons", "Mercury", "Rose", "Generika"];

interface Pharmacy {
    id: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
    rating: number | null;
    userRatingsTotal: number;
    openNow: boolean | null;
    hasFreeDelivery: boolean;
    photos: google.maps.places.PlacePhoto[] | undefined;
    types: string[];
}

interface LatLng {
    lat: number;
    lng: number;
}

function getBrandColor(name: string): string {
    for (const key of Object.keys(PHARMACY_COLORS)) {
        if (name.toLowerCase().includes(key.toLowerCase())) return PHARMACY_COLORS[key];
    }
    return PHARMACY_COLORS.Default;
}

function getInitials(name: string): string {
    return name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase();
}

function hasFreeDelivery(name: string): boolean {
    return DELIVERY_BRANDS.some((brand) => name.toLowerCase().includes(brand.toLowerCase()));
}

function getPinLabel(pharmacy: Pharmacy): string {
    const status = pharmacy.openNow === true ? "Open" : pharmacy.openNow === false ? "Closed" : "Hrs vary";
    return pharmacy.hasFreeDelivery ? `${status} · Free delivery` : status;
}

function getStatusColor(pharmacy: Pharmacy): string {
    if (pharmacy.openNow === true) return "#047857";
    if (pharmacy.openNow === false) return "#b91c1c";
    return "#6B7280";
}

const TRUCK_PATH =
    "M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z";

function getMarkerIcon(pharmacy: Pharmacy): google.maps.Icon {
    const pinColor = "#427b77";
    const statusColor = getStatusColor(pharmacy);
    const label = getPinLabel(pharmacy);
    const labelWidth = Math.max(92, Math.min(210, label.length * 7 + 42));
    const x = labelWidth / 2;

    const escapedLabel = label
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

    let iconPath: string;
    let iconScale = 0.64;
    const iconOffsetX = 12;

    if (pharmacy.hasFreeDelivery) {
        iconPath = TRUCK_PATH;
        iconScale = 0.58;
    } else if (pharmacy.openNow === true) {
        iconPath = "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z";
    } else if (pharmacy.openNow === false) {
        iconPath = "M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z";
    } else {
        iconPath = "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z";
    }

    const iconSize = 14;
    const iconSvg = `<g transform="translate(${iconOffsetX}, ${(34 - iconSize) / 2 + 2}) scale(${iconScale})">
        <path d="${iconPath}" fill="${statusColor}"/>
    </g>`;

    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${labelWidth}" height="78" viewBox="0 0 ${labelWidth} 78">
            <defs>
                <filter id="bubbleShadow" x="-20%" y="-20%" width="140%" height="160%">
                    <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#061e29" flood-opacity="0.13"/>
                </filter>
            </defs>
            <g filter="url(#bubbleShadow)">
                <rect x="4" y="2" width="${labelWidth - 8}" height="34" rx="14" fill="white" stroke="#E4ECEA" stroke-width="1.25"/>
                <path d="M${x - 7} 35L${x} 44L${x + 7} 35Z" fill="white" stroke="#E4ECEA" stroke-width="1.25" stroke-linejoin="round"/>
            </g>
            ${iconSvg}
            <text x="${iconOffsetX + iconSize + 9}" y="23" text-anchor="start" font-family="Epilogue, Arial, sans-serif" font-size="10.5" font-weight="700" fill="#2d2d2d">${escapedLabel}</text>
            <path d="M${x} 47C${x - 7.5} 47 ${x - 13.5} 53 ${x - 13.5} 60.5c0 9.5 13.5 17.5 13.5 17.5s13.5-8 13.5-17.5C${x + 13.5} 53 ${x + 7.5} 47 ${x} 47z" fill="${pinColor}" fill-opacity="0.58" stroke="white" stroke-width="2"/>
            <circle cx="${x}" cy="60.5" r="4.5" fill="white" fill-opacity="0.92"/>
            <circle cx="${x}" cy="60.5" r="2.4" fill="${pinColor}" fill-opacity="0.58"/>
        </svg>
    `;

    return {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
        anchor: new window.google.maps.Point(x, 77),
    };
}

// ── Star rating renderer ───────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => {
                const filled = rating >= i;
                const half = !filled && rating >= i - 0.5;
                return (
                    <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill="none">
                        {half ? (
                            <>
                                <defs>
                                    <linearGradient id={`half-${i}`}>
                                        <stop offset="50%" stopColor="#d97706" />
                                        <stop offset="50%" stopColor="#d1d5db" />
                                    </linearGradient>
                                </defs>
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill={`url(#half-${i})`} />
                            </>
                        ) : (
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill={filled ? "#d97706" : "#e5e7eb"} />
                        )}
                    </svg>
                );
            })}
        </div>
    );
}

// ── Detail Sidebar ─────────────────────────────────────────────────────────────
function PharmacySidebar({
                             pharmacy,
                             pharmacies,
                             loading,
                             selectedId,
                             onSelect,
                             onClose,
                         }: {
    pharmacy: Pharmacy | null;
    pharmacies: Pharmacy[];
    loading: boolean;
    selectedId: string | null;
    onSelect: (pharmacy: Pharmacy) => void;
    onClose: () => void;
}) {
    const color = pharmacy ? getBrandColor(pharmacy.name) : "#427b77";
    const photoUrl = pharmacy?.photos?.[0]?.getUrl({ maxWidth: 800, maxHeight: 400 });

    if (!pharmacy) {
        return (
            <aside
                className="absolute top-0 left-0 h-full z-30 bg-white shadow-[4px_0_32px_rgba(6,30,41,0.13)] border-r border-[#E4ECEA] flex flex-col overflow-hidden"
                style={{ width: "380px", maxWidth: "calc(100vw - 48px)" }}
            >
                <div className="px-5 py-5 border-b border-[#f0f4f3]">
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#427b77] epilogue-header mb-1">
                        Nearby Pharmacies
                    </p>
                    <h2 className="text-[22px] font-black text-[#2d2d2d] tracking-[-0.03em] epilogue-header leading-tight">
                        Pick up at a store
                    </h2>
                    <p className="mt-2 text-[13px] text-gray-400 epilogue-regular leading-relaxed">
                        Select a pharmacy to view store details, hours, and pickup options.
                    </p>
                </div>

                <div className="px-5 py-3 border-b border-[#f0f4f3] flex items-center justify-between">
                    <span className="text-[13px] font-bold text-[#2d2d2d] epilogue-header">
                        {loading ? "Finding stores..." : `${pharmacies.length} stores nearby`}
                    </span>
                    {!loading && (
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                            {pharmacies.filter((p) => p.openNow).length} open
                        </span>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-none px-3 py-3">
                    {loading ? (
                        <div className="space-y-3">
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-[86px] rounded-2xl bg-gradient-to-r from-[#f0f4f3] via-[#e5ecea] to-[#f0f4f3] bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]"
                                    style={{ animationDelay: `${i * 0.08}s` }}
                                />
                            ))}
                        </div>
                    ) : pharmacies.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center px-6 text-gray-400">
                            <MapPin size={30} strokeWidth={1.6} className="mb-3" />
                            <p className="text-[14px] font-bold text-[#2d2d2d] epilogue-header">No pharmacies found</p>
                            <span className="mt-1 text-[12px] epilogue-regular">Try a different search or filter.</span>
                        </div>
                    ) : (
                        <div className="space-y-1.5">
                            {pharmacies.map((item) => {
                                const itemColor = getBrandColor(item.name);
                                const isActive = selectedId === item.id;

                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => onSelect(item)}
                                        className={`w-full flex items-start gap-3 rounded-2xl px-3 py-3 text-left cursor-pointer transition-all border ${
                                            isActive
                                                ? "bg-[#f0f7f6] border-[#427b77]/35"
                                                : "bg-white border-transparent hover:bg-[#f8fafa] hover:border-[#E4ECEA]"
                                        }`}
                                    >
                                        <span
                                            className="w-11 h-11 rounded-xl flex items-center justify-center text-[12px] font-black shrink-0"
                                            style={{ background: itemColor + "18", color: itemColor }}
                                        >
                                            {getInitials(item.name)}
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="block text-[13px] font-bold text-[#2d2d2d] epilogue-header truncate">
                                                {item.name}
                                            </span>
                                            <span className="mt-1 flex items-center gap-1 text-[11px] text-gray-400 epilogue-regular truncate">
                                                <MapPin size={10} strokeWidth={2} className="shrink-0" />
                                                {item.address || "See on map"}
                                            </span>
                                            <span className="mt-2 flex items-center gap-1.5 flex-wrap">
                                                {item.rating && (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700">
                                                        <Star size={10} fill="currentColor" strokeWidth={0} />
                                                        {item.rating}
                                                    </span>
                                                )}
                                                <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                                                    item.openNow === true
                                                        ? "text-emerald-700"
                                                        : item.openNow === false
                                                            ? "text-red-700"
                                                            : "text-gray-500"
                                                }`}>
                                                    <span className="w-[5px] h-[5px] rounded-full bg-current opacity-80" />
                                                    {item.openNow === true ? "Open" : item.openNow === false ? "Closed" : "Hrs vary"}
                                                </span>
                                                {item.hasFreeDelivery && (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600">
                                                        <Truck size={10} strokeWidth={2.2} />
                                                        Free
                                                    </span>
                                                )}
                                            </span>
                                        </span>
                                        <ChevronRight size={15} strokeWidth={2.4} className="mt-3 text-gray-300 shrink-0" />
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </aside>
        );
    }

    return (
        <div
            className="absolute top-0 left-0 h-full z-30 flex transition-all duration-300 ease-in-out"
            style={{ width: "380px", maxWidth: "calc(100vw - 48px)" }}
        >
            <div className="w-full h-full bg-white shadow-[4px_0_32px_rgba(6,30,41,0.13)] flex flex-col overflow-hidden">

                {/* ── Hero image ── */}
                <div className="relative flex-shrink-0" style={{ height: "200px" }}>
                    {photoUrl ? (
                        <img
                            src={photoUrl}
                            alt={pharmacy?.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div
                            className="w-full h-full flex items-center justify-center"
                            style={{ background: `linear-gradient(135deg, ${color}18 0%, ${color}30 100%)` }}
                        >
                            <span
                                className="text-[52px] font-black tracking-tight select-none"
                                style={{ color, opacity: 0.35 }}
                            >
                                {pharmacy ? getInitials(pharmacy.name) : ""}
                            </span>
                        </div>
                    )}

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-3.5 left-3.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-white/50 flex items-center justify-center shadow-md cursor-pointer hover:bg-white transition-colors"
                    >
                        <ChevronLeft size={16} strokeWidth={2.5} className="text-[#2d2d2d]" />
                    </button>

                    {/* Free delivery badge */}
                    {pharmacy?.hasFreeDelivery && (
                        <span className="absolute top-3.5 right-3.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-600 text-white shadow-md">
                            <Truck size={11} strokeWidth={2.5} />
                            Free Delivery
                        </span>
                    )}

                    {/* Status badge bottom-left on hero */}
                    {pharmacy && (
                        <span
                            className={`absolute bottom-3.5 left-3.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-sm shadow-sm ${
                                pharmacy.openNow === true
                                    ? "bg-emerald-500/90 text-white"
                                    : pharmacy.openNow === false
                                        ? "bg-red-500/90 text-white"
                                        : "bg-white/80 text-gray-600"
                            }`}
                        >
                            <span className="w-[5px] h-[5px] rounded-full bg-current opacity-90" />
                            {pharmacy.openNow === true ? "Open Now" : pharmacy.openNow === false ? "Closed" : "Hours Vary"}
                        </span>
                    )}
                </div>

                {/* ── Scrollable body ── */}
                <div className="flex-1 overflow-y-auto scrollbar-none">

                    {/* Name + rating block */}
                    <div className="px-5 pt-5 pb-4 border-b border-[#f0f4f3]">
                        <div className="flex items-start gap-3 mb-3">
                            {/* Brand avatar */}
                            <div
                                className="w-11 h-11 rounded-[13px] flex items-center justify-center text-[13px] font-extrabold flex-shrink-0 mt-0.5"
                                style={{ background: color + "18", color }}
                            >
                                {pharmacy ? getInitials(pharmacy.name) : ""}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h2 className="text-[17px] font-black text-[#2d2d2d] leading-snug tracking-[-0.02em] epilogue-header mb-0.5">
                                    {pharmacy?.name}
                                </h2>
                                <p className="flex items-start gap-1 text-[12px] text-gray-400 leading-relaxed">
                                    <MapPin size={11} strokeWidth={2} className="flex-shrink-0 mt-0.5" />
                                    {pharmacy?.address || "See on map"}
                                </p>
                            </div>
                        </div>

                        {/* Rating row */}
                        {pharmacy?.rating && (
                            <div className="flex items-center gap-2 mt-3">
                                <span className="text-[15px] font-black text-[#2d2d2d] tracking-tight">
                                    {pharmacy.rating}
                                </span>
                                <StarRating rating={pharmacy.rating} />
                                <span className="text-[12px] text-gray-400">
                                    ({pharmacy.userRatingsTotal.toLocaleString()}+ reviews)
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Quick action chips */}
                    <div className="px-5 py-4 flex gap-2.5 border-b border-[#f0f4f3]">
                        {[
                            { icon: Phone, label: "Call" },
                            { icon: Globe, label: "Website" },
                            { icon: ExternalLink, label: "Directions" },
                        ].map(({ icon: Icon, label }) => (
                            <button
                                key={label}
                                className="flex-1 flex flex-col items-center gap-1.5 py-2.5 rounded-xl border border-[#E4ECEA] bg-[#f8fafa] cursor-pointer hover:border-[#427b77]/30 hover:bg-[#f0f9f8] transition-all group"
                            >
                                <Icon size={16} strokeWidth={2} className="text-[#427b77] group-hover:scale-110 transition-transform" />
                                <span className="text-[10.5px] font-semibold text-gray-500 epilogue-regular">{label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Info rows */}
                    <div className="px-5 py-4 space-y-3.5 border-b border-[#f0f4f3]">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#f0f4f3] flex items-center justify-center flex-shrink-0">
                                <Clock size={14} strokeWidth={2} className="text-[#427b77]" />
                            </div>
                            <div className="flex-1 min-w-0 pt-1">
                                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Hours</p>
                                <p className={`text-[13px] font-semibold ${
                                    pharmacy?.openNow === true ? "text-emerald-700" :
                                        pharmacy?.openNow === false ? "text-red-600" : "text-gray-500"
                                }`}>
                                    {pharmacy?.openNow === true ? "Open Now" : pharmacy?.openNow === false ? "Closed" : "Hours vary"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#f0f4f3] flex items-center justify-center flex-shrink-0">
                                <MapPin size={14} strokeWidth={2} className="text-[#427b77]" />
                            </div>
                            <div className="flex-1 min-w-0 pt-1">
                                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Address</p>
                                <p className="text-[13px] font-medium text-[#2d2d2d] leading-snug">
                                    {pharmacy?.address || "Not available"}
                                </p>
                            </div>
                        </div>

                        {pharmacy?.hasFreeDelivery && (
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                    <Truck size={14} strokeWidth={2} className="text-blue-600" />
                                </div>
                                <div className="flex-1 min-w-0 pt-1">
                                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Delivery</p>
                                    <p className="text-[13px] font-semibold text-blue-600">Free delivery available</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Tags / types */}
                    {pharmacy?.types && pharmacy.types.length > 0 && (
                        <div className="px-5 py-4 border-b border-[#f0f4f3]">
                            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2.5">Category</p>
                            <div className="flex flex-wrap gap-1.5">
                                {pharmacy.types.slice(0, 5).map((t) => (
                                    <span
                                        key={t}
                                        className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#f0f4f3] text-gray-500 capitalize"
                                    >
                                        {t.replace(/_/g, " ")}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Spacer so CTA doesn't overlap content */}
                    <div className="h-4" />
                </div>

                {/* ── Sticky CTA ── */}
                <div className="flex-shrink-0 px-5 py-4 border-t border-[#f0f4f3] bg-white">
                    <button className="w-full bg-[#2d2d2d] text-white border-none rounded-xl py-3.5 px-4 text-[13px] font-bold cursor-pointer flex items-center justify-center gap-2 hover:bg-[#427b77] transition-colors font-[inherit] tracking-[-0.01em]">
                        Reserve for Pickup
                        <ChevronRight size={15} strokeWidth={2.5} />
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Pharmacy card ─────────────────────────────────────────────────────────────
function PharmacyCard({
                          pharmacy,
                          isSelected,
                          onClick,
                      }: {
    pharmacy: Pharmacy;
    isSelected: boolean;
    onClick: () => void;
}) {
    const color = getBrandColor(pharmacy.name);
    const photoUrl = pharmacy.photos?.[0]?.getUrl({ maxWidth: 400, maxHeight: 225 });

    return (
        <div
            onClick={onClick}
            className={`flex-shrink-0 w-[214px] cursor-pointer scroll-snap-start transition-transform duration-200 ease-out hover:-translate-y-0.5 ${isSelected ? "-translate-y-1" : ""}`}
        >
            <div
                className={`relative w-full h-[122px] rounded-2xl overflow-hidden bg-[#f0f4f3] mb-2.5 ${
                    isSelected ? "ring-2 ring-[#427b77]/30" : ""
                }`}
            >
                {photoUrl ? (
                    <img src={photoUrl} alt={pharmacy.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ background: color + "22" }}>
                        <span className="text-[22px] font-black tracking-tight" style={{ color }}>
                            {getInitials(pharmacy.name)}
                        </span>
                    </div>
                )}
                {pharmacy.hasFreeDelivery && (
                    <span className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600">
                        <Truck size={10} strokeWidth={2.5} /> Free
                    </span>
                )}
            </div>

            <div className="px-0.5">
                <p className="text-[13px] font-bold text-[#2d2d2d] mb-1 truncate">{pharmacy.name}</p>
                <div className="flex items-center gap-1.5 mb-1.5">
                    {pharmacy.rating && (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-700">
                            <Star size={10} fill="currentColor" strokeWidth={0} />
                            {pharmacy.rating}
                            <span className="font-normal text-gray-400 text-[10px]">({pharmacy.userRatingsTotal}+)</span>
                        </span>
                    )}
                    <span className="text-gray-300 text-[10px]">•</span>
                    <span
                        className={`flex items-center gap-1 text-[11px] font-medium ${
                            pharmacy.openNow === true
                                ? "text-emerald-700"
                                : pharmacy.openNow === false
                                    ? "text-red-700"
                                    : "text-gray-500"
                        }`}
                    >
                        <Clock size={9} strokeWidth={2.5} />
                        {pharmacy.openNow === true ? "Open" : pharmacy.openNow === false ? "Closed" : "Hours vary"}
                    </span>
                </div>
                <p className="flex items-center gap-1 text-[10.5px] text-gray-400 truncate">
                    <MapPin size={10} strokeWidth={2} />
                    {pharmacy.address || "See on map"}
                </p>
            </div>
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function PickupPage() {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<google.maps.Map | null>(null);
    const markersRef = useRef<google.maps.Marker[]>([]);
    const cardStripRef = useRef<HTMLDivElement>(null);

    const [searchValue, setSearchValue] = useState<string>("");
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
    const [userLocation] = useState<LatLng>({ lat: 10.3157, lng: 123.8854 });

    const placeMarkers = useCallback((places: Pharmacy[], map: google.maps.Map): void => {
        markersRef.current.forEach((m) => m.setMap(null));
        markersRef.current = [];

        places.forEach((place) => {
            const marker = new window.google.maps.Marker({
                position: { lat: place.lat, lng: place.lng },
                map,
                icon: getMarkerIcon(place),
                title: place.name,
                zIndex: 100,
            });

            marker.addListener("click", () => {
                setSelectedPharmacy(place);
                map.panTo({ lat: place.lat, lng: place.lng });
            });

            markersRef.current.push(marker);
        });
    }, []);

    const buildMap = useCallback(
        (center: LatLng): void => {
            if (!mapRef.current) return;

            const map = new window.google.maps.Map(mapRef.current, {
                center,
                zoom: 15,
                disableDefaultUI: true,
                zoomControl: true,
                zoomControlOptions: { position: window.google.maps.ControlPosition.RIGHT_CENTER },
            });

            mapInstance.current = map;

            const service = new window.google.maps.places.PlacesService(map);
            service.nearbySearch(
                { location: center, radius: 2000, keyword: "pharmacy drugstore" },
                (
                    results: google.maps.places.PlaceResult[] | null,
                    status: google.maps.places.PlacesServiceStatus
                ) => {
                    if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
                        const formatted: Pharmacy[] = results.map((p) => ({
                            id: p.place_id!,
                            name: p.name!,
                            address: p.vicinity!,
                            lat: p.geometry!.location!.lat(),
                            lng: p.geometry!.location!.lng(),
                            rating: p.rating ?? null,
                            userRatingsTotal: p.user_ratings_total ?? 0,
                            openNow: p.opening_hours?.open_now ?? null,
                            hasFreeDelivery: hasFreeDelivery(p.name!),
                            photos: p.photos,
                            types: p.types ?? [],
                        }));
                        setPharmacies(formatted);
                        placeMarkers(formatted, map);
                    }
                    setLoading(false);
                }
            );

            new window.google.maps.Marker({
                position: center,
                map,
                icon: {
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: "#427b77",
                    fillOpacity: 1,
                    strokeColor: "#ffffff",
                    strokeWeight: 3,
                },
                zIndex: 999,
            });
        },
        [placeMarkers]
    );

    const initMap = useCallback((): void => {
        if (!mapRef.current || mapInstance.current) return;

        navigator.geolocation?.getCurrentPosition(
            (pos: GeolocationPosition) => {
                buildMap({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            },
            () => buildMap(userLocation)
        );
    }, [buildMap, userLocation]);

    useEffect(() => {
        if (window.google) {
            initMap();
            return;
        }
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
        script.async = true;
        script.onload = initMap;
        document.head.appendChild(script);
        return () => {
            try { document.head.removeChild(script); } catch { /* already removed */ }
        };
    }, [initMap]);

    const toggleFilter = (f: string) => {
        setActiveFilters((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));
    };

    const filtered = pharmacies.filter((p) => {
        const matchSearch =
            !searchValue ||
            p.name.toLowerCase().includes(searchValue.toLowerCase()) ||
            p.address?.toLowerCase().includes(searchValue.toLowerCase());
        const matchOpen = !activeFilters.includes("Open Now") || p.openNow === true;
        return matchSearch && matchOpen;
    });

    function handleSelectPharmacy(pharmacy: Pharmacy): void {
        setSelectedPharmacy(pharmacy);
        if (mapInstance.current) {
            mapInstance.current.panTo({ lat: pharmacy.lat, lng: pharmacy.lng });
            mapInstance.current.setZoom(17);
        }
        const idx = filtered.findIndex((p) => p.id === pharmacy.id);
        if (cardStripRef.current && idx >= 0) {
            const cards = cardStripRef.current.querySelectorAll<HTMLElement>(".pharmacy-card-item");
            cards[idx]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        }
    }

    const sidebarOffset = "min(380px, calc(100vw - 48px))";

    return (
        <div className="relative w-full overflow-hidden" style={{ height: "calc(100vh - 76px)" }}>

            {/* ── Full-screen map ── */}
            <div ref={mapRef} className="absolute inset-0 w-full h-full" />

            {/* ── Detail Sidebar ── */}
            <PharmacySidebar
                pharmacy={selectedPharmacy}
                pharmacies={filtered}
                loading={loading}
                selectedId={selectedPharmacy?.id ?? null}
                onSelect={handleSelectPharmacy}
                onClose={() => setSelectedPharmacy(null)}
            />

            {/* ── Top overlay: search + filter pills ── */}
            <div
                className="absolute top-5 z-20 flex items-center gap-3 transition-all duration-300 ease-in-out"
                style={{
                    left: `calc(${sidebarOffset} + 16px)`,
                    maxWidth: `calc(100vw - ${sidebarOffset} - 36px)`,
                    overflow: "hidden",
                }}
            >
                {/* Search */}
                <div className="relative flex items-center flex-shrink-0">
                    <Search
                        size={17}
                        strokeWidth={2}
                        className="absolute left-3.5 text-[#427b77] opacity-70 pointer-events-none"
                    />
                    <input
                        type="text"
                        value={searchValue}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)}
                        placeholder="Search pharmacies..."
                        className="w-72 pl-10 pr-10 py-3 rounded-full border border-[#E4ECEA] bg-white text-[13px] text-[#2d2d2d] placeholder-[#2d2d2d]/40 outline-none shadow-[0_4px_18px_rgba(6,30,41,0.10)] focus:border-[#427b77]/50 focus:shadow-[0_4px_24px_rgba(66,123,119,0.20)] transition-all epilogue-regular"
                    />
                    {searchValue && (
                        <button
                            onClick={() => setSearchValue("")}
                            className="absolute right-3 w-5 h-5 rounded-full bg-[#427b77]/10 border-none cursor-pointer flex items-center justify-center text-[#427b77] hover:bg-[#427b77]/20 transition-colors"
                        >
                            <X size={12} strokeWidth={2.5} />
                        </button>
                    )}
                </div>

                {/* Filter pills */}
                <div className="flex gap-2.5 overflow-x-auto scrollbar-none flex-nowrap pb-1">
                    {FILTERS.map((f) => {
                        const Icon = FILTER_ICONS[f];
                        const isActive = activeFilters.includes(f);
                        return (
                            <button
                                key={f}
                                onClick={() => toggleFilter(f)}
                                className={`inline-flex items-center gap-2 px-4 py-3 rounded-full border text-[12.5px] font-semibold cursor-pointer whitespace-nowrap transition-all shadow-[0_2px_10px_rgba(6,30,41,0.08)] epilogue-regular ${
                                    isActive
                                        ? "border-[#2d2d2d] bg-[#2d2d2d] text-white shadow-[0_3px_14px_rgba(45,45,45,0.22)]"
                                        : "border-[#E4ECEA] bg-white text-[#6b7280] hover:border-[#427b77]/40 hover:text-[#427b77] hover:shadow-[0_3px_16px_rgba(66,123,119,0.14)]"
                                }`}
                            >
                                <Icon size={16} strokeWidth={2.2} />
                                {f}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── Bottom card strip ── */}
            <div
                className="absolute bottom-0 right-0 z-20 pb-[18px] bg-gradient-to-t from-white/97 via-white/80 to-transparent pointer-events-none transition-all duration-300 ease-in-out"
                style={{
                    left: sidebarOffset,
                }}
            >
                <div className="pointer-events-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-3">
                        <p className="text-[13px] font-bold text-[#2d2d2d] tracking-[-0.01em] epilogue-header">
                            {loading ? "Finding nearby pharmacies…" : `${filtered.length} pharmacies nearby`}
                        </p>
                        {!loading && (
                            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                                {pharmacies.filter((p) => p.openNow).length} open now
                            </span>
                        )}
                    </div>

                    {/* Card scroll track */}
                    <div
                        ref={cardStripRef}
                        className="flex gap-[22px] overflow-x-auto pb-2.5 px-6 scrollbar-none scroll-snap-x-mandatory"
                        style={{ scrollSnapType: "x mandatory" }}
                    >
                        {loading ? (
                            [...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    className="flex-shrink-0 w-[214px] h-[185px] rounded-2xl bg-gradient-to-r from-[#f0f4f3] via-[#e5ecea] to-[#f0f4f3] bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]"
                                    style={{ animationDelay: `${i * 0.08}s` }}
                                />
                            ))
                        ) : filtered.length === 0 ? (
                            <div className="flex items-center gap-2 px-5 py-4 text-gray-400 text-[13px]">
                                <MapPin size={22} strokeWidth={1.5} />
                                <span>No results found</span>
                            </div>
                        ) : (
                            filtered.map((pharmacy) => (
                                <div key={pharmacy.id} className="pharmacy-card-item" style={{ scrollSnapAlign: "start" }}>
                                    <PharmacyCard
                                        pharmacy={pharmacy}
                                        isSelected={selectedPharmacy?.id === pharmacy.id}
                                        onClick={() => handleSelectPharmacy(pharmacy)}
                                    />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
                .scrollbar-none { scrollbar-width: none; }
                .scrollbar-none::-webkit-scrollbar { display: none; }
            `}</style>
        </div>
    );
}
