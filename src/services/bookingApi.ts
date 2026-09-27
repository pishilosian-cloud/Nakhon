import { Appointment, AvailableSlot, CreateAppointmentInput, WorkingScheduleConfig } from '../types';

export interface AvailableSlotsResponse {
  isClosed: boolean;
  closedReason?: string;
  slots: AvailableSlot[];
}

export interface BookingResponse {
  success: boolean;
  appointment?: Appointment;
  error?: string;
}

export class BookingApiService {
  private baseUrl = '/api';

  /**
   * Fetch current working schedule and services
   */
  async getScheduleConfig(): Promise<{ schedule: WorkingScheduleConfig; services: any[] }> {
    const res = await fetch(`${this.baseUrl}/schedule-config`);
    if (!res.ok) {
      throw new Error('خطا در دریافت اطلاعات زمان‌بندی');
    }
    return res.json();
  }

  /**
   * Fetch available slots for a specific date (YYYY-MM-DD)
   */
  async getAvailableSlots(date: string): Promise<AvailableSlotsResponse> {
    const res = await fetch(`${this.baseUrl}/appointments/available-slots?date=${encodeURIComponent(date)}`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'خطا در دریافت زمان‌های آزاد');
    }
    return data;
  }

  /**
   * Create an appointment (with atomic server double-booking check)
   */
  async createAppointment(input: CreateAppointmentInput): Promise<BookingResponse> {
    try {
      const res = await fetch(`${this.baseUrl}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          error: data.error || (res.status === 409
            ? 'این زمان قبلاً رزرو شده است. لطفاً زمان دیگری را انتخاب کنید.'
            : 'خطا در ثبت نوبت. لطفاً دوباره تلاش کنید.'),
        };
      }

      return {
        success: true,
        appointment: data.appointment,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'خطا در برقراری ارتباط با سرور',
      };
    }
  }

  /**
   * Get appointment by ID
   */
  async getAppointment(id: string): Promise<Appointment | null> {
    const res = await fetch(`${this.baseUrl}/appointments/${encodeURIComponent(id)}`);
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('خطا در دریافت مشخصات نوبت');
    }
    return res.json();
  }
}

export const bookingApi = new BookingApiService();
