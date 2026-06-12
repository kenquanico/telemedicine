import { ChevronDown, ChevronRight } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

const LOCALE_OPTIONS = [
    ["en-US", "English (United States)"],
    ["ar", "العربية"],
    ["am-ET", "አማርኛ"],
    ["hy-AM", "հայերեն"],
    ["bn-BD", "বাংলা"],
    ["bs-BA", "bosanski"],
    ["bg-BG", "български"],
    ["my-MM", "မြန်မာ"],
    ["ca-ES", "catala"],
    ["hr-HR", "hrvatski"],
    ["cs-CZ", "cestina"],
    ["da-DK", "dansk"],
    ["nl-NL", "Nederlands"],
    ["et-EE", "eesti"],
    ["fi-FI", "suomi"],
    ["fr-CA", "francais (Canada)"],
    ["fr-FR", "francais (France)"],
    ["ka-GE", "ქართული"],
    ["de-DE", "Deutsch"],
    ["el-GR", "Ελληνικά"],
    ["gu-IN", "ગુજરાતી"],
    ["hi-IN", "हिन्दी"],
    ["hu-HU", "magyar"],
    ["is-IS", "islenska"],
    ["id-ID", "Indonesia"],
    ["ga-IE", "Gaeilge"],
    ["it-IT", "italiano"],
    ["ja-JP", "日本語"],
    ["kn-IN", "ಕನ್ನಡ"],
    ["kk-Cyrl", "қазақ тілі"],
    ["ko-KR", "한국어"],
    ["lv-LV", "latviesu"],
    ["lt-LT", "lietuviu"],
    ["mk-MK", "Macedonian"],
    ["ms-BN", "Melayu"],
    ["ml-IN", "മലയാളം"],
    ["mt-MT", "Malti"],
    ["mr-IN", "मराठी"],
    ["mn-MN", "Mongolian"],
    ["nb-NO", "norsk bokmal"],
    ["pl-PL", "polski"],
    ["pt-BR", "portugues (Brasil)"],
    ["pt-PT", "portugues (Portugal)"],
    ["ro-RO", "romana"],
    ["ru-RU", "русский"],
    ["sk-SK", "slovencina"],
    ["sl-SI", "slovenscina"],
    ["sr-Latn-RS", "srpski (Srbija)"],
    ["so-DJ", "Soomaali"],
    ["es-419", "espanol (Latinoamerica)"],
    ["es-ES", "espanol (Espana)"],
    ["sw-KE", "Kiswahili"],
    ["sv-SE", "svenska"],
    ["fil-PH", "Filipino"],
    ["ta-IN", "தமிழ்"],
    ["te-IN", "తెలుగు"],
    ["th-TH", "ไทย"],
    ["tr-TR", "Turkce"],
    ["uk-UA", "українська"],
    ["ur-IN", "اردو"],
    ["vi-VN", "Tieng Viet"],
    ["zh-Hans-CN", "中文 (中国)"],
    ["zh-Hant", "中文 (台灣)"],
    ["zh-Hant-HK", "中文 (香港)"],
] as const;

type LegalSection = {
    title: string;
    body: ReactNode;
};

export function CollectionBreadcrumb({ current, onBack }: { current: string; onBack?: () => void }) {
    if (!onBack) return null;

    return (
        <nav className="mb-6 text-sm" aria-label="Breadcrumb">
            <ol className="flex flex-wrap">
                <li className="flex max-w-full items-center">
                    <button
                        type="button"
                        onClick={onBack}
                        className="text-[#262626] transition-colors hover:text-[#427b77] hover:underline epilogue-regular"
                    >
                        All collections
                    </button>
                    <ChevronRight
                        aria-hidden="true"
                        size={16}
                        strokeWidth={1.8}
                        className="mx-1 inline-block align-middle text-[#262626]/40"
                    />
                </li>
                <li className="flex max-w-full items-center">
                    <span className="text-[#262626]/55 epilogue-regular">{current}</span>
                </li>
            </ol>
        </nav>
    );
}

export function PageShell({
    children,
    onBack,
    breadcrumbLabel,
}: {
    children: ReactNode;
    onBack?: () => void;
    breadcrumbLabel?: string;
}) {
    return (
        <div className="bg-white px-5 py-8 sm:px-8 lg:px-16">
            <div className="mx-auto max-w-3xl">
                {breadcrumbLabel && <CollectionBreadcrumb current={breadcrumbLabel} onBack={onBack} />}
                {children}
            </div>
        </div>
    );
}

export function PageHero({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
    return (
        <header className="mb-8">
            <p className="mb-3 text-[11px] font-extrabold uppercase tracking-widest text-[#427b77] epilogue-header">
                {eyebrow}
            </p>
            <h1 className="text-[34px] font-extrabold leading-tight text-[#262626] epilogue-header sm:text-[44px]">
                {title}
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[#262626]/60 epilogue-regular">
                {subtitle}
            </p>
        </header>
    );
}

export function LegalPolicyPage({
    onBack,
    title,
    published,
    effective,
    previousVersionHref,
    intro,
    sections,
    contact,
}: {
    onBack?: () => void;
    title: string;
    published: string;
    effective: string;
    previousVersionHref: string;
    intro: ReactNode;
    sections: LegalSection[];
    contact: ReactNode;
}) {
    return (
        <PageShell onBack={onBack} breadcrumbLabel={title}>
            <article className="mt-2 flex min-w-0 flex-col gap-10">
                <div className="flex flex-col gap-4">
                    <label className="flex flex-col gap-2">
                        <span className="sr-only">Select language</span>
                        <div className="relative flex items-center">
                            <select
                                className="h-10 max-w-full grow appearance-none truncate rounded-sm border border-[#262626]/12 bg-white px-3 pr-8 text-[14px] text-[#262626] outline-none ring-[#262626]/12 transition-colors hover:border-[#262626]/40 focus:border-[#262626]/40 focus:ring-4 epilogue-regular"
                                name="Locale Select"
                                aria-label="Select language"
                                defaultValue="en-US"
                            >
                                {LOCALE_OPTIONS.map(([value, label]) => (
                                    <option value={value} key={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown
                                aria-hidden="true"
                                size={16}
                                strokeWidth={1.6}
                                className="pointer-events-none absolute right-3 text-[#262626]"
                            />
                        </div>
                    </label>
                </div>

                <header className="flex flex-col items-center text-center">
                    <p className="mb-5 text-[13px] text-[#262626] epilogue-regular">Published: {published}</p>
                    <h1 className="max-w-[62.5rem] text-[42px] font-extrabold leading-[1.02] text-[#262626] epilogue-header sm:text-[64px]">
                        {title}
                    </h1>
                </header>

                <div className="mx-auto flex w-full max-w-2xl flex-col gap-5 text-[15px] leading-7 text-[#262626]/72 epilogue-regular">
                    <p>
                        <span>Effective: {effective} (</span>
                        <a
                            className="text-[#262626] underline decoration-1 underline-offset-4 transition-colors hover:text-[#262626]/60"
                            href={previousVersionHref}
                        >
                            Previous version
                        </a>
                        <span>)</span>
                    </p>
                    {intro}
                </div>

                <div className="mx-auto flex w-full max-w-2xl flex-col gap-9">
                    {sections.map((section) => (
                        <section className="scroll-mt-24" id={section.title.toLowerCase().replaceAll(" ", "-")} key={section.title}>
                            <h2 className="mb-3 text-[25px] font-extrabold leading-tight text-[#262626] epilogue-header">
                                {section.title}
                            </h2>
                            <div className="text-[15px] leading-7 text-[#262626]/72 epilogue-regular">
                                {section.body}
                            </div>
                        </section>
                    ))}
                </div>

                <Divider />
                <p className="mx-auto w-full max-w-2xl text-[13px] leading-6 text-[#262626]/60 epilogue-regular">
                    {contact}
                </p>
            </article>
        </PageShell>
    );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
    return (
        <div className={`rounded-[14px] border border-[#E5E7EB] bg-white p-5 ${className}`}>
            {children}
        </div>
    );
}

export function SectionTitle({ children }: { children: ReactNode }) {
    return (
        <h2 className="mb-4 text-[16px] font-extrabold text-[#262626] epilogue-header">
            {children}
        </h2>
    );
}

export function Pill({ children }: { children: ReactNode }) {
    return (
        <span className="inline-flex rounded-full border border-[#DCE6E4] bg-[#F7F9F9] px-3 py-1 text-[11px] font-bold text-[#427b77] epilogue-header">
            {children}
        </span>
    );
}

export function Divider() {
    return <div className="my-8 border-t border-[#EAEFEE]" />;
}

export function Step({ number, title, children }: { number: number; title: string; children: ReactNode }) {
    return (
        <div className="flex gap-4">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#427b77] text-[12px] font-extrabold text-white epilogue-header">
                {number}
            </span>
            <div>
                <p className="text-[14px] font-extrabold text-[#262626] epilogue-header">{title}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-[#262626]/60 epilogue-regular">
                    {children}
                </p>
            </div>
        </div>
    );
}

export function TealButton({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
    return (
        <button
            type="button"
            className="mt-5 rounded-[14px] bg-[#1D546D] px-5 py-3 text-[13px] font-extrabold text-white epilogue-header transition-colors hover:bg-[#427b77]"
            {...props}
        >
            {children}
        </button>
    );
}
