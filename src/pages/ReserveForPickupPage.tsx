import { useState, useRef, useEffect } from "react";
import {
    ChevronLeft, ChevronRight, MapPin, Clock, Truck,
    Package, Check, Plus, Minus, Trash2,
    CalendarDays, User, Phone, FileText, AlertCircle,
    ShoppingBag, Star,
} from "lucide-react";
import { useApp } from "../hooks/useApp";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface CartItem {
    id: string;
    brandName: string;
    genericName: string;
    strength: string;
    dosageForm: string;
    packSize: string;
    price: number;
    image: string;
    qty: number;
    requiresPrescription?: boolean;
}

interface Pharmacy {
    id: string;
    name: string;
    address: string;
    openNow: boolean | null;
    hasFreeDelivery: boolean;
    rating: number | null;
    userRatingsTotal: number;
    photos?: google.maps.places.PlacePhoto[];
}

interface ReservePickupPageProps {
    pharmacy: Pharmacy;
    cartItems?: CartItem[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Mock cart data (replace with real cart from useApp)
// ─────────────────────────────────────────────────────────────────────────────

const MOCK_CART: CartItem[] = [
    {
        id: "p1",
        brandName: "Biogesic",
        genericName: "Paracetamol",
        strength: "500mg",
        dosageForm: "Tablet",
        packSize: "10 tablets",
        price: 18,
        image: "https://images.watsons.com.ph/medias/sys_master/frontend/h7a/h43/9098348085278.jpg",
        qty: 2,
        requiresPrescription: false,
    },
    {
        id: "p2",
        brandName: "Cetirizine",
        genericName: "Cetirizine HCl",
        strength: "10mg",
        dosageForm: "Tablet",
        packSize: "30 tablets",
        price: 120,
        image: "https://images.watsons.com.ph/medias/sys_master/frontend/hf2/h97/9100213157918.jpg",
        qty: 1,
        requiresPrescription: false,
    },
    {
        id: "p3",
        brandName: "Amoxicillin",
        genericName: "Amoxicillin trihydrate",
        strength: "500mg",
        dosageForm: "Capsule",
        packSize: "20 capsules",
        price: 85,
        image: "https://images.watsons.com.ph/medias/sys_master/frontend/h8b/h68/9098348019742.jpg",
        qty: 1,
        requiresPrescription: true,
    },
];

const PICKUP_SLOTS = [
    { id: "s1", label: "Today", time: "2:00 – 3:00 PM",  available: true  },
    { id: "s2", label: "Today", time: "4:00 – 5:00 PM",  available: true  },
    { id: "s3", label: "Today", time: "6:00 – 7:00 PM",  available: false },
    { id: "s4", label: "Tomorrow", time: "9:00 – 10:00 AM", available: true },
    { id: "s5", label: "Tomorrow", time: "11:00 AM – 12:00 PM", available: true },
    { id: "s6", label: "Tomorrow", time: "1:00 – 2:00 PM", available: true },
];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const PHARMACY_COLORS: Record<string, string> = {
    Rose: "#e11d48", Mercury: "#0f766e", Watsons: "#005baa",
    Generika: "#16a34a", TGP: "#b45309", "St. Luke's": "#6d28d9",
    Default: "#3d7a75",
};

function getBrandColor(name: string): string {
    for (const key of Object.keys(PHARMACY_COLORS)) {
        if (name.toLowerCase().includes(key.toLowerCase())) return PHARMACY_COLORS[key];
    }
    return PHARMACY_COLORS.Default;
}

function getInitials(name: string): string {
    return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

// ─────────────────────────────────────────────────────────────────────────────
// Step indicator
// ─────────────────────────────────────────────────────────────────────────────

const STEPS = ["Order", "Schedule", "Details", "Confirm"];

function StepBar({ step }: { step: number }) {
    return (
        <div className="flex items-center gap-0 mb-8">
            {STEPS.map((label, i) => {
                const done    = i < step;
                const current = i === step;
                return (
                    <div key={label} className="flex items-center flex-1 last:flex-none">
                        <div className="flex flex-col items-center gap-1.5">
                            <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-300 epilogue-header ${
                                    done    ? "bg-[#427b77] text-white" :
                                        current ? "bg-[#427b77]/12 border-2 border-[#427b77] text-[#427b77]" :
                                            "bg-[#f2f5f4] text-[#262626]/40 border-2 border-transparent"
                                }`}
                            >
                                {done ? <Check size={13} strokeWidth={2.5} /> : <span>{i + 1}</span>}
                            </div>
                            <span className={`text-[10px] tracking-wide whitespace-nowrap epilogue-subheader ${
                                current ? "text-[#427b77] font-bold" : done ? "text-[#427b77]/80 font-semibold" : "text-[#262626]/40"
                            }`}>
                                {label}
                            </span>
                        </div>
                        {i < STEPS.length - 1 && (
                            <div className={`flex-1 h-[2px] mb-5 mx-1.5 rounded-full transition-all duration-300 ${
                                i < step ? "bg-[#427b77]" : "bg-[#e8edec]"
                            }`} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section wrapper
// ─────────────────────────────────────────────────────────────────────────────

function Section({ title, children, noPad }: { title?: string; children: React.ReactNode; noPad?: boolean }) {
    return (
        <div className="rounded-2xl border border-[#EAEFEE] bg-white overflow-hidden mb-4">
            {title && (
                <div className="px-5 pt-4 pb-3 border-b border-[#f2f5f4]">
                    <p className="text-[10px] font-bold text-[#262626]/50 uppercase tracking-widest epilogue-subheader">{title}</p>
                </div>
            )}
            <div className={noPad ? "" : "px-5 py-4"}>
                {children}
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 1 — Order Review
// ─────────────────────────────────────────────────────────────────────────────

function OrderStep({
                       items,
                       onUpdate,
                       pharmacy,
                   }: {
    items: CartItem[];
    onUpdate: (items: CartItem[]) => void;
    pharmacy: Pharmacy;
}) {
    const color    = getBrandColor(pharmacy.name);
    const photoUrl = pharmacy.photos?.[0]?.getUrl({ maxWidth: 400, maxHeight: 200 });

    const hasPrescription = items.some((i) => i.requiresPrescription);

    function updateQty(id: string, delta: number) {
        onUpdate(
            items
                .map((i) => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i)
                .filter((i) => i.qty > 0)
        );
    }

    function remove(id: string) {
        onUpdate(items.filter((i) => i.id !== id));
    }

    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const serviceFee = 15;
    const total = subtotal + serviceFee;

    return (
        <div>
            {/* Pharmacy summary */}
            <Section noPad>
                <div className="flex items-center gap-3 p-4">
                    {photoUrl ? (
                        <img src={photoUrl} alt={pharmacy.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                    ) : (
                        <div
                            className="w-14 h-14 rounded-xl flex items-center justify-center text-[15px] font-black flex-shrink-0 epilogue-header"
                            style={{ background: color + "14", color }}
                        >
                            {getInitials(pharmacy.name)}
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-extrabold text-[#262626] truncate epilogue-header">{pharmacy.name}</p>
                        <p className="text-[11.5px] text-[#262626]/60 truncate epilogue-regular mt-0.5 flex items-center gap-1">
                            <MapPin size={11} strokeWidth={1.75} className="flex-shrink-0" />
                            {pharmacy.address}
                        </p>
                        {pharmacy.rating && (
                            <div className="flex items-center gap-1 mt-1">
                                <Star size={10} fill="#f59e0b" strokeWidth={0} className="text-amber-500" />
                                <span className="text-[11px] font-semibold text-[#262626] epilogue-header">{pharmacy.rating}</span>
                                <span className="text-[11px] text-[#262626]/50 epilogue-regular">({pharmacy.userRatingsTotal}+)</span>
                            </div>
                        )}
                    </div>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-semibold ${
                        pharmacy.openNow === true ? "bg-emerald-50 text-emerald-700" :
                            pharmacy.openNow === false ? "bg-red-50 text-red-600" :
                                "bg-gray-100 text-[#262626]/60"
                    } epilogue-subheader`}>
                        <span className={`w-[5px] h-[5px] rounded-full ${
                            pharmacy.openNow === true ? "bg-emerald-500" :
                                pharmacy.openNow === false ? "bg-red-500" : "bg-gray-400"
                        }`} />
                        {pharmacy.openNow === true ? "Open" : pharmacy.openNow === false ? "Closed" : "Hrs vary"}
                    </div>
                </div>
            </Section>

            {/* Prescription notice */}
            {hasPrescription && (
                <div className="flex items-start gap-3 px-4 py-3 rounded-2xl bg-amber-50 border border-amber-200 mb-4">
                    <AlertCircle size={16} strokeWidth={1.75} className="text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-[12px] text-amber-800 epilogue-regular leading-relaxed">
                        <span className="font-bold epilogue-subheader">Prescription required</span> — bring a valid Rx for highlighted items. The pharmacy will verify before dispensing.
                    </p>
                </div>
            )}

            {/* Cart items */}
            <Section title="Items in your order" noPad>
                <div className="divide-y divide-[#f2f5f4]">
                    {items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 px-4 py-3.5">
                            <div className="w-12 h-12 rounded-xl bg-[#f7fafa] border border-[#EAEFEE] flex items-center justify-center overflow-hidden flex-shrink-0">
                                {item.image.startsWith("http") ? (
                                    <img src={item.image} alt={item.brandName} className="w-full h-full object-contain p-1" />
                                ) : (
                                    <span className="text-[9px] font-bold text-[#262626]/60 text-center epilogue-header px-1">{item.brandName}</span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 mb-0.5">
                                    <p className="text-[13px] font-bold text-[#262626] truncate epilogue-header">{item.brandName}</p>
                                    {item.requiresPrescription && (
                                        <span className="flex-shrink-0 px-1.5 py-[2px] rounded-md bg-amber-100 text-amber-700 text-[9px] font-bold epilogue-subheader tracking-wide">Rx</span>
                                    )}
                                </div>
                                <p className="text-[11px] text-[#262626]/50 truncate epilogue-regular">
                                    {item.genericName} · {item.strength} · {item.packSize}
                                </p>
                                <p className="text-[12px] font-extrabold text-[#262626] mt-0.5 epilogue-header">
                                    ₱{(item.price * item.qty).toLocaleString()}
                                    <span className="font-normal text-[#262626]/40 text-[10.5px] ml-1">₱{item.price} each</span>
                                </p>
                            </div>
                            <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                <button
                                    onClick={() => remove(item.id)}
                                    className="text-[#262626]/30 hover:text-red-500 transition-colors"
                                    aria-label="Remove item"
                                >
                                    <Trash2 size={13} strokeWidth={1.75} />
                                </button>
                                <div className="flex items-center gap-1.5 border border-[#EAEFEE] rounded-xl px-1 py-0.5 bg-[#f9fbfb]">
                                    <button
                                        onClick={() => updateQty(item.id, -1)}
                                        className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-[#EAEFEE] transition-colors cursor-pointer"
                                    >
                                        <Minus size={11} strokeWidth={2} className="text-[#262626]" />
                                    </button>
                                    <span className="text-[12px] font-bold text-[#262626] w-4 text-center epilogue-header">{item.qty}</span>
                                    <button
                                        onClick={() => updateQty(item.id, 1)}
                                        className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-[#EAEFEE] transition-colors cursor-pointer"
                                    >
                                        <Plus size={11} strokeWidth={2} className="text-[#262626]" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Section>

            {/* Price summary */}
            <Section title="Price summary">
                <div className="space-y-2.5">
                    <div className="flex justify-between">
                        <span className="text-[12.5px] text-[#262626]/60 epilogue-regular">Subtotal ({items.reduce((s,i)=>s+i.qty,0)} items)</span>
                        <span className="text-[12.5px] font-semibold text-[#262626] epilogue-header">₱{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-[12.5px] text-[#262626]/60 epilogue-regular">Reservation fee</span>
                        <span className="text-[12.5px] font-semibold text-[#262626] epilogue-header">₱{serviceFee}</span>
                    </div>
                    {pharmacy.hasFreeDelivery && (
                        <div className="flex justify-between">
                            <span className="text-[12.5px] text-[#262626]/60 epilogue-regular flex items-center gap-1">
                                <Truck size={11} strokeWidth={1.75} className="text-blue-500" /> Delivery
                            </span>
                            <span className="text-[12.5px] font-semibold text-blue-600 epilogue-header">Free</span>
                        </div>
                    )}
                    <div className="border-t border-[#f2f5f4] pt-2.5 flex justify-between">
                        <span className="text-[13px] font-bold text-[#262626] epilogue-header">Total due at pickup</span>
                        <span className="text-[15px] font-extrabold text-[#262626] epilogue-header">₱{total.toLocaleString()}</span>
                    </div>
                </div>
            </Section>
        </div>
    );
}

function SlotGroup({
    label,
    slots,
    selected,
    onSelect,
}: {
    label: string;
    slots: typeof PICKUP_SLOTS;
    selected: string;
    onSelect: (id: string) => void;
}) {
    return (
        <div className="mb-4">
            <p className="text-[10.5px] font-bold text-[#262626]/50 uppercase tracking-widest epilogue-subheader mb-2.5">{label}</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {slots.map((slot) => {
                    const isSelected = selected === slot.id;
                    return (
                        <button
                            key={slot.id}
                            onClick={() => slot.available && onSelect(slot.id)}
                            disabled={!slot.available}
                            className={`relative flex flex-col items-start px-3.5 py-3 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
                                !slot.available
                                    ? "bg-[#f7f9f9] border-[#EAEFEE] cursor-not-allowed opacity-50"
                                    : isSelected
                                        ? "bg-[#427b77]/8 border-[#427b77] shadow-[0_0_0_1px_#427b77]"
                                        : "bg-white border-[#EAEFEE] hover:border-[#427b77]/40 hover:bg-[#f7fafa]"
                            }`}
                        >
                            {isSelected && (
                                <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#427b77] flex items-center justify-center">
                                    <Check size={9} strokeWidth={3} className="text-white" />
                                </div>
                            )}
                            <Clock size={13} strokeWidth={1.75} className={`mb-1.5 ${isSelected ? "text-[#427b77]" : "text-[#262626]/40"}`} />
                            <span className={`text-[12.5px] font-bold leading-tight epilogue-header ${isSelected ? "text-[#427b77]" : "text-[#262626]"}`}>
                                {slot.time}
                            </span>
                            {!slot.available && (
                                <span className="text-[10px] text-[#262626]/40 mt-0.5 epilogue-regular">Fully booked</span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 2 — Schedule
// ─────────────────────────────────────────────────────────────────────────────

function ScheduleStep({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
    const today    = PICKUP_SLOTS.filter((s) => s.label === "Today");
    const tomorrow = PICKUP_SLOTS.filter((s) => s.label === "Tomorrow");

    return (
        <div>
            <Section title="Choose a pickup window">
                <SlotGroup label="Today" slots={today} selected={selected} onSelect={onSelect} />
                <SlotGroup label="Tomorrow" slots={tomorrow} selected={selected} onSelect={onSelect} />
            </Section>
            <div className="flex items-start gap-3 px-4 py-3 rounded-2xl bg-[#f0f8f7] border border-[#d4e9e6] mb-4">
                <CalendarDays size={15} strokeWidth={1.75} className="text-[#427b77] flex-shrink-0 mt-0.5" />
                <p className="text-[12px] text-[#3d6e69] epilogue-regular leading-relaxed">
                    Your order will be set aside and held for <span className="font-bold epilogue-subheader">30 minutes</span> after your window starts. Arrive on time to guarantee your items.
                </p>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 3 — Personal Details
// ─────────────────────────────────────────────────────────────────────────────

interface PersonalDetails {
    name: string;
    phone: string;
    notes: string;
    paymentMethod: "cash" | "gcash" | "card";
}

function DetailsField({
    label,
    value,
    onChange,
    placeholder,
    type = "text",
    icon: Icon,
    required,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    type?: string;
    icon: React.ElementType;
    required?: boolean;
}) {
    return (
        <div>
            <label className="block text-[10px] font-bold text-[#262626]/50 uppercase tracking-widest mb-1.5 epilogue-subheader">
                {label}{required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            <div className="relative">
                <Icon size={14} strokeWidth={1.75} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#262626]/40 pointer-events-none" />
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#EAEFEE] bg-[#fafbfb] text-[13px] text-[#262626] placeholder-[#262626]/30 outline-none focus:border-[#427b77]/60 focus:bg-white transition-all epilogue-regular"
                />
            </div>
        </div>
    );
}

function DetailsStep({ details, onChange }: { details: PersonalDetails; onChange: (d: PersonalDetails) => void }) {
    const PAYMENT_OPTIONS = [
        { id: "cash",  label: "Cash",   icon: "💵" },
        { id: "gcash", label: "GCash",  icon: "📱" },
        { id: "card",  label: "Card",   icon: "💳" },
    ] as const;

    return (
        <div>
            <Section title="Your information">
                <div className="space-y-4">
                    <DetailsField
                        label="Full name" value={details.name}
                        onChange={(v) => onChange({ ...details, name: v })}
                        placeholder="Juan dela Cruz" icon={User} required
                    />
                    <DetailsField
                        label="Mobile number" value={details.phone}
                        onChange={(v) => onChange({ ...details, phone: v })}
                        placeholder="09xx xxx xxxx" icon={Phone} type="tel" required
                    />
                    <div>
                        <label className="block text-[10px] font-bold text-[#262626]/50 uppercase tracking-widest mb-1.5 epilogue-subheader">
                            Notes for the pharmacist
                        </label>
                        <div className="relative">
                            <FileText size={14} strokeWidth={1.75} className="absolute left-3.5 top-3 text-[#262626]/40 pointer-events-none" />
                            <textarea
                                value={details.notes}
                                onChange={(e) => onChange({ ...details, notes: e.target.value })}
                                placeholder="Any special requests, generic alternatives, etc."
                                rows={3}
                                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#EAEFEE] bg-[#fafbfb] text-[13px] text-[#262626] placeholder-[#262626]/30 outline-none focus:border-[#427b77]/60 focus:bg-white transition-all resize-none epilogue-regular"
                            />
                        </div>
                    </div>
                </div>
            </Section>

            <Section title="Payment method">
                <div className="grid grid-cols-3 gap-2">
                    {PAYMENT_OPTIONS.map((opt) => {
                        const isSelected = details.paymentMethod === opt.id;
                        return (
                            <button
                                key={opt.id}
                                onClick={() => onChange({ ...details, paymentMethod: opt.id })}
                                className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all cursor-pointer ${
                                    isSelected
                                        ? "bg-[#427b77]/8 border-[#427b77] shadow-[0_0_0_1px_#427b77]"
                                        : "bg-white border-[#EAEFEE] hover:border-[#427b77]/40"
                                }`}
                            >
                                <span className="text-lg">{opt.icon}</span>
                                <span className={`text-[11px] font-bold epilogue-header ${isSelected ? "text-[#427b77]" : "text-[#262626]"}`}>
                                    {opt.label}
                                </span>
                                {isSelected && (
                                    <div className="w-3.5 h-3.5 rounded-full bg-[#427b77] flex items-center justify-center">
                                        <Check size={8} strokeWidth={3} className="text-white" />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </Section>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 4 — Confirm
// ─────────────────────────────────────────────────────────────────────────────

function ConfirmStep({
                         items, pharmacy, slotId, details,
                     }: {
    items: CartItem[];
    pharmacy: Pharmacy;
    slotId: string;
    details: PersonalDetails;
}) {
    const slot     = PICKUP_SLOTS.find((s) => s.id === slotId);
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const total    = subtotal + 15;
    const color    = getBrandColor(pharmacy.name);

    const PAYMENT_LABELS = { cash: "Cash on pickup", gcash: "GCash", card: "Credit / Debit card" };

    return (
        <div>
            <Section noPad>
                <div className="p-5">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ background: color + "14" }}>
                        <Package size={22} strokeWidth={1.75} style={{ color }} />
                    </div>
                    <h3 className="text-[16px] font-extrabold text-[#262626] epilogue-header mb-0.5">Review your reservation</h3>
                    <p className="text-[12px] text-[#262626]/50 epilogue-regular">Double-check everything before confirming.</p>
                </div>
            </Section>

            <Section title="Pickup details" noPad>
                <div className="divide-y divide-[#f2f5f4]">
                    {[
                        { label: "Pharmacy", value: pharmacy.name, icon: MapPin },
                        { label: "Address",  value: pharmacy.address, icon: MapPin },
                        { label: "Time slot", value: slot ? `${slot.label} · ${slot.time}` : "—", icon: Clock },
                        { label: "Name",     value: details.name, icon: User },
                        { label: "Phone",    value: details.phone, icon: Phone },
                        { label: "Payment",  value: PAYMENT_LABELS[details.paymentMethod], icon: ShoppingBag },
                    ].map(({ label, value, icon: Icon }) => (
                        <div key={label} className="flex items-center gap-3 px-4 py-3">
                            <div className="w-7 h-7 rounded-lg bg-[#f2f5f4] flex items-center justify-center flex-shrink-0">
                                <Icon size={13} strokeWidth={1.75} className="text-[#427b77]" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] text-[#262626]/40 font-semibold uppercase tracking-wider epilogue-subheader">{label}</p>
                                <p className="text-[12.5px] font-semibold text-[#262626] epilogue-header truncate">{value || <span className="text-[#262626]/30 font-normal">Not provided</span>}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Section>

            <Section title={`Items (${items.reduce((s,i)=>s+i.qty,0)})`} noPad>
                <div className="divide-y divide-[#f2f5f4]">
                    {items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between px-4 py-3">
                            <div className="flex items-center gap-2.5">
                                <span className="w-5 h-5 rounded-md bg-[#427b77]/10 text-[#427b77] text-[10px] font-bold flex items-center justify-center epilogue-header">{item.qty}×</span>
                                <div>
                                    <p className="text-[12.5px] font-bold text-[#262626] epilogue-header">{item.brandName}</p>
                                    <p className="text-[10.5px] text-[#262626]/50 epilogue-regular">{item.strength} · {item.packSize}</p>
                                </div>
                            </div>
                            <span className="text-[12.5px] font-bold text-[#262626] epilogue-header">₱{(item.price * item.qty).toLocaleString()}</span>
                        </div>
                    ))}
                    <div className="px-4 py-3 flex justify-between">
                        <span className="text-[12px] text-[#262626]/50 epilogue-regular">Reservation fee</span>
                        <span className="text-[12px] font-semibold text-[#262626] epilogue-header">₱15</span>
                    </div>
                    <div className="px-4 py-3 flex justify-between bg-[#f7fafa]">
                        <span className="text-[13px] font-bold text-[#262626] epilogue-header">Total</span>
                        <span className="text-[15px] font-extrabold text-[#262626] epilogue-header">₱{total.toLocaleString()}</span>
                    </div>
                </div>
            </Section>

            {details.notes && (
                <Section title="Notes">
                    <p className="text-[12.5px] text-[#262626]/70 epilogue-regular leading-relaxed">{details.notes}</p>
                </Section>
            )}

            <div className="flex items-start gap-2.5 px-4 py-3 rounded-2xl bg-[#fffbeb] border border-amber-200 mb-4">
                <AlertCircle size={15} strokeWidth={1.75} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-[11.5px] text-amber-800 epilogue-regular leading-relaxed">
                    Payment is collected <span className="font-bold epilogue-subheader">at the pharmacy</span>. The reservation fee (₱15) is refundable if you cancel at least 1 hour before your slot.
                </p>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Success screen
// ─────────────────────────────────────────────────────────────────────────────

function SuccessScreen({ pharmacy, slotId, onDone }: { pharmacy: Pharmacy; slotId: string; onDone: () => void }) {
    const slot  = PICKUP_SLOTS.find((s) => s.id === slotId);
    const color = getBrandColor(pharmacy.name);
    const [reference] = useState(() => `RX${pharmacy.id.replace(/\W/g, "").slice(0, 2).toUpperCase()}${slotId.toUpperCase()}`);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 py-10 text-center">
            <div
                className="w-20 h-20 rounded-[24px] flex items-center justify-center mb-5 shadow-lg"
                style={{ background: color, boxShadow: `0 8px 32px ${color}44` }}
            >
                <Check size={38} strokeWidth={2.5} className="text-white" />
            </div>
            <h2 className="text-[22px] font-extrabold text-[#262626] epilogue-header mb-1.5">You're all set!</h2>
            <p className="text-[13px] text-[#262626]/60 epilogue-regular mb-6 max-w-[280px] leading-relaxed">
                Your order is reserved at <span className="font-bold text-[#262626] epilogue-header">{pharmacy.name}</span>.
            </p>

            <div className="w-full max-w-[360px] rounded-2xl border border-[#EAEFEE] bg-white overflow-hidden mb-5">
                <div className="px-5 py-4 border-b border-[#f2f5f4]">
                    <p className="text-[10px] font-bold text-[#262626]/40 uppercase tracking-widest epilogue-subheader">Reservation reference</p>
                    <p className="text-[22px] font-black tracking-[0.12em] text-[#262626] mt-0.5 epilogue-header">{reference}</p>
                </div>
                {slot && (
                    <div className="px-5 py-4 flex items-center gap-3">
                        <Clock size={18} strokeWidth={1.75} className="text-[#427b77]" />
                        <div>
                            <p className="text-[10px] font-bold text-[#262626]/40 uppercase tracking-widest epilogue-subheader">Pickup window</p>
                            <p className="text-[13.5px] font-bold text-[#262626] epilogue-header">{slot.label} · {slot.time}</p>
                        </div>
                    </div>
                )}
            </div>

            <p className="text-[11.5px] text-[#262626]/50 epilogue-regular mb-8 max-w-[280px] leading-relaxed">
                Show this reference code at the pharmacy counter. Your items will be held for 30 minutes after your slot begins.
            </p>

            <button
                onClick={onDone}
                className="w-full max-w-[360px] rounded-xl py-3.5 text-[13.5px] font-bold text-white epilogue-header transition-all"
                style={{ background: color, boxShadow: `0 4px 18px ${color}44` }}
            >
                Done
            </button>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────

export default function ReservePickupPage({ pharmacy, cartItems: initialCart }: ReservePickupPageProps) {
    const { navigateBack } = useApp();
    const [step,    setStep]    = useState(0);
    const [done,    setDone]    = useState(false);
    const [items,   setItems]   = useState<CartItem[]>(initialCart ?? MOCK_CART);
    const [slotId,  setSlotId]  = useState("");
    const [details, setDetails] = useState<PersonalDetails>({
        name: "", phone: "", notes: "", paymentMethod: "cash",
    });

    const scrollRef = useRef<HTMLDivElement>(null);

    // Scroll to top when step changes
    useEffect(() => {
        scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }, [step]);

    const color = getBrandColor(pharmacy.name);

    const canAdvance = [
        items.length > 0,
        !!slotId,
        !!details.name.trim() && !!details.phone.trim(),
        true,
    ][step];

    function handleNext() {
        if (step < STEPS.length - 1) setStep((s) => s + 1);
        else setDone(true);
    }

    function handleBack() {
        if (step > 0) setStep((s) => s - 1);
        else navigateBack();
    }

    const CTA_LABELS = ["Review order", "Select pickup time", "Confirm details", "Place reservation"];

    return (
        <div className="relative flex flex-col h-screen bg-[#f7f9f9] epilogue-regular overflow-hidden">

            {/* ── Header ── */}
            <div className="flex-shrink-0 flex items-center gap-3 px-5 pt-safe pt-5 pb-4 bg-white border-b border-[#EAEFEE] shadow-[0_1px_0_#EAEFEE]">
                <button
                    onClick={handleBack}
                    className="w-9 h-9 rounded-full border border-[#EAEFEE] bg-white flex items-center justify-center cursor-pointer hover:bg-[#f7fafa] transition-colors flex-shrink-0"
                >
                    <ChevronLeft size={20} strokeWidth={1.75} className="text-[#262626]" />
                </button>
                <div className="flex-1 min-w-0">
                    <h1 className="text-[15px] font-extrabold text-[#262626] epilogue-header truncate">Reserve for Pickup</h1>
                    <p className="text-[11px] text-[#262626]/50 epilogue-regular truncate">{pharmacy.name}</p>
                </div>
                {!done && (
                    <span className="text-[11px] font-semibold text-[#262626]/40 epilogue-subheader flex-shrink-0">
                        {step + 1} / {STEPS.length}
                    </span>
                )}
            </div>

            {/* ── Scrollable body ── */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain">
                <div className="max-w-[600px] mx-auto px-4 pt-6 pb-32">

                    {done ? (
                        <SuccessScreen pharmacy={pharmacy} slotId={slotId} onDone={navigateBack} />
                    ) : (
                        <>
                            <StepBar step={step} />

                            {step === 0 && (
                                <OrderStep items={items} onUpdate={setItems} pharmacy={pharmacy} />
                            )}
                            {step === 1 && (
                                <ScheduleStep selected={slotId} onSelect={setSlotId} />
                            )}
                            {step === 2 && (
                                <DetailsStep details={details} onChange={setDetails} />
                            )}
                            {step === 3 && (
                                <ConfirmStep items={items} pharmacy={pharmacy} slotId={slotId} details={details} />
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* ── Sticky CTA ── */}
            {!done && (
                <div className="flex-shrink-0 absolute bottom-0 left-0 right-0 z-20 px-4 pb-safe pb-6 pt-4"
                     style={{
                         background: "linear-gradient(to top, white 60%, rgba(247,249,249,0))",
                     }}
                >
                    <div className="max-w-[600px] mx-auto">
                        {!canAdvance && step === 1 && (
                            <p className="text-center text-[11px] text-[#262626]/50 mb-2 epilogue-regular">Select a pickup window to continue</p>
                        )}
                        {!canAdvance && step === 2 && (
                            <p className="text-center text-[11px] text-[#262626]/50 mb-2 epilogue-regular">Name and phone number are required</p>
                        )}
                        <button
                            onClick={handleNext}
                            disabled={!canAdvance}
                            className="w-full rounded-xl py-3.5 flex items-center justify-center gap-2 text-[13.5px] font-bold tracking-[-0.01em] text-white transition-all epilogue-header"
                            style={{
                                background: canAdvance ? color : "#262626",
                                opacity: canAdvance ? 1 : 0.25,
                                boxShadow: canAdvance ? `0 4px 18px ${color}44` : "none",
                            }}
                        >
                            {step === STEPS.length - 1 ? (
                                <>
                                    <Check size={16} strokeWidth={2.5} />
                                    Place reservation
                                </>
                            ) : (
                                <>
                                    {CTA_LABELS[step + 1]}
                                    <ChevronRight size={18} strokeWidth={1.75} />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}
