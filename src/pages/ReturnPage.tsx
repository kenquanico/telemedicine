import { PageShell, PageHero, Card, SectionTitle, Pill, Divider, Step } from "./pageComponents";

export default function ReturnsPage({ onBack }: { onBack?: () => void }) {
    return (
        <PageShell onBack={onBack}>
            <PageHero
                eyebrow="Support"
                title="Returns & Refunds"
                subtitle="We want you to be completely satisfied. If something isn't right, we'll make it right — fast."
            />

            <div className="mb-8 flex flex-wrap gap-2">
                <Pill>7-day return window</Pill>
                <Pill>Free return pickup</Pill>
                <Pill>Full refund guaranteed</Pill>
            </div>

            <Card className="mb-5">
                <SectionTitle>What can be returned?</SectionTitle>
                <ul className="space-y-3">
                    {[
                        { ok: true,  label: "Sealed, unopened medicines in original packaging" },
                        { ok: true,  label: "Items delivered damaged or incorrect" },
                        { ok: true,  label: "Products past their expiry date at time of delivery" },
                        { ok: false, label: "Opened or partially used medicines" },
                        { ok: false, label: "Refrigerated / cold-chain items once delivered" },
                        { ok: false, label: "Prescription medicines once dispensed" },
                    ].map(({ ok, label }) => (
                        <li key={label} className="flex items-start gap-3">
                            <span className={`mt-0.5 text-[15px] ${ok ? "text-[#427b77]" : "text-[#e11d48]"}`}>
                                {ok ? "✓" : "✗"}
                            </span>
                            <span className="text-[13px] text-[#262626]/70 epilogue-regular">{label}</span>
                        </li>
                    ))}
                </ul>
            </Card>

            <Card className="mb-5">
                <SectionTitle>How to start a return</SectionTitle>
                <div className="space-y-5">
                    <Step number={1} title="Contact us within 7 days">
                        Reach out via the Help Center or call our pharmacy line. Have your order number ready.
                    </Step>
                    <Step number={2} title="Pack the item securely">
                        Place the product in its original box with all included materials. No need to print a label — we'll handle it.
                    </Step>
                    <Step number={3} title="Schedule a free pickup">
                        Our rider will collect the return at a time that works for you — usually within 24 hours.
                    </Step>
                    <Step number={4} title="Receive your refund">
                        Once we verify the returned item, your refund is processed within 3–5 business days to your original payment method.
                    </Step>
                </div>
            </Card>

            <Card>
                <SectionTitle>Refund timeline</SectionTitle>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                        <tr className="border-b border-[#EAEFEE]">
                            <th className="pb-3 text-[11px] font-extrabold uppercase tracking-widest text-[#427b77] epilogue-header">Payment method</th>
                            <th className="pb-3 text-[11px] font-extrabold uppercase tracking-widest text-[#427b77] epilogue-header">Timeline</th>
                        </tr>
                        </thead>
                        <tbody>
                        {[
                            ["GCash / Maya", "1–2 business days"],
                            ["Credit / Debit Card", "3–5 business days"],
                            ["Cash on Delivery", "Store credit within 24 hrs"],
                            ["Dosely Wallet", "Instant"],
                        ].map(([method, timeline]) => (
                            <tr key={method} className="border-b border-[#EAEFEE] last:border-0">
                                <td className="py-3 text-[13px] font-semibold text-[#262626] epilogue-header">{method}</td>
                                <td className="py-3 text-[13px] text-[#262626]/60 epilogue-regular">{timeline}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Divider />
            <p className="text-[13px] text-[#262626]/50 epilogue-regular">
                Questions? <a href="#" className="text-[#427b77] font-semibold hover:underline">Contact our support team</a> — we're available 8 AM – 9 PM daily.
            </p>
        </PageShell>
    );
}