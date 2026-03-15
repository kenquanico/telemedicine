import { useApp } from "../hooks/useApp";

export default function Footer() {
    const { navigateTo } = useApp();

    return (
        <footer style={{ background: "#061E29", padding: "40px 24px 20px" }}>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr 1fr 1fr",
                    gap: 32,
                    marginBottom: 32,
                }}
            >
                {/* Brand */}
                <div>
                    <div
                        style={{
                            fontFamily: "'Varela Round', sans-serif",
                            fontSize: 20,
                            color: "#fff",
                            marginBottom: 10,
                        }}
                    >
                        ➕ MediMart
                    </div>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }}>
                        Your trusted online pharmacy in Cebu. Fast delivery, authentic medicines,
                        and licensed pharmacist support — 7 days a week.
                    </p>
                </div>

                {/* Shop */}
                <div>
                    <h4 style={{ color: "#fff", fontSize: 14, fontWeight: 700, marginBottom: 14 }}>
                        Shop
                    </h4>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {["Pain Relief", "Cold & Flu", "Vitamins", "First Aid", "Personal Care"].map(
                            (item) => (
                                <li
                                    key={item}
                                    onClick={() => navigateTo("catalog")}
                                    style={{
                                        marginBottom: 8,
                                        fontSize: 13,
                                        color: "rgba(255,255,255,0.65)",
                                        cursor: "pointer",
                                    }}
                                >
                                    {item}
                                </li>
                            )
                        )}
                    </ul>
                </div>

                {/* Account */}
                <div>
                    <h4 style={{ color: "#fff", fontSize: 14, fontWeight: 700, marginBottom: 14 }}>
                        Account
                    </h4>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {[
                            { label: "My Orders", page: "orders" as const },
                            { label: "Track Order", page: "tracking" as const },
                            { label: "Payment History", page: "history" as const },
                            { label: "Profile", page: "account" as const },
                        ].map((item) => (
                            <li
                                key={item.label}
                                onClick={() => navigateTo(item.page)}
                                style={{
                                    marginBottom: 8,
                                    fontSize: 13,
                                    color: "rgba(255,255,255,0.65)",
                                    cursor: "pointer",
                                }}
                            >
                                {item.label}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Help */}
                <div>
                    <h4 style={{ color: "#fff", fontSize: 14, fontWeight: 700, marginBottom: 14 }}>
                        Help
                    </h4>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {["FAQs", "Contact Us", "Pharmacist Chat", "Privacy Policy"].map((item) => (
                            <li
                                key={item}
                                style={{
                                    marginBottom: 8,
                                    fontSize: 13,
                                    color: "rgba(255,255,255,0.65)",
                                    cursor: "pointer",
                                }}
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div
                style={{
                    borderTop: "1px solid rgba(255,255,255,0.1)",
                    paddingTop: 20,
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 12,
                    color: "rgba(255,255,255,0.45)",
                }}
            >
                <span>© 2025 MediMart. All rights reserved.</span>
                <span>FDA Registered · Licensed Pharmacy · Cebu City, PH</span>
            </div>
        </footer>
    );
}