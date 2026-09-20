import { useEffect, useRef } from "react";

// Ref-counted so stacked overlays (e.g. a dialog above the cart) don't unlock each other
let lockCount = 0;

function lockScroll() {
    if (lockCount++ === 0) {
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.overflow = "hidden";
        if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
}

function unlockScroll() {
    if (--lockCount === 0) {
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
    }
}

/** While `open`, locks page scroll and calls `onClose` when Escape is pressed. */
export function useOverlay(open: boolean, onClose: () => void) {
    const onCloseRef = useRef(onClose);

    useEffect(() => {
        onCloseRef.current = onClose;
    });

    useEffect(() => {
        if (!open) return;
        lockScroll();
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onCloseRef.current();
        };
        document.addEventListener("keydown", onKeyDown);
        return () => {
            unlockScroll();
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [open]);
}
