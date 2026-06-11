// ─── Payment History Page ─────────────────────────────────────────────────────
import { PAYMENT_HISTORY, PAYMENT_META } from "../data/mockData";

export function PaymentHistoryPage() {
    const totalSpent = PAYMENT_HISTORY.reduce((s, p) => s + p.amount, 0);

    return (
        <div className="px-6 py-6 max-w-2xl mx-auto">
            <h2 className="epilogue-header text-[22px] font-bold text-[#262626] mb-5">
                Payment History
            </h2>

            {/* Table */}
            <div className="bg-white border border-[#E5E7EB] rounded-[14px] overflow-hidden">
                {/* Header row */}
                <div
                    className="grid gap-2 px-4 py-3 bg-[#F3F4F4] text-[12px] font-bold text-[#6B7280] uppercase tracking-wide epilogue-header"
                    style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr" }}
                >
                    <span>Order</span>
                    <span>Date</span>
                    <span>Method</span>
                    <span className="text-right">Amount</span>
                </div>

                {/* Data rows */}
                {PAYMENT_HISTORY.map((p, i) => (
                    <div
                        key={p.id}
                        className="grid gap-2 px-4 py-3.5 items-center epilogue-regular"
                        style={{
                            gridTemplateColumns: "1fr 1fr 1fr 1fr",
                            borderBottom:
                                i < PAYMENT_HISTORY.length - 1
                                    ? "1px solid #E5E7EB"
                                    : "none",
                        }}
                    >
                        <div>
                            <div className="text-[13px] font-semibold text-[#262626] epilogue-header">
                                #{p.orderId}
                            </div>
                            <div className="text-[11px] text-[#6B7280] mt-0.5">
                                {p.itemCount} items
                            </div>
                        </div>
                        <span className="text-[13px] text-[#262626]">{p.date}</span>
                        <span className="text-[13px] text-[#262626]">
                            {PAYMENT_META[p.method].icon} {PAYMENT_META[p.method].label}
                        </span>
                        <span className="text-[14px] font-bold text-[#1D546D] epilogue-header text-right">
                            ₱{p.amount.toLocaleString()}
                        </span>
                    </div>
                ))}
            </div>

            {/* Total spent */}
            <div className="mt-4 bg-[#F3F4F4] rounded-xl px-4 py-4 flex justify-between items-center">
                <span className="text-[14px] font-semibold epilogue-header text-[#262626]">
                    Total Spent
                </span>
                <span className="text-[20px] font-bold text-[#1D546D] epilogue-header">
                    ₱{totalSpent.toLocaleString()}
                </span>
            </div>
        </div>
    );
}