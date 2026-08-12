import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { findBrand, getCategoryFallbackIcon, getDomainFaviconUrl } from '../../lib/brandLogos';

export interface BrandAvatarProps {
  name: string;
  brand?: string;
  imageUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const BrandAvatar: React.FC<BrandAvatarProps> = ({
  name,
  brand,
  imageUrl,
  size = 'md',
  className,
}) => {
  const [imgError, setImgError] = useState(false);
  const [cdnError, setCdnError] = useState(false);
  const [domainError, setDomainError] = useState(false);

  const matchedBrand = findBrand(`${name || ''} ${brand || ''}`);

  // Increased sizes: bigger, bolder, clearer
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-18 h-18',
  };

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14',
  };

  // 1. Direct Image URL (Custom upload) - clean, no bulky border
  if (imageUrl && !imgError) {
    return (
      <div
        className={cn(
          'relative shrink-0 flex items-center justify-center bg-transparent border-0 overflow-hidden',
          sizeClasses[size],
          className
        )}
      >
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-contain rounded-xl"
          onError={() => setImgError(true)}
          loading="lazy"
        />
      </div>
    );
  }

  // 2. Official SVG Logo from definitions - clean, borderless, backgroundless!
  if (matchedBrand?.svg) {
    const isMonochrome = matchedBrand.name.toLowerCase() === 'apple' || matchedBrand.name.toLowerCase() === 'zara' || matchedBrand.name.toLowerCase() === 'nike';
    return (
      <div
        className={cn(
          'relative shrink-0 flex items-center justify-center bg-transparent border-0 transition-transform duration-300 group-hover:scale-105',
          sizeClasses[size],
          isMonochrome ? 'text-zinc-900 dark:text-zinc-100' : '',
          className
        )}
        style={{
          color: isMonochrome ? undefined : matchedBrand.color,
        }}
      >
        {matchedBrand.svg(cn(iconSizes[size], 'transition-transform duration-300'))}
      </div>
    );
  }

  // 3. SimpleIcons CDN fallback for known brand slug - clean, borderless, larger!
  if (matchedBrand?.simpleIconSlug && !cdnError) {
    const slug = matchedBrand.simpleIconSlug;
    const cdnUrl = `https://cdn.simpleicons.org/${slug}`;
    return (
      <div
        className={cn(
          'relative shrink-0 flex items-center justify-center bg-transparent border-0 transition-transform duration-300 group-hover:scale-105',
          sizeClasses[size],
          className
        )}
      >
        <img
          src={cdnUrl}
          alt={matchedBrand.name}
          className={cn(iconSizes[size], 'object-contain filter dark:brightness-110')}
          onError={() => setCdnError(true)}
          loading="lazy"
        />
      </div>
    );
  }

  // 4. High-Res Domain Favicon / Logo (e.g. Trendyol, Migros, Hepsiburada, Arçelik) - clean, larger, no outer circle!
  if (matchedBrand?.domain && !domainError) {
    const domainFavicon = getDomainFaviconUrl(matchedBrand.domain);
    return (
      <div
        className={cn(
          'relative shrink-0 flex items-center justify-center bg-transparent border-0 transition-transform duration-300 group-hover:scale-105',
          sizeClasses[size],
          className
        )}
      >
        <img
          src={domainFavicon}
          alt={matchedBrand.name}
          className={cn(iconSizes[size], 'object-contain rounded-lg shadow-sm')}
          onError={() => setDomainError(true)}
          loading="lazy"
        />
      </div>
    );
  }

  // 5. Category-Based Intelligent Icon Fallback - clean, borderless!
  const CategoryIcon = getCategoryFallbackIcon(name, brand);

  return (
    <div
      className={cn(
        'relative shrink-0 flex items-center justify-center bg-transparent border-0 transition-transform duration-300 group-hover:scale-105',
        sizeClasses[size],
        className
      )}
    >
      <CategoryIcon className={cn(iconSizes[size], 'text-secondary/80 group-hover:text-accent transition-colors duration-300')} />
    </div>
  );
};

/**
 * Live Brand Badge Preview for input fields - clean, borderless
 */
export const LiveBrandBadge: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
  const matched = findBrand(text);
  if (!matched || !text || text.trim().length < 2) return null;

  return (
    <div className={cn("inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-surface border border-border/50 shadow-soft text-xs font-semibold text-primary animate-scale-in", className)}>
      <BrandAvatar name={matched.name} size="sm" className="w-5 h-5" />
      <span>{matched.name}</span>
    </div>
  );
};

export default BrandAvatar;
