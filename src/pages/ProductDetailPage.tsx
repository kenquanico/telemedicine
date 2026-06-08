import { type ReactNode, useState } from "react";
import { useApp } from "../hooks/useApp";
import { PRODUCTS, CATEGORY_META } from "../data/mockData";
import { StockBadge, QtySelector, Stars, Btn } from "../components/UI";

type Tab = "details" | "dosage" | "warnings" | "reviews";

const formatPeso = (value?: number) => {
    if (typeof value !== "number") return "";
    return `₱${value.toLocaleString()}`;
};

function BackIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M19 12H5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M12 5 5 12l7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function CartIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6.5 6h15l-1.7 8.4a2 2 0 0 1-2 1.6H9.3a2 2 0 0 1-2-1.6L5 3H2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM18 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" fill="currentColor" />
        </svg>
    );
}

function CheckIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function DeliveryIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 7h10v10H4V7Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M14 10h3.5L21 14v3h-7v-7Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M7.5 20a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM17.5 20a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" fill="currentColor" />
        </svg>
    );
}

function ShieldIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 3 5 6v5.5c0 4.2 2.8 7.4 7 8.5 4.2-1.1 7-4.3 7-8.5V6l-7-3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            <path d="m8.8 12 2.2 2.2 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

type FieldValue = string | number | null | undefined;

function FieldRow({ label, value }: { label: string; value?: FieldValue }) {
    const displayValue = value === undefined || value === null || value === "" ? "Not specified" : value;

    return (
        <div className="grid gap-1 rounded-xl border border-[#E6ECEB] bg-white px-4 py-3 sm:grid-cols-[160px_1fr] sm:gap-4">
            <dt className="text-[12px] font-bold uppercase text-[#262626]/70 epilogue-header">{label}</dt>
            <dd className="text-[14px] leading-relaxed text-[#262626] epilogue-regular">{displayValue}</dd>
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
                <p className="text-[13px] font-bold text-[#262626] epilogue-header">{title}</p>
                <p className="mt-0.5 text-[12px] leading-relaxed text-[#262626]/60 epilogue-regular">{subtitle}</p>
            </div>
        </div>
    );
}

function ProductVisual({ image, name, className = "" }: { image: string; name: string; className?: string }) {
    const [imageFailed, setImageFailed] = useState(false);
    const hasImagePath = image.startsWith("http") || image.startsWith("/");

    if (hasImagePath && !imageFailed) {
        return <img src={image} alt={name} className={`scale-[1.16] select-none object-contain ${className}`} onError={() => setImageFailed(true)} />;
    }

    return (
        <span className={`flex items-center justify-center px-6 text-center text-xl font-bold text-[#262626]/70 epilogue-header ${className}`} aria-hidden="true">
            {imageFailed ? name : image}
        </span>
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
        <main className="min-h-screen bg-white">
            <div className="px-5 py-8 sm:px-8 lg:px-16 lg:py-10">
                <button
                    type="button"
                    onClick={() => navigateTo("catalog")}
                    className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#DCE6E4] bg-white px-4 py-2 text-[13px] font-bold text-[#262626] shadow-sm transition hover:border-[#BFD4D1] hover:bg-[#F0F7F6] epilogue-header"
                >
                    <BackIcon />
                    Back to Catalog
                </button>

                <section className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
                    <div className="space-y-5">
                        <div className="overflow-hidden rounded-[20px] border border-[#E4ECEA] bg-white shadow-sm">
                            <div className="relative flex min-h-[360px] items-center justify-center bg-white p-6 sm:min-h-[460px] sm:p-8">
                                <div className="absolute left-5 top-5 rounded-full bg-[#1D546D] px-3 py-1 text-[11px] font-extrabold uppercase text-white epilogue-header">
                                    {product.packSize}
                                </div>
                                <div className="absolute right-5 top-5 rounded-full border border-white/70 bg-white/85 px-3 py-1 text-[11px] font-bold text-[#427b77] shadow-sm backdrop-blur epilogue-header">
                                    Authentic
                                </div>
                                <ProductVisual
                                    image={product.image}
                                    name={product.brandName}
                                    className="max-h-[320px] w-full max-w-[460px] sm:max-h-[390px]"
                                />
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
                                                ? "border-[#427b77] bg-white"
                                                : "border-[#E6ECEB] bg-white hover:border-[#BFD4D1] hover:bg-[#F8FBFA]"
                                        }`}
                                    >
                                        {String(item.icon).startsWith("http") || String(item.icon).startsWith("/") ? (
                                            <img src={item.icon} alt="" className="h-8 w-8 scale-[1.2] object-contain" />
                                        ) : (
                                            <span className="text-2xl leading-none" aria-hidden="true">{item.icon}</span>
                                        )}
                                        <span className="mt-2 max-w-full truncate text-[11px] font-bold text-[#262626]/70 epilogue-header">{item.label}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="border-t border-[#E4ECEA] bg-white p-5 sm:p-6">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="min-w-0">
                                        <div className="mb-2 flex flex-wrap items-center gap-2">
                                            <span className="rounded-full border border-[#DCE6E4] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#427b77] epilogue-header">
                                                {CATEGORY_META[product.category].label}
                                            </span>
                                            <StockBadge status={product.stockStatus} />
                                        </div>
                                        <h1 className="text-[26px] font-extrabold leading-tight text-[#262626] epilogue-header sm:text-[30px]">
                                            {product.brandName} {product.strength}
                                        </h1>
                                        <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-[#262626]/70 epilogue-regular">
                                            {product.genericName} by {product.manufacturer}. {product.description}
                                        </p>
                                    </div>
                                    <div className="shrink-0 rounded-2xl border border-[#EAEFEE] px-4 py-3 sm:text-right">
                                        <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#262626]/60 epilogue-header">
                                            Rating
                                        </p>
                                        <div className="mt-2 flex items-center gap-2 sm:justify-end">
                                            <Stars rating={product.rating} />
                                            <span className="text-[13px] font-bold text-[#262626] epilogue-header">
                                                {product.rating} ({product.reviewCount}+)
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3">
                            <AssuranceItem icon={<DeliveryIcon />} title="Same-day delivery" subtitle="Available in Cebu City" />
                            <AssuranceItem icon={<ShieldIcon />} title="Verified source" subtitle="FDA-registered pharmacy" />
                            <AssuranceItem icon={<CheckIcon />} title="Easy returns" subtitle="Support for order issues" />
                        </div>
                    </div>

                    <aside className="overflow-hidden rounded-[20px] border border-[#EAEFEE] bg-white shadow-[0_2px_16px_rgba(45,45,45,0.05)] lg:sticky lg:top-[120px]">
                        <div className="border-b border-[#F4F6F5] px-5 py-4">
                            <p className="text-sm font-bold text-[#262626] epilogue-header">Add to cart</p>
                            <p className="mt-0.5 text-[11px] text-[#262626]/60 epilogue-regular">Same-day Cebu delivery</p>
                        </div>

                        <div className="grid gap-5 px-5 py-5">
                            <div>
                                <div className="mb-3 flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <h1 className="truncate text-[18px] font-extrabold leading-tight text-[#262626] epilogue-header">
                                            {product.brandName}
                                        </h1>
                                        <p className="mt-1 text-[12px] leading-relaxed text-[#262626]/60 epilogue-regular">
                                            {product.strength} · {product.dosageForm}
                                        </p>
                                    </div>
                                    <StockBadge status={product.stockStatus} />
                                </div>

                                <p className="line-clamp-2 text-[12px] leading-relaxed text-[#262626]/70 epilogue-regular">
                                    {product.genericName}
                                </p>
                            </div>

                            <div className="h-px bg-[#F4F6F5]" />

                            <div>
                                <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#262626]/60 epilogue-header">Price</p>
                                <div className="mt-2 flex items-baseline gap-2">
                                    <span className="text-[28px] font-extrabold leading-none text-[#262626] epilogue-header">
                                        {formatPeso(product.price)}
                                    </span>
                                    {product.originalPrice && (
                                        <span className="text-[13px] font-semibold text-[#262626]/60 line-through epilogue-regular">
                                            {formatPeso(product.originalPrice)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="h-px bg-[#F4F6F5]" />

                            <div className="grid gap-3">
                                <div>
                                    <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#262626]/60 epilogue-header">Quantity</p>
                                    {!isOutOfStock && (
                                        <p className="mt-1 text-[12px] text-[#262626]/60 epilogue-regular">{product.stockCount}+ available</p>
                                    )}
                                </div>
                                <QtySelector value={qty} onChange={setQty} />
                            </div>

                            <Btn
                                variant="primary"
                                size="lg"
                                fullWidth
                                disabled={isOutOfStock}
                                onClick={handleAddToCart}
                                style={{
                                    minHeight: 50,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 8,
                                }}
                            >
                                <CartIcon />
                                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                            </Btn>

                            <div className="rounded-2xl border border-[#F4C971] bg-white px-4 py-3 text-[12px] leading-relaxed text-[#8A5A12] epilogue-regular">
                                Please follow dosage guidance. Prescription medicines may require validation.
                            </div>
                        </div>
                    </aside>
                </section>

                <section className="mt-10 rounded-[20px] border border-[#E4ECEA] bg-white shadow-sm">
                    <div className="bds-c-tabs__container overflow-x-auto border-b border-[#E4ECEA] px-4 sm:px-6" data-testid="tabs__tabs-container">
                        <ul
                            className="bds-c-tabs__list flex min-w-max gap-6"
                            aria-orientation="horizontal"
                            id="tabs__tablist"
                            role="tablist"
                            aria-label="Product information"
                        >
                            {tabs.map((tab) => {
                                const isActive = activeTab === tab.key;
                                return (
                                    <li
                                        key={tab.key}
                                        className={`bds-c-tab relative ${isActive ? "is-selected" : ""}`}
                                        id={`tabs__tab-${tab.key}`}
                                        role="presentation"
                                    >
                                        <button
                                            type="button"
                                            aria-labelledby={`tabs__tab-${tab.key}-label`}
                                            aria-selected={isActive}
                                            role="tab"
                                            tabIndex={isActive ? 0 : -1}
                                            onClick={() => setActiveTab(tab.key)}
                                            className={`relative py-5 text-[14px] font-bold transition epilogue-header ${
                                                isActive ? "text-[#262626]" : "text-[#262626]/60 hover:text-[#262626]"
                                            }`}
                                        >
                                            <span className="bds-c-tab__label" id={`tabs__tab-${tab.key}-label`}>
                                                {tab.label}
                                            </span>
                                            <span
                                                className={`absolute bottom-0 left-0 right-0 h-[3px] rounded-t-full transition ${
                                                    isActive ? "bg-[#2d2d2d]" : "bg-transparent"
                                                }`}
                                            />
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <div className="p-5 sm:p-7">
                        {activeTab === "details" && (
                            <div>
                                <div className="mb-5">
                                    <h2 className="text-xl font-extrabold text-[#262626] epilogue-header">Product Details</h2>
                                    <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-[#262626]/70 epilogue-regular">
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
                                    <h2 className="text-xl font-extrabold text-[#262626] epilogue-header">Dosage & Usage</h2>
                                    <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-[#262626]/70 epilogue-regular">
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
                                    <h2 className="text-xl font-extrabold text-[#262626] epilogue-header">Warnings</h2>
                                    <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-[#262626]/70 epilogue-regular">
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
                                        <h2 className="text-xl font-extrabold text-[#262626] epilogue-header">Customer Reviews</h2>
                                        <p className="mt-2 text-[14px] leading-relaxed text-[#262626]/70 epilogue-regular">
                                            Feedback from customers who ordered this product.
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 rounded-2xl bg-[#F8FBFA] px-4 py-3">
                                        <Stars rating={product.rating} />
                                        <span className="text-[13px] font-bold text-[#262626] epilogue-header">{product.rating}</span>
                                    </div>
                                </div>

                                {reviewCount === 0 ? (
                                    <div className="rounded-2xl border border-dashed border-[#D7E3E1] bg-[#F8FBFA] px-5 py-8 text-center">
                                        <p className="text-[15px] font-bold text-[#262626] epilogue-header">No reviews yet</p>
                                        <p className="mt-2 text-[13px] text-[#262626]/60 epilogue-regular">Be the first to review this medicine.</p>
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
                                                            <p className="text-[14px] font-extrabold text-[#262626] epilogue-header">{review.reviewer}</p>
                                                            <div className="mt-1">
                                                                <Stars rating={review.rating} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <time className="text-[12px] font-semibold text-[#262626]/60 epilogue-regular">{review.date}</time>
                                                </div>
                                                <p className="mt-4 text-[14px] leading-relaxed text-[#262626]/70 epilogue-regular">{review.comment}</p>
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
