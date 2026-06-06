import { useCallback, useState, useEffect, useRef } from "react";
import { MapPin, Search, Star, X, ChevronRight, Clock, Truck, CircleParking, Car, Navigation } from "lucide-react";

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

// Truck icon path for "free delivery" markers
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
            {/* Image */}
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

            {/* Info */}
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
    }, [setSelectedPharmacy]);

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
            try {
                document.head.removeChild(script);
            } catch { /* already removed */ }
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

    return (
        <div className="relative w-full overflow-hidden" style={{ height: "calc(100vh - 76px)" }}>
            {/* ── Full-screen map ── */}
            <div ref={mapRef} className="absolute inset-0 w-full h-full" />

            {/* ── Top overlay: search + filter pills in one row ── */}
            <div className="absolute top-5 left-5 z-20 flex items-center gap-3 max-w-[calc(100vw-40px)]">
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

                {/* Filter pills — same row, scrollable */}
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
            <div className="absolute bottom-0 left-0 right-0 z-20 pb-[18px] bg-gradient-to-t from-white/97 via-white/80 to-transparent pointer-events-none">
                <div className="pointer-events-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between px-16 py-3 max-md:px-4">
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
                        className="flex gap-[22px] overflow-x-auto pb-2.5 px-16 scrollbar-none scroll-snap-x-mandatory max-md:px-4 max-md:gap-4"
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

            {/* ── Selected pharmacy detail popup ── */}
            {selectedPharmacy && (
                <div
                    className="absolute bottom-[230px] left-1/2 -translate-x-1/2 w-80 bg-white rounded-[20px] p-[18px] shadow-[0_20px_60px_rgba(6,30,41,0.18)] z-[25] max-md:w-72 max-md:bottom-52"
                    style={{ animation: "popUp 0.22s cubic-bezier(0.34,1.56,0.64,1)" }}
                >
                    <button
                        onClick={() => setSelectedPharmacy(null)}
                        className="absolute top-3 right-3 w-[26px] h-[26px] rounded-full bg-gray-100 border-none cursor-pointer flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                    >
                        <X size={12} strokeWidth={2.5} />
                    </button>

                    <div className="flex gap-3 items-start mb-3.5">
                        <div
                            className="w-[46px] h-[46px] rounded-[13px] flex items-center justify-center text-[13px] font-extrabold flex-shrink-0"
                            style={{
                                background: getBrandColor(selectedPharmacy.name) + "1a",
                                color: getBrandColor(selectedPharmacy.name),
                            }}
                        >
                            {getInitials(selectedPharmacy.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[14px] font-bold text-[#2d2d2d] mb-0.5 leading-snug">
                                {selectedPharmacy.name}
                            </p>
                            <p className="text-[11.5px] text-gray-400 flex items-center gap-1 mb-1.5">
                                <MapPin size={10} strokeWidth={2} />
                                {selectedPharmacy.address || "See on map"}
                            </p>
                            <div className="flex gap-1.5 flex-wrap">
                                {selectedPharmacy.rating && (
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-amber-50 text-amber-700">
                                        <Star size={9} fill="currentColor" strokeWidth={0} />
                                        {selectedPharmacy.rating}
                                    </span>
                                )}
                                <span
                                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10.5px] font-semibold ${
                                        selectedPharmacy.openNow === true
                                            ? "bg-emerald-50 text-emerald-700"
                                            : selectedPharmacy.openNow === false
                                                ? "bg-red-50 text-red-700"
                                                : "bg-gray-100 text-gray-500"
                                    }`}
                                >
                                    <span className="w-[5px] h-[5px] rounded-full bg-current opacity-85" />
                                    {selectedPharmacy.openNow === true
                                        ? "Open"
                                        : selectedPharmacy.openNow === false
                                            ? "Closed"
                                            : "Hours vary"}
                                </span>
                                {selectedPharmacy.hasFreeDelivery && (
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-blue-50 text-blue-600">
                                        Free delivery
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <button className="w-full bg-[#2d2d2d] text-white border-none rounded-xl py-3 px-4 text-[12.5px] font-semibold cursor-pointer flex items-center justify-center gap-1.5 hover:bg-[#427b77] transition-colors font-[inherit]">
                        Reserve for Pickup
                        <ChevronRight size={13} strokeWidth={2.5} />
                    </button>
                </div>
            )}

            <style>{`
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
                @keyframes popUp {
                    from { opacity: 0; transform: translateX(-50%) translateY(12px); }
                    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
                }
                .scrollbar-none { scrollbar-width: none; }
                .scrollbar-none::-webkit-scrollbar { display: none; }
            `}</style>
        </div>
    );
}
