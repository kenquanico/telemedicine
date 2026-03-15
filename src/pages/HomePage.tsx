
import { useApp } from "../hooks/useApp";
import { PRODUCTS, CATEGORY_META } from "../data/mockData";
import { MedicineCard, CategoryCard, SectionHeader } from "../components/UI";
import Footer from "../components/Footer";

export default function HomePage() {
    const { navigateTo, addToCart, showModal } = useApp();

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
        <div>
            {/* ── Hero ──────────────────────────────────────────────────────────── */}
            <div
                style={{
                    background: "linear-gradient(135deg, #061E29 0%, #1D546D 60%, #5F9598 100%)",
                    padding: "56px 24px",
                    textAlign: "center",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Decorative circles */}
                <div
                    style={{
                        position: "absolute", top: -60, right: -60,
                        width: 300, height: 300, borderRadius: "50%",
                        background: "rgba(95,149,152,0.15)", pointerEvents: "none",
                    }}
                />
                <div
                    style={{
                        position: "absolute", bottom: -80, left: -40,
                        width: 200, height: 200, borderRadius: "50%",
                        background: "rgba(255,255,255,0.05)", pointerEvents: "none",
                    }}
                />

                <h1
                    style={{
                        fontFamily: "'Varela Round', sans-serif",
                        fontSize: 36,
                        color: "#fff",
                        marginBottom: 12,
                        position: "relative",
                        zIndex: 1,
                    }}
                >
                    Your Health, Delivered Fast 🏥
                </h1>
                <p style={{ fontSize: 16, color: "rgba(255,255,255,0.8)", maxWidth: 500, margin: "0 auto 24px", position: "relative", zIndex: 1 }}>
                    Order medicines, vitamins, and health essentials online. Same-day
                    delivery in Cebu City.
                </p>

                {/* Pills */}
                <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", position: "relative", zIndex: 1 }}>
                    {["🔥 Today's Deals", "💊 Prescription Meds", "🧴 Vitamins", "🩹 First Aid", "🚚 Free Delivery"].map((p) => (
                        <span
                            key={p}
                            onClick={() => navigateTo("catalog")}
                            style={{
                                background: "rgba(255,255,255,0.15)",
                                border: "1px solid rgba(255,255,255,0.25)",
                                borderRadius: 20,
                                padding: "6px 14px",
                                color: "#fff",
                                fontSize: 12,
                                cursor: "pointer",
                            }}
                        >
              {p}
            </span>
                    ))}
                </div>
            </div>

            {/* ── Categories ───────────────────────────────────────────────────── */}
            <div style={{ padding: "32px 24px" }}>
                <SectionHeader title="Shop by Category" onSeeAll={() => navigateTo("catalog")} />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 14 }}>
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

            {/* ── Promo Banners ────────────────────────────────────────────────── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, padding: "0 24px 24px" }}>
                <div
                    style={{
                        background: "linear-gradient(135deg, #1D546D, #5F9598)",
                        borderRadius: 16,
                        padding: 24,
                        position: "relative",
                        overflow: "hidden",
                        minHeight: 130,
                    }}
                >
                    <h3 style={{ color: "#fff", fontFamily: "'Varela Round',sans-serif", fontSize: 20, marginBottom: 6 }}>
                        Get 20% Off Vitamins!
                    </h3>
                    <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, marginBottom: 14 }}>
                        Use code <strong>HEALTH20</strong> at checkout
                    </p>
                    <button
                        onClick={() => navigateTo("catalog")}
                        style={{
                            background: "#fff",
                            color: "#061E29",
                            border: "none",
                            borderRadius: 8,
                            padding: "7px 16px",
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: "pointer",
                            fontFamily: "'DM Sans',sans-serif",
                        }}
                    >
                        Shop Now
                    </button>
                </div>
                <div
                    style={{
                        background: "linear-gradient(135deg, #061E29, #1D546D)",
                        borderRadius: 16,
                        padding: 24,
                        minHeight: 130,
                    }}
                >
                    <h3 style={{ color: "#fff", fontFamily: "'Varela Round',sans-serif", fontSize: 20, marginBottom: 6 }}>
                        Free Delivery Orders ₱500+
                    </h3>
                    <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, marginBottom: 14 }}>
                        Available within Cebu City metro area
                    </p>
                    <button
                        onClick={() => navigateTo("catalog")}
                        style={{
                            background: "#fff",
                            color: "#061E29",
                            border: "none",
                            borderRadius: 8,
                            padding: "7px 16px",
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: "pointer",
                            fontFamily: "'DM Sans',sans-serif",
                        }}
                    >
                        Order Now
                    </button>
                </div>
            </div>

            {/* ── Featured Products ─────────────────────────────────────────────── */}
            <div style={{ padding: "0 24px 32px" }}>
                <SectionHeader title="Featured Products" onSeeAll={() => navigateTo("catalog")} />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
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

            {/* ── Feature Highlights ───────────────────────────────────────────── */}
            <div style={{ background: "#F3F4F4", padding: "32px 24px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
                    {[
                        { icon: "🚚", bg: "#DBEAFE", title: "Same-Day Delivery", desc: "Order before 3PM for same-day delivery within Cebu City metro area." },
                        { icon: "✅", bg: "#D1FAE5", title: "Authentic Medicines", desc: "All products are sourced from FDA-registered suppliers and pharmacies." },
                        { icon: "💬", bg: "#FEF3C7", title: "Pharmacist Support", desc: "Chat with licensed pharmacists for medicine advice and guidance." },
                    ].map((f) => (
                        <div key={f.title} style={{ background: "#fff", borderRadius: 16, padding: 24, textAlign: "center" }}>
                            <div style={{ width: 56, height: 56, borderRadius: 14, background: f.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 14px" }}>
                                {f.icon}
                            </div>
                            <div style={{ fontFamily: "'Varela Round',sans-serif", fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{f.title}</div>
                            <div style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6 }}>{f.desc}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Best Sellers ──────────────────────────────────────────────────── */}
            <div style={{ padding: "32px 24px" }}>
                <SectionHeader title="Best Sellers" onSeeAll={() => navigateTo("catalog")} />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
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

            <Footer />
        </div>
    );
}