import { useApp } from "../hooks/useApp";
import { PRODUCTS, CATEGORY_META } from "../data/mockData";
import { MedicineCard, CategoryCard, SectionHeader } from "../components/UI";
import Footer from "../components/Footer";
import FilterPanel from "../components/FilterPanel";

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

    return (
        <>
            <div className="flex items-start gap-7 px-16">

                {/* ── Main content ── */}
                <div className="flex-1 min-w-0">

                    {/* ── Hero banner ── */}
                    <div className="my-10 rounded-3xl overflow-hidden bg-gradient-to-br from-[#1a3a38] via-[#2d6b66] to-[#427b77] px-14 py-[52px] relative min-h-[200px] flex flex-col justify-center">
                        {/* Decorative circles */}
                        <div className="absolute -right-15 -top-15 w-80 h-80 rounded-full bg-white/[0.04] pointer-events-none" />
                        <div className="absolute right-15 -bottom-20 w-[220px] h-[220px] rounded-full bg-white/[0.03] pointer-events-none" />

                        <p className="epilogue-header text-[11px] font-extrabold tracking-[0.14em] text-white/55 uppercase mb-3">
                            Same-Day Delivery · Cebu City
                        </p>
                        <h1 className="epilogue-header text-[34px] font-extrabold text-white leading-tight mb-3.5 tracking-tight max-w-[480px]">
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
                            <button
                                className="bg-white/[0.12] text-white border border-white/20 rounded-xl px-6 py-3 text-[13px] font-semibold cursor-pointer epilogue-regular backdrop-blur-sm transition-colors duration-200 hover:bg-white/[0.18]"
                            >
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
                            <div
                                key={f.title}
                                className="bg-white border border-[#EAEFEE] rounded-2xl px-[22px] py-5 flex items-center gap-3.5"
                            >
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
                        <div
                            className={[
                                "mt-5 grid gap-3.5",
                                filterOpen ? "grid-cols-3" : "grid-cols-5",
                            ].join(" ")}
                        >
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
                    <div
                        className={[
                            "grid gap-[18px] mb-[52px]",
                            filterOpen ? "grid-cols-1" : "grid-cols-2",
                        ].join(" ")}
                    >
                        {/* Banner 1 */}
                        <div className="relative min-h-[150px] overflow-hidden rounded-[20px] bg-gradient-to-br from-[#1D546D] to-[#427b77] p-8">
                            <div className="absolute -right-7.5 -top-7.5 w-40 h-40 rounded-full bg-white/[0.06]" />
                            <p className="text-[10px] font-extrabold tracking-[0.12em] text-white/50 uppercase mb-2 epilogue-header">
                                Limited Offer
                            </p>
                            <h3 className="epilogue-header text-xl font-extrabold text-white mb-2 tracking-tight">
                                Get 20% Off Vitamins
                            </h3>
                            <p className="text-[13px] text-white/70 mb-[22px] epilogue-regular leading-relaxed">
                                Use code <strong className="text-white">HEALTH20</strong> at checkout
                            </p>
                            <button
                                onClick={() => navigateTo("catalog")}
                                className="bg-white text-[#1D546D] border-none rounded-[10px] px-5 py-2.5 text-xs font-bold cursor-pointer epilogue-header tracking-[0.02em]"
                            >
                                Shop Now
                            </button>
                        </div>

                        {/* Banner 2 */}
                        <div className="relative min-h-[150px] overflow-hidden rounded-[20px] bg-gradient-to-br from-[#1a2a30] to-[#2d2d2d] p-8">
                            <div className="absolute -right-5 -bottom-10 w-[180px] h-[180px] rounded-full bg-white/[0.04]" />
                            <p className="text-[10px] font-extrabold tracking-[0.12em] text-white/40 uppercase mb-2 epilogue-header">
                                Free Shipping
                            </p>
                            <h3 className="epilogue-header text-xl font-extrabold text-white mb-2 tracking-tight">
                                Free Delivery ₱500+
                            </h3>
                            <p className="text-[13px] text-white/60 mb-[22px] epilogue-regular leading-relaxed">
                                Available within Cebu City metro area
                            </p>
                            <button
                                onClick={() => navigateTo("catalog")}
                                className="bg-white/10 text-white border border-white/[0.15] rounded-[10px] px-5 py-2.5 text-xs font-bold cursor-pointer epilogue-header"
                            >
                                Order Now
                            </button>
                        </div>
                    </div>

                    {/* ── Featured Products ── */}
                    <div className="mb-[52px]">
                        <SectionHeader title="Featured Products" onSeeAll={() => navigateTo("catalog")} />
                        <div
                            className={[
                                "mt-5 grid gap-[18px]",
                                filterOpen ? "grid-cols-2" : "grid-cols-4",
                            ].join(" ")}
                        >
                            {PRODUCTS.slice(0, 4).map((p) => (
                                <MedicineCard
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
                        <div
                            className={[
                                "mt-5 grid gap-[18px]",
                                filterOpen ? "grid-cols-2" : "grid-cols-4",
                            ].join(" ")}
                        >
                            {PRODUCTS.slice(4).map((p) => (
                                <MedicineCard
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

            {/* ── Footer — outside flex wrapper so it spans full width ── */}
            <Footer />
        </>
    );
}