import { useRef, useEffect, useCallback, ReactNode } from 'react';

interface CardGridWrapperProps {
  children: ReactNode;
  className?: string;
}

export function CardGridWrapper({ children, className = '' }: CardGridWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);

  const equalize = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const headers = Array.from(el.querySelectorAll<HTMLElement>('[data-card-header]'));
    if (headers.length === 0) return;
    // Reset to auto first so we get natural height
    headers.forEach((h) => { h.style.height = 'auto'; });
    // Measure and apply the tallest
    let maxH = 0;
    headers.forEach((h) => {
      if (h.offsetHeight > maxH) maxH = h.offsetHeight;
    });
    if (maxH > 0) {
      headers.forEach((h) => { h.style.height = `${maxH}px`; });
    }
  }, []);

  useEffect(() => {
    const frameId = requestAnimationFrame(equalize);
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && ref.current) {
      ro = new ResizeObserver(equalize);
      ro.observe(ref.current);
    }
    return () => {
      cancelAnimationFrame(frameId);
      if (ro) ro.disconnect();
    };
  }, [equalize]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
