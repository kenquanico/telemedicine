import { useApp } from "../hooks/useApp";
import { QtySelector, Btn } from "../components/UI";

const DELIVERY_FEE = 49;
const DISCOUNT = 28;

export default function CartPage() {
    const { cartItems, removeFromCart, updateQuantity, cartTotal, navigateTo, addresses, selectedAddressId } = useApp();
    const address = addresses.find((a) => a.id === selectedAddressId) ?? addresses[0];

    const total = cartTotal + DELIVERY_FEE - DISCOUNT;

    return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, padding: 24, alignItems: "flex-start" }}>
            {/* ── Cart Items ────────────────────────────────────────────────────── */}
            <div>
                <h2 style={{ fontFamily: "'Varela Round',sans-serif", fontSize: 22, marginBottom: 20 }}>
                    Shopping Cart{" "}
                    <span style={{ fontSize: 14, color: "#6B7280", fontFamily: "'DM Sans',sans-serif", fontWeight: 400 }}>
            ({cartItems.length} item{cartItems.length !== 1 ? "s" : ""})
          </span>
                </h2>

                {cartItems.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "64px 0" }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>🛒</div>
                        <h3 style={{ fontFamily: "'Varela Round',sans-serif", fontSize: 20, marginBottom: 8 }}>Your cart is empty</h3>
                        <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 20 }}>Add some medicines to get started</p>
                        <Btn onClick={() => navigateTo("catalog")}>Browse Medicines</Btn>
                    </div>
                ) : (
                    cartItems.map((item) => (
                        <div
                            key={item.product.id}
                            style={{
                                display: "flex",
                                gap: 16,
                                padding: 16,
                                background: "#fff",
                                border: "1px solid #E5E7EB",
                                borderRadius: 14,
                                marginBottom: 12,
                                alignItems: "center",
                            }}
                        >
                            {/* Image */}
                            <div
                                style={{
                                    width: 72, height: 72, background: "#F3F4F4",
                                    borderRadius: 10, display: "flex", alignItems: "center",
                                    justifyContent: "center", fontSize: 28, flexShrink: 0,
                                    cursor: "pointer",
                                }}
                                onClick={() => navigateTo("product", item.product.id)}
                            >
                                {item.product.image}
                            </div>

                            {/* Info */}
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 10, color: "#5F9598", fontWeight: 700, textTransform: "uppercase" }}>
                                    {item.product.manufacturer}
                                </div>
                                <div
                                    style={{ fontSize: 14, fontWeight: 600, margin: "3px 0", cursor: "pointer" }}
                                    onClick={() => navigateTo("product", item.product.id)}
                                >
                                    {item.product.brandName} {item.product.strength}
                                </div>
                                <div style={{ fontSize: 13, color: "#6B7280" }}>₱{item.product.price} per piece</div>
                            </div>

                            {/* Controls */}
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
                                <QtySelector
                                    value={item.quantity}
                                    onChange={(v) => updateQuantity(item.product.id, v)}
                                    size="sm"
                                />
                                <div style={{ fontSize: 16, fontWeight: 700, color: "#1D546D" }}>
                                    ₱{(item.product.price * item.quantity).toLocaleString()}
                                </div>
                                <button
                                    onClick={() => removeFromCart(item.product.id)}
                                    style={{ color: "#EF4444", background: "none", border: "none", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* ── Order Summary ─────────────────────────────────────────────────── */}
            <div style={{ background: "#F3F4F4", borderRadius: 16, padding: 20, position: "sticky", top: 80 }}>
                <h3 style={{ fontFamily: "'Varela Round',sans-serif", fontSize: 17, marginBottom: 16 }}>Order Summary</h3>

                {/* Address */}
                <div
                    style={{
                        background: "#fff",
                        border: "1px solid #E5E7EB",
                        borderRadius: 10,
                        padding: 12,
                        marginBottom: 16,
                        cursor: "pointer",
                    }}
                >
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#5F9598", textTransform: "uppercase", marginBottom: 4 }}>
                        Deliver to
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>
                        {address.firstName} {address.lastName}
                    </div>
                    <div style={{ fontSize: 12, color: "#6B7280" }}>
                        {address.line}, {address.city} {address.zip}
                    </div>
                </div>

                {/* Rows */}
                {[
                    { label: `Subtotal (${cartItems.length} items)`, value: `₱${cartTotal.toLocaleString()}` },
                    { label: "Delivery Fee", value: `₱${DELIVERY_FEE}`, muted: true },
                    { label: "Discount", value: `−₱${DISCOUNT}`, green: true },
                ].map(({ label, value, muted, green }) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: 14 }}>
                        <span style={{ color: muted ? "#6B7280" : undefined }}>{label}</span>
                        <span style={{ color: green ? "#10B981" : muted ? "#6B7280" : undefined }}>{value}</span>
                    </div>
                ))}

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        borderTop: "2px solid #E5E7EB",
                        paddingTop: 14,
                        marginTop: 4,
                        fontSize: 17,
                        fontWeight: 700,
                    }}
                >
                    <span>Total</span>
                    <span style={{ color: "#1D546D" }}>₱{total.toLocaleString()}</span>
                </div>

                <Btn
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={() => navigateTo("checkout")}
                    style={{ marginTop: 16 }}
                    disabled={cartItems.length === 0}
                >
                    Proceed to Checkout →
                </Btn>

                <div style={{ textAlign: "center", marginTop: 10, fontSize: 12, color: "#6B7280" }}>
                    🔒 Secure checkout
                </div>
            </div>
        </div>
    );
}