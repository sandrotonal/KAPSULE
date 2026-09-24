import React, { useState } from 'react';
import { Bookmark, Search, Plus, ExternalLink, Globe } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { EmptyState } from '../../components/ui/EmptyState';
import { VaultStorageService } from '../../services/vaultStorage';
import { BookmarkItem } from '../../types';
import { BookmarkDetailModal } from './BookmarkDetailModal';
import { motion } from 'framer-motion';

export interface BookmarksScreenProps {
  onOpenAdd: () => void;
  selectedItemId?: string;
}

export const BookmarksScreen: React.FC<BookmarksScreenProps> = ({
  onOpenAdd,
  selectedItemId,
}) => {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => VaultStorageService.getBookmarks());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookmark, setSelectedBookmark] = useState<BookmarkItem | null>(() => {
    if (selectedItemId) {
      const list = VaultStorageService.getBookmarks();
      return list.find(b => b.id === selectedItemId) || null;
    }
    return null;
  });

  const filtered = bookmarks.filter(b =>
    !searchQuery || b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    VaultStorageService.deleteBookmark(id);
    setBookmarks(VaultStorageService.getBookmarks());
    setSelectedBookmark(null);
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-primary tracking-tight">Yer İmleri</h1>
          <p className="text-lg text-secondary font-medium">{bookmarks.length} kayıtlı bağlantı</p>
        </div>
        <Button variant="primary" size="md" className="rounded-full px-6" icon={<Plus className="w-4 h-4" />} onClick={onOpenAdd}>
          Ekle
        </Button>
      </div>

      <div className="max-w-md">
        <Input
          placeholder="Yer imlerinde ara..."
          aria-label="Yer imlerinde ara"
          className="rounded-2xl bg-surface/40 border-border/60 h-12"
          icon={<Search className="w-4 h-4 opacity-40" />}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Bookmark className="w-8 h-8 text-secondary opacity-60" />}
          title="Henüz yer imi yok"
          description="Önemli kaynakları, resmi portalları veya referans linklerini güvenle saklayın."
          actionLabel="Yer imi ekle"
          onAction={onOpenAdd}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((bm, i) => (
            <motion.div
              key={bm.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.22, 
                delay: Math.min(i * 0.02, 0.12),
                ease: [0.16, 1, 0.3, 1]
              }}
            >
              <Card
                interactive
                padding="none"
                onClick={() => setSelectedBookmark(bm)}
                className="overflow-hidden flex flex-col group border-border/80 h-full"
              >
                {/* Preview */}
                {bm.previewUrl && (
                  <div className="h-28 overflow-hidden border-b border-border">
                    <img src={bm.previewUrl} alt={bm.title} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300" />
                  </div>
                )}
                <div className="p-4 space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-secondary/60 shrink-0" />
                    <span className="text-[11px] text-secondary truncate">{bm.domain}</span>
                  </div>
                  <p className="text-sm font-medium text-primary line-clamp-1">{bm.title}</p>
                  {bm.description && (
                    <p className="text-xs text-secondary line-clamp-2 leading-relaxed">{bm.description}</p>
                  )}
                </div>
                <div className="px-4 pb-4">
                  <a
                    href={bm.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="flex items-center justify-center gap-1.5 w-full min-h-[44px] py-2 text-xs font-medium text-secondary bg-surface hover:bg-surface-elevated border border-border rounded-xl transition-all duration-100"
                    aria-label={`${bm.title} bağlantısını yeni sekmede aç`}
                  >
                    Aç <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <BookmarkDetailModal
        bookmark={selectedBookmark}
        isOpen={!!selectedBookmark}
        onClose={() => setSelectedBookmark(null)}
        onDelete={handleDelete}
      />
    </div>
  );
};
