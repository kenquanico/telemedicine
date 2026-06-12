import { useMemo, useState } from "react";
import { ChevronRight, LifeBuoy, Search } from "lucide-react";
import { CollectionBreadcrumb } from "./pageComponents";

const HELP_ARTICLES = [
    {
        title: "Track an order or delivery",
        description: "Check order status, rider updates, and expected arrival times.",
        href: "#track-order",
    },
    {
        title: "Upload or update a prescription",
        description: "Learn what files are accepted and how pharmacist verification works.",
        href: "#prescriptions",
    },
    {
        title: "Reserve medicines for pickup",
        description: "Choose a branch, pickup window, and contact details before visiting.",
        href: "#reserve-pickup",
    },
    {
        title: "Returns, refunds, and damaged items",
        description: "Start a return request or report an incorrect item from your order.",
        href: "#returns",
    },
    {
        title: "Payment methods and failed payments",
        description: "Get help with cards, wallets, COD, receipts, and payment retries.",
        href: "#payments",
    },
    {
        title: "Account, addresses, and notifications",
        description: "Manage profile details, saved locations, reminders, and security.",
        href: "#account",
    },
];

export default function HelpCenterPage({ onBack }: { onBack?: () => void }) {
    const [query, setQuery] = useState("");

    const filteredArticles = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();

        if (!normalizedQuery) return HELP_ARTICLES;

        return HELP_ARTICLES.filter((article) => {
            const haystack = `${article.title} ${article.description}`.toLowerCase();
            return haystack.includes(normalizedQuery);
        });
    }, [query]);

    return (
        <main className="bg-white px-5 py-8 sm:px-8 lg:px-16">
            <div className="mx-auto w-full max-w-5xl space-y-12" dir="ltr">
                <CollectionBreadcrumb current="Dosely Help Center" onBack={onBack} />

                <div className="group relative">
                    <Search
                        aria-hidden="true"
                        size={22}
                        strokeWidth={1.7}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#262626]"
                    />
                    <input
                        type="text"
                        dir="ltr"
                        placeholder="Search for articles..."
                        className="h-16 w-full border-b border-black bg-transparent py-4 pl-12 pr-12 text-lg text-[#262626] transition-colors duration-200 placeholder:text-[#262626] hover:placeholder:text-[#262626]/50 focus:bg-white focus:text-[#262626] focus:outline-none focus:placeholder:text-[#262626]/50 epilogue-regular"
                        autoComplete="off"
                        name="q"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                    />
                </div>

                <section className="space-y-8">
                    <div className="flex items-start gap-4 bg-white transition-colors">
                        <div className="flex aspect-square w-20 flex-none items-center justify-center rounded-[14px] bg-[#427b77] text-white sm:w-24">
                            <LifeBuoy size={34} strokeWidth={1.65} />
                        </div>
                        <div className="flex flex-1 flex-col gap-1">
                            <h1 className="text-[34px] font-extrabold leading-tight text-[#262626] epilogue-header sm:text-[44px]">
                                Dosely Help Center
                            </h1>
                            <p className="text-base text-[#262626]/60 epilogue-regular">
                                Articles about orders, prescriptions, pickup, delivery, returns, and payments.
                            </p>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-white">
                        <div className="divide-y divide-[#E5E7EB]">
                            {filteredArticles.map((article) => (
                                <a
                                    key={article.title}
                                    href={article.href}
                                    className="flex w-full items-center justify-between gap-4 px-6 py-5 transition-colors hover:bg-[#F3F4F4]"
                                >
                                    <div className="flex flex-col gap-1">
                                        <span className="text-base font-medium text-[#262626] epilogue-regular">
                                            {article.title}
                                        </span>
                                        <span className="text-sm text-[#262626]/60 epilogue-regular">
                                            {article.description}
                                        </span>
                                    </div>
                                    <ChevronRight
                                        aria-hidden="true"
                                        size={20}
                                        strokeWidth={1.9}
                                        className="flex-none text-gray-600"
                                    />
                                </a>
                            ))}

                            {filteredArticles.length === 0 && (
                                <div className="px-6 py-10 text-center">
                                    <p className="text-base font-medium text-[#262626] epilogue-regular">
                                        No articles found
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setQuery("")}
                                        className="mt-3 text-sm font-semibold text-[#427b77] transition-colors hover:text-[#2f5f5b] hover:underline epilogue-header"
                                    >
                                        Clear search
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
