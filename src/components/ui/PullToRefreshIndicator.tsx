import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, Check } from 'lucide-react';

export interface PullToRefreshIndicatorProps {
  isPulling: boolean;
  isRefreshing: boolean;
  pullDistance: number;
  pullProgress: number;
}

export const PullToRefreshIndicator: React.FC<PullToRefreshIndicatorProps> = ({
  isPulling,
  isRefreshing,
  pullDistance,
  pullProgress,
}) => {
  if (!isPulling && !isRefreshing) return null;

  return (
    <div
      className="absolute top-0 left-0 right-0 z-30 flex justify-center pointer-events-none"
      style={{
        transform: `translateY(${Math.max(12, pullDistance * 0.85)}px)`,
        transition: isRefreshing ? 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
      }}
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-surface/90 dark:bg-zinc-800/90 backdrop-blur-md border border-border/60 shadow-lg text-primary">
        {isRefreshing ? (
          <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        ) : (
          <ArrowDown
            className="w-4 h-4 text-secondary transition-transform duration-100"
            style={{
              transform: `rotate(${Math.min(180, pullProgress * 180)}deg)`,
              opacity: Math.max(0.4, pullProgress),
            }}
          />
        )}
      </div>
    </div>
  );
};
