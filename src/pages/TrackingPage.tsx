// ─── Order Tracking Page ──────────────────────────────────────────────────────
import { useApp } from "../hooks/useApp";

type Step = {
    key: string;
    label: string;
    time: string;
    icon: string;
    done?: boolean;
    current?: boolean;
    upcoming?: boolean;
};

export function TrackingPage() {
    const { orders } = useApp();
    const order =
        orders.find((o) => o.status === "out_for_delivery") ?? orders[0];

    const steps: Step[] = [
        { key: "placed",    label: "Order Placed",      time: order.createdAt,                       done: true,    icon: "📋" },
        { key: "confirmed", label: "Order Confirmed",   time: "Pharmacist reviewed",                 done: true,    icon: "✓"  },
        { key: "preparing", label: "Preparing Order",   time: "Medicines packed",                    done: true,    icon: "✓"  },
        { key: "delivery",  label: "Out for Delivery",  time: "En route to your address",            current: true, icon: "🚚" },
        { key: "delivered", label: "Delivered",         time: `Estimated: ${order.estimatedDelivery}`, upcoming: true, icon: "📦" },
    ];

    return (
        <div className="px-6 py-6 max-w-[700px] mx-auto">
            {/* Hero banner */}
            <div
                className="rounded-2xl p-6 text-white mb-6"
                style={{ background: "linear-gradient(135deg, #061E29, #1D546D)" }}
            >
                <div className="text-[12px] opacity-70 mb-1 epilogue-regular">
                    Order #{order.id}
                </div>
                <h2 className="epilogue-header text-[22px] font-bold text-white mb-1">
                    Tracking Your Order
                </h2>
                <div className="text-[13px] opacity-80 epilogue-regular">
                    Estimated delivery: {order.estimatedDelivery}
                </div>

                <div className="flex gap-3 mt-4 flex-wrap">
                    {[
                        { label: "Rider",   value: order.rider?.name  ?? "Assigned" },
                        { label: "Contact", value: order.rider?.phone ?? "—"        },
                        { label: "Items",   value: `${order.items.length} items`    },
                    ].map(({ label, value }) => (
                        <div
                            key={label}
                            className="rounded-lg px-3.5 py-2"
                            style={{ background: "rgba(255,255,255,0.12)" }}
                        >
                            <div className="text-[11px] opacity-70 epilogue-regular">{label}</div>
                            <div className="text-[13px] font-semibold epilogue-header">{value}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Step timeline */}
            <div className="mb-6">
                {steps.map((step, i) => {
                    const isLast   = i === steps.length - 1;
                    const isDone    = !!step.done;
                    const isCurrent = !!step.current;

                    const dotBg    = isDone ? "#5F9598" : isCurrent ? "#1D546D" : "#E5E7EB";
                    const dotColor = isDone || isCurrent ? "#fff" : "#6B7280";
                    const lineBg   = isDone ? "#5F9598" : "#E5E7EB";
                    const labelColor = isCurrent
                        ? "#1D546D"
                        : isDone
                            ? "#262626"
                            : "#6B7280";

                    return (
                        <div key={step.key} className="flex gap-4">
                            {/* Dot + connector */}
                            <div className="flex flex-col items-center">
                                <div
                                    className="w-9 h-9 rounded-full flex items-center justify-center text-[14px] font-bold shrink-0"
                                    style={{
                                        background: dotBg,
                                        color: dotColor,
                                        boxShadow: isCurrent
                                            ? "0 0 0 6px rgba(29,84,109,0.12)"
                                            : undefined,
                                    }}
                                >
                                    {step.icon}
                                </div>
                                {!isLast && (
                                    <div
                                        className="w-0.5 flex-1 min-h-[32px] my-1"
                                        style={{ background: lineBg }}
                                    />
                                )}
                            </div>

                            {/* Text */}
                            <div className={isLast ? "pb-0" : "pb-6"}>
                                <h4
                                    className="text-[14px] font-semibold epilogue-header"
                                    style={{ color: labelColor }}
                                >
                                    {step.label}
                                </h4>
                                <p className="text-[12px] text-[#9CA3AF] mt-0.5 epilogue-regular">
                                    {step.time}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Order items summary */}
            <div className="bg-[#F3F4F4] rounded-[14px] p-4">
                <h4 className="text-[14px] font-bold epilogue-header text-[#262626] mb-3">
                    Order Items
                </h4>
                {order.items.map((item) => (
                    <div
                        key={item.product.id}
                        className="flex justify-between text-[13px] py-1.5 border-b border-[#E5E7EB] epilogue-regular"
                    >
                        <span>
                            {item.product.brandName} ×{item.quantity}
                        </span>
                        <span>₱{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                ))}
                <div className="flex justify-between pt-2.5 text-[14px] font-bold epilogue-header">
                    <span>Total Paid</span>
                    <span className="text-[#1D546D]">₱{order.total.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
}