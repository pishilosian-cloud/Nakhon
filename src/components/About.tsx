import React, { useState } from 'react';
import { Sparkles, HeartHandshake, ShieldCheck, Gem } from 'lucide-react';
import { salonData } from '../data/salonData';

export const About: React.FC = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const highlightIcons = [
    <Gem key="1" className="w-5 h-5 text-[#8C6D62]" />,
    <ShieldCheck key="2" className="w-5 h-5 text-[#8C6D62]" />,
    <Sparkles key="3" className="w-5 h-5 text-[#8C6D62]" />,
    <HeartHandshake key="4" className="w-5 h-5 text-[#8C6D62]" />
  ];

  return (
    <section id="about" className="py-20 sm:py-28 bg-[#F6F1EC] relative border-y border-[#EBE3DC]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-14 sm:mb-16">
          <p className="text-xs sm:text-sm font-medium text-[#8C6D62] tracking-wider mb-2">
            هنر و تخصص فردی
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#28211E] tracking-tight text-balance">
            {salonData.about.title}
          </h2>
          <div className="w-12 h-0.5 bg-[#8C6D62] mx-auto mt-4 rounded-full" />
          <p className="mt-3 text-sm sm:text-base text-[#685A52]">
            {salonData.about.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Portrait Column (5 cols) */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative mx-auto max-w-sm lg:max-w-none">
              <div className="absolute -inset-2 bg-[#EADFD6] rounded-2xl -rotate-1 -z-10" />

              <div className="bg-white p-3 rounded-xl shadow-xs border border-[#E5DAD0] overflow-hidden">
                <div className="relative aspect-3/4 rounded-lg overflow-hidden bg-[#ECE3DB]">
                  {!imageLoaded && !imageError && (
                    <div className="w-full h-full bg-[#EFE6DE] animate-pulse flex items-center justify-center text-xs text-[#8F7E75]">
                      بارگذاری تصویر نیوشا...
                    </div>
                  )}

                  {imageError ? (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-[#6D5D55]">
                      <div className="w-16 h-16 rounded-full bg-[#E4D8CE] flex items-center justify-center mb-3">
                        <Sparkles className="w-8 h-8 text-[#8C6D62]" />
                      </div>
                      <p className="font-semibold text-sm">نیوشا | Niwsha</p>
                      <p className="text-xs text-[#8A7970] mt-1">مدرس و نیل آرتیست ارشد</p>
                    </div>
                  ) : (
                    <img
                      src={salonData.brand.artistImage}
                      alt="نیوشا - طراح و مدرس تخصصی ناخن"
                      referrerPolicy="no-referrer"
                      onLoad={() => setImageLoaded(true)}
                      onError={() => setImageError(true)}
                      className={`w-full h-full object-cover transition-transform duration-500 hover:scale-102 ${
                        imageLoaded ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  )}

                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#201916]/85 via-[#201916]/40 to-transparent p-4 text-white text-right">
                    <p className="font-bold text-base">نیوشا</p>
                    <p className="text-xs text-[#EADFD7] mt-0.5 font-light">Nail Artist & Care Specialist</p>
                  </div>
                </div>

                <div className="pt-3 px-1 text-center">
                  <p className="text-xs text-[#7F7067]">
                    عضو انجمن تخصصی طراحان ناخن با مدرک بین‌المللی مانیکور کمبی و استایلینگ
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Text & Philosophy Column (7 cols) */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6 text-right">
            <div className="space-y-4 text-sm sm:text-base text-[#4F433C] leading-relaxed">
              {salonData.about.bioParagraphs.map((para, idx) => (
                <p key={idx} className="text-balance">
                  {para}
                </p>
              ))}
            </div>

            {/* Highlights Grid */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {salonData.about.highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-white/80 rounded-lg border border-[#E9DFD7] hover:border-[#D8CAC0] transition-colors"
                >
                  <div className="flex items-center gap-2.5 mb-1.5">
                    {highlightIcons[idx % highlightIcons.length]}
                    <h3 className="font-bold text-sm text-[#2D2420]">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-xs text-[#6B5C54] leading-normal">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Quote / Philosophy snippet */}
            <div className="p-4 rounded-lg bg-[#EFE7E0] border-r-3 border-[#8C6D62] text-xs sm:text-sm text-[#463932] italic">
              «دست‌های آراسته، اعتمادبه‌نفس خاموش اما تأثیرگذار شما هستند. هدف من تنها لاک زدن نیست، بلکه ایجاد فرمی بی‌نقص و سالم است که هر بار به دستانتان نگاه می‌کنید، لبخند بزنید.»
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
