/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Services } from './components/Services';
import { Portfolio } from './components/Portfolio';
import { BookingCta } from './components/BookingCta';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { ServiceItem } from './types';

export default function App() {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const handleOpenBooking = () => {
    setSelectedService(null);
    setBookingModalOpen(true);
  };

  const handleSelectServiceForBooking = (service: ServiceItem) => {
    setSelectedService(service);
    setBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2D2622] flex flex-col antialiased selection:bg-[#EAE0D7] selection:text-[#2D2622]" dir="rtl">
      {/* Sticky Responsive Top Navbar */}
      <Navbar onOpenBooking={handleOpenBooking} />

      {/* Main Content Area */}
      <main className="flex-grow">
        {/* 1. Hero Section */}
        <Hero onOpenBooking={handleOpenBooking} />

        {/* 2. About Niwsha */}
        <About />

        {/* 3. Services Menu */}
        <Services onSelectServiceForBooking={handleSelectServiceForBooking} />

        {/* 4. Portfolio Showcase & Gallery */}
        <Portfolio />

        {/* 5. Booking CTA */}
        <BookingCta onOpenBooking={handleOpenBooking} />

        {/* 6. Contact & Direct Consultation */}
        <Contact />
      </main>

      {/* 7. Footer */}
      <Footer />

      {/* Stage 1 Booking Modal Preview */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        selectedService={selectedService}
      />
    </div>
  );
}
