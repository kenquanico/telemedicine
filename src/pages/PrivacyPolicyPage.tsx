import { PageShell, PageHero, Card, Pill, Divider } from "./pageComponents";

const SECTIONS = [
    {
        title: "Information we collect",
        body: "We collect information you provide directly — name, contact details, delivery address, payment information, and prescription documents. We also collect usage data (pages visited, items viewed, device type) to improve our service. We do not sell your personal data to third parties.",
    },
    {
        title: "How we use your information",
        body: "Your information is used to process orders, verify prescriptions, send delivery updates, detect fraud, and improve the Dosely platform. We may send you promotional messages — you can opt out at any time via account settings or by texting STOP.",
    },
    {
        title: "Medical & prescription data",
        body: "Prescription documents and medical information are treated with the highest level of sensitivity. They are encrypted at rest, accessed only by our licensed pharmacists, and are never shared with advertisers or data brokers. We comply fully with the Philippine Data Privacy Act of 2012 (R.A. 10173).",
    },
    {
        title: "Data sharing",
        body: "We share your data only with delivery partners (for fulfillment), payment processors (for transactions), and as required by law. All partners are bound by data processing agreements. We do not share health data with insurance companies without explicit consent.",
    },
    {
        title: "Data retention",
        body: "Order records are retained for 7 years as required by Philippine FDA regulations. Prescription images are deleted 90 days after dispensing. You may request deletion of your account and personal data at any time, subject to regulatory retention requirements.",
    },
    {
        title: "Your rights",
        body: "Under R.A. 10173, you have the right to access, correct, and erase your personal data. You may also object to processing, request data portability, and lodge a complaint with the National Privacy Commission. Contact privacy@dosely.ph to exercise these rights.",
    },
    {
        title: "Cookies",
        body: "We use essential cookies for authentication and session management, and optional analytics cookies (which you can decline). We do not use third-party advertising cookies.",
    },
    {
        title: "Changes to this policy",
        body: "We will notify you of material changes via email or in-app notification at least 14 days before they take effect. Continued use of Dosely after that date constitutes acceptance.",
    },
];

export default function PrivacyPolicyPage({ onBack }: { onBack?: () => void }) {
    return (
        <PageShell onBack={onBack}>
            <PageHero
                eyebrow="Privacy Policy"
                title="Your data, handled with care."
                subtitle="We believe privacy is a right, not a checkbox. Here's exactly what we collect and why."
            />

            <div className="mb-6 flex flex-wrap gap-2">
                <Pill>R.A. 10173 compliant</Pill>
                <Pill>No data selling</Pill>
                <Pill>Encrypted at rest</Pill>
            </div>

            <p className="mb-8 text-[12px] text-[#262626]/40 epilogue-regular">Last updated: June 1, 2025</p>

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
                Questions? <a href="mailto:privacy@dosely.ph" className="text-[#427b77] font-semibold hover:underline">privacy@dosely.ph</a>
            </p>
        </PageShell>
    );
}