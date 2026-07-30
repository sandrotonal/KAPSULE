import React, { useState } from 'react';
import { FileText, Search, Plus, Star, Filter, Database } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { VaultStorageService } from '../../services/vaultStorage';
import { DocumentItem } from '../../types';
import { formatDate } from '../../lib/utils';
import { DocumentDetailModal } from './DocumentDetailModal';
import { motion } from 'framer-motion';

const CATEGORIES = ['Hepsi', 'Kimlik', 'Mülk', 'Araç', 'Sağlık', 'Finans', 'Sigorta'] as const;

export interface DocumentsScreenProps {
  onOpenAdd: () => void;
  selectedItemId?: string;
}

export const DocumentsScreen: React.FC<DocumentsScreenProps> = ({ onOpenAdd, selectedItemId }) => {
  const [documents, setDocuments] = useState<DocumentItem[]>(() => VaultStorageService.getDocuments());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Hepsi');
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(() => {
    if (selectedItemId) {
      const list = VaultStorageService.getDocuments();
      return list.find(d => d.id === selectedItemId) || null;
    }
    return null;
  });

  const filtered = documents.filter(doc => {
    const q = searchQuery.toLowerCase();
    const matchQ = !q || doc.title.toLowerCase().includes(q) || doc.tags.some(t => t.toLowerCase().includes(q));
    const matchC = selectedCategory === 'Hepsi' || doc.category === selectedCategory;
    return matchQ && matchC && !doc.isArchived;
  });

  const handleToggleFavorite = (id: string) => {
    VaultStorageService.toggleFavoriteDocument(id);
    setDocuments(VaultStorageService.getDocuments());
    if (selectedDoc?.id === id) {
      setSelectedDoc(prev => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
    }
  };

  const handleDelete = (id: string) => {
    VaultStorageService.deleteDocument(id);
    setDocuments(VaultStorageService.getDocuments());
    setSelectedDoc(null);
  };

  const totalSize = documents.reduce((acc, d) => {
    const size = parseFloat(d.fileSize) || 0.5; // fallback for mock
    return acc + size;
  }, 0);

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="flex items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-primary tracking-tight">Belgeler</h1>
          <p className="text-lg text-secondary font-medium">
            Arşivinizde {documents.filter(d => !d.isArchived).length} güvenli öğe var
          </p>
        </div>
        <Button variant="primary" size="md" className="rounded-full px-6" icon={<Plus className="w-4 h-4" />} onClick={onOpenAdd}>
          Ekle
        </Button>
      </div>

      {/* Storage Insights */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-3 bg-surface/30 border-border/40 p-6 flex flex-col justify-between gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-secondary/60">
              <Database className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Kasa Depolama</span>
            </div>
            <span className="text-sm font-bold text-primary tabular-nums">{totalSize.toFixed(1)} MB / 2.0 GB</span>
          </div>
          <div className="w-full bg-border/20 h-2 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(totalSize / 2048) * 100}%` }}
              className="bg-accent h-full shadow-[0_0_12px_rgba(0,122,255,0.4)]" 
            />
          </div>
        </Card>
        <Card className="bg-surface/30 border-border/40 p-6 flex flex-col items-center justify-center text-center gap-2">
          <p className="text-4xl font-bold text-primary tracking-tighter">{documents.filter(d => d.isFavorite).length}</p>
          <p className="text-[11px] font-bold text-secondary uppercase tracking-widest opacity-60">Favoriler</p>
        </Card>
      </div>

      {/* Controls */}
      <div className="space-y-6">
        <div className="max-w-md">
          <Input
            placeholder="Belge, etiket veya içerik ara..."
            aria-label="Belgelerde ara"
            className="rounded-2xl bg-surface/40 border-border/60 h-12"
            icon={<Search className="w-4 h-4 opacity-40" />}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 px-5 py-2 rounded-full text-[13px] font-bold transition-all duration-300 ${
                selectedCategory === cat
                  ? 'bg-primary text-primary-foreground shadow-soft'
                  : 'bg-surface/50 text-secondary border border-border/60 hover:text-primary hover:bg-surface-elevated'
              }`}
            >
              {cat === 'Hepsi' ? 'Tüm Belgeler' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="py-24 text-center space-y-6">
          <div className="w-20 h-20 rounded-[2.5rem] bg-surface border border-border flex items-center justify-center mx-auto shadow-soft">
            <FileText className="w-10 h-10 text-secondary opacity-40" />
          </div>
          <div className="max-w-xs mx-auto">
            <p className="text-lg font-bold text-primary">Henüz belge yok</p>
            <p className="text-sm text-secondary mt-2 leading-relaxed">
              Önemli evraklarınızı, poliçelerinizi ve kimliklerinizi güvenle saklayın.
            </p>
          </div>
          <Button variant="primary" size="md" className="rounded-full px-8" onClick={onOpenAdd}>Belge ekle</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((doc, i) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
            >
              <Card
                interactive
                padding="none"
                onClick={() => setSelectedDoc(doc)}
                className="overflow-hidden flex flex-col group h-full border-border/60"
              >
                {/* Image */}
                <div className="relative h-44 bg-surface overflow-hidden">
                  <img
                    src={doc.previewUrl}
                    alt={doc.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={e => { e.stopPropagation(); handleToggleFavorite(doc.id); }}
                      className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-white/20 text-secondary hover:text-amber-500 transition-colors shadow-soft active:scale-90"
                      aria-label={doc.isFavorite ? `${doc.title} favorilerden çıkar` : `${doc.title} favorilere ekle`}
                      aria-pressed={doc.isFavorite}
                    >
                      <Star className={`w-4 h-4 ${doc.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                  <div>
                    <p className="text-base font-bold text-primary line-clamp-1 tracking-tight group-hover:text-accent transition-colors">{doc.title}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="muted" size="xs" className="opacity-70">{doc.category}</Badge>
                      <span className="text-[11px] font-bold text-secondary uppercase tracking-widest opacity-40">{doc.fileType} · {doc.fileSize}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border/40">
                    <span className="text-[12px] font-medium text-secondary/60">{formatDate(doc.createdAt)}</span>
                    <div className="w-6 h-6 rounded-full bg-accent/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 duration-300">
                       <Plus className="w-3 h-3 text-accent rotate-45" />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

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
