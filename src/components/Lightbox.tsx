import React, { useEffect, useCallback } from 'react';
import { X, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { PortfolioItem } from '../types';

interface LightboxProps {
  item: PortfolioItem | null;
  items: PortfolioItem[];
  onClose: () => void;
  onNavigate: (item: PortfolioItem) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({ item, items, onClose, onNavigate }) => {
  const currentIndex = item ? items.findIndex((i) => i.id === item.id) : -1;

  const handleNext = useCallback(() => {
    if (currentIndex >= 0 && currentIndex < items.length - 1) {
      onNavigate(items[currentIndex + 1]);
    } else if (items.length > 0) {
      onNavigate(items[0]); // loop back to first
    }
  }, [currentIndex, items, onNavigate]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      onNavigate(items[currentIndex - 1]);
    } else if (items.length > 0) {
      onNavigate(items[items.length - 1]); // loop to last
    }
  }, [currentIndex, items, onNavigate]);

  // Keyboard navigation & lock body scroll
  useEffect(() => {
    if (!item) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      // RTL: right arrow is previous, left arrow is next
      if (e.key === 'ArrowRight') handlePrev();
      if (e.key === 'ArrowLeft') handleNext();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [item, onClose, handleNext, handlePrev]);

  if (!item) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="نمایش تصویر نمونه کار"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-6 animate-fadeIn"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="بستن گالری"
        className="absolute top-4 left-4 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev button (Right side in RTL) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handlePrev();
        }}
        aria-label="تصویر قبلی"
        className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Next button (Left side in RTL) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleNext();
        }}
        aria-label="تصویر بعدی"
        className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Main Image Container */}
      <div
        className="relative max-w-3xl w-full max-h-[88vh] flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative rounded-lg overflow-hidden bg-[#1E1916] shadow-2xl max-h-[72vh] flex items-center justify-center">
          <img
            src={item.imageUrl}
            alt={item.title}
            referrerPolicy="no-referrer"
            className="w-full h-auto max-h-[70vh] object-contain select-none"
          />
        </div>

        {/* Caption Card */}
        <div className="mt-3.5 w-full bg-[#241E1B] text-white p-4 rounded-lg border border-[#3E342F] text-right">
          <div className="flex items-center justify-between text-xs text-[#C8B8AE] mb-1">
            <div className="flex items-center gap-1.5 text-[#E6C2B4]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{item.categoryLabel}</span>
            </div>
            <span className="tabular-nums">
              {currentIndex + 1} از {items.length}
            </span>
          </div>

          <h3 className="font-bold text-sm sm:text-base text-[#F5ECE5] mt-1">
            {item.title}
          </h3>

          <div className="mt-2 pt-2 border-t border-[#3B322D] flex flex-wrap items-center gap-4 text-xs text-[#BAADA4]">
            <div>
              <span className="text-[#8E7E75] ml-1">تکنیک:</span>
              <span>{item.technique}</span>
            </div>
            <span aria-hidden="true" className="text-[#554740]">·</span>
            <div>
              <span className="text-[#8E7E75] ml-1">فرم:</span>
              <span>{item.shape}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
