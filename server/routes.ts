import { Router, Request, Response } from 'express';
import { appointmentStorage } from './storage';
import { salonData } from '../src/data/salonData';
import { isValidIranianMobile, normalizePhoneNumber } from '../src/utils/jalali';

export const apiRouter = Router();

/**
 * GET /api/schedule-config
 * Returns current schedule parameters and services list
 */
apiRouter.get('/schedule-config', async (_req: Request, res: Response) => {
  try {
    const schedule = await appointmentStorage.getScheduleConfig();
    res.json({
      schedule,
      services: salonData.services.map((s) => ({
        id: s.id,
        title: s.title,
        englishTitle: s.englishTitle,
        category: s.category,
        description: s.description,
        duration: s.duration,
        price: s.price
      }))
    });
  } catch (err) {
    console.error('Error fetching schedule config:', err);
    res.status(500).json({ error: 'خطا در دریافت تنظیمات نوبت‌دهی' });
  }
});

/**
 * GET /api/appointments/available-slots?date=YYYY-MM-DD
 * Returns all time slots with availability status for a specific date
 */
apiRouter.get('/appointments/available-slots', async (req: Request, res: Response) => {
  try {
    const date = req.query.date as string;
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ error: 'فرمت تاریخ نامعتبر است (YYYY-MM-DD)' });
    }

    const result = await appointmentStorage.getAvailableSlots(date);
    res.json(result);
  } catch (err) {
    console.error('Error getting available slots:', err);
    res.status(500).json({ error: 'خطا در استعلام زمان‌های خالی' });
  }
});

/**
 * POST /api/appointments
 * Atomically validates and books an appointment slot
 */
apiRouter.post('/appointments', async (req: Request, res: Response) => {
  try {
    const { serviceId, date, time, customerName, phone, note } = req.body;

    // 1. Validate required fields
    if (!serviceId || !date || !time || !customerName || !phone) {
      return res.status(400).json({
        error: 'لطفاً تمامی فیلدهای الزامی (خدمت، تاریخ، ساعت، نام و شماره موبایل) را وارد کنید.'
      });
    }

    // 2. Validate customerName
    if (typeof customerName !== 'string' || customerName.trim().length < 2) {
      return res.status(400).json({
        error: 'نام و نام خانوادگی باید حداقل شامل ۲ حرف باشد.'
      });
    }

    // 3. Validate service
    const targetService = salonData.services.find((s) => s.id === serviceId);
    if (!targetService) {
      return res.status(400).json({
        error: 'خدمت انتخاب شده معتبر نمی‌باشد.'
      });
    }

    // 4. Validate date format and ensure it is not in the past
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        error: 'فرمت تاریخ انتخابی نامعتبر است.'
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(date + 'T00:00:00');
    if (isNaN(targetDate.getTime()) || targetDate < today) {
      return res.status(400).json({
        error: 'امکان رزرو در تاریخ‌های گذشته وجود ندارد.'
      });
    }

    // 5. Validate Iranian phone number
    if (!isValidIranianMobile(phone)) {
      return res.status(400).json({
        error: 'شماره موبایل وارد شده معتبر نیست. لطفاً یک شماره معتبر ۱۱ رقمی (مثال: ۰۹۱۲۳۴۵۶۷۸۹) وارد کنید.'
      });
    }
    const cleanPhone = normalizePhoneNumber(phone);

    // 6. Validate time format
    if (!/^\d{2}:\d{2}$/.test(time)) {
      return res.status(400).json({
        error: 'فرمت ساعت انتخاب شده نامعتبر است.'
      });
    }

    // 7. Atomic reservation with double-booking check
    const bookingResult = await appointmentStorage.createAppointment(
      {
        serviceId,
        date,
        time,
        customerName,
        phone: cleanPhone,
        note
      },
      targetService.title
    );

    if (!bookingResult.success) {
      // Slot was already taken
      return res.status(409).json({
        error: bookingResult.error || 'این زمان قبلاً رزرو شده است. لطفاً زمان دیگری را انتخاب کنید.'
      });
    }

    return res.status(201).json({
      success: true,
      appointment: bookingResult.appointment
    });
  } catch (err) {
    console.error('Error reserving appointment:', err);
    res.status(500).json({ error: 'خطای سرور در ثبت نوبت. لطفاً مجدداً تلاش کنید.' });
  }
});

/**
 * GET /api/appointments/:id
 * Retrieve details for a specific booking
 */
apiRouter.get('/appointments/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const appointment = await appointmentStorage.getAppointmentById(id);
    if (!appointment) {
      return res.status(404).json({ error: 'نوبتی با این شناسه یافت نشد.' });
    }
    res.json(appointment);
  } catch (err) {
    console.error('Error retrieving appointment:', err);
    res.status(500).json({ error: 'خطا در دریافت اطلاعات نوبت' });
  }
});
