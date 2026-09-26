import React, { useState, useMemo, useRef } from 'react';
import { Plus, X } from 'lucide-react';
import {
  PushPin,
  PencilSimple,
  Copy,
  Check,
  Trash,
  SquaresFour,
  Rows,
  MagnifyingGlass,
  Clock,
  FloppyDisk,
  CaretRight,
  Note as NoteIcon,
} from '@phosphor-icons/react';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import { VaultStorageService } from '../../services/vaultStorage';
import { NoteItem } from '../../types';
import { formatDate } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../components/ui/Toast';

export interface NotesScreenProps {
  onOpenAdd: () => void;
  selectedItemId?: string;
}

export const NotesScreen: React.FC<NotesScreenProps> = ({ onOpenAdd, selectedItemId }) => {
  const [notes, setNotes] = useState<NoteItem[]>(() => VaultStorageService.getNotes());
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>(() => {
    return (localStorage.getItem('kapsule_notes_view') as 'list' | 'grid') || 'list';
  });
  const [filterPinnedOnly, setFilterPinnedOnly] = useState(false);
  const [selectedNote, setSelectedNote] = useState<NoteItem | null>(() => {
    if (selectedItemId) {
      const list = VaultStorageService.getNotes();
      return list.find(n => n.id === selectedItemId) || null;
    }
    return null;
  });

  // Retain note content during modal closing exit animation
  const activeNoteRef = useRef<NoteItem | null>(selectedNote);
  if (selectedNote) {
    activeNoteRef.current = selectedNote;
  }
  const displayNote = selectedNote || activeNoteRef.current;

  // Note editor/reader state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditTags] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { showToast } = useToast();

  const handleToggleViewMode = (mode: 'list' | 'grid') => {
    setViewMode(mode);
    localStorage.setItem('kapsule_notes_view', mode);
  };

  const reloadNotes = () => {
    setNotes(VaultStorageService.getNotes());
  };

  const filteredNotes = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return notes.filter(n => {
      const matchSearch =
        !q ||
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.tags.some(t => t.toLowerCase().includes(q));

      const matchPinned = !filterPinnedOnly || n.isPinned;
      return matchSearch && matchPinned;
    });
  }, [notes, searchQuery, filterPinnedOnly]);

  const pinnedNotes = useMemo(() => filteredNotes.filter(n => n.isPinned), [filteredNotes]);
  const regularNotes = useMemo(() => filteredNotes.filter(n => !n.isPinned), [filteredNotes]);

  const handleTogglePin = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const updated = VaultStorageService.togglePinNote(id);
    reloadNotes();
    if (selectedNote && selectedNote.id === id && updated) {
      setSelectedNote({ ...selectedNote, isPinned: updated.isPinned });
    }
    showToast(updated?.isPinned ? 'Not sabitlendi.' : 'Sabitleme kaldırıldı.');
  };

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    VaultStorageService.deleteNote(id);
    reloadNotes();
    if (selectedNote?.id === id) {
      setSelectedNote(null);
      setIsEditing(false);
    }
    showToast('Not silindi.');
  };

  const handleCopyContent = (note: NoteItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const textToCopy = `${note.title}\n\n${note.content}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(note.id);
    setTimeout(() => setCopiedId(null), 1800);
    showToast('Not panoya kopyalandı.');
  };

  const handleOpenNote = (note: NoteItem) => {
    setSelectedNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditTags(note.tags.join(', '));
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    if (!selectedNote) return;
    const title = editTitle.trim();
    if (!title) {
      showToast('Not başlığı boş bırakılamaz.');
      return;
    }

    const tagsArray = editTags
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const updated = VaultStorageService.saveNote({
      id: selectedNote.id,
      title,
      content: editContent.trim(),
      tags: tagsArray,
      isPinned: selectedNote.isPinned,
    });

    reloadNotes();
    setSelectedNote(updated);
    setIsEditing(false);
    showToast('Değişiklikler kaydedildi.');
  };

  const formatShortDate = (dateStr: string): string => {
    try {
      const d = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        return d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
      } else if (diffDays === 1) {
        return 'Dün';
      } else if (diffDays < 7) {
        return d.toLocaleDateString('tr-TR', { weekday: 'short' });
      }
      return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
    } catch {
      return formatDate(dateStr);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* ─── Apple iOS Top Bar ─── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary tracking-tight">Notlar</h1>
          <p className="text-sm text-secondary font-normal">
            {notes.length === 0 ? 'Kayıtlı not bulunmuyor' : `${notes.length} kayıtlı not`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Segmented Control */}
          <div className="p-1 rounded-xl bg-surface-elevated/70 dark:bg-zinc-800/40 border border-border/40 flex items-center gap-0.5">
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
          </div>

          {/* New Note Button */}
          <Button
            variant="primary"
            size="md"
            className="rounded-full px-5 h-10 font-semibold"
            icon={<Plus className="w-4 h-4 stroke-[2.2]" />}
            onClick={onOpenAdd}
          >
            Yeni Not
          </Button>
        </div>
      </div>

      {/* ─── Apple iOS Search & Quiet Filter Bar ─── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <MagnifyingGlass weight="bold" className="w-4 h-4 text-secondary/60 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Notlarda, başlıklarda veya etiketlerde ara..."
            aria-label="Notlarda ara"
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

        {pinnedNotes.length > 0 && (
          <button
            onClick={() => setFilterPinnedOnly(prev => !prev)}
            className={`h-11 px-4 rounded-xl border text-xs font-medium transition-colors flex items-center gap-2 shrink-0 ${
              filterPinnedOnly
                ? 'border-amber-500/40 bg-amber-500/10 text-amber-500 dark:text-amber-400'
                : 'border-border/40 bg-surface-elevated/40 text-secondary hover:text-primary'
            }`}
          >
            <PushPin weight={filterPinnedOnly ? 'fill' : 'regular'} className={`w-3.5 h-3.5 ${filterPinnedOnly ? 'text-amber-500' : ''}`} />
            <span>Sabitlenenler ({notes.filter(n => n.isPinned).length})</span>
          </button>
        )}
      </div>

      {/* ─── Main Notes Content ─── */}
      {filteredNotes.length === 0 ? (
        <EmptyState
          icon={<NoteIcon weight="duotone" className="w-8 h-8 text-secondary/50" />}
          title={searchQuery ? 'Aramayla eşleşen not bulunamadı' : 'Henüz not yok'}
          description={
            searchQuery
              ? 'Farklı bir anahtar kelime veya etiket ile tekrar arayabilirsiniz.'
              : 'Önemli fikirleri, şifre ipuçlarını ve günlük kayıtları burada düzenleyin.'
          }
          actionLabel={searchQuery ? 'Aramayı Temizle' : 'Yeni Not Oluştur'}
          onAction={searchQuery ? () => setSearchQuery('') : onOpenAdd}
        />
      ) : (
        <div className="space-y-8">
          {/* PINNED SECTION */}
          {pinnedNotes.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center gap-1.5 px-1">
                <PushPin weight="fill" className="w-3.5 h-3.5 text-amber-500" />
                <h2 className="text-[11px] font-bold text-secondary/70 uppercase tracking-widest">
                  Sabitlenenler · {pinnedNotes.length}
                </h2>
              </div>

              <AnimatePresence mode="wait">
                {viewMode === 'list' ? (
                  <motion.div
                    key="pinned-list"
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -3 }}
                    transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-surface/50 dark:bg-zinc-900/50 rounded-2xl border border-border/40 overflow-hidden divide-y divide-border/25"
                  >
                    {pinnedNotes.map(note => (
                      <NoteListRow
                        key={note.id}
                        note={note}
                        copiedId={copiedId}
                        onSelect={() => handleOpenNote(note)}
                        onTogglePin={e => handleTogglePin(note.id, e)}
                        onCopy={e => handleCopyContent(note, e)}
                        onDelete={e => handleDelete(note.id, e)}
                        formatShortDate={formatShortDate}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="pinned-grid"
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -3 }}
                    transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    {pinnedNotes.map(note => (
                      <NoteGridCard
                        key={note.id}
                        note={note}
                        copiedId={copiedId}
                        onSelect={() => handleOpenNote(note)}
                        onTogglePin={e => handleTogglePin(note.id, e)}
                        onCopy={e => handleCopyContent(note, e)}
                        onDelete={e => handleDelete(note.id, e)}
                        formatShortDate={formatShortDate}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* REGULAR NOTES SECTION */}
          {regularNotes.length > 0 && (
            <div className="space-y-2.5">
              {pinnedNotes.length > 0 && (
                <h2 className="text-[11px] font-bold text-secondary/70 uppercase tracking-widest px-1">
                  Notlar · {regularNotes.length}
                </h2>
              )}

              <AnimatePresence mode="wait">
                {viewMode === 'list' ? (
                  <motion.div
                    key="regular-list"
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -3 }}
                    transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-surface/50 dark:bg-zinc-900/50 rounded-2xl border border-border/40 overflow-hidden divide-y divide-border/25"
                  >
                    {regularNotes.map(note => (
                      <NoteListRow
                        key={note.id}
                        note={note}
                        copiedId={copiedId}
                        onSelect={() => handleOpenNote(note)}
                        onTogglePin={e => handleTogglePin(note.id, e)}
                        onCopy={e => handleCopyContent(note, e)}
                        onDelete={e => handleDelete(note.id, e)}
                        formatShortDate={formatShortDate}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="regular-grid"
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -3 }}
                    transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    {regularNotes.map(note => (
                      <NoteGridCard
                        key={note.id}
                        note={note}
                        copiedId={copiedId}
                        onSelect={() => handleOpenNote(note)}
                        onTogglePin={e => handleTogglePin(note.id, e)}
                        onCopy={e => handleCopyContent(note, e)}
                        onDelete={e => handleDelete(note.id, e)}
                        formatShortDate={formatShortDate}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}

      {/* ─── Apple Notes Interactive Reader & Editor Sheet ─── */}
      <Modal
        isOpen={!!selectedNote}
        onClose={() => {
          setSelectedNote(null);
          setIsEditing(false);
        }}
        title=""
        maxWidth="lg"
      >
        {displayNote && (
          <div className="space-y-5">
            {/* Modal Top Bar: Unboxed Actions */}
            <div className="flex items-center justify-between pb-3 border-b border-border/40">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleTogglePin(displayNote.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    displayNote.isPinned
                      ? 'bg-amber-500/10 text-amber-500 dark:text-amber-400'
                      : 'text-secondary hover:text-primary hover:bg-surface-elevated/50'
                  }`}
                  aria-label={displayNote.isPinned ? 'Sabitlemeyi kaldır' : 'Notu sabitle'}
                >
                  <PushPin weight={displayNote.isPinned ? 'fill' : 'regular'} className="w-3.5 h-3.5" />
                  <span>{displayNote.isPinned ? 'Sabitlendi' : 'Sabitle'}</span>
                </button>

                <button
                  onClick={() => handleCopyContent(displayNote)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-secondary hover:text-primary hover:bg-surface-elevated/50 flex items-center gap-1.5 transition-colors"
                  aria-label="Notu kopyala"
                >
                  {copiedId === displayNote.id ? (
                    <>
                      <Check weight="bold" className="w-3.5 h-3.5 text-success" />
                      <span className="text-success">Kopyalandı</span>
                    </>
                  ) : (
                    <>
                      <Copy weight="regular" className="w-3.5 h-3.5" />
                      <span>Kopyala</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                {isEditing ? (
                  <Button
                    variant="primary"
                    size="sm"
                    className="rounded-full h-8 px-4 font-semibold text-xs"
                    icon={<FloppyDisk weight="bold" className="w-3.5 h-3.5" />}
                    onClick={handleSaveEdit}
                  >
                    Kaydet
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="rounded-full h-8 px-4 font-medium text-xs"
                    icon={<PencilSimple weight="bold" className="w-3.5 h-3.5" />}
                    onClick={() => setIsEditing(true)}
                  >
                    Düzenle
                  </Button>
                )}

                <button
                  onClick={() => handleDelete(displayNote.id)}
                  className="p-1.5 text-secondary/60 hover:text-danger hover:bg-danger-muted rounded-lg transition-colors"
                  aria-label="Notu sil"
                >
                  <Trash weight="regular" className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Note Canvas */}
            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  placeholder="Başlık"
                  className="w-full text-xl font-bold text-primary bg-transparent border-b border-border/40 pb-2 focus:outline-none focus:border-accent"
                />

                <textarea
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                  placeholder="Not içeriğini yazın..."
                  rows={8}
                  className="w-full text-sm text-primary leading-relaxed bg-surface-elevated/30 rounded-xl p-4 border border-border/40 focus:outline-none focus:border-accent resize-none thin-scrollbar"
                />

                <div className="space-y-1">
                  <label className="text-xs text-secondary/60 font-medium">
                    Etiketler (virgülle ayırın)
                  </label>
                  <input
                    type="text"
                    value={editTags}
                    onChange={e => setEditTags(e.target.value)}
                    placeholder="örn. finans, sözleşme, fikirler"
                    className="w-full text-xs text-primary bg-surface-elevated/30 rounded-xl px-3.5 py-2 border border-border/40 focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[12px] text-secondary/50 font-normal">
                    <Clock weight="regular" className="w-3.5 h-3.5" />
                    <span>{formatDate(displayNote.updatedAt)}</span>
                    <span>·</span>
                    <span>{displayNote.content.length} karakter</span>
                  </div>
                  <h3 className="text-2xl font-bold text-primary tracking-tight leading-snug">
                    {displayNote.title}
                  </h3>
                </div>

                <div className="text-[15px] text-primary/90 leading-relaxed whitespace-pre-line select-text font-normal pt-2">
                  {displayNote.content}
                </div>

                {displayNote.tags.length > 0 && (
                  <div className="flex items-center gap-2 pt-4 border-t border-border/20 text-xs text-secondary/60">
                    {displayNote.tags.map((tag: string) => (
                      <span key={tag} className="font-mono hover:text-primary transition-colors">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

// ─── Sub-Component: Apple Notes List Row ───
interface NoteRowProps {
  note: NoteItem;
  copiedId: string | null;
  onSelect: () => void;
  onTogglePin: (e: React.MouseEvent) => void;
  onCopy: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  formatShortDate: (dateStr: string) => string;
}

const NoteListRow: React.FC<NoteRowProps> = ({
  note,
  copiedId,
  onSelect,
  onTogglePin,
  onCopy,
  onDelete,
  formatShortDate,
}) => {
  return (
    <div
      onClick={onSelect}
      className="group relative flex items-center justify-between px-5 py-3.5 cursor-pointer hover:bg-surface-elevated/40 transition-colors"
    >
      <div className="min-w-0 flex-1 pr-4 space-y-1">
        <div className="flex items-center gap-2">
          {note.isPinned && (
            <PushPin weight="fill" className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          )}
          <h4 className="text-[15px] font-semibold text-primary tracking-tight truncate group-hover:text-accent transition-colors">
            {note.title}
          </h4>
        </div>

        <div className="flex items-center gap-2 text-[13px] text-secondary/70">
          <span className="font-medium shrink-0 text-secondary/50">
            {formatShortDate(note.updatedAt)}
          </span>
          <span className="text-secondary/30">·</span>
          <p className="truncate text-secondary/80 font-normal">
            {note.content.replace(/\n+/g, ' ')}
          </p>
        </div>

        {note.tags.length > 0 && (
          <div className="flex items-center gap-2 pt-0.5 text-[11px] text-secondary/50 font-mono">
            {note.tags.map(t => (
              <span key={t}>#{t}</span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onTogglePin}
          className={`p-1.5 rounded-lg transition-colors ${
            note.isPinned ? 'text-amber-500' : 'text-secondary/60 hover:text-primary'
          }`}
          aria-label={note.isPinned ? 'Sabitlemeyi kaldır' : 'Sabitle'}
        >
          <PushPin weight={note.isPinned ? 'fill' : 'regular'} className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onCopy}
          className="p-1.5 rounded-lg text-secondary/60 hover:text-primary transition-colors"
          aria-label="Kopyala"
        >
          {copiedId === note.id ? (
            <Check weight="bold" className="w-3.5 h-3.5 text-success" />
          ) : (
            <Copy weight="regular" className="w-3.5 h-3.5" />
          )}
        </button>

        <button
          onClick={onDelete}
          className="p-1.5 rounded-lg text-secondary/60 hover:text-danger transition-colors"
          aria-label="Sil"
        >
          <Trash weight="regular" className="w-3.5 h-3.5" />
        </button>

        <CaretRight weight="bold" className="w-3.5 h-3.5 text-secondary/40 ml-1" />
      </div>
    </div>
  );
};

// ─── Sub-Component: Apple Notes Grid Card ───
const NoteGridCard: React.FC<NoteRowProps> = ({
  note,
  copiedId,
  onSelect,
  onTogglePin,
  onCopy,
  onDelete,
  formatShortDate,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        onClick={onSelect}
        className="group relative flex flex-col justify-between h-48 p-5 rounded-2xl bg-surface/50 dark:bg-zinc-900/40 hover:bg-surface-elevated/50 dark:hover:bg-zinc-800/40 border border-border/40 hover:border-border/80 transition-all cursor-pointer shadow-soft hover:shadow-card"
      >
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-[15px] font-bold text-primary tracking-tight line-clamp-1 group-hover:text-accent transition-colors">
              {note.title}
            </h4>
            <button
              onClick={onTogglePin}
              className={`p-1 -mr-1 rounded-lg shrink-0 transition-colors ${
                note.isPinned
                  ? 'text-amber-500'
                  : 'text-secondary/30 opacity-0 group-hover:opacity-100 hover:text-primary'
              }`}
              aria-label={note.isPinned ? 'Sabitlemeyi kaldır' : 'Sabitle'}
            >
              <PushPin weight={note.isPinned ? 'fill' : 'regular'} className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-secondary/80 leading-relaxed line-clamp-3 font-normal whitespace-pre-line">
            {note.content}
          </p>
        </div>

        <div className="pt-3 border-t border-border/25 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2 text-secondary/60">
            <span>{formatShortDate(note.updatedAt)}</span>
            {note.tags.length > 0 && (
              <span className="font-mono text-secondary/40">#{note.tags[0]}</span>
            )}
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={onCopy}
              className="p-1 text-secondary/60 hover:text-primary transition-colors"
              aria-label="Kopyala"
            >
              {copiedId === note.id ? (
                <Check weight="bold" className="w-3.5 h-3.5 text-success" />
              ) : (
                <Copy weight="regular" className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              onClick={onDelete}
              className="p-1 text-secondary/60 hover:text-danger transition-colors"
              aria-label="Sil"
            >
              <Trash weight="regular" className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
