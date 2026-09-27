import React, { useState, useMemo } from 'react';
import { Eye, Sparkles } from 'lucide-react';
import { salonData } from '../data/salonData';
import { PortfolioCategory, PortfolioItem } from '../types';
import { Lightbox } from './Lightbox';

export const Portfolio: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<PortfolioCategory>('all');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') {
      return salonData.portfolio;
    }
    return salonData.portfolio.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  return (
    <section id="portfolio" className="py-20 sm:py-28 bg-[#F6F1EC] border-t border-[#EBE3DC]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-10 sm:mb-14">
          <p className="text-xs sm:text-sm font-medium text-[#8C6D62] tracking-wider mb-2">
            ژورنال کارهای اجرا شده
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#28211E] tracking-tight">
            نمونه‌کارهای نیوشا
          </h2>
          <div className="w-12 h-0.5 bg-[#8C6D62] mx-auto mt-4 rounded-full" />
          <p className="mt-3 text-sm sm:text-base text-[#685A52]">
            نمونه‌های واقعی از کاشت، استحکام‌سازی، ژلیش و طراحی‌های دست‌آزاد در سالن
          </p>
        </div>

        {/* Category Tabs: Clean segmented buttons (functional interactive controls) */}
        <div className="flex items-center justify-center mb-10 sm:mb-12 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-1.5 p-1 bg-[#EAE1D8] rounded-lg border border-[#DDD1C6]">
            {salonData.portfolioCategories.map((cat) => {
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setActiveCategory(cat.key)}
                  className={`px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-white text-[#2B231F] shadow-xs font-semibold'
                      : 'text-[#6C5D55] hover:text-[#2B231F] hover:bg-white/40'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Gallery Grid: 2 cols on mobile, 3 cols on md, 4 cols on lg */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedItem(item);
                }
              }}
              aria-label={`مشاهده ${item.title}`}
              className="group relative bg-white rounded-lg sm:rounded-xl overflow-hidden border border-[#E8DDD4] shadow-2xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col focus-visible:outline-2 focus-visible:outline-[#8C6D62]"
            >
              {/* Image Box */}
              <div className="relative aspect-4/3 sm:aspect-square overflow-hidden bg-[#ECE3DB]">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-106"
                />

                {/* Hover overlay with zoom hint */}
                <div className="absolute inset-0 bg-[#251E1B]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/90 text-[#251E1B] flex items-center justify-center transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    <Eye className="w-5 h-5" />
                  </div>
                </div>

                {/* Category badge */}
                <div className="absolute top-2.5 right-2.5 bg-[#FAF7F3]/90 backdrop-blur-xs px-2 py-0.5 rounded text-[11px] font-medium text-[#65544B] border border-[#E5DAD1]">
                  {item.categoryLabel}
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-3 sm:p-3.5 flex flex-col justify-between flex-grow text-right">
                <h3 className="font-bold text-xs sm:text-sm text-[#2E2420] line-clamp-1 group-hover:text-[#8C6D62] transition-colors">
                  {item.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-[#827269] mt-1 line-clamp-1">
                  {item.shape}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        <Lightbox
          item={selectedItem}
          items={filteredItems}
          onClose={() => setSelectedItem(null)}
          onNavigate={(newItem) => setSelectedItem(newItem)}
        />

        {/* Gallery bottom hint */}
        <div className="mt-12 text-center">
          <p className="text-xs text-[#7B6C64]">
            برای مشاهده با کیفیت بالا و جزئیات تکنیک‌ها، روی هر تصویر کلیک نمایید.
          </p>
        </div>

      </div>
    </section>
  );
};
