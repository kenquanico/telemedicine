import React from "react";
import type { StockStatus, OrderStatus } from "../types";
import { STATUS_META } from "../data/mockData";
import { useApp } from "../hooks/useApp";

// ─── Stock Badge ──────────────────────────────────────────────────────────────
export function StockBadge({ status }: { status: StockStatus }) {
    const map = {
        in_stock:    { bg: "#D1FAE5", color: "#065F46", label: "In Stock" },
        low_stock:   { bg: "#FEF3C7", color: "#92400E", label: "Low Stock" },
        out_of_stock:{ bg: "#FEE2E2", color: "#991B1B", label: "Out of Stock" },
    };
    const s = map[status];
    return (
        <span
            style={{
                background: s.bg,
                color: s.color,
                fontSize: 10,
                fontWeight: 700,
                borderRadius: 6,
                padding: "3px 8px",
            }}
        >
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
    const btnSize = size === "sm" ? 28 : 36;
    const fontSize = size === "sm" ? 14 : 18;
    return (
        <div style={{ display: "flex", alignItems: "center", gap: size === "sm" ? 6 : 10 }}>
            <button
                onClick={() => onChange(Math.max(min, value - 1))}
                style={{
                    width: btnSize,
                    height: btnSize,
                    border: "2px solid #E5E7EB",
                    background: "#fff",
                    borderRadius: 8,
                    fontSize,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    color: "#1D546D",
                    lineHeight: 1,
                }}
            >
                −
            </button>
            <span style={{ fontSize, fontWeight: 700, minWidth: 28, textAlign: "center" }}>{value}</span>
            <button
                onClick={() => onChange(Math.min(max, value + 1))}
                style={{
                    width: btnSize,
                    height: btnSize,
                    border: "2px solid #E5E7EB",
                    background: "#fff",
                    borderRadius: 8,
                    fontSize,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    color: "#1D546D",
                    lineHeight: 1,
                }}
            >
                +
            </button>
        </div>
    );
}

// ─── Primary Button ───────────────────────────────────────────────────────────
interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
    fullWidth?: boolean;
}
export function Btn({ variant = "primary", size = "md", fullWidth, children, style, ...rest }: BtnProps) {
    const variants = {
        primary:   { background: "#1D546D", color: "#fff", border: "none" },
        secondary: { background: "#061E29", color: "#fff", border: "none" },
        outline:   { background: "#fff", color: "#1D546D", border: "1.5px solid #1D546D" },
        ghost:     { background: "transparent", color: "#1D546D", border: "none" },
    };
    const sizes = {
        sm: { padding: "7px 16px", fontSize: 13, borderRadius: 8 },
        md: { padding: "10px 20px", fontSize: 14, borderRadius: 10 },
        lg: { padding: "14px 24px", fontSize: 15, borderRadius: 12 },
    };
    return (
        <button
            style={{
                ...variants[variant],
                ...sizes[size],
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                width: fullWidth ? "100%" : undefined,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                transition: "background 0.2s, opacity 0.2s",
                ...style,
            }}
            {...rest}
        >
            {children}
        </button>
    );
}

// ─── Section Header ───────────────────────────────────────────────────────────
export function SectionHeader({
                                  title,
                                  onSeeAll,
                              }: {
    title: string;
    onSeeAll?: () => void;
}) {
    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h2 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 20, fontWeight: 700, color: "#061E29" }}>
                {title}
            </h2>
            {onSeeAll && (
                <button
                    onClick={onSeeAll}
                    style={{ color: "#1D546D", fontSize: 13, fontWeight: 500, background: "none", border: "none", cursor: "pointer" }}
                >
                    See all →
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
    return (
        <div
            onClick={onView}
            style={{
                background: "#fff",
                border: "1px solid #E5E7EB",
                borderRadius: 16,
                overflow: "hidden",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(6,30,41,0.12)";
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "";
            }}
        >
            {/* Image */}
            <div
                style={{
                    background: "#F3F4F4",
                    height: 140,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 52,
                    position: "relative",
                }}
            >
                {product.image}
                <div style={{ position: "absolute", top: 8, right: 8 }}>
                    <StockBadge status={product.stockStatus} />
                </div>
            </div>

            {/* Info */}
            <div style={{ padding: 14 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#5F9598", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    {product.manufacturer}
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#061E29", margin: "3px 0 6px", lineHeight: 1.3 }}>
                    {product.brandName} {product.strength}
                </div>
                <div>
                    <span style={{ fontSize: 16, fontWeight: 700, color: "#1D546D" }}>₱{product.price}</span>
                    {product.originalPrice && (
                        <span style={{ fontSize: 12, color: "#6B7280", textDecoration: "line-through", marginLeft: 6 }}>
              ₱{product.originalPrice}
            </span>
                    )}
                </div>
                <button
                    onClick={(e) => { e.stopPropagation(); onAdd(); }}
                    disabled={product.stockStatus === "out_of_stock"}
                    style={{
                        width: "100%",
                        background: product.stockStatus === "out_of_stock" ? "#9CA3AF" : "#1D546D",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        padding: 8,
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: product.stockStatus === "out_of_stock" ? "not-allowed" : "pointer",
                        marginTop: 10,
                        fontFamily: "'DM Sans', sans-serif",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 4,
                    }}
                >
                    {product.stockStatus === "out_of_stock" ? "Out of Stock" : "+ Add to Cart"}
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
                background: active ? "#E8F4F5" : "#F3F4F4",
                border: `2px solid ${active ? "#5F9598" : "transparent"}`,
                borderRadius: 16,
                padding: "20px 12px",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
                if (!active) (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "";
            }}
        >
            <div
                style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                    margin: "0 auto 10px",
                }}
            >
                {icon}
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#061E29" }}>{label}</div>
        </div>
    );
}

// ─── Notification Modal ───────────────────────────────────────────────────────
export function NotificationModal() {
    const { modal, closeModal } = useApp();
    if (!modal) return null;

    const bgMap: Record<string, string> = {
        success: "#D1FAE5",
        info: "#DBEAFE",
        warning: "#FEF3C7",
        error: "#FEE2E2",
        added: "#D1FAE5",
    };

    return (
        <div
            onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(6,30,41,0.5)",
                zIndex: 300,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                animation: "fadeIn 0.18s",
            }}
        >
            <div
                style={{
                    background: "#fff",
                    borderRadius: 20,
                    padding: 28,
                    maxWidth: 420,
                    width: "90%",
                    position: "relative",
                    animation: "slideUp 0.22s ease-out",
                }}
            >
                <button
                    onClick={closeModal}
                    style={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        background: "#F3F4F4",
                        border: "none",
                        borderRadius: 8,
                        width: 32,
                        height: 32,
                        cursor: "pointer",
                        fontSize: 14,
                    }}
                >
                    ✕
                </button>
                <div
                    style={{
                        width: 60,
                        height: 60,
                        borderRadius: 16,
                        background: bgMap[modal.type] ?? "#F3F4F4",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 28,
                        margin: "0 auto 16px",
                    }}
                >
                    {modal.icon}
                </div>
                <h3 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 20, textAlign: "center", marginBottom: 8 }}>
                    {modal.title}
                </h3>
                <p style={{ fontSize: 14, color: "#6B7280", textAlign: "center", marginBottom: 20, lineHeight: 1.6 }}>
                    {modal.message}
                </p>
                {modal.actionLabel && (
                    <button
                        onClick={() => { modal.onAction?.(); closeModal(); }}
                        style={{
                            width: "100%",
                            background: "#1D546D",
                            color: "#fff",
                            border: "none",
                            borderRadius: 10,
                            padding: 12,
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: "pointer",
                            fontFamily: "'DM Sans', sans-serif",
                        }}
                    >
                        {modal.actionLabel}
                    </button>
                )}
            </div>
            <style>{`
        @keyframes fadeIn  { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
      `}</style>
        </div>
    );
}

// ─── Stars Rating ─────────────────────────────────────────────────────────────
export function Stars({ rating }: { rating: number }) {
    return (
        <span style={{ color: "#F59E0B", fontSize: 13 }}>
      {"★".repeat(Math.round(rating))}{"☆".repeat(5 - Math.round(rating))}
            <span style={{ color: "#6B7280", marginLeft: 4 }}>({rating.toFixed(1)})</span>
    </span>
    );
}