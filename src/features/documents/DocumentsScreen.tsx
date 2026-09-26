import React, { useState, useMemo } from 'react';
import {
  FileText,
  Plus,
  X,
} from 'lucide-react';
import {
  Star,
  MagnifyingGlass,
  SquaresFour,
  Rows,
  HardDrives,
  CaretRight,
} from '@phosphor-icons/react';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { AppleFileIcon } from '../../components/ui/AppleFileIcon';
import { VaultStorageService } from '../../services/vaultStorage';
import { DocumentItem, DOCUMENT_CATEGORY_LABELS } from '../../types';
import { formatDate } from '../../lib/utils';
import { DocumentDetailModal } from './DocumentDetailModal';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../components/ui/Toast';

const CATEGORIES = [
  { value: 'all', label: 'Hepsi' },
  { value: 'Identity', label: 'Kimlik' },
  { value: 'Property', label: 'Mülk' },
  { value: 'Vehicle', label: 'Araç' },
  { value: 'Health', label: 'Sağlık' },
  { value: 'Finance', label: 'Finans' },
  { value: 'Insurance', label: 'Sigorta' },
  { value: 'Work', label: 'İş' },
  { value: 'Personal', label: 'Kişisel' },
] as const;

export interface DocumentsScreenProps {
  onOpenAdd: () => void;
  selectedItemId?: string;
}

export const DocumentsScreen: React.FC<DocumentsScreenProps> = ({ onOpenAdd, selectedItemId }) => {
  const [documents, setDocuments] = useState<DocumentItem[]>(() => VaultStorageService.getDocuments());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterFavoritesOnly, setFilterFavoritesOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    return (localStorage.getItem('kapsule_docs_view') as 'grid' | 'list') || 'grid';
  });

  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(() => {
    if (selectedItemId) {
      const list = VaultStorageService.getDocuments();
      return list.find(d => d.id === selectedItemId) || null;
    }
    return null;
  });

  const { showToast } = useToast();

  const handleToggleViewMode = (mode: 'grid' | 'list') => {
    setViewMode(mode);
    localStorage.setItem('kapsule_docs_view', mode);
  };

  const reloadDocuments = () => {
    setDocuments(VaultStorageService.getDocuments());
  };

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return documents.filter(doc => {
      if (doc.isArchived) return false;
      const matchQ =
        !q ||
        doc.title.toLowerCase().includes(q) ||
        doc.tags.some(t => t.toLowerCase().includes(q)) ||
        (doc.ocrText && doc.ocrText.toLowerCase().includes(q));

      const matchC = selectedCategory === 'all' || doc.category === selectedCategory;
      const matchFav = !filterFavoritesOnly || doc.isFavorite;

      return matchQ && matchC && matchFav;
    });
  }, [documents, searchQuery, selectedCategory, filterFavoritesOnly]);

  const handleToggleFavorite = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const updated = VaultStorageService.toggleFavoriteDocument(id);
    reloadDocuments();
    if (selectedDoc?.id === id && updated) {
      setSelectedDoc({ ...selectedDoc, isFavorite: updated.isFavorite });
    }
    showToast(updated?.isFavorite ? 'Belge favorilere eklendi.' : 'Belge favorilerden çıkarıldı.');
  };

  const handleDelete = (id: string) => {
    VaultStorageService.deleteDocument(id);
    reloadDocuments();
    setSelectedDoc(null);
    showToast('Belge silindi.');
  };

  const totalSize = useMemo(() => {
    return documents.reduce((acc, d) => {
      const size = parseFloat(d.fileSize) || 0;
      return acc + size;
    }, 0);
  }, [documents]);

  const favoritesCount = useMemo(() => {
    return documents.filter(d => d.isFavorite && !d.isArchived).length;
  }, [documents]);

  const storagePercentage = Math.min((totalSize / 2048) * 100, 100);

  return (
    <div className="space-y-7 max-w-5xl">
      {/* ─── Apple iOS Top Bar ─── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary tracking-tight">Belgeler</h1>
          <p className="text-sm text-secondary font-normal">
            {documents.length === 0 ? 'Arşivde kayıt bulunmuyor' : `${documents.length} arşivlenmiş kayıt`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Segmented Control */}
          <div className="p-1 rounded-xl bg-surface-elevated/70 dark:bg-zinc-800/40 border border-border/40 flex items-center gap-0.5">
            <button
              onClick={() => handleToggleViewMode('grid')}
              aria-label="Galeri Görünümü"
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-zinc-700 text-primary shadow-xs'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              <SquaresFour weight={viewMode === 'grid' ? 'bold' : 'regular'} className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleToggleViewMode('list')}
              aria-label="Liste Görünümü"
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-zinc-700 text-primary shadow-xs'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              <Rows weight={viewMode === 'list' ? 'bold' : 'regular'} className="w-4 h-4" />
            </button>
          </div>

          {/* New Document Button */}
          <Button
            variant="primary"
            size="md"
            className="rounded-full px-5 h-10 font-semibold active:scale-[0.98] transition-transform"
            icon={<Plus className="w-4 h-4 stroke-[2.2]" />}
            onClick={onOpenAdd}
          >
            Belge Ekle
          </Button>
        </div>
      </div>

      {/* ─── Apple-style Integrated Storage & Quick Status Strip (Unboxed icons) ─── */}
      <div className="p-4 rounded-2xl bg-surface/50 dark:bg-zinc-900/40 border border-border/40 backdrop-blur-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 flex-1 min-w-0">
          <HardDrives weight="duotone" className="w-5 h-5 text-accent shrink-0" />
          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-primary tracking-tight">Kasa Depolama</span>
              <span className="text-secondary/80 font-mono text-[11px] tabular-nums">
                {totalSize.toFixed(1)} MB / 2.0 GB
              </span>
            </div>
            <div className="w-full bg-border/30 h-1.5 rounded-full overflow-hidden">
              <div
                style={{ width: `${Math.max(storagePercentage, 1)}%` }}
                className="bg-accent h-full rounded-full transition-all duration-500 ease-out"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/30">
          <button
            onClick={() => setFilterFavoritesOnly(prev => !prev)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all active:scale-[0.97] flex items-center gap-1.5 ${
              filterFavoritesOnly
                ? 'border-amber-500/40 bg-amber-500/10 text-amber-500 dark:text-amber-400'
                : 'border-border/40 bg-surface-elevated/40 text-secondary hover:text-primary'
            }`}
          >
            <Star weight={filterFavoritesOnly ? 'fill' : 'regular'} className={`w-3.5 h-3.5 ${filterFavoritesOnly ? 'text-amber-500' : ''}`} />
            <span>Favoriler ({favoritesCount})</span>
          </button>
        </div>
      </div>

      {/* ─── Search Field ─── */}
      <div className="relative">
        <MagnifyingGlass weight="bold" className="w-4 h-4 text-secondary/60 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Belge adı, etiket veya taranan metin ara..."
          aria-label="Belgelerde ara"
          className="w-full h-11 pl-10 pr-9 rounded-xl bg-surface-elevated/60 dark:bg-zinc-900/60 border border-border/40 text-primary text-sm placeholder:text-secondary/50 focus:outline-none focus:border-accent/80 transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary/50 hover:text-primary p-1"
            aria-label="Aramayı temizle"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* ─── Apple Segmented Control Category Filter ─── */}
      <div className="p-1 rounded-xl bg-surface-elevated/70 dark:bg-zinc-800/40 border border-border/40 flex items-center gap-1 overflow-x-auto no-scrollbar">
        {CATEGORIES.map(cat => {
          const isActive = selectedCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`shrink-0 px-3.5 py-1.5 rounded-lg text-xs transition-colors ${
                isActive
                  ? 'bg-white dark:bg-zinc-700 text-primary font-semibold shadow-xs'
                  : 'text-secondary hover:text-primary font-medium'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* ─── Main Documents Content with Silky Smooth Transitions ─── */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<FileText className="w-8 h-8 text-secondary/50" />}
          title={searchQuery || selectedCategory !== 'all' ? 'Eşleşen belge bulunamadı' : 'Henüz belge yok'}
          description={
            searchQuery || selectedCategory !== 'all'
              ? 'Filtreleri veya arama kriterini değiştirerek tekrar deneyebilirsiniz.'
              : 'Kimlik, tapu, araç ruhsatı ve sözleşmelerinizi güvenle kasaya kaydedin.'
          }
          actionLabel={searchQuery || selectedCategory !== 'all' ? 'Filtreleri Sıfırla' : 'Belge Ekle'}
          onAction={
            searchQuery || selectedCategory !== 'all'
              ? () => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setFilterFavoritesOnly(false);
                }
              : onOpenAdd
          }
        />
      ) : (
        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            /* ─── Apple Files Grid Mode ─── */
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {filtered.map((doc, i) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18, delay: Math.min(i * 0.02, 0.1), ease: [0.16, 1, 0.3, 1] }}
                >
                  <div
                    onClick={() => setSelectedDoc(doc)}
                    className="group relative flex flex-col rounded-2xl bg-surface/50 dark:bg-zinc-900/40 hover:bg-surface-elevated/50 dark:hover:bg-zinc-800/40 border border-border/40 hover:border-border/80 transition-all duration-200 cursor-pointer shadow-soft hover:shadow-card overflow-hidden"
                  >
                    {/* Visual Preview Canvas (Unboxed, pure graphic) */}
                    <div className="relative h-44 bg-surface-elevated/30 dark:bg-zinc-950/50 overflow-hidden flex items-center justify-center">
                      {doc.previewUrl && doc.fileType === 'img' ? (
                        <img
                          src={doc.previewUrl}
                          alt={doc.title}
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 ease-out"
                        />
                      ) : (
                        <AppleFileIcon fileType={doc.fileType} size="hero" />
                      )}

                      {/* Favorite Floating Button (Border-free, pure star glyph) */}
                      <div className="absolute top-2.5 right-2.5">
                        <button
                          onClick={e => handleToggleFavorite(doc.id, e)}
                          className="p-1.5 text-secondary/50 hover:text-amber-400 active:scale-90 transition-transform"
                          aria-label={doc.isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
                        >
                          <Star
                            weight={doc.isFavorite ? 'fill' : 'regular'}
                            className={`w-4 h-4 transition-colors ${doc.isFavorite ? 'text-amber-400' : ''}`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Card Info */}
                    <div className="p-4 space-y-2">
                      <h4 className="text-[15px] font-semibold text-primary tracking-tight truncate group-hover:text-accent transition-colors">
                        {doc.title}
                      </h4>

                      <div className="flex items-center gap-1.5 text-xs text-secondary/70 font-normal">
                        <span>{DOCUMENT_CATEGORY_LABELS[doc.category]}</span>
                        <span className="text-secondary/30">·</span>
                        <span className="uppercase font-mono text-[11px]">{doc.fileType}</span>
                        <span className="text-secondary/30">·</span>
                        <span>{doc.fileSize}</span>
                      </div>

                      <div className="pt-2 border-t border-border/25 flex items-center justify-between text-[11px] text-secondary/50">
                        <span>{formatDate(doc.createdAt)}</span>
                        {doc.tags.length > 0 && (
                          <span className="font-mono text-secondary/40 truncate max-w-[120px]">
                            #{doc.tags[0]}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            /* ─── Apple Files List Mode ─── */
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
              className="bg-surface/50 dark:bg-zinc-900/50 rounded-2xl border border-border/40 overflow-hidden divide-y divide-border/25"
            >
              {filtered.map(doc => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className="group flex items-center justify-between px-5 py-3.5 cursor-pointer hover:bg-surface-elevated/40 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1 pr-4">
                    {/* Pure, Unboxed Vector Icon */}
                    <AppleFileIcon fileType={doc.fileType} size="sm" />

                    <div className="min-w-0 flex-1 space-y-0.5">
                      <h4 className="text-[15px] font-semibold text-primary tracking-tight truncate group-hover:text-accent transition-colors">
                        {doc.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-secondary/70">
                        <span>{DOCUMENT_CATEGORY_LABELS[doc.category]}</span>
                        <span className="text-secondary/30">·</span>
                        <span>{formatDate(doc.createdAt)}</span>
                        {doc.tags.length > 0 && (
                          <>
                            <span className="text-secondary/30">·</span>
                            <span className="font-mono text-secondary/50">#{doc.tags[0]}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-mono text-secondary/60 tabular-nums">
                      {doc.fileSize}
                    </span>

                    <button
                      onClick={e => handleToggleFavorite(doc.id, e)}
                      className="p-1 text-secondary/40 hover:text-amber-400 active:scale-90 transition-transform"
                      aria-label={doc.isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
                    >
                      <Star
                        weight={doc.isFavorite ? 'fill' : 'regular'}
                        className={`w-4 h-4 transition-colors ${doc.isFavorite ? 'text-amber-400' : ''}`}
                      />
                    </button>

                    <CaretRight weight="bold" className="w-3.5 h-3.5 text-secondary/30" />
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* ─── Document Detail Quick Look Modal ─── */}
      <DocumentDetailModal
        document={selectedDoc}
        isOpen={!!selectedDoc}
        onClose={() => setSelectedDoc(null)}
        onToggleFavorite={handleToggleFavorite}
        onDelete={handleDelete}
      />
    </div>
  );
};
