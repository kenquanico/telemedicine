import React from "react";
import { AppProvider, useApp } from "./hooks/useApp";
import Navbar from "./components/NavBar.tsx";
import { NotificationModal } from "./components/UI";
import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import PickupPage from "./pages/PickUpPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import {
    OrdersPage,
    TrackingPage,
    PaymentPage,
    PaymentHistoryPage,
    AccountPage,
} from "./pages/OtherPages";

// ─── Page Router ──────────────────────────────────────────────────────────────
function PageRouter() {
    const { currentPage } = useApp();

    const pages: Record<string, React.ReactNode> = {
        home: <HomePage />,
        catalog: <CatalogPage />,
        product: <ProductDetailPage />,
        pickup: <PickupPage />,
        cart: <CartPage />,
        checkout: <CheckoutPage />,
        orders: <OrdersPage />,
        tracking: <TrackingPage />,
        payment: <PaymentPage />,
        history: <PaymentHistoryPage />,
        account: <AccountPage />,
    };

    return <>{pages[currentPage] ?? <HomePage />}</>;
}

// ─── App Shell ────────────────────────────────────────────────────────────────
function AppShell() {
    return (
        <div className="min-h-screen bg-white font-['Geist']">
            <Navbar />
            <main>
                <PageRouter />
            </main>
            <NotificationModal />
        </div>
    );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
    return (
        <AppProvider>
            <AppShell />
        </AppProvider>
    );
}
