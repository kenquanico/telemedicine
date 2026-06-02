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
        <div style={{ display: "flex", alignItems: "flex-start", gap: 28, padding: "0 64px" }}>

            {/* ── Main content ── */}
            <div style={{ flex: 1, minWidth: 0 }}>

                {/* ── Hero banner ── */}
                <div style={{
                    margin: "40px 0",
                    borderRadius: 24,
                    overflow: "hidden",
                    background: "linear-gradient(130deg, #1a3a38 0%, #2d6b66 50%, #427b77 100%)",
                    padding: "52px 56px",
                    position: "relative",
                    minHeight: 200,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                }}>
                    {/* Decorative circle */}
                    <div style={{
                        position: "absolute", right: -60, top: -60,
                        width: 320, height: 320, borderRadius: "50%",
                        background: "rgba(255,255,255,0.04)",
                        pointerEvents: "none",
                    }} />
                    <div style={{
                        position: "absolute", right: 60, bottom: -80,
                        width: 220, height: 220, borderRadius: "50%",
                        background: "rgba(255,255,255,0.03)",
                        pointerEvents: "none",
                    }} />

                    <p style={{
                        fontFamily: "'Epilogue', sans-serif", fontSize: 11, fontWeight: 800,
                        letterSpacing: "0.14em", color: "rgba(255,255,255,0.55)",
                        textTransform: "uppercase", marginBottom: 12,
                    }}>Same-Day Delivery · Cebu City</p>
                    <h1 style={{
                        fontFamily: "'Epilogue', sans-serif", fontSize: 34, fontWeight: 800,
                        color: "#fff", lineHeight: 1.2, marginBottom: 14, letterSpacing: "-0.02em",
                        maxWidth: 480,
                    }}>
                        Authentic medicines,<br />delivered to your door.
                    </h1>
                    <p style={{
                        fontFamily: "'Epilogue', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.65)",
                        lineHeight: 1.65, maxWidth: 380, marginBottom: 28,
                    }}>
                        Order from FDA-registered pharmacies in Cebu City and get your medicines within hours.
                    </p>
                    <div style={{ display: "flex", gap: 12 }}>
                        <button onClick={() => navigateTo("catalog")}
                                style={{
                                    background: "#fff", color: "#2d2d2d",
                                    border: "none", borderRadius: 12, padding: "13px 24px",
                                    fontSize: 13, fontWeight: 700, cursor: "pointer",
                                    fontFamily: "'Epilogue', sans-serif", letterSpacing: "0.01em",
                                    transition: "opacity 0.2s",
                                }}
                                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.opacity = "0.9"}
                                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.opacity = "1"}
                        >
                            Shop Medicines
                        </button>
                        <button
                            style={{
                                background: "rgba(255,255,255,0.12)", color: "#fff",
                                border: "1.5px solid rgba(255,255,255,0.2)", borderRadius: 12,
                                padding: "13px 24px", fontSize: 13, fontWeight: 600,
                                cursor: "pointer", fontFamily: "'Epilogue', sans-serif",
                                backdropFilter: "blur(8px)", transition: "background 0.2s",
                            }}
                            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.18)"}
                            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.12)"}
                        >
                            Learn More
                        </button>
                    </div>
                </div>

                {/* ── Trust bar ── */}
                <div style={{
                    display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 16, marginBottom: 48,
                }}>
                    {[
                        { icon: "🚚", title: "Same-Day Delivery", sub: "Order before 3PM" },
                        { icon: "✅", title: "Authentic Medicines", sub: "FDA-registered sources" },
                        { icon: "💬", title: "Pharmacist Support", sub: "Chat anytime" },
                    ].map((f) => (
                        <div key={f.title} style={{
                            background: "#fff", border: "1px solid #EAEFEE",
                            borderRadius: 16, padding: "20px 22px",
                            display: "flex", alignItems: "center", gap: 14,
                        }}>
                            <div style={{
                                width: 44, height: 44, borderRadius: 12,
                                background: "#F0F7F6",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 20, flexShrink: 0,
                            }}>{f.icon}</div>
                            <div>
                                <div style={{ fontSize: 13, fontWeight: 700, color: "#2d2d2d", fontFamily: "'Epilogue', sans-serif", marginBottom: 2 }}>{f.title}</div>
                                <div style={{ fontSize: 12, color: "#9CA3AF", fontFamily: "'Epilogue', sans-serif" }}>{f.sub}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Categories ── */}
                <div style={{ marginBottom: 48 }}>
                    <SectionHeader title="Shop by Category" onSeeAll={() => navigateTo("catalog")} />
                    <div style={{
                        marginTop: 20,
                        display: "grid",
                        gridTemplateColumns: filterOpen ? "repeat(3, 1fr)" : "repeat(5, 1fr)",
                        gap: 14,
                    }}>
                        {(Object.entries(CATEGORY_META) as [string, { label: string; icon: string; color: string }][]).map(
                            ([key, meta]) => (
                                <CategoryCard key={key} icon={meta.icon} label={meta.label} color={meta.color}
                                              onClick={() => navigateTo("catalog")} />
                            )
                        )}
                    </div>
                </div>

                {/* ── Promo Banners ── */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: filterOpen ? "1fr" : "1fr 1fr",
                    gap: 18, marginBottom: 52,
                }}>
                    <div style={{
                        position: "relative", minHeight: 150, overflow: "hidden",
                        borderRadius: 20, background: "linear-gradient(130deg, #1D546D 0%, #427b77 100%)",
                        padding: "32px 32px",
                    }}>
                        <div style={{ position: "absolute", right: -30, top: -30, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
                        <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginBottom: 8, fontFamily: "'Epilogue', sans-serif" }}>
                            Limited Offer
                        </p>
                        <h3 style={{ fontFamily: "'Epilogue', sans-serif", fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 8, letterSpacing: "-0.01em" }}>
                            Get 20% Off Vitamins
                        </h3>
                        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginBottom: 22, fontFamily: "'Epilogue', sans-serif", lineHeight: 1.5 }}>
                            Use code <strong style={{ color: "#fff" }}>HEALTH20</strong> at checkout
                        </p>
                        <button onClick={() => navigateTo("catalog")}
                                style={{
                                    background: "#fff", color: "#1D546D",
                                    border: "none", borderRadius: 10, padding: "10px 20px",
                                    fontSize: 12, fontWeight: 700, cursor: "pointer",
                                    fontFamily: "'Epilogue', sans-serif", letterSpacing: "0.02em",
                                }}>
                            Shop Now
                        </button>
                    </div>
                    <div style={{
                        position: "relative", minHeight: 150, overflow: "hidden",
                        borderRadius: 20, background: "linear-gradient(130deg, #1a2a30 0%, #2d2d2d 100%)",
                        padding: "32px 32px",
                    }}>
                        <div style={{ position: "absolute", right: -20, bottom: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
                        <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: 8, fontFamily: "'Epilogue', sans-serif" }}>
                            Free Shipping
                        </p>
                        <h3 style={{ fontFamily: "'Epilogue', sans-serif", fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 8, letterSpacing: "-0.01em" }}>
                            Free Delivery ₱500+
                        </h3>
                        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 22, fontFamily: "'Epilogue', sans-serif", lineHeight: 1.5 }}>
                            Available within Cebu City metro area
                        </p>
                        <button onClick={() => navigateTo("catalog")}
                                style={{
                                    background: "rgba(255,255,255,0.1)", color: "#fff",
                                    border: "1.5px solid rgba(255,255,255,0.15)", borderRadius: 10,
                                    padding: "10px 20px", fontSize: 12, fontWeight: 700,
                                    cursor: "pointer", fontFamily: "'Epilogue', sans-serif",
                                }}>
                            Order Now
                        </button>
                    </div>
                </div>

                {/* ── Featured Products ── */}
                <div style={{ marginBottom: 52 }}>
                    <SectionHeader title="Featured Products" onSeeAll={() => navigateTo("catalog")} />
                    <div style={{
                        marginTop: 20,
                        display: "grid",
                        gridTemplateColumns: filterOpen ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
                        gap: 18,
                    }}>
                        {PRODUCTS.slice(0, 4).map((p) => (
                            <MedicineCard key={p.id} product={p}
                                          onView={() => navigateTo("product", p.id)}
                                          onAdd={() => handleAddToCart(p.id)} />
                        ))}
                    </div>
                </div>

                {/* ── Best Sellers ── */}
                <div style={{ marginBottom: 64 }}>
                    <SectionHeader title="Best Sellers" onSeeAll={() => navigateTo("catalog")} />
                    <div style={{
                        marginTop: 20,
                        display: "grid",
                        gridTemplateColumns: filterOpen ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
                        gap: 18,
                    }}>
                        {PRODUCTS.slice(4).map((p) => (
                            <MedicineCard key={p.id} product={p}
                                          onView={() => navigateTo("product", p.id)}
                                          onAdd={() => handleAddToCart(p.id)} />
                        ))}
                    </div>
                </div>

            </div>

            {/* ── Filter panel ── */}
            {filterOpen && (
                <div style={{ paddingTop: 40 }}>
                    <FilterPanel />
                </div>
            )}

            <Footer />
        </div>
    );
}