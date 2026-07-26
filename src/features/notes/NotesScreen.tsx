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

export interface NotesScreenProps {
  onOpenAdd: () => void;
}

export const NotesScreen: React.FC<NotesScreenProps> = ({ onOpenAdd }) => {
  const [notes, setNotes] = useState<NoteItem[]>(() => VaultStorageService.getNotes());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNote, setSelectedNote] = useState<NoteItem | null>(null);

  const filtered = notes.filter(n =>
    !searchQuery || n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinned = filtered.filter(n => n.isPinned);
  const unpinned = filtered.filter(n => !n.isPinned);

  const handleDelete = (id: string) => {
    VaultStorageService.deleteNote(id);
    setNotes(VaultStorageService.getNotes());
    setSelectedNote(null);
  };

  const NoteCard = ({ note, index }: { note: NoteItem; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.14, delay: index * 0.03 }}
    >
      <Card
        interactive
        onClick={() => setSelectedNote(note)}
        className="flex flex-col justify-between space-y-3 group h-full"
      >
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium text-primary leading-snug line-clamp-1">{note.title}</p>
            {note.isPinned && <Pin className="w-3 h-3 text-accent shrink-0 mt-0.5" />}
          </div>
          <p className="text-xs text-secondary leading-relaxed line-clamp-3 whitespace-pre-line">{note.content}</p>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-border-subtle">
          <div className="flex gap-1">
            {note.tags.slice(0, 2).map(t => (
              <Badge key={t} variant="outline" size="xs">{t}</Badge>
            ))}
          </div>
          <span className="text-[10px] text-secondary/60">{formatDate(note.updatedAt)}</span>
        </div>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-[-0.02em]">Notes</h1>
          <p className="text-sm text-secondary mt-0.5">{notes.length} notes</p>
        </div>
        <Button variant="secondary" size="sm" icon={<Plus className="w-3.5 h-3.5" />} onClick={onOpenAdd}>
          New note
        </Button>
      </div>

      <Input
        placeholder="Search notes..."
        icon={<Search className="w-4 h-4" />}
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />

      {pinned.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-secondary px-0.5">Pinned</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pinned.map((note, i) => <NoteCard key={note.id} note={note} index={i} />)}
          </div>
        </div>
      )}

      {unpinned.length > 0 && (
        <div className="space-y-2">
          {pinned.length > 0 && <p className="text-xs font-medium text-secondary px-0.5">All notes</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {unpinned.map((note, i) => <NoteCard key={note.id} note={note} index={i} />)}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="py-16 text-center space-y-3">
          <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center mx-auto">
            <StickyNote className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <p className="text-sm font-medium text-primary">No notes yet.</p>
            <p className="text-xs text-secondary mt-1">Capture important codes, contacts, and information.</p>
          </div>
          <Button variant="secondary" size="sm" onClick={onOpenAdd}>New note</Button>
        </div>
      )}

      {/* Note Reader Modal */}
      <Modal
        isOpen={!!selectedNote}
        onClose={() => setSelectedNote(null)}
        title={selectedNote?.title}
        subtitle={selectedNote ? `Updated ${formatDate(selectedNote.updatedAt)}` : ''}
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
                Delete
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setSelectedNote(null)}>Done</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
