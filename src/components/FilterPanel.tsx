import React, { useState } from "react";
import { useApp } from "../hooks/useApp";
import { RotateCcw, SlidersHorizontal } from "lucide-react";

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
    { key: "pain-relief",  label: "Pain Relief",  icon: "💊" },
    { key: "antibiotics",  label: "Antibiotics",  icon: "🧬" },
    { key: "vitamins",     label: "Vitamins",     icon: "🌿" },
    { key: "heart-health", label: "Heart Health", icon: "❤️" },
    { key: "cold-flu",     label: "Cold & Flu",   icon: "🤧" },
    { key: "diabetes",     label: "Diabetes",     icon: "🩸" },
    { key: "skin-care",    label: "Skin Care",    icon: "✨" },
    { key: "digestive",    label: "Digestive",    icon: "🫁" },
];

const SORT_OPTIONS = [
    { value: "relevance",  label: "Relevance"       },
    { value: "price-asc",  label: "Price: Low–High" },
    { value: "price-desc", label: "Price: High–Low" },
    { value: "name",       label: "Name A–Z"        },
];

const AVAILABILITY_OPTIONS = [
    { value: "all",      label: "All"              },
    { value: "in-stock", label: "In Stock"          },
    { value: "otc",      label: "Over-the-Counter" },
    { value: "rx",       label: "Prescription Only"},
];

// ─── Price Slider ─────────────────────────────────────────────────────────────
function PriceSlider({ value, onChange }: { value: [number, number]; onChange: (v: [number, number]) => void }) {
    const MIN = 0, MAX = 5000;
    const pct = (v: number) => ((v - MIN) / (MAX - MIN)) * 100;
    return (
        <div>
            <div className="flex justify-between mb-3">
                <span className="text-xs text-gray-400 epilogue-regular">₱{value[0].toLocaleString()}</span>
                <span className="text-xs text-gray-400 epilogue-regular">₱{value[1].toLocaleString()}</span>
            </div>
            <div className="relative h-5 flex items-center">
                <div className="absolute w-full h-1.5 bg-gray-200 rounded-full" />
                <div className="absolute h-1.5 bg-[#427b77] rounded-full"
                     style={{ left: `${pct(value[0])}%`, width: `${pct(value[1]) - pct(value[0])}%` }} />
                <input type="range" min={MIN} max={MAX} step={50} value={value[0]}
                       onChange={(e) => { const v = +e.target.value; if (v < value[1]) onChange([v, value[1]]); }}
                       className="price-thumb absolute w-full appearance-none bg-transparent cursor-pointer" />
                <input type="range" min={MIN} max={MAX} step={50} value={value[1]}
                       onChange={(e) => { const v = +e.target.value; if (v > value[0]) onChange([value[0], v]); }}
                       className="price-thumb absolute w-full appearance-none bg-transparent cursor-pointer" />
            </div>
            <div className="grid grid-cols-2 gap-1.5 mt-4">
                {([
                    { label: "Under ₱100",  range: [0, 100]     as [number,number] },
                    { label: "₱100–₱500",   range: [100, 500]   as [number,number] },
                    { label: "₱500–₱1,000", range: [500, 1000]  as [number,number] },
                    { label: "Over ₱1,000", range: [1000, 5000] as [number,number] },
                ]).map((p) => {
                    const active = value[0] === p.range[0] && value[1] === p.range[1];
                    return (
                        <button key={p.label} onClick={() => onChange(p.range)}
                                className={["text-xs py-1.5 px-2 rounded-lg border transition-all duration-150 cursor-pointer epilogue-regular text-left",
                                    active ? "border-[#427b77] bg-[#427b77]/8 text-[#427b77] font-semibold"
                                        : "border-gray-200 text-gray-400 hover:border-[#427b77]/40 hover:text-[#2d2d2d]",
                                ].join(" ")}>
                            {p.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

// ─── Section heading ──────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-2.5 epilogue-regular">{title}</p>
            {children}
        </div>
    );
}

// ─── Radio row ────────────────────────────────────────────────────────────────
function RadioRow({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
        <button onClick={onClick}
                className={["w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all duration-150 cursor-pointer epilogue-regular text-left",
                    active ? "bg-[#427b77]/8 text-[#427b77] font-semibold" : "text-gray-500 hover:bg-gray-50 hover:text-[#2d2d2d]",
                ].join(" ")}>
            <span className={["w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                active ? "border-[#427b77] bg-[#427b77]" : "border-gray-300"].join(" ")}>
                {active && <span className="w-1 h-1 rounded-full bg-white" />}
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
            <div className="w-64 shrink-0 self-start sticky top-24">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <SlidersHorizontal size={14} strokeWidth={2} className="text-[#427b77]" />
                            <span className="text-sm font-semibold text-[#2d2d2d] epilogue-regular">Filters</span>
                            {activeCount > 0 && (
                                <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full bg-[#427b77] text-white text-[10px] font-bold leading-none min-w-[18px]">
                                    {activeCount}
                                </span>
                            )}
                        </div>
                        {activeCount > 0 && (
                            <button onClick={() => setFilters(DEFAULT_FILTERS)}
                                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#427b77] transition-colors cursor-pointer epilogue-regular">
                                <RotateCcw size={11} strokeWidth={2} />
                                Reset
                            </button>
                        )}
                    </div>

                    {/* Body */}
                    <div className="px-5 py-5 space-y-5">

                        <Section title="Sort By">
                            <div className="space-y-0.5">
                                {SORT_OPTIONS.map((opt) => (
                                    <RadioRow key={opt.value} active={filters.sortBy === opt.value}
                                              onClick={() => setFilters((f) => ({ ...f, sortBy: opt.value as FilterState["sortBy"] }))}>
                                        {opt.label}
                                    </RadioRow>
                                ))}
                            </div>
                        </Section>

                        <div className="h-px bg-gray-100" />

                        <Section title="Category">
                            <div className="space-y-0.5">
                                {CATEGORIES.map((cat) => {
                                    const active = filters.categories.includes(cat.key);
                                    return (
                                        <button key={cat.key} onClick={() => toggleCategory(cat.key)}
                                                className={["w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all duration-150 cursor-pointer epilogue-regular text-left",
                                                    active ? "bg-[#427b77]/8 text-[#427b77] font-semibold" : "text-gray-500 hover:bg-gray-50 hover:text-[#2d2d2d]",
                                                ].join(" ")}>
                                            <span className={["w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 border-2 transition-all",
                                                active ? "border-[#427b77] bg-[#427b77]" : "border-gray-300"].join(" ")}>
                                                {active && (
                                                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                                                        <path d="M1.5 4L3.2 5.7L6.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                )}
                                            </span>
                                            <span className="text-base leading-none">{cat.icon}</span>
                                            <span>{cat.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </Section>

                        <div className="h-px bg-gray-100" />

                        <Section title="Price Range">
                            <PriceSlider
                                value={filters.priceRange}
                                onChange={(v) => setFilters((f) => ({ ...f, priceRange: v }))}
                            />
                        </Section>

                        <div className="h-px bg-gray-100" />

                        <Section title="Availability">
                            <div className="space-y-0.5">
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
                    <div className="px-5 pb-5">
                        <button className="w-full bg-[#2d2d2d] hover:bg-[#427b77] text-white rounded-xl py-3 text-sm font-semibold transition-colors duration-200 cursor-pointer epilogue-regular tracking-wide">
                            {activeCount > 0 ? `Apply Filters (${activeCount})` : "Apply Filters"}
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                .price-thumb::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 16px; height: 16px; border-radius: 50%;
                    background: white; border: 2px solid #427b77;
                    box-shadow: 0 1px 4px rgba(66,123,119,0.25); cursor: pointer;
                }
                .price-thumb::-webkit-slider-thumb:hover { box-shadow: 0 0 0 5px rgba(66,123,119,0.15); }
                .price-thumb::-moz-range-thumb {
                    width: 16px; height: 16px; border-radius: 50%;
                    background: white; border: 2px solid #427b77;
                    box-shadow: 0 1px 4px rgba(66,123,119,0.25); cursor: pointer;
                }
            `}</style>
        </>
    );
}