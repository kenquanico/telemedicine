import { LegalPolicyPage } from "./pageComponents";

const SECTIONS = [
    {
        title: "Acceptance of terms",
        body: (
            <p>
                By accessing or using Dosely, you agree to be bound by these Terms of Service and our{" "}
                <a className="text-[#262626] underline decoration-1 underline-offset-4 hover:text-[#262626]/60" href="/privacy-policy">
                    Privacy Policy
                </a>
                . If you do not agree, do not use the service. These terms are governed by the laws of the Republic of the Philippines.
            </p>
        ),
    },
    {
        title: "Eligibility",
        body: (
            <p>
                You must be at least 18 years old to create an account and purchase medicines. Prescription medicines may only be purchased
                with a valid prescription from a licensed Philippine physician. We reserve the right to verify identity and refuse service.
            </p>
        ),
    },
    {
        title: "Ordering and dispensing",
        body: (
            <p>
                Orders constitute an offer to purchase, which Dosely accepts upon confirmation. We reserve the right to cancel orders if a
                prescription cannot be verified, if stock is unavailable, or if fraudulent activity is suspected. Medicines dispensed are
                intended for the named patient only.
            </p>
        ),
    },
    {
        title: "Pricing and payment",
        body: (
            <p>
                All prices are in Philippine Peso (PHP) and include applicable VAT. Dosely reserves the right to correct pricing errors.
                Payment is due at time of order. For COD orders, payment is due upon delivery.
            </p>
        ),
    },
    {
        title: "Delivery",
        body: (
            <p>
                Delivery times are estimates and not guaranteed. Risk of loss passes to you upon delivery. If delivery is refused or the
                recipient is unavailable after three attempts, the order is cancelled and a restocking fee may apply.
            </p>
        ),
    },
    {
        title: "Returns and refunds",
        body: (
            <p>
                Returns are accepted for unopened, undamaged items within 7 days, and for items delivered in error or damaged. Opened
                medicines, refrigerated items, and dispensed prescriptions are non-returnable for safety reasons. See our Returns page for the
                full policy.
            </p>
        ),
    },
    {
        title: "Prohibited uses",
        body: (
            <p>
                You may not use Dosely to purchase medicines for resale, to circumvent prescription requirements, to submit fraudulent
                prescriptions, or for any unlawful purpose. Violation may result in account termination and referral to law enforcement.
            </p>
        ),
    },
    {
        title: "Limitation of liability",
        body: (
            <p>
                Dosely's liability is limited to the value of your order. We are not liable for indirect, incidental, or consequential damages.
                Nothing in these terms limits our liability for death or personal injury caused by our negligence, or for fraud.
            </p>
        ),
    },
    {
        title: "Changes to terms",
        body: (
            <p>
                We may revise these terms at any time. Material changes will be communicated via email or in-app notification at least 14 days
                in advance. Continued use after that date constitutes acceptance of the revised terms.
            </p>
        ),
    },
];

export default function TermsPage({ onBack }: { onBack?: () => void }) {
    return (
        <LegalPolicyPage
            onBack={onBack}
            title="Terms of Service"
            published="January 1, 2026"
            effective="January 1, 2026"
            previousVersionHref="/terms/revisions/2025-06-15"
            intro={
                <p>
                    These Terms of Service apply to your use of Dosely's pharmacy ordering, prescription upload, pickup, delivery, account,
                    payment, and customer support services. These Terms form an agreement between you and Dosely, and by using Dosely you agree
                    to them.
                </p>
            }
            sections={SECTIONS}
            contact={
                <>
                    Legal questions?{" "}
                    <a href="mailto:legal@dosely.ph" className="font-semibold text-[#427b77] hover:underline">
                        legal@dosely.ph
                    </a>
                </>
            }
        />
    );
}
