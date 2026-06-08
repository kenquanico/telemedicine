import { useState } from "react";
import { useApp } from "../hooks/useApp";
import { PRODUCTS, CATEGORY_META } from "../data/mockData";
import { SectionHeader } from "../components/UI";
import Footer from "../components/Footer";
import FilterPanel from "../components/FilterPanel";
import type { Category, Product } from "../types";
import { applyProductFilters } from "../utils/productFilters";
import { getDefaultFilters } from "../utils/filterState";

function getCategoryImage(category: Category) {
    return PRODUCTS.find((product) => product.category === category)?.image ?? "";
}

function CategoryImageTile({
                               category,
                               onClick,
                           }: {
    category: Category;
    onClick: () => void;
}) {
    const meta = CATEGORY_META[category];
    const image = getCategoryImage(category);

    return (
        <button
            onClick={onClick}
            className="box-flex bds-u-focus-outline cuisine-tile br-base ma-xs group w-[128px] shrink-0 cursor-pointer text-left"
            data-testid={`home-cuisine-tile-${category}`}
        >
            <div className="cuisine-tile__image common-tile-image relative mb-2 aspect-square overflow-hidden rounded-2xl border border-[#EAEFEE] bg-[#F7F9F9] transition-colors duration-200 group-hover:border-[#427b77]">
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
                className="cuisine-tile__title mt-xs truncate text-center text-[13px] font-bold text-[#262626] epilogue-header"
                id={meta.label}
                data-testid={`home-cuisine-tile-${category}-title`}
                title={meta.label}
            >
                {meta.label}
            </h4>
        </button>
    );
}

// ── Medicine Card ────────────────────────────────────────────────────────────
function VendorMedicineCard({
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

    return (
        <div
            className="group cursor-pointer"
            onClick={onView}
        >
            {/* ── Image block ── */}
            <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl bg-[#F0F5F4] mb-3">
                {typeof product.image === "string" && product.image.startsWith("http") ? (
                    <img
                        src={product.image}
                        alt={product.brandName}
                        className="h-full w-full select-none object-contain p-5 transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl select-none transition-transform duration-300 group-hover:scale-105">
                        {product.image}
                    </div>
                )}

                {product.originalPrice && (
                    <div className="absolute top-2.5 left-2.5 bg-[#427b77] text-white text-[10px] font-bold px-2 py-0.5 rounded-lg epilogue-header tracking-wide">
                        Sale
                    </div>
                )}

                <button
                    onClick={(e) => { e.stopPropagation(); setHearted((h) => !h); }}
                    aria-label={hearted ? "Remove from favourites" : "Add to favourites"}
                    className="absolute bottom-2.5 right-[46px] w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center transition-transform duration-150 active:scale-90 hover:scale-110"
                >
                    <svg width="15" height="15" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                        <path
                            fillRule="evenodd" clipRule="evenodd"
                            fill={hearted ? "#e11d48" : "rgba(38,38,38,0.5)"}
                            d="M12.6217 2.82875C14.6366 3.8152 15.5488 6.39602 14.6592 8.59316C13.5308 11.0256 11.4249 12.9696 8.3415 14.4254C8.15614 14.5107 7.94533 14.5229 7.75273 14.4618L7.65776 14.425C4.57478 12.9693 2.46912 11.0254 1.34078 8.59316C0.451161 6.39602 1.36338 3.8152 3.37828 2.82875C4.83682 2.11468 6.33306 2.64718 7.49473 3.62706C7.55809 3.68051 7.63615 3.75107 7.72889 3.83874L7.72892 3.83871C7.88199 3.98341 8.11731 3.98336 8.27032 3.8386C8.34183 3.77095 8.40276 3.71543 8.45314 3.67203C9.62526 2.66225 11.1429 2.10474 12.6217 2.82875ZM11.8696 4.45404C11.1697 4.11137 10.2881 4.36724 9.41854 5.19403L9.24485 5.36699L8.28326 6.36823C8.12801 6.52989 7.87475 6.53148 7.71758 6.37179C7.71631 6.3705 7.71504 6.36919 7.71378 6.36787L6.75338 5.36542C5.83294 4.40468 4.87775 4.08814 4.13039 4.45404C2.96994 5.02217 2.42026 6.5773 2.92018 7.81797C3.76446 9.63786 5.30414 11.1633 7.59598 12.391L7.82073 12.5071C7.93328 12.5652 8.06585 12.5655 8.17856 12.5077C8.30589 12.4425 8.40456 12.391 8.47457 12.353C10.6006 11.2014 12.0681 9.79624 12.9017 8.18989L13.0437 7.90114C13.5554 6.63747 13.0778 5.16307 12.024 4.53751L11.8696 4.45404Z"
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
                            ? "cursor-not-allowed bg-white/80 text-[#262626]/40"
                            : "bg-white/90 text-[#262626] backdrop-blur-sm hover:scale-110"
                    }`}
                >
                    +
                </button>
            </div>

            {/* ── Text info ── */}
            <div className="px-0.5">
                <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-[15px] font-bold text-[#262626] epilogue-header leading-snug flex-1 min-w-0 truncate">
                        {product.brandName}
                    </p>
                    <span className="text-[15px] font-extrabold text-[#262626] epilogue-header shrink-0">
                        ₱{product.price?.toLocaleString()}
                    </span>
                </div>

                <p className="text-[13px] text-[#262626]/60 epilogue-regular mb-1.5 truncate">
                    {CATEGORY_META[product.category].label} · {product.strength}
                </p>

                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                        <svg width="11" height="11" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" fill="#f59e0b"
                                  d="M7.88486 12.1954L4.88943 13.7787C4.64763 13.9065 4.34857 13.813 4.22145 13.5699C4.17083 13.4731 4.15336 13.3622 4.17175 13.2544L4.74383 9.90101C4.75759 9.82035 4.73099 9.73805 4.6727 9.68092L2.24935 7.30602C2.05373 7.11431 2.04973 6.79947 2.24041 6.6028C2.31634 6.52448 2.41583 6.47352 2.52348 6.45779L5.87247 5.96853C5.95302 5.95676 6.02265 5.9059 6.05868 5.83251L7.55639 2.78147C7.67729 2.53518 7.97388 2.43406 8.21885 2.55561C8.3164 2.60402 8.39535 2.6834 8.4435 2.78147L9.94121 5.83251C9.97723 5.9059 10.0469 5.95676 10.1274 5.96853L13.4764 6.45779C13.7467 6.49728 13.9341 6.74963 13.8948 7.02142C13.8791 7.12965 13.8284 7.22968 13.7505 7.30602L11.3272 9.68092C11.2689 9.73805 11.2423 9.82035 11.2561 9.90101L11.8281 13.2544C11.8743 13.5251 11.6935 13.7822 11.4242 13.8286C11.317 13.8471 11.2067 13.8296 11.1105 13.7787L8.11503 12.1954C8.04298 12.1573 7.95691 12.1573 7.88486 12.1954Z"
                            />
                        </svg>
                        <span className="text-[13px] font-semibold text-[#262626] epilogue-header">{product.rating ?? "4.8"}</span>
                        <span className="text-[13px] text-[#262626]/60 epilogue-regular">
                            ({product.reviewCount}+)
                        </span>
                    </div>

                    <span className="text-[12px] text-[#262626]/40">•</span>

                    <span className="text-[13px] text-[#262626]/60 epilogue-regular">
                        {product.dosageForm}
                    </span>

                    <span className="text-[12px] text-[#262626]/40">•</span>

                    <span className="text-[13px] font-semibold text-[#427b77] epilogue-regular">
                        {product.packSize}
                    </span>
                </div>
            </div>
        </div>
    );
}

// ── HomePage ─────────────────────────────────────────────────────────────────
export default function HomePage() {
    const { navigateTo, addToCart, showModal } = useApp();
    const [filters, setFilters] = useState(getDefaultFilters);
    const filteredProducts = applyProductFilters(PRODUCTS, filters);
    const featuredProducts = filteredProducts.slice(0, 4);
    const bestSellerProducts = filteredProducts.slice(4);

    const handleAddToCart = (productId: string) => {
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

    return (
        <>
            {/* ── Outer wrapper: positions filter alongside content ── */}
            <div className="relative flex items-start gap-7 px-5 sm:px-8 lg:px-16">

                {/* ── Main content ── */}
                <div className="flex-1 min-w-0">

                    {/* ── Hero banner ── */}
                    <div className="relative my-10 flex min-h-[200px] flex-col justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a3a38] via-[#2d6b66] to-[#427b77] px-7 py-9 sm:px-10 lg:px-14 lg:py-[52px]">
                        <div className="absolute -right-15 -top-15 w-80 h-80 rounded-full bg-white/[0.04] pointer-events-none" />
                        <div className="absolute right-15 -bottom-20 w-[220px] h-[220px] rounded-full bg-white/[0.03] pointer-events-none" />
                        <p className="epilogue-header text-[11px] font-extrabold tracking-[0.14em] text-white/55 uppercase mb-3">
                            Same-Day Delivery · Cebu City
                        </p>
                        <h1 className="epilogue-regular text-[34px] font-extrabold text-white leading-tight mb-3.5 tracking-tight max-w-[480px]">
                            Authentic medicines,<br />delivered to your door.
                        </h1>
                        <p className="epilogue-regular text-sm text-white/65 leading-relaxed max-w-[380px] mb-7">
                            Order from FDA-registered pharmacies in Cebu City and get your medicines within hours.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => navigateTo("catalog")}
                                className="bg-white text-[#262626] border-none rounded-xl px-6 py-3 text-[13px] font-bold cursor-pointer epilogue-header tracking-[0.01em] transition-opacity duration-200 hover:opacity-90"
                            >
                                Shop Medicines
                            </button>
                            <button className="bg-white/[0.12] text-white border border-white/20 rounded-xl px-6 py-3 text-[13px] font-semibold cursor-pointer epilogue-regular backdrop-blur-sm transition-colors duration-200 hover:bg-white/[0.18]">
                                Learn More
                            </button>
                        </div>
                    </div>

                    {/* ── Trust bar ── */}
                    <div className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-3">
                        {[
                            { icon: "🚚", title: "Same-Day Delivery", sub: "Order before 3PM" },
                            { icon: "✅", title: "Authentic Medicines", sub: "FDA-registered sources" },
                            { icon: "💬", title: "Pharmacist Support", sub: "Chat anytime" },
                        ].map((f) => (
                            <div key={f.title} className="bg-white border border-[#EAEFEE] rounded-2xl px-[22px] py-5 flex items-center gap-3.5">
                                <div className="w-11 h-11 rounded-xl bg-[#F0F7F6] flex items-center justify-center text-xl shrink-0">
                                    {f.icon}
                                </div>
                                <div>
                                    <div className="text-[13px] font-bold text-[#262626] epilogue-header mb-0.5">{f.title}</div>
                                    <div className="text-xs text-[#262626]/60 epilogue-regular">{f.sub}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ── Categories ── */}
                    <div className="mb-12">
                        <SectionHeader title="Shop by Category" onSeeAll={() => navigateTo("catalog")} />
                        <div className="lane-component webrefresh mt-5" data-testid="home-refresh-swimlane">
                            <div className="lane-wrapper overflow-x-auto pb-1">
                                <ul
                                    data-testid="home-cuisine-lane"
                                    className="cuisine-lane flex gap-3"
                                    aria-label="Shop by medicine category"
                                >
                                    {(Object.keys(CATEGORY_META) as Category[]).map((category) => (
                                        <li key={category} className="shrink-0">
                                            <CategoryImageTile
                                                category={category}
                                                onClick={() => navigateTo("catalog")}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="mb-10 lg:hidden">
                        <FilterPanel filters={filters} onChange={setFilters} />
                    </div>

                    {/* ── Promo Banners ── */}
                    <div className="grid grid-cols-1 gap-[18px] mb-[52px]">
                        <div className="relative min-h-[150px] overflow-hidden rounded-[20px] bg-gradient-to-br from-[#1D546D] to-[#427b77] p-8">
                            <div className="absolute -right-7.5 -top-7.5 w-40 h-40 rounded-full bg-white/[0.06]" />
                            <p className="text-[10px] font-extrabold tracking-[0.12em] text-white/50 uppercase mb-2 epilogue-header">Limited Offer</p>
                            <h3 className="epilogue-header text-xl font-extrabold text-white mb-2 tracking-tight">Get 20% Off Vitamins</h3>
                            <p className="text-[13px] text-white/70 mb-[22px] epilogue-regular leading-relaxed">
                                Use code <strong className="text-white">HEALTH20</strong> at checkout
                            </p>
                            <button onClick={() => navigateTo("catalog")} className="bg-white text-[#1D546D] border-none rounded-[10px] px-5 py-2.5 text-xs font-bold cursor-pointer epilogue-header tracking-[0.02em]">
                                Shop Now
                            </button>
                        </div>
                        <div className="relative min-h-[150px] overflow-hidden rounded-[20px] bg-gradient-to-br from-[#1a2a30] to-[#2d2d2d] p-8">
                            <div className="absolute -right-5 -bottom-10 w-[180px] h-[180px] rounded-full bg-white/[0.04]" />
                            <p className="text-[10px] font-extrabold tracking-[0.12em] text-white/40 uppercase mb-2 epilogue-header">Free Shipping</p>
                            <h3 className="epilogue-header text-xl font-extrabold text-white mb-2 tracking-tight">Free Delivery ₱500+</h3>
                            <p className="text-[13px] text-white/60 mb-[22px] epilogue-regular leading-relaxed">
                                Available within Cebu City metro area
                            </p>
                            <button onClick={() => navigateTo("catalog")} className="bg-white/10 text-white border border-white/[0.15] rounded-[10px] px-5 py-2.5 text-xs font-bold cursor-pointer epilogue-header">
                                Order Now
                            </button>
                        </div>
                    </div>

                    {/* ── Featured Products ── */}
                    <div className="mb-[52px]">
                        <SectionHeader title="Featured Products" onSeeAll={() => navigateTo("catalog")} />
                        {featuredProducts.length === 0 ? (
                            <div className="mt-5 rounded-[20px] border border-[#EAEFEE] bg-white px-6 py-14 text-center">
                                <div className="mb-1.5 text-[17px] font-bold text-[#262626] epilogue-header">
                                    No medicines match these filters
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setFilters(getDefaultFilters())}
                                    className="mt-4 rounded-xl border border-[#DCE6E4] px-4 py-2 text-[12px] font-bold text-[#427b77] epilogue-header"
                                >
                                    Clear filters
                                </button>
                            </div>
                        ) : (
                        <div className="mt-5 grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
                            {featuredProducts.map((p) => (
                                <VendorMedicineCard
                                    key={p.id}
                                    product={p}
                                    onView={() => navigateTo("product", p.id)}
                                    onAdd={() => handleAddToCart(p.id)}
                                />
                            ))}
                        </div>
                        )}
                    </div>

                    {/* ── Best Sellers ── */}
                    {bestSellerProducts.length > 0 && (
                    <div className="mb-16">
                        <SectionHeader title="Best Sellers" onSeeAll={() => navigateTo("catalog")} />
                        <div className="mt-5 grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
                            {bestSellerProducts.map((p) => (
                                <VendorMedicineCard
                                    key={p.id}
                                    product={p}
                                    onView={() => navigateTo("product", p.id)}
                                    onAdd={() => handleAddToCart(p.id)}
                                />
                            ))}
                        </div>
                    </div>
                    )}

                </div>

                {/* ── Filter panel — sticky, scrollable, offset below navbar ── */}
                <div
                    className="filter-scroll-wrap sticky top-[120px] hidden w-[260px] shrink-0 self-start lg:block"
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
                    <div className="pt-10 pb-10">
                        <FilterPanel filters={filters} onChange={setFilters} />
                    </div>
                </div>

            </div>

            <Footer />
        </>
    );
}
