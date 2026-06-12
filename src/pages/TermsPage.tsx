import { LegalPolicyPage } from "./pageComponents";

const paragraphClass = "mb-4 last:mb-0";

const SECTIONS = [
    {
        title: "1. Dosely",
        body: (
            <>
                <p className={paragraphClass}>
                    Dosely provides websites, mobile experiences, and related services that allow you to browse medicines and health products,
                    upload prescriptions, place delivery or pickup orders, make payments, track orders, and contact support. These Terms apply
                    to every new feature, service, or tool that we make available through the platform.
                </p>
                <p className={paragraphClass}>
                    Dosely connects you with participating pharmacies, healthcare partners, delivery partners, and support teams. Some products
                    may be supplied, dispensed, fulfilled, or delivered by third-party partners. Product photos and images are for illustration
                    only and may differ from the actual goods received.
                </p>
                <p className={paragraphClass}>
                    For customer support, contact us at{" "}
                    <a href="mailto:support@dosely.ph" className="font-semibold text-[#427b77] hover:underline">
                        support@dosely.ph
                    </a>{" "}
                    or through the Help Center.
                </p>
            </>
        ),
    },
    {
        title: "2. Use of the platform and account",
        body: (
            <>
                <p className={paragraphClass}>
                    You may need to create a Dosely account to use parts of the platform. When creating an account, you must provide complete,
                    accurate, and truthful information, including your name, email address, mobile number, delivery address, and any information
                    needed to process your order or comply with legal obligations.
                </p>
                <p className={paragraphClass}>
                    You are responsible for keeping your password, one-time pins, and account access secure. Except for fraud or abuse that is
                    not your fault, orders placed through your account are your responsibility.
                </p>
                <p className={paragraphClass}>
                    We may request additional information or documentation from you when needed to process orders, verify prescriptions, prevent
                    abuse, or comply with legal and regulatory obligations. You may request account deletion by contacting support, subject to
                    records we are required or permitted to retain.
                </p>
                <p className={paragraphClass}>
                    You must be at least eighteen (18) years old to create an account and purchase medicines. Users below eighteen (18) must
                    obtain consent from a parent or legal guardian, who accepts responsibility for the user's actions and charges.
                </p>
            </>
        ),
    },
    {
        title: "3. Restrictions",
        body: (
            <>
                <p className={paragraphClass}>
                    You may use Dosely only for lawful, personal, and intended purposes. You may not use the platform for resale, fraud,
                    harassment, abuse, impersonation, scraping, spam, unauthorized commercial activity, or any purpose that violates applicable
                    laws or these Terms.
                </p>
                <p className={paragraphClass}>
                    You may not upload unlawful, misleading, defamatory, abusive, obscene, infringing, private, unsafe, or fraudulent content.
                    You may not submit false prescription documents, use another person's identity, interfere with platform security, or attempt
                    to access systems that you are not authorized to use.
                </p>
                <p className={paragraphClass}>
                    We may investigate, edit, remove, restrict, suspend, or terminate access if we reasonably believe that content, conduct, an
                    account, or an order violates these Terms, our policies, applicable law, or platform safety standards.
                </p>
            </>
        ),
    },
    {
        title: "4. Intellectual property",
        body: (
            <p>
                All Dosely trademarks, logos, images, interfaces, copy, software, and service marks are owned by Dosely or used with permission.
                You may not copy, reproduce, republish, upload, post, transmit, distribute, modify, or use them without prior written consent.
                Use of platform materials is at your own risk and must not infringe third-party rights.
            </p>
        ),
    },
    {
        title: "5. Restricted goods and prescriptions",
        body: (
            <>
                <p className={paragraphClass}>
                    Some goods available on Dosely are restricted by law, regulation, professional standards, prescription requirements, age
                    limits, or pharmacy policies. We may refuse to sell, dispense, deliver, or release restricted goods if legal or safety
                    requirements are not met.
                </p>
                <p className={paragraphClass}>
                    Prescription medicines may only be purchased with a valid prescription from a licensed healthcare professional. Dosely and
                    its pharmacy partners may review, verify, reject, or request additional information about any prescription before accepting,
                    dispensing, or releasing an order.
                </p>
                <p className={paragraphClass}>
                    You must not submit altered, expired, fraudulent, reused, or unauthorized prescriptions. Medicines dispensed for a named
                    patient are intended only for that patient.
                </p>
            </>
        ),
    },
    {
        title: "6. Orders",
        body: (
            <>
                <p className={paragraphClass}>
                    When you place an order, you must review and confirm that all information is true, accurate, and complete, including items,
                    quantities, delivery or pickup details, contact details, payment information, voucher codes, and total amount.
                </p>
                <p className={paragraphClass}>
                    An order is accepted only when confirmed by Dosely or the relevant pharmacy partner. We may cancel or refuse an order if a
                    prescription cannot be verified, information is incomplete, stock is unavailable, payment fails, fraud is suspected, or
                    legal, safety, or operational requirements cannot be met.
                </p>
                <p className={paragraphClass}>
                    Special instructions are handled on a reasonable-efforts basis. If instructions cannot be followed safely, legally, or
                    commercially, Dosely or the partner pharmacy may proceed according to standard operating procedures.
                </p>
            </>
        ),
    },
    {
        title: "7. Prices and payments",
        body: (
            <>
                <p className={paragraphClass}>
                    Prices are displayed in Philippine Peso and may include applicable taxes unless otherwise stated. Prices, delivery fees,
                    service fees, minimum order values, discounts, and other charges may change at any time before checkout.
                </p>
                <p className={paragraphClass}>
                    A breakdown of prices and additional charges is shown before you place an order. By confirming an order, you agree to pay the
                    final total shown at checkout.
                </p>
                <p className={paragraphClass}>
                    We may offer payment methods such as cards, e-wallets, cash on delivery, vouchers, or other methods from time to time. Online
                    payments may be processed by third-party payment providers. Dosely does not store your full card information.
                </p>
                <p className={paragraphClass}>
                    Where QR payment is offered, you are responsible for scanning the correct QR code, checking the recipient name and amount, and
                    showing the successful transaction confirmation before the order is released. If QR payment fails, is declined, or cannot be
                    completed, you may be required to use another accepted payment method.
                </p>
            </>
        ),
    },
    {
        title: "8. Delivery and pickup",
        body: (
            <>
                <p className={paragraphClass}>
                    Delivery availability depends on your address, pharmacy coverage, rider availability, traffic, weather, stock, prescription
                    verification, and other operational factors. Estimated delivery times are estimates only, and orders may arrive earlier or
                    later.
                </p>
                <p className={paragraphClass}>
                    You must ensure that you or an authorized recipient is available to receive the order. If delivery fails because no one is
                    available, you are unreachable, access is insufficient, payment is not completed, or legal requirements are not met, the order
                    may be cancelled without refund where allowed by law and policy.
                </p>
                <p className={paragraphClass}>
                    Where pickup is available, the pharmacy may hold your order only for a reasonable period after the collection time. You are
                    responsible for inspecting pickup orders before leaving the pharmacy premises.
                </p>
                <p className={paragraphClass}>
                    Some deliveries may require a delivery PIN, identity check, payment confirmation, or other verification before release. If a
                    delivery partner, pharmacy partner, or vendor handles delivery directly, support may ask you to coordinate with that partner
                    for delivery-specific issues.
                </p>
            </>
        ),
    },
    {
        title: "9. Promotions, vouchers, and discounts",
        body: (
            <>
                <p className={paragraphClass}>
                    Dosely may offer promotional vouchers, gift vouchers, discounts, cashbacks, welcome deals, free delivery, or other offers.
                    These may be subject to validity periods, redemption periods, minimum order values, product exclusions, location limits, usage
                    limits, stock availability, and other conditions.
                </p>
                <p className={paragraphClass}>
                    Promotions are non-transferable, non-exchangeable, non-refundable, and cannot be exchanged for cash unless required by law.
                    We may withdraw, amend, void, discontinue, or reject any promotion or voucher where permitted by the applicable terms.
                </p>
                <p className={paragraphClass}>
                    Promotional vouchers may not be valid with other promotions, discounts, or vouchers. If an order value is below a voucher
                    value, remaining balances, if any, will be handled according to the specific voucher terms shown on the platform.
                </p>
            </>
        ),
    },
    {
        title: "10. Refunds, returns, and order issues",
        body: (
            <>
                <p className={paragraphClass}>
                    If you receive a wrong item, missing item, damaged item, defective product, or other issue, contact support as soon as
                    possible. We may request photos, receipts, prescription details, or other information to investigate.
                </p>
                <p className={paragraphClass}>
                    Refunds and returns depend on product type, prescription status, safety standards, partner pharmacy policies, payment method,
                    and applicable law. Medicines that are opened, tampered with, temperature-sensitive, dispensed by prescription, or unsafe to
                    resell may not be returnable.
                </p>
                <p className={paragraphClass}>
                    Approved refunds may be returned to the original payment method, wallet, store credit, voucher, or another method we make
                    available. Processing times may vary depending on banks, payment providers, and internal review.
                </p>
            </>
        ),
    },
    {
        title: "11. Warranties and limitation of liability",
        body: (
            <>
                <p className={paragraphClass}>
                    The platform is provided on an "as is" and "as available" basis. We make reasonable efforts to keep Dosely secure and
                    available, but we do not guarantee uninterrupted, error-free, virus-free, or delay-free operation.
                </p>
                <p className={paragraphClass}>
                    To the extent permitted by law, Dosely is not liable for indirect, incidental, special, consequential, exemplary, or
                    commercial damages, including lost profits, lost data, loss of goodwill, service interruption, or third-party actions.
                </p>
                <p className={paragraphClass}>
                    Pharmacy partners and vendors are responsible for the condition, quality, legality, and dispensing of products they provide.
                    Delivery partners or vendor delivery may be responsible for delivery issues under their own operating procedures.
                </p>
            </>
        ),
    },
    {
        title: "12. Personal data",
        body: (
            <p>
                You agree that Dosely may collect, use, process, store, and disclose your personal data, prescription information, order data,
                payment data, delivery information, and support information in accordance with these Terms and our Privacy Policy.
            </p>
        ),
    },
    {
        title: "13. Indemnity",
        body: (
            <p>
                You agree to indemnify and hold harmless Dosely, its officers, employees, representatives, affiliates, partners, and service
                providers from claims, liabilities, damages, losses, and costs arising from your use of the platform, breach of these Terms,
                violation of law, misuse of services, or infringement of third-party rights.
            </p>
        ),
    },
    {
        title: "14. Third-party links and services",
        body: (
            <p>
                Dosely may include links, integrations, payment providers, maps, delivery providers, pharmacy partners, or other third-party
                services. Accessing or using third-party services is at your own risk. We are not responsible for third-party content, systems,
                delays, outages, policies, or losses unless required by law.
            </p>
        ),
    },
    {
        title: "15. Termination",
        body: (
            <p>
                We may suspend, restrict, deactivate, or terminate your account or access to Dosely immediately if we believe your use is
                unacceptable, fraudulent, unsafe, unlawful, abusive, non-compliant with these Terms, or harmful to users, partners, riders,
                pharmacists, or the platform.
            </p>
        ),
    },
    {
        title: "16. Amendments",
        body: (
            <p>
                We may amend these Terms at any time. Updated Terms take effect when posted unless a later effective date is stated. Your
                continued use of Dosely after updated Terms are posted means you accept them. If you do not agree, you must stop using the
                platform.
            </p>
        ),
    },
    {
        title: "17. Governing law",
        body: (
            <p>
                These Terms are governed by the laws of the Republic of the Philippines. Any dispute or claim arising from these Terms or your
                use of Dosely will be subject to the jurisdiction of the proper courts of the Philippines, unless applicable law requires
                otherwise.
            </p>
        ),
    },
    {
        title: "18. Assignment and severability",
        body: (
            <>
                <p className={paragraphClass}>
                    You may not assign or transfer these Terms without our prior written approval. Dosely may assign or transfer these Terms, in
                    whole or in part, to an affiliate, successor, partner, or other third party where permitted by law.
                </p>
                <p className={paragraphClass}>
                    If any provision of these Terms is found invalid or unenforceable, the remaining provisions will remain in full force and
                    effect. No waiver of any provision will be treated as a continuing waiver of that provision or any other provision.
                </p>
            </>
        ),
    },
    {
        title: "19. Prevailing language",
        body: (
            <p>
                If these Terms are translated into another language, the English version will prevail to the extent of any inconsistency,
                unless applicable law requires otherwise.
            </p>
        ),
    },
];

export default function TermsPage({ onBack }: { onBack?: () => void }) {
    return (
        <LegalPolicyPage
            onBack={onBack}
            title="Terms of Use"
            published="15 May 2026"
            effective="15 May 2026"
            previousVersionHref="/terms/revisions/2025-06-15"
            intro={
                <>
                    <p>
                        These Terms of Use govern your access to and use of Dosely's websites, mobile applications, pharmacy ordering,
                        prescription upload, pickup, delivery, payment, tracking, and customer support services.
                    </p>
                    <p>
                        Please read these Terms carefully. By accessing or using Dosely, you agree that you have read, understood, and accepted
                        these Terms, including additional policies referenced on the platform. If you do not agree, do not access or use Dosely.
                    </p>
                </>
            }
            sections={SECTIONS}
            contact={
                <>
                    Questions?{" "}
                    <a href="mailto:support@dosely.ph" className="font-semibold text-[#427b77] hover:underline">
                        support@dosely.ph
                    </a>
                </>
            }
        />
    );
}
