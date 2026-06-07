import type { Product } from "../types";
import type { FilterState } from "./filterState";

export function applyProductFilters(products: Product[], filters: FilterState) {
    const filtered = products.filter((product) => {
        if (filters.categories.length > 0 && !filters.categories.includes(product.category)) return false;
        if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) return false;
        if (filters.brands.length > 0 && !filters.brands.some((brand) => product.manufacturer.includes(brand))) return false;
        if (filters.availability === "in-stock" && product.stockStatus !== "in_stock") return false;
        if (filters.availability === "low-stock" && product.stockStatus !== "low_stock") return false;
        if (filters.availability === "out-of-stock" && product.stockStatus !== "out_of_stock") return false;
        return true;
    });

    return [...filtered].sort((a, b) => {
        if (filters.sortBy === "price-asc") return a.price - b.price;
        if (filters.sortBy === "price-desc") return b.price - a.price;
        if (filters.sortBy === "name") return a.brandName.localeCompare(b.brandName);
        return 0;
    });
}
