import React, { useState } from 'react';
import { Bookmark, Search, Plus, ExternalLink, Globe } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
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
    <div className="space-y-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-[-0.02em]">Yer İmleri</h1>
          <p className="text-sm text-secondary mt-0.5">{bookmarks.length} kayıtlı bağlantı</p>
        </div>
        <Button variant="secondary" size="sm" icon={<Plus className="w-3.5 h-3.5" />} onClick={onOpenAdd}>
          Ekle
        </Button>
      </div>

      <Input
        placeholder="Yer imlerinde ara..."
        icon={<Search className="w-4 h-4" />}
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />

      {filtered.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center mx-auto">
            <Bookmark className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <p className="text-sm font-medium text-primary">Henüz yer imi yok.</p>
            <p className="text-xs text-secondary mt-1">Önemli kaynakları, resmi portalları veya referans linklerini saklayın.</p>
          </div>
          <Button variant="secondary" size="sm" onClick={onOpenAdd}>Yer imi ekle</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((bm, i) => (
            <motion.div
              key={bm.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.3, 
                delay: i * 0.04,
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
                    className="flex items-center justify-center gap-1.5 w-full py-2 text-xs font-medium text-secondary bg-surface hover:bg-surface-elevated border border-border rounded-lg transition-all duration-100"
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
