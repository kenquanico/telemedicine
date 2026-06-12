import { useApp } from "../hooks/useApp";
import type { PageKey } from "../types";
import { Facebook, Instagram, LockKeyhole, Music2, Pill, Plus, Truck } from "lucide-react";

export default function Footer() {
    const { navigateTo } = useApp();
    const supportLinks: { label: string; page: PageKey }[] = [
        { label: "Help Center", page: "help_center" },
        { label: "Track Order", page: "tracking" },
        { label: "Returns", page: "returns" },
        { label: "Prescription Upload", page: "prescription_upload" },
        { label: "Contact Us", page: "help_center" },
    ];
    const companyLinks: { label: string; page: PageKey }[] = [
        { label: "About Dosely", page: "about" },
        { label: "Careers", page: "careers" },
        { label: "Press", page: "press" },
        { label: "Privacy Policy", page: "privacy" },
        { label: "Terms of Service", page: "terms" },
    ];

    return (
        <footer className="mt-8 border-t border-[#EAEFEE] bg-[#FFFFFF]">
            <div className="px-5 sm:px-8 lg:px-16 py-12">

                {/* ── Top row: brand + nav columns ── */}
                <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:grid-cols-5">

                    {/* Brand */}
                    <div className="col-span-2 sm:col-span-1 lg:col-span-2">
                        <div className="mb-3 flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#427b77]">
                                <Plus size={18} strokeWidth={2.2} className="text-white" />
                            </div>
                            <span className="text-[18px] font-extrabold text-[#262626] epilogue-header tracking-tight">
                                Dosely
                            </span>
                        </div>
                        <p className="text-[13px] leading-relaxed text-[#262626]/55 epilogue-regular max-w-[220px]">
                            Your trusted pharmacy partner. Medicines delivered fast, right to your door in Cebu City.
                        </p>
                        {/* Social links */}
                        <div className="mt-5 flex gap-2.5">
                            {[
                                { label: "Facebook", Icon: Facebook },
                                { label: "Instagram", Icon: Instagram },
                                { label: "TikTok", Icon: Music2 },
                            ].map(({ label, Icon }) => (
                                <button
                                    key={label}
                                    aria-label={label}
                                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#EAEFEE] bg-white text-[#262626]/50 transition-colors duration-200 hover:border-[#427b77] hover:text-[#427b77]"
                                >
                                    <Icon size={15} strokeWidth={1.8} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Column: Shop */}
                    <div>
                        <h5 className="mb-4 text-[12px] font-extrabold uppercase tracking-widest text-[#427b77] epilogue-header">
                            Shop
                        </h5>
                        <ul className="space-y-2.5">
                            {["All Medicines", "Featured Products", "Best Sellers", "Sale Items", "New Arrivals"].map((item) => (
                                <li key={item}>
                                    <button
                                        type="button"
                                        onClick={() => navigateTo("catalog")}
                                        className="text-[13px] text-[#262626]/60 epilogue-regular transition-colors duration-150 hover:text-[#427b77]"
                                    >
                                        {item}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column: Support */}
                    <div>
                        <h5 className="mb-4 text-[12px] font-extrabold uppercase tracking-widest text-[#427b77] epilogue-header">
                            Support
                        </h5>
                        <ul className="space-y-2.5">
                            {supportLinks.map(({ label, page }) => (
                                <li key={label}>
                                    <button
                                        type="button"
                                        onClick={() => navigateTo(page)}
                                        className="text-[13px] text-[#262626]/60 epilogue-regular transition-colors duration-150 hover:text-[#427b77]"
                                    >
                                        {label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column: Company */}
                    <div>
                        <h5 className="mb-4 text-[12px] font-extrabold uppercase tracking-widest text-[#427b77] epilogue-header">
                            Company
                        </h5>
                        <ul className="space-y-2.5">
                            {companyLinks.map(({ label, page }) => (
                                <li key={label}>
                                    <button
                                        type="button"
                                        onClick={() => navigateTo(page)}
                                        className="text-[13px] text-[#262626]/60 epilogue-regular transition-colors duration-150 hover:text-[#427b77]"
                                    >
                                        {label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* ── Divider ── */}
                <div className="my-10 border-t border-[#EAEFEE]" />

                {/* ── Bottom row ── */}
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <p className="text-[12px] text-[#262626]/40 epilogue-regular">
                        © {new Date().getFullYear()} Dosely. All rights reserved. Cebu City, Philippines.
                    </p>

                    {/* Trust badges */}
                    <div className="flex flex-wrap items-center gap-2">
                        {[
                            { Icon: LockKeyhole, label: "SSL Secured" },
                            { Icon: Pill, label: "FDA Registered" },
                            { Icon: Truck, label: "Same-Day Delivery" },
                        ].map(({ Icon, label }) => (
                            <span
                                key={label}
                                className="flex items-center gap-1.5 rounded-lg border border-[#EAEFEE] bg-white px-3 py-1.5 text-[11px] font-bold text-[#262626]/55 epilogue-header"
                            >
                                <Icon size={13} strokeWidth={1.8} className="text-[#427b77]" />
                                {label}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
