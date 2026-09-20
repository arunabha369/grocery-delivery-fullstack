import { useEffect, useId, useRef, type ReactNode } from "react";
import { XIcon } from "lucide-react";
import { useOverlay } from "../../hooks/useOverlay";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title: ReactNode;
    description?: ReactNode;
    icon?: ReactNode;
    size?: "sm" | "md" | "lg";
    children: ReactNode;
}

const sizes = { sm: "sm:max-w-sm", md: "sm:max-w-lg", lg: "sm:max-w-2xl" };

/** Accessible dialog: centred on desktop, bottom sheet on mobile. */
export default function Modal({ open, onClose, title, description, icon, size = "md", children }: ModalProps) {
    const titleId = useId();
    const panelRef = useRef<HTMLDivElement>(null);
    useOverlay(open, onClose);

    useEffect(() => {
        if (!open) return;
        const previouslyFocused = document.activeElement as HTMLElement | null;
        const panel = panelRef.current;
        // Respect autoFocus on a child field; otherwise focus the dialog itself
        if (panel && !panel.contains(document.activeElement)) panel.focus();
        return () => previouslyFocused?.focus?.();
    }, [open]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-70 flex items-end justify-center sm:items-center sm:p-4">
            <div className="absolute inset-0 bg-app-green/40 backdrop-blur-[2px] animate-fade" onClick={onClose} aria-hidden="true" />
            <div ref={panelRef} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} className={`relative w-full ${sizes[size]} max-h-[92vh] overflow-y-auto rounded-t-3xl bg-white shadow-2xl outline-none animate-slide-in-up sm:rounded-2xl`}>
                <div className="mx-auto mt-3 h-1.5 w-10 rounded-full bg-app-border sm:hidden" />
                <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 sm:pt-6">
                    <div className="flex items-start gap-3">
                        {icon && <div className="flex-center size-10 shrink-0 rounded-xl bg-app-cream">{icon}</div>}
                        <div>
                            <h2 id={titleId} className="text-lg font-semibold text-app-green">
                                {title}
                            </h2>
                            {description && <p className="mt-1 text-sm text-app-text-light">{description}</p>}
                        </div>
                    </div>
                    <button type="button" onClick={onClose} aria-label="Close dialog" className="-mt-1 -mr-2 rounded-lg p-2 text-app-text-light hover:bg-app-cream hover:text-app-green">
                        <XIcon className="size-5" />
                    </button>
                </div>
                <div className="px-6 pb-6">{children}</div>
            </div>
        </div>
    );
}
