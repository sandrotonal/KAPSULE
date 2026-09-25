import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ZoomIn, ZoomOut, RotateCw, Move, RefreshCw } from 'lucide-react';
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
  const [rotation, setRotation] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [aspectRatio, setAspectRatio] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const currentOffsetRef = useRef({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement>(null);

  // Reset controls when a new image is loaded
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setRotation(0);
      setOffset({ x: 0, y: 0 });
      currentOffsetRef.current = { x: 0, y: 0 };
    }
  }, [isOpen, imageSrc]);

  // Pointer drag events for panning (works for mouse and touch)
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // ignore in environments where pointer capture isn't supported
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

  const handleRotate = () => {
    triggerHaptic.light();
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    triggerHaptic.light();
    setZoom(1);
    setRotation(0);
    setOffset({ x: 0, y: 0 });
    currentOffsetRef.current = { x: 0, y: 0 };
  };

  const handleApplyCrop = useCallback(() => {
    if (!imgRef.current) return;
    triggerHaptic.success();

    const img = imgRef.current;
    const outputSize = 400; // 400x400 high-density output
    const viewSize = 240;
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
    // 2. Pan offset (scaled)
    ctx.translate(offset.x * scaleRatio, offset.y * scaleRatio);
    // 3. Rotation
    ctx.rotate((rotation * Math.PI) / 180);
    // 4. Zoom
    ctx.scale(zoom * scaleRatio, zoom * scaleRatio);

    // Calculate natural fit dimensions matching CSS
    const aspect = img.naturalWidth / img.naturalHeight;
    const baseW = aspect >= 1 ? viewSize * aspect : viewSize;
    const baseH = aspect >= 1 ? viewSize : viewSize / aspect;

    ctx.drawImage(img, -baseW / 2, -baseH / 2, baseW, baseH);
    ctx.restore();

    const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
    onCropComplete(croppedDataUrl);
  }, [offset, rotation, zoom, onCropComplete]);

  if (typeof document === 'undefined') return null;

  const isLandscape = aspectRatio >= 1;
  const baseWidth = isLandscape ? 240 * aspectRatio : 240;
  const baseHeight = isLandscape ? 240 : 240 / aspectRatio;

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
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-sm rounded-[32px] bg-zinc-950 border border-white/10 text-white shadow-2xl p-6 overflow-hidden flex flex-col items-center gap-5"
          >
            {/* Header */}
            <div className="w-full flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Fotoğrafı Kırp & Hizala</h3>
                <p className="text-xs text-zinc-400 mt-0.5">Sürükleyip ölçeklendirerek çerçeveye oturtun</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4 stroke-[2]" />
              </button>
            </div>

            {/* Viewfinder Window (240x240 rounded-3xl squircle) */}
            <div
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="relative w-[240px] h-[240px] rounded-3xl overflow-hidden bg-black/90 border-2 border-white/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.65)] cursor-grab active:cursor-grabbing touch-none flex items-center justify-center shrink-0"
            >
              <img
                ref={imgRef}
                src={imageSrc}
                alt="Kırpılacak fotoğraf"
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
                  transform: `translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg) scale(${zoom})`,
                  transformOrigin: 'center center',
                }}
                className="pointer-events-none transition-transform duration-75 select-none"
                draggable={false}
              />

              {/* Viewfinder Rule-of-Thirds Grid Overlay */}
              <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 border border-white/15">
                <div className="border-r border-b border-white/15" />
                <div className="border-r border-b border-white/15" />
                <div className="border-b border-white/15" />
                <div className="border-r border-b border-white/15" />
                <div className="border-r border-b border-white/15" />
                <div className="border-b border-white/15" />
                <div className="border-r border-white/15" />
                <div className="border-r border-white/15" />
                <div />
              </div>

              {/* Viewfinder alignment hint */}
              <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-[10px] font-medium text-white/80 flex items-center gap-1 pointer-events-none">
                <Move className="w-2.5 h-2.5" />
                <span>Kaydır</span>
              </div>
            </div>

            {/* Zoom Slider & Rotate Controls */}
            <div className="w-full flex flex-col gap-3 pt-1">
              <div className="flex items-center gap-3 w-full">
                <ZoomOut className="w-4 h-4 text-zinc-400 shrink-0" />
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full accent-white h-1.5 bg-white/20 rounded-lg cursor-pointer"
                />
                <ZoomIn className="w-4 h-4 text-zinc-400 shrink-0" />

                <button
                  type="button"
                  onClick={handleRotate}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-200 hover:text-white transition-colors shrink-0 ml-1"
                  title="90° Döndür"
                >
                  <RotateCw className="w-4 h-4 stroke-[2]" />
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-200 hover:text-white transition-colors shrink-0"
                  title="Sıfırla"
                >
                  <RefreshCw className="w-4 h-4 stroke-[2]" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full grid grid-cols-2 gap-2.5 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-300 hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <X className="w-3.5 h-3.5" />
                <span>İptal</span>
              </button>

              <button
                type="button"
                onClick={handleApplyCrop}
                className="w-full py-2.5 px-4 rounded-xl bg-white text-zinc-950 hover:bg-zinc-100 text-xs font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Kırp & Kaydet</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
