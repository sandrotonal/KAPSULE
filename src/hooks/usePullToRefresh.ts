import { useState, useEffect, useRef, useCallback } from 'react';
import { triggerHaptic } from '../utils/haptics';

export interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void> | void;
  threshold?: number;
  maxPull?: number;
  disabled?: boolean;
}

export interface UsePullToRefreshReturn {
  containerRef: React.RefObject<HTMLDivElement | null>;
  isPulling: boolean;
  isRefreshing: boolean;
  pullDistance: number;
  pullProgress: number; // 0 to 1
}

export function usePullToRefresh({
  onRefresh,
  threshold = 60,
  maxPull = 90,
  disabled = false,
}: UsePullToRefreshOptions): UsePullToRefreshReturn {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const startYRef = useRef(0);
  const isDraggingRef = useRef(false);
  const primedHapticRef = useRef(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setPullDistance(threshold);
    triggerHaptic.success();

    try {
      await Promise.resolve(onRefresh());
    } catch {
      triggerHaptic.error();
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
        setPullDistance(0);
        setIsPulling(false);
        primedHapticRef.current = false;
      }, 400);
    }
  }, [onRefresh, threshold]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || disabled) return;

    const onTouchStart = (e: TouchEvent) => {
      if (isRefreshing) return;
      if (el.scrollTop <= 0) {
        startYRef.current = e.touches[0].clientY;
        isDraggingRef.current = true;
        primedHapticRef.current = false;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || isRefreshing) return;

      const currentY = e.touches[0].clientY;
      const rawDelta = currentY - startYRef.current;

      if (rawDelta > 0 && el.scrollTop <= 0) {
        // Apply Apple iOS logarithmic rubber-band dampening
        const dampened = Math.min(maxPull, Math.pow(rawDelta, 0.82) * 0.75);
        setPullDistance(dampened);
        setIsPulling(true);

        if (dampened >= threshold && !primedHapticRef.current) {
          triggerHaptic.light();
          primedHapticRef.current = true;
        } else if (dampened < threshold && primedHapticRef.current) {
          primedHapticRef.current = false;
        }

        // Prevent browser native rubber-band bounce when pulling down
        if (e.cancelable && dampened > 8) {
          e.preventDefault();
        }
      } else {
        setPullDistance(0);
        setIsPulling(false);
      }
    };

    const onTouchEnd = () => {
      if (!isDraggingRef.current || isRefreshing) return;
      isDraggingRef.current = false;

      if (pullDistance >= threshold) {
        handleRefresh();
      } else {
        setPullDistance(0);
        setIsPulling(false);
        primedHapticRef.current = false;
      }
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    el.addEventListener('touchcancel', onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [disabled, handleRefresh, isRefreshing, maxPull, pullDistance, threshold]);

  const pullProgress = Math.min(1, pullDistance / threshold);

  return {
    containerRef,
    isPulling,
    isRefreshing,
    pullDistance,
    pullProgress,
  };
}
