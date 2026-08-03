import React, { useState } from 'react';
import { StickyNote, Search, Plus, Pin, Trash2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { VaultStorageService } from '../../services/vaultStorage';
import { NoteItem } from '../../types';
import { formatDate } from '../../lib/utils';
import { motion } from 'framer-motion';
import { useToast } from '../../components/ui/Toast';

export interface NotesScreenProps {
  onOpenAdd: () => void;
  selectedItemId?: string;
}

export const NotesScreen: React.FC<NotesScreenProps> = ({ onOpenAdd, selectedItemId }) => {
  const [notes, setNotes] = useState<NoteItem[]>(() => VaultStorageService.getNotes());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNote, setSelectedNote] = useState<NoteItem | null>(() => {
    if (selectedItemId) {
      const list = VaultStorageService.getNotes();
      return list.find(n => n.id === selectedItemId) || null;
    }
    return null;
  });
  const { showToast } = useToast();

  const filtered = notes.filter(n =>
    !searchQuery || n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinned = filtered.filter(n => n.isPinned);
  const unpinned = filtered.filter(n => !n.isPinned);

  const handleDelete = (id: string) => {
    VaultStorageService.deleteNote(id);
    setNotes(VaultStorageService.getNotes());
    setSelectedNote(null);
    showToast('Not silindi.');
  };

  const NoteCard = ({ note, index }: { note: NoteItem; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.05,
        ease: [0.16, 1, 0.3, 1]
      }}
    >
      <Card
        interactive
        onClick={() => setSelectedNote(note)}
        className="flex flex-col justify-between space-y-6 group h-full p-8 border-border/60"
      >
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-bold text-primary tracking-tight leading-snug group-hover:text-accent transition-colors">{note.title}</h3>
            {note.isPinned && (
              <div className="w-8 h-8 rounded-xl bg-accent/5 flex items-center justify-center shrink-0">
                <Pin className="w-4 h-4 text-accent" />
              </div>
            )}
          </div>
          <p className="text-sm text-secondary/80 leading-relaxed line-clamp-4 whitespace-pre-line font-medium">{note.content}</p>
        </div>
        <div className="flex items-center justify-between pt-6 border-t border-border/40">
          <div className="flex gap-2">
            {note.tags.slice(0, 2).map(t => (
              <Badge key={t} variant="muted" size="xs" className="opacity-70">{t}</Badge>
            ))}
          </div>
          <span className="text-[11px] font-bold text-secondary uppercase tracking-widest opacity-40">{formatDate(note.updatedAt)}</span>
        </div>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-primary tracking-tight">Notlar</h1>
          <p className="text-lg text-secondary font-medium">{notes.length} önemli kayıt</p>
        </div>
        <Button variant="primary" size="md" className="rounded-full px-6" icon={<Plus className="w-4 h-4" />} onClick={onOpenAdd}>
          Ekle
        </Button>
      </div>

      <div className="max-w-md">
        <Input
          placeholder="Notlarda ara..."
          aria-label="Notlarda ara"
          className="rounded-2xl bg-surface/40 border-border/60 h-12"
          icon={<Search className="w-4 h-4 opacity-40" />}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {pinned.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-secondary uppercase tracking-widest px-1 opacity-60">Sabitlenenler</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {pinned.map((note, i) => <NoteCard key={note.id} note={note} index={i} />)}
          </div>
        </div>
      )}

      {unpinned.length > 0 && (
        <div className="space-y-4">
          {pinned.length > 0 && <h2 className="text-xs font-bold text-secondary uppercase tracking-widest px-1 opacity-60">Diğer Notlar</h2>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {unpinned.map((note, i) => <NoteCard key={note.id} note={note} index={i} />)}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="py-24 text-center space-y-6">
          <div className="w-20 h-20 rounded-[2.5rem] bg-surface border border-border flex items-center justify-center mx-auto shadow-soft">
            <StickyNote className="w-10 h-10 text-secondary opacity-40" />
          </div>
          <div className="max-w-xs mx-auto">
            <p className="text-lg font-bold text-primary">Henüz not yok</p>
            <p className="text-sm text-secondary mt-2 leading-relaxed">Önemli kodları, kişisel bilgileri ve aklınıza gelen fikirleri güvenle not edin.</p>
          </div>
          <Button variant="primary" size="md" className="rounded-full px-8" onClick={onOpenAdd}>Yeni not oluştur</Button>
        </div>
      )}

      {/* Note Reader Modal */}
      <Modal
        isOpen={!!selectedNote}
        onClose={() => setSelectedNote(null)}
        title={selectedNote?.title}
        subtitle={selectedNote ? `Güncellendi: ${formatDate(selectedNote.updatedAt)}` : ''}
        maxWidth="md"
      >
        {selectedNote && (
          <div className="space-y-4">
            <div className="bg-surface rounded-xl border border-border p-4 text-sm text-primary leading-relaxed whitespace-pre-line min-h-[120px] max-h-[360px] overflow-y-auto thin-scrollbar font-mono">
              {selectedNote.content}
            </div>
            {selectedNote.tags.length > 0 && (
              <div className="flex gap-1.5 flex-wrap">
                {selectedNote.tags.map(t => <Badge key={t} variant="outline" size="xs">{t}</Badge>)}
              </div>
            )}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                icon={<Trash2 className="w-3.5 h-3.5" />}
                onClick={() => handleDelete(selectedNote.id)}
                className="text-danger hover:text-danger hover:bg-danger-muted"
              >
                Sil
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setSelectedNote(null)}>Tamam</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
