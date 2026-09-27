import fs from 'fs';
import path from 'path';
import { Appointment, AvailableSlot, CreateAppointmentInput, WorkingScheduleConfig } from '../src/types';
import { salonData } from '../src/data/salonData';

export interface IAppointmentStorage {
  getAllAppointments(): Promise<Appointment[]>;
  getAppointmentById(id: string): Promise<Appointment | null>;
  getAppointmentsByDate(date: string): Promise<Appointment[]>;
  createAppointment(
    input: CreateAppointmentInput,
    serviceTitle: string
  ): Promise<{ success: boolean; appointment?: Appointment; error?: string }>;
  getScheduleConfig(): Promise<WorkingScheduleConfig>;
  getAvailableSlots(date: string): Promise<{ isClosed: boolean; closedReason?: string; slots: AvailableSlot[] }>;
}

export class FileAppointmentStorage implements IAppointmentStorage {
  private dataDir: string;
  private filePath: string;
  private appointments: Appointment[] = [];
  private isLoaded = false;
  private writeLock = false;

  constructor() {
    this.dataDir = path.resolve(process.cwd(), 'data');
    this.filePath = path.join(this.dataDir, 'appointments.json');
    this.initStorage();
  }

  private initStorage() {
    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }

      if (fs.existsSync(this.filePath)) {
        const fileContent = fs.readFileSync(this.filePath, 'utf-8');
        this.appointments = JSON.parse(fileContent);
      } else {
        // Seed initial sample bookings for demonstration and verification
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];

        this.appointments = [
          {
            id: 'NW-10492',
            service: 'کاشت ناخن تخصصی',
            serviceId: 'kasht',
            date: tomorrowStr,
            time: '11:00',
            customerName: 'مریم احمدی',
            phone: '09121112233',
            note: 'طراحی بادامی',
            status: 'confirmed',
            createdAt: new Date().toISOString()
          },
          {
            id: 'NW-10493',
            service: 'ژلیش و لمینت (استحکام‌سازی)',
            serviceId: 'gel',
            date: tomorrowStr,
            time: '16:00',
            customerName: 'رویا حسینی',
            phone: '09124445566',
            note: 'رنگ شیری شاین',
            status: 'pending',
            createdAt: new Date().toISOString()
          }
        ];
        fs.writeFileSync(this.filePath, JSON.stringify(this.appointments, null, 2), 'utf-8');
      }
      this.isLoaded = true;
    } catch (err) {
      console.error('Error initializing appointment storage:', err);
      this.appointments = [];
      this.isLoaded = true;
    }
  }

  private async persist(): Promise<void> {
    while (this.writeLock) {
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
    this.writeLock = true;
    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }
      fs.writeFileSync(this.filePath, JSON.stringify(this.appointments, null, 2), 'utf-8');
    } finally {
      this.writeLock = false;
    }
  }

  async getAllAppointments(): Promise<Appointment[]> {
    return [...this.appointments];
  }

  async getAppointmentById(id: string): Promise<Appointment | null> {
    const found = this.appointments.find((a) => a.id === id);
    return found ? { ...found } : null;
  }

  async getAppointmentsByDate(date: string): Promise<Appointment[]> {
    return this.appointments.filter(
      (a) => a.date === date && a.status !== 'cancelled'
    );
  }

  async getScheduleConfig(): Promise<WorkingScheduleConfig> {
    return { ...salonData.schedule };
  }

  /**
   * Generates all available slots for a given date
   */
  async getAvailableSlots(date: string): Promise<{ isClosed: boolean; closedReason?: string; slots: AvailableSlot[] }> {
    const schedule = salonData.schedule;
    const targetDate = new Date(date + 'T00:00:00');
    
    // Check if invalid date
    if (isNaN(targetDate.getTime())) {
      return { isClosed: true, closedReason: 'تاریخ نامعتبر است', slots: [] };
    }

    // Check past date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(targetDate);
    checkDate.setHours(0, 0, 0, 0);

    if (checkDate < today) {
      return { isClosed: true, closedReason: 'امکان رزرو در تاریخ‌های گذشته وجود ندارد', slots: [] };
    }

    // Check specific closed dates
    if (schedule.closedDates.includes(date)) {
      return { isClosed: true, closedReason: 'سالن در این تاریخ تعطیل می‌باشد', slots: [] };
    }

    // Check working days
    // targetDate.getDay(): 0=Sun, 1=Mon, ..., 6=Sat
    const dayOfWeek = targetDate.getDay();
    if (!schedule.workingDays.includes(dayOfWeek)) {
      return { isClosed: true, closedReason: 'سالن در روز جمعه تعطیل می‌باشد', slots: [] };
    }

    // Generate timeslots from openingTime to closingTime
    const [openH, openM] = schedule.openingTime.split(':').map(Number);
    const [closeH, closeM] = schedule.closingTime.split(':').map(Number);

    const openMinutes = openH * 60 + openM;
    const closeMinutes = closeH * 60 + closeM;
    const interval = schedule.appointmentInterval || 60;

    const existingAppointments = await this.getAppointmentsByDate(date);
    const bookedTimes = new Set(existingAppointments.map((a) => a.time));

    const slots: AvailableSlot[] = [];

    // Current time check if selecting today
    const isToday = checkDate.getTime() === today.getTime();
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    for (let m = openMinutes; m < closeMinutes; m += interval) {
      const hStr = String(Math.floor(m / 60)).padStart(2, '0');
      const mStr = String(m % 60).padStart(2, '0');
      const timeStr = `${hStr}:${mStr}`;

      // Check breaks
      const isBreak = schedule.breaks.some((b) => {
        const [bStartH, bStartM] = b.start.split(':').map(Number);
        const [bEndH, bEndM] = b.end.split(':').map(Number);
        const bStart = bStartH * 60 + bStartM;
        const bEnd = bEndH * 60 + bEndM;
        return m >= bStart && m < bEnd;
      });

      if (isBreak) {
        slots.push({
          time: timeStr,
          isAvailable: false,
          reason: 'زمان استراحت و استریل'
        });
        continue;
      }

      // Check if time has already passed today
      if (isToday && m <= currentMinutes + 30) {
        slots.push({
          time: timeStr,
          isAvailable: false,
          reason: 'گذشته از زمان'
        });
        continue;
      }

      // Check if already booked
      if (bookedTimes.has(timeStr)) {
        slots.push({
          time: timeStr,
          isAvailable: false,
          reason: 'قبلاً رزرو شده است'
        });
        continue;
      }

      slots.push({
        time: timeStr,
        isAvailable: true
      });
    }

    return { isClosed: false, slots };
  }

  /**
   * Atomic appointment creation with double-booking lock
   */
  async createAppointment(
    input: CreateAppointmentInput,
    serviceTitle: string
  ): Promise<{ success: boolean; appointment?: Appointment; error?: string }> {
    // Check if slot is already reserved (where status is not cancelled)
    const conflict = this.appointments.find(
      (a) => a.date === input.date && a.time === input.time && a.status !== 'cancelled'
    );

    if (conflict) {
      return {
        success: false,
        error: 'این زمان قبلاً رزرو شده است. لطفاً زمان دیگری را انتخاب کنید.'
      };
    }

    // Generate readable random booking ID (e.g., NW-73921)
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const newId = `NW-${randomSuffix}`;

    const newAppointment: Appointment = {
      id: newId,
      service: serviceTitle,
      serviceId: input.serviceId,
      date: input.date,
      time: input.time,
      customerName: input.customerName.trim(),
      phone: input.phone.trim(),
      note: input.note ? input.note.trim() : undefined,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    this.appointments.push(newAppointment);
    await this.persist();

    return {
      success: true,
      appointment: newAppointment
    };
  }
}

// Global singleton storage instance
export const appointmentStorage = new FileAppointmentStorage();
