import { useState } from "react";
import { PageShell, PageHero, Card, SectionTitle, TealButton, Divider, Step } from "./pageComponents";

export default function PrescriptionUploadPage({ onBack }: { onBack?: () => void }) {
    const [dragging, setDragging] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);

    return (
        <PageShell onBack={onBack}>
            <PageHero
                eyebrow="Prescriptions"
                title="Upload Your Prescription"
                subtitle="A valid prescription is required for certain medicines. Upload yours here and our licensed pharmacist will verify it before dispensing."
            />

            <Card className="mb-5">
                <SectionTitle>Before you upload</SectionTitle>
                <ul className="space-y-2.5">
                    {[
                        "Prescription must be from a licensed Philippine physician (PRC-registered)",
                        "Must include patient name, date, medicine name, dosage, and doctor's signature",
                        "Valid within 7 days of issuance for antibiotics; 1 month for most others",
                        "Photo or scan accepted — JPG, PNG, or PDF up to 10 MB",
                    ].map((req) => (
                        <li key={req} className="flex items-start gap-3">
                            <span className="mt-0.5 text-[#427b77]">✓</span>
                            <span className="text-[13px] text-[#262626]/70 epilogue-regular">{req}</span>
                        </li>
                    ))}
                </ul>
            </Card>

            <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    const file = e.dataTransfer.files[0];
                    if (file) setFileName(file.name);
                }}
                className={`mb-5 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-14 px-6 text-center transition-colors duration-200 ${
                    dragging ? "border-[#427b77] bg-[#427b77]/5" : "border-[#EAEFEE] bg-white"
                }`}
            >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#427b77]/10">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="#427b77" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
                {fileName ? (
                    <>
                        <p className="text-[14px] font-bold text-[#262626] epilogue-header">{fileName}</p>
                        <button onClick={() => setFileName(null)} className="mt-2 text-[12px] text-[#427b77] font-semibold epilogue-header hover:underline">Remove</button>
                    </>
                ) : (
                    <>
                        <p className="text-[15px] font-bold text-[#262626] epilogue-header">Drag & drop your prescription here</p>
                        <p className="mt-1 text-[13px] text-[#262626]/50 epilogue-regular">or</p>
                        <label className="mt-3 cursor-pointer rounded-xl border border-[#DCE6E4] px-5 py-2.5 text-[13px] font-bold text-[#427b77] epilogue-header hover:bg-[#427b77]/5 transition-colors">
                            Browse files
                            <input type="file" className="sr-only" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) setFileName(f.name);
                            }} />
                        </label>
                        <p className="mt-3 text-[11px] text-[#262626]/40 epilogue-regular">JPG, PNG, or PDF · Max 10 MB</p>
                    </>
                )}
            </div>

            <Card>
                <SectionTitle>What happens next?</SectionTitle>
                <div className="space-y-5">
                    <Step number={1} title="Pharmacist review">
                        A licensed Dosely pharmacist reviews your prescription, usually within 30 minutes during operating hours.
                    </Step>
                    <Step number={2} title="Confirmation message">
                        You'll receive an SMS and in-app notification once verified. If there's an issue, we'll contact you directly.
                    </Step>
                    <Step number={3} title="Proceed to checkout">
                        Approved prescriptions unlock restricted medicines in your cart. They are valid for one order.
                    </Step>
                </div>
            </Card>

            {fileName && <TealButton>Submit Prescription</TealButton>}

            <Divider />
            <p className="text-[13px] text-[#262626]/50 epilogue-regular">
                Need help? <a href="#" className="text-[#427b77] font-semibold hover:underline">Chat with our pharmacist</a> — available 8 AM – 9 PM daily.
            </p>
        </PageShell>
    );
}