// ─── Orders Page ──────────────────────────────────────────────────────────────
import { useState } from "react";
import { useApp } from "../hooks/useApp";
import { ORDERS, PAYMENT_META, } from "../data/mockData";
import { StatusBadge, Btn } from "../components/UI";
import type { OrderStatus, PaymentMethod } from "../types";

export function OrdersPage() {
    const { navigateTo, setSelectedOrderId } = useApp();
    const [filter, setFilter] = useState<OrderStatus | "all">("all");

    const filtered = filter === "all" ? ORDERS : ORDERS.filter((o) => o.status === filter);

    const tabs: { key: OrderStatus | "all"; label: string }[] = [
        { key: "all", label: "All Orders" },
        { key: "pending", label: "Pending" },
        { key: "preparing", label: "Preparing" },
        { key: "out_for_delivery", label: "Out for Delivery" },
        { key: "delivered", label: "Delivered" },
    ];

    return (
        <div style={{ padding: 24 }}>
            <h2 style={{ fontFamily: "'Varela Round',sans-serif", fontSize: 22, marginBottom: 16 }}>My Orders</h2>

            {/* Filters */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
                {tabs.map((t) => (
                    <button
                        key={t.key}
                        onClick={() => setFilter(t.key)}
                        style={{
                            border: filter === t.key ? "none" : "1.5px solid #E5E7EB",
                            background: filter === t.key ? "#1D546D" : "#fff",
                            color: filter === t.key ? "#fff" : "#061E29",
                            borderRadius: 20,
                            padding: "7px 16px",
                            fontSize: 13,
                            cursor: "pointer",
                            fontFamily: "'DM Sans',sans-serif",
                            fontWeight: filter === t.key ? 600 : 400,
                        }}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Order Cards */}
            {filtered.map((order) => (
                <div
                    key={order.id}
                    style={{
                        background: "#fff",
                        border: "1px solid #E5E7EB",
                        borderRadius: 14,
                        padding: 18,
                        marginBottom: 14,
                    }}
                >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <div>
                            <div style={{ fontSize: 15, fontWeight: 700 }}>Order #{order.id}</div>
                            <div style={{ fontSize: 13, color: "#6B7280" }}>{order.createdAt}</div>
                        </div>
                        <StatusBadge status={order.status} />
                    </div>

                    {/* Items */}
                    <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
                        {order.items.map((item) => (
                            <span
                                key={item.product.id}
                                style={{ background: "#F3F4F4", borderRadius: 6, padding: "4px 10px", fontSize: 12 }}
                            >
                {item.product.image} {item.product.brandName} ×{item.quantity}
              </span>
                        ))}
                    </div>

                    {/* Footer */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: "1px solid #E5E7EB" }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#1D546D" }}>
                            ₱{order.total.toLocaleString()} · {PAYMENT_META[order.paymentMethod].label}
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                            {order.status === "out_for_delivery" && (
                                <Btn
                                    variant="outline"
                                    size="sm"
                                    onClick={() => { setSelectedOrderId(order.id); navigateTo("tracking"); }}
                                >
                                    Track Order
                                </Btn>
                            )}
                            <Btn variant="outline" size="sm">Reorder</Btn>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

// ─── Order Tracking Page ──────────────────────────────────────────────────────
export function TrackingPage() {
    const { orders } = useApp();
    const order = orders.find((o) => o.status === "out_for_delivery") ?? orders[0];

    const steps = [
        { key: "placed", label: "Order Placed", time: order.createdAt, done: true, icon: "📋" },
        { key: "confirmed", label: "Order Confirmed", time: "Pharmacist reviewed", done: true, icon: "✓" },
        { key: "preparing", label: "Preparing Order", time: "Medicines packed", done: true, icon: "✓" },
        { key: "delivery", label: "Out for Delivery", time: "En route to your address", current: true, icon: "🚚" },
        { key: "delivered", label: "Delivered", time: `Estimated: ${order.estimatedDelivery}`, upcoming: true, icon: "📦" },
    ] as const;

    return (
        <div style={{ padding: 24, maxWidth: 700, margin: "0 auto" }}>
            {/* Header */}
            <div
                style={{
                    background: "linear-gradient(135deg, #061E29, #1D546D)",
                    borderRadius: 16,
                    padding: 24,
                    color: "#fff",
                    marginBottom: 24,
                }}
            >
                <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>Order #{order.id}</div>
                <h2 style={{ fontFamily: "'Varela Round',sans-serif", color: "#fff", fontSize: 22, marginBottom: 4 }}>
                    Tracking Your Order
                </h2>
                <div style={{ fontSize: 13, opacity: 0.8 }}>Estimated delivery: {order.estimatedDelivery}</div>
                <div style={{ marginTop: 14, display: "flex", gap: 12 }}>
                    {[
                        { label: "Rider", value: order.rider?.name ?? "Assigned" },
                        { label: "Contact", value: order.rider?.phone ?? "—" },
                        { label: "Items", value: `${order.items.length} items` },
                    ].map(({ label, value }) => (
                        <div key={label} style={{ background: "rgba(255,255,255,0.12)", borderRadius: 8, padding: "8px 14px" }}>
                            <div style={{ fontSize: 11, opacity: 0.7 }}>{label}</div>
                            <div style={{ fontSize: 13, fontWeight: 600 }}>{value}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Steps */}
            {steps.map((step, i) => {
                const isLast = i === steps.length - 1;
                const isDone = "done" in step && step.done;
                const isCurrent = "current" in step && step.current;
                const dotBg = isDone ? "#5F9598" : isCurrent ? "#1D546D" : "#E5E7EB";
                const dotColor = isDone || isCurrent ? "#fff" : "#6B7280";
                const lineBg = isDone ? "#5F9598" : "#E5E7EB";

                return (
                    <div key={step.key} style={{ display: "flex", gap: 16, marginBottom: isLast ? 0 : 0 }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <div
                                style={{
                                    width: 36, height: 36, borderRadius: "50%",
                                    background: dotBg, color: dotColor,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 14, fontWeight: 700, flexShrink: 0,
                                    boxShadow: isCurrent ? "0 0 0 6px rgba(29,84,109,0.12)" : undefined,
                                }}
                            >
                                {step.icon}
                            </div>
                            {!isLast && (
                                <div style={{ width: 2, flex: 1, background: lineBg, minHeight: 32, margin: "4px 0" }} />
                            )}
                        </div>
                        <div style={{ paddingBottom: isLast ? 0 : 24 }}>
                            <h4 style={{ fontSize: 14, fontWeight: 600, color: isCurrent ? "#1D546D" : "done" in step && step.done ? "#061E29" : "#6B7280" }}>
                                {step.label}
                            </h4>
                            <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>{step.time}</p>
                        </div>
                    </div>
                );
            })}

            {/* Items */}
            <div style={{ background: "#F3F4F4", borderRadius: 14, padding: 16, marginTop: 24 }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Order Items</h4>
                {order.items.map((item) => (
                    <div key={item.product.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "6px 0", borderBottom: "1px solid #E5E7EB" }}>
                        <span>{item.product.image} {item.product.brandName} ×{item.quantity}</span>
                        <span>₱{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, fontSize: 14, fontWeight: 700 }}>
                    <span>Total Paid</span>
                    <span style={{ color: "#1D546D" }}>₱{order.total.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
}

// ─── Payment Page ─────────────────────────────────────────────────────────────
export function PaymentPage() {
    const { cartItems, cartTotal, orders, navigateTo, showModal } = useApp();
    const [selected, setSelected] = useState<PaymentMethod>("cod");

    const DELIVERY_FEE = 49;
    const DISCOUNT = 28;
    const total = cartTotal + DELIVERY_FEE - DISCOUNT;

    // Use latest order for invoice if cart is empty
    const order = orders[0];
    const displayItems = cartItems.length > 0
        ? cartItems.map((i) => ({ name: `${i.product.image} ${i.product.brandName} ${i.product.strength} ×${i.quantity}`, amount: i.product.price * i.quantity }))
        : order.items.map((i) => ({ name: `${i.product.image} ${i.product.brandName} ×${i.quantity}`, amount: i.price * i.quantity }));

    return (
        <div style={{ padding: 24, maxWidth: 700, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Varela Round',sans-serif", fontSize: 22, marginBottom: 20 }}>Payment</h2>

            {/* Invoice Card */}
            <div style={{ background: "#F3F4F4", borderRadius: 12, padding: 20, marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14, alignItems: "flex-start" }}>
                    <div>
                        <div style={{ fontFamily: "'Varela Round',sans-serif", fontSize: 18, fontWeight: 700 }}>➕ MediMart</div>
                        <div style={{ fontSize: 12, color: "#6B7280" }}>Invoice #INV-20250601-001</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 12, color: "#6B7280" }}>Date</div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>Jun 1, 2025</div>
                    </div>
                </div>
                {displayItems.map((item) => (
                    <div key={item.name} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, padding: "8px 0", borderBottom: "1px solid #E5E7EB" }}>
                        <span>{item.name}</span><span>₱{item.amount.toLocaleString()}</span>
                    </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, padding: "8px 0", borderBottom: "1px solid #E5E7EB", color: "#6B7280" }}>
                    <span>Delivery Fee</span><span>₱{DELIVERY_FEE}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, padding: "8px 0", borderBottom: "1px solid #E5E7EB", color: "#10B981" }}>
                    <span>Discount</span><span>−₱{DISCOUNT}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 700, padding: "10px 0" }}>
                    <span>Total</span><span style={{ color: "#1D546D" }}>₱{total.toLocaleString()}</span>
                </div>
            </div>

            {/* Payment selector */}
            <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: 20, marginBottom: 16 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Select Payment Method</h3>
                {(Object.entries(PAYMENT_META) as [PaymentMethod, { label: string; icon: string }][]).map(([key, meta]) => (
                    <div
                        key={key}
                        onClick={() => setSelected(key)}
                        style={{
                            border: `2px solid ${selected === key ? "#5F9598" : "#E5E7EB"}`,
                            background: selected === key ? "#E8F4F5" : "#fff",
                            borderRadius: 10, padding: 14, cursor: "pointer", marginBottom: 10,
                            display: "flex", alignItems: "center", gap: 12, transition: "all 0.18s",
                        }}
                    >
                        <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${selected === key ? "#5F9598" : "#E5E7EB"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {selected === key && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#5F9598" }} />}
                        </div>
                        <span style={{ fontSize: 20 }}>{meta.icon}</span>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{meta.label}</div>
                    </div>
                ))}
            </div>

            <Btn
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => showModal({ type: "success", icon: "🎉", title: "Payment Confirmed!", message: `Payment of ₱${total.toLocaleString()} via ${PAYMENT_META[selected].label} has been confirmed.`, actionLabel: "View Orders", onAction: () => navigateTo("orders") })}
            >
                Confirm Payment · ₱{total.toLocaleString()}
            </Btn>
        </div>
    );
}

// ─── Payment History Page ─────────────────────────────────────────────────────
import { PAYMENT_HISTORY } from "../data/mockData";

export function PaymentHistoryPage() {
    const totalSpent = PAYMENT_HISTORY.reduce((s, p) => s + p.amount, 0);

    return (
        <div style={{ padding: 24 }}>
            <h2 style={{ fontFamily: "'Varela Round',sans-serif", fontSize: 22, marginBottom: 20 }}>Payment History</h2>

            <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, overflow: "hidden" }}>
                {/* Header Row */}
                <div style={{ padding: "12px 16px", background: "#F3F4F4", display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, fontSize: 12, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    <span>Order</span><span>Date</span><span>Method</span><span style={{ textAlign: "right" }}>Amount</span>
                </div>
                {PAYMENT_HISTORY.map((p, i) => (
                    <div
                        key={p.id}
                        style={{
                            padding: "14px 16px",
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr 1fr 1fr",
                            gap: 8,
                            borderBottom: i < PAYMENT_HISTORY.length - 1 ? "1px solid #E5E7EB" : "none",
                            alignItems: "center",
                        }}
                    >
                        <div>
                            <div style={{ fontSize: 13, fontWeight: 600 }}>#{p.orderId}</div>
                            <div style={{ fontSize: 11, color: "#6B7280" }}>{p.itemCount} items</div>
                        </div>
                        <span style={{ fontSize: 13 }}>{p.date}</span>
                        <span style={{ fontSize: 13 }}>{PAYMENT_META[p.method].icon} {PAYMENT_META[p.method].label}</span>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#1D546D", textAlign: "right" }}>₱{p.amount.toLocaleString()}</span>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: 16, background: "#F3F4F4", borderRadius: 12, padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>Total Spent</span>
                <span style={{ fontSize: 20, fontWeight: 700, color: "#1D546D" }}>₱{totalSpent.toLocaleString()}</span>
            </div>
        </div>
    );
}

// ─── Account Page ─────────────────────────────────────────────────────────────
export function AccountPage() {
    const { navigateTo, orders } = useApp();

    return (
        <div style={{ padding: 24, maxWidth: 600, margin: "0 auto" }}>
            {/* Profile Header */}
            <div style={{ background: "linear-gradient(135deg, #061E29, #1D546D)", borderRadius: 20, padding: 28, color: "#fff", marginBottom: 24, textAlign: "center" }}>
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#5F9598", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, margin: "0 auto 12px" }}>
                    M
                </div>
                <div style={{ fontFamily: "'Varela Round',sans-serif", fontSize: 20 }}>Maria Santos</div>
                <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>maria.santos@email.com · +63 912 345 6789</div>
                <div style={{ marginTop: 10, display: "inline-flex", gap: 6, background: "rgba(255,255,255,0.1)", borderRadius: 20, padding: "5px 14px", fontSize: 12 }}>
                    ⭐ Premium Member
                </div>
            </div>

            {/* Quick Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                {[
                    { icon: "📦", label: "My Orders", sub: `${orders.length} orders`, page: "orders" as const },
                    { icon: "💳", label: "Payment History", sub: `${PAYMENT_HISTORY.length} transactions`, page: "history" as const },
                ].map((card) => (
                    <div
                        key={card.label}
                        onClick={() => navigateTo(card.page)}
                        style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: 16, textAlign: "center", cursor: "pointer" }}
                    >
                        <div style={{ fontSize: 28, marginBottom: 6 }}>{card.icon}</div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{card.label}</div>
                        <div style={{ fontSize: 12, color: "#6B7280" }}>{card.sub}</div>
                    </div>
                ))}
            </div>

            {/* Menu Items */}
            <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, overflow: "hidden" }}>
                {[
                    { icon: "📋", label: "My Prescriptions", action: () => {} },
                    { icon: "📍", label: "Saved Addresses", action: () => {} },
                    { icon: "🔔", label: "Notifications", action: () => {} },
                    { icon: "⚙️", label: "Settings", action: () => {} },
                ].map((item, i, arr) => (
                    <div
                        key={item.label}
                        onClick={item.action}
                        style={{
                            padding: "14px 16px",
                            borderBottom: i < arr.length - 1 ? "1px solid #E5E7EB" : "none",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            cursor: "pointer",
                        }}
                    >
                        <span style={{ fontSize: 14, fontWeight: 500 }}>{item.icon} {item.label}</span>
                        <span style={{ color: "#6B7280" }}>›</span>
                    </div>
                ))}
                <div
                    style={{
                        padding: "14px 16px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        cursor: "pointer",
                        borderTop: "1px solid #E5E7EB",
                    }}
                >
                    <span style={{ fontSize: 14, fontWeight: 500, color: "#EF4444" }}>🚪 Logout</span>
                    <span style={{ color: "#EF4444" }}>›</span>
                </div>
            </div>
        </div>
    );
}