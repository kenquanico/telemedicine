import { useState, useEffect, useRef, useCallback } from "react";
import { MapPin, X, Search, Navigation, CheckCircle2, ChevronRight, Loader2 } from "lucide-react";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// ── Types ─────────────────────────────────────────────────────────────────────
export interface Location {
    id: string;
    name: string;
    address: string;
    distance: string;
    lat: number;
    lng: number;
    type: "current" | "saved" | "nearby";
    barangay?: string;
    city?: string;
}

interface LocationPickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (location: Location) => void;
    initialSelectedLocation?: Location | null;
    currentBreadcrumb?: {
        region: string;
        city: string;
        barangay: string;
        place: string;
    };
}

// ── Preset Cebu locations ─────────────────────────────────────────────────────
const PRESET_LOCATIONS: Location[] = [
    { id: "1", name: "Colon Street",        address: "Colon St, Cebu City, 6000 Cebu",              distance: "0.3 km", lat: 10.2934, lng: 123.9017, type: "saved",  barangay: "Brgy. Parian",       city: "Cebu City" },
    { id: "2", name: "Ayala Center Cebu",   address: "Cardinal Rosales Ave, Cebu City, 6000",        distance: "1.2 km", lat: 10.3187, lng: 123.9054, type: "nearby", barangay: "Brgy. Cebu Business Park", city: "Cebu City" },
    { id: "3", name: "SM City Cebu",        address: "North Reclamation Area, Cebu City, 6000",      distance: "2.4 km", lat: 10.3116, lng: 123.9186, type: "nearby", barangay: "Brgy. North Reclamation", city: "Cebu City" },
    { id: "4", name: "IT Park",             address: "Lahug, Cebu City, 6000 Cebu",                  distance: "3.1 km", lat: 10.3310, lng: 123.9053, type: "nearby", barangay: "Brgy. Apas",         city: "Cebu City" },
    { id: "5", name: "Mandaue City Hall",   address: "Mandaue City, 6014 Cebu",                      distance: "5.8 km", lat: 10.3236, lng: 123.9520, type: "nearby", barangay: "Brgy. Centro",        city: "Mandaue City" },
    { id: "6", name: "Mactan Island",       address: "Lapu-Lapu City, 6015 Cebu",                    distance: "9.2 km", lat: 10.3078, lng: 124.0020, type: "nearby", barangay: "Brgy. Mactan",        city: "Lapu-Lapu City" },
];

function formatCoordinates(lat: number, lng: number) {
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
}

function getAddressComponent(result: google.maps.GeocoderResult, types: string[]) {
    return result.address_components.find((component) =>
        types.every((type) => component.types.includes(type))
    )?.long_name;
}

function getCurrentLocationDetails(lat: number, lng: number): Promise<Pick<Location, "name" | "address" | "barangay" | "city">> {
    const fallback = formatCoordinates(lat, lng);

    if (!window.google?.maps.Geocoder) {
        return Promise.resolve({
            name: fallback,
            address: fallback,
            barangay: "Current Position",
            city: undefined,
        });
    }

    return new Promise((resolve) => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            const result = status === google.maps.GeocoderStatus.OK ? results?.[0] : null;
            if (!result) {
                resolve({
                    name: fallback,
                    address: fallback,
                    barangay: "Current Position",
                    city: undefined,
                });
                return;
            }

            const city =
                getAddressComponent(result, ["locality"]) ??
                getAddressComponent(result, ["administrative_area_level_2"]);
            const barangay =
                getAddressComponent(result, ["sublocality_level_1"]) ??
                getAddressComponent(result, ["sublocality"]) ??
                getAddressComponent(result, ["neighborhood"]);
            const streetNumber = getAddressComponent(result, ["street_number"]);
            const route = getAddressComponent(result, ["route"]);
            const streetAddress = [streetNumber, route].filter(Boolean).join(" ");

            resolve({
                name: streetAddress || barangay || result.formatted_address || fallback,
                address: result.formatted_address || fallback,
                barangay,
                city,
            });
        });
    });
}

// ── Google Maps Loader ────────────────────────────────────────────────────────
function useGoogleMaps() {
    const [loaded, setLoaded] = useState(() => Boolean(window.google?.maps));

    useEffect(() => {
        if (loaded) return;

        const handleLoad = () => setLoaded(true);
        const existing = document.getElementById("gm-script");
        if (existing) {
            existing.addEventListener("load", handleLoad);
            return () => existing.removeEventListener("load", handleLoad);
        }

        const script = document.createElement("script");
        script.id = "gm-script";
        script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
        script.async = true;
        script.onload = handleLoad;
        document.head.appendChild(script);
    }, [loaded]);

    return loaded;
}

// ── Map Component ─────────────────────────────────────────────────────────────
function GoogleMapView({
                           center,
                           selectedLocation,
                           locations,
                           onMarkerClick,
                       }: {
    center: { lat: number; lng: number };
    selectedLocation: Location | null;
    locations: Location[];
    onMarkerClick: (loc: Location) => void;
}) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<google.maps.Map | null>(null);
    const markersRef = useRef<Map<string, google.maps.Marker>>(new Map());
    const mapsLoaded = useGoogleMaps();

    useEffect(() => {
        if (!mapsLoaded || !mapRef.current) return;
        mapInstance.current = new google.maps.Map(mapRef.current, {
            center,
            zoom: 13,
            disableDefaultUI: true,
            zoomControl: true,
            styles: [
                { featureType: "all",       elementType: "geometry",        stylers: [{ color: "#f7f9f9" }] },
                { featureType: "water",     elementType: "geometry",        stylers: [{ color: "#C4DEDD" }] },
                { featureType: "road",      elementType: "geometry",        stylers: [{ color: "#ffffff" }] },
                { featureType: "road",      elementType: "geometry.stroke", stylers: [{ color: "#EAEFEE" }] },
                { featureType: "poi.park",  elementType: "geometry",        stylers: [{ color: "#dbeee9" }] },
                { featureType: "transit",   elementType: "geometry",        stylers: [{ color: "#EAEFEE" }] },
                { featureType: "landscape", elementType: "geometry",        stylers: [{ color: "#f7f9f9" }] },
                { featureType: "all",       elementType: "labels.text.fill",stylers: [{ color: "#262626" }] },
                { featureType: "all",       elementType: "labels.text.stroke",stylers: [{ color: "#ffffff" }] },
            ],
        });
    }, [mapsLoaded]);

    useEffect(() => { mapInstance.current?.panTo(center); }, [center]);

    useEffect(() => {
        if (!mapInstance.current || !mapsLoaded) return;
        markersRef.current.forEach((m) => m.setMap(null));
        markersRef.current.clear();

        locations.forEach((loc) => {
            const isSelected = selectedLocation?.id === loc.id;
            const marker = new google.maps.Marker({
                position: { lat: loc.lat, lng: loc.lng },
                map: mapInstance.current!,
                title: loc.name,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: isSelected ? 12 : 8,
                    fillColor: isSelected ? "#427b77" : "#ffffff",
                    fillOpacity: 1,
                    strokeColor: "#427b77",
                    strokeWeight: isSelected ? 0 : 2.5,
                },
                zIndex: isSelected ? 10 : 1,
            });
            marker.addListener("click", () => onMarkerClick(loc));
            markersRef.current.set(loc.id, marker);
        });
    }, [locations, selectedLocation, mapsLoaded, onMarkerClick]);

    if (!mapsLoaded) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-[#F7F9F9]">
                <Loader2 size={24} className="animate-spin text-[#427b77]" />
            </div>
        );
    }

    return <div ref={mapRef} className="h-full w-full" />;
}

// ── Breadcrumb ────────────────────────────────────────────────────────────────
function Breadcrumb({ parts }: { parts: string[] }) {
    return (
        <div className="flex items-center gap-1 flex-wrap">
            {parts.map((part, i) => (
                <span key={i} className="flex items-center gap-1">
                    {i > 0 && (
                        <ChevronRight size={11} className="text-[#262626]/30" strokeWidth={2.5} />
                    )}
                    <span className={[
                        "text-[14px] epilogue-regular",
                        i === parts.length - 1
                            ? "text-[#427b77] font-semibold"
                            : "text-[#262626]/45",
                    ].join(" ")}>
                        {part}
                    </span>
                </span>
            ))}
        </div>
    );
}

// ── Main Modal ────────────────────────────────────────────────────────────────
export default function LocationPickerModal({
                                                isOpen,
                                                onClose,
                                                onSelect,
                                                initialSelectedLocation = null,
                                                currentBreadcrumb = {
                                                    region: "Location",
                                                    city: "Cebu City",
                                                    barangay: "Brgy. Parian",
                                                    place: "Colon Street",
                                                },
                                            }: LocationPickerModalProps) {
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<Location | null>(initialSelectedLocation);
    const [mapCenter, setMapCenter] = useState(
        initialSelectedLocation
            ? { lat: initialSelectedLocation.lat, lng: initialSelectedLocation.lng }
            : { lat: 10.2934, lng: 123.9017 }
    );
    const [locating, setLocating] = useState(false);
    const [gpsPrompt, setGpsPrompt] = useState(false);
    const [gpsDenied, setGpsDenied] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const filtered = search.trim()
        ? PRESET_LOCATIONS.filter(
            (l) =>
                l.name.toLowerCase().includes(search.toLowerCase()) ||
                l.address.toLowerCase().includes(search.toLowerCase())
        )
        : PRESET_LOCATIONS;

    const handleSelect = useCallback((loc: Location) => {
        setSelected(loc);
        setMapCenter({ lat: loc.lat, lng: loc.lng });
    }, []);

    const handleUseMyLocation = () => {
        setGpsDenied(false);
        setGpsPrompt(true);
    };

    const handleGpsConfirm = () => {
        setGpsPrompt(false);
        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                const locationDetails = await getCurrentLocationDetails(lat, lng);
                const loc: Location = {
                    id: "current",
                    ...locationDetails,
                    distance: "0 km",
                    lat,
                    lng,
                    type: "current",
                };
                handleSelect(loc);
                setLocating(false);
            },
            () => { setLocating(false); setGpsDenied(true); },
            { timeout: 8000 }
        );
    };

    const handleConfirm = () => {
        if (!selected) return;
        onSelect(selected);
        onClose();
    };

    // Breadcrumb derived from selected or default
    const breadcrumbParts = selected
        ? ["Location", selected.city ?? "Cebu City", selected.barangay ?? "—", selected.name]
        : [currentBreadcrumb.region, currentBreadcrumb.city, currentBreadcrumb.barangay, currentBreadcrumb.place];

    useEffect(() => {
        if (isOpen) setTimeout(() => inputRef.current?.focus(), 120);
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-50 bg-[#262626]/40 backdrop-blur-[2px]"
                onClick={onClose}
                style={{ animation: "fadeIn 0.18s ease-out" }}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div
                    className="pointer-events-auto w-full max-w-[920px] rounded-2xl bg-white shadow-[0_32px_80px_rgba(6,30,41,0.22)] overflow-hidden flex flex-col"
                    style={{ maxHeight: "92vh", animation: "modalUp 0.22s cubic-bezier(0.34,1.56,0.64,1)" }}
                >

                    {/* ── Header ── */}
                    <div className="flex items-start justify-between px-7 pt-6 pb-5 border-b border-[#EAEFEE] shrink-0">
                        {/* Left: title */}
                        <div>
                            <h2 className="text-[28px] font-extrabold text-[#262626] epilogue-header leading-tight tracking-tight">
                                Set Delivery Location
                            </h2>
                            <div className="mt-1.5">
                                <Breadcrumb parts={breadcrumbParts} />
                            </div>
                        </div>

                        {/* Right: close */}
                        <button
                            onClick={onClose}
                            className="mt-0.5 w-9 h-9 rounded-full flex items-center justify-center text-[#262626]/35 hover:bg-[#F7F9F9] hover:text-[#262626] transition-colors duration-150"
                        >
                            <X size={18} strokeWidth={2} />
                        </button>
                    </div>

                    {/* ── Body: split layout ── */}
                    <div className="flex flex-1 min-h-0 overflow-hidden">

                        {/* ── Left: Search + List ── */}
                        <div className="w-[320px] shrink-0 flex flex-col border-r border-[#EAEFEE]">

                            {/* Search bar */}
                            <div className="px-5 py-3.5 border-b border-[#EAEFEE]">
                                <div className="relative">
                                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#262626]/35" strokeWidth={2} />
                                    <input
                                        ref={inputRef}
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search area or barangay…"
                                        className="w-full pl-9 pr-3.5 py-2.5 text-[15px] bg-[#F7F9F9] border border-[#EAEFEE] rounded-xl outline-none focus:border-[#427b77] focus:ring-2 focus:ring-[#427b77]/15 transition-all duration-200 text-[#262626] epilogue-regular placeholder:text-[#262626]/35"
                                    />
                                </div>
                            </div>

                            {/* Use my location */}
                            <button
                                onClick={handleUseMyLocation}
                                disabled={locating}
                                className="flex items-center gap-3.5 px-5 py-3.5 border-b border-[#EAEFEE] hover:bg-[#F7F9F9] transition-colors duration-150 group"
                            >
                                <div className="shrink-0">
                                    {locating
                                        ? <Loader2 size={20} className="text-[#427b77] animate-spin" />
                                        : <Navigation size={20} className="text-[#427b77]" strokeWidth={2} />
                                    }
                                </div>
                                <div className="text-left">
                                    <p className="text-[15px] font-bold text-[#427b77] epilogue-header leading-tight">
                                        Use my current location
                                    </p>
                                    <p className="text-[13px] text-[#262626]/45 epilogue-regular">
                                        GPS · requires permission
                                    </p>
                                </div>
                            </button>

                            {/* List */}
                            <div className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                {filtered.length === 0 ? (
                                    <div className="py-12 text-center">
                                        <p className="text-[15px] text-[#262626]/40 epilogue-regular">No locations found</p>
                                    </div>
                                ) : (
                                    <ul>
                                        {filtered.map((loc, i) => {
                                            const isSelected = selected?.id === loc.id;
                                            return (
                                                <li key={loc.id}>
                                                    <button
                                                        onClick={() => handleSelect(loc)}
                                                        className={[
                                                            "w-full flex items-center gap-3.5 px-5 py-3.5 text-left transition-colors duration-150 group",
                                                            i < filtered.length - 1 ? "border-b border-[#EAEFEE]" : "",
                                                            isSelected ? "bg-[#427b77]/6" : "hover:bg-[#F7F9F9]",
                                                        ].join(" ")}
                                                    >
                                                        {/* Icon — no bg */}
                                                        <div className="shrink-0">
                                                            <MapPin
                                                                size={20}
                                                                strokeWidth={2}
                                                                className={isSelected ? "text-[#427b77]" : "text-[#262626]/35 group-hover:text-[#262626]/60 transition-colors"}
                                                            />
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <p className={[
                                                                "text-[15px] font-bold truncate epilogue-header leading-tight",
                                                                isSelected ? "text-[#427b77]" : "text-[#262626]",
                                                            ].join(" ")}>
                                                                {loc.name}
                                                            </p>
                                                            <p className="text-[13px] text-[#262626]/45 epilogue-regular truncate mt-0.5">
                                                                {loc.barangay} · {loc.city}
                                                            </p>
                                                        </div>

                                                        <div className="flex flex-col items-end gap-1 shrink-0">
                                                            <span className="text-[13px] font-semibold text-[#427b77]/70 epilogue-header">
                                                                {loc.distance}
                                                            </span>
                                                            {isSelected
                                                                ? <CheckCircle2 size={14} className="text-[#427b77]" strokeWidth={2} />
                                                                : <ChevronRight size={14} className="text-[#262626]/25 group-hover:text-[#262626]/50 transition-colors" strokeWidth={2} />
                                                            }
                                                        </div>
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>
                        </div>

                        {/* ── Right: Map ── */}
                        <div className="flex-1 flex flex-col min-h-0">
                            <div className="flex-1 relative">
                                <GoogleMapView
                                    center={mapCenter}
                                    selectedLocation={selected}
                                    locations={filtered}
                                    onMarkerClick={handleSelect}
                                />

                                {/* Selected location pill on map */}
                                {selected && (
                                    <div
                                        className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-[0_8px_24px_rgba(6,30,41,0.16)] border border-[#EAEFEE] px-4 py-2.5 flex items-center gap-2.5 max-w-[85%]"
                                        style={{ animation: "modalUp 0.18s ease-out" }}
                                    >
                                        <MapPin size={16} className="text-[#427b77] shrink-0" strokeWidth={2.5} />
                                        <div className="min-w-0">
                                            <p className="text-[14px] font-bold text-[#262626] epilogue-header truncate">{selected.name}</p>
                                            <p className="text-[12px] text-[#262626]/50 epilogue-regular truncate">{selected.address}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── Footer ── */}
                    <div className="px-7 py-4 border-t border-[#EAEFEE] flex items-center justify-between gap-4 shrink-0 bg-[#F7F9F9]">
                        <p className="text-[14px] text-[#262626]/45 epilogue-regular">
                            {selected
                                ? `Delivering to: ${selected.name}`
                                : "Select a location from the list or map"}
                        </p>
                        <div className="flex items-center gap-2.5">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 rounded-xl text-[15px] font-bold text-[#262626]/60 epilogue-header border border-[#EAEFEE] hover:bg-white hover:text-[#262626] transition-colors duration-150"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={!selected}
                                className={[
                                    "px-5 py-2 rounded-xl text-[15px] font-bold epilogue-header transition-all duration-200",
                                    selected
                                        ? "bg-[#427b77] text-white hover:bg-[#356461] shadow-sm"
                                        : "bg-[#262626]/10 text-[#262626]/30 cursor-not-allowed",
                                ].join(" ")}
                            >
                                Confirm Location
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {/* ── GPS Permission Dialog ── */}
            {gpsPrompt && (
                <>
                    <div
                        className="fixed inset-0 z-[60] bg-[#262626]/30 backdrop-blur-[2px]"
                        onClick={() => setGpsPrompt(false)}
                        style={{ animation: "fadeIn 0.15s ease-out" }}
                    />
                    <div
                        className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div
                            className="pointer-events-auto w-full max-w-[380px] rounded-2xl bg-white shadow-[0_24px_60px_rgba(6,30,41,0.20)] overflow-hidden"
                            style={{ animation: "modalUp 0.2s cubic-bezier(0.34,1.56,0.64,1)" }}
                        >
                            {/* Dialog header */}
                            <div className="px-6 pt-6 pb-4 flex items-start gap-4">
                                <Navigation size={26} className="text-[#427b77] shrink-0 mt-0.5" strokeWidth={2} />
                                <div>
                                    <p className="text-[17px] font-extrabold text-[#262626] epilogue-header leading-tight">
                                        Allow location access?
                                    </p>
                                    <p className="text-[13px] text-[#262626]/55 epilogue-regular mt-1.5 leading-relaxed">
                                        Dosely needs access to your GPS to show your current location on the map. Your location is only used for delivery.
                                    </p>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-[#EAEFEE]" />

                            {/* Actions */}
                            <div className="px-6 py-4 flex items-center justify-end gap-2.5">
                                <button
                                    onClick={() => setGpsPrompt(false)}
                                    className="px-4 py-2 rounded-xl text-[13px] font-bold text-[#262626]/55 epilogue-header border border-[#EAEFEE] hover:bg-[#F7F9F9] hover:text-[#262626] transition-colors duration-150"
                                >
                                    Not now
                                </button>
                                <button
                                    onClick={handleGpsConfirm}
                                    className="px-5 py-2 rounded-xl text-[13px] font-bold text-white epilogue-header bg-[#427b77] hover:bg-[#356461] shadow-sm transition-colors duration-150"
                                >
                                    Allow GPS
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* ── GPS Denied Toast ── */}
            {gpsDenied && (
                <div
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] bg-[#262626] text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2.5 epilogue-regular text-[13px]"
                    style={{ animation: "modalUp 0.2s ease-out" }}
                >
                    <MapPin size={15} className="text-[#ff6b6b] shrink-0" strokeWidth={2} />
                    Location access was denied. Please enable it in your browser settings.
                    <button onClick={() => setGpsDenied(false)} className="ml-2 text-white/50 hover:text-white transition-colors">
                        <X size={14} strokeWidth={2} />
                    </button>
                </div>
            )}

            <style>{`
                @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
                @keyframes modalUp {
                    from { opacity: 0; transform: translateY(16px) scale(0.98); }
                    to   { opacity: 1; transform: translateY(0)    scale(1);    }
                }
            `}</style>
        </>
    );
}
