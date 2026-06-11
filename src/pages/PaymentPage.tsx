// ─── Payment Page ─────────────────────────────────────────────────────────────
import { useState } from "react";
import { useApp } from "../hooks/useApp";
import { PAYMENT_META } from "../data/mockData";
import { Btn } from "../components/UI";
import type { PaymentMethod } from "../types";

const DELIVERY_FEE = 49;
const DISCOUNT     = 28;

export function PaymentPage() {
    const { cartItems, cartTotal, orders, navigateTo, showModal } = useApp();
    const [selected, setSelected] = useState<PaymentMethod>("cod");

    const total = cartTotal + DELIVERY_FEE - DISCOUNT;

    // Fall back to latest order when cart is empty
    const order = orders[0];
    const displayItems =
        cartItems.length > 0
            ? cartItems.map((i) => ({
                name:   `${i.product.brandName} ${i.product.strength} ×${i.quantity}`,
                amount: i.product.price * i.quantity,
            }))
            : order.items.map((i) => ({
                name:   `${i.product.brandName} ×${i.quantity}`,
                amount: i.price * i.quantity,
            }));

    return (
        <div className="px-6 py-6 max-w-[700px] mx-auto">
            <h2 className="epilogue-header text-[22px] font-bold text-[#262626] mb-5">
                Payment
            </h2>

            {/* Invoice card */}
            <div className="bg-[#F3F4F4] rounded-xl p-5 mb-4">
                <div className="flex justify-between items-start mb-3.5">
                    <div>
                        <div className="epilogue-header text-[18px] font-bold text-[#262626]">
                            ➕ MediMart
                        </div>
                        <div className="text-[12px] text-[#6B7280] epilogue-regular mt-0.5">
                            Invoice #INV-20250601-001
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-[12px] text-[#6B7280] epilogue-regular">Date</div>
                        <div className="text-[13px] font-semibold epilogue-header">Jun 1, 2025</div>
                    </div>
                </div>

                {/* Line items */}
                {displayItems.map((item) => (
                    <div
                        key={item.name}
                        className="flex justify-between text-[14px] py-2 border-b border-[#E5E7EB] epilogue-regular"
                    >
                        <span>{item.name}</span>
                        <span>₱{item.amount.toLocaleString()}</span>
                    </div>
                ))}
                <div className="flex justify-between text-[14px] py-2 border-b border-[#E5E7EB] text-[#6B7280] epilogue-regular">
                    <span>Delivery Fee</span>
                    <span>₱{DELIVERY_FEE}</span>
                </div>
                <div className="flex justify-between text-[14px] py-2 border-b border-[#E5E7EB] text-[#10B981] epilogue-regular">
                    <span>Discount</span>
                    <span>−₱{DISCOUNT}</span>
                </div>
                <div className="flex justify-between text-[16px] font-bold py-2.5 epilogue-header">
                    <span>Total</span>
                    <span className="text-[#1D546D]">₱{total.toLocaleString()}</span>
                </div>
            </div>

            {/* Payment method selector */}
            <div className="bg-white border border-[#E5E7EB] rounded-[14px] p-5 mb-4">
                <h3 className="text-[15px] font-bold epilogue-header text-[#262626] mb-3.5">
                    Select Payment Method
                </h3>
                {(
                    Object.entries(PAYMENT_META) as [
                        PaymentMethod,
                        { label: string; icon: string }
                    ][]
                ).map(([key, meta]) => (
                    <div
                        key={key}
                        onClick={() => setSelected(key)}
                        className="flex items-center gap-3 rounded-[10px] px-3.5 py-3.5 cursor-pointer mb-2.5 transition-all duration-150"
                        style={{
                            border: `2px solid ${selected === key ? "#5F9598" : "#E5E7EB"}`,
                            background: selected === key ? "#E8F4F5" : "#fff",
                        }}
                    >
                        {/* Radio dot */}
                        <div
                            className="w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0"
                            style={{
                                border: `2px solid ${selected === key ? "#5F9598" : "#E5E7EB"}`,
                            }}
                        >
                            {selected === key && (
                                <div className="w-2 h-2 rounded-full bg-[#5F9598]" />
                            )}
                        </div>
                        <span className="text-[20px]">{meta.icon}</span>
                        <span className="text-[14px] font-semibold epilogue-header text-[#262626]">
                            {meta.label}
                        </span>
                    </div>
                ))}
            </div>

            {/* CTA */}
            <Btn
                variant="primary"
                size="lg"
                fullWidth
                onClick={() =>
                    showModal({
                        type:        "success",
                        icon:        "🎉",
                        title:       "Payment Confirmed!",
                        message:     `Payment of ₱${total.toLocaleString()} via ${PAYMENT_META[selected].label} has been confirmed.`,
                        actionLabel: "View Orders",
                        onAction:    () => navigateTo("orders"),
                    })
                }
            >
                Confirm Payment · ₱{total.toLocaleString()}
            </Btn>
        </div>
    );
}