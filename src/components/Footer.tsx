export default function Footer() {
    return (
        <footer className="mt-8 border-t border-[#EAEFEE] bg-[#F7F9F9]">
            <div className="px-5 sm:px-8 lg:px-16 py-12">

                {/* ── Top row: brand + nav columns ── */}
                <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:grid-cols-5">

                    {/* Brand */}
                    <div className="col-span-2 sm:col-span-1 lg:col-span-2">
                        <div className="mb-3 flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#427b77]">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 3H5C3.9 3 3 3.9 3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2Z" fill="white" fillOpacity="0.3"/>
                                    <path d="M12 8v8M8 12h8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
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
                                {
                                    label: "Facebook",
                                    icon: (
                                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                                    ),
                                },
                                {
                                    label: "Instagram",
                                    icon: (
                                        <>
                                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="1.6" fill="none"/>
                                            <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" fill="none"/>
                                            <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
                                        </>
                                    ),
                                },
                                {
                                    label: "TikTok",
                                    icon: (
                                        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                                    ),
                                },
                            ].map(({ label, icon }) => (
                                <button
                                    key={label}
                                    aria-label={label}
                                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#EAEFEE] bg-white text-[#262626]/50 transition-colors duration-200 hover:border-[#427b77] hover:text-[#427b77]"
                                >
                                    <svg width="15" height="15" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        {icon}
                                    </svg>
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
                                    <a
                                        href="#"
                                        className="text-[13px] text-[#262626]/60 epilogue-regular transition-colors duration-150 hover:text-[#427b77]"
                                    >
                                        {item}
                                    </a>
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
                            {["Help Center", "Track Order", "Returns", "Prescription Upload", "Contact Us"].map((item) => (
                                <li key={item}>
                                    <a
                                        href="#"
                                        className="text-[13px] text-[#262626]/60 epilogue-regular transition-colors duration-150 hover:text-[#427b77]"
                                    >
                                        {item}
                                    </a>
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
                            {["About Dosely", "Careers", "Press", "Privacy Policy", "Terms of Service"].map((item) => (
                                <li key={item}>
                                    <a
                                        href="#"
                                        className="text-[13px] text-[#262626]/60 epilogue-regular transition-colors duration-150 hover:text-[#427b77]"
                                    >
                                        {item}
                                    </a>
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
                            { icon: "🔒", label: "SSL Secured" },
                            { icon: "💊", label: "FDA Registered" },
                            { icon: "🚚", label: "Same-Day Delivery" },
                        ].map(({ icon, label }) => (
                            <span
                                key={label}
                                className="flex items-center gap-1.5 rounded-lg border border-[#EAEFEE] bg-white px-3 py-1.5 text-[11px] font-bold text-[#262626]/55 epilogue-header"
                            >
                                <span className="text-[13px]">{icon}</span>
                                {label}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}