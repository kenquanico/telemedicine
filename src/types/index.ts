export type Category =
    | "pain_relief"
    | "vitamins"
    | "antibiotics"
    | "cough_cold"
    | "antacids_gi"
    | "dermatology"
    | "diabetes_care"
    | "heart_bp"
    | "eye_ear"
    | "first_aid"
    | "baby_child"
    | "feminine_care"
    | "personal_care";

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";
export type OrderStatus = "pending" | "preparing" | "out_for_delivery" | "delivered" | "cancelled";
export type PaymentMethod = "cod" | "gcash" | "maya" | "credit_card";

export type PageKey =
    | "home"
    | "catalog"
    | "medicines"
    | "product"
    | "pickup"
    | "reservePickup"
    | "pharmacies"
    | "pharmacy"
    | "cart"
    | "checkout"
    | "favorites"
    | "orders"
    | "tracking"
    | "payment"
    | "history"
    | "account"
    | "settings"
    | "returns"
    | "prescription_upload"
    | "help_center"
    | "about"
    | "careers"
    | "press"
    | "privacy"
    | "terms";

export interface Review {
    id: string;
    reviewer: string;
    rating: number;
    comment: string;
    date: string;
}

export interface Product {
    id: string;
    brandName: string;
    genericName: string;
    manufacturer: string;
    category: Category;
    price: number;
    originalPrice?: number;
    image: string;
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
    rating: number;
    reviewCount: number;
    reviews: Review[];
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface Address {
    id: string;
    label: string;
    firstName: string;
    lastName: string;
    line: string;
    city: string;
    zip: string;
    phone: string;
    isDefault?: boolean;
}

export interface OrderItem {
    product: Product;
    quantity: number;
    price: number;
}

export interface Rider {
    name: string;
    phone: string;
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
    rider?: Rider;
}

export interface PaymentRecord {
    id: string;
    orderId: string;
    date: string;
    method: PaymentMethod;
    amount: number;
    itemCount: number;
}

export interface Notification {
    id: string;
    type: "success" | "info" | "warning" | "error";
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
}
