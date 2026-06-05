import { type ReactNode, useState } from "react";
import { useApp } from "../hooks/useApp";
import { PRODUCTS } from "../data/mockData";
import { StockBadge, QtySelector, Stars, Btn } from "../components/UI";

type Tab = "details" | "dosage" | "warnings" | "reviews";

const formatPeso = (value?: number) => {
    if (typeof value !== "number") return "";
    return `₱${value.toLocaleString()}`;
};

function BackIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M12 5 5 12l7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function CartIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6.5 6h15l-1.7 8.4a2 2 0 0 1-2 1.6H9.3a2 2 0 0 1-2-1.6L5 3H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM18 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" fill="currentColor" />
        </svg>
    );
}

function CheckIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function DeliveryIcon() {
    return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 7h10v10H4V7Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M14 10h3.5L21 14v3h-7v-7Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M7.5 20a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM17.5 20a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" fill="currentColor" />
        </svg>
    );
}

function ShieldIcon() {
    return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 3 5 6v5.5c0 4.2 2.8 7.4 7 8.5 4.2-1.1 7-4.3 7-8.5V6l-7-3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="m8.8 12 2.2 2.2 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

type FieldValue = string | number | null | undefined;

function FieldRow({ label, value }: { label: string; value?: FieldValue }) {
    const displayValue = value === undefined || value === null || value === "" ? "Not specified" : value;

    return (
        <div className="grid gap-1 rounded-xl border border-[#E6ECEB] bg-white px-4 py-3 sm:grid-cols-[160px_1fr] sm:gap-4">
            <dt className="text-[12px] font-bold uppercase text-[#6B7C80] epilogue-header">{label}</dt>
            <dd className="text-[14px] leading-relaxed text-[#22343A] epilogue-regular">{displayValue}</dd>
        </div>
    );
}

function AssuranceItem({
                           icon,
                           title,
                           subtitle,
                       }: {
    icon: ReactNode;
    title: string;
    subtitle: string;
}) {
    return (
        <div className="flex items-start gap-3 rounded-2xl border border-[#E6ECEB] bg-white px-4 py-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EFF7F6] text-[#427b77]">
                {icon}
            </div>
            <div>
                <p className="text-[13px] font-bold text-[#22343A] epilogue-header">{title}</p>
                <p className="mt-0.5 text-[12px] leading-relaxed text-[#7A878A] epilogue-regular">{subtitle}</p>
            </div>
        </div>
    );
}

export default function ProductDetailPage() {
    const { selectedProductId, navigateTo, addToCart, showModal } = useApp();
    const [qty, setQty] = useState(1);
    const [activeTab, setActiveTab] = useState<Tab>("details");

    const product = PRODUCTS.find((p) => p.id === selectedProductId) ?? PRODUCTS[0];
    const reviewCount = product.reviews.length;
    const isOutOfStock = product.stockStatus === "out_of_stock";

    const tabs: { key: Tab; label: string }[] = [
        { key: "details", label: "Details" },
        { key: "dosage", label: "Dosage" },
        { key: "warnings", label: "Warnings" },
        { key: "reviews", label: `Reviews (${reviewCount})` },
    ];

    const detailRows: Array<[string, FieldValue]> = [
        ["Brand Name", product.brandName],
        ["Generic Name", product.genericName],
        ["Manufacturer", product.manufacturer],
        ["Dosage Form", product.dosageForm],
        ["Strength", product.strength],
        ["Pack Size", product.packSize],
        ["Storage", product.storage],
        ["Expiry", product.expiry],
    ];

    const dosageRows: Array<[string, FieldValue]> = [
        ["Adults", product.dosageAdults],
        ["Children", product.dosageChildren],
        ["Max Daily Dose", product.maxDailyDose],
        ["How to Take", product.howToTake],
        ["Indication", product.indication],
    ];

    const handleAddToCart = () => {
        addToCart(product, qty);
        showModal({
            type: "added",
            icon: "✅",
            title: "Added to Cart!",
            message: `${qty}× ${product.brandName} ${product.strength} added to your cart.`,
            actionLabel: "View Cart",
            onAction: () => navigateTo("cart"),
        });
    };

    return (
        <main className="min-h-screen bg-[#F7FAF9]">
            <div className="mx-auto max-w-[1180px] px-5 py-6 sm:px-8 lg:px-10 lg:py-10">
                <button
                    type="button"
                    onClick={() => navigateTo("catalog")}
                    className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#DCE6E4] bg-white px-4 py-2 text-[13px] font-bold text-[#427b77] shadow-sm transition hover:border-[#BFD4D1] hover:bg-[#F0F7F6] epilogue-header"
                >
                    <BackIcon />
                    Back to Catalog
                </button>

                <section className="grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:items-start">
                    <div className="space-y-5">
                        <div className="overflow-hidden rounded-[28px] border border-[#E4ECEA] bg-white shadow-sm">
                            <div className="relative flex min-h-[360px] items-center justify-center bg-[#EEF6F4] p-10 sm:min-h-[460px]">
                                <div className="absolute left-5 top-5 rounded-full bg-[#1D546D] px-3 py-1 text-[11px] font-extrabold uppercase text-white epilogue-header">
                                    {product.packSize}
                                </div>
                                <div className="absolute right-5 top-5 rounded-full border border-white/70 bg-white/85 px-3 py-1 text-[11px] font-bold text-[#427b77] shadow-sm backdrop-blur epilogue-header">
                                    Authentic
                                </div>
                                <div className="text-[132px] leading-none drop-shadow-sm sm:text-[168px]" aria-hidden="true">
                                    {product.image}
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3 border-t border-[#E4ECEA] bg-white p-4">
                                {[
                                    { icon: product.image, label: "Product" },
                                    { icon: "📋", label: product.dosageForm },
                                    { icon: "🏷️", label: product.packSize },
                                ].map((item, index) => (
                                    <button
                                        key={item.label}
                                        type="button"
                                        className={`flex min-h-[74px] flex-col items-center justify-center rounded-2xl border px-3 py-2 text-center transition ${
                                            index === 0
                                                ? "border-[#427b77] bg-[#F0F7F6]"
                                                : "border-[#E6ECEB] bg-white hover:border-[#BFD4D1] hover:bg-[#F8FBFA]"
                                        }`}
                                    >
                                        <span className="text-2xl leading-none" aria-hidden="true">{item.icon}</span>
                                        <span className="mt-2 max-w-full truncate text-[11px] font-bold text-[#6B7C80] epilogue-header">{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3">
                            <AssuranceItem icon={<DeliveryIcon />} title="Same-day delivery" subtitle="Available in Cebu City" />
                            <AssuranceItem icon={<ShieldIcon />} title="Verified source" subtitle="FDA-registered pharmacy" />
                            <AssuranceItem icon={<CheckIcon />} title="Easy returns" subtitle="Support for order issues" />
                        </div>
                    </div>

                    <aside className="rounded-[28px] border border-[#E4ECEA] bg-white p-6 shadow-sm lg:sticky lg:top-8 lg:p-7">
                        <div className="mb-5 flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-[#EFF7F6] px-3 py-1 text-[11px] font-extrabold uppercase text-[#427b77] epilogue-header">
                                {product.manufacturer}
                            </span>
                            <span className="rounded-full bg-[#F7F2E8] px-3 py-1 text-[11px] font-bold text-[#9A6619] epilogue-header">
                                {product.dosageForm}
                            </span>
                        </div>

                        <h1 className="text-[30px] font-extrabold leading-tight text-[#182C32] epilogue-header sm:text-[36px]">
                            {product.brandName} {product.strength}
                        </h1>
                        <p className="mt-3 text-[15px] leading-relaxed text-[#6B7C80] epilogue-regular">
                            Generic: <span className="font-semibold text-[#33464C]">{product.genericName}</span>
                        </p>

                        <div className="mt-5 flex flex-wrap items-center gap-3">
                            <Stars rating={product.rating} />
                            <span className="text-[13px] font-semibold text-[#33464C] epilogue-header">
                                {product.rating} rating
                            </span>
                            <span className="text-[13px] text-[#8B989B] epilogue-regular">
                                {reviewCount} reviews
                            </span>
                        </div>

                        <div className="my-7 h-px bg-[#E6ECEB]" />

                        <div className="flex flex-wrap items-end justify-between gap-4">
                            <div>
                                <p className="text-[12px] font-bold uppercase text-[#8B989B] epilogue-header">Price</p>
                                <div className="mt-1 flex items-baseline gap-3">
                                    <span className="text-[38px] font-extrabold leading-none text-[#1D546D] epilogue-header">
                                        {formatPeso(product.price)}
                                    </span>
                                    {product.originalPrice && (
                                        <span className="text-[15px] font-semibold text-[#9CA3AF] line-through epilogue-regular">
                                            {formatPeso(product.originalPrice)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="text-right">
                                <StockBadge status={product.stockStatus} />
                                {!isOutOfStock && (
                                    <p className="mt-1 text-[12px] text-[#7A878A] epilogue-regular">
                                        {product.stockCount}+ available
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="mt-7 rounded-2xl border border-[#E6ECEB] bg-[#F8FBFA] p-4">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-[13px] font-bold text-[#22343A] epilogue-header">Quantity</p>
                                    <p className="mt-1 text-[12px] text-[#7A878A] epilogue-regular">Select the amount to add</p>
                                </div>
                                <QtySelector value={qty} onChange={setQty} />
                            </div>
                        </div>

                        <Btn
                            variant="primary"
                            size="lg"
                            fullWidth
                            disabled={isOutOfStock}
                            onClick={handleAddToCart}
                            style={{
                                marginTop: 18,
                                minHeight: 54,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 8,
                            }}
                        >
                            <CartIcon />
                            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                        </Btn>

                        <div className="mt-5 rounded-2xl bg-[#FFF7E6] px-4 py-3 text-[12px] leading-relaxed text-[#8A5A12] epilogue-regular">
                            Please follow the dosage and warning information provided. For prescription medicines, prepare a valid prescription during order confirmation.
                        </div>
                    </aside>
                </section>

                <section className="mt-10 rounded-[28px] border border-[#E4ECEA] bg-white shadow-sm">
                    <div className="overflow-x-auto border-b border-[#E4ECEA] px-4 sm:px-6">
                        <div className="flex min-w-max gap-2" role="tablist" aria-label="Product information">
                            {tabs.map((tab) => {
                                const isActive = activeTab === tab.key;
                                return (
                                    <button
                                        key={tab.key}
                                        type="button"
                                        role="tab"
                                        aria-selected={isActive}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`relative px-4 py-5 text-[14px] font-bold transition epilogue-header ${
                                            isActive ? "text-[#1D546D]" : "text-[#7A878A] hover:text-[#33464C]"
                                        }`}
                                    >
                                        {tab.label}
                                        <span
                                            className={`absolute bottom-0 left-4 right-4 h-[3px] rounded-t-full transition ${
                                                isActive ? "bg-[#1D546D]" : "bg-transparent"
                                            }`}
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="p-5 sm:p-7">
                        {activeTab === "details" && (
                            <div>
                                <div className="mb-5">
                                    <h2 className="text-xl font-extrabold text-[#182C32] epilogue-header">Product Details</h2>
                                    <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-[#6B7C80] epilogue-regular">
                                        Key information for checking the medicine, pack size, storage, and expiration before checkout.
                                    </p>
                                </div>
                                <dl className="grid gap-3">
                                    {detailRows.map(([label, value]) => (
                                        <FieldRow key={label} label={label} value={value} />
                                    ))}
                                </dl>
                            </div>
                        )}

                        {activeTab === "dosage" && (
                            <div>
                                <div className="mb-5">
                                    <h2 className="text-xl font-extrabold text-[#182C32] epilogue-header">Dosage & Usage</h2>
                                    <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-[#6B7C80] epilogue-regular">
                                        Recommended usage details for adults, children, and daily limits.
                                    </p>
                                </div>
                                <dl className="grid gap-3">
                                    {dosageRows.map(([label, value]) => (
                                        <FieldRow key={label} label={label} value={value} />
                                    ))}
                                </dl>
                            </div>
                        )}

                        {activeTab === "warnings" && (
                            <div>
                                <div className="mb-5">
                                    <h2 className="text-xl font-extrabold text-[#182C32] epilogue-header">Warnings</h2>
                                    <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-[#6B7C80] epilogue-regular">
                                        Important precautions before taking this medicine.
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-[#F4C971] bg-[#FFF7E6] p-5">
                                    <div className="flex gap-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FDE7B5] text-xl" aria-hidden="true">
                                            ⚠️
                                        </div>
                                        <div>
                                            <p className="text-[15px] font-extrabold text-[#8A5A12] epilogue-header">Use with care</p>
                                            <p className="mt-2 text-[14px] leading-relaxed text-[#7A5519] epilogue-regular">
                                                {product.warnings}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "reviews" && (
                            <div>
                                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                                    <div>
                                        <h2 className="text-xl font-extrabold text-[#182C32] epilogue-header">Customer Reviews</h2>
                                        <p className="mt-2 text-[14px] leading-relaxed text-[#6B7C80] epilogue-regular">
                                            Feedback from customers who ordered this product.
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 rounded-2xl bg-[#F8FBFA] px-4 py-3">
                                        <Stars rating={product.rating} />
                                        <span className="text-[13px] font-bold text-[#33464C] epilogue-header">{product.rating}</span>
                                    </div>
                                </div>

                                {reviewCount === 0 ? (
                                    <div className="rounded-2xl border border-dashed border-[#D7E3E1] bg-[#F8FBFA] px-5 py-8 text-center">
                                        <p className="text-[15px] font-bold text-[#33464C] epilogue-header">No reviews yet</p>
                                        <p className="mt-2 text-[13px] text-[#7A878A] epilogue-regular">Be the first to review this medicine.</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-4">
                                        {product.reviews.map((review) => (
                                            <article key={review.id} className="rounded-2xl border border-[#E6ECEB] bg-white p-5">
                                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#427b77] text-[15px] font-extrabold text-white epilogue-header">
                                                            {review.reviewer[0]}
                                                        </div>
                                                        <div>
                                                            <p className="text-[14px] font-extrabold text-[#22343A] epilogue-header">{review.reviewer}</p>
                                                            <div className="mt-1">
                                                                <Stars rating={review.rating} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <time className="text-[12px] font-semibold text-[#8B989B] epilogue-regular">{review.date}</time>
                                                </div>
                                                <p className="mt-4 text-[14px] leading-relaxed text-[#5C6D72] epilogue-regular">{review.comment}</p>
                                            </article>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}
