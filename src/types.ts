export type PortfolioCategory = 'all' | 'kasht' | 'gel' | 'tarahi' | 'tarmim';

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface ServiceItem {
  id: string;
  title: string;
  category: string;
  englishTitle: string;
  description: string;
  duration: string;
  price: string;
  badge?: string;
  features: string[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'kasht' | 'gel' | 'tarahi' | 'tarmim';
  categoryLabel: string;
  imageUrl: string;
  technique: string;
  shape: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  service: string;
  comment: string;
  date: string;
  rating: number;
}

export interface Appointment {
  id: string;
  service: string;
  serviceId: string;
  date: string; // ISO format: YYYY-MM-DD
  time: string; // 24h format: HH:mm (e.g. "10:00")
  customerName: string;
  phone: string;
  note?: string;
  status: AppointmentStatus;
  createdAt: string; // ISO string
}

export interface CreateAppointmentInput {
  serviceId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  customerName: string;
  phone: string;
  note?: string;
}

export interface WorkingScheduleConfig {
  workingDays: number[]; // 0: Sunday, 1: Monday, 2: Tuesday, 3: Wednesday, 4: Thursday, 5: Friday, 6: Saturday
  openingTime: string; // e.g. "10:00"
  closingTime: string; // e.g. "19:00"
  appointmentInterval: number; // in minutes, e.g. 60
  breaks: {
    start: string;
    end: string;
    label: string;
  }[];
  closedDates: string[]; // YYYY-MM-DD
}

export interface AvailableSlot {
  time: string;
  isAvailable: boolean;
  reason?: string;
}

export interface SalonConfig {
  brand: {
    persianName: string;
    englishName: string;
    tagline: string;
    subTagline: string;
    experienceYears: string;
    clientsCount: string;
    heroImage: string;
    artistImage: string;
  };
  about: {
    title: string;
    subtitle: string;
    bioParagraphs: string[];
    highlights: {
      title: string;
      description: string;
    }[];
  };
  services: ServiceItem[];
  portfolioCategories: {
    key: PortfolioCategory;
    label: string;
  }[];
  portfolio: PortfolioItem[];
  schedule: WorkingScheduleConfig;
  contact: {
    instagram: string;
    instagramUrl: string;
    telegram: string;
    telegramUrl: string;
    phone: string;
    phoneDisplay: string;
    address: string;
    locationNote: string;
    workingHours: string;
  };
}
