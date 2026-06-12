import { PageShell, PageHero, Card, Divider } from "./pageComponents";

const SECTIONS = [
    {
        title: "Acceptance of terms",
        body: "By accessing or using Dosely, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, do not use the service. These terms are governed by the laws of the Republic of the Philippines.",
    },
    {
        title: "Eligibility",
        body: "You must be at least 18 years old to create an account and purchase medicines. Prescription medicines may only be purchased with a valid prescription from a licensed Philippine physician. We reserve the right to verify identity and refuse service.",
    },
    {
        title: "Ordering and dispensing",
        body: "Orders constitute an offer to purchase, which Dosely accepts upon confirmation. We reserve the right to cancel orders if a prescription cannot be verified, if stock is unavailable, or if fraudulent activity is suspected. Medicines dispensed are intended for the named patient only.",
    },
    {
        title: "Pricing and payment",
        body: "All prices are in Philippine Peso (₱) and include applicable VAT. Dosely reserves the right to correct pricing errors. Payment is due at time of order. For COD orders, payment is due upon delivery.",
    },
    {
        title: "Delivery",
        body: "Delivery times are estimates and not guaranteed. Risk of loss passes to you upon delivery. If delivery is refused or the recipient is unavailable after three attempts, the order is cancelled and a restocking fee may apply.",
    },
    {
        title: "Returns and refunds",
        body: "Returns are accepted for unopened, undamaged items within 7 days, and for items delivered in error or damaged. Opened medicines, refrigerated items, and dispensed prescriptions are non-returnable for safety reasons. See our Returns page for the full policy.",
    },
    {
        title: "Prohibited uses",
        body: "You may not use Dosely to purchase medicines for resale, to circumvent prescription requirements, to submit fraudulent prescriptions, or for any unlawful purpose. Violation may result in account termination and referral to law enforcement.",
    },
    {
        title: "Limitation of liability",
        body: "Dosely's liability is limited to the value of your order. We are not liable for indirect, incidental, or consequential damages. Nothing in these terms limits our liability for death or personal injury caused by our negligence, or for fraud.",
    },
    {
        title: "Changes to terms",
        body: "We may revise these terms at any time. Material changes will be communicated via email or in-app notification at least 14 days in advance. Continued use after that date constitutes acceptance of the revised terms.",
    },
];

export default function TermsPage({ onBack }: { onBack?: () => void }) {
    return (
        <PageShell onBack={onBack}>
            <PageHero
                eyebrow="Terms of Service"
                title="The rules of the road."
                subtitle="Plain-language terms for using Dosely. We've tried to make these readable — not just legally defensible."
            />

            <p className="mb-8 text-[12px] text-[#262626]/40 epilogue-regular">
                Last updated: June 1, 2025 · Effective: June 15, 2025
            </p>

            <div className="space-y-4">
                {SECTIONS.map((s, i) => (
                    <Card key={s.title}>
                        <div className="flex items-start gap-4">
                            <span className="mt-0.5 text-[12px] font-extrabold text-[#427b77]/50 epilogue-header w-5 shrink-0">
                                {String(i + 1).padStart(2, "0")}
                            </span>
                            <div>
                                <p className="text-[15px] font-extrabold text-[#262626] epilogue-header mb-2">{s.title}</p>
                                <p className="text-[13px] leading-relaxed text-[#262626]/65 epilogue-regular">{s.body}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <Divider />
            <p className="text-[13px] text-[#262626]/50 epilogue-regular">
                Legal questions? <a href="mailto:legal@dosely.ph" className="text-[#427b77] font-semibold hover:underline">legal@dosely.ph</a>
            </p>
        </PageShell>
    );
}