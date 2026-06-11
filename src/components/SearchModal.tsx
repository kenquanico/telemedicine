import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Clock, TrendingUp, ArrowRight } from "lucide-react";

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const TRENDING = [
    "Biogesic 500mg",
    "Vitamin C 1000mg",
    "Bioflu",
    "Neozep",
    "Alaxan FR",
];

const RECENT = [
    "Losartan 50mg",
    "Metformin 500mg",
    "Amoxicillin 500mg",
];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const handleClose = useCallback(() => {
        setQuery("");
        onClose();
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 80);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") handleClose();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [handleClose]);

    if (!isOpen) return null;

    const filtered = query.trim()
        ? [...TRENDING, ...RECENT].filter((s) =>
            s.toLowerCase().includes(query.toLowerCase())
        )
        : [];

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
                onClick={handleClose}
                style={{ animation: "fadeIn 0.18s ease-out" }}
            />

            {/* Modal */}
            <div
                className="fixed top-[10%] left-1/2 z-50 w-full max-w-xl -translate-x-1/2"
                style={{ animation: "slideDown 0.22s cubic-bezier(0.34,1.56,0.64,1)" }}
            >
                <div className="mx-4 bg-white rounded-2xl shadow-[0_32px_80px_rgba(6,30,41,0.22)] overflow-hidden border border-gray-100">

                    {/* Search input row */}
                    <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
                        <Search size={18} strokeWidth={1.8} className="text-[#427b77] shrink-0" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search medicines, brands, generics..."
                            className="flex-1 text-sm text-[#262626] placeholder:text-[#262626]/35 outline-none bg-transparent epilogue-regular"
                        />
                        {query && (
                            <button
                                onClick={() => setQuery("")}
                                className="w-6 h-6 rounded-full bg-[#262626]/08 hover:bg-[#262626]/14 flex items-center justify-center transition-colors duration-150 cursor-pointer shrink-0"
                            >
                                <X size={13} strokeWidth={2} className="text-[#262626]/60" />
                            </button>
                        )}
                        <button
                            onClick={handleClose}
                            className="ml-1 text-xs epilogue-regular text-[#262626]/40 hover:text-[#262626]/70 transition-colors duration-150 cursor-pointer shrink-0 border border-gray-200 rounded-md px-2 py-1"
                        >
                            Esc
                        </button>
                    </div>

                    {/* Results / Suggestions */}
                    <div className="max-h-[60vh] overflow-y-auto">
                        {query.trim() ? (
                            filtered.length > 0 ? (
                                <div className="py-2">
                                    {filtered.map((item) => (
                                        <button
                                            key={item}
                                            className="w-full flex items-center gap-3 px-5 py-3 hover:bg-[#F4F7F8] transition-colors duration-100 cursor-pointer text-left group"
                                        >
                                            <Search size={14} strokeWidth={1.6} className="text-[#262626]/30 shrink-0" />
                                            <span className="flex-1 text-sm text-[#262626] epilogue-regular">
                                                {item.split(new RegExp(`(${query})`, "gi")).map((part, i) =>
                                                    part.toLowerCase() === query.toLowerCase()
                                                        ? <mark key={i} className="bg-[#427b77]/15 text-[#427b77] rounded px-0.5 font-semibold not-italic">{part}</mark>
                                                        : part
                                                )}
                                            </span>
                                            <ArrowRight size={13} strokeWidth={1.6} className="text-[#262626]/20 group-hover:text-[#427b77] transition-colors duration-150 shrink-0" />
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center">
                                    <p className="text-sm text-[#262626]/40 epilogue-regular">No results for <span className="text-[#262626]/70 font-medium">"{query}"</span></p>
                                    <p className="text-xs text-[#262626]/30 epilogue-regular mt-1">Try a different medicine name or brand</p>
                                </div>
                            )
                        ) : (
                            <div className="py-3">
                                {/* Recent */}
                                {RECENT.length > 0 && (
                                    <div className="mb-1">
                                        <p className="px-5 py-2 text-[10px] font-bold tracking-widest text-[#262626]/30 uppercase epilogue-regular">Recent</p>
                                        {RECENT.map((item) => (
                                            <button
                                                key={item}
                                                onClick={() => setQuery(item)}
                                                className="w-full flex items-center gap-3 px-5 py-2.5 hover:bg-[#F4F7F8] transition-colors duration-100 cursor-pointer text-left group"
                                            >
                                                <Clock size={13} strokeWidth={1.6} className="text-[#262626]/25 shrink-0" />
                                                <span className="flex-1 text-sm text-[#262626]/70 epilogue-regular">{item}</span>
                                                <ArrowRight size={13} strokeWidth={1.6} className="text-[#262626]/20 group-hover:text-[#427b77] transition-colors duration-150 shrink-0" />
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Trending */}
                                <div className="mt-1">
                                    <p className="px-5 py-2 text-[10px] font-bold tracking-widest text-[#262626]/30 uppercase epilogue-regular">Trending</p>
                                    {TRENDING.map((item) => (
                                        <button
                                            key={item}
                                            onClick={() => setQuery(item)}
                                            className="w-full flex items-center gap-3 px-5 py-2.5 hover:bg-[#F4F7F8] transition-colors duration-100 cursor-pointer text-left group"
                                        >
                                            <TrendingUp size={13} strokeWidth={1.6} className="text-[#427b77]/50 shrink-0" />
                                            <span className="flex-1 text-sm text-[#262626]/70 epilogue-regular">{item}</span>
                                            <ArrowRight size={13} strokeWidth={1.6} className="text-[#262626]/20 group-hover:text-[#427b77] transition-colors duration-150 shrink-0" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer hint */}
                    <div className="px-5 py-3 border-t border-gray-100 flex items-center gap-4">
                        <span className="text-[10px] text-[#262626]/30 epilogue-regular">Press <kbd className="font-mono bg-gray-100 px-1 py-0.5 rounded text-[#262626]/50">↵</kbd> to search</span>
                        <span className="text-[10px] text-[#262626]/30 epilogue-regular">Press <kbd className="font-mono bg-gray-100 px-1 py-0.5 rounded text-[#262626]/50">Esc</kbd> to close</span>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @keyframes slideDown {
                    from { opacity: 0; transform: translate(-50%, -16px); }
                    to   { opacity: 1; transform: translate(-50%, 0); }
                }
            `}</style>
        </>
    );
}
