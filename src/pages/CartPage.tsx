import { useApp } from "../hooks/useApp";
import { QtySelector, Btn } from "../components/UI";
import { useState } from "react";
import { ShoppingBag, MapPin, ChevronRight, Tag, Shield } from "lucide-react";

const DELIVERY_FEE = 49;
const DISCOUNT = 28;

export default function CartPage() {
    const { cartItems, removeFromCart, updateQuantity, cartTotal, navigateTo, addresses, selectedAddressId } = useApp();
    const address = addresses.find((a) => a.id === selectedAddressId) ?? addresses[0];
    const total = cartTotal + DELIVERY_FEE - DISCOUNT;
    const [removingId, setRemovingId] = useState<string | null>(null);

    const handleRemove = (id: string) => {
        setRemovingId(id);
        setTimeout(() => {
            removeFromCart(id);
            setRemovingId(null);
        }, 220);
    };

    return (
        <div className="relative flex min-h-screen items-start gap-7 bg-[#F3F4F4] px-4 py-6 sm:px-6 lg:px-16 lg:py-8">

            {/* ── Main content ── */}
            <div className="flex-1 min-w-0">

                {/* ── Page heading ── */}
                <div className="mb-8 flex items-baseline gap-3">
                    <h2 className="text-2xl font-extrabold text-[#262626] epilogue-header" style={{ letterSpacing: "-0.02em" }}>
                        Shopping Cart
                    </h2>
                    {cartItems.length > 0 && (
                        <span className="text-sm text-[#262626]/50 epilogue-regular font-medium">
                            {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
                        </span>
                    )}
                </div>

                {/* ── Empty state ── */}
                {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-[14px] border border-[#E5E7EB] bg-white px-8 py-20 text-center">
                        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-[24px] bg-[#F4F7F8]">
                            <ShoppingBag size={34} strokeWidth={1.4} className="text-[#427b77]" />
                        </div>
                        <h3 className="mb-2 text-[19px] font-extrabold text-[#262626] epilogue-header">
                            Your cart is empty
                        </h3>
                        <p className="mb-7 text-sm text-[#262626]/55 epilogue-regular">
                            Add medicines to get started
                        </p>
                        <Btn onClick={() => navigateTo("catalog")} variant="secondary">
                            Browse Medicines
                        </Btn>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {cartItems.map((item) => {
                            const isRemoving = removingId === item.product.id;
                            return (
                                <div
                                    key={item.product.id}
                                    className="group flex flex-col gap-4 rounded-[14px] border border-[#E5E7EB] bg-white p-5 transition-all duration-200 sm:flex-row sm:items-center"
                                    style={{
                                        opacity: isRemoving ? 0 : 1,
                                        transform: isRemoving ? "translateX(12px)" : "translateX(0)",
                                        transition: "opacity 0.22s ease, transform 0.22s ease",
                                    }}
                                >
                                    {/* ── Product image ── */}
                                    <div
                                        className="relative h-20 w-20 shrink-0 cursor-pointer overflow-hidden rounded-xl bg-[#F7FAF9]"
                                        onClick={() => navigateTo("product", item.product.id)}
                                    >
                                        <img
                                            src={item.product.image}
                                            alt={item.product.brandName}
                                            className="h-full w-full scale-[1.18] object-contain transition-transform duration-300 group-hover:scale-[1.26]"
                                            onError={(e) => {
                                                (e.currentTarget as HTMLImageElement).style.display = "none";
                                            }}
                                        />
                                    </div>

                                    {/* ── Info ── */}
                                    <div className="min-w-0 flex-1">
                                        <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.07em] text-[#427b77] epilogue-header">
                                            {item.product.manufacturer.split(" ")[0]}
                                        </div>
                                        <div
                                            className="mb-1 cursor-pointer text-[15px] font-extrabold text-[#262626] epilogue-header leading-snug truncate"
                                            onClick={() => navigateTo("product", item.product.id)}
                                        >
                                            {item.product.brandName} {item.product.strength}
                                        </div>
                                        <div className="text-[13px] text-[#262626]/55 epilogue-regular">
                                            {item.product.dosageForm} · {item.product.packSize}
                                        </div>
                                    </div>

                                    {/* ── Controls ── */}
                                    <div className="flex shrink-0 flex-row items-center justify-between gap-5 sm:flex-col sm:items-end">
                                        <QtySelector
                                            value={item.quantity}
                                            onChange={(v) => updateQuantity(item.product.id, v)}
                                            size="sm"
                                        />
                                        <div className="text-[17px] font-extrabold text-[#262626] epilogue-header">
                                            ₱{(item.product.price * item.quantity).toLocaleString()}
                                        </div>
                                        <button
                                            onClick={() => handleRemove(item.product.id)}
                                            className="rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-red-400 transition-colors duration-150 hover:bg-red-50 hover:text-red-500 epilogue-header cursor-pointer border-none bg-transparent"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ── Order Summary sidebar ── */}
            {cartItems.length > 0 && (
                <div className="sticky top-[120px] hidden w-[340px] shrink-0 self-start lg:block">
                    <div className="rounded-[14px] border border-[#E5E7EB] bg-white p-6">

                        <h3 className="mb-5 text-[16px] font-extrabold text-[#262626] epilogue-header" style={{ letterSpacing: "-0.01em" }}>
                            Order Summary
                        </h3>

                        {/* Delivery address */}
                        <button
                            className="mb-5 w-full cursor-pointer rounded-xl border border-[#EAEFEE] bg-[#F7FAF9] p-4 text-left transition-colors duration-150 hover:border-[#427b77]/40 hover:bg-[#F0F6F5]"
                        >
                            <div className="mb-2 flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <MapPin size={12} strokeWidth={2} className="text-[#427b77]" />
                                    <span className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#427b77] epilogue-header">
                                        Deliver to
                                    </span>
                                </div>
                                <ChevronRight size={13} strokeWidth={2} className="text-[#262626]/30" />
                            </div>
                            <div className="text-[13px] font-extrabold text-[#262626] epilogue-header leading-snug">
                                {address.firstName} {address.lastName}
                            </div>
                            <div className="mt-0.5 text-[12px] text-[#262626]/55 epilogue-regular leading-relaxed">
                                {address.line}, {address.city} {address.zip}
                            </div>
                        </button>

                        {/* Promo code row */}
                        <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-dashed border-[#EAEFEE] px-4 py-3 transition-colors duration-150 hover:border-[#427b77]/40 cursor-pointer">
                            <Tag size={14} strokeWidth={1.8} className="text-[#427b77] shrink-0" />
                            <span className="text-[12px] text-[#262626]/50 epilogue-regular flex-1">Add promo code</span>
                            <ChevronRight size={13} strokeWidth={2} className="text-[#262626]/25" />
                        </div>

                        {/* Line items */}
                        <div className="mb-4 flex flex-col gap-3">
                            {[
                                {
                                    label: `Subtotal (${cartItems.length} item${cartItems.length !== 1 ? "s" : ""})`,
                                    value: `₱${cartTotal.toLocaleString()}`,
                                    valueClass: "text-[#262626] font-bold",
                                },
                                {
                                    label: "Delivery fee",
                                    value: `₱${DELIVERY_FEE}`,
                                    valueClass: "text-[#262626]/60 font-semibold",
                                },
                                {
                                    label: "Discount",
                                    value: `−₱${DISCOUNT}`,
                                    valueClass: "text-[#22C55E] font-bold",
                                },
                            ].map(({ label, value, valueClass }) => (
                                <div key={label} className="flex items-center justify-between">
                                    <span className="text-[13px] text-[#262626]/60 epilogue-regular">{label}</span>
                                    <span className={`text-[13px] epilogue-header ${valueClass}`}>{value}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mb-5 h-px bg-[#F0F3F2]" />

                        {/* Total */}
                        <div className="mb-5 flex items-baseline justify-between">
                            <span className="text-[15px] font-extrabold text-[#262626] epilogue-header">Total</span>
                            <span className="text-[22px] font-extrabold text-[#427b77] epilogue-header" style={{ letterSpacing: "-0.02em" }}>
                                ₱{total.toLocaleString()}
                            </span>
                        </div>

                        <Btn
                            variant="primary"
                            size="lg"
                            fullWidth
                            onClick={() => navigateTo("checkout")}
                            disabled={cartItems.length === 0}
                        >
                            Proceed to Checkout
                        </Btn>

                        {/* Trust badge */}
                        <div className="mt-4 flex items-center justify-center gap-1.5">
                            <Shield size={12} strokeWidth={2} className="text-[#262626]/30" />
                            <span className="text-[11px] text-[#262626]/40 epilogue-regular">
                                Secure checkout · End-to-end encrypted
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Mobile order summary (below cart) ── */}
            {cartItems.length > 0 && (
                <div className="lg:hidden w-full mt-6">
                    <div className="rounded-[14px] border border-[#E5E7EB] bg-white p-6">
                        <div className="mb-4 flex items-baseline justify-between">
                            <span className="text-[15px] font-extrabold text-[#262626] epilogue-header">Total</span>
                            <span className="text-[22px] font-extrabold text-[#427b77] epilogue-header" style={{ letterSpacing: "-0.02em" }}>
                                ₱{total.toLocaleString()}
                            </span>
                        </div>
                        <Btn
                            variant="primary"
                            size="lg"
                            fullWidth
                            onClick={() => navigateTo("checkout")}
                        >
                            Proceed to Checkout
                        </Btn>
                    </div>
                </div>
            )}

        </div>
    );
}
