import { useState } from "react";
import { useApp } from "../hooks/useApp";
import { PRODUCTS, CATEGORY_META } from "../data/mockData";
import { MedicineCard } from "../components/UI";
import type { Category, CatalogFilters } from "../types";

const PRICE_RANGES = [
    { label: "Under ₱50", min: 0, max: 50 },
    { label: "₱50 – ₱200", min: 50, max: 200 },
    { label: "₱200 – ₱500", min: 200, max: 500 },
    { label: "₱500+", min: 500, max: Infinity },
];

const BRANDS = ["Unilab", "Pfizer", "Sanofi", "Johnson & Johnson", "Nature's Bounty", "Mundipharma", "Watsons"];

export default function CatalogPage() {
    const { navigateTo, addToCart, showModal } = useApp();

    const [filters, setFilters] = useState<CatalogFilters>({
        categories: [],
        priceRanges: [],
        brands: [],
        stockOnly: false,
        searchQuery: "",
    });

    const [activeTab, setActiveTab] = useState<Category | "all">("all");

    // Filtered products
    const filtered = PRODUCTS.filter((p) => {
        if (activeTab !== "all" && p.category !== activeTab) return false;
        if (filters.categories.length > 0 && !filters.categories.includes(p.category)) return false;
        if (filters.brands.length > 0 && !filters.brands.some((b) => p.manufacturer.includes(b))) return false;
        if (filters.stockOnly && p.stockStatus === "out_of_stock") return false;
        if (filters.priceRanges.length > 0) {
            const inRange = filters.priceRanges.some((label) => {
                const r = PRICE_RANGES.find((x) => x.label === label);
                return r ? p.price >= r.min && p.price < r.max : false;
            });
            if (!inRange) return false;
        }
        if (filters.searchQuery) {
            const q = filters.searchQuery.toLowerCase();
            return (
                p.brandName.toLowerCase().includes(q) ||
                p.genericName.toLowerCase().includes(q) ||
                p.manufacturer.toLowerCase().includes(q)
            );
        }
        return true;
    });

    const toggleArr = <T,>(arr: T[], val: T): T[] =>
        arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

    const handleAdd = (productId: string) => {
        const product = PRODUCTS.find((p) => p.id === productId);
        if (!product) return;
        addToCart(product);
        showModal({
            type: "added",
            icon: "✅",
            title: "Added to Cart!",
            message: `${product.brandName} ${product.strength} added to cart.`,
            actionLabel: "View Cart",
            onAction: () => navigateTo("cart"),
        });
    };

    return (
        <div>
            <div style={{ background: "#F3F4F4", padding: "16px 24px", borderBottom: "1px solid #E5E7EB" }}>
                <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 2 }}>{filtered.length} products found</div>
                <h2 style={{ fontFamily: "'Varela Round',sans-serif", fontSize: 22 }}>Medicine Catalog</h2>
            </div>

            <div style={{ display: "flex", gap: 24, padding: 24, alignItems: "flex-start" }}>
                {/* ── Filter Sidebar ─────────────────────────────────────────────── */}
                <div style={{ width: 220, flexShrink: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
                        🔽 Filters
                    </div>

                    {/* Category */}
                    <div style={{ marginBottom: 20 }}>
                        <h4 style={{ fontSize: 12, fontWeight: 700, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.5px", color: "#6B7280" }}>
                            Category
                        </h4>
                        {(Object.entries(CATEGORY_META) as [Category, { label: string; icon: string }][]).map(([key, meta]) => (
                            <label key={key} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, cursor: "pointer", fontSize: 14 }}>
                                <div
                                    onClick={() => setFilters((f) => ({ ...f, categories: toggleArr(f.categories, key) }))}
                                    style={{
                                        width: 16, height: 16,
                                        border: "2px solid",
                                        borderColor: filters.categories.includes(key) ? "#5F9598" : "#E5E7EB",
                                        background: filters.categories.includes(key) ? "#5F9598" : "#fff",
                                        borderRadius: 4,
                                        flexShrink: 0,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        color: "#fff", fontSize: 10,
                                    }}
                                >
                                    {filters.categories.includes(key) && "✓"}
                                </div>
                                {meta.icon} {meta.label}
                            </label>
                        ))}
                    </div>

                    {/* Price */}
                    <div style={{ marginBottom: 20 }}>
                        <h4 style={{ fontSize: 12, fontWeight: 700, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.5px", color: "#6B7280" }}>
                            Price Range
                        </h4>
                        {PRICE_RANGES.map((r) => (
                            <label key={r.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, cursor: "pointer", fontSize: 14 }}>
                                <div
                                    onClick={() => setFilters((f) => ({ ...f, priceRanges: toggleArr(f.priceRanges, r.label) }))}
                                    style={{
                                        width: 16, height: 16,
                                        border: "2px solid",
                                        borderColor: filters.priceRanges.includes(r.label) ? "#5F9598" : "#E5E7EB",
                                        background: filters.priceRanges.includes(r.label) ? "#5F9598" : "#fff",
                                        borderRadius: 4,
                                        flexShrink: 0,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        color: "#fff", fontSize: 10,
                                    }}
                                >
                                    {filters.priceRanges.includes(r.label) && "✓"}
                                </div>
                                {r.label}
                            </label>
                        ))}
                    </div>

                    {/* Brand */}
                    <div style={{ marginBottom: 20 }}>
                        <h4 style={{ fontSize: 12, fontWeight: 700, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.5px", color: "#6B7280" }}>
                            Brand
                        </h4>
                        {BRANDS.map((b) => (
                            <label key={b} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, cursor: "pointer", fontSize: 14 }}>
                                <div
                                    onClick={() => setFilters((f) => ({ ...f, brands: toggleArr(f.brands, b) }))}
                                    style={{
                                        width: 16, height: 16,
                                        border: "2px solid",
                                        borderColor: filters.brands.includes(b) ? "#5F9598" : "#E5E7EB",
                                        background: filters.brands.includes(b) ? "#5F9598" : "#fff",
                                        borderRadius: 4,
                                        flexShrink: 0,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        color: "#fff", fontSize: 10,
                                    }}
                                >
                                    {filters.brands.includes(b) && "✓"}
                                </div>
                                {b}
                            </label>
                        ))}
                    </div>

                    {/* In-stock only */}
                    <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14, marginBottom: 16 }}>
                        <div
                            onClick={() => setFilters((f) => ({ ...f, stockOnly: !f.stockOnly }))}
                            style={{
                                width: 16, height: 16,
                                border: "2px solid",
                                borderColor: filters.stockOnly ? "#5F9598" : "#E5E7EB",
                                background: filters.stockOnly ? "#5F9598" : "#fff",
                                borderRadius: 4, flexShrink: 0,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: "#fff", fontSize: 10,
                            }}
                        >
                            {filters.stockOnly && "✓"}
                        </div>
                        In Stock Only
                    </label>

                    <button
                        onClick={() => setFilters({ categories: [], priceRanges: [], brands: [], stockOnly: false, searchQuery: "" })}
                        style={{
                            width: "100%",
                            background: "#1D546D",
                            color: "#fff",
                            border: "none",
                            borderRadius: 8,
                            padding: 10,
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: "pointer",
                            fontFamily: "'DM Sans',sans-serif",
                        }}
                    >
                        Clear Filters
                    </button>
                </div>

                {/* ── Main Content ──────────────────────────────────────────────── */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Category Tabs */}
                    <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
                        {(["all", ...Object.keys(CATEGORY_META)] as ("all" | Category)[]).map((tab) => {
                            const label = tab === "all" ? "All" : CATEGORY_META[tab as Category].label;
                            const isActive = activeTab === tab;
                            return (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    style={{
                                        border: isActive ? "none" : "1.5px solid #E5E7EB",
                                        background: isActive ? "#1D546D" : "#fff",
                                        color: isActive ? "#fff" : "#061E29",
                                        borderRadius: 20,
                                        padding: "7px 16px",
                                        fontSize: 13,
                                        cursor: "pointer",
                                        fontFamily: "'DM Sans',sans-serif",
                                        fontWeight: isActive ? 600 : 400,
                                    }}
                                >
                                    {tab === "all" ? "All" : `${CATEGORY_META[tab as Category].icon} ${label}`}
                                </button>
                            );
                        })}
                    </div>

                    {/* Grid */}
                    {filtered.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "48px 0", color: "#6B7280" }}>
                            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                            <div style={{ fontSize: 16, fontWeight: 600 }}>No products found</div>
                            <div style={{ fontSize: 13, marginTop: 4 }}>Try adjusting your filters</div>
                        </div>
                    ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
                            {filtered.map((p) => (
                                <MedicineCard
                                    key={p.id}
                                    product={p}
                                    onView={() => navigateTo("product", p.id)}
                                    onAdd={() => handleAdd(p.id)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}