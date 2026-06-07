import type { ReactNode } from "react";
import { CATEGORY_META } from "../data/mockData";
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

const SORT_OPTIONS = [
    { value: "relevance", label: "Relevance" },
    { value: "price-asc", label: "Price: Low-High" },
    { value: "price-desc", label: "Price: High-Low" },
    { value: "name", label: "Name A-Z" },
] as const;

const AVAILABILITY_OPTIONS = [
    { value: "all", label: "All Items" },
    { value: "in-stock", label: "In Stock" },
    { value: "low-stock", label: "Low Stock" },
    { value: "out-of-stock", label: "Out of Stock" },
] as const;

const BRAND_OPTIONS = [
    "Unilab",
    "Pfizer",
    "Sanofi",
    "Johnson & Johnson",
    "Nature's Bounty",
    "Mundipharma",
    "Becton Dickinson",
] as const;

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

function Section({ title, children }: { title: string; children: ReactNode }) {
    return (
        <section className="grid gap-3">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-gray-400 epilogue-header">
                {title}
            </p>
            {children}
        </section>
    );
}

function RadioRow({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
    return (
        <button
            onClick={onClick}
            className={`flex min-h-8 w-full items-center gap-2.5 rounded-[10px] border border-transparent px-2 py-1.5 text-left text-[13px] transition-colors duration-150 epilogue-regular ${
                active ? "font-bold text-[#427b77]" : "font-medium text-[#262626]/80 hover:text-[#2d2d2d]"
            }`}
        >
            <span
                className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border-2 ${
                    active ? "border-[#427b77]" : "border-gray-300"
                }`}
            >
                {active && <span className="h-1.5 w-1.5 rounded-full bg-[#427b77]" />}
            </span>
            <span className="min-w-0 truncate">{children}</span>
        </button>
    );
}

function CheckRow({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
    return (
        <button
            onClick={onClick}
            className={`flex min-h-8 w-full items-center gap-2.5 rounded-[10px] border border-transparent px-2 py-1.5 text-left text-[13px] transition-colors duration-150 epilogue-regular ${
                active ? "font-bold text-[#427b77]" : "font-medium text-[#262626]/80 hover:text-[#2d2d2d]"
            }`}
        >
            <span
                className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[4px] border-2 ${
                    active ? "border-[#427b77]" : "border-gray-300"
                }`}
            >
                {active && (
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
                        <path
                            d="M1.5 4L3.2 5.7L6.5 2.5"
                            stroke="#427b77"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                )}
            </span>
            <span className="min-w-0 truncate">{children}</span>
        </button>
    );
}

function PriceSlider({ value, onChange }: { value: [number, number]; onChange: (v: [number, number]) => void }) {
    const min = 0;
    const max = 5000;
    const pct = (v: number) => ((v - min) / (max - min)) * 100;

    return (
        <div>
            <div className="mb-3 flex items-center justify-between">
                <span className="rounded-lg border border-[#EAEFEE] px-2.5 py-1 text-[12px] font-semibold text-[#2d2d2d] epilogue-regular">
                    ₱{value[0].toLocaleString()}
                </span>
                <span className="rounded-lg border border-[#EAEFEE] px-2.5 py-1 text-[12px] font-semibold text-[#2d2d2d] epilogue-regular">
                    ₱{value[1].toLocaleString()}
                </span>
            </div>
            <div className="relative flex h-6 items-center">
                <div className="absolute h-1 w-full rounded-full bg-[#EAEFEE]" />
                <div
                    className="absolute h-1 rounded-full bg-[#427b77]"
                    style={{ left: `${pct(value[0])}%`, width: `${pct(value[1]) - pct(value[0])}%` }}
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={50}
                    value={value[0]}
                    onChange={(e) => {
                        const next = Number(e.target.value);
                        if (next < value[1]) onChange([next, value[1]]);
                    }}
                    className="price-thumb absolute w-full cursor-pointer appearance-none bg-transparent"
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={50}
                    value={value[1]}
                    onChange={(e) => {
                        const next = Number(e.target.value);
                        if (next > value[0]) onChange([value[0], next]);
                    }}
                    className="price-thumb absolute w-full cursor-pointer appearance-none bg-transparent"
                />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
                {[
                    { label: "Under ₱100", range: [0, 100] as [number, number] },
                    { label: "₱100-₱500", range: [100, 500] as [number, number] },
                    { label: "₱500-₱1,000", range: [500, 1000] as [number, number] },
                    { label: "Over ₱1,000", range: [1000, 5000] as [number, number] },
                ].map((preset) => {
                    const active = value[0] === preset.range[0] && value[1] === preset.range[1];
                    return (
                        <button
                            key={preset.label}
                            onClick={() => onChange(preset.range)}
                            className={`rounded-lg border px-2 py-1.5 text-left text-[11px] transition-colors duration-150 epilogue-regular ${
                                active
                                    ? "border-[#427b77] font-bold text-[#427b77]"
                                    : "border-[#EAEFEE] text-gray-400 hover:border-[#C9D8D6] hover:text-[#2d2d2d]"
                            }`}
                        >
                            {preset.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default function FilterPanel({
    filters,
    onChange,
}: {
    filters: FilterState;
    onChange: (filters: FilterState) => void;
}) {
    const activeCount = getActiveFilterCount(filters);

    const updateFilters = (next: Partial<FilterState>) => onChange({ ...filters, ...next });
    const toggleCategory = (key: Category) =>
        updateFilters({
            categories: filters.categories.includes(key)
                ? filters.categories.filter((c) => c !== key)
                : [...filters.categories, key],
        });
    const toggleBrand = (brand: string) =>
        updateFilters({
            brands: filters.brands.includes(brand)
                ? filters.brands.filter((b) => b !== brand)
                : [...filters.brands, brand],
        });

    return (
        <>
            <div className="w-[252px] shrink-0 overflow-hidden rounded-[20px] border border-[#EAEFEE] bg-white shadow-[0_2px_16px_rgba(45,45,45,0.05)]">
                <div className="flex items-center justify-between border-b border-[#F4F6F5] px-5 py-4">
                    <div>
                        <p className="text-sm font-bold text-[#2d2d2d] epilogue-header">Filters</p>
                        <p className="mt-0.5 text-[11px] text-gray-400 epilogue-regular">
                            {activeCount > 0 ? `${activeCount} active` : "Refine results"}
                        </p>
                    </div>
                    {activeCount > 0 && (
                        <button
                            onClick={() => onChange(getDefaultFilters())}
                            className="flex items-center gap-1 rounded-lg px-2 py-1 text-[12px] font-semibold text-[#262626]/50 transition-colors duration-150 hover:text-[#427b77] epilogue-regular"
                        >
                            Clear
                        </button>
                    )}
                </div>

                <div className="grid gap-5 px-5 py-5">
                    <Section title="Sort By">
                        <div className="grid gap-0.5">
                            {SORT_OPTIONS.map((opt) => (
                                <RadioRow
                                    key={opt.value}
                                    active={filters.sortBy === opt.value}
                                    onClick={() => updateFilters({ sortBy: opt.value })}
                                >
                                    {opt.label}
                                </RadioRow>
                            ))}
                        </div>
                    </Section>

                    <div className="h-px bg-[#F4F6F5]" />

                    <Section title="Category">
                        <div className="grid gap-0.5">
                            {(Object.entries(CATEGORY_META) as [Category, { label: string }][]).map(([key, cat]) => (
                                <CheckRow
                                    key={key}
                                    active={filters.categories.includes(key)}
                                    onClick={() => toggleCategory(key)}
                                >
                                    {cat.label}
                                </CheckRow>
                            ))}
                        </div>
                    </Section>

                    <div className="h-px bg-[#F4F6F5]" />

                    <Section title="Price Range">
                        <PriceSlider
                            value={filters.priceRange}
                            onChange={(priceRange) => updateFilters({ priceRange })}
                        />
                    </Section>

                    <div className="h-px bg-[#F4F6F5]" />

                    <Section title="Brand">
                        <div className="grid gap-0.5">
                            {BRAND_OPTIONS.map((brand) => (
                                <CheckRow
                                    key={brand}
                                    active={filters.brands.includes(brand)}
                                    onClick={() => toggleBrand(brand)}
                                >
                                    {brand}
                                </CheckRow>
                            ))}
                        </div>
                    </Section>

                    <div className="h-px bg-[#F4F6F5]" />

                    <Section title="Availability">
                        <div className="grid gap-0.5">
                            {AVAILABILITY_OPTIONS.map((opt) => (
                                <RadioRow
                                    key={opt.value}
                                    active={filters.availability === opt.value}
                                    onClick={() => updateFilters({ availability: opt.value })}
                                >
                                    {opt.label}
                                </RadioRow>
                            ))}
                        </div>
                    </Section>
                </div>
            </div>

            <style>{`
                .price-thumb { -webkit-appearance: none; }
                .price-thumb::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background: #fff;
                    border: 2.5px solid #427b77;
                    box-shadow: 0 2px 8px rgba(66,123,119,0.25);
                    cursor: pointer;
                }
                .price-thumb::-moz-range-thumb {
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background: #fff;
                    border: 2.5px solid #427b77;
                    box-shadow: 0 2px 8px rgba(66,123,119,0.25);
                    cursor: pointer;
                }
            `}</style>
        </>
    );
}
