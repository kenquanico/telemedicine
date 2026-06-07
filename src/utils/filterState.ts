import type { Category } from "../types";

export interface FilterState {
    categories: Category[];
    priceRange: [number, number];
    brands: string[];
    availability: "all" | "in-stock" | "low-stock" | "out-of-stock";
    sortBy: "relevance" | "price-asc" | "price-desc" | "name";
}

export const DEFAULT_FILTERS: FilterState = {
    categories: [],
    priceRange: [0, 5000],
    brands: [],
    availability: "all",
    sortBy: "relevance",
};

export function getDefaultFilters(): FilterState {
    return {
        categories: [],
        priceRange: [0, 5000],
        brands: [],
        availability: "all",
        sortBy: "relevance",
    };
}

export function getActiveFilterCount(filters: FilterState) {
    return [
        filters.categories.length > 0,
        filters.priceRange[0] > 0 || filters.priceRange[1] < 5000,
        filters.brands.length > 0,
        filters.availability !== "all",
        filters.sortBy !== "relevance",
    ].filter(Boolean).length;
}
