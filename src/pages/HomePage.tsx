import { useState } from "react";
import { useApp } from "../hooks/useApp";
import { PRODUCTS, CATEGORY_META } from "../data/mockData";
import { CategoryCard, SectionHeader } from "../components/UI";
import Footer from "../components/Footer";
import FilterPanel from "../components/FilterPanel";

// ── Vendor-style Medicine Card (FoodPanda-inspired) ─────────────────────────
function VendorMedicineCard({
                                product,
                                onView,
                                onAdd,
                            }: {
    product: any;
    onView: () => void;
    onAdd: () => void;
}) {
    const [hearted, setHearted] = useState(false);

    return (
        <div
            className="bg-white rounded-2xl overflow-hidden border border-[#EAEFEE] cursor-pointer group transition-shadow duration-200 hover:shadow-[0_4px_20px_rgba(0,0,0,0.10)]"
            onClick={onView}
        >
            {/* ── Image wrapper ── */}
            <div className="relative w-full aspect-[16/9] overflow-hidden bg-[#F4F7F6]">
                {/* Product image / placeholder */}
                <div className="w-full h-full flex items-center justify-center text-5xl select-none transition-transform duration-300 group-hover:scale-105">
                    {product.image}
                </div>

                {/* Ad tag — top right */}
                {product.sponsored && (
                    <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-sm epilogue-regular">
                        Ad
                    </div>
                )}

                {/* Heart / favourite button — bottom right */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setHearted((h) => !h);
                    }}
                    aria-label={hearted ? "Remove from favourites" : "Add to favourites"}
                    className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center transition-transform duration-150 active:scale-90 hover:scale-105"
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            fill={hearted ? "#e11d48" : "#9CA3AF"}
                            d="M12.6217 2.82875C14.6366 3.8152 15.5488 6.39602 14.6592 8.59316C13.5308 11.0256 11.4249 12.9696 8.3415 14.4254C8.15614 14.5107 7.94533 14.5229 7.75273 14.4618L7.65776 14.425C4.57478 12.9693 2.46912 11.0254 1.34078 8.59316C0.451161 6.39602 1.36338 3.8152 3.37828 2.82875C4.83682 2.11468 6.33306 2.64718 7.49473 3.62706C7.55809 3.68051 7.63615 3.75107 7.72889 3.83874L7.72892 3.83871C7.88199 3.98341 8.11731 3.98336 8.27032 3.8386C8.34183 3.77095 8.40276 3.71543 8.45314 3.67203C9.62526 2.66225 11.1429 2.10474 12.6217 2.82875ZM11.8696 4.45404C11.1697 4.11137 10.2881 4.36724 9.41854 5.19403L9.24485 5.36699L8.28326 6.36823C8.12801 6.52989 7.87475 6.53148 7.71758 6.37179C7.71631 6.3705 7.71504 6.36919 7.71378 6.36787L6.75338 5.36542C5.83294 4.40468 4.87775 4.08814 4.13039 4.45404C2.96994 5.02217 2.42026 6.5773 2.92018 7.81797C3.76446 9.63786 5.30414 11.1633 7.59598 12.391L7.82073 12.5071C7.93328 12.5652 8.06585 12.5655 8.17856 12.5077C8.30589 12.4425 8.40456 12.391 8.47457 12.353C10.6006 11.2014 12.0681 9.79624 12.9017 8.18989L13.0437 7.90114C13.5554 6.63747 13.0778 5.16307 12.024 4.53751L11.8696 4.45404Z"
                        />
                    </svg>
                </button>

                {/* Discount / deal badge — top left */}
                {product.discount && (
                    <div className="absolute top-2 left-2 bg-[#427b77] text-white text-[10px] font-bold px-2 py-0.5 rounded-md epilogue-header">
                        {product.discount}
                    </div>
                )}
            </div>

            {/* ── Info section ── */}
            <div className="px-3.5 pt-3 pb-3.5 flex flex-col gap-1.5">

                {/* Name + Rating row */}
                <div className="flex items-center justify-between gap-2">
                    <p className="text-[13px] font-bold text-[#2d2d2d] epilogue-header leading-tight truncate">
                        {product.brandName}
                    </p>
                    <div className="flex items-center gap-1 shrink-0">
                        {/* Star icon */}
                        <svg width="13" height="13" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                fill="#f59e0b"
                                d="M7.88486 12.1954L4.88943 13.7787C4.64763 13.9065 4.34857 13.813 4.22145 13.5699C4.17083 13.4731 4.15336 13.3622 4.17175 13.2544L4.74383 9.90101C4.75759 9.82035 4.73099 9.73805 4.6727 9.68092L2.24935 7.30602C2.05373 7.11431 2.04973 6.79947 2.24041 6.6028C2.31634 6.52448 2.41583 6.47352 2.52348 6.45779L5.87247 5.96853C5.95302 5.95676 6.02265 5.9059 6.05868 5.83251L7.55639 2.78147C7.67729 2.53518 7.97388 2.43406 8.21885 2.55561C8.3164 2.60402 8.39535 2.6834 8.4435 2.78147L9.94121 5.83251C9.97723 5.9059 10.0469 5.95676 10.1274 5.96853L13.4764 6.45779C13.7467 6.49728 13.9341 6.74963 13.8948 7.02142C13.8791 7.12965 13.8284 7.22968 13.7505 7.30602L11.3272 9.68092C11.2689 9.73805 11.2423 9.82035 11.2561 9.90101L11.8281 13.2544C11.8743 13.5251 11.6935 13.7822 11.4242 13.8286C11.317 13.8471 11.2067 13.8296 11.1105 13.7787L8.11503 12.1954C8.04298 12.1573 7.95691 12.1573 7.88486 12.1954Z"
                            />
                        </svg>
                        <span className="text-[12px] font-bold text-[#2d2d2d] epilogue-header">{product.rating ?? "4.8"}</span>
                        <span className="text-[11px] text-gray-400 epilogue-regular">({Array.isArray(product.reviews) ? `${product.reviews.length}+` : (product.reviews ?? "200+")})</span>
                    </div>
                </div>

                {/* Meta row: delivery time • price range • category */}
                <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] text-gray-500 epilogue-regular">From {product.deliveryTime ?? "15"} min</span>
                    <span className="text-[10px] text-gray-300">•</span>
                    <span className="text-[11px] text-gray-500 epilogue-regular">₱₱</span>
                    <span className="text-[10px] text-gray-300">•</span>
                    <span className="text-[11px] text-gray-500 epilogue-regular">{product.category ?? "Medicine"}</span>
                </div>

                {/* Delivery fee row */}
                <div className="flex items-center gap-1.5">
                    {/* Rider icon */}
                    <svg aria-hidden="true" width="13" height="13" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" className="text-gray-400 shrink-0">
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            fill="currentColor"
                            d="M9.23752 3.28752C9.23752 3.95027 8.70027 4.48752 8.03752 4.48752C7.37478 4.48752 6.83752 3.95027 6.83752 3.28752C6.83752 2.62478 7.37478 2.08752 8.03752 2.08752C8.70027 2.08752 9.23752 2.62478 9.23752 3.28752ZM6.14386 9.14592C6.00445 8.96508 5.94904 8.72306 6.01506 8.48618L6.86505 5.43618C6.97625 5.03718 7.38985 4.80386 7.78886 4.91506C7.91357 4.94981 8.02209 5.01411 8.10897 5.09826L9.67246 6.11242L11.5377 6.11242C11.8829 6.11242 12.1627 6.39224 12.1627 6.73742C12.1627 7.0826 11.8829 7.36242 11.5377 7.36242H9.48751C9.3668 7.36242 9.24867 7.32746 9.14739 7.26177L8.10235 6.58391L7.63531 8.2598L9.66925 8.36322C9.87995 8.37393 10.071 8.49022 10.1773 8.67244C10.2837 8.85467 10.2909 9.07823 10.1965 9.26693L10.0965 9.46693L10.0947 9.47057L8.54468 12.5206C8.38829 12.8283 8.01206 12.951 7.70434 12.7946C7.39662 12.6382 7.27394 12.262 7.43032 11.9543L8.64567 9.56279L6.65576 9.46161C6.43443 9.45035 6.24586 9.32527 6.14386 9.14592ZM2.53752 4.68752C1.87478 4.68752 1.33752 5.22478 1.33752 5.88752V7.48752C1.33752 8.15027 1.87478 8.68752 2.53752 8.68752H4.13752C4.80027 8.68752 5.33752 8.15027 5.33752 7.48752V5.88752C5.33752 5.22478 4.80027 4.68752 4.13752 4.68752H2.53752ZM4.33752 10.5125C3.74382 10.5125 3.26252 10.9938 3.26252 11.5875C3.26252 12.1812 3.74382 12.6625 4.33752 12.6625C4.93123 12.6625 5.41252 12.1812 5.41252 11.5875C5.41252 10.9938 4.93123 10.5125 4.33752 10.5125ZM2.01252 11.5875C2.01252 10.3035 3.05346 9.26252 4.33752 9.26252C5.62159 9.26252 6.66252 10.3035 6.66252 11.5875C6.66252 12.8716 5.62159 13.9125 4.33752 13.9125C3.05346 13.9125 2.01252 12.8716 2.01252 11.5875ZM11.2625 11.5875C11.2625 10.9938 11.7438 10.5125 12.3375 10.5125C12.9312 10.5125 13.4125 10.9938 13.4125 11.5875C13.4125 12.1812 12.9312 12.6625 12.3375 12.6625C11.7438 12.6625 11.2625 12.1812 11.2625 11.5875ZM12.3375 9.26252C11.0535 9.26252 10.0125 10.3035 10.0125 11.5875C10.0125 12.8716 11.0535 13.9125 12.3375 13.9125C13.6216 13.9125 14.6625 12.8716 14.6625 11.5875C14.6625 10.3035 13.6216 9.26252 12.3375 9.26252Z"
                        />
                    </svg>
                    {product.originalDeliveryFee && (
                        <span className="text-[11px] text-gray-400 line-through epilogue-regular">
                            ₱{product.originalDeliveryFee}
                        </span>
                    )}
                    <span className="text-[11px] font-semibold text-[#427b77] epilogue-regular">
                        {product.deliveryFee ?? "Free for first order"}
                    </span>
                </div>

                {/* Add to cart button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onAdd();
                    }}
                    className="mt-1 w-full bg-[#427b77] hover:bg-[#2d6b66] text-white text-[12px] font-bold py-2 rounded-xl transition-colors duration-200 cursor-pointer epilogue-header"
                >
                    Add to Cart — ₱{product.price?.toLocaleString()}
                </button>
            </div>
        </div>
    );
}

// ── HomePage ─────────────────────────────────────────────────────────────────
export default function HomePage() {
    const { navigateTo, addToCart, showModal, filterOpen } = useApp();

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

    // Grid cols: 4 normal / 3 with filter open
    const productGridCols = filterOpen ? "grid-cols-3" : "grid-cols-4";

    return (
        <>
            <div className="flex items-start gap-7 px-16">

                {/* ── Main content ── */}
                <div className="flex-1 min-w-0">

                    {/* ── Hero banner ── */}
                    <div className="my-10 rounded-3xl overflow-hidden bg-gradient-to-br from-[#1a3a38] via-[#2d6b66] to-[#427b77] px-14 py-[52px] relative min-h-[200px] flex flex-col justify-center">
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
                        <div className="flex gap-3">
                            <button
                                onClick={() => navigateTo("catalog")}
                                className="bg-white text-[#2d2d2d] border-none rounded-xl px-6 py-3 text-[13px] font-bold cursor-pointer epilogue-header tracking-[0.01em] transition-opacity duration-200 hover:opacity-90"
                            >
                                Shop Medicines
                            </button>
                            <button className="bg-white/[0.12] text-white border border-white/20 rounded-xl px-6 py-3 text-[13px] font-semibold cursor-pointer epilogue-regular backdrop-blur-sm transition-colors duration-200 hover:bg-white/[0.18]">
                                Learn More
                            </button>
                        </div>
                    </div>

                    {/* ── Trust bar ── */}
                    <div className="grid grid-cols-3 gap-4 mb-12">
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
                                    <div className="text-[13px] font-bold text-[#2d2d2d] epilogue-header mb-0.5">{f.title}</div>
                                    <div className="text-xs text-gray-400 epilogue-regular">{f.sub}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ── Categories ── */}
                    <div className="mb-12">
                        <SectionHeader title="Shop by Category" onSeeAll={() => navigateTo("catalog")} />
                        <div className={`mt-5 grid gap-3.5 ${filterOpen ? "grid-cols-3" : "grid-cols-5"}`}>
                            {(Object.entries(CATEGORY_META) as [string, { label: string; icon: string; color: string }][]).map(
                                ([key, meta]) => (
                                    <CategoryCard
                                        key={key}
                                        icon={meta.icon}
                                        label={meta.label}
                                        color={meta.color}
                                        onClick={() => navigateTo("catalog")}
                                    />
                                )
                            )}
                        </div>
                    </div>

                    {/* ── Promo Banners ── */}
                    <div className={`grid gap-[18px] mb-[52px] ${filterOpen ? "grid-cols-1" : "grid-cols-2"}`}>
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
                        <div className={`mt-5 grid gap-[18px] ${productGridCols}`}>
                            {PRODUCTS.slice(0, 4).map((p) => (
                                <VendorMedicineCard
                                    key={p.id}
                                    product={p}
                                    onView={() => navigateTo("product", p.id)}
                                    onAdd={() => handleAddToCart(p.id)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* ── Best Sellers ── */}
                    <div className="mb-16">
                        <SectionHeader title="Best Sellers" onSeeAll={() => navigateTo("catalog")} />
                        <div className={`mt-5 grid gap-[18px] ${productGridCols}`}>
                            {PRODUCTS.slice(4).map((p) => (
                                <VendorMedicineCard
                                    key={p.id}
                                    product={p}
                                    onView={() => navigateTo("product", p.id)}
                                    onAdd={() => handleAddToCart(p.id)}
                                />
                            ))}
                        </div>
                    </div>

                </div>

                {/* ── Filter panel ── */}
                {filterOpen && (
                    <div className="pt-10 sticky top-[120px] self-start">
                        <FilterPanel />
                    </div>
                )}

            </div>

            <Footer />
        </>
    );
}