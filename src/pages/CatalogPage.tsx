import { useState } from "react";
import { useApp } from "../hooks/useApp";
import { PRODUCTS, CATEGORY_META } from "../data/mockData";
import Footer from "../components/Footer";
import FilterPanel from "../components/FilterPanel";
import DiscountTag from "../components/DiscountTag";
import type { Category, Product } from "../types";
import { applyProductFilters } from "../utils/productFilters";
import { getActiveFilterCount, getDefaultFilters } from "../utils/filterState";
import { Heart, Search, Star } from "lucide-react";

const CATEGORY_ICON_SRC: Record<Category, string> = {
    pain_relief: "/SVG/Pain%20Relief.svg",
    vitamins: "/SVG/Vitamins.svg",
    antibiotics: "/SVG/Antibiotics.svg",
    cough_cold: "/SVG/Artboard%2011.svg",
    antacids_gi: "/SVG/Antacids%20%26%20Gi.svg",
    dermatology: "/SVG/Dermatology.svg",
    diabetes_care: "/SVG/Diabetes%20%26%20Care.svg",
    heart_bp: "/SVG/Heart%20%26%20BP.svg",
    eye_ear: "/SVG/Eye%20and%20Ear.svg",
    first_aid: "/SVG/First%20Aid.svg",
    baby_child: "/SVG/Baby%20%26%20Child.svg",
    feminine_care: "/SVG/Feminine%20Care.svg",
    personal_care: "/SVG/Personal%20Care.svg",
};

function CategoryCuisineTile({
    category,
    active,
    onClick,
}: {
    category: Category;
    active: boolean;
    onClick: () => void;
}) {
    const meta = CATEGORY_META[category];
    const iconSrc = CATEGORY_ICON_SRC[category];
    const [imageFailed, setImageFailed] = useState(false);

    return (
        <button
            onClick={onClick}
            className="box-flex bds-u-focus-outline cuisine-tile br-base ma-xs group w-[108px] shrink-0 cursor-pointer text-left"
            data-testid={`cuisine-tile-${category}`}
        >
            <div
                className={`cuisine-tile__image common-tile-image relative mb-2 aspect-square overflow-hidden rounded-xl border transition-all duration-200 ${
                    active
                        ? "border-[#427b77] bg-[#F7F9F9]"
                        : "border-[#EAEFEE] bg-[#F7F9F9] group-hover:border-[#427b77]"
                }`}
            >
                <div className="common-tile-image__overlay flex h-full w-full items-center justify-center p-1.5">
                    {imageFailed ? (
                        <span className="text-4xl leading-none" aria-hidden="true">{meta.icon}</span>
                    ) : (
                        <img
                            alt=""
                            className="common-tile-image__logo h-full w-full scale-[1.28] object-contain transition-transform duration-300 group-hover:scale-[1.34]"
                            src={iconSrc}
                            onError={() => setImageFailed(true)}
                        />
                    )}
                </div>
            </div>
            <span className="bds-u-focus-outline__focus-rings" />
            <h4
                className={`cuisine-tile__title mt-xs truncate text-center text-[13px] epilogue-header ${
                    active ? "font-extrabold text-[#427b77]" : "font-bold text-[#262626]"
                }`}
                id={meta.label}
                data-testid={`cuisine-tile-${category}-title`}
                title={meta.label}
            >
                {meta.label}
            </h4>
        </button>
    );
}

function CatalogMedicineCard({
    product,
    onView,
    isFavorite,
    onToggleFavorite,
}: {
    product: Product;
    onView: () => void;
    isFavorite: boolean;
    onToggleFavorite: () => void;
}) {
    const [imageFailed, setImageFailed] = useState(false);
    const isOutOfStock = product.stockStatus === "out_of_stock";
    const hasImagePath = product.image.startsWith("http") || product.image.startsWith("/") || product.image.startsWith("data:");
    const stockLabel =
        product.stockStatus === "out_of_stock"
            ? "Out"
            : product.stockStatus === "low_stock"
                ? "Low"
                : "In stock";

    return (
        <div className="group cursor-pointer" onClick={onView}>
            <div className="relative mb-3 aspect-[4/3] w-full overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-white">
                {hasImagePath && !imageFailed ? (
                    <img
                        src={product.image}
                        alt={product.brandName}
                        className="h-full w-full scale-[1.22] select-none object-contain transition-transform duration-300 group-hover:scale-[1.28]"
                        onError={() => setImageFailed(true)}
                    />
                ) : (
                    <div className="flex h-full w-full select-none items-center justify-center px-4 text-center text-sm font-bold text-[#262626]/70 transition-transform duration-300 group-hover:scale-105 epilogue-header">
                        {imageFailed ? product.brandName : product.image}
                    </div>
                )}

                <div
                    className={`absolute left-2.5 top-2.5 rounded-lg px-2 py-0.5 text-[10px] font-bold tracking-wide text-white epilogue-header ${
                        isOutOfStock ? "bg-[#2d2d2d]/60" : "bg-[#427b77]"
                    }`}
                >
                    {stockLabel}
                </div>

                {product.originalPrice && (
                    <div className="absolute right-2.5 top-2.5 rounded-lg bg-black/40 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm epilogue-regular">
                        Sale
                    </div>
                )}

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite();
                    }}
                    aria-label={isFavorite ? "Remove from favourites" : "Add to favourites"}
                    className="absolute bottom-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full border border-[#E5E7EB] bg-white/90 backdrop-blur-sm transition-transform duration-150 hover:scale-110 active:scale-90"
                >
                    <Heart size={15} strokeWidth={2} fill={isFavorite ? "#e11d48" : "none"} className={isFavorite ? "text-[#e11d48]" : "text-[#262626]/50"} />
                </button>
            </div>

            <div className="px-0.5">
                <div className="mb-1 flex items-start justify-between gap-2">
                    <p className="min-w-0 flex-1 truncate text-[15px] font-bold leading-snug text-[#262626] epilogue-header">
                        {product.brandName}
                    </p>
                    <span className="shrink-0 text-[15px] font-extrabold text-[#262626] epilogue-header">
                        ₱{product.price.toLocaleString()}
                    </span>
                </div>

                <p className="mb-1.5 truncate text-[13px] text-[#262626]/60 epilogue-regular">
                    {product.strength} · {product.dosageForm}
                </p>

                <div className="flex min-w-0 items-center gap-2">
                    <div className="flex items-center gap-1">
                        <Star size={11} fill="#f59e0b" strokeWidth={0} />
                        <span className="text-[13px] font-semibold text-[#262626] epilogue-header">{product.rating}</span>
                        <span className="text-[13px] text-[#262626]/60 epilogue-regular">({product.reviewCount}+)</span>
                    </div>
                    <span className="text-[12px] text-[#262626]/40">•</span>
                    <span className="truncate text-[13px] text-[#262626]/60 epilogue-regular">
                        {CATEGORY_META[product.category].label}
                    </span>
                    <span className="text-[12px] text-[#262626]/40">•</span>
                    <span className="shrink-0 text-[13px] font-semibold text-[#427b77] epilogue-regular">
                        {product.packSize}
                    </span>
                </div>

                <DiscountTag />
            </div>
        </div>
    );
}

export default function CatalogPage() {
    const { navigateTo, favoriteIds, toggleFavorite } = useApp();

    const [filters, setFilters] = useState(getDefaultFilters);

    const [activeTab, setActiveTab] = useState<Category | "all">("all");

    const filtered = applyProductFilters(
        activeTab === "all" ? PRODUCTS : PRODUCTS.filter((product) => product.category === activeTab),
        filters
    );

    const resetFilters = () => {
        setFilters(getDefaultFilters());
        setActiveTab("all");
    };

    const activeFilterCount = getActiveFilterCount(filters);

    return (
        <>
            <div className="relative flex items-start gap-7 px-5 sm:px-8 lg:px-16">
                <main className="min-w-0 flex-1">


                    <section className="mb-12 mt-10 sm:mt-14">
                        <div className="mb-5 flex items-center justify-between">
                            <h2
                                id="medicine-categories-swimlane-title"
                                className="text-[28px] font-medium tracking-[-0.01em] text-[#262626] epilogue-regular"
                            >
                                Shop by Category
                            </h2>
                        </div>

                        <div className="lane-component webrefresh" data-testid="refresh-swimlane">
                            <div className="lane-wrapper scrollbar-none overflow-x-auto pb-1">
                                <ul
                                    data-testid="cuisine-lane"
                                    className="cuisine-lane flex gap-5 pr-8"
                                    aria-labelledby="medicine-categories-swimlane-title"
                                >
                                    {(Object.keys(CATEGORY_META) as Category[]).map((category) => (
                                        <li key={category} className="shrink-0">
                                            <CategoryCuisineTile
                                                category={category}
                                                active={activeTab === category}
                                                onClick={() => setActiveTab(category)}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </section>

                    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                        <div className="min-w-0">
                            <p className="mb-1 text-xs font-medium text-[#262626]/60 epilogue-regular">
                                {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
                            </p>
                            <h2 className="text-[28px] font-medium tracking-[-0.01em] text-[#262626] epilogue-regular">
                                Shop Medicines
                            </h2>
                        </div>
                    </div>

                    {filtered.length === 0 ? (
                        <div className="mb-16 rounded-[20px] border border-[#EAEFEE] bg-white px-6 py-20 text-center">
                            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[14px] bg-[#F0F7F6] text-[#427b77]">
                                <Search size={30} strokeWidth={1.8} />
                            </div>
                            <div className="mb-1.5 text-[17px] font-bold text-[#262626] epilogue-header">
                                No products found
                            </div>
                            <div className="text-[13px] text-[#262626]/60 epilogue-regular">
                                Try adjusting your filters or search.
                            </div>
                        </div>
                    ) : (
                        <div className="mb-16 grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
                            {filtered.map((product) => (
                                <CatalogMedicineCard
                                    key={product.id}
                                    product={product}
                                    onView={() => navigateTo("product", product.id)}
                                    isFavorite={favoriteIds.includes(product.id)}
                                    onToggleFavorite={() => toggleFavorite(product.id)}
                                />
                            ))}
                        </div>
                    )}
                </main>

                <aside
                    className="filter-scroll-wrap sticky top-[120px] mt-10 hidden w-[260px] shrink-0 self-start lg:block"
                    style={{
                        height: "calc(100vh - 120px)",
                        overflowY: "auto",
                        overflowX: "hidden",
                        scrollbarWidth: "none",
                    }}
                >
                    <style>{`
                        .filter-scroll-wrap::-webkit-scrollbar { display: none; }
                    `}</style>
                    <div className="pb-10">
                        <FilterPanel filters={filters} onChange={setFilters} />
                        {(activeFilterCount > 0 || activeTab !== "all") && (
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="mt-3 w-full rounded-xl border border-[#EAEFEE] bg-white px-4 py-3 text-[12px] font-bold text-[#427b77] transition-colors duration-150 hover:border-[#BFD4D1] epilogue-header"
                            >
                                Reset catalog view
                            </button>
                        )}
                    </div>
                </aside>
            </div>

            <Footer />
        </>
    );
}
