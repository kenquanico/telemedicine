import type { PageKey } from "../types";

export interface PageRoute {
    page: PageKey;
    productId?: string | null;
}

export const PAGE_PATHS: Record<PageKey, string> = {
    home: "/",
    catalog: "/medicines",
    medicines: "/medicines",
    product: "/medicines",
    pickup: "/pickup",
    reservePickup: "/reserve-pickup",
    pharmacies: "/pharmacies",
    pharmacy: "/pharmacy",
    cart: "/cart",
    checkout: "/checkout",
    favorites: "/favorites",
    orders: "/orders",
    tracking: "/tracking",
    payment: "/payment",
    history: "/history",
    account: "/account",
    settings: "/account",
    returns: "/returns",
    prescription_upload: "/prescription-upload",
    help_center: "/help-center",
    about: "/about",
    careers: "/careers",
    press: "/press",
    privacy: "/privacy-policy",
    terms: "/terms",
};

export function getRouteFromPath(pathname: string): PageRoute {
    const normalizedPath = normalizePath(pathname);
    const medicineProductMatch = normalizedPath.match(/^\/medicines\/([^/]+)$/);

    if (normalizedPath === "/reserve-for-pickup") {
        return { page: "reservePickup" };
    }

    if (medicineProductMatch?.[1]) {
        return {
            page: "product",
            productId: decodeURIComponent(medicineProductMatch[1]),
        };
    }

    const page = (Object.entries(PAGE_PATHS).find(
        ([, path]) => path === normalizedPath
    )?.[0] ?? "home") as PageKey;

    return { page };
}

export function getPathForPage(page: PageKey, productId?: string): string {
    if (page === "product") {
        return productId
            ? `/medicines/${encodeURIComponent(productId)}`
            : PAGE_PATHS.product;
    }

    return PAGE_PATHS[page] ?? PAGE_PATHS.home;
}

function normalizePath(pathname: string) {
    if (!pathname || pathname === "/") return "/";
    return pathname.replace(/\/+$/, "");
}
