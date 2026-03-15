import { useApp } from "../hooks/useApp";
import type { PaymentMethod } from "../types";
import { PAYMENT_META } from "../data/mockData";
import { Btn } from "../components/UI";
import { useState } from "react";

const DELIVERY_FEE = 49;
const DISCOUNT = 28;

export default function CheckoutPage() {
    const { cartItems, cartTotal, navigateTo, addresses, selectedAddressId, showModal } = useApp();
    const address = addresses.find((a) => a.id === selectedAddressId) ?? addresses[0];
    const [payment, setPayment] = useState<PaymentMethod>("cod");

    const total = cartTotal + DELIVERY_FEE - DISCOUNT;

    const handlePlaceOrder = () => {
        showModal({
            type: "success",
            icon: "🎉",
            title: "Order Placed!",
            message: "Your order #MM-20250601 has been placed successfully. Estimated delivery: Today, 2–4 PM.",
            actionLabel: "Track My Order",
            onAction: () => navigateTo("tracking"),
        });
    };

    return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, padding: 24, alignItems: "flex-start" }}>
            {/* ── Left ─────────────────────────────────────────────────────────── */}
            <div>
                <h2 style={{ fontFamily: "'Varela Round',sans-serif", fontSize: 22, marginBottom: 20 }}>Checkout</h2>

                {/* Delivery Address */}
                <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: 20, marginBottom: 16 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                        📍 Delivery Address
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                        {[
                            { label: "First Name", value: address.firstName },
                            { label: "Last Name", value: address.lastName },
                        ].map(({ label, value }) => (
                            <div key={label}>
                                <div style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", marginBottom: 5 }}>{label}</div>
                                <input
                                    defaultValue={value}
                                    style={{ border: "1.5px solid #E5E7EB", borderRadius: 8, padding: "10px 12px", fontSize: 14, fontFamily: "'DM Sans',sans-serif", outline: "none", width: "100%", boxSizing: "border-box" }}
                                />
                            </div>
                        ))}
                    </div>
                    <div style={{ marginBottom: 12 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", marginBottom: 5 }}>Address Line</div>
                        <input
                            defaultValue={address.line}
                            style={{ border: "1.5px solid #E5E7EB", borderRadius: 8, padding: "10px 12px", fontSize: 14, fontFamily: "'DM Sans',sans-serif", outline: "none", width: "100%", boxSizing: "border-box" }}
                        />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                        {[
                            { label: "City", value: address.city },
                            { label: "ZIP Code", value: address.zip },
                        ].map(({ label, value }) => (
                            <div key={label}>
                                <div style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", marginBottom: 5 }}>{label}</div>
                                <input
                                    defaultValue={value}
                                    style={{ border: "1.5px solid #E5E7EB", borderRadius: 8, padding: "10px 12px", fontSize: 14, fontFamily: "'DM Sans',sans-serif", outline: "none", width: "100%", boxSizing: "border-box" }}
                                />
                            </div>
                        ))}
                    </div>
                    <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", marginBottom: 5 }}>Phone Number</div>
                        <input
                            defaultValue={address.phone}
                            style={{ border: "1.5px solid #E5E7EB", borderRadius: 8, padding: "10px 12px", fontSize: 14, fontFamily: "'DM Sans',sans-serif", outline: "none", width: "100%", boxSizing: "border-box" }}
                        />
                    </div>
                </div>

                {/* Payment Method */}
                <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: 20 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                        💳 Payment Method
                    </h3>
                    {(Object.entries(PAYMENT_META) as [PaymentMethod, { label: string; icon: string }][]).map(([key, meta]) => (
                        <div
                            key={key}
                            onClick={() => setPayment(key)}
                            style={{
                                border: `2px solid ${payment === key ? "#5F9598" : "#E5E7EB"}`,
                                background: payment === key ? "#E8F4F5" : "#fff",
                                borderRadius: 10,
                                padding: 14,
                                cursor: "pointer",
                                marginBottom: 10,
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                transition: "all 0.18s",
                            }}
                        >
                            <div
                                style={{
                                    width: 18, height: 18, borderRadius: "50%",
                                    border: `2px solid ${payment === key ? "#5F9598" : "#E5E7EB"}`,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    flexShrink: 0,
                                }}
                            >
                                {payment === key && (
                                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#5F9598" }} />
                                )}
                            </div>
                            <span style={{ fontSize: 20 }}>{meta.icon}</span>
                            <div>
                                <div style={{ fontSize: 14, fontWeight: 600 }}>{meta.label}</div>
                                <div style={{ fontSize: 12, color: "#6B7280" }}>
                                    {key === "cod" && "Pay when your order arrives"}
                                    {key === "gcash" && "Pay via GCash e-wallet"}
                                    {key === "maya" && "Pay via Maya e-wallet"}
                                    {key === "credit_card" && "Visa, Mastercard, JCB"}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Right: Summary ───────────────────────────────────────────────── */}
            <div style={{ background: "#F3F4F4", borderRadius: 16, padding: 20, position: "sticky", top: 80 }}>
                <h3 style={{ fontFamily: "'Varela Round',sans-serif", fontSize: 17, marginBottom: 16 }}>Order Summary</h3>

                {/* Items preview */}
                <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, padding: 12, marginBottom: 14 }}>
                    <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 8 }}>{cartItems.length} items</div>
                    {cartItems.map((item) => (
                        <div key={item.product.id} style={{ fontSize: 13, marginBottom: 4, display: "flex", justifyContent: "space-between" }}>
                            <span>{item.product.image} {item.product.brandName} ×{item.quantity}</span>
                            <span>₱{(item.product.price * item.quantity).toLocaleString()}</span>
                        </div>
                    ))}
                </div>

                {[
                    { label: "Subtotal", value: `₱${cartTotal.toLocaleString()}` },
                    { label: "Delivery", value: `₱${DELIVERY_FEE}`, muted: true },
                    { label: "Discount", value: `−₱${DISCOUNT}`, green: true },
                ].map(({ label, value, muted, green }) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: 14 }}>
                        <span style={{ color: muted ? "#6B7280" : undefined }}>{label}</span>
                        <span style={{ color: green ? "#10B981" : muted ? "#6B7280" : undefined }}>{value}</span>
                    </div>
                ))}

                <div style={{ display: "flex", justifyContent: "space-between", borderTop: "2px solid #E5E7EB", paddingTop: 14, marginTop: 4, fontSize: 17, fontWeight: 700 }}>
                    <span>Total</span>
                    <span style={{ color: "#1D546D" }}>₱{total.toLocaleString()}</span>
                </div>

                <Btn variant="primary" size="lg" fullWidth onClick={handlePlaceOrder} style={{ marginTop: 16 }}>
                    🎉 Place Order
                </Btn>
                <div style={{ textAlign: "center", marginTop: 8, fontSize: 11, color: "#6B7280" }}>
                    🔒 Your data is encrypted and secure
                </div>
            </div>
        </div>
    );
}