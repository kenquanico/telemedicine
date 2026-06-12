import { useState } from "react";
import { useApp } from "../hooks/useApp";
import { SectionHeader } from "../components/UI";
import Footer from "../components/Footer";
import {
    User,
    Mail,
    Phone,
    CalendarDays,
    MapPin,
    Plus,
    ChevronRight,
    Bell,
    CreditCard,
    ShieldCheck,
    LogOut,
    Pencil,
    AlertCircle,
    Pill,
    Store,
    X,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

interface UserProfile {
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    initials: string;
}

interface DeliveryAddress {
    id: string;
    label: string;
    line1: string;
    line2?: string;
    city: string;
    isDefault: boolean;
}

interface HealthPreferences {
    allergies: string[];
    currentMedications: string[];
    preferredPharmacy: string | null;
}

// ── Mock data ────────────────────────────────────────────────────────────────

const MOCK_PROFILE: UserProfile = {
    fullName: "Juan dela Cruz",
    email: "juan.delacruz@email.com",
    phone: "+63 917 123 4567",
    dateOfBirth: "1995-04-12",
    initials: "JD",
};

const MOCK_ADDRESSES: DeliveryAddress[] = [
    {
        id: "addr-1",
        label: "Home",
        line1: "123 Colon St., Brgy. Santo Niño",
        line2: "Near Osmena Circle",
        city: "Cebu City, 6000",
        isDefault: true,
    },
];

const MOCK_HEALTH: HealthPreferences = {
    allergies: ["Penicillin", "Sulfonamides"],
    currentMedications: ["Metformin 500mg", "Amlodipine 5mg"],
    preferredPharmacy: "Rose Pharmacy — Ayala Center Cebu",
};

// ── Small helpers ────────────────────────────────────────────────────────────

function InfoRow({
                     icon,
                     label,
                     value,
                     fallback = "Not set",
                 }: {
    icon: React.ReactNode;
    label: string;
    value?: string | null;
    fallback?: string;
}) {
    const isEmpty = !value;
    return (
        <div className="flex items-start gap-3 py-3.5 border-b border-[#EAEFEE] last:border-0">
            <span className="mt-0.5 shrink-0 text-[#427b77]">{icon}</span>
            <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#262626]/40 epilogue-header mb-0.5">
                    {label}
                </p>
                <p
                    className={`text-[15px] epilogue-regular truncate ${
                        isEmpty ? "text-[#262626]/30 italic" : "text-[#262626] font-medium"
                    }`}
                >
                    {isEmpty ? fallback : value}
                </p>
            </div>
        </div>
    );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`rounded-[14px] border border-[#EAEFEE] bg-white px-5 ${className}`}>
            {children}
        </div>
    );
}

function SettingsRow({
                         icon,
                         label,
                         sublabel,
                         onClick,
                         destructive = false,
                     }: {
    icon: React.ReactNode;
    label: string;
    sublabel?: string;
    onClick?: () => void;
    destructive?: boolean;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex w-full items-center gap-3.5 py-3.5 border-b border-[#EAEFEE] last:border-0 text-left group"
        >
            <span
                className={`shrink-0 ${
                    destructive ? "text-[#e11d48]" : "text-[#427b77]"
                }`}
            >
                {icon}
            </span>
            <div className="flex-1 min-w-0">
                <p
                    className={`text-[15px] font-semibold epilogue-header ${
                        destructive ? "text-[#e11d48]" : "text-[#262626]"
                    }`}
                >
                    {label}
                </p>
                {sublabel && (
                    <p className="text-[12px] text-[#262626]/50 epilogue-regular">{sublabel}</p>
                )}
            </div>
            {!destructive && (
                <ChevronRight
                    size={16}
                    strokeWidth={2}
                    className="shrink-0 text-[#262626]/30 transition-transform duration-150 group-hover:translate-x-0.5"
                />
            )}
        </button>
    );
}

function TagList({
                     items,
                     emptyLabel,
                     color = "#427b77",
                 }: {
    items: string[];
    emptyLabel: string;
    color?: string;
}) {
    if (items.length === 0) {
        return (
            <p className="text-[14px] text-[#262626]/30 italic epilogue-regular py-1">
                {emptyLabel}
            </p>
        );
    }
    return (
        <div className="flex flex-wrap gap-2 py-1">
            {items.map((item) => (
                <span
                    key={item}
                    className="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[12px] font-semibold epilogue-header"
                    style={{
                        borderColor: `${color}33`,
                        backgroundColor: `${color}0d`,
                        color,
                    }}
                >
                    {item}
                </span>
            ))}
        </div>
    );
}

// ── ProfilePage ──────────────────────────────────────────────────────────────

export default function ProfilePage() {
    const { navigateTo } = useApp();

    const [profile] = useState<UserProfile>(MOCK_PROFILE);
    const [addresses] = useState<DeliveryAddress[]>(MOCK_ADDRESSES);
    const [health] = useState<HealthPreferences>(MOCK_HEALTH);
    const [editingSection, setEditingSection] = useState<string | null>(null);

    const formattedDob = profile.dateOfBirth
        ? new Date(profile.dateOfBirth).toLocaleDateString("en-PH", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : null;

    const handleSignOut = () => {
        // Placeholder — wire to auth context when available
        navigateTo("home");
    };

    return (
        <>
            <div className="px-5 sm:px-8 lg:px-16 py-10 max-w-[880px] mx-auto w-full">

                {/* ── Page header ── */}
                <div className="mb-8">
                    <h1 className="text-[22px] font-extrabold text-[#262626] epilogue-header">
                        My Profile
                    </h1>
                    <p className="text-[14px] text-[#262626]/50 epilogue-regular mt-0.5">
                        Manage your personal information and preferences.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 items-start">

                    {/* ── Left column ── */}
                    <div className="flex flex-col gap-6 w-full lg:w-[260px] shrink-0">

                        {/* Avatar card */}
                        <Card className="py-6 flex flex-col items-center text-center gap-3">
                            <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full border-2 border-[#427b77]/25 bg-[#427b77]/10">
                                <span className="text-[22px] font-extrabold text-[#427b77] epilogue-header">
                                    {profile.initials}
                                </span>
                            </div>
                            <div>
                                <p className="text-[16px] font-bold text-[#262626] epilogue-header">
                                    {profile.fullName}
                                </p>
                                <p className="text-[13px] text-[#262626]/50 epilogue-regular mt-0.5 truncate max-w-[180px]">
                                    {profile.email}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setEditingSection("personal")}
                                className="mt-1 flex items-center gap-1.5 rounded-[10px] border border-[#DCE6E4] px-4 py-1.5 text-[12px] font-bold text-[#427b77] epilogue-header transition-colors hover:bg-[#427b77]/5"
                            >
                                <Pencil size={12} strokeWidth={2.5} />
                                Edit profile
                            </button>
                        </Card>

                        {/* Account settings */}
                        <div>
                            <SectionHeader title="Account" />
                            <Card className="mt-4">
                                <SettingsRow
                                    icon={<Bell size={17} strokeWidth={2} />}
                                    label="Notifications"
                                    sublabel="Orders, promos, reminders"
                                />
                                <SettingsRow
                                    icon={<CreditCard size={17} strokeWidth={2} />}
                                    label="Payment methods"
                                    sublabel="GCash, card, cash on delivery"
                                />
                                <SettingsRow
                                    icon={<ShieldCheck size={17} strokeWidth={2} />}
                                    label="Privacy & security"
                                    sublabel="Password, data settings"
                                />
                                <SettingsRow
                                    icon={<LogOut size={17} strokeWidth={2} />}
                                    label="Sign out"
                                    destructive
                                    onClick={handleSignOut}
                                />
                            </Card>
                        </div>
                    </div>

                    {/* ── Right column ── */}
                    <div className="flex flex-col gap-6 flex-1 min-w-0 w-full">

                        {/* Personal information */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <SectionHeader title="Personal Information" />
                                <button
                                    type="button"
                                    onClick={() => setEditingSection(editingSection === "personal" ? null : "personal")}
                                    className="flex items-center gap-1.5 text-[12px] font-bold text-[#427b77] epilogue-header"
                                >
                                    {editingSection === "personal" ? (
                                        <>
                                            <X size={13} strokeWidth={2.5} />
                                            Cancel
                                        </>
                                    ) : (
                                        <>
                                            <Pencil size={12} strokeWidth={2.5} />
                                            Edit
                                        </>
                                    )}
                                </button>
                            </div>
                            <Card>
                                <InfoRow
                                    icon={<User size={16} strokeWidth={2} />}
                                    label="Full name"
                                    value={profile.fullName}
                                />
                                <InfoRow
                                    icon={<Mail size={16} strokeWidth={2} />}
                                    label="Email"
                                    value={profile.email}
                                />
                                <InfoRow
                                    icon={<Phone size={16} strokeWidth={2} />}
                                    label="Phone number"
                                    value={profile.phone}
                                    fallback="Add a phone number"
                                />
                                <InfoRow
                                    icon={<CalendarDays size={16} strokeWidth={2} />}
                                    label="Date of birth"
                                    value={formattedDob}
                                    fallback="Add date of birth"
                                />
                            </Card>
                        </div>

                        {/* Delivery addresses */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <SectionHeader title="Delivery Address" />
                                <button
                                    type="button"
                                    className="flex items-center gap-1.5 text-[12px] font-bold text-[#427b77] epilogue-header"
                                >
                                    <Plus size={13} strokeWidth={2.5} />
                                    Add address
                                </button>
                            </div>

                            {addresses.length === 0 ? (
                                <Card className="py-8 flex flex-col items-center text-center gap-2">
                                    <MapPin size={28} strokeWidth={1.5} className="text-[#262626]/20" />
                                    <p className="text-[14px] font-bold text-[#262626]/40 epilogue-header">
                                        No address saved
                                    </p>
                                    <p className="text-[13px] text-[#262626]/30 epilogue-regular">
                                        Add a delivery address to speed up checkout.
                                    </p>
                                    <button
                                        type="button"
                                        className="mt-2 rounded-[10px] border border-[#DCE6E4] px-4 py-1.5 text-[12px] font-bold text-[#427b77] epilogue-header"
                                    >
                                        Add address
                                    </button>
                                </Card>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    {addresses.map((addr) => (
                                        <Card key={addr.id} className="py-4 flex items-start gap-3.5">
                                            <div className="mt-0.5 h-8 w-8 rounded-[10px] bg-[#427b77]/10 flex items-center justify-center shrink-0">
                                                <MapPin size={15} strokeWidth={2} className="text-[#427b77]" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <p className="text-[14px] font-bold text-[#262626] epilogue-header">
                                                        {addr.label}
                                                    </p>
                                                    {addr.isDefault && (
                                                        <span className="rounded-md bg-[#427b77]/10 px-2 py-0.5 text-[10px] font-bold text-[#427b77] epilogue-header">
                                                            Default
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[13px] text-[#262626]/60 epilogue-regular">
                                                    {addr.line1}
                                                    {addr.line2 && `, ${addr.line2}`}
                                                </p>
                                                <p className="text-[13px] text-[#262626]/60 epilogue-regular">
                                                    {addr.city}
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                className="shrink-0 text-[12px] font-bold text-[#427b77] epilogue-header mt-0.5"
                                            >
                                                Edit
                                            </button>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Health preferences */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <SectionHeader title="Health Preferences" />
                                <button
                                    type="button"
                                    className="flex items-center gap-1.5 text-[12px] font-bold text-[#427b77] epilogue-header"
                                >
                                    <Pencil size={12} strokeWidth={2.5} />
                                    Edit
                                </button>
                            </div>

                            <Card>
                                {/* Allergies */}
                                <div className="py-3.5 border-b border-[#EAEFEE]">
                                    <div className="flex items-center gap-2 mb-2">
                                        <AlertCircle size={15} strokeWidth={2} className="text-[#e11d48]" />
                                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#262626]/40 epilogue-header">
                                            Allergies
                                        </p>
                                    </div>
                                    <TagList
                                        items={health.allergies}
                                        emptyLabel="No allergies recorded"
                                        color="#e11d48"
                                    />
                                </div>

                                {/* Current medications */}
                                <div className="py-3.5 border-b border-[#EAEFEE]">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Pill size={15} strokeWidth={2} className="text-[#427b77]" />
                                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#262626]/40 epilogue-header">
                                            Current medications
                                        </p>
                                    </div>
                                    <TagList
                                        items={health.currentMedications}
                                        emptyLabel="No medications recorded"
                                    />
                                </div>

                                {/* Preferred pharmacy */}
                                <div className="py-3.5">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <Store size={15} strokeWidth={2} className="text-[#427b77]" />
                                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#262626]/40 epilogue-header">
                                            Preferred pharmacy
                                        </p>
                                    </div>
                                    {health.preferredPharmacy ? (
                                        <p className="text-[14px] font-medium text-[#262626] epilogue-regular">
                                            {health.preferredPharmacy}
                                        </p>
                                    ) : (
                                        <p className="text-[14px] text-[#262626]/30 italic epilogue-regular">
                                            No preference set
                                        </p>
                                    )}
                                </div>
                            </Card>
                        </div>

                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}
