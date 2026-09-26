import React from 'react';
import {
  FilePdf,
  FileDoc,
  FileImage,
  FileText,
  FileCode,
  File,
} from '@phosphor-icons/react';

export interface AppleFileIconProps {
  fileType: 'pdf' | 'img' | 'doc' | string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
}

export const AppleFileIcon: React.FC<AppleFileIconProps> = ({
  fileType,
  size = 'md',
  className = '',
}) => {
  const type = fileType.toLowerCase();

  const getTheme = () => {
    switch (type) {
      case 'pdf':
        return {
          label: 'PDF',
          color: '#FF3B30',
          textColor: 'text-rose-500 dark:text-rose-400',
          Icon: FilePdf,
        };
      case 'doc':
      case 'docx':
      case 'word':
        return {
          label: 'DOC',
          color: '#007AFF',
          textColor: 'text-blue-500 dark:text-blue-400',
          Icon: FileDoc,
        };
      case 'img':
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'heic':
        return {
          label: 'IMG',
          color: '#34C759',
          textColor: 'text-emerald-500 dark:text-emerald-400',
          Icon: FileImage,
        };
      default:
        return {
          label: type.toUpperCase() || 'FILE',
          color: '#8E8E93',
          textColor: 'text-zinc-500 dark:text-zinc-400',
          Icon: FileText,
        };
    }
  };

  const theme = getTheme();
  const IconComponent = theme.Icon;

  // Small size for list rows: Completely unboxed, pure vector glyph
  if (size === 'sm') {
    return (
      <div className={`shrink-0 flex items-center justify-center ${className}`}>
        <IconComponent
          weight="duotone"
          className={`w-6 h-6 ${theme.textColor} transition-transform duration-200 group-hover:scale-105`}
        />
      </div>
    );
  }

  // Hero size for grid cards & QuickLook: Clean, airy vector emblem without boxed containers
  return (
    <div className={`select-none flex flex-col items-center justify-center gap-2.5 ${className}`}>
      <IconComponent
        weight="duotone"
        className={`w-14 h-14 ${theme.textColor} transition-transform duration-300 group-hover:scale-105`}
      />
      <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-secondary/60">
        {theme.label}
      </span>
    </div>
  );
};
