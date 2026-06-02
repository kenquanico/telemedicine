import { useApp } from "../hooks/useApp";
import { QtySelector, Btn } from "../components/UI";

const DELIVERY_FEE = 49;
const DISCOUNT = 28;

export default function CartPage() {
    const { cartItems, removeFromCart, updateQuantity, cartTotal, navigateTo, addresses, selectedAddressId } = useApp();
    const address = addresses.find((a) => a.id === selectedAddressId) ?? addresses[0];
    const total = cartTotal + DELIVERY_FEE - DISCOUNT;

    return (
        <div style={{ padding: "40px 64px" }}>
            <h2 style={{ fontFamily: "'Epilogue', sans-serif", fontSize: 24, fontWeight: 800, color: "#2d2d2d", letterSpacing: "-0.02em", marginBottom: 32 }}>
                Shopping Cart
                <span style={{ fontSize: 14, color: "#9CA3AF", fontWeight: 500, marginLeft: 12, fontFamily: "'Epilogue', sans-serif" }}>
                    {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
                </span>
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 28, alignItems: "flex-start" }}>
                {/* ── Cart Items ── */}
                <div>
                    {cartItems.length === 0 ? (
                        <div style={{
                            background: "#fff", border: "1px solid #EAEFEE", borderRadius: 20,
                            padding: "80px 40px", textAlign: "center",
                        }}>
                            <div style={{
                                width: 80, height: 80, borderRadius: 24, background: "#F4F6F5",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 32, margin: "0 auto 20px",
                            }}>🛒</div>
                            <h3 style={{ fontFamily: "'Epilogue', sans-serif", fontSize: 19, fontWeight: 700, color: "#2d2d2d", marginBottom: 8 }}>
                                Your cart is empty
                            </h3>
                            <p style={{ color: "#9CA3AF", fontSize: 14, marginBottom: 24, fontFamily: "'Epilogue', sans-serif" }}>
                                Add some medicines to get started
                            </p>
                            <Btn onClick={() => navigateTo("catalog")} variant="secondary">Browse Medicines</Btn>
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {cartItems.map((item) => (
                                <div key={item.product.id}
                                     style={{
                                         display: "flex", gap: 18, padding: 20,
                                         background: "#fff", border: "1px solid #EAEFEE",
                                         borderRadius: 18, alignItems: "center",
                                         transition: "box-shadow 0.2s",
                                     }}
                                     onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(45,45,45,0.07)"}
                                     onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.boxShadow = "none"}
                                >
                                    {/* Image */}
                                    <div
                                        style={{
                                            width: 80, height: 80, background: "#F7FAF9",
                                            borderRadius: 14, display: "flex", alignItems: "center",
                                            justifyContent: "center", flexShrink: 0, cursor: "pointer",
                                            overflow: "hidden",
                                        }}
                                        onClick={() => navigateTo("product", item.product.id)}
                                    >
                                        <img
                                            src={item.product.image}
                                            alt={item.product.brandName}
                                            style={{ width: "100%", height: "100%", objectFit: "contain", padding: 8 }}
                                            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                                        />
                                    </div>

                                    {/* Info */}
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 10, color: "#427b77", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4, fontFamily: "'Epilogue', sans-serif" }}>
                                            {item.product.manufacturer.split(" ")[0]}
                                        </div>
                                        <div
                                            style={{ fontSize: 15, fontWeight: 700, color: "#2d2d2d", marginBottom: 2, cursor: "pointer", fontFamily: "'Epilogue', sans-serif" }}
                                            onClick={() => navigateTo("product", item.product.id)}
                                        >
                                            {item.product.brandName} {item.product.strength}
                                        </div>
                                        <div style={{ fontSize: 12, color: "#9CA3AF", fontFamily: "'Epilogue', sans-serif" }}>
                                            {item.product.dosageForm} · ₱{item.product.price} each
                                        </div>
                                    </div>

                                    {/* Controls */}
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12 }}>
                                        <QtySelector value={item.quantity} onChange={(v) => updateQuantity(item.product.id, v)} size="sm" />
                                        <div style={{ fontSize: 17, fontWeight: 800, color: "#2d2d2d", fontFamily: "'Epilogue', sans-serif" }}>
                                            ₱{(item.product.price * item.quantity).toLocaleString()}
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.product.id)}
                                            style={{
                                                color: "#EF4444", background: "none", border: "none",
                                                fontSize: 12, cursor: "pointer",
                                                fontFamily: "'Epilogue', sans-serif", fontWeight: 600,
                                                padding: "4px 8px", borderRadius: 6, transition: "background 0.15s",
                                            }}
                                            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "#FEF2F2"}
                                            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "transparent"}
                                        >Remove</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Order Summary ── */}
                <div style={{
                    background: "#fff", border: "1px solid #EAEFEE",
                    borderRadius: 20, padding: 24, position: "sticky", top: 96,
                    boxShadow: "0 2px 20px rgba(45,45,45,0.06)",
                }}>
                    <h3 style={{ fontFamily: "'Epilogue', sans-serif", fontSize: 16, fontWeight: 700, color: "#2d2d2d", marginBottom: 20, letterSpacing: "-0.01em" }}>
                        Order Summary
                    </h3>

                    {/* Delivery address */}
                    <div style={{
                        background: "#F7FAF9", border: "1.5px solid #EAEFEE",
                        borderRadius: 14, padding: 14, marginBottom: 20, cursor: "pointer",
                    }}>
                        <div style={{ fontSize: 10, fontWeight: 800, color: "#427b77", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6, fontFamily: "'Epilogue', sans-serif" }}>
                            Deliver to
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#2d2d2d", fontFamily: "'Epilogue', sans-serif" }}>
                            {address.firstName} {address.lastName}
                        </div>
                        <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2, fontFamily: "'Epilogue', sans-serif", lineHeight: 1.5 }}>
                            {address.line}, {address.city} {address.zip}
                        </div>
                    </div>

                    {/* Line items */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
                        {[
                            { label: `Subtotal (${cartItems.length} items)`, value: `₱${cartTotal.toLocaleString()}`, color: "#2d2d2d" },
                            { label: "Delivery Fee",  value: `₱${DELIVERY_FEE}`, color: "#9CA3AF" },
                            { label: "Discount",      value: `−₱${DISCOUNT}`,    color: "#22C55E" },
                        ].map(({ label, value, color }) => (
                            <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                                <span style={{ color: "#6B7280", fontFamily: "'Epilogue', sans-serif" }}>{label}</span>
                                <span style={{ color, fontWeight: 600, fontFamily: "'Epilogue', sans-serif" }}>{value}</span>
                            </div>
                        ))}
                    </div>

                    <div style={{ height: 1, background: "#F0F3F2", marginBottom: 16 }} />

                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 17, fontWeight: 800, marginBottom: 20 }}>
                        <span style={{ fontFamily: "'Epilogue', sans-serif", color: "#2d2d2d" }}>Total</span>
                        <span style={{ fontFamily: "'Epilogue', sans-serif", color: "#427b77" }}>₱{total.toLocaleString()}</span>
                    </div>

                    <Btn variant="primary" size="lg" fullWidth
                         onClick={() => navigateTo("checkout")}
                         disabled={cartItems.length === 0}>
                        Proceed to Checkout
                    </Btn>

                    <div style={{ textAlign: "center", marginTop: 12, fontSize: 11, color: "#C4CBCA", fontFamily: "'Epilogue', sans-serif" }}>
                        Secure checkout · End-to-end encrypted
                    </div>
                </div>
            </div>
        </div>
    );
}