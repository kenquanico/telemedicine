import React, { useState } from "react";
import { useApp } from "../hooks/useApp";
import { RotateCcw } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface FilterState {
    categories: string[];
    priceRange: [number, number];
    availability: "all" | "in-stock" | "rx" | "otc";
    sortBy: "relevance" | "price-asc" | "price-desc" | "name";
}

export const DEFAULT_FILTERS: FilterState = {
    categories: [],
    priceRange: [0, 5000],
    availability: "all",
    sortBy: "relevance",
};

const CATEGORIES = [
    { key: "pain-relief",  label: "Pain Relief"    },
    { key: "antibiotics",  label: "Antibiotics"    },
    { key: "vitamins",     label: "Vitamins"       },
    { key: "heart-health", label: "Heart Health"   },
    { key: "cold-flu",     label: "Cold & Flu"     },
    { key: "diabetes",     label: "Diabetes"       },
    { key: "skin-care",    label: "Skin Care"      },
    { key: "digestive",    label: "Digestive"      },
];

const SORT_OPTIONS = [
    { value: "relevance",  label: "Relevance"       },
    { value: "price-asc",  label: "Price: Low–High" },
    { value: "price-desc", label: "Price: High–Low" },
    { value: "name",       label: "Name A–Z"        },
];

const AVAILABILITY_OPTIONS = [
    { value: "all",      label: "All Items"         },
    { value: "in-stock", label: "In Stock"          },
    { value: "otc",      label: "Over-the-Counter"  },
    { value: "rx",       label: "Prescription Only" },
];

// ─── Price Slider ─────────────────────────────────────────────────────────────
function PriceSlider({ value, onChange }: { value: [number, number]; onChange: (v: [number, number]) => void }) {
    const MIN = 0, MAX = 5000;
    const pct = (v: number) => ((v - MIN) / (MAX - MIN)) * 100;
    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{
                    fontSize: 12, fontWeight: 400, color: "#2d2d2d",
                    fontFamily: "'Epilogue', sans-serif",
                    background: "#F7F9F9", borderRadius: 8, padding: "4px 10px",
                    border: "1px solid #EAEFEE",
                }}>₱{value[0].toLocaleString()}</span>
                <span style={{
                    fontSize: 12, fontWeight: 400, color: "#2d2d2d",
                    fontFamily: "'Epilogue', sans-serif",
                    background: "#F7F9F9", borderRadius: 8, padding: "4px 10px",
                    border: "1px solid #EAEFEE",
                }}>₱{value[1].toLocaleString()}</span>
            </div>
            <div style={{ position: "relative", height: 24, display: "flex", alignItems: "center" }}>
                <div style={{ position: "absolute", width: "100%", height: 4, background: "#EAEFEE", borderRadius: 4 }} />
                <div style={{
                    position: "absolute", height: 4, background: "#427b77", borderRadius: 4,
                    left: `${pct(value[0])}%`, width: `${pct(value[1]) - pct(value[0])}%`,
                }} />
                <input type="range" min={MIN} max={MAX} step={50} value={value[0]}
                       onChange={(e) => { const v = +e.target.value; if (v < value[1]) onChange([v, value[1]]); }}
                       className="price-thumb" style={{ position: "absolute", width: "100%", appearance: "none", background: "transparent", cursor: "pointer" }} />
                <input type="range" min={MIN} max={MAX} step={50} value={value[1]}
                       onChange={(e) => { const v = +e.target.value; if (v > value[0]) onChange([value[0], v]); }}
                       className="price-thumb" style={{ position: "absolute", width: "100%", appearance: "none", background: "transparent", cursor: "pointer" }} />
            </div>

            {/* Quick presets */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 14 }}>
                {([
                    { label: "Under ₱100",  range: [0, 100]     as [number, number] },
                    { label: "₱100–₱500",   range: [100, 500]   as [number, number] },
                    { label: "₱500–₱1,000", range: [500, 1000]  as [number, number] },
                    { label: "Over ₱1,000", range: [1000, 5000] as [number, number] },
                ]).map((p) => {
                    const active = value[0] === p.range[0] && value[1] === p.range[1];
                    return (
                        <button key={p.label} onClick={() => onChange(p.range)}
                                style={{
                                    fontSize: 12, padding: "7px 8px", borderRadius: 8,
                                    border: `1.5px solid ${active ? "#427b77" : "#EAEFEE"}`,
                                    background: active ? "rgba(66,123,119,0.07)" : "#fff",
                                    color: active ? "#427b77" : "#9CA3AF",
                                    fontWeight: 400,
                                    cursor: "pointer",
                                    fontFamily: "'Epilogue', sans-serif",
                                    transition: "all 0.15s",
                                    textAlign: "left",
                                }}
                        >{p.label}</button>
                    );
                })}
            </div>
        </div>
    );
}

// ─── Section Heading ──────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div>
            <p style={{
                fontSize: 13, fontWeight: 500, color: "#6B7280",
                marginBottom: 10, fontFamily: "'Epilogue', sans-serif",
            }}>{title}</p>
            {children}
        </div>
    );
}

// ─── Radio Row ────────────────────────────────────────────────────────────────
function RadioRow({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
        <button onClick={onClick}
                style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 10,
                    padding: "7px 10px", borderRadius: 10, border: "none",
                    background: active ? "rgba(66,123,119,0.07)" : "transparent",
                    color: active ? "#427b77" : "#6B7280",
                    fontWeight: 400,
                    fontSize: 13, cursor: "pointer",
                    fontFamily: "'Epilogue', sans-serif",
                    textAlign: "left",
                    transition: "all 0.15s",
                }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = "#F7F9F9"; }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
        >
            <span style={{
                width: 14, height: 14, borderRadius: "50%",
                border: `2px solid ${active ? "#427b77" : "#D1D5DB"}`,
                background: active ? "#427b77" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, transition: "all 0.15s",
            }}>
                {active && <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#fff" }} />}
            </span>
            {children}
        </button>
    );
}

// ─── FilterPanel ──────────────────────────────────────────────────────────────
export default function FilterPanel() {
    const { filterOpen } = useApp();
    const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

    const activeCount = [
        filters.categories.length > 0,
        filters.priceRange[0] > 0 || filters.priceRange[1] < 5000,
        filters.availability !== "all",
        filters.sortBy !== "relevance",
    ].filter(Boolean).length;

    const toggleCategory = (key: string) =>
        setFilters((f) => ({
            ...f,
            categories: f.categories.includes(key)
                ? f.categories.filter((c) => c !== key)
                : [...f.categories, key],
        }));

    if (!filterOpen) return null;

    return (
        <>
            {/* No sticky/fixed positioning here — parent in HomePage handles that */}
            <div style={{ width: 252, flexShrink: 0 }}>
                <div style={{
                    background: "#fff",
                    borderRadius: 20,
                    border: "1px solid #EAEFEE",
                    boxShadow: "0 2px 16px rgba(45,45,45,0.05)",
                    // No overflow:hidden — let the parent scroll container handle height
                }}>
                    {/* Header */}
                    <div style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "16px 18px 14px", borderBottom: "1px solid #F4F6F5",
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{
                                fontSize: 14, fontWeight: 400, color: "#2d2d2d",
                                fontFamily: "'Epilogue', sans-serif",
                            }}>
                                Filters
                            </span>

                        </div>
                        {activeCount > 0 && (
                            <button onClick={() => setFilters(DEFAULT_FILTERS)}
                                    style={{
                                        display: "flex", alignItems: "center", gap: 5,
                                        fontSize: 12, color: "#9CA3AF", background: "none",
                                        border: "none", cursor: "pointer",
                                        fontFamily: "'Epilogue', sans-serif",
                                        fontWeight: 400, padding: "4px 8px", borderRadius: 8,
                                        transition: "color 0.15s, background 0.15s",
                                    }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#427b77"; (e.currentTarget as HTMLButtonElement).style.background = "rgba(66,123,119,0.07)"; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "#9CA3AF"; (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                            >
                                <RotateCcw size={10} strokeWidth={2} />
                                Clear
                            </button>
                        )}
                    </div>

                    {/* Body */}
                    <div style={{ padding: "18px 18px", display: "flex", flexDirection: "column", gap: 18 }}>

                        <Section title="Sort By">
                            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                {SORT_OPTIONS.map((opt) => (
                                    <RadioRow key={opt.value} active={filters.sortBy === opt.value}
                                              onClick={() => setFilters((f) => ({ ...f, sortBy: opt.value as FilterState["sortBy"] }))}>
                                        {opt.label}
                                    </RadioRow>
                                ))}
                            </div>
                        </Section>

                        <div style={{ height: 1, background: "#F4F6F5" }} />

                        <Section title="Category">
                            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                {CATEGORIES.map((cat) => {
                                    const active = filters.categories.includes(cat.key);
                                    return (
                                        <button key={cat.key} onClick={() => toggleCategory(cat.key)}
                                                style={{
                                                    width: "100%", display: "flex", alignItems: "center", gap: 10,
                                                    padding: "7px 10px", borderRadius: 10, border: "none",
                                                    background: active ? "rgba(66,123,119,0.07)" : "transparent",
                                                    color: active ? "#427b77" : "#6B7280",
                                                    fontWeight: 400,
                                                    fontSize: 13, cursor: "pointer",
                                                    fontFamily: "'Epilogue', sans-serif",
                                                    textAlign: "left",
                                                    transition: "all 0.15s",
                                                }}
                                                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = "#F7F9F9"; }}
                                                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                                        >
                                            <span style={{
                                                width: 14, height: 14, borderRadius: 4,
                                                border: `2px solid ${active ? "#427b77" : "#D1D5DB"}`,
                                                background: active ? "#427b77" : "transparent",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                flexShrink: 0, transition: "all 0.15s",
                                            }}>
                                                {active && (
                                                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                                                        <path d="M1.5 4L3.2 5.7L6.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                )}
                                            </span>
                                            {cat.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </Section>

                        <div style={{ height: 1, background: "#F4F6F5" }} />

                        <Section title="Price Range">
                            <PriceSlider
                                value={filters.priceRange}
                                onChange={(v) => setFilters((f) => ({ ...f, priceRange: v }))}
                            />
                        </Section>

                        <div style={{ height: 1, background: "#F4F6F5" }} />

                        <Section title="Availability">
                            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                {AVAILABILITY_OPTIONS.map((opt) => (
                                    <RadioRow key={opt.value} active={filters.availability === opt.value}
                                              onClick={() => setFilters((f) => ({ ...f, availability: opt.value as FilterState["availability"] }))}>
                                        {opt.label}
                                    </RadioRow>
                                ))}
                            </div>
                        </Section>

                    </div>

                    {/* Footer */}
                    <div style={{ padding: "0 18px 18px" }}>
                        <button
                            style={{
                                width: "100%", background: "#2d2d2d", color: "#fff",
                                border: "none", borderRadius: 12, padding: "12px 0",
                                fontSize: 13, fontWeight: 400, cursor: "pointer",
                                fontFamily: "'Epilogue', sans-serif",
                                letterSpacing: "0.03em",
                                transition: "background 0.2s",
                            }}
                            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "#427b77"}
                            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "#2d2d2d"}
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                .price-thumb { -webkit-appearance: none; }
                .price-thumb::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 18px; height: 18px; border-radius: 50%;
                    background: #fff; border: 2.5px solid #427b77;
                    box-shadow: 0 2px 8px rgba(66,123,119,0.25); cursor: pointer;
                    transition: box-shadow 0.15s;
                }
                .price-thumb::-webkit-slider-thumb:hover {
                    box-shadow: 0 0 0 6px rgba(66,123,119,0.14);
                }
                .price-thumb::-moz-range-thumb {
                    width: 18px; height: 18px; border-radius: 50%;
                    background: #fff; border: 2.5px solid #427b77;
                    box-shadow: 0 2px 8px rgba(66,123,119,0.25); cursor: pointer;
                }
            `}</style>
        </>
    );
}