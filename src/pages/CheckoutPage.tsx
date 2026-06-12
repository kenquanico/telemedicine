import { useState } from "react";
import { useApp } from "../hooks/useApp";
import type { PaymentMethod } from "../types";
import { PAYMENT_META } from "../data/mockData";
import { Btn } from "../components/UI";
import { Banknote, CheckCircle2, CreditCard, MapPin, ShieldCheck, Smartphone } from "lucide-react";

const DELIVERY_FEE = 49;
const DISCOUNT = 28;

const METHOD_ICON: Record<PaymentMethod, React.ElementType> = {
    cod: Banknote,
    gcash: Smartphone,
    maya: Smartphone,
    credit_card: CreditCard,
};

function Field({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <label className="grid gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#262626]/60 epilogue-header">
                {label}
            </span>
            <input
                defaultValue={value}
                className="h-11 w-full rounded-[14px] border border-[#E5E7EB] bg-white px-3.5 text-[14px] font-medium text-[#262626] outline-none transition-colors focus:border-[#427b77] focus:ring-4 focus:ring-[#427b77]/10 epilogue-regular"
            />
        </label>
    );
}

export default function CheckoutPage() {
    const { cartItems, cartTotal, navigateTo, addresses, selectedAddressId, showModal } = useApp();
    const address = addresses.find((a) => a.id === selectedAddressId) ?? addresses[0];
    const [payment, setPayment] = useState<PaymentMethod>("cod");
    const total = cartTotal + DELIVERY_FEE - DISCOUNT;

    const handlePlaceOrder = () => {
        showModal({
            type: "success",
            icon: <CheckCircle2 size={30} strokeWidth={1.8} className="text-[#427b77]" />,
            title: "Order Placed!",
            message: "Your order #MM-20250601 has been placed. Estimated delivery: Today, 2–4 PM.",
            actionLabel: "Track My Order",
            onAction: () => navigateTo("tracking"),
        });
    };

    return (
        <div className="min-h-screen bg-[#F3F4F4] px-4 py-6 sm:px-6 lg:py-8">
            <div className="mx-auto max-w-6xl">
                <div className="mb-6">
                    <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#427b77] epilogue-header">
                        Secure Checkout
                    </p>
                    <h2 className="mt-1 text-[24px] font-extrabold leading-tight text-[#262626] epilogue-header">
                        Checkout
                    </h2>
                </div>

                <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
                    <div className="grid gap-5">
                        <section className="rounded-[14px] border border-[#E5E7EB] bg-white p-5">
                            <div className="mb-5 flex items-center gap-3">
                                <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#F3F4F4] text-[#427b77]">
                                    <MapPin size={20} strokeWidth={1.8} />
                                </span>
                                <div>
                                    <h3 className="text-[16px] font-extrabold text-[#262626] epilogue-header">
                                        Delivery Address
                                    </h3>
                                    <p className="mt-0.5 text-[12px] text-[#262626]/55 epilogue-regular">
                                        Confirm where your medicines should be delivered.
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-3.5 sm:grid-cols-2">
                                <Field label="First Name" value={address.firstName} />
                                <Field label="Last Name" value={address.lastName} />
                                <div className="sm:col-span-2">
                                    <Field label="Address Line" value={address.line} />
                                </div>
                                <Field label="City" value={address.city} />
                                <Field label="ZIP Code" value={address.zip} />
                                <div className="sm:col-span-2">
                                    <Field label="Phone Number" value={address.phone} />
                                </div>
                            </div>
                        </section>

                        <section className="rounded-[14px] border border-[#E5E7EB] bg-white p-5">
                            <h3 className="mb-3.5 text-[16px] font-extrabold text-[#262626] epilogue-header">
                                Payment Method
                            </h3>
                            <div className="grid gap-2.5">
                                {(Object.keys(PAYMENT_META) as PaymentMethod[]).map((key) => {
                                    const active = payment === key;
                                    const Icon = METHOD_ICON[key];
                                    return (
                                        <button
                                            key={key}
                                            type="button"
                                            onClick={() => setPayment(key)}
                                            className={[
                                                "flex w-full items-center gap-3 rounded-[14px] border px-4 py-3.5 text-left transition-colors duration-150",
                                                active
                                                    ? "border-[#427b77] bg-[#F3F4F4]"
                                                    : "border-[#E5E7EB] bg-white hover:border-[#5F9598]",
                                            ].join(" ")}
                                        >
                                            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] ${active ? "bg-[#EAF3F5] text-[#1D546D]" : "bg-[#F3F4F4] text-[#427b77]"}`}>
                                                <Icon size={20} strokeWidth={1.8} />
                                            </span>
                                            <span className="min-w-0 flex-1">
                                                <span className="block text-[14px] font-bold text-[#262626] epilogue-header">
                                                    {PAYMENT_META[key].label}
                                                </span>
                                                <span className="mt-1 block text-[12px] text-[#262626]/50 epilogue-regular">
                                                    {key === "cod" ? "Pay when your order arrives" : "Confirm using your linked wallet or card"}
                                                </span>
                                            </span>
                                            <span className={`flex h-5 w-5 items-center justify-center rounded-full border ${active ? "border-[#427b77] bg-[#427b77]" : "border-[#D1D5DB]"}`}>
                                                {active && <CheckCircle2 size={14} strokeWidth={2.4} className="text-white" />}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>
                    </div>

                    <aside className="rounded-[14px] border border-[#E5E7EB] bg-white p-5 lg:sticky lg:top-[120px]">
                        <h3 className="mb-4 text-[16px] font-extrabold text-[#262626] epilogue-header">
                            Order Summary
                        </h3>

                        <div className="mb-5 rounded-[14px] border border-[#E5E7EB] bg-[#F3F4F4] p-3.5">
                            <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#262626]/60 epilogue-header">
                                {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
                            </p>
                            <div className="grid gap-2.5">
                                {cartItems.map((item) => (
                                    <div key={item.product.id} className="flex items-center justify-between gap-3">
                                        <div className="flex min-w-0 items-center gap-2.5">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[10px] border border-[#E5E7EB] bg-white">
                                                <img
                                                    src={item.product.image}
                                                    alt={item.product.brandName}
                                                    className="h-full w-full scale-[1.18] object-contain"
                                                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                                                />
                                            </div>
                                            <span className="truncate text-[13px] font-bold text-[#262626] epilogue-header">
                                                {item.product.brandName} x{item.quantity}
                                            </span>
                                        </div>
                                        <span className="shrink-0 text-[13px] font-bold text-[#262626] epilogue-header">
                                            ₱{(item.product.price * item.quantity).toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mb-4 grid gap-3">
                            {[
                                { label: "Subtotal", value: `₱${cartTotal.toLocaleString()}`, className: "text-[#262626]" },
                                { label: "Delivery", value: `₱${DELIVERY_FEE}`, className: "text-[#262626]/60" },
                                { label: "Discount", value: `-₱${DISCOUNT}`, className: "text-[#427b77]" },
                            ].map((row) => (
                                <div key={row.label} className="flex items-center justify-between text-[13px]">
                                    <span className="text-[#262626]/65 epilogue-regular">{row.label}</span>
                                    <span className={`font-bold epilogue-header ${row.className}`}>{row.value}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mb-5 border-t border-[#E5E7EB] pt-4">
                            <div className="flex items-baseline justify-between">
                                <span className="text-[15px] font-extrabold text-[#262626] epilogue-header">Total</span>
                                <span className="text-[22px] font-extrabold text-[#1D546D] epilogue-header">
                                    ₱{total.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <Btn variant="primary" size="lg" fullWidth onClick={handlePlaceOrder}>
                            Place Order
                        </Btn>

                        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-[#262626]/45 epilogue-regular">
                            <ShieldCheck size={12} strokeWidth={2} />
                            Your data is encrypted and secure
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
