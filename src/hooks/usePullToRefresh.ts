import { useState, useEffect, useRef, useCallback } from 'react';
import { triggerHaptic } from '../utils/haptics';

export interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void> | void;
  threshold?: number;
  maxPull?: number;
  disabled?: boolean;
}

export interface UsePullToRefreshReturn {
  containerRef: React.RefObject<HTMLDivElement>;
  contentRef: React.RefObject<HTMLDivElement>;
  indicatorRef: React.RefObject<HTMLDivElement>;
  arrowRef: React.RefObject<SVGSVGElement>;
  isPulling: boolean;
  isRefreshing: boolean;
}

export function usePullToRefresh({
  onRefresh,
  threshold = 60,
  maxPull = 90,
  disabled = false,
}: UsePullToRefreshOptions): UsePullToRefreshReturn {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<SVGSVGElement>(null);
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const startYRef = useRef(0);
  const isDraggingRef = useRef(false);
  const isPullingRef = useRef(false);
  const primedHapticRef = useRef(false);
  const pullDistanceRef = useRef(0);
  const isRefreshingRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);
  const onRefreshRef = useRef(onRefresh);
  onRefreshRef.current = onRefresh;

  const applyPullDistance = useCallback((distance: number, animate = false) => {
    const progress = Math.min(1, distance / threshold);
    const transition = animate ? 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)' : 'none';
    if (contentRef.current) {
      contentRef.current.style.transition = transition;
      contentRef.current.style.transform = `translate3d(0, ${distance * 0.45}px, 0)`;
    }
    if (indicatorRef.current) {
      indicatorRef.current.style.transition = transition;
      indicatorRef.current.style.transform = `translate3d(0, ${Math.max(12, distance * 0.85)}px, 0)`;
      indicatorRef.current.style.opacity = distance > 0 ? '1' : '0';
    }
    if (arrowRef.current) {
      arrowRef.current.style.transform = `rotate(${Math.min(180, progress * 180)}deg)`;
      arrowRef.current.style.opacity = String(Math.max(0.4, progress));
    }
  }, [threshold]);

  const handleRefresh = useCallback(async () => {
    isRefreshingRef.current = true;
    setIsRefreshing(true);
    pullDistanceRef.current = threshold;
    applyPullDistance(threshold, true);
    triggerHaptic.success();

    try {
      await Promise.resolve(onRefreshRef.current());
    } catch {
      triggerHaptic.error();
    } finally {
      setTimeout(() => {
        isRefreshingRef.current = false;
        setIsRefreshing(false);
        pullDistanceRef.current = 0;
        applyPullDistance(0, true);
        isPullingRef.current = false;
        setIsPulling(false);
        primedHapticRef.current = false;
      }, 350);
    }
  }, [applyPullDistance, threshold]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || disabled) return;

    const onTouchStart = (e: TouchEvent) => {
      if (isRefreshingRef.current) return;
      if (el.scrollTop <= 0) {
        startYRef.current = e.touches[0].clientY;
        isDraggingRef.current = true;
        primedHapticRef.current = false;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || isRefreshingRef.current) return;

      const currentY = e.touches[0].clientY;
      const rawDelta = currentY - startYRef.current;

      if (rawDelta > 0 && el.scrollTop <= 0) {
        // Apply Apple iOS logarithmic rubber-band dampening
        const dampened = Math.min(maxPull, Math.pow(rawDelta, 0.82) * 0.75);
        pullDistanceRef.current = dampened;

        if (dampened >= threshold && !primedHapticRef.current) {
          triggerHaptic.light();
          primedHapticRef.current = true;
        } else if (dampened < threshold && primedHapticRef.current) {
          primedHapticRef.current = false;
        }

        if (e.cancelable && dampened > 8) {
          e.preventDefault();
        }

        // Apply each gesture frame directly to the moving elements.
        if (rafIdRef.current === null) {
          rafIdRef.current = requestAnimationFrame(() => {
            applyPullDistance(pullDistanceRef.current);
            if (!isPullingRef.current) {
              isPullingRef.current = true;
              setIsPulling(true);
            }
            rafIdRef.current = null;
          });
        }
      } else {
        pullDistanceRef.current = 0;
        if (rafIdRef.current !== null) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
        applyPullDistance(0);
        isPullingRef.current = false;
        setIsPulling(false);
      }
    };

    const onTouchEnd = () => {
      if (!isDraggingRef.current || isRefreshingRef.current) return;
      isDraggingRef.current = false;
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }

      if (pullDistanceRef.current >= threshold) {
        handleRefresh();
      } else {
        pullDistanceRef.current = 0;
        applyPullDistance(0, true);
        isPullingRef.current = false;
        setIsPulling(false);
        primedHapticRef.current = false;
      }
    };

    const onTouchCancel = () => {
      if (!isDraggingRef.current || isRefreshingRef.current) return;
      isDraggingRef.current = false;
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      pullDistanceRef.current = 0;
      applyPullDistance(0, true);
      isPullingRef.current = false;
      primedHapticRef.current = false;
      setIsPulling(false);
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    el.addEventListener('touchcancel', onTouchCancel, { passive: true });

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('touchcancel', onTouchCancel);
    };
  }, [applyPullDistance, disabled, handleRefresh, maxPull, threshold]);

  return {
    containerRef,
    contentRef,
    indicatorRef,
    arrowRef,
    isPulling,
    isRefreshing,
  };
}
