import { useEffect } from 'react';

/**
 * Custom hook to lock body scrolling whenever a popup, modal, or drawer is active.
 * Restores original scroll posture immediately when closed or unmounted.
 */
export function usePreventScroll(isOpen: boolean) {
  useEffect(() => {
    if (!isOpen) return;

    const originalStyle = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    // Measure scrollbar width to avoid content shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalStyle;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isOpen]);
}
