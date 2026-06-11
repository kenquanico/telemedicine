// ─── Payment Page ─────────────────────────────────────────────────────────────
import { useState } from "react";
import { Banknote, CheckCircle2, CreditCard, ReceiptText, Smartphone } from "lucide-react";
import type { ReactNode } from "react";
import { useApp } from "../hooks/useApp";
import { PAYMENT_META } from "../data/mockData";
import type { PaymentMethod } from "../types";

const DELIVERY_FEE = 49;
const DISCOUNT     = 28;

const METHOD_ICON: Record<PaymentMethod, ReactNode> = {
    cod:         <Banknote size={20} strokeWidth={1.8} />,
    gcash:       <Smartphone size={20} strokeWidth={1.8} />,
    maya:        <Smartphone size={20} strokeWidth={1.8} />,
    credit_card: <CreditCard size={20} strokeWidth={1.8} />,
};

export function PaymentPage() {
    const { cartItems, cartTotal, orders, navigateTo, showModal } = useApp();
    const [selected, setSelected] = useState<PaymentMethod>("cod");

    const order = orders[0];
    const subtotal = cartItems.length > 0 ? cartTotal : order.subtotal;
    const total = subtotal + DELIVERY_FEE - DISCOUNT;
    const displayItems =
        cartItems.length > 0
            ? cartItems.map((i) => ({
                id:     i.product.id,
                name:   `${i.product.brandName} ${i.product.strength}`,
                qty:    i.quantity,
                amount: i.product.price * i.quantity,
            }))
            : order.items.map((i) => ({
                id:     i.product.id,
                name:   i.product.brandName,
                qty:    i.quantity,
                amount: i.price * i.quantity,
            }));

    return (
        <div className="min-h-screen bg-[#F3F4F4] px-4 py-6 pb-28 sm:px-6">
            <div className="mx-auto max-w-[720px]">
                <div className="mb-5">
                    <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#427b77] epilogue-header">
                        Secure Checkout
                    </p>
                    <h2 className="mt-1 text-[24px] font-extrabold leading-tight text-[#262626] epilogue-header">
                        Payment
                    </h2>
                </div>

                <div className="mb-5 rounded-[14px] border border-dashed border-[#BFD4D1] bg-white">
                    <div className="flex items-start justify-between gap-4 border-b border-dashed border-[#BFD4D1] p-5">
                        <div className="flex items-start gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#F3F4F4] text-[#427b77]">
                                <ReceiptText size={22} strokeWidth={1.8} />
                            </div>
                            <div>
                                <h3 className="text-[18px] font-extrabold text-[#262626] epilogue-header">Dosely Receipt</h3>
                                <p className="mt-1 text-[12px] text-[#262626]/55 epilogue-regular">Invoice #INV-20250601-001</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[12px] text-[#262626]/50 epilogue-regular">Date</p>
                            <p className="mt-1 text-[13px] font-bold text-[#262626] epilogue-header">Jun 1, 2025</p>
                        </div>
                    </div>

                    <div className="p-5">
                        {displayItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-start justify-between gap-4 border-b border-dashed border-[#E5E7EB] py-3 first:pt-0"
                            >
                                <div className="min-w-0">
                                    <p className="truncate text-[14px] font-bold text-[#262626] epilogue-header">{item.name}</p>
                                    <p className="mt-1 text-[12px] text-[#262626]/50 epilogue-regular">Quantity {item.qty}</p>
                                </div>
                                <span className="shrink-0 text-[14px] font-bold text-[#262626] epilogue-header">
                                    ₱{item.amount.toLocaleString()}
                                </span>
                            </div>
                        ))}

                        <div className="mt-3 space-y-2 border-b border-dashed border-[#BFD4D1] pb-4">
                            <div className="flex justify-between text-[14px] text-[#262626]/65 epilogue-regular">
                                <span>Subtotal</span>
                                <span>₱{subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-[14px] text-[#262626]/65 epilogue-regular">
                                <span>Delivery Fee</span>
                                <span>₱{DELIVERY_FEE}</span>
                            </div>
                            <div className="flex justify-between text-[14px] text-[#427b77] epilogue-regular">
                                <span>Discount</span>
                                <span>-₱{DISCOUNT}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4">
                            <span className="text-[15px] font-extrabold text-[#262626] epilogue-header">Total</span>
                            <span className="text-[24px] font-extrabold text-[#1D546D] epilogue-header">
                                ₱{total.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="rounded-[14px] border border-[#E5E7EB] bg-white p-5">
                    <h3 className="mb-3.5 text-[16px] font-extrabold text-[#262626] epilogue-header">
                        Select Payment Method
                    </h3>
                    <div className="space-y-2.5">
                        {(Object.keys(PAYMENT_META) as PaymentMethod[]).map((key) => {
                            const active = selected === key;
                            return (
                                <button
                                    key={key}
                                    onClick={() => setSelected(key)}
                                    className={[
                                        "flex w-full items-center gap-3 rounded-[14px] border px-4 py-3.5 text-left transition-colors duration-150",
                                        active
                                            ? "border-[#427b77] bg-[#F3F4F4]"
                                            : "border-[#E5E7EB] bg-white hover:border-[#5F9598]",
                                    ].join(" ")}
                                >
                                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${active ? "bg-[#EAF3F5] text-[#1D546D]" : "bg-[#F3F4F4] text-[#427b77]"}`}>
                                        {METHOD_ICON[key]}
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block text-[14px] font-bold text-[#262626] epilogue-header">
                                            {PAYMENT_META[key].label}
                                        </span>
                                        <span className="mt-1 block text-[12px] text-[#262626]/50 epilogue-regular">
                                            {key === "cod" ? "Pay when your medicines arrive" : "Confirm using your linked wallet or card"}
                                        </span>
                                    </span>
                                    <span className={`flex h-5 w-5 items-center justify-center rounded-full border ${active ? "border-[#427b77] bg-[#427b77]" : "border-[#D1D5DB]"}`}>
                                        {active && <CheckCircle2 size={14} strokeWidth={2.4} className="text-white" />}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#E5E7EB] bg-white/95 px-4 py-3 backdrop-blur sm:px-6">
                <div className="mx-auto flex max-w-[720px] items-center gap-3">
                    <div className="min-w-0 flex-1">
                        <p className="text-[11px] text-[#262626]/50 epilogue-regular">Pay with {PAYMENT_META[selected].label}</p>
                        <p className="mt-1 text-[18px] font-extrabold text-[#1D546D] epilogue-header">₱{total.toLocaleString()}</p>
                    </div>
                    <button
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#1D546D] px-5 py-3 text-[13px] font-bold text-white transition-colors duration-150 hover:bg-[#427b77] epilogue-header"
                        onClick={() =>
                            showModal({
                                type:        "success",
                                icon:        <CheckCircle2 size={30} strokeWidth={1.8} className="text-[#427b77]" />,
                                title:       "Payment Confirmed",
                                message:     `Payment of ₱${total.toLocaleString()} via ${PAYMENT_META[selected].label} has been confirmed.`,
                                actionLabel: "View Orders",
                                onAction:    () => navigateTo("orders"),
                            })
                        }
                    >
                        <CheckCircle2 size={17} strokeWidth={2} />
                        Confirm Payment
                    </button>
                </div>
            </div>
        </div>
    );
}
