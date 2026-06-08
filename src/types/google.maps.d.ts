declare namespace google.maps {
    interface LatLngLiteral {
        lat: number;
        lng: number;
    }

    class LatLng {
        lat(): number;
        lng(): number;
    }

    class Point {
        constructor(x: number, y: number);
    }

    enum ControlPosition {
        RIGHT_CENTER = 8,
    }

    enum SymbolPath {
        CIRCLE = 0,
    }

    interface MapOptions {
        center: LatLngLiteral;
        zoom: number;
        disableDefaultUI?: boolean;
        zoomControl?: boolean;
        zoomControlOptions?: { position: ControlPosition };
        styles?: object[];
    }

    class Map {
        constructor(mapDiv: HTMLElement, opts?: MapOptions);
        getZoom(): number | undefined;
        panTo(latLng: LatLngLiteral): void;
        setZoom(zoom: number): void;
    }

    interface Symbol {
        path: string | SymbolPath;
        scale?: number;
        fillColor?: string;
        fillOpacity?: number;
        strokeColor?: string;
        strokeWeight?: number;
        anchor?: Point;
    }

    interface Icon {
        url: string;
        anchor?: Point;
    }

    interface MarkerOptions {
        position: LatLngLiteral;
        map: Map;
        icon?: Symbol | Icon;
        title?: string;
        zIndex?: number;
    }

    class Marker {
        constructor(opts?: MarkerOptions);
        setMap(map: Map | null): void;
        addListener(eventName: string, handler: () => void): void;
    }

    class InfoWindow {
        constructor();
    }

    interface GeocoderAddressComponent {
        long_name: string;
        short_name: string;
        types: string[];
    }

    interface GeocoderResult {
        formatted_address: string;
        address_components: GeocoderAddressComponent[];
    }

    enum GeocoderStatus {
        OK = "OK",
    }

    class Geocoder {
        geocode(
            request: { location: LatLngLiteral },
            callback: (results: GeocoderResult[] | null, status: GeocoderStatus) => void
        ): void;
    }

    namespace places {
        enum PlacesServiceStatus {
            OK = "OK",
        }

        interface PlacePhoto {
            getUrl(opts?: { maxWidth?: number; maxHeight?: number }): string;
        }

        interface PlaceResult {
            place_id?: string;
            name?: string;
            vicinity?: string;
            geometry?: {
                location?: LatLng;
            };
            rating?: number;
            user_ratings_total?: number;
            opening_hours?: {
                open_now?: boolean;
            };
            photos?: PlacePhoto[];
            types?: string[];
        }

        interface PlaceSearchRequest {
            location: LatLngLiteral;
            radius: number;
            keyword: string;
        }

        class PlacesService {
            constructor(attrContainer: Map);
            nearbySearch(
                request: PlaceSearchRequest,
                callback: (results: PlaceResult[] | null, status: PlacesServiceStatus) => void
            ): void;
        }
    }
}

interface Window {
    google?: {
        maps: typeof google.maps;
    };
}
