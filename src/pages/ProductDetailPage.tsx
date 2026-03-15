import { useApp } from "../hooks/useApp";
import { PRODUCTS } from "../data/mockData";
import { StockBadge, QtySelector, Stars, Btn } from "../components/UI";
import {useState} from "react";

type Tab = "details" | "dosage" | "warnings" | "reviews";

export default function ProductDetailPage() {
    const { selectedProductId, navigateTo, addToCart, showModal } = useApp();
    const [qty, setQty] = useState(1);
    const [activeTab, setActiveTab] = useState<Tab>("details");

    const product = PRODUCTS.find((p) => p.id === selectedProductId) ?? PRODUCTS[0];

    const handleAddToCart = () => {
        addToCart(product, qty);
        showModal({
            type: "added",
            icon: "✅",
            title: "Added to Cart!",
            message: `${qty}× ${product.brandName} ${product.strength} added to your cart.`,
            actionLabel: "View Cart",
            onAction: () => navigateTo("cart"),
        });
    };

    const tabs: { key: Tab; label: string }[] = [
        { key: "details", label: "Details" },
        { key: "dosage", label: "Dosage & Usage" },
        { key: "warnings", label: "Warnings" },
        { key: "reviews", label: `Reviews (${product.reviews.length})` },
    ];

    return (
        <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
            {/* Back */}
            <button
                onClick={() => navigateTo("catalog")}
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    color: "#1D546D",
                    fontSize: 14,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    marginBottom: 20,
                    fontFamily: "'DM Sans',sans-serif",
                }}
            >
                ← Back to Catalog
            </button>

            {/* ── Main Layout ───────────────────────────────────────────────────── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginBottom: 32 }}>
                {/* Images */}
                <div>
                    <div
                        style={{
                            background: "#F3F4F4",
                            borderRadius: 20,
                            height: 320,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 96,
                        }}
                    >
                        {product.image}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginTop: 10 }}>
                        {["📦", "📋", "🏷️"].map((icon, i) => (
                            <div
                                key={i}
                                style={{
                                    background: "#F3F4F4",
                                    borderRadius: 8,
                                    height: 60,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 20,
                                    cursor: "pointer",
                                    border: i === 0 ? "2px solid #5F9598" : "2px solid transparent",
                                }}
                            >
                                {icon}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Info */}
                <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#5F9598", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
                        {product.manufacturer}
                    </div>
                    <h1 style={{ fontFamily: "'Varela Round',sans-serif", fontSize: 28, color: "#061E29", marginBottom: 8, lineHeight: 1.2 }}>
                        {product.brandName} {product.strength}
                    </h1>
                    <div style={{ fontSize: 14, color: "#6B7280", marginBottom: 16 }}>
                        Generic: {product.genericName} · {product.dosageForm} · {product.strength}
                    </div>

                    {/* Price */}
                    <div style={{ marginBottom: 14 }}>
                        <span style={{ fontSize: 32, fontWeight: 700, color: "#1D546D" }}>₱{product.price}</span>
                        {product.originalPrice && (
                            <span style={{ fontSize: 14, color: "#6B7280", textDecoration: "line-through", marginLeft: 8 }}>
                ₱{product.originalPrice}
              </span>
                        )}
                    </div>

                    {/* Rating */}
                    <div style={{ marginBottom: 12 }}>
                        <Stars rating={product.rating} />
                    </div>

                    {/* Stock */}
                    <div style={{ marginBottom: 20 }}>
                        <StockBadge status={product.stockStatus} />
                        {product.stockStatus !== "out_of_stock" && (
                            <span style={{ fontSize: 12, color: "#6B7280", marginLeft: 8 }}>
                ({product.stockCount}+ available)
              </span>
                        )}
                    </div>

                    {/* Quantity */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>Quantity:</span>
                        <QtySelector value={qty} onChange={setQty} />
                    </div>

                    {/* Add to Cart */}
                    <Btn
                        variant="primary"
                        size="lg"
                        fullWidth
                        disabled={product.stockStatus === "out_of_stock"}
                        onClick={handleAddToCart}
                        style={{ marginBottom: 12 }}
                    >
                        🛒 Add to Cart
                    </Btn>

                    {/* Trust badges */}
                    <div
                        style={{
                            padding: 12,
                            background: "#F3F4F4",
                            borderRadius: 10,
                            fontSize: 12,
                            color: "#6B7280",
                            display: "flex",
                            gap: 16,
                            flexWrap: "wrap",
                        }}
                    >
                        <span>🚚 Same-day delivery</span>
                        <span>✅ Authentic product</span>
                        <span>↩️ Easy returns</span>
                    </div>
                </div>
            </div>

            {/* ── Tabs ──────────────────────────────────────────────────────────── */}
            <div style={{ borderBottom: "2px solid #E5E7EB", display: "flex", gap: 0, marginBottom: 20 }}>
                {tabs.map((t) => (
                    <button
                        key={t.key}
                        onClick={() => setActiveTab(t.key)}
                        style={{
                            padding: "10px 20px",
                            fontSize: 14,
                            fontWeight: activeTab === t.key ? 600 : 400,
                            cursor: "pointer",
                            borderBottom: activeTab === t.key ? "3px solid #1D546D" : "3px solid transparent",
                            marginBottom: -2,
                            color: activeTab === t.key ? "#1D546D" : "#6B7280",
                            background: "none",
                            border: "none",
                            borderBottomWidth: 3,
                            borderBottomStyle: "solid",
                            borderBottomColor: activeTab === t.key ? "#1D546D" : "transparent",
                            fontFamily: "'DM Sans',sans-serif",
                        }}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === "details" && (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <tbody>
                    {[
                        ["Brand Name", product.brandName],
                        ["Generic Name", product.genericName],
                        ["Manufacturer", product.manufacturer],
                        ["Dosage Form", product.dosageForm],
                        ["Strength", product.strength],
                        ["Pack Size", product.packSize],
                        ["Storage", product.storage],
                        ["Expiry", product.expiry],
                    ].map(([k, v]) => (
                        <tr key={k} style={{ borderBottom: "1px solid #E5E7EB" }}>
                            <td style={{ padding: "10px 0", fontSize: 14, fontWeight: 600, width: 160, color: "#061E29" }}>{k}</td>
                            <td style={{ padding: "10px 0", fontSize: 14, color: "#6B7280" }}>{v}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {activeTab === "dosage" && (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <tbody>
                    {[
                        ["Adults", product.dosageAdults],
                        ["Children", product.dosageChildren],
                        ["Max Daily Dose", product.maxDailyDose],
                        ["How to Take", product.howToTake],
                        ["Indication", product.indication],
                    ].map(([k, v]) => (
                        <tr key={k} style={{ borderBottom: "1px solid #E5E7EB" }}>
                            <td style={{ padding: "10px 0", fontSize: 14, fontWeight: 600, width: 160, color: "#061E29" }}>{k}</td>
                            <td style={{ padding: "10px 0", fontSize: 14, color: "#6B7280" }}>{v}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {activeTab === "warnings" && (
                <div
                    style={{
                        background: "#FEF3C7",
                        border: "1px solid #FCD34D",
                        borderRadius: 10,
                        padding: 16,
                    }}
                >
                    <p style={{ fontSize: 14, color: "#92400E", lineHeight: 1.6 }}>
                        ⚠️ <strong>Warnings:</strong> {product.warnings}
                    </p>
                </div>
            )}

            {activeTab === "reviews" && (
                <div>
                    {product.reviews.length === 0 ? (
                        <div style={{ color: "#6B7280", fontSize: 14, padding: "16px 0" }}>
                            No reviews yet. Be the first to review!
                        </div>
                    ) : (
                        product.reviews.map((r) => (
                            <div
                                key={r.id}
                                style={{ border: "1px solid #E5E7EB", borderRadius: 12, padding: 14, marginBottom: 12 }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                                    <div
                                        style={{
                                            width: 36, height: 36, borderRadius: "50%",
                                            background: "#5F9598",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            color: "#fff", fontWeight: 700, fontSize: 14,
                                        }}
                                    >
                                        {r.reviewer[0]}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 600 }}>{r.reviewer}</div>
                                        <Stars rating={r.rating} />
                                    </div>
                                    <div style={{ marginLeft: "auto", fontSize: 12, color: "#6B7280" }}>{r.date}</div>
                                </div>
                                <p style={{ fontSize: 13, color: "#6B7280" }}>{r.comment}</p>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}