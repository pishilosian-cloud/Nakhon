import React from 'react';
import { Calendar, Sparkles, Clock, ShieldCheck, HeartHandshake } from 'lucide-react';

interface BookingCtaProps {
  onOpenBooking: () => void;
}

export const BookingCta: React.FC<BookingCtaProps> = ({ onOpenBooking }) => {
  return (
    <section className="py-20 sm:py-24 relative overflow-hidden bg-[#2C2420] text-white">
      {/* Delicate warm ambient lighting */}
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-80 h-80 bg-[#8C6D62]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-64 h-64 bg-[#B58D80]/15 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        
        {/* Subtle kicker without pill capsule */}
        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-[#D8C7BC] font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#E5D4D0]" />
          <span>استودیو ناخن نیوشا</span>
          <span aria-hidden="true" className="text-[#6E5D53]">·</span>
          <span>پذیرش با وقت قبلی</span>
        </div>

        {/* Headline exact quote from prompt */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#FDFBF7] tracking-tight leading-tight text-balance">
          برای نوبت خودت آماده‌ای؟
        </h2>

        {/* Sub-text */}
        <p className="mt-4 sm:mt-5 text-sm sm:text-base text-[#D4C4B9] max-w-xl mx-auto leading-relaxed text-balance">
          زیبایی، سلامت و ظرافت ناخن‌هایتان را به دستان حرفه‌ای بسپارید. رزرو نوبت اختصاصی در محیطی کاملاً آرام و بهداشتی.
        </p>

        {/* Highlights Row */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs sm:text-sm text-[#C4B2A7]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#D8C2B8]" />
            <span>پک بهداشتی انفرادی</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#D8C2B8]" />
            <span>بدون معطلی و با زمان اختصاصی</span>
          </div>
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-[#D8C2B8]" />
            <span>مشاوره رایگان فرم و رنگ</span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-9 sm:mt-10">
          <button
            onClick={onOpenBooking}
            type="button"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 sm:px-9 sm:py-4 text-sm sm:text-base font-semibold text-[#2C2420] bg-[#FAF8F5] hover:bg-[#F2ECE5] active:scale-[0.98] transition-all rounded-md shadow-lg cursor-pointer group"
          >
            <Calendar className="w-4 h-4 text-[#8C6D62] transition-transform group-hover:scale-110" />
            <span>رزرو نوبت</span>
          </button>
        </div>

        <p className="mt-4 text-[11px] sm:text-xs text-[#9E8E84]">
          هماهنگی سریع نوبت‌ها از طریق فرم آنلاین، تلگرام و پشتیبانی تلفنی
        </p>
      </div>
    </section>
  );
};
