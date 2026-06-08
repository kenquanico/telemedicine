import { useCallback, useState, useEffect, useRef } from "react";
import {
    MapPin, Search, Star, X, ChevronRight, Clock,
    Truck, CircleParking, Car, Phone,
    Globe, ExternalLink, ChevronLeft, Locate, ChevronDown, ChevronUp,
    Plus, Minus,
} from "lucide-react";
import { useApp } from "../hooks/useApp";

const API_KEY = "AIzaSyATaHhW1zDWipZm7SgzjAFNS5j0ta3zDmA";

const FILTERS = ["Open Now", "24 Hours", "Has Parking", "Drive-Through", "Near Me"] as const;

const FILTER_META: Record<string, { icon: React.ElementType; color: string; activeColor: string }> = {
    "Open Now":      { icon: Clock,          color: "#059669", activeColor: "#059669" },
    "24 Hours":      { icon: Clock,          color: "#d97706", activeColor: "#d97706" },
    "Has Parking":   { icon: CircleParking,  color: "#2563eb", activeColor: "#2563eb" },
    "Drive-Through": { icon: Car,            color: "#7c3aed", activeColor: "#7c3aed" },
    "Near Me":       { icon: Locate,         color: "#e11d48", activeColor: "#e11d48" },
};

const PHARMACY_COLORS: Record<string, string> = {
    Rose:         "#e11d48",
    Mercury:      "#0f766e",
    Watsons:      "#005baa",
    Generika:     "#16a34a",
    TGP:          "#b45309",
    "St. Luke's": "#6d28d9",
    Default:      "#3d7a75",
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

interface LatLng { lat: number; lng: number }

function getBrandColor(name: string): string {
    for (const key of Object.keys(PHARMACY_COLORS)) {
        if (name.toLowerCase().includes(key.toLowerCase())) return PHARMACY_COLORS[key];
    }
    return PHARMACY_COLORS.Default;
}

function getInitials(name: string): string {
    return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

function hasFreeDelivery(name: string): boolean {
    return DELIVERY_BRANDS.some((b) => name.toLowerCase().includes(b.toLowerCase()));
}

function getPinLabel(pharmacy: Pharmacy): string {
    const status = pharmacy.openNow === true ? "Open" : pharmacy.openNow === false ? "Closed" : "Hrs vary";
    return pharmacy.hasFreeDelivery ? `${status} · Free delivery` : status;
}

function getStatusColor(pharmacy: Pharmacy): string {
    if (pharmacy.openNow === true)  return "#059669";
    if (pharmacy.openNow === false) return "#dc2626";
    return "#9ca3af";
}

const TRUCK_PATH =
    "M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z";

function getMarkerIcon(pharmacy: Pharmacy): google.maps.Icon {
    const pinColor    = getBrandColor(pharmacy.name);
    const statusColor = getStatusColor(pharmacy);
    const label       = getPinLabel(pharmacy);
    const labelWidth  = Math.max(88, Math.min(200, label.length * 6.8 + 40));
    const x           = labelWidth / 2;

    const escapedLabel = label
        .replace(/&/g, "&amp;").replace(/</g, "&lt;")
        .replace(/>/g, "&gt;").replace(/"/g, "&quot;");

    let iconPath: string;
    let iconScale    = 0.56;
    const iconOffsetX = 11;

    if (pharmacy.hasFreeDelivery) {
        iconPath  = TRUCK_PATH;
        iconScale = 0.5;
    } else if (pharmacy.openNow === true) {
        iconPath = "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z";
    } else if (pharmacy.openNow === false) {
        iconPath = "M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z";
    } else {
        iconPath = "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z";
    }

    const iconSize = 12;
    const iconSvg  = `<g transform="translate(${iconOffsetX}, ${(32 - iconSize) / 2 + 2}) scale(${iconScale})">
        <path d="${iconPath}" fill="${statusColor}"/>
    </g>`;

    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${labelWidth}" height="76" viewBox="0 0 ${labelWidth} 76">
            <defs>
                <filter id="s" x="-20%" y="-20%" width="140%" height="160%">
                    <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="#0a1f1e" flood-opacity="0.11"/>
                </filter>
            </defs>
            <g filter="url(#s)">
                <rect x="3" y="2" width="${labelWidth - 6}" height="32" rx="12" fill="white" stroke="#e2ecea" stroke-width="1"/>
                <path d="M${x - 6} 33L${x} 42L${x + 6} 33Z" fill="white" stroke="#e2ecea" stroke-width="1" stroke-linejoin="round"/>
            </g>
            ${iconSvg}
            <text x="${iconOffsetX + iconSize + 7}" y="22" text-anchor="start" font-family="Neue Montreal, sans-serif" font-size="10" font-weight="600" fill="#262626">${escapedLabel}</text>
            <path d="M${x} 45C${x - 7} 45 ${x - 12.5} 51 ${x - 12.5} 58c0 9 12.5 17 12.5 17s12.5-8 12.5-17C${x + 12.5} 51 ${x + 7} 45 ${x} 45z" fill="${pinColor}" fill-opacity="0.82" stroke="white" stroke-width="1.75"/>
            <circle cx="${x}" cy="58" r="4" fill="white" fill-opacity="0.9"/>
            <circle cx="${x}" cy="58" r="2.1" fill="${pinColor}" fill-opacity="0.82"/>
        </svg>
    `;

    return {
        url:    `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
        anchor: new window.google.maps.Point(x, 75),
    };
}

// ── Star rating ───────────────────────────────────────────────────────────────
function StarRating({ rating, size = 11 }: { rating: number; size?: number }) {
    return (
        <div className="flex items-center gap-[2px]">
            {[1, 2, 3, 4, 5].map((i) => {
                const filled = rating >= i;
                const half   = !filled && rating >= i - 0.5;
                return (
                    <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill="none">
                        {half ? (
                            <>
                                <defs>
                                    <linearGradient id={`h${i}`}>
                                        <stop offset="50%" stopColor="#f59e0b" />
                                        <stop offset="50%" stopColor="#e5e7eb" />
                                    </linearGradient>
                                </defs>
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill={`url(#h${i})`} />
                            </>
                        ) : (
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill={filled ? "#f59e0b" : "#e5e7eb"} />
                        )}
                    </svg>
                );
            })}
        </div>
    );
}

// ── Status indicator ──────────────────────────────────────────────────────────
function StatusPill({ openNow }: { openNow: boolean | null }) {
    const cfg = openNow === true
        ? { dot: "#059669", text: "text-emerald-700", bg: "bg-emerald-50", label: "Open now" }
        : openNow === false
            ? { dot: "#dc2626", text: "text-red-600",     bg: "bg-red-50",     label: "Closed" }
            : { dot: "#9ca3af", text: "text-[#262626]/70",    bg: "bg-gray-100",   label: "Hours vary" };

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10.5px] font-medium epilogue-regular ${cfg.bg} ${cfg.text}`}
            style={{ lineHeight: 1 }}
        >
            <span className="w-[5px] h-[5px] rounded-full flex-shrink-0" style={{ background: cfg.dot }} />
            {cfg.label}
        </span>
    );
}

// ── Custom Map Controls ───────────────────────────────────────────────────────
function MapControls({
                         onZoomIn,
                         onZoomOut,
                         onLocate,
                         locating,
                     }: {
    onZoomIn: () => void;
    onZoomOut: () => void;
    onLocate: () => void;
    locating: boolean;
}) {
    return (
        <div className="absolute right-4 z-20 flex flex-col gap-2.5" style={{ top: "50%", transform: "translateY(-50%)" }}>
            {/* Zoom group */}
            <div className="flex flex-col rounded-full shadow-[0_2px_14px_rgba(10,31,30,0.10)] overflow-hidden border border-white/70 bg-white/45 backdrop-blur-md">
                <button
                    onClick={onZoomIn}
                    className="w-10 h-10 bg-white/55 flex items-center justify-center cursor-pointer hover:bg-white/80 active:bg-white/90 transition-colors border-b border-white/70"
                    aria-label="Zoom in"
                >
                    <Plus size={20} strokeWidth={1.6} className="text-[#262626]" />
                </button>
                <button
                    onClick={onZoomOut}
                    className="w-10 h-10 bg-white/55 flex items-center justify-center cursor-pointer hover:bg-white/80 active:bg-white/90 transition-colors"
                    aria-label="Zoom out"
                >
                    <Minus size={20} strokeWidth={1.6} className="text-[#262626]" />
                </button>
            </div>

            {/* Locate button — separated */}
            <button
                onClick={onLocate}
                className={`w-10 h-10 rounded-full border flex items-center justify-center cursor-pointer shadow-[0_2px_14px_rgba(10,31,30,0.10)] backdrop-blur-md transition-all ${
                    locating
                        ? "bg-[#3d7a75]/78 border-[#3d7a75]/70"
                        : "bg-white/65 border-white/70 hover:bg-white/85 active:bg-white/95"
                }`}
                aria-label="My location"
            >
                <Locate
                    size={15}
                    strokeWidth={1.6}
                    className={`transition-colors ${locating ? "text-white" : "text-[#262626]"}`}
                />
            </button>
        </div>
    );
}

// ── Detail Sidebar ────────────────────────────────────────────────────────────
function PharmacySidebar({ pharmacy, onClose }: { pharmacy: Pharmacy | null; onClose: () => void }) {
    const color    = pharmacy ? getBrandColor(pharmacy.name) : "#3d7a75";
    const photoUrl = pharmacy?.photos?.[0]?.getUrl({ maxWidth: 800, maxHeight: 400 });

    return (
        <div
            className={`absolute top-0 left-0 h-full z-30 flex transition-all duration-300 ease-in-out ${pharmacy ? "translate-x-0" : "-translate-x-full"}`}
            style={{ width: "372px", maxWidth: "calc(100vw - 48px)" }}
        >
            <div className="w-full h-full bg-white shadow-[6px_0_40px_rgba(10,31,30,0.10)] flex flex-col overflow-hidden">

                {/* Hero */}
                <div className="relative flex-shrink-0" style={{ height: "196px" }}>
                    {photoUrl ? (
                        <img src={photoUrl} alt={pharmacy?.name} className="w-full h-full object-cover" />
                    ) : (
                        <div
                            className="w-full h-full flex items-center justify-center"
                            style={{ background: `linear-gradient(140deg, ${color}14 0%, ${color}28 100%)` }}
                        >
                            <span className="text-[56px] font-black tracking-tight select-none epilogue-header" style={{ color, opacity: 0.22 }}>
                                {pharmacy ? getInitials(pharmacy.name) : ""}
                            </span>
                        </div>
                    )}
                    <button
                        onClick={onClose}
                        className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/88 backdrop-blur-sm flex items-center justify-center shadow-sm cursor-pointer hover:bg-white transition-colors border border-black/5"
                    >
                        <X size={20} strokeWidth={1.6} className="text-[#262626]" />
                    </button>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto scrollbar-none">

                    {/* Name block */}
                    <div className="px-5 pt-5 pb-4 border-b border-[#f2f5f4]">
                        <div className="flex items-start gap-3 mb-3">
                            <div
                                className="w-10 h-10 rounded-[11px] flex items-center justify-center text-[12px] font-bold flex-shrink-0 mt-0.5"
                                style={{ background: color + "14", color }}
                            >
                                {pharmacy ? getInitials(pharmacy.name) : ""}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h2 className="text-[16px] font-extrabold text-[#262626] leading-snug tracking-[-0.025em] mb-0.5 epilogue-header">
                                    {pharmacy?.name}
                                </h2>
                                <p className="flex items-start gap-1 text-[11.5px] text-[#262626]/60 leading-relaxed epilogue-regular">
                                    <MapPin size={14} strokeWidth={1.6} className="flex-shrink-0 mt-0.5 text-[#262626]/60" />
                                    {pharmacy?.address || "See on map"}
                                </p>
                            </div>
                        </div>

                        {pharmacy?.rating && (
                            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#f2f5f4]">
                                <span className="text-[14px] font-bold text-[#262626] tracking-tight epilogue-header">{pharmacy.rating}</span>
                                <StarRating rating={pharmacy.rating} />
                                <span className="text-[11px] text-[#262626]/60 epilogue-regular">
                                    {pharmacy.userRatingsTotal.toLocaleString()}+ reviews
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Quick actions */}
                    <div className="px-5 py-4 flex gap-2 border-b border-[#f2f5f4]">
                        {[
                            { icon: Phone,       label: "Call",       color: "#059669" },
                            { icon: Globe,       label: "Website",    color: "#2563eb" },
                            { icon: ExternalLink,label: "Directions", color: "#7c3aed" },
                        ].map(({ icon: Icon, label, color: ic }) => (
                            <button
                                key={label}
                                className="flex-1 flex flex-col items-center gap-1.5 py-2.5 rounded-xl border border-[#edf0ef] bg-[#fafbfb] cursor-pointer hover:border-[#d4e4e2] hover:bg-[#f3f8f7] transition-all"
                            >
                                <Icon size={15} strokeWidth={1.75} style={{ color: ic }} />
                                <span className="text-[10px] font-medium text-[#262626]/70 epilogue-regular">{label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Info rows */}
                    <div className="px-5 py-4 space-y-4 border-b border-[#f2f5f4]">
                        <div className="flex items-start gap-3">
                            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Clock size={13} strokeWidth={1.75} className="text-emerald-600" />
                            </div>
                            <div className="pt-0.5">
                                <p className="text-[10px] font-semibold text-[#262626]/60 uppercase tracking-widest mb-0.5 epilogue-subheader">Hours</p>
                                <p className={`text-[12.5px] font-semibold ${
                                    pharmacy?.openNow === true ? "text-emerald-700" :
                                        pharmacy?.openNow === false ? "text-red-600" : "text-[#262626]/70"
                                } epilogue-subheader`}>
                                    {pharmacy?.openNow === true ? "Open now" : pharmacy?.openNow === false ? "Closed" : "Hours vary"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <MapPin size={13} strokeWidth={1.75} className="text-violet-500" />
                            </div>
                            <div className="pt-0.5">
                                <p className="text-[10px] font-semibold text-[#262626]/60 uppercase tracking-widest mb-0.5 epilogue-subheader">Address</p>
                                <p className="text-[12.5px] font-medium text-[#262626] leading-snug epilogue-regular">
                                    {pharmacy?.address || "Not available"}
                                </p>
                            </div>
                        </div>

                        {pharmacy?.hasFreeDelivery && (
                            <div className="flex items-start gap-3">
                                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Truck size={13} strokeWidth={1.75} className="text-blue-500" />
                                </div>
                                <div className="pt-0.5">
                                    <p className="text-[10px] font-semibold text-[#262626]/60 uppercase tracking-widest mb-0.5 epilogue-subheader">Delivery</p>
                                    <p className="text-[12.5px] font-semibold text-blue-600 epilogue-subheader">Free delivery available</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {pharmacy?.types && pharmacy.types.length > 0 && (
                        <div className="px-5 py-4 border-b border-[#f2f5f4]">
                            <p className="text-[10px] font-semibold text-[#262626]/60 uppercase tracking-widest mb-2.5 epilogue-subheader">Category</p>
                            <div className="flex flex-wrap gap-1.5">
                                {pharmacy.types.slice(0, 5).map((t) => (
                                    <span key={t} className="px-2.5 py-[3px] rounded-full text-[10.5px] font-medium bg-[#f2f5f4] text-[#262626]/70 capitalize epilogue-regular">
                                        {t.replace(/_/g, " ")}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="h-4" />
                </div>

                {/* CTA */}
                <div className="flex-shrink-0 px-5 py-4 border-t border-[#f2f5f4] bg-white">
                    <button
                        className="w-full rounded-xl py-3 px-4 text-[13px] font-bold cursor-pointer flex items-center justify-center gap-2 transition-all tracking-[-0.01em] epilogue-header"
                        style={{
                            background: color,
                            color: "white",
                            boxShadow: `0 4px 16px ${color}38`,
                        }}
                    >
                        Reserve for Pickup
                        <ChevronRight size={22} strokeWidth={1.6} className="text-white" />
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Pharmacy Card ─────────────────────────────────────────────────────────────
function PharmacyCard({ pharmacy, isSelected, onClick }: {
    pharmacy: Pharmacy;
    isSelected: boolean;
    onClick: () => void;
}) {
    const color    = getBrandColor(pharmacy.name);
    const photoUrl = pharmacy.photos?.[0]?.getUrl({ maxWidth: 400, maxHeight: 225 });

    return (
        <div
            onClick={onClick}
            className={`flex-shrink-0 w-[228px] cursor-pointer transition-transform duration-200 ease-out hover:-translate-y-0.5 ${isSelected ? "-translate-y-1" : ""}`}
            style={{ scrollSnapAlign: "start" }}
        >
            {/* Thumbnail */}
            <div
                className="relative w-full rounded-2xl overflow-hidden bg-[#f0f5f4] mb-3"
                style={{ height: "130px" }}
            >
                {photoUrl ? (
                    <img src={photoUrl} alt={pharmacy.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ background: color + "1c" }}>
                        <span className="text-[22px] font-black tracking-tight epilogue-header" style={{ color, opacity: 0.7 }}>
                            {getInitials(pharmacy.name)}
                        </span>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="px-0.5">
                <p className="text-[13px] font-bold text-[#262626] mb-1.5 truncate epilogue-header">
                    {pharmacy.name}
                </p>
                <div className="flex items-center gap-1.5 mb-2">
                    {pharmacy.rating && (
                        <span className="flex items-center gap-[3px] text-[11px] font-semibold text-amber-600 epilogue-subheader">
                            <Star size={10} fill="currentColor" strokeWidth={0} className="text-amber-500" />
                            {pharmacy.rating}
                            <span className="font-normal text-[#262626]/60 text-[10.5px]">({pharmacy.userRatingsTotal}+)</span>
                        </span>
                    )}
                    <span className="text-[#262626]/20 text-[10px]">·</span>
                    <StatusPill openNow={pharmacy.openNow} />
                </div>
                <p className="flex items-center gap-1 text-[10.5px] text-[#262626]/60 truncate epilogue-regular">
                    <MapPin size={9} strokeWidth={1.75} className="text-[#262626]/40 flex-shrink-0" />
                    {pharmacy.address || "See on map"}
                </p>
            </div>
        </div>
    );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function PickupPage() {
    const { navigateBack } = useApp();
    const mapRef       = useRef<HTMLDivElement>(null);
    const mapInstance  = useRef<google.maps.Map | null>(null);
    const markersRef   = useRef<google.maps.Marker[]>([]);
    const cardStripRef = useRef<HTMLDivElement>(null);
    const userLocRef   = useRef<LatLng>({ lat: 10.3157, lng: 123.8854 });

    const [searchValue,      setSearchValue]      = useState<string>("");
    const [activeFilters,    setActiveFilters]    = useState<string[]>([]);
    const [pharmacies,       setPharmacies]       = useState<Pharmacy[]>([]);
    const [loading,          setLoading]          = useState<boolean>(true);
    const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
    const [panelVisible,     setPanelVisible]     = useState<boolean>(true);
    const [locating,         setLocating]         = useState<boolean>(false);

    const placeMarkers = useCallback((places: Pharmacy[], map: google.maps.Map): void => {
        markersRef.current.forEach((m) => m.setMap(null));
        markersRef.current = [];
        places.forEach((place) => {
            const marker = new window.google.maps.Marker({
                position: { lat: place.lat, lng: place.lng },
                map,
                icon:   getMarkerIcon(place),
                title:  place.name,
                zIndex: 100,
            });
            marker.addListener("click", () => {
                setSelectedPharmacy(place);
                map.panTo({ lat: place.lat, lng: place.lng });
            });
            markersRef.current.push(marker);
        });
    }, []);

    const buildMap = useCallback((center: LatLng): void => {
        if (!mapRef.current) return;
        userLocRef.current = center;
        const map = new window.google.maps.Map(mapRef.current, {
            center,
            zoom: 15,
            disableDefaultUI: true,
        });
        mapInstance.current = map;

        const service = new window.google.maps.places.PlacesService(map);
        service.nearbySearch(
            { location: center, radius: 2000, keyword: "pharmacy drugstore" },
            (results: google.maps.places.PlaceResult[] | null, status: google.maps.places.PlacesServiceStatus) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
                    const formatted: Pharmacy[] = results.map((p) => ({
                        id:               p.place_id!,
                        name:             p.name!,
                        address:          p.vicinity!,
                        lat:              p.geometry!.location!.lat(),
                        lng:              p.geometry!.location!.lng(),
                        rating:           p.rating ?? null,
                        userRatingsTotal: p.user_ratings_total ?? 0,
                        openNow:          p.opening_hours?.open_now ?? null,
                        hasFreeDelivery:  hasFreeDelivery(p.name!),
                        photos:           p.photos,
                        types:            p.types ?? [],
                    }));
                    setPharmacies(formatted);
                    placeMarkers(formatted, map);
                }
                setLoading(false);
            }
        );

        new window.google.maps.Marker({
            position: center, map,
            icon: {
                path:         window.google.maps.SymbolPath.CIRCLE,
                scale:        9,
                fillColor:    "#3d7a75",
                fillOpacity:  1,
                strokeColor:  "#ffffff",
                strokeWeight: 2.5,
            },
            zIndex: 999,
        });
    }, [placeMarkers]);

    const initMap = useCallback((): void => {
        if (!mapRef.current || mapInstance.current) return;
        navigator.geolocation?.getCurrentPosition(
            (pos: GeolocationPosition) => buildMap({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            () => buildMap(userLocRef.current)
        );
    }, [buildMap]);

    useEffect(() => {
        if (window.google) { initMap(); return; }
        const script    = document.createElement("script");
        script.src      = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
        script.async    = true;
        script.onload   = initMap;
        document.head.appendChild(script);
        return () => { try { document.head.removeChild(script); } catch { /**/ } };
    }, [initMap]);

    const handleZoomIn = useCallback(() => {
        if (!mapInstance.current) return;
        mapInstance.current.setZoom((mapInstance.current.getZoom() ?? 15) + 1);
    }, []);

    const handleZoomOut = useCallback(() => {
        if (!mapInstance.current) return;
        mapInstance.current.setZoom((mapInstance.current.getZoom() ?? 15) - 1);
    }, []);

    const handleLocate = useCallback(() => {
        if (!mapInstance.current || locating) return;
        setLocating(true);
        navigator.geolocation?.getCurrentPosition(
            (pos) => {
                const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                mapInstance.current!.panTo(loc);
                mapInstance.current!.setZoom(16);
                setLocating(false);
            },
            () => setLocating(false)
        );
    }, [locating]);

    const toggleFilter = (f: string) =>
        setActiveFilters((prev) => prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]);

    const filtered = pharmacies.filter((p) => {
        const matchSearch = !searchValue ||
            p.name.toLowerCase().includes(searchValue.toLowerCase()) ||
            p.address?.toLowerCase().includes(searchValue.toLowerCase());
        const matchOpen = !activeFilters.includes("Open Now") || p.openNow === true;
        return matchSearch && matchOpen;
    });

    function handleSelectPharmacy(pharmacy: Pharmacy): void {
        setSelectedPharmacy(pharmacy);
        if (!panelVisible) setPanelVisible(true);
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

    const sidebarOpen = !!selectedPharmacy;

    return (
        <div className="relative w-full h-screen overflow-hidden epilogue-regular">

            {/* Map */}
            <div ref={mapRef} className="absolute inset-0 w-full h-full" />

            {/* Sidebar */}
            <PharmacySidebar pharmacy={selectedPharmacy} onClose={() => setSelectedPharmacy(null)} />

            {/* Custom Map Controls */}
            <MapControls
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onLocate={handleLocate}
                locating={locating}
            />

            {/* ── Top bar: search + filters ── */}
            <div
                className="absolute top-5 z-20 flex items-center gap-2.5 transition-all duration-300 ease-in-out"
                style={{
                    left: sidebarOpen ? "calc(min(372px, calc(100vw - 48px)) + 16px)" : "20px",
                    maxWidth: sidebarOpen
                        ? "calc(100vw - min(372px, calc(100vw - 48px)) - 36px)"
                        : "calc(100vw - 40px)",
                    overflow: "hidden",
                }}
            >
                <button
                    onClick={navigateBack}
                    aria-label="Go back"
                    className="w-11 h-11 rounded-full border border-white/70 bg-white/65 backdrop-blur-md shadow-[0_2px_14px_rgba(10,31,30,0.10)] flex items-center justify-center cursor-pointer hover:bg-white/85 active:bg-white/95 transition-all shrink-0"
                >
                    <ChevronLeft size={22} strokeWidth={1.6} className="text-[#262626]" />
                </button>

                {/* Search bar */}
                <div className="relative inline-flex items-center">
                    <Search
                        size={20}
                        strokeWidth={1.6}
                        className="absolute left-3.5 pointer-events-none z-10 text-[#262626]"
                        style={{ opacity: 0.7, display: "block" }}
                    />
                    <input
                        type="text"
                        value={searchValue}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)}
                        placeholder="Search pharmacies…"
                        autoComplete="off"
                        className="w-[280px] pl-[38px] pr-9 py-[11px] rounded-full border border-white/70 bg-white/65 backdrop-blur-md shadow-[0_2px_14px_rgba(10,31,30,0.08)] text-sm text-[#262626] placeholder-[#262626]/30 outline-none focus:border-white/90 focus:bg-white/85 transition-all duration-200 epilogue-thin"
                    />
                    {searchValue && (
                        <button
                            onClick={() => setSearchValue("")}
                            aria-label="Clear search"
                            className="absolute right-[10px] w-5 h-5 rounded-full border border-white/60 bg-white/55 backdrop-blur-md cursor-pointer flex items-center justify-center transition-colors duration-150 hover:bg-white/80"
                            style={{ color: "#262626" }}
                        >
                            <X size={14} strokeWidth={1.6} style={{ display: "block" }} />
                        </button>
                    )}
                </div>

                {!sidebarOpen && (
                    <div className="flex gap-2 overflow-x-auto scrollbar-none flex-nowrap">
                        {FILTERS.map((f) => {
                            const { icon: Icon, color: ic } = FILTER_META[f];
                            const isActive = activeFilters.includes(f);
                            return (
                                <button
                                    key={f}
                                    onClick={() => toggleFilter(f)}
                                    className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border text-xs cursor-pointer epilogue-regular backdrop-blur-md shadow-[0_2px_14px_rgba(10,31,30,0.08)] transition-all ${
                                        isActive
                                            ? "border-[#1a1a1a]/70 bg-[#1a1a1a]/78"
                                            : "border-white/70 bg-white/65 text-[#262626] hover:border-white/90 hover:bg-white/85"
                                    }`}
                                    style={{ lineHeight: 1 }}
                                >
                                    <Icon
                                        size={14}
                                        strokeWidth={1.6}
                                        className="shrink-0"
                                        style={{ color: isActive ? "rgba(255,255,255,0.85)" : ic }}
                                    />
                                    <span
                                        className="leading-none"
                                        style={{ color: isActive ? "rgba(255,255,255,0.85)" : undefined }}
                                    >
                                        {f}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ── Bottom card strip ── */}
            <div
                className="absolute bottom-0 right-0 z-20 pointer-events-none transition-all duration-300 ease-in-out"
                style={{
                    left: sidebarOpen ? "min(372px, calc(100vw - 48px))" : "0",
                }}
            >
                <div
                    className="transition-opacity duration-300"
                    style={{
                        background: "linear-gradient(to top, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.85) 60%, transparent 100%)",
                        paddingBottom: panelVisible ? "20px" : "0",
                    }}
                >
                    <div className="pointer-events-auto">

                        <div className="flex justify-center px-6 pb-2">
                            <button
                                onClick={() => setPanelVisible((v) => !v)}
                                className="w-10 h-10 rounded-full bg-white border border-[#e8edec] backdrop-blur-md shadow-[0_2px_14px_rgba(10,31,30,0.10)] flex items-center justify-center cursor-pointer hover:bg-[#f6faf9] hover:border-[#d0e4e2] transition-all"
                                aria-label={panelVisible ? "Hide pharmacy list" : "Show pharmacy list"}
                            >
                                {panelVisible ? (
                                    <ChevronDown size={22} strokeWidth={1.6} className="text-[#262626]" />
                                ) : (
                                    <ChevronUp size={22} strokeWidth={1.6} className="text-[#262626]" />
                                )}
                            </button>
                        </div>

                        {/* Cards — slide in/out */}
                        <div
                            className="overflow-hidden transition-all duration-300 ease-in-out"
                            style={{
                                maxHeight: panelVisible ? "260px" : "0px",
                                opacity:   panelVisible ? 1 : 0,
                            }}
                        >
                            <div
                                ref={cardStripRef}
                                className="flex gap-5 overflow-x-auto pb-2 px-6 scrollbar-none"
                                style={{ scrollSnapType: "x mandatory" }}
                            >
                                {loading ? (
                                    [...Array(5)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="flex-shrink-0 w-[228px] rounded-2xl bg-gradient-to-r from-[#f0f5f4] via-[#e5eeec] to-[#f0f5f4] bg-[length:200%_100%] animate-[shimmer_1.4s_ease-in-out_infinite]"
                                            style={{ height: "196px", animationDelay: `${i * 0.08}s` }}
                                        />
                                    ))
                                ) : filtered.length === 0 ? (
                                    <div className="flex items-center gap-2 py-4 text-[#262626]/60 text-[12px] epilogue-regular">
                                        <MapPin size={20} strokeWidth={1.6} className="text-[#262626]" />
                                        <span>No results found</span>
                                    </div>
                                ) : (
                                    filtered.map((pharmacy) => (
                                        <div key={pharmacy.id} className="pharmacy-card-item flex-shrink-0">
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
                </div>
            </div>

            <style>{`
                @keyframes shimmer {
                    0%   { background-position:  200% 0; }
                    100% { background-position: -200% 0; }
                }
                .scrollbar-none { scrollbar-width: none; }
                .scrollbar-none::-webkit-scrollbar { display: none; }
            `}</style>
        </div>
    );
}