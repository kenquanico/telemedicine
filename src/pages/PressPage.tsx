import { PageShell, PageHero, Card, SectionTitle, Pill } from "./pageComponents";
import { Download, ExternalLink, Mail } from "lucide-react";

const PRESS_ITEMS = [
    { outlet: "BusinessWorld", date: "May 2025", headline: "Dosely raises seed round to expand same-day pharmacy delivery across Visayas" },
    { outlet: "Philippine Daily Inquirer", date: "Jan 2025", headline: "How a Cebu startup is making maintenance medicines easier to restock" },
    { outlet: "Rappler Tech", date: "Oct 2024", headline: "The startups solving healthcare logistics in the Philippine provinces" },
    { outlet: "CNN Philippines", date: "Aug 2024", headline: "Dosely delivers: online pharmacy reaches 10,000 households milestone" },
];

export default function PressPage({ onBack }: { onBack?: () => void }) {
    return (
        <PageShell onBack={onBack} breadcrumbLabel="Press">
            <PageHero
                eyebrow="Press"
                title="Dosely in the news"
                subtitle="For media enquiries, brand assets, and interview requests — we're easy to reach."
            />

            <Card className="mb-8 flex items-center gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-[#427b77] text-white">
                    <Mail size={22} strokeWidth={1.8} />
                </div>
                <div>
                    <p className="text-[14px] font-extrabold text-[#262626] epilogue-header">Press enquiries</p>
                    <a href="mailto:press@dosely.ph" className="text-[13px] text-[#427b77] font-semibold epilogue-header hover:underline">press@dosely.ph</a>
                    <p className="text-[12px] text-[#262626]/50 epilogue-regular mt-0.5">We respond within one business day.</p>
                </div>
            </Card>

            <Card className="mb-8">
                <SectionTitle>Brand assets</SectionTitle>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {["Logo (SVG)", "Logo (PNG)", "Brand guide", "Product screenshots"].map((asset) => (
                        <button key={asset} className="flex flex-col items-center gap-2 rounded-[14px] border border-[#E5E7EB] p-4 transition-colors hover:border-[#427b77]">
                            <Download size={20} strokeWidth={1.8} className="text-[#427b77]" />
                            <span className="text-[11px] font-bold text-[#262626]/70 epilogue-header text-center">{asset}</span>
                        </button>
                    ))}
                </div>
            </Card>

            <SectionTitle>Recent coverage</SectionTitle>
            <div className="space-y-3">
                {PRESS_ITEMS.map((item) => (
                    <Card key={item.headline} className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="mb-1.5 flex items-center gap-2">
                                <Pill>{item.outlet}</Pill>
                                <span className="text-[12px] text-[#262626]/40 epilogue-regular">{item.date}</span>
                            </div>
                            <p className="text-[14px] font-bold text-[#262626] epilogue-header leading-snug">{item.headline}</p>
                        </div>
                        <ExternalLink className="mt-1 shrink-0 text-[#427b77]" size={16} strokeWidth={2} />
                    </Card>
                ))}
            </div>
        </PageShell>
    );
}
