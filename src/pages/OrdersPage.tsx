// ─── Orders Page ──────────────────────────────────────────────────────────────
import { useState } from "react";
import { useApp } from "../hooks/useApp";
import { ORDERS, PAYMENT_META } from "../data/mockData";
import { StatusBadge, Btn } from "../components/UI";
import type { OrderStatus } from "../types";

const TABS: { key: OrderStatus | "all"; label: string }[] = [
    { key: "all",              label: "All Orders"       },
    { key: "pending",          label: "Pending"          },
    { key: "preparing",        label: "Preparing"        },
    { key: "out_for_delivery", label: "Out for Delivery" },
    { key: "delivered",        label: "Delivered"        },
];

export function OrdersPage() {
    const { navigateTo, setSelectedOrderId } = useApp();
    const [filter, setFilter] = useState<OrderStatus | "all">("all");

    const filtered =
        filter === "all" ? ORDERS : ORDERS.filter((o) => o.status === filter);

    return (
        <div className="px-6 py-6 max-w-2xl mx-auto">
            {/* Title */}
            <h2 className="epilogue-header text-[22px] font-bold text-[#262626] mb-5">
                My Orders
            </h2>

            {/* Filter tabs */}
            <div className="flex gap-2 mb-6 flex-wrap">
                {TABS.map((t) => {
                    const active = filter === t.key;
                    return (
                        <button
                            key={t.key}
                            onClick={() => setFilter(t.key)}
                            className={[
                                "rounded-full px-4 py-1.5 text-[13px] cursor-pointer transition-all duration-150 border epilogue-regular",
                                active
                                    ? "bg-[#1D546D] text-white border-[#1D546D] font-semibold"
                                    : "bg-white text-[#262626] border-[#E5E7EB] font-normal hover:border-[#1D546D]/40",
                            ].join(" ")}
                        >
                            {t.label}
                        </button>
                    );
                })}
            </div>

            {/* Order cards */}
            <div className="flex flex-col gap-3.5">
                {filtered.length === 0 && (
                    <p className="text-center text-sm text-[#9CA3AF] py-12 epilogue-regular">
                        No orders found.
                    </p>
                )}
                {filtered.map((order) => (
                    <div
                        key={order.id}
                        className="bg-white border border-[#E5E7EB] rounded-[14px] p-[18px]"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center mb-3">
                            <div>
                                <div className="text-[15px] font-bold text-[#262626] epilogue-header">
                                    Order #{order.id}
                                </div>
                                <div className="text-[13px] text-[#6B7280] epilogue-regular mt-0.5">
                                    {order.createdAt}
                                </div>
                            </div>
                            <StatusBadge status={order.status} />
                        </div>

                        {/* Item chips */}
                        <div className="flex gap-2 mb-3.5 flex-wrap">
                            {order.items.map((item) => (
                                <span
                                    key={item.product.id}
                                    className="bg-[#F3F4F4] rounded-md px-2.5 py-1 text-[12px] text-[#262626] epilogue-regular"
                                >
                                    {item.product.brandName} ×{item.quantity}
                                </span>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="flex justify-between items-center pt-3 border-t border-[#E5E7EB]">
                            <div className="text-[14px] font-bold text-[#1D546D] epilogue-header">
                                ₱{order.total.toLocaleString()} ·{" "}
                                {PAYMENT_META[order.paymentMethod].label}
                            </div>
                            <div className="flex gap-2">
                                {order.status === "out_for_delivery" && (
                                    <Btn
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setSelectedOrderId(order.id);
                                            navigateTo("tracking");
                                        }}
                                    >
                                        Track Order
                                    </Btn>
                                )}
                                <Btn variant="outline" size="sm">
                                    Reorder
                                </Btn>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}