import React from 'react';
import { Instagram, Send, Heart, ArrowUp } from 'lucide-react';
import { salonData } from '../data/salonData';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#241D1A] text-white pt-14 pb-10 border-t border-[#3A302A]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#3A302A] items-start">
          
          {/* Brand Info (5 cols) */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#F8F4EF]">
                {salonData.brand.persianName}
              </span>
              <span className="font-serif-brand italic text-sm text-[#C4A498]">
                Nail Artist
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#BCADA3] leading-relaxed max-w-sm">
              استودیوی تخصصی خدمات کاشت، ژل، لمینت، مانیکور روسی و طراحی ظریف ناخن با تأکید بر سلامت بستر ناخن و بهداشت کامل.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={salonData.contact.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-md bg-white/10 hover:bg-white/20 text-[#D4C3B7] hover:text-white flex items-center justify-center transition-colors"
                aria-label="اینستاگرام نیوشا"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                href={salonData.contact.telegramUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-md bg-white/10 hover:bg-white/20 text-[#D4C3B7] hover:text-white flex items-center justify-center transition-colors"
                aria-label="تلگرام نیوشا"
              >
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Nav Links (3 cols) */}
          <div className="md:col-span-3 space-y-2.5 text-xs text-[#BCADA3]">
            <p className="font-bold text-sm text-[#EAE0D8] mb-3">دسترسی سریع</p>
            <p><a href="#hero" className="hover:text-white transition-colors">صفحه اصلی</a></p>
            <p><a href="#about" className="hover:text-white transition-colors">درباره نیوشا</a></p>
            <p><a href="#services" className="hover:text-white transition-colors">خدمات و قیمت‌ها</a></p>
            <p><a href="#portfolio" className="hover:text-white transition-colors">ژورنال نمونه‌کارها</a></p>
            <p><a href="#contact" className="hover:text-white transition-colors">اطلاعات تماس</a></p>
          </div>

          {/* Business Hours & Location summary (4 cols) */}
          <div className="md:col-span-4 space-y-2 text-xs text-[#BCADA3]">
            <p className="font-bold text-sm text-[#EAE0D8] mb-3">ساعات کاری و پذیرش</p>
            <p className="text-[#D8CBC1]">{salonData.contact.workingHours}</p>
            <p className="mt-2 text-[#9E8E84] leading-relaxed">
              پذیرش فقط با هماهنگی و تعیین وقت قبلی صورت می‌پذیرد تا کیفیت و بهداشت در بالاترین سطح ارائه گردد.
            </p>
            
            <div className="pt-2">
              <span className="text-[11px] text-[#A6958B] block">اینستاگرام:</span>
              <span className="font-mono text-xs text-[#EAE0D8]" dir="ltr">{salonData.contact.instagram}</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#95847A]">
          <div className="flex items-center gap-1.5">
            <span>تمامی حقوق محفوظ است © {new Date().getFullYear()}</span>
            <span aria-hidden="true">·</span>
            <span>استودیو ناخن نیوشا (Niwsha Nails)</span>
          </div>

          <button
            onClick={scrollToTop}
            type="button"
            className="flex items-center gap-1 text-[#BCADA3] hover:text-white transition-colors cursor-pointer"
          >
            <span>بازگشت به بالا</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
