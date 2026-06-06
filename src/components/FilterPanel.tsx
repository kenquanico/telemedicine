import { useState } from "react";

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
    { key: "pain-relief", label: "Pain Relief" },
    { key: "antibiotics", label: "Antibiotics" },
    { key: "vitamins", label: "Vitamins" },
    { key: "heart-health", label: "Heart Health" },
    { key: "cold-flu", label: "Cold & Flu" },
    { key: "diabetes", label: "Diabetes" },
    { key: "skin-care", label: "Skin Care" },
    { key: "digestive", label: "Digestive" },
];

const SORT_OPTIONS = [
    { value: "relevance", label: "Relevance" },
    { value: "price-asc", label: "Price: Low-High" },
    { value: "price-desc", label: "Price: High-Low" },
    { value: "name", label: "Name A-Z" },
];

const AVAILABILITY_OPTIONS = [
    { value: "all", label: "All Items" },
    { value: "in-stock", label: "In Stock" },
    { value: "otc", label: "Over-the-Counter" },
    { value: "rx", label: "Prescription Only" },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="grid gap-3">
            <p className="text-[14px] text-[#262626]/70 epilogue-regular">
                {title}
            </p>
            {children}
        </section>
    );
}

function RadioRow({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
        <button
            onClick={onClick}
            className={`flex w-full items-center gap-2.5 rounded-[10px] px-1 py-1.5 text-left text-[15px] transition-colors duration-150 epilogue-regular ${
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

function CheckRow({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
        <button
            onClick={onClick}
            className={`flex w-full items-center gap-2.5 rounded-[10px] px-1 py-1.5 text-left text-[15px] transition-colors duration-150 epilogue-regular ${
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

export default function FilterPanel() {
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

    return (
        <>
            <div className="w-[252px] shrink-0 overflow-hidden rounded-[20px] border border-[#EAEFEE] bg-white shadow-[0_2px_16px_rgba(45,45,45,0.05)]">
                <div className="flex items-center justify-between border-b border-[#F4F6F5] px-5 py-4">
                    <div>
                        <p className="text-base font-bold text-[#2d2d2d] epilogue-regular">Filters</p></div>
                    {activeCount > 0 && (
                        <button
                            onClick={() => setFilters(DEFAULT_FILTERS)}
                            className="flex items-center gap-1 rounded-lg px-2 py-1 text-[14px] font-semibold text-[#262626]/50 transition-colors duration-150 hover:text-[#427b77] epilogue-regular"
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
                                    onClick={() => setFilters((f) => ({ ...f, sortBy: opt.value as FilterState["sortBy"] }))}
                                >
                                    {opt.label}
                                </RadioRow>
                            ))}
                        </div>
                    </Section>

                    <div className="h-px bg-[#F4F6F5]" />

                    <Section title="Category">
                        <div className="grid gap-0.5">
                            {CATEGORIES.map((cat) => (
                                <CheckRow
                                    key={cat.key}
                                    active={filters.categories.includes(cat.key)}
                                    onClick={() => toggleCategory(cat.key)}
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
                            onChange={(v) => setFilters((f) => ({ ...f, priceRange: v }))}
                        />
                    </Section>

                    <div className="h-px bg-[#F4F6F5]" />

                    <Section title="Availability">
                        <div className="grid gap-0.5">
                            {AVAILABILITY_OPTIONS.map((opt) => (
                                <RadioRow
                                    key={opt.value}
                                    active={filters.availability === opt.value}
                                    onClick={() =>
                                        setFilters((f) => ({
                                            ...f,
                                            availability: opt.value as FilterState["availability"],
                                        }))
                                    }
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
