import React from 'react';
import { FileText, Star, Download, Trash2, X, Sparkles, Tag } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
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
  document,
  isOpen,
  onClose,
  onToggleFavorite,
  onDelete,
}) => {
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
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={document.title}
      subtitle={`${DOCUMENT_CATEGORY_LABELS[document.category]} · ${formatDate(document.createdAt)} tarihinde eklendi`}
      maxWidth="lg"
    >
      <div className="space-y-5">
        {/* Preview */}
        <div className="w-full h-52 sm:h-64 rounded-xl overflow-hidden border border-border bg-surface">
          {document.fileType === 'img' && document.previewUrl ? (
            <img src={document.previewUrl} alt={document.title} className="w-full h-full object-cover" />
          ) : document.fileType === 'pdf' && document.previewUrl ? (
            <iframe title={`${document.title} önizlemesi`} src={document.previewUrl} className="w-full h-full" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-secondary">
              <FileText className="w-10 h-10" />
              <p className="text-sm font-medium">Bu dosya türü önizlenemiyor.</p>
            </div>
          )}
        </div>

        {/* Metadata row */}
        <div className="grid grid-cols-3 gap-3 p-3 bg-surface rounded-xl border border-border text-xs">
          <div>
            <p className="text-secondary font-medium mb-0.5">Tür</p>
            <p className="font-semibold text-primary uppercase">{document.fileType} · {document.fileSize}</p>
          </div>
          <div>
            <p className="text-secondary font-medium mb-0.5">Eklenme</p>
            <p className="font-semibold text-primary">{formatDate(document.createdAt)}</p>
          </div>
          <div>
            <p className="text-secondary font-medium mb-0.5">Durum</p>
            <p className="font-semibold text-primary">{document.isFavorite ? 'Favori' : 'Aktif'}</p>
          </div>
        </div>

        {/* Description */}
        {document.description && (
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-secondary">Açıklama</p>
            <p className="text-sm text-primary leading-relaxed bg-surface px-4 py-3 rounded-xl border border-border">
              {document.description}
            </p>
          </div>
        )}

        {/* OCR */}
        {document.ocrText && (
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-secondary flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-accent" /> Taranan metin
            </p>
            <div className="px-4 py-3 bg-surface rounded-xl border border-border text-xs font-mono text-secondary leading-relaxed max-h-28 overflow-y-auto thin-scrollbar">
              {document.ocrText}
            </div>
          </div>
        )}

        {/* Tags */}
        {document.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {document.tags.map(tag => (
              <Badge key={tag} variant="outline" size="xs">{tag}</Badge>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            icon={<Trash2 className="w-3.5 h-3.5" />}
            onClick={() => { onDelete(document.id); onClose(); showToast('Belge silindi.'); }}
            className="text-danger hover:text-danger hover:bg-danger-muted"
          >
            Sil
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={<Star className={`w-3.5 h-3.5 ${document.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />}
              onClick={() => {
                onToggleFavorite(document.id);
                showToast(document.isFavorite ? 'Favorilerden çıkarıldı.' : 'Favorilere eklendi.');
              }}
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
