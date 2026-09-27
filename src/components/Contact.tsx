import React, { useState } from 'react';
import { Instagram, Send, Phone, MapPin, Clock, Copy, Check, MessageSquare } from 'lucide-react';
import { salonData } from '../data/salonData';

export const Contact: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleCopyPhone = () => {
    navigator.clipboard?.writeText(salonData.contact.phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleConsultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setSenderName('');
      setSenderPhone('');
      setMessage('');
    }, 4000);
  };

  return (
    <section id="contact" className="py-20 sm:py-28 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-14 sm:mb-16">
          <p className="text-xs sm:text-sm font-medium text-[#8C6D62] tracking-wider mb-2">
            ارتباط و دسترسی
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#28211E] tracking-tight">
            تماس با استودیو نیوشا
          </h2>
          <div className="w-12 h-0.5 bg-[#8C6D62] mx-auto mt-4 rounded-full" />
          <p className="mt-3 text-sm sm:text-base text-[#685A52]">
            جهت رزرو نوبت، استعلام زمان‌های خالی و مشاوره تخصصی قبل از نوبت
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Contact Details & Cards (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Phone Card */}
            <div className="p-5 bg-white rounded-xl border border-[#E8DDD4] shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-lg bg-[#F4EDE7] text-[#8C6D62] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-[#7F6F66]">شماره تماس و هماهنگی</p>
                  <p className="font-bold text-sm sm:text-base text-[#2C231F] mt-0.5" dir="ltr">
                    {salonData.contact.phone}
                  </p>
                  <p className="text-[11px] text-[#A39288] mt-0.5">
                    (پلیس‌هولدر: جایگزین با شماره اختصاصی سالن در فاز بعدی)
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyPhone}
                className="px-3 py-2 text-xs font-medium text-[#3D322C] bg-[#F3EBE3] hover:bg-[#EAE0D7] rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#8C6D62]" />}
                <span>{copied ? 'کپی شد' : 'کپی شماره'}</span>
              </button>
            </div>

            {/* Social Channels: Instagram & Telegram */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Instagram */}
              <div className="p-5 bg-white rounded-xl border border-[#E8DDD4] shadow-xs flex flex-col justify-between">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[#FAF0EC] text-[#9A6251] flex items-center justify-center shrink-0">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-[#7F6F66]">اینستاگرام نیوشا</p>
                    <p className="font-bold text-xs sm:text-sm text-[#2C231F]" dir="ltr">
                      {salonData.contact.instagram}
                    </p>
                  </div>
                </div>
                <div className="text-[11px] text-[#8C7D74] mb-3">
                  مشاهده استوری‌های روزانه و استعلام کنسلی‌ها
                </div>
                <a
                  href={salonData.contact.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full text-center py-2 text-xs font-medium text-[#3E322C] bg-[#F7F2EC] hover:bg-[#EEE5DC] rounded-md transition-colors"
                >
                  صفحه اینستاگرام (Placeholder)
                </a>
              </div>

              {/* Telegram */}
              <div className="p-5 bg-white rounded-xl border border-[#E8DDD4] shadow-xs flex flex-col justify-between">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[#EDF3F7] text-[#4A7292] flex items-center justify-center shrink-0">
                    <Send className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-[#7F6F66]">کانال و پیام‌رسان تلگرام</p>
                    <p className="font-bold text-xs sm:text-sm text-[#2C231F]" dir="ltr">
                      {salonData.contact.telegram}
                    </p>
                  </div>
                </div>
                <div className="text-[11px] text-[#8C7D74] mb-3">
                  پاسخگویی سریع به پیام‌ها و کاتالوگ مدل‌ها
                </div>
                <a
                  href={salonData.contact.telegramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full text-center py-2 text-xs font-medium text-[#3E322C] bg-[#F7F2EC] hover:bg-[#EEE5DC] rounded-md transition-colors"
                >
                  ارسال پیام تلگرام (Placeholder)
                </a>
              </div>
            </div>

            {/* Address & Hours */}
            <div className="p-5 bg-white rounded-xl border border-[#E8DDD4] shadow-xs space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#F4EDE7] text-[#8C6D62] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-[#7F6F66]">نشانی سالن</p>
                  <p className="font-semibold text-xs sm:text-sm text-[#2C231F] mt-0.5 leading-relaxed">
                    {salonData.contact.address}
                  </p>
                  <p className="text-[11px] text-[#8C7E76] mt-1">
                    {salonData.contact.locationNote}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#F3EAE1] flex items-center gap-3 text-xs text-[#5D5047]">
                <Clock className="w-4 h-4 text-[#8C6D62] shrink-0" />
                <span>{salonData.contact.workingHours}</span>
              </div>
            </div>

          </div>

          {/* Quick Inquiry / Message Form (5 cols on lg) */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-xl border border-[#E8DDD4] shadow-xs">
            <div className="flex items-center gap-2 text-xs text-[#8C6D62] font-semibold mb-2">
              <MessageSquare className="w-4 h-4" />
              <span>مشاوره و استعلام سریع</span>
            </div>
            <h3 className="font-bold text-base sm:text-lg text-[#2A211D] mb-1">
              پیام مستقیم به نیوشا
            </h3>
            <p className="text-xs text-[#76675E] mb-5 leading-normal">
              سوالی درباره طراحی، ترمیم یا متریال دارید؟ پیام خود را بگذارید تا با شما تماس گرفته شود.
            </p>

            {formSubmitted ? (
              <div className="p-4 rounded-lg bg-[#F4EDE7] text-center space-y-2 animate-fadeIn">
                <div className="w-10 h-10 rounded-full bg-[#E5D7CD] text-[#8C6D62] flex items-center justify-center mx-auto">
                  <Check className="w-5 h-5" />
                </div>
                <p className="font-bold text-sm text-[#2E241F]">پیام شما ثبت گردید</p>
                <p className="text-xs text-[#6F6057]">
                  با تشکر از شما؛ نیوشا در اولین فرصت با شما تماس خواهد گرفت.
                </p>
              </div>
            ) : (
              <form onSubmit={handleConsultSubmit} className="space-y-3.5">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-semibold text-[#423630] mb-1">
                    نام شما
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder="مثال: مریم احمدی"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-[#DCD1C7] bg-[#FAF8F5] text-[#2B231F] focus:outline-none focus:ring-2 focus:ring-[#8C6D62]"
                  />
                </div>

                <div>
                  <label htmlFor="contact-phone" className="block text-xs font-semibold text-[#423630] mb-1">
                    شماره همراه
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    required
                    placeholder="۰۹۱۲XXXXXXX"
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-[#DCD1C7] bg-[#FAF8F5] text-[#2B231F] focus:outline-none focus:ring-2 focus:ring-[#8C6D62] text-left"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-semibold text-[#423630] mb-1">
                    متن سوال یا نوع خدمت درخواستی
                  </label>
                  <textarea
                    id="contact-message"
                    rows={3}
                    required
                    placeholder="درخواست مشاوره، هزینه طرح یا بررسی وضعیت ناخن..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-[#DCD1C7] bg-[#FAF8F5] text-[#2B231F] focus:outline-none focus:ring-2 focus:ring-[#8C6D62]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#2F2622] hover:bg-[#463933] text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-all active:scale-[0.99] cursor-pointer"
                >
                  ارسال پیام مشاوره
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
