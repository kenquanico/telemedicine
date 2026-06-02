import { useState } from "react";
import { useApp } from "../hooks/useApp";
import { PRODUCTS, CATEGORY_META } from "../data/mockData";
import { MedicineCard } from "../components/UI";
import type { Category, CatalogFilters } from "../types";

const PRICE_RANGES = [
    { label: "Under ₱50",   min: 0,   max: 50        },
    { label: "₱50 – ₱200",  min: 50,  max: 200       },
    { label: "₱200 – ₱500", min: 200, max: 500       },
    { label: "₱500+",       min: 500, max: Infinity   },
];

const BRANDS = ["Unilab", "Pfizer", "Sanofi", "Johnson & Johnson", "Nature's Bounty", "Mundipharma", "Watsons"];

// ─── Checkbox row ─────────────────────────────────────────────────────────────
function CheckRow({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
        <button onClick={onClick}
                style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 10,
                    padding: "8px 10px", borderRadius: 10, border: "none",
                    background: active ? "rgba(66,123,119,0.07)" : "transparent",
                    color: active ? "#427b77" : "#6B7280",
                    fontWeight: active ? 700 : 500,
                    fontSize: 13, cursor: "pointer",
                    fontFamily: "'Epilogue', sans-serif",
                    textAlign: "left", transition: "all 0.15s",
                }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = "#F7F9F9"; }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
        >
            <span style={{
                width: 14, height: 14, borderRadius: 4, flexShrink: 0,
                border: `2px solid ${active ? "#427b77" : "#D1D5DB"}`,
                background: active ? "#427b77" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.15s",
            }}>
                {active && (
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path d="M1.5 4L3.2 5.7L6.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )}
            </span>
            {children}
        </button>
    );
}

// ─── Filter section heading ────────────────────────────────────────────────────
function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div style={{ marginBottom: 24 }}>
            <p style={{
                fontSize: 10, fontWeight: 800, color: "#9CA3AF",
                textTransform: "uppercase", letterSpacing: "0.1em",
                marginBottom: 10, fontFamily: "'Epilogue', sans-serif",
            }}>{title}</p>
            {children}
        </div>
    );
}

export default function CatalogPage() {
    const { navigateTo, addToCart, showModal } = useApp();

    const [filters, setFilters] = useState<CatalogFilters>({
        categories: [], priceRanges: [], brands: [], stockOnly: false, searchQuery: "",
    });

    const [activeTab, setActiveTab] = useState<Category | "all">("all");

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
            return p.brandName.toLowerCase().includes(q) || p.genericName.toLowerCase().includes(q) || p.manufacturer.toLowerCase().includes(q);
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
            type: "added", icon: "✅", title: "Added to Cart!",
            message: `${product.brandName} ${product.strength} added to cart.`,
            actionLabel: "View Cart", onAction: () => navigateTo("cart"),
        });
    };

    const activeFilterCount = filters.categories.length + filters.priceRanges.length + filters.brands.length + (filters.stockOnly ? 1 : 0);

    return (
        <div>
            {/* ── Page header ── */}
            <div style={{ padding: "32px 64px 28px", borderBottom: "1px solid #F0F3F2" }}>
                <p style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 6, fontFamily: "'Epilogue', sans-serif", fontWeight: 500 }}>
                    {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
                </p>
                <h2 style={{ fontFamily: "'Epilogue', sans-serif", fontSize: 24, fontWeight: 800, color: "#2d2d2d", letterSpacing: "-0.02em" }}>
                    Medicine Catalog
                </h2>
            </div>

            <div style={{ display: "flex", gap: 28, padding: "32px 64px", alignItems: "flex-start" }}>

                {/* ── Filter Sidebar ── */}
                <div style={{
                    width: 228, flexShrink: 0, position: "sticky", top: 96,
                    background: "#fff", borderRadius: 20, border: "1px solid #EAEFEE",
                    boxShadow: "0 2px 16px rgba(45,45,45,0.05)",
                    overflow: "hidden",
                }}>
                    {/* Header */}
                    <div style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "18px 20px 16px", borderBottom: "1px solid #F4F6F5",
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: "#2d2d2d", fontFamily: "'Epilogue', sans-serif" }}>Filters</span>
                            {activeFilterCount > 0 && (
                                <span style={{
                                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                                    minWidth: 20, height: 20, borderRadius: 10,
                                    background: "#427b77", color: "#fff", fontSize: 10, fontWeight: 800,
                                    fontFamily: "'Epilogue', sans-serif",
                                }}>{activeFilterCount}</span>
                            )}
                        </div>
                        {activeFilterCount > 0 && (
                            <button
                                onClick={() => setFilters({ categories: [], priceRanges: [], brands: [], stockOnly: false, searchQuery: "" })}
                                style={{
                                    fontSize: 11, color: "#9CA3AF", background: "none", border: "none",
                                    cursor: "pointer", fontFamily: "'Epilogue', sans-serif", fontWeight: 600,
                                    padding: "4px 8px", borderRadius: 8, transition: "color 0.15s",
                                }}
                                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = "#427b77"}
                                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = "#9CA3AF"}
                            >Clear all</button>
                        )}
                    </div>

                    {/* Filter body */}
                    <div style={{ padding: "20px 20px 24px" }}>

                        <FilterSection title="Category">
                            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                {(Object.entries(CATEGORY_META) as [Category, { label: string; icon: string }][]).map(([key, meta]) => (
                                    <CheckRow key={key} active={filters.categories.includes(key)}
                                              onClick={() => setFilters((f) => ({ ...f, categories: toggleArr(f.categories, key) }))}>
                                        {meta.label}
                                    </CheckRow>
                                ))}
                            </div>
                        </FilterSection>

                        <FilterSection title="Price Range">
                            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                {PRICE_RANGES.map((r) => (
                                    <CheckRow key={r.label} active={filters.priceRanges.includes(r.label)}
                                              onClick={() => setFilters((f) => ({ ...f, priceRanges: toggleArr(f.priceRanges, r.label) }))}>
                                        {r.label}
                                    </CheckRow>
                                ))}
                            </div>
                        </FilterSection>

                        <FilterSection title="Brand">
                            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                {BRANDS.map((b) => (
                                    <CheckRow key={b} active={filters.brands.includes(b)}
                                              onClick={() => setFilters((f) => ({ ...f, brands: toggleArr(f.brands, b) }))}>
                                        {b}
                                    </CheckRow>
                                ))}
                            </div>
                        </FilterSection>

                        <CheckRow active={filters.stockOnly}
                                  onClick={() => setFilters((f) => ({ ...f, stockOnly: !f.stockOnly }))}>
                            In Stock Only
                        </CheckRow>
                    </div>
                </div>

                {/* ── Main Content ── */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Category Tabs */}
                    <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
                        {(["all", ...Object.keys(CATEGORY_META)] as ("all" | Category)[]).map((tab) => {
                            const label = tab === "all" ? "All" : CATEGORY_META[tab as Category].label;
                            const isActive = activeTab === tab;
                            return (
                                <button key={tab} onClick={() => setActiveTab(tab)}
                                        style={{
                                            border: isActive ? "none" : "1.5px solid #EAEFEE",
                                            background: isActive ? "#2d2d2d" : "#fff",
                                            color: isActive ? "#fff" : "#6B7280",
                                            borderRadius: 22, padding: "8px 18px",
                                            fontSize: 13, cursor: "pointer",
                                            fontFamily: "'Epilogue', sans-serif",
                                            fontWeight: isActive ? 700 : 500,
                                            transition: "all 0.18s",
                                            letterSpacing: "0.01em",
                                        }}
                                        onMouseEnter={e => { if (!isActive) { (e.currentTarget as HTMLButtonElement).style.borderColor = "#427b77"; (e.currentTarget as HTMLButtonElement).style.color = "#427b77"; } }}
                                        onMouseLeave={e => { if (!isActive) { (e.currentTarget as HTMLButtonElement).style.borderColor = "#EAEFEE"; (e.currentTarget as HTMLButtonElement).style.color = "#6B7280"; } }}
                                >
                                    {tab === "all" ? "All" : `${CATEGORY_META[tab as Category].icon} ${label}`}
                                </button>
                            );
                        })}
                    </div>

                    {/* Grid */}
                    {filtered.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "80px 0", color: "#9CA3AF" }}>
                            <div style={{
                                width: 80, height: 80, borderRadius: 24,
                                background: "#F4F6F5", display: "flex",
                                alignItems: "center", justifyContent: "center",
                                fontSize: 32, margin: "0 auto 20px",
                            }}>🔍</div>
                            <div style={{ fontSize: 17, fontWeight: 700, color: "#2d2d2d", marginBottom: 6, fontFamily: "'Epilogue', sans-serif" }}>
                                No products found
                            </div>
                            <div style={{ fontSize: 13, fontFamily: "'Epilogue', sans-serif" }}>
                                Try adjusting your filters or search
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
                            {filtered.map((p) => (
                                <MedicineCard key={p.id} product={p}
                                              onView={() => navigateTo("product", p.id)}
                                              onAdd={() => handleAdd(p.id)} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}