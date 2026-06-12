import { LegalPolicyPage } from "./pageComponents";

const SECTIONS = [
    {
        title: "Information we collect",
        body: (
            <p>
                We collect information you provide directly, including name, contact details, delivery address, payment information, and
                prescription documents. We also collect usage data such as pages visited, items viewed, and device type to improve our service.
                We do not sell your personal data to third parties.
            </p>
        ),
    },
    {
        title: "How we use your information",
        body: (
            <p>
                Your information is used to process orders, verify prescriptions, send delivery updates, detect fraud, and improve the Dosely
                platform. We may send you promotional messages, and you can opt out at any time via account settings or by texting STOP.
            </p>
        ),
    },
    {
        title: "Medical & prescription data",
        body: (
            <p>
                Prescription documents and medical information are treated with the highest level of sensitivity. They are encrypted at rest,
                accessed only by our licensed pharmacists, and are never shared with advertisers or data brokers. We comply fully with the
                Philippine Data Privacy Act of 2012 (R.A. 10173).
            </p>
        ),
    },
    {
        title: "Data sharing",
        body: (
            <p>
                We share your data only with delivery partners for fulfillment, payment processors for transactions, and as required by law. All
                partners are bound by data processing agreements. We do not share health data with insurance companies without explicit consent.
            </p>
        ),
    },
    {
        title: "Data retention",
        body: (
            <p>
                Order records are retained for 7 years as required by Philippine FDA regulations. Prescription images are deleted 90 days after
                dispensing. You may request deletion of your account and personal data at any time, subject to regulatory retention requirements.
            </p>
        ),
    },
    {
        title: "Your rights",
        body: (
            <p>
                Under R.A. 10173, you have the right to access, correct, and erase your personal data. You may also object to processing,
                request data portability, and lodge a complaint with the National Privacy Commission. Contact privacy@dosely.ph to exercise
                these rights.
            </p>
        ),
    },
    {
        title: "Cookies",
        body: (
            <p>
                We use essential cookies for authentication and session management, and optional analytics cookies that you can decline. We do not
                use third-party advertising cookies.
            </p>
        ),
    },
    {
        title: "Changes to this policy",
        body: (
            <p>
                We will notify you of material changes via email or in-app notification at least 14 days before they take effect. Continued use
                of Dosely after that date constitutes acceptance.
            </p>
        ),
    },
];

export default function PrivacyPolicyPage({ onBack }: { onBack?: () => void }) {
    return (
        <LegalPolicyPage
            onBack={onBack}
            title="Privacy Policy"
            published="January 1, 2026"
            effective="January 1, 2026"
            previousVersionHref="/privacy-policy/revisions/2025-06-15"
            intro={
                <p>
                    This Privacy Policy explains how Dosely collects, uses, stores, and protects personal information when you use our pharmacy
                    ordering, prescription upload, pickup, delivery, account, payment, and customer support services.
                </p>
            }
            sections={SECTIONS}
            contact={
                <>
                    Questions?{" "}
                    <a href="mailto:privacy@dosely.ph" className="font-semibold text-[#427b77] hover:underline">
                        privacy@dosely.ph
                    </a>
                </>
            }
        />
    );
}
