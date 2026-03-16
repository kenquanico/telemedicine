// ─── Color Palette ───────────────────────────────────────────────────────────
// Primary:    #061E29
// Secondary:  #1D546D
// Accent:     #5F9598
// Background: #FFFFFF
// Neutral:    #F3F4F4

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export type OrderStatus =
    | "pending"
    | "preparing"
    | "out_for_delivery"
    | "delivered"
    | "cancelled";

export type PaymentMethod = "cod" | "gcash" | "maya" | "credit_card";

export type Category =
    | "pain_relief"
    | "cold_flu"
    | "vitamins"
    | "first_aid"
    | "personal_care";

// ─── Product ─────────────────────────────────────────────────────────────────
export interface Product {
    id: string;
    brandName: string;
    genericName: string;
    manufacturer: string;
    category: Category;
    price: number;
    originalPrice?: number;
    image: string; // emoji placeholder
    dosageForm: string;
    strength: string;
    packSize: string;
    storage: string;
    expiry: string;
    stockStatus: StockStatus;
    stockCount: number;
    description: string;
    dosageAdults: string;
    dosageChildren: string;
    maxDailyDose: string;
    howToTake: string;
    indication: string;
    warnings: string;
    reviews: Review[];
    rating: number;
    reviewCount: number;
}

// ─── Review ───────────────────────────────────────────────────────────────────
export interface Review {
    id: string;
    reviewer: string;
    rating: number;
    comment: string;
    date: string;
}

// ─── Cart ────────────────────────────────────────────────────────────────────
export interface CartItem {
    product: Product;
    quantity: number;
}

// ─── Address ─────────────────────────────────────────────────────────────────
export interface Address {
    id: string;
    label: string;
    firstName: string;
    lastName: string;
    line: string;
    city: string;
    zip: string;
    phone: string;
    isDefault: boolean;
}

// ─── Order ───────────────────────────────────────────────────────────────────
export interface OrderItem {
    product: Product;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    items: OrderItem[];
    status: OrderStatus;
    paymentMethod: PaymentMethod;
    address: Address;
    subtotal: number;
    deliveryFee: number;
    discount: number;
    total: number;
    createdAt: string;
    estimatedDelivery: string;
    rider?: { name: string; phone: string };
}

// ─── Payment History ─────────────────────────────────────────────────────────
export interface PaymentRecord {
    id: string;
    orderId: string;
    date: string;
    method: PaymentMethod;
    amount: number;
    itemCount: number;
}

// ─── Notification ────────────────────────────────────────────────────────────
export interface Notification {
    id: string;
    type: "success" | "info" | "warning" | "error";
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
}

// ─── App Page Keys ────────────────────────────────────────────────────────────
export type PageKey =
    | "medicines"


// ─── Filter State ─────────────────────────────────────────────────────────────
export interface CatalogFilters {
    categories: Category[];
    priceRanges: string[];
    brands: string[];
    stockOnly: boolean;
    searchQuery: string;
}