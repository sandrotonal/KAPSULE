import React from 'react';
import { ArrowDown } from 'lucide-react';

export interface PullToRefreshIndicatorProps {
  indicatorRef: React.RefObject<HTMLDivElement>;
  arrowRef: React.RefObject<SVGSVGElement>;
  isPulling: boolean;
  isRefreshing: boolean;
}

export const PullToRefreshIndicator: React.FC<PullToRefreshIndicatorProps> = ({
  indicatorRef,
  arrowRef,
  isPulling,
  isRefreshing,
}) => {
  return (
    <div
      ref={indicatorRef}
      className="absolute top-0 left-0 right-0 z-30 flex justify-center pointer-events-none"
      style={{
        opacity: 0,
        transform: 'translate3d(0, 12px, 0)',
      }}
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-surface/90 dark:bg-zinc-800/90 backdrop-blur-md border border-border/60 shadow-lg text-primary">
        {isRefreshing ? (
          <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        ) : (
          <ArrowDown
            ref={arrowRef}
            className="w-4 h-4 text-secondary transition-transform duration-100"
          />
        )}
      </div>
    </div>
  );
};
