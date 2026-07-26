import React, { useState } from 'react';
import { Bookmark, Search, Plus, ExternalLink, Globe } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { VaultStorageService } from '../../services/vaultStorage';
import { BookmarkItem } from '../../types';
import { formatDate } from '../../lib/utils';
import { motion } from 'framer-motion';

export interface BookmarksScreenProps {
  onOpenAdd: () => void;
}

export const BookmarksScreen: React.FC<BookmarksScreenProps> = ({ onOpenAdd }) => {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => VaultStorageService.getBookmarks());
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = bookmarks.filter(b =>
    !searchQuery || b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-[-0.02em]">Bookmarks</h1>
          <p className="text-sm text-secondary mt-0.5">{bookmarks.length} saved links</p>
        </div>
        <Button variant="secondary" size="sm" icon={<Plus className="w-3.5 h-3.5" />} onClick={onOpenAdd}>
          Add
        </Button>
      </div>

      <Input
        placeholder="Search bookmarks..."
        icon={<Search className="w-4 h-4" />}
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((bm, i) => (
          <motion.div
            key={bm.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.14, delay: i * 0.04 }}
          >
            <Card padding="none" className="overflow-hidden flex flex-col group border-border/80">
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
                  Open <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
