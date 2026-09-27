import React from 'react';
import { Sparkles, Clock, Check, ArrowLeft } from 'lucide-react';
import { salonData } from '../data/salonData';
import { ServiceItem } from '../types';

interface ServicesProps {
  onSelectServiceForBooking: (service: ServiceItem) => void;
}

export const Services: React.FC<ServicesProps> = ({ onSelectServiceForBooking }) => {
  return (
    <section id="services" className="py-20 sm:py-28 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-14 sm:mb-16">
          <p className="text-xs sm:text-sm font-medium text-[#8C6D62] tracking-wider mb-2">
            منوی خدمات تخصصی
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#28211E] tracking-tight">
            خدمات و تعرفه‌ها
          </h2>
          <div className="w-12 h-0.5 bg-[#8C6D62] mx-auto mt-4 rounded-full" />
          <p className="mt-3 text-sm sm:text-base text-[#685A52]">
            ارائه کلیه خدمات با برترین مواد اروپایی، رعایت دقیق اصول مانیکور بهداشتی و ظرافت ژورنالی
          </p>
        </div>

        {/* Services Grid: 3 columns on desktop, 2 on tablet, 1 on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {salonData.services.map((service) => (
            <div
              key={service.id}
              className="group relative bg-white rounded-xl p-6 border border-[#E9DFD7] hover:border-[#CFBEB2] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Top card row: clean unboxed metadata + duration */}
                <div className="flex items-center justify-between text-xs text-[#7F6F66] mb-3">
                  <div className="flex items-center gap-1.5 font-medium text-[#8C6D62]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{service.category}</span>
                  </div>

                  <div className="flex items-center gap-1 text-[#7F6F66]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{service.duration}</span>
                  </div>
                </div>

                {/* Service Title */}
                <h3 className="text-lg font-bold text-[#2A221E] group-hover:text-[#8C6D62] transition-colors">
                  {service.title}
                </h3>
                <p className="font-serif-brand text-xs text-[#9B8C83] mt-0.5 mb-3 italic">
                  {service.englishTitle}
                </p>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#5C4F47] leading-relaxed mb-5">
                  {service.description}
                </p>

                {/* Features list */}
                <ul className="space-y-2 mb-6 border-t border-[#F2ECE6] pt-4">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-[#63554D]">
                      <Check className="w-3.5 h-3.5 text-[#8C6D62] shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom Card Area: Price & Action */}
              <div className="pt-4 border-t border-[#F2ECE6] flex items-center justify-between">
                <div>
                  <span className="block text-[11px] text-[#8F7F76]">تعرفه پایه</span>
                  <span className="font-bold text-base text-[#2E2521] tabular-nums">
                    {service.price}
                  </span>
                </div>

                <button
                  onClick={() => onSelectServiceForBooking(service)}
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#2E2521] bg-[#F4EDE7] hover:bg-[#E9DFD7] active:scale-[0.98] rounded-md transition-all cursor-pointer"
                >
                  <span>انتخاب و رزرو</span>
                  <ArrowLeft className="w-3.5 h-3.5 text-[#6B5A51]" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Reassurance note */}
        <div className="mt-12 text-center text-xs text-[#7F7068] bg-[#F7F2EC] p-4 rounded-lg border border-[#EBE2D9] max-w-2xl mx-auto">
          <p>
            کلیه قیمت‌ها شفاف و شامل مواد مصرفی استاندارد است. برای دیزاین‌های خاص و نگین‌گذاری‌های اختصاصی، پیش از شروع مشاوره کامل انجام می‌گردد.
          </p>
        </div>

      </div>
    </section>
  );
};
