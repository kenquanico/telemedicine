// ─── Account Page ─────────────────────────────────────────────────────────────
import { useApp } from "../hooks/useApp";
import { PAYMENT_HISTORY } from "../data/mockData";
import type { PageKey } from "../types";

type MenuItem = {
    icon: string;
    label: string;
    action: () => void;
    danger?: boolean;
};

export function AccountPage() {
    const { navigateTo, orders } = useApp();

    const quickCards: {
        icon: string;
        label: string;
        sub: string;
        page: PageKey;
    }[] = [
        {
            icon:  "📦",
            label: "My Orders",
            sub:   `${orders.length} orders`,
            page:  "orders",
        },
        {
            icon:  "💳",
            label: "Payment History",
            sub:   `${PAYMENT_HISTORY.length} transactions`,
            page:  "history",
        },
    ];

    const menuItems: MenuItem[] = [
        { icon: "📋", label: "My Prescriptions", action: () => {} },
        { icon: "📍", label: "Saved Addresses",  action: () => {} },
        { icon: "🔔", label: "Notifications",    action: () => {} },
        { icon: "⚙️", label: "Settings",         action: () => {} },
    ];

    return (
        <div className="px-6 py-6 max-w-[600px] mx-auto">
            {/* Profile hero */}
            <div
                className="rounded-[20px] p-7 text-white mb-6 text-center"
                style={{ background: "linear-gradient(135deg, #061E29, #1D546D)" }}
            >
                {/* Avatar */}
                <div className="w-[72px] h-[72px] rounded-full bg-[#5F9598] flex items-center justify-center text-[28px] font-bold mx-auto mb-3 epilogue-header">
                    M
                </div>
                <div className="epilogue-header text-[20px] font-bold">Maria Santos</div>
                <div className="text-[13px] opacity-80 mt-1 epilogue-regular">
                    maria.santos@email.com · +63 912 345 6789
                </div>
                <div
                    className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] mt-2.5 epilogue-regular"
                    style={{ background: "rgba(255,255,255,0.10)" }}
                >
                    ⭐ Premium Member
                </div>
            </div>

            {/* Quick-access cards */}
            <div className="grid grid-cols-2 gap-3 mb-5">
                {quickCards.map((card) => (
                    <div
                        key={card.label}
                        onClick={() => navigateTo(card.page)}
                        className="bg-white border border-[#E5E7EB] rounded-xl p-4 text-center cursor-pointer hover:border-[#1D546D]/30 transition-colors duration-150"
                    >
                        <div className="text-[28px] mb-1.5">{card.icon}</div>
                        <div className="text-[13px] font-semibold text-[#262626] epilogue-header">
                            {card.label}
                        </div>
                        <div className="text-[12px] text-[#6B7280] epilogue-regular mt-0.5">
                            {card.sub}
                        </div>
                    </div>
                ))}
            </div>

            {/* Menu list */}
            <div className="bg-white border border-[#E5E7EB] rounded-[14px] overflow-hidden">
                {menuItems.map((item, i) => (
                    <button
                        key={item.label}
                        onClick={item.action}
                        className="w-full flex justify-between items-center px-4 py-3.5 cursor-pointer hover:bg-[#F7FAF9] transition-colors duration-150 border-none bg-transparent"
                        style={{
                            borderBottom:
                                i < menuItems.length - 1
                                    ? "1px solid #E5E7EB"
                                    : "none",
                        }}
                    >
                        <span className="text-[14px] font-medium text-[#262626] epilogue-regular">
                            {item.icon} {item.label}
                        </span>
                        <span className="text-[#6B7280] text-lg leading-none">›</span>
                    </button>
                ))}

                {/* Logout */}
                <button className="w-full flex justify-between items-center px-4 py-3.5 cursor-pointer hover:bg-red-50 transition-colors duration-150 border-none bg-transparent border-t border-[#E5E7EB]">
                    <span className="text-[14px] font-medium text-red-400 epilogue-regular">
                        🚪 Logout
                    </span>
                    <span className="text-red-400 text-lg leading-none">›</span>
                </button>
            </div>
        </div>
    );
}