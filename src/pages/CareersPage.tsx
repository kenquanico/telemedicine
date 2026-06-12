import { PageShell, PageHero, Card, SectionTitle, Pill, Divider } from "./pageComponents";

const JOBS = [
    { title: "Licensed Pharmacist", team: "Operations", location: "Cebu City", type: "Full-time" },
    { title: "Delivery Rider", team: "Logistics", location: "Cebu City", type: "Part-time / Full-time" },
    { title: "React / TypeScript Engineer", team: "Engineering", location: "Remote (PH)", type: "Full-time" },
    { title: "Customer Support Specialist", team: "Support", location: "Cebu City / Remote", type: "Full-time" },
    { title: "Brand & Content Designer", team: "Marketing", location: "Remote (PH)", type: "Contract" },
];

export default function CareersPage({ onBack }: { onBack?: () => void }) {
    return (
        <PageShell onBack={onBack}>
            <PageHero
                eyebrow="Careers"
                title="Build the pharmacy of the future."
                subtitle="Dosely is a small team with a big goal. We're looking for people who care deeply about healthcare and love working on hard problems."
            />

            <div className="mb-8 grid gap-4 sm:grid-cols-2">
                {[
                    { icon: "🏥", title: "HMO from day one", body: "Full health coverage for you and one dependent, starting your first month." },
                    { icon: "🏡", title: "Remote-first culture", body: "Most roles are fully remote. We meet in Cebu quarterly — and actually enjoy it." },
                    { icon: "📈", title: "Early equity", body: "Early team members receive meaningful equity as we scale across the Philippines." },
                    { icon: "💊", title: "Dosely credits", body: "₱3,000/month in free medicine and wellness products for you and your household." },
                ].map(({ icon, title, body }) => (
                    <Card key={title} className="flex gap-4">
                        <span className="text-[24px]">{icon}</span>
                        <div>
                            <p className="text-[14px] font-extrabold text-[#262626] epilogue-header mb-1">{title}</p>
                            <p className="text-[13px] text-[#262626]/60 epilogue-regular leading-relaxed">{body}</p>
                        </div>
                    </Card>
                ))}
            </div>

            <SectionTitle>Open roles</SectionTitle>
            <div className="space-y-3">
                {JOBS.map((job) => (
                    <Card key={job.title} className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-[15px] font-bold text-[#262626] epilogue-header">{job.title}</p>
                            <div className="mt-1 flex flex-wrap items-center gap-2">
                                <Pill>{job.team}</Pill>
                                <span className="text-[12px] text-[#262626]/50 epilogue-regular">{job.location}</span>
                                <span className="text-[12px] text-[#262626]/50 epilogue-regular">·</span>
                                <span className="text-[12px] text-[#262626]/50 epilogue-regular">{job.type}</span>
                            </div>
                        </div>
                        <button className="shrink-0 rounded-xl border border-[#DCE6E4] px-4 py-2 text-[12px] font-bold text-[#427b77] epilogue-header hover:bg-[#427b77]/5 transition-colors">
                            Apply
                        </button>
                    </Card>
                ))}
            </div>

            <Divider />
            <p className="text-[13px] text-[#262626]/50 epilogue-regular">
                Don't see your role? Send your CV to <a href="mailto:careers@dosely.ph" className="text-[#427b77] font-semibold hover:underline">careers@dosely.ph</a>
            </p>
        </PageShell>
    );
}