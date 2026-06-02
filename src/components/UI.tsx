import React from "react";
import type { StockStatus, OrderStatus } from "../types";
import { STATUS_META } from "../data/mockData";
import { useApp } from "../hooks/useApp";

// ─── Product Image ────────────────────────────────────────────────────────────
function ProductImage({ src, alt, size = 140 }: { src: string; alt: string; size?: number }) {
    const [error, setError] = React.useState(false);
    if (error) {
        return (
            <div
                style={{
                    width: "100%",
                    height: size,
                    background: "linear-gradient(135deg, #f0f7f6 0%, #e8f4f3 100%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                }}
            >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#427b77" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5">
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <path d="M3 9h18M9 21V9" />
                </svg>
                <span style={{ fontSize: 10, color: "#427b77", opacity: 0.5, fontFamily: "'Epilogue', sans-serif" }}>{alt}</span>
            </div>
        );
    }
    return (
        <img
            src={src}
            alt={alt}
            onError={() => setError(true)}
            style={{
                width: "100%",
                height: size,
                objectFit: "contain",
                padding: 12,
            }}
        />
    );
}

// ─── Stock Badge ──────────────────────────────────────────────────────────────
export function StockBadge({ status }: { status: StockStatus }) {
    const map = {
        in_stock:     { bg: "#DCFCE7", color: "#15803D", dot: "#22C55E", label: "In Stock" },
        low_stock:    { bg: "#FEF9C3", color: "#854D0E", dot: "#EAB308", label: "Low Stock" },
        out_of_stock: { bg: "#FEE2E2", color: "#991B1B", dot: "#EF4444", label: "Out of Stock" },
    };
    const s = map[status];
    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                background: s.bg,
                color: s.color,
                fontSize: 10,
                fontWeight: 700,
                borderRadius: 20,
                padding: "3px 9px",
                letterSpacing: "0.02em",
                fontFamily: "'Epilogue', sans-serif",
            }}
        >
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
            {s.label}
        </span>
    );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
export function StatusBadge({ status }: { status: OrderStatus }) {
    const s = STATUS_META[status];
    return (
        <span
            style={{
                background: s.color,
                color: s.text,
                fontSize: 11,
                fontWeight: 700,
                borderRadius: 20,
                padding: "4px 12px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                whiteSpace: "nowrap",
                fontFamily: "'Epilogue', sans-serif",
            }}
        >
            {s.icon} {s.label}
        </span>
    );
}

// ─── Quantity Selector ────────────────────────────────────────────────────────
interface QtySelectorProps {
    value: number;
    onChange: (v: number) => void;
    min?: number;
    max?: number;
    size?: "sm" | "md";
}
export function QtySelector({ value, onChange, min = 1, max = 99, size = "md" }: QtySelectorProps) {
    const btnSize = size === "sm" ? 30 : 38;
    const fontSize = size === "sm" ? 13 : 16;
    return (
        <div style={{ display: "inline-flex", alignItems: "center", gap: size === "sm" ? 6 : 10, background: "#F7F9F9", borderRadius: 10, padding: "3px 4px" }}>
            <button
                onClick={() => onChange(Math.max(min, value - 1))}
                style={{
                    width: btnSize, height: btnSize,
                    border: "1.5px solid #E5ECEB",
                    background: "#fff",
                    borderRadius: 8,
                    fontSize,
                    cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 600,
                    color: "#427b77",
                    lineHeight: 1,
                    transition: "all 0.15s",
                    fontFamily: "'Epilogue', sans-serif",
                }}
            >−</button>
            <span style={{ fontSize, fontWeight: 700, minWidth: 28, textAlign: "center", fontFamily: "'Epilogue', sans-serif", color: "#2d2d2d" }}>{value}</span>
            <button
                onClick={() => onChange(Math.min(max, value + 1))}
                style={{
                    width: btnSize, height: btnSize,
                    border: "1.5px solid #E5ECEB",
                    background: "#fff",
                    borderRadius: 8,
                    fontSize,
                    cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 600,
                    color: "#427b77",
                    lineHeight: 1,
                    transition: "all 0.15s",
                    fontFamily: "'Epilogue', sans-serif",
                }}
            >+</button>
        </div>
    );
}

// ─── Button ───────────────────────────────────────────────────────────────────
interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
    fullWidth?: boolean;
}
export function Btn({ variant = "primary", size = "md", fullWidth, children, style, ...rest }: BtnProps) {
    const variants = {
        primary:   { background: "#2d2d2d", color: "#fff", border: "none" },
        secondary: { background: "#427b77", color: "#fff", border: "none" },
        outline:   { background: "#fff", color: "#427b77", border: "1.5px solid #427b77" },
        ghost:     { background: "transparent", color: "#427b77", border: "none" },
    };
    const sizes = {
        sm: { padding: "8px 18px", fontSize: 12, borderRadius: 10 },
        md: { padding: "11px 22px", fontSize: 13, borderRadius: 12 },
        lg: { padding: "14px 24px", fontSize: 14, borderRadius: 14 },
    };
    return (
        <button
            style={{
                ...variants[variant],
                ...sizes[size],
                cursor: rest.disabled ? "not-allowed" : "pointer",
                fontFamily: "'Epilogue', sans-serif",
                fontWeight: 600,
                width: fullWidth ? "100%" : undefined,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                transition: "background 0.2s, opacity 0.2s",
                letterSpacing: "0.01em",
                opacity: rest.disabled ? 0.5 : 1,
                ...style,
            }}
            {...rest}
        >
            {children}
        </button>
    );
}

// ─── Section Header ───────────────────────────────────────────────────────────
export function SectionHeader({ title, onSeeAll }: { title: string; onSeeAll?: () => void }) {
    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <h2 style={{ fontFamily: "'Epilogue', sans-serif", fontSize: 20, fontWeight: 700, color: "#2d2d2d", letterSpacing: "-0.01em" }}>
                {title}
            </h2>
            {onSeeAll && (
                <button
                    onClick={onSeeAll}
                    style={{
                        color: "#427b77", fontSize: 13, fontWeight: 600,
                        background: "none", border: "none", cursor: "pointer",
                        fontFamily: "'Epilogue', sans-serif",
                        display: "flex", alignItems: "center", gap: 4,
                        padding: "6px 12px", borderRadius: 8,
                        transition: "background 0.15s",
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "rgba(66,123,119,0.08)"}
                    onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "transparent"}
                >
                    See all
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </button>
            )}
        </div>
    );
}

// ─── Medicine Card ────────────────────────────────────────────────────────────
interface MedCardProps {
    product: import("../types").Product;
    onView: () => void;
    onAdd: () => void;
}
export function MedicineCard({ product, onView, onAdd }: MedCardProps) {
    const isOOS = product.stockStatus === "out_of_stock";
    return (
        <div
            onClick={onView}
            style={{
                background: "#fff",
                border: "1px solid #EAEFEE",
                borderRadius: 18,
                overflow: "hidden",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
                display: "flex",
                flexDirection: "column",
            }}
            onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 32px rgba(66,123,119,0.12)";
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "";
            }}
        >
            {/* Image area */}
            <div style={{ background: "#F7FAF9", position: "relative" }}>
                <ProductImage src={product.image} alt={product.brandName} size={148} />
                <div style={{ position: "absolute", top: 10, left: 10 }}>
                    <StockBadge status={product.stockStatus} />
                </div>
                {product.originalPrice && (
                    <div style={{
                        position: "absolute", top: 10, right: 10,
                        background: "#427b77", color: "#fff",
                        fontSize: 10, fontWeight: 700, borderRadius: 6, padding: "3px 7px",
                        fontFamily: "'Epilogue', sans-serif",
                    }}>
                        SALE
                    </div>
                )}
            </div>

            {/* Info */}
            <div style={{ padding: "14px 16px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#427b77", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4, fontFamily: "'Epilogue', sans-serif" }}>
                    {product.manufacturer.split(" ")[0]}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#2d2d2d", marginBottom: 2, lineHeight: 1.35, fontFamily: "'Epilogue', sans-serif" }}>
                    {product.brandName}
                </div>
                <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 10, fontFamily: "'Epilogue', sans-serif" }}>
                    {product.strength} · {product.dosageForm}
                </div>

                <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 12, marginTop: "auto" }}>
                    <span style={{ fontSize: 17, fontWeight: 800, color: "#2d2d2d", fontFamily: "'Epilogue', sans-serif" }}>₱{product.price}</span>
                    {product.originalPrice && (
                        <span style={{ fontSize: 12, color: "#C4CBCA", textDecoration: "line-through", fontFamily: "'Epilogue', sans-serif" }}>₱{product.originalPrice}</span>
                    )}
                </div>

                {/* Star rating */}
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 12 }}>
                    <div style={{ display: "flex", gap: 1 }}>
                        {[1,2,3,4,5].map(i => (
                            <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill={i <= Math.round(product.rating) ? "#F59E0B" : "#E5E7EB"} stroke="none">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                        ))}
                    </div>
                    <span style={{ fontSize: 11, color: "#9CA3AF", fontFamily: "'Epilogue', sans-serif" }}>({product.reviewCount})</span>
                </div>

                <button
                    onClick={(e) => { e.stopPropagation(); onAdd(); }}
                    disabled={isOOS}
                    style={{
                        width: "100%",
                        background: isOOS ? "#F3F4F6" : "#2d2d2d",
                        color: isOOS ? "#9CA3AF" : "#fff",
                        border: "none",
                        borderRadius: 10,
                        padding: "10px 0",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: isOOS ? "not-allowed" : "pointer",
                        fontFamily: "'Epilogue', sans-serif",
                        letterSpacing: "0.03em",
                        transition: "background 0.2s",
                    }}
                    onMouseEnter={e => { if (!isOOS) (e.currentTarget as HTMLButtonElement).style.background = "#427b77"; }}
                    onMouseLeave={e => { if (!isOOS) (e.currentTarget as HTMLButtonElement).style.background = "#2d2d2d"; }}
                >
                    {isOOS ? "Out of Stock" : "Add to Cart"}
                </button>
            </div>
        </div>
    );
}

// ─── Category Card ────────────────────────────────────────────────────────────
interface CatCardProps {
    icon: string;
    label: string;
    color: string;
    active?: boolean;
    onClick: () => void;
}
export function CategoryCard({ icon, label, color, active, onClick }: CatCardProps) {
    return (
        <div
            onClick={onClick}
            style={{
                background: active ? "#F0F7F6" : "#fff",
                border: `1.5px solid ${active ? "#427b77" : "#EAEFEE"}`,
                borderRadius: 16,
                padding: "20px 12px",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
                if (!active) {
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
                    (e.currentTarget as HTMLDivElement).style.borderColor = "#427b77";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 6px 16px rgba(66,123,119,0.1)";
                }
            }}
            onMouseLeave={(e) => {
                if (!active) {
                    (e.currentTarget as HTMLDivElement).style.transform = "";
                    (e.currentTarget as HTMLDivElement).style.borderColor = "#EAEFEE";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "";
                }
            }}
        >
            <div style={{
                width: 52, height: 52, borderRadius: 14, background: color,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 24, margin: "0 auto 10px",
            }}>
                {icon}
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: active ? "#427b77" : "#2d2d2d", fontFamily: "'Epilogue', sans-serif" }}>
                {label}
            </div>
        </div>
    );
}

// ─── Notification Modal ───────────────────────────────────────────────────────
export function NotificationModal() {
    const { modal, closeModal } = useApp();
    if (!modal) return null;

    const bgMap: Record<string, string> = {
        success: "#DCFCE7",
        info: "#DBEAFE",
        warning: "#FEF9C3",
        error: "#FEE2E2",
        added: "#F0F7F6",
    };

    return (
        <div
            onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
            style={{
                position: "fixed", inset: 0,
                background: "rgba(45,45,45,0.45)",
                backdropFilter: "blur(4px)",
                zIndex: 300,
                display: "flex", alignItems: "center", justifyContent: "center",
                animation: "fadeIn 0.18s",
            }}
        >
            <div style={{
                background: "#fff",
                borderRadius: 24,
                padding: 36,
                maxWidth: 420,
                width: "90%",
                position: "relative",
                animation: "slideUp 0.22s ease-out",
                boxShadow: "0 32px 80px rgba(45,45,45,0.18)",
            }}>
                <button
                    onClick={closeModal}
                    style={{
                        position: "absolute", top: 16, right: 16,
                        background: "#F4F6F5", border: "none", borderRadius: 10,
                        width: 34, height: 34, cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#6B7280", fontSize: 14,
                    }}
                >✕</button>
                <div style={{
                    width: 64, height: 64, borderRadius: 18,
                    background: bgMap[modal.type] ?? "#F4F6F5",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 30, margin: "0 auto 20px",
                }}>
                    {modal.icon}
                </div>
                <h3 style={{ fontFamily: "'Epilogue', sans-serif", fontSize: 20, fontWeight: 700, textAlign: "center", marginBottom: 8, color: "#2d2d2d" }}>
                    {modal.title}
                </h3>
                <p style={{ fontSize: 14, color: "#6B7280", textAlign: "center", marginBottom: 24, lineHeight: 1.7, fontFamily: "'Epilogue', sans-serif" }}>
                    {modal.message}
                </p>
                {modal.actionLabel && (
                    <button
                        onClick={() => { modal.onAction?.(); closeModal(); }}
                        style={{
                            width: "100%", background: "#2d2d2d", color: "#fff",
                            border: "none", borderRadius: 12, padding: 14,
                            fontSize: 14, fontWeight: 700, cursor: "pointer",
                            fontFamily: "'Epilogue', sans-serif", letterSpacing: "0.02em",
                            transition: "background 0.2s",
                        }}
                        onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "#427b77"}
                        onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "#2d2d2d"}
                    >
                        {modal.actionLabel}
                    </button>
                )}
            </div>
            <style>{`
                @keyframes fadeIn  { from { opacity:0 } to { opacity:1 } }
                @keyframes slideUp { from { opacity:0; transform:translateY(24px) } to { opacity:1; transform:translateY(0) } }
            `}</style>
        </div>
    );
}

// ─── Stars Rating ─────────────────────────────────────────────────────────────
export function Stars({ rating }: { rating: number }) {
    return (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{ display: "inline-flex", gap: 2 }}>
                {[1,2,3,4,5].map(i => (
                    <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i <= Math.round(rating) ? "#F59E0B" : "#E5E7EB"} stroke="none">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                ))}
            </span>
            <span style={{ color: "#9CA3AF", fontSize: 13, fontFamily: "'Epilogue', sans-serif" }}>({rating.toFixed(1)})</span>
        </span>
    );
}