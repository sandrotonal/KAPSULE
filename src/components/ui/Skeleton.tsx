import React from 'react';
import { cn } from '../../lib/utils';

export interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "animate-pulse bg-vault-100 dark:bg-vault-800 rounded-2xl",
        className
      )}
    />
  );
};
