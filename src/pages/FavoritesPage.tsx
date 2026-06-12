import { useState } from "react";
import { useApp } from "../hooks/useApp";
import { PRODUCTS, CATEGORY_META } from "../data/mockData";
import Footer from "../components/Footer";
import DiscountTag from "../components/DiscountTag";
import type { Product } from "../types";
import { Heart, Trash2, ShoppingBag, Search, Star } from "lucide-react";

// ── Reused from HomePage ─────────────────────────────────────────────────────
function VendorMedicineCard({
                                product,
                                onView,
                                onUnfavorite,
                            }: {
    product: Product;
    onView: () => void;
    onUnfavorite: () => void;
}) {
    const [imageFailed, setImageFailed] = useState(false);
    const hasImagePath =
        product.image.startsWith("http") ||
        product.image.startsWith("/") ||
        product.image.startsWith("data:");

    return (
        <div className="group cursor-pointer" onClick={onView}>
            {/* Image block */}
            <div className="relative w-full aspect-[4/3] overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-white mb-3">
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
                    className="absolute bottom-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full border border-[#E5E7EB] bg-white/90 backdrop-blur-sm transition-transform duration-150 hover:scale-110 active:scale-90"
                >
                    <Heart size={15} strokeWidth={2} fill="#e11d48" className="text-[#e11d48]" />
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
                        <Star size={11} fill="#f59e0b" strokeWidth={0} />
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

                <DiscountTag />
            </div>
        </div>
    );
}

// ── Empty State ───────────────────────────────────────────────────────────────
function EmptyFavorites({ onBrowse }: { onBrowse: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-20 h-20 rounded-[14px] bg-[#F4F7F8] flex items-center justify-center mb-5">
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
                className="rounded-[14px] bg-[#1D546D] hover:bg-[#427b77] text-white px-6 py-2.5 text-sm font-semibold epilogue-header transition-colors duration-200"
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

    const handleAddAllToCart = () => {
        let addedCount = 0;
        for (const p of filteredFavorites) {
            if (p.stockStatus === "out_of_stock") continue;
            const added = addToCart(p);
            if (!added) return;
            addedCount += 1;
        }

        showModal({
            type: "added",
            icon: "✅",
            title: "All added to Cart!",
            message: `${addedCount} item(s) added to your cart.`,
            actionLabel: "View Cart",
            onAction: () => navigateTo("cart"),
        });
    };

    return (
        <>
            <div className="px-5 sm:px-8 lg:px-16">
                <main className="min-w-0">
                    <div className="mb-6 mt-10 flex flex-wrap items-center justify-between gap-4 sm:mt-14">
                        <div className="min-w-0">
                            <p className="mb-1 text-xs font-medium text-[#262626]/60 epilogue-regular">
                                {favoriteProducts.length} saved medicine{favoriteProducts.length !== 1 ? "s" : ""}
                            </p>
                            <h2 className="text-[28px] font-medium tracking-[-0.01em] text-[#262626] epilogue-regular">
                                Favorites
                            </h2>
                        </div>

                        {favoriteProducts.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    onClick={handleAddAllToCart}
                                    className="flex items-center gap-1.5 rounded-xl bg-[#2d2d2d] px-4 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-[#427b77] epilogue-header"
                                >
                                    <ShoppingBag size={13} strokeWidth={2} />
                                    Add All to Cart
                                </button>
                                <button
                                    onClick={handleClearAll}
                                    className="flex items-center gap-1.5 rounded-xl border border-[#EAEFEE] bg-white px-4 py-2 text-xs font-semibold text-[#262626]/50 transition-colors duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-400 epilogue-regular"
                                >
                                    <Trash2 size={13} strokeWidth={1.8} />
                                    Clear All
                                </button>
                            </div>
                        )}
                    </div>

                    {favoriteProducts.length === 0 ? (
                        <EmptyFavorites onBrowse={() => navigateTo("catalog")} />
                    ) : (
                        <>
                            <div className="relative mb-7">
                                <Search
                                    size={15}
                                    strokeWidth={2}
                                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#262626]/35"
                                />
                                <input
                                    type="text"
                                    placeholder="Search your favorites..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full rounded-xl border border-[#EAEFEE] bg-white py-2 pl-9 pr-4 text-sm text-[#262626] transition-colors duration-200 placeholder:text-[#262626]/35 focus:border-[#427b77] focus:outline-none sm:w-72 epilogue-regular"
                                />
                            </div>

                            {filteredFavorites.length === 0 ? (
                                <div className="mb-16 px-6 py-20 text-center">
                                    <p className="mb-1 text-[15px] font-bold text-[#262626] epilogue-header">
                                        No matches for "{searchQuery}"
                                    </p>
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="mt-3 text-xs text-[#427b77] hover:underline epilogue-regular"
                                    >
                                        Clear search
                                    </button>
                                </div>
                            ) : (
                                <div className="mb-16 grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                                    {filteredFavorites.map((p) => (
                                        <VendorMedicineCard
                                            key={p.id}
                                            product={p}
                                            onView={() => navigateTo("product", p.id)}
                                            onUnfavorite={() => handleUnfavorite(p.id)}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>

            <Footer />
        </>
    );
}
