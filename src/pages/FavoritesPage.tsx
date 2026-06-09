import { useState } from "react";
import { useApp } from "../hooks/useApp";
import { PRODUCTS, CATEGORY_META } from "../data/mockData";
import { SectionHeader } from "../components/UI";
import Footer from "../components/Footer";
import type { Product } from "../types";
import { Heart, Trash2, ShoppingBag, Search } from "lucide-react";

// ── Reused from HomePage ─────────────────────────────────────────────────────
function VendorMedicineCard({
                                product,
                                onView,
                                onAdd,
                                onUnfavorite,
                            }: {
    product: Product;
    onView: () => void;
    onAdd: () => void;
    onUnfavorite: () => void;
}) {
    const [imageFailed, setImageFailed] = useState(false);
    const isOutOfStock = product.stockStatus === "out_of_stock";
    const hasImagePath =
        product.image.startsWith("http") ||
        product.image.startsWith("/") ||
        product.image.startsWith("data:");

    return (
        <div className="group cursor-pointer" onClick={onView}>
            {/* Image block */}
            <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl bg-white mb-3">
                {hasImagePath && !imageFailed ? (
                    <img
                        src={product.image}
                        alt={product.brandName}
                        className="h-full w-full scale-[1.22] select-none object-contain transition-transform duration-300 group-hover:scale-[1.28]"
                        onError={() => setImageFailed(true)}
                    />
                ) : (
                    <div className="flex h-full w-full select-none items-center justify-center px-4 text-center text-sm font-bold text-[#262626]/70 transition-transform duration-300 group-hover:scale-105 epilogue-header">
                        {imageFailed ? product.brandName : product.image}
                    </div>
                )}

                {product.originalPrice && (
                    <div className="absolute top-2.5 left-2.5 bg-[#427b77] text-white text-[10px] font-bold px-2 py-0.5 rounded-lg epilogue-header tracking-wide">
                        Sale
                    </div>
                )}

                {/* Unfavorite button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onUnfavorite();
                    }}
                    aria-label="Remove from favourites"
                    className="absolute bottom-2.5 right-[46px] w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center transition-transform duration-150 active:scale-90 hover:scale-110"
                >
                    <svg width="15" height="15" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            fill="#e11d48"
                            d="M12.6217 2.82875C14.6366 3.8152 15.5488 6.39602 14.6592 8.59316C13.5308 11.0256 11.4249 12.9696 8.3415 14.4254C8.15614 14.5107 7.94533 14.5229 7.75273 14.4618L7.65776 14.425C4.57478 12.9693 2.46912 11.0254 1.34078 8.59316C0.451161 6.39602 1.36338 3.8152 3.37828 2.82875C4.83682 2.11468 6.33306 2.64718 7.49473 3.62706C7.55809 3.68051 7.63615 3.75107 7.72889 3.83874L7.72892 3.83871C7.88199 3.98341 8.11731 3.98336 8.27032 3.8386C8.34183 3.77095 8.40276 3.71543 8.45314 3.67203C9.62526 2.66225 11.1429 2.10474 12.6217 2.82875ZM11.8696 4.45404C11.1697 4.11137 10.2881 4.36724 9.41854 5.19403L9.24485 5.36699L8.28326 6.36823C8.12801 6.52989 7.87475 6.53148 7.71758 6.37179C7.71631 6.3705 7.71504 6.36919 7.71378 6.36787L6.75338 5.36542C5.83294 4.40468 4.87775 4.08814 4.13039 4.45404C2.96994 5.02217 2.42026 6.5773 2.92018 7.81797C3.76446 9.63786 5.30414 11.1633 7.59598 12.391L7.82073 12.5071C7.93328 12.5652 8.06585 12.5655 8.17856 12.5077C8.30589 12.4425 8.40456 12.391 8.47457 12.353C10.6006 11.2014 12.0681 9.79624 12.9017 8.18989L13.0437 7.90114C13.5554 6.63747 13.0778 5.16307 12.024 4.53751L11.8696 4.45404Z"
                        />
                    </svg>
                </button>

                {/* Add to cart button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onAdd();
                    }}
                    disabled={isOutOfStock}
                    aria-label={`Add ${product.brandName} to cart`}
                    className={`absolute bottom-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full text-xl leading-none shadow-sm transition-transform duration-150 active:scale-90 ${
                        isOutOfStock
                            ? "cursor-not-allowed bg-white/80 text-[#262626]/40"
                            : "bg-white/90 text-[#262626] backdrop-blur-sm hover:scale-110"
                    }`}
                >
                    +
                </button>
            </div>

            {/* Text info */}
            <div className="px-0.5">
                <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-[15px] font-bold text-[#262626] epilogue-header leading-snug flex-1 min-w-0 truncate">
                        {product.brandName}
                    </p>
                    <span className="text-[15px] font-extrabold text-[#262626] epilogue-header shrink-0">
                        ₱{product.price?.toLocaleString()}
                    </span>
                </div>

                <p className="text-[13px] text-[#262626]/60 epilogue-regular mb-1.5 truncate">
                    {CATEGORY_META[product.category].label} · {product.strength}
                </p>

                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                        <svg width="11" height="11" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                fill="#f59e0b"
                                d="M7.88486 12.1954L4.88943 13.7787C4.64763 13.9065 4.34857 13.813 4.22145 13.5699C4.17083 13.4731 4.15336 13.3622 4.17175 13.2544L4.74383 9.90101C4.75759 9.82035 4.73099 9.73805 4.6727 9.68092L2.24935 7.30602C2.05373 7.11431 2.04973 6.79947 2.24041 6.6028C2.31634 6.52448 2.41583 6.47352 2.52348 6.45779L5.87247 5.96853C5.95302 5.95676 6.02265 5.9059 6.05868 5.83251L7.55639 2.78147C7.67729 2.53518 7.97388 2.43406 8.21885 2.55561C8.3164 2.60402 8.39535 2.6834 8.4435 2.78147L9.94121 5.83251C9.97723 5.9059 10.0469 5.95676 10.1274 5.96853L13.4764 6.45779C13.7467 6.49728 13.9341 6.74963 13.8948 7.02142C13.8791 7.12965 13.8284 7.22968 13.7505 7.30602L11.3272 9.68092C11.2689 9.73805 11.2423 9.82035 11.2561 9.90101L11.8281 13.2544C11.8743 13.5251 11.6935 13.7822 11.4242 13.8286C11.317 13.8471 11.2067 13.8296 11.1105 13.7787L8.11503 12.1954C8.04298 12.1573 7.95691 12.1573 7.88486 12.1954Z"
                            />
                        </svg>
                        <span className="text-[13px] font-semibold text-[#262626] epilogue-header">
                            {product.rating ?? "4.8"}
                        </span>
                        <span className="text-[13px] text-[#262626]/60 epilogue-regular">
                            ({product.reviewCount}+)
                        </span>
                    </div>

                    <span className="text-[12px] text-[#262626]/40">•</span>

                    <span className="text-[13px] text-[#262626]/60 epilogue-regular">
                        {product.dosageForm}
                    </span>

                    <span className="text-[12px] text-[#262626]/40">•</span>

                    <span className="text-[13px] font-semibold text-[#427b77] epilogue-regular">
                        {product.packSize}
                    </span>
                </div>
            </div>
        </div>
    );
}

// ── Empty State ───────────────────────────────────────────────────────────────
function EmptyFavorites({ onBrowse }: { onBrowse: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-20 h-20 rounded-full bg-[#F4F7F8] flex items-center justify-center mb-5">
                <Heart size={32} strokeWidth={1.5} className="text-[#262626]/25" />
            </div>
            <h3 className="text-[17px] font-bold text-[#262626] epilogue-header mb-1.5">
                No saved medicines yet
            </h3>
            <p className="text-[13px] text-[#262626]/55 epilogue-regular max-w-[240px] leading-relaxed mb-6">
                Tap the heart on any medicine to save it here for quick reordering.
            </p>
            <button
                onClick={onBrowse}
                className="rounded-xl bg-[#2d2d2d] hover:bg-[#427b77] text-white px-6 py-2.5 text-sm font-semibold epilogue-header transition-colors duration-200"
            >
                Browse Medicines
            </button>
        </div>
    );
}

// ── FavoritesPage ─────────────────────────────────────────────────────────────
export default function FavoritesPage() {
    const { navigateTo, addToCart, showModal, favoriteIds, removeFavorite, clearFavorites } = useApp();

    const [searchQuery, setSearchQuery] = useState("");

    const favoriteProducts = PRODUCTS.filter((p) => favoriteIds.includes(p.id));

    const filteredFavorites = favoriteProducts.filter((p) =>
        searchQuery.trim() === ""
            ? true
            : p.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            CATEGORY_META[p.category].label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleUnfavorite = (productId: string) => {
        removeFavorite(productId);
    };

    const handleClearAll = () => {
        clearFavorites();
        setSearchQuery("");
    };

    const handleAddToCart = (productId: string) => {
        const product = PRODUCTS.find((p) => p.id === productId);
        if (!product) return;
        addToCart(product);
        showModal({
            type: "added",
            icon: "✅",
            title: "Added to Cart!",
            message: `${product.brandName} ${product.strength} has been added to your cart.`,
            actionLabel: "View Cart",
            onAction: () => navigateTo("cart"),
        });
    };

    const handleAddAllToCart = () => {
        filteredFavorites.forEach((p) => {
            if (p.stockStatus !== "out_of_stock") addToCart(p);
        });
        showModal({
            type: "added",
            icon: "✅",
            title: "All added to Cart!",
            message: `${filteredFavorites.filter((p) => p.stockStatus !== "out_of_stock").length} item(s) added to your cart.`,
            actionLabel: "View Cart",
            onAction: () => navigateTo("cart"),
        });
    };

    return (
        <>
            <div className="px-5 sm:px-8 lg:px-16 py-10">

                {/* ── Page header ── */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#F4F7F8] border border-[#EAEFEE] flex items-center justify-center">
                            <Heart size={18} strokeWidth={1.8} className="text-[#427b77]" />
                        </div>
                        <div>
                            <h1 className="text-[22px] font-extrabold text-[#262626] epilogue-header leading-tight">
                                Favourites
                            </h1>
                            <p className="text-[13px] text-[#262626]/50 epilogue-regular">
                                {favoriteProducts.length} saved medicine{favoriteProducts.length !== 1 ? "s" : ""}
                            </p>
                        </div>
                    </div>

                    {favoriteProducts.length > 0 && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleAddAllToCart}
                                className="flex items-center gap-1.5 rounded-xl bg-[#2d2d2d] hover:bg-[#427b77] text-white px-4 py-2 text-xs font-semibold epilogue-header transition-colors duration-200"
                            >
                                <ShoppingBag size={13} strokeWidth={2} />
                                Add All to Cart
                            </button>
                            <button
                                onClick={handleClearAll}
                                className="flex items-center gap-1.5 rounded-xl border border-[#EAEFEE] bg-white hover:bg-red-50 hover:border-red-200 text-[#262626]/50 hover:text-red-400 px-4 py-2 text-xs font-semibold epilogue-regular transition-colors duration-200"
                            >
                                <Trash2 size={13} strokeWidth={1.8} />
                                Clear All
                            </button>
                        </div>
                    )}
                </div>

                {/* ── Card wrapper ── */}
                <div className="rounded-3xl border border-[#EAEFEE] bg-[#FAFBFB] overflow-hidden">

                    {favoriteProducts.length === 0 ? (
                        <EmptyFavorites onBrowse={() => navigateTo("catalog")} />
                    ) : (
                        <div className="p-6 sm:p-8">

                            {/* ── Search bar ── */}
                            <div className="relative mb-7">
                                <Search
                                    size={15}
                                    strokeWidth={2}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#262626]/35 pointer-events-none"
                                />
                                <input
                                    type="text"
                                    placeholder="Search your favourites…"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full sm:w-72 pl-9 pr-4 py-2 rounded-xl border border-[#EAEFEE] bg-white text-sm text-[#262626] epilogue-regular placeholder:text-[#262626]/35 focus:outline-none focus:border-[#427b77] transition-colors duration-200"
                                />
                            </div>

                            {/* ── Filtered empty ── */}
                            {filteredFavorites.length === 0 ? (
                                <div className="py-14 text-center">
                                    <p className="text-[15px] font-bold text-[#262626] epilogue-header mb-1">
                                        No matches for "{searchQuery}"
                                    </p>
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="mt-3 text-xs text-[#427b77] epilogue-regular hover:underline"
                                    >
                                        Clear search
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <SectionHeader title={`Saved Medicines · ${filteredFavorites.length}`} />

                                    <div className="mt-5 grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                                        {filteredFavorites.map((p) => (
                                            <VendorMedicineCard
                                                key={p.id}
                                                product={p}
                                                onView={() => navigateTo("product", p.id)}
                                                onAdd={() => handleAddToCart(p.id)}
                                                onUnfavorite={() => handleUnfavorite(p.id)}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </>
    );
}
