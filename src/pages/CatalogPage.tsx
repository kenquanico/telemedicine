import { useState, type ReactNode } from "react";
import { useApp } from "../hooks/useApp";
import { PRODUCTS, CATEGORY_META } from "../data/mockData";
import Footer from "../components/Footer";
import type { Category, CatalogFilters, Product } from "../types";

const PRICE_RANGES = [
    { label: "Under ₱50", min: 0, max: 50 },
    { label: "₱50 - ₱200", min: 50, max: 200 },
    { label: "₱200 - ₱500", min: 200, max: 500 },
    { label: "₱500+", min: 500, max: Infinity },
];

const BRANDS = [
    "Unilab",
    "Pfizer",
    "Sanofi",
    "Johnson & Johnson",
    "Nature's Bounty",
    "Mundipharma",
    "Watsons",
];

function getCategoryImage(category: Category) {
    return PRODUCTS.find((product) => product.category === category)?.image ?? "";
}

function CheckRow({
    active,
    onClick,
    children,
}: {
    active: boolean;
    onClick: () => void;
    children: ReactNode;
}) {
    return (
        <button
            onClick={onClick}
            className={`group flex w-full items-center gap-2.5 rounded-[10px] px-2.5 py-2 text-left text-[13px] transition-colors duration-150 epilogue-regular ${
                active
                    ? "bg-transparent font-bold text-[#427b77]"
                    : "bg-transparent font-medium text-gray-500 hover:text-[#2d2d2d]"
            }`}
        >
            <span
                className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[4px] border-2 transition-colors duration-150 ${
                    active ? "border-[#427b77] bg-transparent" : "border-gray-300 bg-transparent"
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

function FilterSection({ title, children }: { title: string; children: ReactNode }) {
    return (
        <div className="mb-6">
            <p className="mb-2.5 text-[10px] font-extrabold uppercase tracking-[0.1em] text-gray-400 epilogue-header">
                {title}
            </p>
            {children}
        </div>
    );
}

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
    const image = getCategoryImage(category);

    return (
        <button
            onClick={onClick}
            className="box-flex bds-u-focus-outline cuisine-tile br-base ma-xs group w-[128px] shrink-0 cursor-pointer text-left"
            data-testid={`cuisine-tile-${category}`}
        >
            <div
                className={`cuisine-tile__image common-tile-image relative mb-2 aspect-square overflow-hidden rounded-2xl border transition-all duration-200 ${
                    active
                        ? "border-[#427b77] bg-[#F7F9F9] shadow-[0_8px_20px_rgba(66,123,119,0.10)]"
                        : "border-[#EAEFEE] bg-[#F7F9F9] group-hover:border-[#427b77]"
                }`}
            >
                <div className="common-tile-image__overlay flex h-full w-full items-center justify-center p-5">
                    {image.startsWith("http") ? (
                        <img
                            alt=""
                            className="common-tile-image__logo h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                            src={image}
                        />
                    ) : (
                        <span className="text-4xl leading-none transition-transform duration-300 group-hover:scale-105" aria-hidden="true">
                            {meta.icon}
                        </span>
                    )}
                </div>
            </div>
            <span className="bds-u-focus-outline__focus-rings" />
            <h4
                className={`cuisine-tile__title mt-xs truncate text-center text-[13px] epilogue-header ${
                    active ? "font-extrabold text-[#427b77]" : "font-bold text-[#2d2d2d]"
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
    onAdd,
}: {
    product: Product;
    onView: () => void;
    onAdd: () => void;
}) {
    const [hearted, setHearted] = useState(false);
    const isOutOfStock = product.stockStatus === "out_of_stock";
    const stockLabel =
        product.stockStatus === "out_of_stock"
            ? "Out"
            : product.stockStatus === "low_stock"
                ? "Low"
                : "In stock";

    return (
        <div className="group cursor-pointer" onClick={onView}>
            <div className="relative mb-3 aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#F0F5F4]">
                {product.image.startsWith("http") ? (
                    <img
                        src={product.image}
                        alt={product.brandName}
                        className="h-full w-full select-none object-contain p-5 transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full select-none items-center justify-center text-5xl transition-transform duration-300 group-hover:scale-105">
                        {product.image}
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
                        setHearted((h) => !h);
                    }}
                    aria-label={hearted ? "Remove from favourites" : "Add to favourites"}
                    className="absolute bottom-2.5 right-[46px] flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-transform duration-150 hover:scale-110 active:scale-90"
                >
                    <svg width="15" height="15" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            fill={hearted ? "#e11d48" : "#9CA3AF"}
                            d="M12.6217 2.82875C14.6366 3.8152 15.5488 6.39602 14.6592 8.59316C13.5308 11.0256 11.4249 12.9696 8.3415 14.4254C8.15614 14.5107 7.94533 14.5229 7.75273 14.4618L7.65776 14.425C4.57478 12.9693 2.46912 11.0254 1.34078 8.59316C0.451161 6.39602 1.36338 3.8152 3.37828 2.82875C4.83682 2.11468 6.33306 2.64718 7.49473 3.62706C7.55809 3.68051 7.63615 3.75107 7.72889 3.83874L7.72892 3.83871C7.88199 3.98341 8.11731 3.98336 8.27032 3.8386C8.34183 3.77095 8.40276 3.71543 8.45314 3.67203C9.62526 2.66225 11.1429 2.10474 12.6217 2.82875ZM11.8696 4.45404C11.1697 4.11137 10.2881 4.36724 9.41854 5.19403L9.24485 5.36699L8.28326 6.36823C8.12801 6.52989 7.87475 6.53148 7.71758 6.37179L6.75338 5.36542C5.83294 4.40468 4.87775 4.08814 4.13039 4.45404C2.96994 5.02217 2.42026 6.5773 2.92018 7.81797C3.76446 9.63786 5.30414 11.1633 7.59598 12.391L7.82073 12.5071C7.93328 12.5652 8.06585 12.5655 8.17856 12.5077C8.30589 12.4425 8.40456 12.391 8.47457 12.353C10.6006 11.2014 12.0681 9.79624 12.9017 8.18989L13.0437 7.90114C13.5554 6.63747 13.0778 5.16307 12.024 4.53751L11.8696 4.45404Z"
                        />
                    </svg>
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onAdd();
                    }}
                    disabled={isOutOfStock}
                    aria-label={`Add ${product.brandName} to cart`}
                    className={`absolute bottom-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full text-xl leading-none shadow-sm transition-transform duration-150 active:scale-90 ${
                        isOutOfStock
                            ? "cursor-not-allowed bg-white/80 text-gray-300"
                            : "bg-white/90 text-[#2d2d2d] backdrop-blur-sm hover:scale-110"
                    }`}
                >
                    +
                </button>
            </div>

            <div className="px-0.5">
                <div className="mb-1 flex items-start justify-between gap-2">
                    <p className="min-w-0 flex-1 truncate text-[15px] font-bold leading-snug text-[#2d2d2d] epilogue-header">
                        {product.brandName}
                    </p>
                    <span className="shrink-0 text-[15px] font-extrabold text-[#2d2d2d] epilogue-header">
                        ₱{product.price.toLocaleString()}
                    </span>
                </div>

                <p className="mb-1.5 truncate text-[13px] text-gray-400 epilogue-regular">
                    {product.strength} · {product.dosageForm}
                </p>

                <div className="flex min-w-0 items-center gap-2">
                    <div className="flex items-center gap-1">
                        <svg width="11" height="11" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                fill="#f59e0b"
                                d="M7.88486 12.1954L4.88943 13.7787C4.64763 13.9065 4.34857 13.813 4.22145 13.5699C4.17083 13.4731 4.15336 13.3622 4.17175 13.2544L4.74383 9.90101C4.75759 9.82035 4.73099 9.73805 4.6727 9.68092L2.24935 7.30602C2.05373 7.11431 2.04973 6.79947 2.24041 6.6028C2.31634 6.52448 2.41583 6.47352 2.52348 6.45779L5.87247 5.96853C5.95302 5.95676 6.02265 5.9059 6.05868 5.83251L7.55639 2.78147C7.67729 2.53518 7.97388 2.43406 8.21885 2.55561C8.3164 2.60402 8.39535 2.6834 8.4435 2.78147L9.94121 5.83251C9.97723 5.9059 10.0469 5.95676 10.1274 5.96853L13.4764 6.45779C13.7467 6.49728 13.9341 6.74963 13.8948 7.02142C13.8791 7.12965 13.8284 7.22968 13.7505 7.30602L11.3272 9.68092C11.2689 9.73805 11.2423 9.82035 11.2561 9.90101L11.8281 13.2544C11.8743 13.5251 11.6935 13.7822 11.4242 13.8286C11.317 13.8471 11.2067 13.8296 11.1105 13.7787L8.11503 12.1954C8.04298 12.1573 7.95691 12.1573 7.88486 12.1954Z"
                            />
                        </svg>
                        <span className="text-[13px] font-semibold text-[#2d2d2d] epilogue-header">{product.rating}</span>
                        <span className="text-[13px] text-gray-400 epilogue-regular">({product.reviewCount}+)</span>
                    </div>
                    <span className="text-[12px] text-gray-300">•</span>
                    <span className="truncate text-[13px] text-gray-400 epilogue-regular">
                        {CATEGORY_META[product.category].label}
                    </span>
                    <span className="text-[12px] text-gray-300">•</span>
                    <span className="shrink-0 text-[13px] font-semibold text-[#427b77] epilogue-regular">
                        {product.packSize}
                    </span>
                </div>
            </div>
        </div>
    );
}

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

    const filtered = PRODUCTS.filter((p) => {
        if (activeTab !== "all" && p.category !== activeTab) return false;
        if (filters.categories.length > 0 && !filters.categories.includes(p.category)) return false;
        if (filters.brands.length > 0 && !filters.brands.some((b) => p.manufacturer.includes(b))) return false;
        if (filters.stockOnly && p.stockStatus === "out_of_stock") return false;
        if (filters.priceRanges.length > 0) {
            const inRange = filters.priceRanges.some((label) => {
                const range = PRICE_RANGES.find((x) => x.label === label);
                return range ? p.price >= range.min && p.price < range.max : false;
            });
            if (!inRange) return false;
        }
        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            return (
                p.brandName.toLowerCase().includes(query) ||
                p.genericName.toLowerCase().includes(query) ||
                p.manufacturer.toLowerCase().includes(query)
            );
        }
        return true;
    });

    const toggleArr = <T,>(arr: T[], val: T): T[] =>
        arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

    const resetFilters = () => {
        setFilters({ categories: [], priceRanges: [], brands: [], stockOnly: false, searchQuery: "" });
        setActiveTab("all");
    };

    const handleAdd = (productId: string) => {
        const product = PRODUCTS.find((p) => p.id === productId);
        if (!product) return;
        addToCart(product);
        showModal({
            type: "added",
            icon: "✅",
            title: "Added to Cart!",
            message: `${product.brandName} ${product.strength} has been added to your cart.`,
            actionLabel: "View Cart",
            onAction: () => navigateTo("cart"),
        });
    };

    const activeFilterCount =
        filters.categories.length +
        filters.priceRanges.length +
        filters.brands.length +
        (filters.stockOnly ? 1 : 0);

    return (
        <>
            <div className="flex items-start gap-7 px-16 relative">
                <main className="min-w-0 flex-1">


                    <section className="mt-14 mb-12">
                        <div className="mb-5 flex items-center justify-between">
                            <h2
                                id="medicine-categories-swimlane-title"
                                className="text-[28px] font-medium tracking-[-0.01em] text-[#2d2d2d] epilogue-regular"
                            >
                                Shop by Category
                            </h2>
                            {activeTab !== "all" && (
                                <button
                                    onClick={() => setActiveTab("all")}
                                    className="rounded-lg px-3 py-1.5 text-[13px] font-semibold text-[#427b77] transition-colors duration-150 hover:bg-[#F0F7F6] epilogue-regular"
                                >
                                    See all
                                </button>
                            )}
                        </div>

                        <div className="lane-component webrefresh" data-testid="refresh-swimlane">
                            <div className="lane-wrapper overflow-x-auto pb-1">
                                <ul
                                    data-testid="cuisine-lane"
                                    className="cuisine-lane flex gap-3"
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
                        <div>
                            <p className="mb-1 text-xs font-medium text-gray-400 epilogue-regular">
                                {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
                            </p>
                            <h2 className="text-[28px] font-medium tracking-[-0.01em] text-[#2d2d2d] epilogue-regular">
                                Shop Medicines
                            </h2>
                        </div>
                    </div>

                    {filtered.length === 0 ? (
                        <div className="mb-16 rounded-[20px] border border-[#EAEFEE] bg-white px-6 py-20 text-center">
                            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#F0F7F6] text-3xl">
                                🔍
                            </div>
                            <div className="mb-1.5 text-[17px] font-bold text-[#2d2d2d] epilogue-header">
                                No products found
                            </div>
                            <div className="text-[13px] text-gray-400 epilogue-regular">
                                Try adjusting your filters or search.
                            </div>
                        </div>
                    ) : (
                        <div className="mb-16 grid grid-cols-3 gap-x-5 gap-y-8">
                            {filtered.map((product) => (
                                <CatalogMedicineCard
                                    key={product.id}
                                    product={product}
                                    onView={() => navigateTo("product", product.id)}
                                    onAdd={() => handleAdd(product.id)}
                                />
                            ))}
                        </div>
                    )}
                </main>

                <aside
                    className="filter-scroll-wrap sticky top-[120px] mt-10 w-[260px] shrink-0 self-start"
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
                        <div className="overflow-hidden rounded-[20px] border border-[#EAEFEE] bg-white shadow-[0_2px_16px_rgba(45,45,45,0.05)]">
                            <div className="flex items-center justify-between border-b border-[#F4F6F5] px-5 py-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-[#2d2d2d] epilogue-header">Filters</span>
                                    {activeFilterCount > 0 && (
                                        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#427b77] px-1.5 text-[10px] font-extrabold text-white epilogue-header">
                                            {activeFilterCount}
                                        </span>
                                    )}
                                </div>
                                {(activeFilterCount > 0 || activeTab !== "all") && (
                                    <button
                                        onClick={resetFilters}
                                        className="rounded-lg px-2 py-1 text-[11px] font-semibold text-gray-400 transition-colors duration-150 hover:bg-[#F0F7F6] hover:text-[#427b77] epilogue-regular"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>

                            <div className="px-5 py-5">
                                <FilterSection title="Category">
                                    <div className="flex flex-col gap-0.5">
                                        {(Object.entries(CATEGORY_META) as [Category, { label: string; icon: string }][]).map(
                                            ([key, meta]) => (
                                                <CheckRow
                                                    key={key}
                                                    active={filters.categories.includes(key)}
                                                    onClick={() =>
                                                        setFilters((f) => ({ ...f, categories: toggleArr(f.categories, key) }))
                                                    }
                                                >
                                                    {meta.label}
                                                </CheckRow>
                                            )
                                        )}
                                    </div>
                                </FilterSection>

                                <FilterSection title="Price Range">
                                    <div className="flex flex-col gap-0.5">
                                        {PRICE_RANGES.map((range) => (
                                            <CheckRow
                                                key={range.label}
                                                active={filters.priceRanges.includes(range.label)}
                                                onClick={() =>
                                                    setFilters((f) => ({
                                                        ...f,
                                                        priceRanges: toggleArr(f.priceRanges, range.label),
                                                    }))
                                                }
                                            >
                                                {range.label}
                                            </CheckRow>
                                        ))}
                                    </div>
                                </FilterSection>

                                <FilterSection title="Brand">
                                    <div className="flex flex-col gap-0.5">
                                        {BRANDS.map((brand) => (
                                            <CheckRow
                                                key={brand}
                                                active={filters.brands.includes(brand)}
                                                onClick={() =>
                                                    setFilters((f) => ({ ...f, brands: toggleArr(f.brands, brand) }))
                                                }
                                            >
                                                {brand}
                                            </CheckRow>
                                        ))}
                                    </div>
                                </FilterSection>

                                <CheckRow
                                    active={filters.stockOnly}
                                    onClick={() => setFilters((f) => ({ ...f, stockOnly: !f.stockOnly }))}
                                >
                                    In Stock Only
                                </CheckRow>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            <Footer />
        </>
    );
}
