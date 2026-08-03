import React from 'react';
import { Bookmark, Globe, ExternalLink, Calendar, Trash2 } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { BookmarkItem } from '../../types';
import { formatDate } from '../../lib/utils';
import { useToast } from '../../components/ui/Toast';

export interface BookmarkDetailModalProps {
  bookmark: BookmarkItem | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export const BookmarkDetailModal: React.FC<BookmarkDetailModalProps> = ({
  bookmark,
  isOpen,
  onClose,
  onDelete,
}) => {
  const { showToast } = useToast();

  if (!bookmark) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={bookmark.title}
      subtitle={bookmark.domain}
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* Preview image */}
        {bookmark.previewUrl && (
          <div className="w-full h-44 rounded-xl overflow-hidden border border-border bg-surface">
            <img src={bookmark.previewUrl} alt={bookmark.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* URL panel */}
        <div className="flex items-center justify-between p-4 bg-surface rounded-xl border border-border">
          <div className="flex items-center gap-2 min-w-0">
            <Globe className="w-4 h-4 text-secondary shrink-0" />
            <span className="text-xs text-primary font-mono truncate">{bookmark.url}</span>
          </div>
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent/80 shrink-0 ml-3"
            aria-label={`${bookmark.title} bağlantısını yeni sekmede aç`}
          >
            Aç <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Date saved */}
        <div className="flex justify-between items-center text-xs p-3 bg-surface rounded-xl border border-border">
          <span className="text-secondary flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-secondary/60" /> Kaydedildi
          </span>
          <span className="font-semibold text-primary">{formatDate(bookmark.savedAt)}</span>
        </div>

        {/* Description */}
        {bookmark.description && (
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-secondary">Açıklama</p>
            <p className="text-sm text-primary leading-relaxed bg-surface px-4 py-3 rounded-xl border border-border">
              {bookmark.description}
            </p>
          </div>
        )}

        {/* Tags */}
        {bookmark.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {bookmark.tags.map(tag => (
              <Badge key={tag} variant="outline" size="xs">{tag}</Badge>
            ))}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            icon={<Trash2 className="w-3.5 h-3.5" />}
            onClick={() => { onDelete(bookmark.id); onClose(); showToast('Yer imi silindi.'); }}
            className="text-danger hover:text-danger hover:bg-danger-muted"
          >
            Sil
          </Button>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Tamam
          </Button>
        </div>
      </div>
    </Modal>
  );
};
