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
import PharmaciesPage from "./pages/PharmaciesPage.tsx";

const homeRendersPickupExperience = HomePage.name === "PickupPage";

// ─── Page Router ──────────────────────────────────────────────────────────────
function PageRouter() {
    const { currentPage } = useApp();

    const pages: Record<string, React.ReactNode> = {
        home: homeRendersPickupExperience ? <PickupPage /> : <HomePage />,
        catalog: <CatalogPage />,
        medicines: <CatalogPage />,
        product: <ProductDetailPage />,
        pickup: <PickupPage />,
        pharmacies: <PharmaciesPage />,
        pharmacy: <PickupPage />,
        cart: <CartPage />,
        checkout: <CheckoutPage />,
        favorites: <CatalogPage />,
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
    const { currentPage } = useApp();
    const hideNavbar =
        currentPage === "pickup" ||
        currentPage === "pharmacy" ||
        (currentPage === "home" && homeRendersPickupExperience);
    const compactNav =
        currentPage === "pharmacies";

    return (
        <div className="min-h-screen bg-white font-['Geist']">
            {!hideNavbar && <Navbar compact={compactNav} />}
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
