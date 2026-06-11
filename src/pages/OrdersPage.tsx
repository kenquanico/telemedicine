// ─── Orders Page ──────────────────────────────────────────────────────────────
import { useState } from "react";
import { Clock, PackageCheck, PackageSearch, RotateCcw, Truck } from "lucide-react";
import { useApp } from "../hooks/useApp";
import { ORDERS, PAYMENT_META } from "../data/mockData";
import type { OrderStatus } from "../types";

const TABS: { key: OrderStatus | "all"; label: string }[] = [
    { key: "all",              label: "All Orders"       },
    { key: "pending",          label: "Pending"          },
    { key: "preparing",        label: "Preparing"        },
    { key: "out_for_delivery", label: "Out for Delivery" },
    { key: "delivered",        label: "Delivered"        },
];

const STATUS_STYLE: Record<OrderStatus, { label: string; accent: string; bg: string; text: string }> = {
    pending:          { label: "Pending",          accent: "#D97706", bg: "#FFF7ED", text: "#9A3412" },
    preparing:        { label: "Preparing",        accent: "#427b77", bg: "#EEF7F6", text: "#1D546D" },
    out_for_delivery: { label: "Out for Delivery", accent: "#1D546D", bg: "#EAF3F5", text: "#1D546D" },
    delivered:        { label: "Delivered",        accent: "#5F9598", bg: "#F0F7F6", text: "#427b77" },
    cancelled:        { label: "Cancelled",        accent: "#DC2626", bg: "#FEF2F2", text: "#B91C1C" },
};

function statusIcon(status: OrderStatus) {
    if (status === "out_for_delivery") return <Truck size={14} strokeWidth={2} />;
    if (status === "delivered") return <PackageCheck size={14} strokeWidth={2} />;
    if (status === "preparing") return <PackageSearch size={14} strokeWidth={2} />;
    return <Clock size={14} strokeWidth={2} />;
}

export function OrdersPage() {
    const { navigateTo, setSelectedOrderId } = useApp();
    const [filter, setFilter] = useState<OrderStatus | "all">("all");

    const filtered =
        filter === "all" ? ORDERS : ORDERS.filter((o) => o.status === filter);

    return (
        <div className="min-h-screen bg-[#F3F4F4] px-4 py-6 sm:px-6">
            <div className="mx-auto max-w-3xl">
                <div className="mb-5 flex flex-col gap-1">
                    <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#427b77] epilogue-header">
                        Dosely Orders
                    </p>
                    <h2 className="text-[24px] font-extrabold leading-tight text-[#262626] epilogue-header">
                        My Orders
                    </h2>
                </div>

                <div className="mb-6 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {TABS.map((t) => {
                        const active = filter === t.key;
                        return (
                            <button
                                key={t.key}
                                onClick={() => setFilter(t.key)}
                                className={[
                                    "shrink-0 rounded-full border px-4 py-2 text-[13px] transition-colors duration-150 epilogue-regular",
                                    active
                                        ? "border-[#1D546D] bg-white font-bold text-[#1D546D]"
                                        : "border-[#E5E7EB] bg-white font-medium text-[#262626]/65 hover:border-[#5F9598] hover:text-[#262626]",
                                ].join(" ")}
                            >
                                {t.label}
                            </button>
                        );
                    })}
                </div>

                <div className="flex flex-col gap-4">
                    {filtered.length === 0 && (
                        <div className="rounded-[14px] border border-[#E5E7EB] bg-white px-5 py-12 text-center">
                            <PackageSearch size={30} strokeWidth={1.6} className="mx-auto mb-3 text-[#427b77]" />
                            <p className="text-sm text-[#262626]/55 epilogue-regular">No orders found.</p>
                        </div>
                    )}

                    {filtered.map((order) => {
                        const status = STATUS_STYLE[order.status];
                        const previewItems = order.items.slice(0, 3);
                        const extraItems = order.items.length - previewItems.length;

                        return (
                            <article
                                key={order.id}
                                className="overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-white"
                                style={{ borderLeft: `5px solid ${status.accent}` }}
                            >
                                <div className="p-4 sm:p-5">
                                    <div className="mb-4 flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="text-[15px] font-extrabold text-[#262626] epilogue-header">
                                                Order #{order.id}
                                            </p>
                                            <p className="mt-1 text-[13px] text-[#262626]/55 epilogue-regular">
                                                {order.createdAt}
                                            </p>
                                        </div>
                                        <span
                                            className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-bold epilogue-header"
                                            style={{ background: status.bg, color: status.text }}
                                        >
                                            {statusIcon(order.status)}
                                            {status.label}
                                        </span>
                                    </div>

                                    <div className="mb-4 flex items-center gap-3 overflow-hidden">
                                        <div className="flex shrink-0 -space-x-2">
                                            {previewItems.map((item) => (
                                                <img
                                                    key={item.product.id}
                                                    src={item.product.image}
                                                    alt={item.product.brandName}
                                                    className="h-12 w-12 rounded-xl border-2 border-white bg-[#F3F4F4] object-cover"
                                                />
                                            ))}
                                            {extraItems > 0 && (
                                                <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-white bg-[#F3F4F4] text-[12px] font-bold text-[#427b77] epilogue-header">
                                                    +{extraItems}
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-[14px] font-bold text-[#262626] epilogue-header">
                                                {order.items.map((item) => item.product.brandName).join(", ")}
                                            </p>
                                            <p className="mt-1 text-[12px] text-[#262626]/55 epilogue-regular">
                                                {order.items.reduce((sum, item) => sum + item.quantity, 0)} items · {PAYMENT_META[order.paymentMethod].label}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3 border-t border-[#E5E7EB] pt-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-[12px] text-[#262626]/50 epilogue-regular">Total paid</p>
                                            <p className="mt-1 text-[18px] font-extrabold text-[#1D546D] epilogue-header">
                                                ₱{order.total.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            {order.status === "out_for_delivery" && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedOrderId(order.id);
                                                        navigateTo("tracking");
                                                    }}
                                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1D546D] px-4 py-2.5 text-[12px] font-bold text-white transition-colors duration-150 hover:bg-[#427b77] epilogue-header"
                                                >
                                                    <Truck size={15} strokeWidth={2} />
                                                    Track
                                                </button>
                                            )}
                                            <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-[12px] font-bold text-[#427b77] transition-colors duration-150 hover:border-[#5F9598] epilogue-header">
                                                <RotateCcw size={15} strokeWidth={2} />
                                                Reorder
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
