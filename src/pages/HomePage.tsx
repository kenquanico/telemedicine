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
        <div className="flex items-start gap-6 px-10 py-0">

            {/* ── Main content ─────────────────────────────────────────────────── */}
            <div className="flex-1 min-w-0">

                {/* ── Categories ─────────────────────────────────────────────── */}
                <div className="py-12">
                    <SectionHeader title="Shop by Category" onSeeAll={() => navigateTo("catalog")} />
                    <div className={`mt-2 grid gap-4 ${filterOpen ? "grid-cols-3" : "grid-cols-5"}`}>
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

                {/* ── Promo Banners ───────────────────────────────────────────── */}
                <div className={`grid gap-5 pb-10 ${filterOpen ? "grid-cols-1" : "grid-cols-2"}`}>
                    <div className="relative min-h-[140px] overflow-hidden rounded-2xl bg-gradient-to-br from-[#1D546D] to-[#5F9598] p-8">
                        <h3 className="mb-2 font-['Geist'] text-xl font-bold text-white">Get 20% Off Vitamins!</h3>
                        <p className="mb-5 text-sm leading-relaxed text-white/80">
                            Use code <strong>HEALTH20</strong> at checkout
                        </p>
                        <button onClick={() => navigateTo("catalog")}
                                className="cursor-pointer rounded-lg bg-white px-5 py-2.5 text-xs font-semibold text-[#061E29] transition-opacity hover:opacity-90 font-['Geist']">
                            Shop Now
                        </button>
                    </div>
                    <div className="min-h-[140px] rounded-2xl bg-gradient-to-br from-[#061E29] to-[#1D546D] p-8">
                        <h3 className="mb-2 font-['Geist'] text-xl font-bold text-white">Free Delivery Orders ₱500+</h3>
                        <p className="mb-5 text-sm leading-relaxed text-white/80">
                            Available within Cebu City metro area
                        </p>
                        <button onClick={() => navigateTo("catalog")}
                                className="cursor-pointer rounded-lg bg-white px-5 py-2.5 text-xs font-semibold text-[#061E29] transition-opacity hover:opacity-90 font-['Geist']">
                            Order Now
                        </button>
                    </div>
                </div>

                {/* ── Featured Products ───────────────────────────────────────── */}
                <div className="pb-12">
                    <SectionHeader title="Featured Products" onSeeAll={() => navigateTo("catalog")} />
                    <div className={`mt-2 grid gap-5 ${filterOpen ? "grid-cols-2" : "grid-cols-4"}`}>
                        {PRODUCTS.slice(0, 4).map((p) => (
                            <MedicineCard key={p.id} product={p}
                                          onView={() => navigateTo("product", p.id)}
                                          onAdd={() => handleAddToCart(p.id)} />
                        ))}
                    </div>
                </div>

                {/* ── Feature Highlights ──────────────────────────────────────── */}
                <div className="bg-[#F3F4F4] -mx-10 px-10 py-12">
                    <div className={`grid gap-6 ${filterOpen ? "grid-cols-1" : "grid-cols-3"}`}>
                        {[
                            { icon: "🚚", bg: "bg-blue-100",    title: "Same-Day Delivery",   desc: "Order before 3PM for same-day delivery within Cebu City metro area." },
                            { icon: "✅", bg: "bg-emerald-100", title: "Authentic Medicines",  desc: "All products are sourced from FDA-registered suppliers and pharmacies." },
                            { icon: "💬", bg: "bg-amber-100",   title: "Pharmacist Support",  desc: "Chat with licensed pharmacists for medicine advice and guidance." },
                        ].map((f) => (
                            <div key={f.title} className="rounded-2xl bg-white p-8 text-center">
                                <div className={`mx-auto mb-5 flex h-15 w-15 items-center justify-center rounded-2xl text-2xl ${f.bg}`}>
                                    {f.icon}
                                </div>
                                <div className="mb-2.5 font-['Geist'] text-[15px] font-bold text-[#061E29]">{f.title}</div>
                                <div className="text-sm leading-relaxed text-gray-500">{f.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Best Sellers ────────────────────────────────────────────── */}
                <div className="py-12">
                    <SectionHeader title="Best Sellers" onSeeAll={() => navigateTo("catalog")} />
                    <div className={`mt-2 grid gap-5 ${filterOpen ? "grid-cols-2" : "grid-cols-4"}`}>
                        {PRODUCTS.slice(4).map((p) => (
                            <MedicineCard key={p.id} product={p}
                                          onView={() => navigateTo("product", p.id)}
                                          onAdd={() => handleAddToCart(p.id)} />
                        ))}
                    </div>
                </div>

            </div>

            {/* ── Filter card (right side, sticky) ─────────────────────────────── */}
            {filterOpen && (
                <div className="pt-12">
                    <FilterPanel />
                </div>
            )}

            <Footer />
        </div>
    );
}