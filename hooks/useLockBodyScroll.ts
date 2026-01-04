"use client";

import { useLayoutEffect } from 'react';

export function useLockBodyScroll() {
    useLayoutEffect(() => {
        // Get original body overflow
        const originalStyle = window.getComputedStyle(document.body).overflow;
        const originalPaddingRight = window.getComputedStyle(document.body).paddingRight;

        // Calculate scrollbar width
        const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

        // Prevent scrolling on mount
        document.body.style.overflow = 'hidden';

        // Compensate for scrollbar width to prevent "jump"
        if (scrollBarWidth > 0) {
            document.body.style.paddingRight = `${scrollBarWidth}px`;
        }

        // Re-enable scrolling on unmount
        return () => {
            document.body.style.overflow = originalStyle;
            document.body.style.paddingRight = originalPaddingRight;
        };
    }, []);
}
