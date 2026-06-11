// ─── Order Tracking Page ──────────────────────────────────────────────────────
import { Check, Clock, MapPin, Navigation, Package, PackageCheck, Truck } from "lucide-react";
import type { ReactNode } from "react";
import { useApp } from "../hooks/useApp";

type Step = {
    key: string;
    label: string;
    time: string;
    done?: boolean;
    current?: boolean;
};

const stepIcon: Record<string, ReactNode> = {
    placed:    <Package size={15} strokeWidth={2} />,
    confirmed: <Check size={15} strokeWidth={2.4} />,
    preparing: <PackageCheck size={15} strokeWidth={2} />,
    delivery:  <Truck size={15} strokeWidth={2} />,
    delivered: <Check size={15} strokeWidth={2.4} />,
};

export function TrackingPage() {
    const { orders, selectedOrderId } = useApp();
    const order =
        orders.find((o) => o.id === selectedOrderId) ??
        orders.find((o) => o.status === "out_for_delivery") ??
        orders[0];

    const steps: Step[] = [
        { key: "placed",    label: "Order Placed",     time: order.createdAt,                    done: true },
        { key: "confirmed", label: "Order Confirmed",  time: "Pharmacist reviewed your order",   done: true },
        { key: "preparing", label: "Preparing Order",  time: "Medicines packed and sealed",      done: true },
        { key: "delivery",  label: "Out for Delivery", time: "Rider is heading to your address", current: true },
        { key: "delivered", label: "Delivered",        time: `Estimated: ${order.estimatedDelivery}` },
    ];

    return (
        <div className="min-h-screen bg-[#F3F4F4] px-4 py-6 sm:px-6">
            <div className="mx-auto max-w-[760px]">
                <div className="mb-5 rounded-[14px] border border-[#E5E7EB] bg-white p-5">
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#427b77] epilogue-header">
                                Order #{order.id}
                            </p>
                            <h2 className="mt-1 text-[24px] font-extrabold leading-tight text-[#262626] epilogue-header">
                                Tracking Your Order
                            </h2>
                            <p className="mt-2 text-[13px] text-[#262626]/60 epilogue-regular">
                                Estimated delivery: {order.estimatedDelivery}
                            </p>
                        </div>
                        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#EAF3F5] px-3.5 py-2 text-[12px] font-bold text-[#1D546D] epilogue-header">
                            <Clock size={14} strokeWidth={2} />
                            Live status
                        </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                        {[
                            { label: "Rider",   value: order.rider?.name  ?? "Assigned soon" },
                            { label: "Contact", value: order.rider?.phone ?? "Awaiting rider" },
                            { label: "Items",   value: `${order.items.length} item${order.items.length === 1 ? "" : "s"}` },
                        ].map(({ label, value }) => (
                            <div key={label} className="rounded-[14px] border border-[#E5E7EB] bg-[#F3F4F4] px-4 py-3">
                                <p className="text-[11px] text-[#262626]/50 epilogue-regular">{label}</p>
                                <p className="mt-1 truncate text-[13px] font-bold text-[#262626] epilogue-header">{value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mb-5 rounded-[14px] border border-[#E5E7EB] bg-white p-5">
                    <h3 className="mb-5 text-[16px] font-extrabold text-[#262626] epilogue-header">
                        Delivery Timeline
                    </h3>
                    {steps.map((step, i) => {
                        const isLast = i === steps.length - 1;
                        const dotClass = step.current
                            ? "bg-[#1D546D] text-white"
                            : step.done
                                ? "bg-[#5F9598] text-white"
                                : "bg-[#F3F4F4] text-[#262626]/45";
                        const lineClass = step.done ? "bg-[#5F9598]" : "bg-[#E5E7EB]";

                        return (
                            <div key={step.key} className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="relative">
                                        {step.current && (
                                            <span className="absolute inset-0 rounded-full bg-[#1D546D]/20 animate-ping" />
                                        )}
                                        <div className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${dotClass}`}>
                                            {stepIcon[step.key]}
                                        </div>
                                    </div>
                                    {!isLast && <div className={`my-1 min-h-[38px] w-0.5 flex-1 ${lineClass}`} />}
                                </div>

                                <div className={isLast ? "pb-0" : "pb-6"}>
                                    <h4 className={`text-[14px] font-bold epilogue-header ${step.current ? "text-[#1D546D]" : "text-[#262626]"}`}>
                                        {step.label}
                                    </h4>
                                    <p className="mt-1 text-[12px] leading-relaxed text-[#262626]/55 epilogue-regular">
                                        {step.time}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mb-5 overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-white">
                    <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4">
                        <div>
                            <h3 className="text-[16px] font-extrabold text-[#262626] epilogue-header">Delivery Map</h3>
                            <p className="mt-1 text-[12px] text-[#262626]/55 epilogue-regular">{order.address.line}, {order.address.city}</p>
                        </div>
                        <Navigation size={19} strokeWidth={1.8} className="text-[#427b77]" />
                    </div>
                    <div className="relative h-[220px] bg-[#F3F4F4]">
                        <div className="absolute left-0 top-1/2 h-px w-full bg-[#DCE6E4]" />
                        <div className="absolute top-0 left-1/2 h-full w-px bg-[#DCE6E4]" />
                        <div className="absolute left-[18%] top-[30%] h-24 w-24 rounded-full border border-[#DCE6E4]" />
                        <div className="absolute bottom-[18%] right-[16%] h-28 w-28 rounded-full border border-[#DCE6E4]" />
                        <div className="absolute left-[26%] top-[34%] flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-3 py-2">
                            <Truck size={15} strokeWidth={2} className="text-[#1D546D]" />
                            <span className="text-[12px] font-bold text-[#262626] epilogue-header">Rider</span>
                        </div>
                        <div className="absolute bottom-[24%] right-[20%] flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-3 py-2">
                            <MapPin size={15} strokeWidth={2} className="text-[#427b77]" />
                            <span className="text-[12px] font-bold text-[#262626] epilogue-header">You</span>
                        </div>
                    </div>
                </div>

                <div className="rounded-[14px] border border-[#E5E7EB] bg-white p-5">
                    <h3 className="mb-3 text-[16px] font-extrabold text-[#262626] epilogue-header">
                        Order Items
                    </h3>
                    {order.items.map((item) => (
                        <div
                            key={item.product.id}
                            className="flex items-center justify-between gap-3 border-b border-[#E5E7EB] py-3 last:border-b-0"
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                <img
                                    src={item.product.image}
                                    alt={item.product.brandName}
                                    className="h-11 w-11 rounded-xl border border-[#E5E7EB] bg-[#F3F4F4] object-cover"
                                />
                                <div className="min-w-0">
                                    <p className="truncate text-[13px] font-bold text-[#262626] epilogue-header">{item.product.brandName}</p>
                                    <p className="mt-0.5 text-[12px] text-[#262626]/50 epilogue-regular">Qty {item.quantity}</p>
                                </div>
                            </div>
                            <span className="shrink-0 text-[13px] font-bold text-[#1D546D] epilogue-header">
                                ₱{(item.price * item.quantity).toLocaleString()}
                            </span>
                        </div>
                    ))}
                    <div className="mt-3 flex justify-between border-t border-[#E5E7EB] pt-4 text-[15px] font-extrabold epilogue-header">
                        <span className="text-[#262626]">Total Paid</span>
                        <span className="text-[#1D546D]">₱{order.total.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
