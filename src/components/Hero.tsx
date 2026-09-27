import React, { useState } from 'react';
import { Calendar, ArrowDownLeft, Sparkles, CheckCircle2, Shield } from 'lucide-react';
import { salonData } from '../data/salonData';

interface HeroProps {
  onOpenBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <section id="hero" className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 lg:pt-40 lg:pb-28 overflow-hidden">
      {/* Subtle background ambient warmth */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#F5ECE5] rounded-full blur-3xl -z-10 opacity-70 pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-80 h-80 bg-[#EFE6DF] rounded-full blur-3xl -z-10 opacity-50 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Text & Content Column (7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col text-right">
            {/* Elegant unboxed kicker / badge without pill capsule */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#8C6D62] font-medium mb-4">
              <span className="inline-block w-2 h-2 rounded-full bg-[#8C6D62]" />
              <span>استودیو تخصصی ناخن و آرایش دست</span>
              <span aria-hidden="true" className="text-[#BCAEA5]">·</span>
              <span className="font-serif-brand tracking-wider">Niwsha Nail Studio</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#28211E] tracking-tight leading-[1.3] sm:leading-[1.25] text-balance">
              هنر و ظرافت ناخن، <br className="hidden sm:inline" />
              متناسب با زیبایی طبیعی دست‌های شما
            </h1>

            {/* Persian Introduction Paragraph */}
            <p className="mt-5 text-base sm:text-lg text-[#5A4E46] leading-relaxed max-w-xl text-balance">
              {salonData.brand.subTagline}. تجربه‌ای متمایز از فرم‌دهی اصولی، متریال بدون آسیب و طراحی‌های مینیاتوری در استودیوی آرام و استاندارد نیوشا.
            </p>

            {/* Key benefits list - subtle unboxed text */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 max-w-lg text-xs sm:text-sm text-[#4E433C]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8C6D62] shrink-0" />
                <span>متریال ضدحساسیت و اورجینال</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#8C6D62] shrink-0" />
                <span>پک‌های استریل یک‌بار مصرف</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#8C6D62] shrink-0" />
                <span>ماندگاری طولانی و طبیعی</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-serif-brand font-semibold text-[#8C6D62]">5+</span>
                <span>سال سابقه تخصصی مستمر</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-3.5 sm:gap-4">
              <button
                onClick={onOpenBooking}
                type="button"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 sm:px-7 sm:py-3.5 text-sm sm:text-base font-medium text-white bg-[#2E2521] hover:bg-[#463933] active:scale-[0.98] transition-all rounded-md shadow-xs cursor-pointer group"
              >
                <Calendar className="w-4 h-4 text-[#E5D4D0] transition-transform group-hover:scale-110" />
                <span>رزرو نوبت</span>
              </button>

              <a
                href="#portfolio"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 sm:px-6 sm:py-3.5 text-sm sm:text-base font-medium text-[#3D342F] bg-[#EFE7E0] hover:bg-[#E7DDD5] active:scale-[0.98] transition-all rounded-md cursor-pointer"
              >
                <span>مشاهده نمونه‌کارها</span>
                <ArrowDownLeft className="w-4 h-4 text-[#6D5A50]" />
              </a>
            </div>

            {/* Quiet trust metadata */}
            <div className="mt-8 pt-6 border-t border-[#EAE3DB] flex items-center gap-6 text-xs text-[#7A6C63]">
              <div>
                <span className="font-semibold text-sm text-[#2E2521] ml-1">{salonData.brand.experienceYears}</span>
                <span>در هنر ناخن</span>
              </div>
              <span aria-hidden="true" className="text-[#D6CCC3]">·</span>
              <div>
                <span className="font-semibold text-sm text-[#2E2521] ml-1">{salonData.brand.clientsCount}</span>
                <span>رضایت و ماندگاری</span>
              </div>
            </div>
          </div>

          {/* Visual Column (5 cols on lg) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Decorative warm frame offset */}
              <div className="absolute -inset-2.5 sm:-inset-3 bg-[#E8DDD4] rounded-2xl rotate-1 -z-10" />
              
              <div className="relative bg-white rounded-xl overflow-hidden shadow-sm border border-[#EAE3DB]">
                {!imageLoaded && !imageError && (
                  <div className="aspect-4/3 w-full bg-[#F3ECE6] animate-pulse flex items-center justify-center text-[#998B82] text-xs">
                    بارگذاری تصویر استودیو...
                  </div>
                )}
                
                {imageError ? (
                  <div className="aspect-4/3 w-full bg-[#F3ECE6] flex flex-col items-center justify-center p-6 text-center text-[#6A5E56]">
                    <Sparkles className="w-8 h-8 text-[#8C6D62] mb-2" />
                    <p className="text-sm font-medium">استودیوی تخصصی ناخن نیوشا</p>
                    <p className="text-xs text-[#8A7B72] mt-1">Niwsha Nail Studio</p>
                  </div>
                ) : (
                  <img
                    src={salonData.brand.heroImage}
                    alt="نمونه کاشت و طراحی ناخن استودیو نیوشا"
                    referrerPolicy="no-referrer"
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageError(true)}
                    className={`w-full aspect-4/3 object-cover transition-transform duration-700 hover:scale-105 ${
                      imageLoaded ? 'opacity-100' : 'opacity-0 absolute'
                    }`}
                  />
                )}

                {/* Subtle caption bar */}
                <div className="p-3.5 bg-white border-t border-[#F0E9E2] flex items-center justify-between text-xs">
                  <div>
                    <p className="font-medium text-[#2E2521]">استایل طبیعی و ژورنالی</p>
                    <p className="text-[#807269] text-[11px]">فرم بادامی با پوشش نود شیری</p>
                  </div>
                  <span className="font-serif-brand italic text-[#8C6D62] text-xs">Pure Elegance</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
