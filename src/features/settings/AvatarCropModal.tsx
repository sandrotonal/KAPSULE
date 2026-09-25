import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { triggerHaptic } from '../../utils/haptics';

interface AvatarCropModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  onClose: () => void;
  onCropComplete: (croppedBase64: string) => void;
}

export const AvatarCropModal: React.FC<AvatarCropModalProps> = ({
  isOpen,
  imageSrc,
  onClose,
  onCropComplete,
}) => {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [aspectRatio, setAspectRatio] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const currentOffsetRef = useRef({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setOffset({ x: 0, y: 0 });
      currentOffsetRef.current = { x: 0, y: 0 };
    }
  }, [isOpen, imageSrc]);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    dragStartRef.current = {
      x: e.clientX - currentOffsetRef.current.x,
      y: e.clientY - currentOffsetRef.current.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStartRef.current.x;
    const newY = e.clientY - dragStartRef.current.y;
    currentOffsetRef.current = { x: newX, y: newY };
    setOffset({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.0015;
    setZoom((prev) => Math.min(Math.max(1, prev + delta), 3));
  };

  const handleApplyCrop = useCallback(() => {
    if (!imgRef.current) return;
    triggerHaptic.success();

    const img = imgRef.current;
    const outputSize = 400; // 400x400 high-density output
    const viewSize = 220; // 220px on-screen aperture
    const scaleRatio = outputSize / viewSize;

    const canvas = document.createElement('canvas');
    canvas.width = outputSize;
    canvas.height = outputSize;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.save();
    // 1. Move to canvas center
    ctx.translate(outputSize / 2, outputSize / 2);
    // 2. Apply pan offset
    ctx.translate(offset.x * scaleRatio, offset.y * scaleRatio);
    // 3. Apply zoom
    ctx.scale(zoom * scaleRatio, zoom * scaleRatio);

    // Calculate natural fit dimensions matching CSS
    const aspect = img.naturalWidth / img.naturalHeight;
    const baseW = aspect >= 1 ? viewSize * aspect : viewSize;
    const baseH = aspect >= 1 ? viewSize : viewSize / aspect;

    ctx.drawImage(img, -baseW / 2, -baseH / 2, baseW, baseH);
    ctx.restore();

    const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
    onCropComplete(croppedDataUrl);
  }, [offset, zoom, onCropComplete]);

  if (typeof document === 'undefined') return null;

  const isLandscape = aspectRatio >= 1;
  const baseWidth = isLandscape ? 220 * aspectRatio : 220;
  const baseHeight = isLandscape ? 220 : 220 / aspectRatio;

  return createPortal(
    <AnimatePresence>
      {isOpen && imageSrc && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 select-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Minimalist Card (Quiet Luxury & Clean) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-[300px] rounded-3xl bg-[#141518] border border-white/10 text-white shadow-2xl p-5 flex flex-col items-center gap-4"
          >
            {/* Header */}
            <div className="text-center">
              <h3 className="text-sm font-semibold text-white tracking-tight">Fotoğrafı Ayarla</h3>
              <p className="text-[11px] text-zinc-400 mt-0.5">Konumu ve boyutu ayarlayın</p>
            </div>

            {/* Circular Mask Viewfinder (Clean Apple style) */}
            <div
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onWheel={handleWheel}
              className="relative w-[210px] h-[210px] rounded-full overflow-hidden bg-black/60 ring-2 ring-white/40 cursor-grab active:cursor-grabbing touch-none flex items-center justify-center shrink-0 shadow-lg"
            >
              <img
                ref={imgRef}
                src={imageSrc}
                alt="Profil"
                onLoad={(e) => {
                  const { naturalWidth, naturalHeight } = e.currentTarget;
                  if (naturalWidth && naturalHeight) {
                    setAspectRatio(naturalWidth / naturalHeight);
                  }
                }}
                style={{
                  width: `${baseWidth}px`,
                  height: `${baseHeight}px`,
                  maxWidth: 'none',
                  maxHeight: 'none',
                  transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                  transformOrigin: 'center center',
                }}
                className="pointer-events-none transition-transform duration-75 select-none"
                draggable={false}
              />
            </div>

            {/* Clean Minimalist Zoom Slider */}
            <div className="w-full px-3">
              <input
                type="range"
                min="1"
                max="3"
                step="0.02"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-white"
                aria-label="Ölçeklendir"
              />
            </div>

            {/* Actions: Apple style Vazgeç & Seç */}
            <div className="w-full flex items-center justify-between pt-2 border-t border-white/10 px-1">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
              >
                Vazgeç
              </button>

              <button
                type="button"
                onClick={handleApplyCrop}
                className="px-5 py-1.5 rounded-full bg-white text-zinc-950 text-xs font-semibold hover:bg-zinc-200 active:scale-95 transition-all shadow-sm"
              >
                Seç
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
