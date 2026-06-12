import { PageShell, PageHero, Card, SectionTitle, Pill, Divider } from "./pageComponents";

const HELP_TOPICS = [
    {
        title: "Orders and delivery",
        body: "Track delivery status, update delivery details, or get help when an order is delayed.",
    },
    {
        title: "Prescriptions",
        body: "Upload a prescription, check verification status, or speak with a licensed pharmacist.",
    },
    {
        title: "Returns and refunds",
        body: "Start a return request, review refund timelines, or report a damaged or incorrect item.",
    },
    {
        title: "Account and payments",
        body: "Manage saved addresses, payment methods, notifications, and account access.",
    },
];

export default function HelpCenterPage({ onBack }: { onBack?: () => void }) {
    return (
        <PageShell onBack={onBack}>
            <PageHero
                eyebrow="Support"
                title="How can we help?"
                subtitle="Find quick answers for orders, prescriptions, returns, payments, and account support."
            />

            <div className="mb-8 flex flex-wrap gap-2">
                <Pill>8 AM - 9 PM daily</Pill>
                <Pill>Pharmacist support</Pill>
                <Pill>Same-day responses</Pill>
            </div>

            <SectionTitle>Popular topics</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
                {HELP_TOPICS.map((topic) => (
                    <Card key={topic.title}>
                        <p className="text-[14px] font-extrabold text-[#262626] epilogue-header mb-2">
                            {topic.title}
                        </p>
                        <p className="text-[13px] leading-relaxed text-[#262626]/60 epilogue-regular">
                            {topic.body}
                        </p>
                    </Card>
                ))}
            </div>

            <Divider />
            <Card>
                <SectionTitle>Contact support</SectionTitle>
                <div className="space-y-3 text-[13px] text-[#262626]/65 epilogue-regular">
                    <p>
                        Chat with Dosely support from 8 AM to 9 PM daily for order, delivery, and account concerns.
                    </p>
                    <p>
                        For prescription questions, our licensed pharmacists can review your request before checkout.
                    </p>
                    <a href="mailto:support@dosely.ph" className="inline-flex font-semibold text-[#427b77] hover:underline">
                        support@dosely.ph
                    </a>
                </div>
            </Card>
        </PageShell>
    );
}
