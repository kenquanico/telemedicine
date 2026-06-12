// ─── Account Page ─────────────────────────────────────────────────────────────
import {
    Bell,
    ChevronRight,
    ClipboardList,
    CreditCard,
    Edit3,
    LogOut,
    MapPin,
    Package,
    Settings,
    ShieldCheck,
} from "lucide-react";
import type { ReactNode } from "react";
import { useApp } from "../hooks/useApp";
import { PAYMENT_HISTORY } from "../data/mockData";
import type { PageKey } from "../types";

type MenuItem = {
    icon: ReactNode;
    label: string;
    action: () => void;
};

export function AccountPage() {
    const { navigateTo, orders } = useApp();

    const quickCards: {
        icon: ReactNode;
        label: string;
        sub: string;
        page: PageKey;
    }[] = [
        {
            icon:  <Package size={22} strokeWidth={1.8} />,
            label: "My Orders",
            sub:   `${orders.length} orders`,
            page:  "orders",
        },
        {
            icon:  <CreditCard size={22} strokeWidth={1.8} />,
            label: "Payment History",
            sub:   `${PAYMENT_HISTORY.length} transactions`,
            page:  "history",
        },
    ];

    const menuItems: MenuItem[] = [
        { icon: <ClipboardList size={18} strokeWidth={1.8} />, label: "My Prescriptions", action: () => navigateTo("prescription_upload") },
        { icon: <MapPin size={18} strokeWidth={1.8} />,        label: "Saved Addresses",  action: () => navigateTo("checkout") },
        { icon: <Bell size={18} strokeWidth={1.8} />,          label: "Notifications",    action: () => navigateTo("orders") },
        { icon: <Settings size={18} strokeWidth={1.8} />,      label: "Settings",         action: () => navigateTo("settings") },
    ];

    return (
        <div className="min-h-screen bg-white px-4 py-6 sm:px-6">
            <div className="mx-auto max-w-[640px]">
                <div className="mb-5 rounded-[14px] border border-[#E5E7EB] bg-white p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full bg-[#5F9598] text-[28px] font-extrabold text-white epilogue-header">
                                M
                            </div>
                            <div className="min-w-0">
                                <h2 className="text-[22px] font-extrabold leading-tight text-[#262626] epilogue-header">
                                    Maria Santos
                                </h2>
                                <p className="mt-1 text-[13px] leading-relaxed text-[#262626]/55 epilogue-regular">
                                    maria.santos@email.com · +63 912 345 6789
                                </p>
                                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#EAF3F5] px-3 py-1.5 text-[12px] font-bold text-[#1D546D] epilogue-header">
                                    <ShieldCheck size={14} strokeWidth={2} />
                                    Premium Member
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => navigateTo("profile")}
                            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-[12px] font-bold text-[#427b77] transition-colors duration-150 hover:border-[#5F9598] epilogue-header"
                        >
                            <Edit3 size={15} strokeWidth={2} />
                            Edit Profile
                        </button>
                    </div>
                </div>

                <div className="mb-5 grid grid-cols-2 gap-3">
                    {quickCards.map((card) => (
                        <button
                            key={card.label}
                            onClick={() => navigateTo(card.page)}
                            className="rounded-[14px] border border-[#E5E7EB] bg-white p-4 text-left transition-colors duration-150 hover:border-[#5F9598]"
                        >
                            <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#F3F4F4] text-[#427b77]">
                                {card.icon}
                            </span>
                            <span className="block text-[14px] font-extrabold text-[#262626] epilogue-header">
                                {card.label}
                            </span>
                            <span className="mt-1 block text-[12px] text-[#262626]/50 epilogue-regular">
                                {card.sub}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-white">
                    {menuItems.map((item, i) => (
                        <button
                            key={item.label}
                            onClick={item.action}
                            className="flex w-full items-center justify-between gap-3 bg-white px-4 py-4 text-left transition-colors duration-150 hover:bg-[#F3F4F4]"
                            style={{
                                borderBottom:
                                    i < menuItems.length - 1
                                        ? "1px solid #E5E7EB"
                                        : "none",
                            }}
                        >
                            <span className="inline-flex min-w-0 items-center gap-3 text-[14px] font-bold text-[#262626] epilogue-header">
                                <span className="text-[#427b77]">{item.icon}</span>
                                {item.label}
                            </span>
                            <ChevronRight size={18} strokeWidth={1.8} className="shrink-0 text-[#262626]/35" />
                        </button>
                    ))}

                    <button className="flex w-full items-center justify-between gap-3 border-t border-[#E5E7EB] bg-white px-4 py-4 text-left transition-colors duration-150 hover:bg-red-50">
                        <span className="inline-flex min-w-0 items-center gap-3 text-[14px] font-bold text-red-500 epilogue-header">
                            <LogOut size={18} strokeWidth={1.8} />
                            Logout
                        </span>
                        <ChevronRight size={18} strokeWidth={1.8} className="shrink-0 text-red-400" />
                    </button>
                </div>
            </div>
        </div>
    );
}
