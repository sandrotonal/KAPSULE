import React, { useState } from 'react';
import { FileText, Search, Plus, Star, Filter } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { VaultStorageService } from '../../services/vaultStorage';
import { DocumentItem } from '../../types';
import { formatDate } from '../../lib/utils';
import { DocumentDetailModal } from './DocumentDetailModal';
import { motion } from 'framer-motion';

const CATEGORIES = ['All', 'Identity', 'Property', 'Vehicle', 'Health', 'Finance', 'Insurance'] as const;

export interface DocumentsScreenProps {
  onOpenAdd: () => void;
  selectedItemId?: string;
}

export const DocumentsScreen: React.FC<DocumentsScreenProps> = ({ onOpenAdd, selectedItemId }) => {
  const [documents, setDocuments] = useState<DocumentItem[]>(() => VaultStorageService.getDocuments());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
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
    const matchC = selectedCategory === 'All' || doc.category === selectedCategory;
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

  return (
    <div className="space-y-7">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-[-0.02em]">Documents</h1>
          <p className="text-sm text-secondary mt-0.5">
            {documents.filter(d => !d.isArchived).length} items in your archive
          </p>
        </div>
        <Button variant="secondary" size="sm" icon={<Plus className="w-3.5 h-3.5" />} onClick={onOpenAdd}>
          Add
        </Button>
      </div>

      {/* Controls */}
      <div className="space-y-3">
        <Input
          placeholder="Search documents, tags, content..."
          icon={<Search className="w-4 h-4" />}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-100 ${
                selectedCategory === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-surface text-secondary border border-border hover:text-primary hover:bg-surface-elevated'
              }`}
            >
              {cat === 'All' ? 'All documents' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center mx-auto">
            <FileText className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <p className="text-sm font-medium text-primary">No documents yet.</p>
            <p className="text-xs text-secondary mt-1 max-w-xs mx-auto">
              Import your first document to start building your digital archive.
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={onOpenAdd}>Add document</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((doc, i) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, delay: i * 0.03, ease: [0.16, 1, 0.3, 1] }}
            >
              <Card
                interactive
                padding="none"
                onClick={() => setSelectedDoc(doc)}
                className="overflow-hidden flex flex-col group"
              >
                {/* Image */}
                <div className="relative h-32 bg-surface overflow-hidden border-b border-border">
                  <img
                    src={doc.previewUrl}
                    alt={doc.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                    <button
                      onClick={e => { e.stopPropagation(); handleToggleFavorite(doc.id); }}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-background/80 backdrop-blur-md border border-border/60 text-secondary hover:text-primary transition-colors shadow-soft"
                    >
                      <Star className={`w-3.5 h-3.5 ${doc.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 space-y-2.5">
                  <div>
                    <p className="text-sm font-medium text-primary line-clamp-1">{doc.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="muted" size="xs">{doc.category}</Badge>
                      <span className="text-[11px] text-secondary">{doc.fileType.toUpperCase()} · {doc.fileSize}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-secondary/70">{formatDate(doc.createdAt)}</p>
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
