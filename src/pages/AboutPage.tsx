import { PageShell, PageHero, Card, SectionTitle, Divider } from "./pageComponents";
import { Bolt, Handshake, Microscope } from "lucide-react";

export default function AboutPage({ onBack }: { onBack?: () => void }) {
    return (
        <PageShell onBack={onBack} breadcrumbLabel="About Dosely">
            <PageHero
                eyebrow="About Dosely"
                title="Medicine that finds you."
                subtitle="Dosely is a licensed online pharmacy on a mission to make healthcare as accessible as a text message."
            />

            <div className="mb-6 rounded-[14px] border border-[#E5E7EB] bg-[#1D546D] px-8 py-10 text-white">
                <p className="text-[11px] font-extrabold uppercase tracking-widest opacity-60 epilogue-header mb-3">Our mission</p>
                <p className="text-[22px] font-extrabold leading-snug epilogue-header max-w-[560px]">
                    Nobody should go without medicine because the pharmacy was too far, too slow, or too complicated.
                </p>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                    { value: "50K+", label: "Orders delivered" },
                    { value: "44+",  label: "Medicine SKUs" },
                    { value: "< 2h", label: "Avg. delivery time" },
                    { value: "4.9★", label: "App store rating" },
                ].map(({ value, label }) => (
                    <Card key={label} className="text-center">
                        <p className="text-[26px] font-extrabold text-[#427b77] epilogue-header">{value}</p>
                        <p className="mt-1 text-[12px] text-[#262626]/55 epilogue-regular">{label}</p>
                    </Card>
                ))}
            </div>

            <Card className="mb-5">
                <SectionTitle>Our story</SectionTitle>
                <div className="space-y-3 text-[14px] leading-relaxed text-[#262626]/70 epilogue-regular">
                    <p>
                        Dosely was founded in Cebu City in 2023 by a team of pharmacists, engineers, and healthcare advocates who watched family members struggle to restock maintenance medicines during the pandemic.
                    </p>
                    <p>
                        The insight was simple: the pharmacy model hadn't changed in decades, but logistics had. We rebuilt from scratch — digitising the entire dispensing workflow, partnering with FDA-registered suppliers, and putting licensed pharmacists at the centre of every order.
                    </p>
                    <p>
                        Today, Dosely serves thousands of households across Cebu, with plans to expand to every major Philippine city by 2026.
                    </p>
                </div>
            </Card>

            <SectionTitle>What we stand for</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-3">
                {[
                    { Icon: Microscope, title: "Clinical integrity", body: "Every order reviewed by a licensed pharmacist. We never compromise on safety." },
                    { Icon: Bolt, title: "Speed without shortcuts", body: "Same-day delivery, but not at the expense of proper cold-chain and handling." },
                    { Icon: Handshake, title: "Radical transparency", body: "Clear pricing, no hidden fees, and honest answers — always." },
                ].map(({ Icon, title, body }) => (
                    <Card key={title}>
                        <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#F3F4F4] text-[#427b77]">
                            <Icon size={20} strokeWidth={1.8} />
                        </span>
                        <p className="text-[14px] font-extrabold text-[#262626] epilogue-header mb-1.5">{title}</p>
                        <p className="text-[13px] text-[#262626]/60 epilogue-regular leading-relaxed">{body}</p>
                    </Card>
                ))}
            </div>

            <Divider />
            <p className="text-[13px] text-[#262626]/50 epilogue-regular">
                FDA License No. FR-4A-2023-0042 · DTI Reg. No. 2023-09-1187421 · Cebu City, Philippines
            </p>
        </PageShell>
    );
}
