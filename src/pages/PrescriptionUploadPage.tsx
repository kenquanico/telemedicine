import { useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import { PageShell, PageHero, Card, SectionTitle, TealButton, Divider, Step } from "./pageComponents";
import { Check, Upload } from "lucide-react";
import { useApp } from "../hooks/useApp";

export default function PrescriptionUploadPage({ onBack }: { onBack?: () => void }) {
    const { completePrescriptionUpload, showModal } = useApp();
    const [dragging, setDragging] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const acceptFile = (file: File | undefined) => {
        if (!file) return;

        const validExtension = /\.(jpe?g|png|pdf)$/i.test(file.name);
        const validSize = file.size <= 10 * 1024 * 1024;

        if (!validExtension || !validSize) {
            setFileName(null);
            setUploadError("Upload a JPG, PNG, or PDF file up to 10 MB.");
            return;
        }

        setUploadError(null);
        setFileName(file.name);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        acceptFile(e.target.files?.[0]);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragging(false);
        acceptFile(e.dataTransfer.files[0]);
    };

    const handleSubmit = () => {
        if (!fileName) {
            setUploadError("Upload a JPG, PNG, or PDF file up to 10 MB.");
            return;
        }

        completePrescriptionUpload();
        showModal({
            type: "success",
            icon: <Check size={30} strokeWidth={1.8} className="text-[#427b77]" />,
            title: "Prescription Uploaded",
            message: "Your prescription has been attached. You can continue with your restricted medicine order.",
        });
    };

    return (
        <PageShell onBack={onBack} breadcrumbLabel="Prescription Upload">
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
                            <Check size={15} strokeWidth={2.2} className="mt-0.5 shrink-0 text-[#427b77]" />
                            <span className="text-[13px] text-[#262626]/70 epilogue-regular">{req}</span>
                        </li>
                    ))}
                </ul>
            </Card>

            <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className={`mb-5 flex flex-col items-center justify-center rounded-[14px] border-2 border-dashed py-14 px-6 text-center transition-colors duration-200 ${
                    dragging ? "border-[#427b77] bg-[#427b77]/5" : "border-[#EAEFEE] bg-white"
                }`}
            >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#427b77]/10 text-[#427b77]">
                    <Upload size={24} strokeWidth={1.8} />
                </div>
                {fileName ? (
                    <>
                        <p className="text-[14px] font-bold text-[#262626] epilogue-header">{fileName}</p>
                        <button onClick={() => { setFileName(null); setUploadError(null); }} className="mt-2 text-[12px] text-[#427b77] font-semibold epilogue-header hover:underline">Remove</button>
                    </>
                ) : (
                    <>
                        <p className="text-[15px] font-bold text-[#262626] epilogue-header">Drag & drop your prescription here</p>
                        <p className="mt-1 text-[13px] text-[#262626]/50 epilogue-regular">or</p>
                        <label className="mt-3 cursor-pointer rounded-xl border border-[#DCE6E4] px-5 py-2.5 text-[13px] font-bold text-[#427b77] epilogue-header hover:bg-[#427b77]/5 transition-colors">
                            Browse files
                            <input type="file" className="sr-only" accept=".jpg,.jpeg,.png,.pdf" onChange={handleFileChange} />
                        </label>
                        <p className="mt-3 text-[11px] text-[#262626]/40 epilogue-regular">JPG, PNG, or PDF · Max 10 MB</p>
                    </>
                )}
            </div>
            {uploadError && (
                <p className="-mt-2 mb-5 text-[12px] font-semibold text-[#8A5A12] epilogue-header">
                    {uploadError}
                </p>
            )}

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

            {fileName && <TealButton onClick={handleSubmit}>Submit Prescription</TealButton>}

            <Divider />
            <p className="text-[13px] text-[#262626]/50 epilogue-regular">
                Need help? <a href="mailto:pharmacist@dosely.ph" className="text-[#427b77] font-semibold hover:underline">Chat with our pharmacist</a> — available 8 AM – 9 PM daily.
            </p>
        </PageShell>
    );
}
