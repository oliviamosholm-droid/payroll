import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from 'react';
import {
    danishToEnglish,
    dynamicPatterns,
    englishToDanish,
} from './translations';

type Language = 'da' | 'en';

type TranslatorContextValue = {
    language: Language;
    toggle: () => void;
};

const TranslatorContext = createContext<TranslatorContextValue>({
    language: 'da',
    toggle: () => {},
});

export function useTranslator() {
    return useContext(TranslatorContext);
}

// Translate a single string (used for text nodes, placeholders, etc).
// Returns null if no translation applies.
function translateString(
    input: string,
    direction: 'toEn' | 'toDa',
): string | null {
    const map = direction === 'toEn' ? danishToEnglish : englishToDanish();
    const trimmed = input.trim();
    if (!trimmed) return null;
    if (trimmed in map) {
        // Preserve original leading/trailing whitespace.
        return input.replace(trimmed, map[trimmed]);
    }
    for (const p of dynamicPatterns) {
        const re = direction === 'toEn' ? p.da : p.en;
        const m = trimmed.match(re);
        if (m) {
            const translated =
                direction === 'toEn' ? p.toEn(m) : p.toDa(m);
            return input.replace(trimmed, translated);
        }
    }
    return null;
}

// Walks the document, replacing text nodes and select attributes.
// `direction` is the direction we want to translate the DOM in — if the
// active language is English, we translate any Danish we find (toEn); if
// the active language is Danish (after toggling back), we translate any
// English we find (toDa).
function applyTranslations(direction: 'toEn' | 'toDa') {
    if (typeof document === 'undefined') return;

    // 1. Text nodes
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode(node) {
                const el = (node as Text).parentElement;
                if (!el) return NodeFilter.FILTER_REJECT;
                // Skip our own UI so we don't translate the menu label.
                if (el.closest('[data-translator-ui]'))
                    return NodeFilter.FILTER_REJECT;
                // Skip script/style nodes.
                const tag = el.tagName;
                if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT')
                    return NodeFilter.FILTER_REJECT;
                return NodeFilter.FILTER_ACCEPT;
            },
        },
    );
    let node: Node | null;
    while ((node = walker.nextNode())) {
        const text = node as Text;
        const translated = translateString(text.textContent ?? '', direction);
        if (translated !== null && translated !== text.textContent) {
            text.textContent = translated;
        }
    }

    // 2. Placeholder, title, aria-label, alt attributes on relevant elements
    const ATTR_SELECTORS: { selector: string; attr: string }[] = [
        { selector: '[placeholder]', attr: 'placeholder' },
        { selector: '[title]', attr: 'title' },
        { selector: '[aria-label]', attr: 'aria-label' },
        { selector: '[alt]', attr: 'alt' },
    ];
    for (const { selector, attr } of ATTR_SELECTORS) {
        document.querySelectorAll(selector).forEach((el) => {
            if ((el as HTMLElement).closest('[data-translator-ui]')) return;
            const value = el.getAttribute(attr);
            if (!value) return;
            const translated = translateString(value, direction);
            if (translated !== null && translated !== value) {
                el.setAttribute(attr, translated);
            }
        });
    }

    // 3. document.title
    const titleTranslated = translateString(document.title, direction);
    if (titleTranslated !== null && titleTranslated !== document.title) {
        document.title = titleTranslated;
    }
}

type MenuState = { x: number; y: number } | null;

export function TranslatorProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>('da');
    const [menu, setMenu] = useState<MenuState>(null);
    const observerRef = useRef<MutationObserver | null>(null);
    const rafRef = useRef<number | null>(null);
    const languageRef = useRef<Language>('da');
    languageRef.current = language;

    const toggle = useCallback(() => {
        setLanguage((prev) => {
            const next: Language = prev === 'da' ? 'en' : 'da';
            // Apply translations on the next frame so any state updates
            // (e.g. menu closing) flush first.
            requestAnimationFrame(() => {
                applyTranslations(next === 'en' ? 'toEn' : 'toDa');
            });
            return next;
        });
    }, []);

    // When language is English, set up a MutationObserver that re-applies
    // translations as React re-renders the DOM. We only run the observer
    // in English mode — Danish is the source of truth and needs no work.
    useEffect(() => {
        if (language !== 'en') {
            observerRef.current?.disconnect();
            observerRef.current = null;
            return;
        }
        const observer = new MutationObserver(() => {
            if (rafRef.current !== null) return;
            rafRef.current = requestAnimationFrame(() => {
                rafRef.current = null;
                applyTranslations('toEn');
            });
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: true,
            attributeFilter: ['placeholder', 'title', 'aria-label', 'alt'],
        });
        observerRef.current = observer;
        return () => {
            observer.disconnect();
            observerRef.current = null;
            if (rafRef.current !== null) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }
        };
    }, [language]);

    // Custom right-click menu — captures contextmenu on the whole document
    // and shows our own one-item menu at the cursor.
    useEffect(() => {
        const onContextMenu = (e: MouseEvent) => {
            const target = e.target as Element | null;
            if (target?.closest('[data-translator-ui]')) return;
            e.preventDefault();
            // Clamp to viewport so the menu never spills off-screen.
            const MENU_WIDTH = 220;
            const MENU_HEIGHT = 44;
            const x = Math.min(e.clientX, window.innerWidth - MENU_WIDTH - 8);
            const y = Math.min(e.clientY, window.innerHeight - MENU_HEIGHT - 8);
            setMenu({ x, y });
        };
        const onPointerDown = (e: MouseEvent) => {
            const target = e.target as Element | null;
            if (target?.closest('[data-translator-ui]')) return;
            setMenu(null);
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setMenu(null);
        };
        const onScroll = () => setMenu(null);
        document.addEventListener('contextmenu', onContextMenu);
        document.addEventListener('pointerdown', onPointerDown);
        document.addEventListener('keydown', onKey);
        window.addEventListener('scroll', onScroll, true);
        return () => {
            document.removeEventListener('contextmenu', onContextMenu);
            document.removeEventListener('pointerdown', onPointerDown);
            document.removeEventListener('keydown', onKey);
            window.removeEventListener('scroll', onScroll, true);
        };
    }, []);

    const menuLabel =
        language === 'da' ? 'Translate to English' : 'Oversæt til dansk';
    const menuHint = language === 'da' ? 'Engelsk' : 'Dansk';

    return (
        <TranslatorContext.Provider value={{ language, toggle }}>
            {children}
            {menu && (
                <div
                    data-translator-ui="true"
                    role="menu"
                    aria-label="Translator"
                    style={{
                        position: 'fixed',
                        left: menu.x,
                        top: menu.y,
                        zIndex: 9999,
                        minWidth: 220,
                    }}
                    className="rounded-lg border border-grey-300 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12),0_2px_4px_rgba(0,0,0,0.06)] py-1"
                    onContextMenu={(e) => e.preventDefault()}
                >
                    <button
                        type="button"
                        role="menuitem"
                        data-translator-ui="true"
                        onClick={(e) => {
                            e.stopPropagation();
                            setMenu(null);
                            toggle();
                        }}
                        className="flex w-full items-center justify-between gap-3 px-3 py-2 text-sm text-neutral-900 hover:bg-grey-100"
                    >
                        <span className="inline-flex items-center gap-2">
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                aria-hidden="true"
                            >
                                <path
                                    d="M5 8h8M9 5v3M5 14l4-6 4 6M6.5 12.5h5"
                                    stroke="currentColor"
                                    strokeWidth="1.6"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M14 13h7M14 13l3-3M14 13l3 3M16 21l3-5 3 5M17.5 19h3"
                                    stroke="currentColor"
                                    strokeWidth="1.6"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <span className="font-medium">{menuLabel}</span>
                        </span>
                        <span className="text-xs text-neutral-500">
                            → {menuHint}
                        </span>
                    </button>
                </div>
            )}
        </TranslatorContext.Provider>
    );
}
