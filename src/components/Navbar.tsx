import React, { useState, useEffect } from 'react';
import { Menu, X, Calendar, Sparkles } from 'lucide-react';
import { salonData } from '../data/salonData';

interface NavbarProps {
  onOpenBooking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#hero', label: 'صفحه اصلی' },
    { href: '#about', label: 'درباره من' },
    { href: '#services', label: 'خدمات' },
    { href: '#portfolio', label: 'نمونه‌کارها' },
    { href: '#contact', label: 'تماس' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FAF8F5]/95 backdrop-blur-md shadow-xs border-b border-[#EAE3DB]'
          : 'bg-transparent border-b border-[#EAE3DB]/40'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 sm:h-20 flex items-center justify-between">
        {/* Zone 1: Single text wordmark with subtle bilingual harmony */}
        <a
          href="#hero"
          className="group flex items-baseline gap-2 text-decoration-none focus-visible:outline-2 focus-visible:outline-[#8C6D62] rounded-sm py-1"
          aria-label="نیوشا - خدمات تخصصی ناخن"
        >
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#2D2622]">
            {salonData.brand.persianName}
          </span>
          <span className="font-serif-brand italic text-sm text-[#8C6D62] tracking-wider font-medium">
            {salonData.brand.englishName}
          </span>
        </a>

        {/* Zone 2: Desktop clean text navigation links with subtle underline */}
        <nav
          className="hidden md:flex items-center gap-7 lg:gap-9 text-sm font-medium text-[#5A4F48]"
          aria-label="منوی اصلی"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative py-1 transition-colors hover:text-[#2D2622] group"
            >
              <span>{link.label}</span>
              <span className="absolute bottom-0 right-0 left-0 h-0.5 bg-[#8C6D62] scale-x-0 group-hover:scale-x-100 transition-transform origin-right duration-200" />
            </a>
          ))}
        </nav>

        {/* Zone 3: Primary action + Mobile toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenBooking}
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-medium text-white bg-[#332A26] hover:bg-[#4A3D37] active:scale-[0.98] transition-all rounded-md shadow-xs whitespace-nowrap cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-[#E5D4D0]" />
            <span>رزرو نوبت</span>
          </button>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            aria-label={mobileMenuOpen ? 'بستن منو' : 'باز کردن منو'}
            className="md:hidden p-2 text-[#2D2622] hover:text-[#8C6D62] focus-visible:ring-2 focus-visible:ring-[#8C6D62] rounded-md transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#EAE3DB] bg-[#FAF8F5] px-4 pt-3 pb-6 shadow-md animate-fadeIn">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 text-sm font-medium text-[#3D342F] hover:bg-[#F3EBE3] rounded-md transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full py-3 text-center text-sm font-medium text-white bg-[#332A26] rounded-md shadow-xs flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#E5D4D0]" />
                <span>رزرو نوبت آنلاین</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
