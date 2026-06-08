import { useState } from "react";
import { useApp } from "../hooks/useApp";
import type { PaymentMethod } from "../types";
import { PAYMENT_META } from "../data/mockData";
import { Btn } from "../components/UI";

const DELIVERY_FEE = 49;
const DISCOUNT = 28;

export default function CheckoutPage() {
    const { cartItems, cartTotal, navigateTo, addresses, selectedAddressId, showModal } = useApp();
    const address = addresses.find((a) => a.id === selectedAddressId) ?? addresses[0];
    const [payment, setPayment] = useState<PaymentMethod>("cod");
    const total = cartTotal + DELIVERY_FEE - DISCOUNT;

    const handlePlaceOrder = () => {
        showModal({
            type: "success", icon: "🎉", title: "Order Placed!",
            message: "Your order #MM-20250601 has been placed. Estimated delivery: Today, 2–4 PM.",
            actionLabel: "Track My Order",
            onAction: () => navigateTo("tracking"),
        });
    };

    return (
        <div className="px-5 py-8 sm:px-8 lg:px-16 lg:py-10">
            <h2 style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: 24, fontWeight: 800, color: "#262626", letterSpacing: "-0.02em", marginBottom: 32 }}>
                Checkout
            </h2>

            <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
                {/* ── Left ── */}
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                    {/* Delivery Address */}
                    <div style={{ background: "#fff", border: "1px solid #EAEFEE", borderRadius: 20, padding: 28 }}>
                        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 22, color: "#262626", fontFamily: "'Neue Montreal', sans-serif", display: "flex", alignItems: "center", gap: 8 }}>
                            Delivery Address
                        </h3>
                        <div className="mb-3.5 grid gap-3.5 sm:grid-cols-2">
                            {[
                                { label: "First Name", value: address.firstName },
                                { label: "Last Name",  value: address.lastName  },
                            ].map(({ label, value }) => (
                                <div key={label}>
                                    <label style={{ fontSize: 11, fontWeight: 700, color: "rgba(38,38,38,0.6)", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 7, fontFamily: "'Neue Montreal', sans-serif" }}>
                                        {label}
                                    </label>
                                    <input defaultValue={value}
                                           style={{
                                               border: "1.5px solid #EAEFEE", borderRadius: 12, padding: "11px 14px",
                                               fontSize: 14, fontFamily: "'Neue Montreal', sans-serif", outline: "none",
                                               width: "100%", boxSizing: "border-box", color: "#262626", fontWeight: 500,
                                               transition: "border-color 0.15s",
                                           }}
                                           onFocus={e => (e.target as HTMLInputElement).style.borderColor = "#427b77"}
                                           onBlur={e => (e.target as HTMLInputElement).style.borderColor = "#EAEFEE"}
                                    />
                                </div>
                            ))}
                        </div>
                        <div style={{ marginBottom: 14 }}>
                            <label style={{ fontSize: 11, fontWeight: 700, color: "rgba(38,38,38,0.6)", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 7, fontFamily: "'Neue Montreal', sans-serif" }}>
                                Address Line
                            </label>
                            <input defaultValue={address.line}
                                   style={{
                                       border: "1.5px solid #EAEFEE", borderRadius: 12, padding: "11px 14px",
                                       fontSize: 14, fontFamily: "'Neue Montreal', sans-serif", outline: "none",
                                       width: "100%", boxSizing: "border-box", color: "#262626", fontWeight: 500,
                                       transition: "border-color 0.15s",
                                   }}
                                   onFocus={e => (e.target as HTMLInputElement).style.borderColor = "#427b77"}
                                   onBlur={e => (e.target as HTMLInputElement).style.borderColor = "#EAEFEE"}
                            />
                        </div>
                        <div className="mb-3.5 grid gap-3.5 sm:grid-cols-2">
                            {[
                                { label: "City",     value: address.city },
                                { label: "ZIP Code", value: address.zip  },
                            ].map(({ label, value }) => (
                                <div key={label}>
                                    <label style={{ fontSize: 11, fontWeight: 700, color: "rgba(38,38,38,0.6)", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 7, fontFamily: "'Neue Montreal', sans-serif" }}>
                                        {label}
                                    </label>
                                    <input defaultValue={value}
                                           style={{
                                               border: "1.5px solid #EAEFEE", borderRadius: 12, padding: "11px 14px",
                                               fontSize: 14, fontFamily: "'Neue Montreal', sans-serif", outline: "none",
                                               width: "100%", boxSizing: "border-box", color: "#262626", fontWeight: 500,
                                               transition: "border-color 0.15s",
                                           }}
                                           onFocus={e => (e.target as HTMLInputElement).style.borderColor = "#427b77"}
                                           onBlur={e => (e.target as HTMLInputElement).style.borderColor = "#EAEFEE"}
                                    />
                                </div>
                            ))}
                        </div>
                        <div>
                            <label style={{ fontSize: 11, fontWeight: 700, color: "rgba(38,38,38,0.6)", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 7, fontFamily: "'Neue Montreal', sans-serif" }}>
                                Phone Number
                            </label>
                            <input defaultValue={address.phone}
                                   style={{
                                       border: "1.5px solid #EAEFEE", borderRadius: 12, padding: "11px 14px",
                                       fontSize: 14, fontFamily: "'Neue Montreal', sans-serif", outline: "none",
                                       width: "100%", boxSizing: "border-box", color: "#262626", fontWeight: 500,
                                       transition: "border-color 0.15s",
                                   }}
                                   onFocus={e => (e.target as HTMLInputElement).style.borderColor = "#427b77"}
                                   onBlur={e => (e.target as HTMLInputElement).style.borderColor = "#EAEFEE"}
                            />
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div style={{ background: "#fff", border: "1px solid #EAEFEE", borderRadius: 20, padding: 28 }}>
                        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20, color: "#262626", fontFamily: "'Neue Montreal', sans-serif" }}>
                            Payment Method
                        </h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {(Object.entries(PAYMENT_META) as [PaymentMethod, { label: string; icon: string }][]).map(([key, meta]) => (
                                <div key={key} onClick={() => setPayment(key)}
                                     style={{
                                         border: `1.5px solid ${payment === key ? "#427b77" : "#EAEFEE"}`,
                                         background: payment === key ? "rgba(66,123,119,0.05)" : "#fff",
                                         borderRadius: 14, padding: "16px 18px", cursor: "pointer",
                                         display: "flex", alignItems: "center", gap: 14,
                                         transition: "all 0.18s",
                                     }}
                                >
                                    <div style={{
                                        width: 18, height: 18, borderRadius: "50%",
                                        border: `2px solid ${payment === key ? "#427b77" : "#D1D5DB"}`,
                                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                                        transition: "border-color 0.15s",
                                    }}>
                                        {payment === key && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#427b77" }} />}
                                    </div>
                                    <span style={{ fontSize: 22 }}>{meta.icon}</span>
                                    <div>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: "#262626", fontFamily: "'Neue Montreal', sans-serif" }}>{meta.label}</div>
                                        <div style={{ fontSize: 12, color: "rgba(38,38,38,0.6)", marginTop: 2, fontFamily: "'Neue Montreal', sans-serif" }}>
                                            {key === "cod"         && "Pay when your order arrives"}
                                            {key === "gcash"       && "Pay via GCash e-wallet"}
                                            {key === "maya"        && "Pay via Maya e-wallet"}
                                            {key === "credit_card" && "Visa, Mastercard, JCB"}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* ── Order Summary ── */}
                <div className="rounded-[20px] border border-[#EAEFEE] bg-white p-6 shadow-[0_2px_20px_rgba(45,45,45,0.06)] lg:sticky lg:top-[120px]">
                    <h3 style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: 16, fontWeight: 700, color: "#262626", marginBottom: 20, letterSpacing: "-0.01em" }}>
                        Order Summary
                    </h3>

                    {/* Items */}
                    <div style={{ background: "#F7FAF9", borderRadius: 14, padding: 14, marginBottom: 18 }}>
                        <div style={{ fontSize: 11, color: "rgba(38,38,38,0.6)", fontFamily: "'Neue Montreal', sans-serif", fontWeight: 600, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                            {cartItems.length} items
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {cartItems.map((item) => (
                                <div key={item.product.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                                        <div style={{
                                            width: 36, height: 36, borderRadius: 8, background: "#fff",
                                            overflow: "hidden", flexShrink: 0, border: "1px solid #EAEFEE",
                                        }}>
                                            <img src={item.product.image} alt={item.product.brandName}
                                                 style={{ width: "100%", height: "100%", objectFit: "contain", padding: 0, transform: "scale(1.18)" }}
                                                 onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                                            />
                                        </div>
                                        <span style={{ fontSize: 13, color: "#262626", fontFamily: "'Neue Montreal', sans-serif", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                            {item.product.brandName} ×{item.quantity}
                                        </span>
                                    </div>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: "#262626", fontFamily: "'Neue Montreal', sans-serif", flexShrink: 0, marginLeft: 8 }}>
                                        ₱{(item.product.price * item.quantity).toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Rows */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
                        {[
                            { label: "Subtotal",  value: `₱${cartTotal.toLocaleString()}`, color: "#262626" },
                            { label: "Delivery",  value: `₱${DELIVERY_FEE}`, color: "rgba(38,38,38,0.6)" },
                            { label: "Discount",  value: `−₱${DISCOUNT}`,    color: "#22C55E" },
                        ].map(({ label, value, color }) => (
                            <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                                <span style={{ color: "rgba(38,38,38,0.7)", fontFamily: "'Neue Montreal', sans-serif" }}>{label}</span>
                                <span style={{ color, fontWeight: 600, fontFamily: "'Neue Montreal', sans-serif" }}>{value}</span>
                            </div>
                        ))}
                    </div>

                    <div style={{ height: 1, background: "#F0F3F2", marginBottom: 16 }} />

                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 17, fontWeight: 800, marginBottom: 20 }}>
                        <span style={{ fontFamily: "'Neue Montreal', sans-serif", color: "#262626" }}>Total</span>
                        <span style={{ fontFamily: "'Neue Montreal', sans-serif", color: "#427b77" }}>₱{total.toLocaleString()}</span>
                    </div>

                    <Btn variant="primary" size="lg" fullWidth onClick={handlePlaceOrder}>
                        Place Order
                    </Btn>

                    <div style={{ textAlign: "center", marginTop: 12, fontSize: 11, color: "rgba(38,38,38,0.5)", fontFamily: "'Neue Montreal', sans-serif" }}>
                        Your data is encrypted and secure
                    </div>
                </div>
            </div>
        </div>
    );
}
