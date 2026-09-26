import React, { useState, useRef } from 'react';
import { FileText, Star, Download, Trash2, ScanText, Copy, Check, Calendar, HardDrive, Shield } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { AppleFileIcon } from '../../components/ui/AppleFileIcon';
import { DocumentItem, DOCUMENT_CATEGORY_LABELS } from '../../types';
import { formatDate } from '../../lib/utils';
import { useToast } from '../../components/ui/Toast';

export interface DocumentDetailModalProps {
  document: DocumentItem | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
}

export const DocumentDetailModal: React.FC<DocumentDetailModalProps> = ({
  document: propDocument,
  isOpen,
  onClose,
  onToggleFavorite,
  onDelete,
}) => {
  const activeDocRef = useRef<DocumentItem | null>(propDocument);
  if (propDocument) {
    activeDocRef.current = propDocument;
  }
  const document = propDocument || activeDocRef.current;
  const [copiedOcr, setCopiedOcr] = useState(false);
  const { showToast } = useToast();

  if (!document) return null;

  const handleDownload = () => {
    if (!document.previewUrl) {
      showToast('Bu belge için indirilebilir dosya bulunamadı.');
      return;
    }
    const extension = document.fileType === 'img' ? 'png' : document.fileType;
    const link = window.document.createElement('a');
    link.href = document.previewUrl;
    link.download = `${document.title}.${extension}`;
    link.click();
    showToast('Dosya indirme başlatıldı.');
  };

  const handleCopyOcr = () => {
    if (!document.ocrText) return;
    navigator.clipboard.writeText(document.ocrText);
    setCopiedOcr(true);
    setTimeout(() => setCopiedOcr(false), 2000);
    showToast('Taranan metin panoya kopyalandı.');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={document.title}
      subtitle={`${DOCUMENT_CATEGORY_LABELS[document.category]} · ${formatDate(document.createdAt)}`}
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Apple Quick Look Preview Canvas */}
        <div className="w-full h-56 sm:h-72 rounded-2xl overflow-hidden bg-surface-elevated/40 dark:bg-zinc-950/70 border border-border/40 flex items-center justify-center relative">
          {document.fileType === 'img' && document.previewUrl ? (
            <img src={document.previewUrl} alt={document.title} className="w-full h-full object-contain" />
          ) : document.fileType === 'pdf' && document.previewUrl ? (
            <iframe title={`${document.title} önizlemesi`} src={document.previewUrl} className="w-full h-full" />
          ) : (
            <div className="flex flex-col items-center justify-center p-6">
              <AppleFileIcon fileType={document.fileType} size="hero" />
            </div>
          )}
        </div>

        {/* Clean Metadata Inspector Strip (No bulky boxes) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-3 px-1 border-y border-border/30 text-xs">
          <div>
            <span className="text-[11px] text-secondary/60 font-medium block">Dosya Türü</span>
            <span className="font-semibold text-primary uppercase font-mono mt-0.5 block">
              {document.fileType}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-secondary/60 font-medium block">Dosya Boyutu</span>
            <span className="font-semibold text-primary font-mono mt-0.5 block">
              {document.fileSize}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-secondary/60 font-medium block">Eklenme Tarihi</span>
            <span className="font-semibold text-primary mt-0.5 block">
              {formatDate(document.createdAt)}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-secondary/60 font-medium block">Kategori</span>
            <span className="font-semibold text-primary mt-0.5 block">
              {DOCUMENT_CATEGORY_LABELS[document.category]}
            </span>
          </div>
        </div>

        {/* Description */}
        {document.description && (
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-secondary/70">Açıklama</span>
            <p className="text-sm text-primary/90 leading-relaxed font-normal">
              {document.description}
            </p>
          </div>
        )}

        {/* OCR Scanned Text Sheet */}
        {document.ocrText && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-secondary/70 flex items-center gap-1.5">
                <ScanText className="w-3.5 h-3.5 text-accent" /> Taranan Metin (OCR)
              </span>
              <button
                onClick={handleCopyOcr}
                className="text-xs text-secondary/70 hover:text-primary flex items-center gap-1 transition-colors"
                aria-label="Taranan metni kopyala"
              >
                {copiedOcr ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-success" />
                    <span className="text-success font-medium">Kopyalandı</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Kopyala</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-3.5 bg-surface-elevated/40 dark:bg-zinc-900/40 rounded-xl border border-border/30 text-xs font-mono text-secondary/80 leading-relaxed max-h-32 overflow-y-auto thin-scrollbar select-text">
              {document.ocrText}
            </div>
          </div>
        )}

        {/* Tags */}
        {document.tags.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-secondary/60 font-mono">
            {document.tags.map(tag => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
        )}

        {/* Bottom Actions Bar */}
        <div className="flex items-center justify-between pt-3 border-t border-border/40">
          <Button
            variant="ghost"
            size="sm"
            icon={<Trash2 className="w-4 h-4" />}
            onClick={() => {
              onDelete(document.id);
              onClose();
            }}
            className="text-danger hover:text-danger hover:bg-danger-muted"
          >
            Sil
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={<Star className={`w-3.5 h-3.5 ${document.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />}
              onClick={() => onToggleFavorite(document.id)}
            >
              {document.isFavorite ? 'Favori' : 'Favorile'}
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Download className="w-3.5 h-3.5" />}
              onClick={handleDownload}
            >
              İndir
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
