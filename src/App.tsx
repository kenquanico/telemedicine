import React from "react";
import { AppProvider, useApp } from "./hooks/useApp";
import type { PageKey } from "./types";
import Navbar from "./components/NavBar.tsx";
import { NotificationModal } from "./components/UI";
import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import PickupPage from "./pages/PickUpPage";
import ReservePickupPage from "./pages/ReserveForPickupPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import FavoritesPage from "./pages/FavoritesPage";
import { OrdersPage } from "./pages/OrdersPage";
import { TrackingPage } from "./pages/TrackingPage";
import { PaymentPage } from "./pages/PaymentPage";
import { PaymentHistoryPage } from "./pages/PaymentHistoryPage";
import { AccountPage } from "./pages/AccountPage";
import PharmaciesPage from "./pages/PharmaciesPage.tsx";
import ReturnsPage from "./pages/ReturnPage";
import PrescriptionUploadPage from "./pages/PrescriptionUploadPage";
import HelpCenterPage from "./pages/HelpCenterPage";
import AboutPage from "./pages/AboutPage";
import CareersPage from "./pages/CareersPage";
import PressPage from "./pages/PressPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsPage from "./pages/TermsPage";

const homeRendersPickupExperience = HomePage.name === "PickupPage";
const defaultReservePharmacy = {
    id: "ph-1",
    name: "Mercury Drug",
    address: "North Reclamation Area, Cebu City",
    openNow: true,
    hasFreeDelivery: false,
    rating: 4.8,
    userRatingsTotal: 1240,
};

// ─── Page Router ──────────────────────────────────────────────────────────────
function PageRouter() {
    const { currentPage, navigateTo } = useApp();

    const pages: Record<PageKey, React.ReactNode> = {
        home: homeRendersPickupExperience ? <PickupPage /> : <HomePage />,
        catalog: <CatalogPage />,
        medicines: <CatalogPage />,
        product: <ProductDetailPage />,
        pickup: <PickupPage />,
        reservePickup: <ReservePickupPage pharmacy={defaultReservePharmacy} />,
        pharmacies: <PharmaciesPage />,
        pharmacy: <PickupPage />,
        cart: <CartPage />,
        checkout: <CheckoutPage />,
        favorites: <FavoritesPage />,
        orders: <OrdersPage />,
        tracking: <TrackingPage />,
        payment: <PaymentPage />,
        history: <PaymentHistoryPage />,
        account: <AccountPage />,
        settings: <AccountPage />,
        returns: <ReturnsPage onBack={() => navigateTo("home")} />,
        prescription_upload: <PrescriptionUploadPage onBack={() => navigateTo("home")} />,
        help_center: <HelpCenterPage onBack={() => navigateTo("home")} />,
        about: <AboutPage onBack={() => navigateTo("home")} />,
        careers: <CareersPage onBack={() => navigateTo("home")} />,
        press: <PressPage onBack={() => navigateTo("home")} />,
        privacy: <PrivacyPolicyPage onBack={() => navigateTo("home")} />,
        terms: <TermsPage onBack={() => navigateTo("home")} />,
    };

    return <>{pages[currentPage] ?? <HomePage />}</>;
}

// ─── App Shell ────────────────────────────────────────────────────────────────
function AppShell() {
    const { currentPage } = useApp();
    const hideNavbar =
        currentPage === "pickup" ||
        currentPage === "reservePickup" ||
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
