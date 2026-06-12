// ─── Payment History Page ─────────────────────────────────────────────────────
import { Banknote, CalendarDays, CreditCard, ReceiptText, Smartphone, WalletCards } from "lucide-react";
import type { ReactNode } from "react";
import { PAYMENT_HISTORY, PAYMENT_META } from "../data/mockData";
import type { PaymentMethod } from "../types";

const METHOD_ICON: Record<PaymentMethod, ReactNode> = {
    cod:         <Banknote size={18} strokeWidth={1.8} />,
    gcash:       <Smartphone size={18} strokeWidth={1.8} />,
    maya:        <Smartphone size={18} strokeWidth={1.8} />,
    credit_card: <CreditCard size={18} strokeWidth={1.8} />,
};

function monthKey(date: string) {
    return date.split(" ").slice(0, 2).join(" ");
}

export function PaymentHistoryPage() {
    const totalSpent = PAYMENT_HISTORY.reduce((s, p) => s + p.amount, 0);
    const monthlySummary = PAYMENT_HISTORY.reduce<Record<string, number>>((acc, p) => {
        const key = monthKey(p.date);
        acc[key] = (acc[key] ?? 0) + p.amount;
        return acc;
    }, {});
    const topMonth = Object.entries(monthlySummary).sort((a, b) => b[1] - a[1])[0];

    return (
        <div className="min-h-screen bg-white px-4 py-6 sm:px-6">
            <div className="mx-auto max-w-3xl">
                <div className="mb-5">
                    <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#427b77] epilogue-header">
                        Payments
                    </p>
                    <h2 className="mt-1 text-[24px] font-extrabold leading-tight text-[#262626] epilogue-header">
                        Payment History
                    </h2>
                </div>

                <div className="mb-5 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-[14px] border border-[#E5E7EB] bg-white p-4 sm:col-span-2">
                        <div className="mb-3 flex items-center justify-between">
                            <div>
                                <p className="text-[12px] text-[#262626]/50 epilogue-regular">Monthly spend</p>
                                <p className="mt-1 text-[22px] font-extrabold text-[#1D546D] epilogue-header">
                                    ₱{(topMonth?.[1] ?? 0).toLocaleString()}
                                </p>
                            </div>
                            <CalendarDays size={21} strokeWidth={1.8} className="text-[#427b77]" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(monthlySummary).map(([month, amount]) => (
                                <span
                                    key={month}
                                    className="rounded-full border border-[#E5E7EB] bg-[#F3F4F4] px-3 py-1.5 text-[12px] font-bold text-[#262626] epilogue-header"
                                >
                                    {month}: <span className="text-[#427b77]">₱{amount.toLocaleString()}</span>
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="rounded-[14px] border border-[#E5E7EB] bg-white p-4">
                        <WalletCards size={21} strokeWidth={1.8} className="mb-3 text-[#427b77]" />
                        <p className="text-[12px] text-[#262626]/50 epilogue-regular">Total spent</p>
                        <p className="mt-1 text-[22px] font-extrabold text-[#1D546D] epilogue-header">
                            ₱{totalSpent.toLocaleString()}
                        </p>
                    </div>
                </div>

                <div className="space-y-3">
                    {PAYMENT_HISTORY.map((payment) => (
                        <article
                            key={payment.id}
                            className="rounded-[14px] border border-[#E5E7EB] bg-white p-4"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#F3F4F4] text-[#427b77]">
                                    <ReceiptText size={20} strokeWidth={1.8} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-[14px] font-extrabold text-[#262626] epilogue-header">
                                        Order #{payment.orderId}
                                    </p>
                                    <p className="mt-1 text-[12px] text-[#262626]/50 epilogue-regular">
                                        {payment.date} · {payment.itemCount} item{payment.itemCount === 1 ? "" : "s"}
                                    </p>
                                </div>
                                <span className="shrink-0 text-[18px] font-extrabold text-[#1D546D] epilogue-header">
                                    ₱{payment.amount.toLocaleString()}
                                </span>
                            </div>

                            <div className="mt-4 flex items-center justify-between rounded-[14px] bg-[#F3F4F4] px-3.5 py-3">
                                <span className="inline-flex items-center gap-2 text-[13px] font-bold text-[#262626] epilogue-header">
                                    <span className="text-[#427b77]">{METHOD_ICON[payment.method]}</span>
                                    {PAYMENT_META[payment.method].label}
                                </span>
                                <span className="rounded-full bg-white px-3 py-1 text-[11px] font-bold text-[#427b77] epilogue-header">
                                    Paid
                                </span>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
}
