/**
 * Jalali (Shamsi / Persian) Date Utilities
 * Exact astronomical algorithms for Gregorian <-> Jalali conversion
 * and Persian date formatting.
 */

export interface JalaliDate {
  jy: number; // Jalali Year (e.g. 1405)
  jm: number; // Jalali Month (1-12)
  jd: number; // Jalali Day (1-31)
}

export const PERSIAN_MONTH_NAMES = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند'
];

export const PERSIAN_WEEKDAY_NAMES = [
  'یکشنبه', // 0: Sunday
  'دوشنبه', // 1: Monday
  'سه‌شنبه', // 2: Tuesday
  'چهارشنبه', // 3: Wednesday
  'پنج‌شنبه', // 4: Thursday
  'جمعه', // 5: Friday
  'شنبه' // 6: Saturday
];

export const PERSIAN_WEEKDAY_SHORT = [
  'ش', // شنبه
  'ی', // یکشنبه
  'د', // دوشنبه
  'س', // سه‌شنبه
  'چ', // چهارشنبه
  'پ', // پنج‌شنبه
  'ج' // جمعه
];

/**
 * Converts English digits to Persian digits
 */
export function toPersianDigits(input: string | number): string {
  if (input === null || input === undefined) return '';
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(input).replace(/[0-9]/g, (w) => persianDigits[parseInt(w, 10)]);
}

/**
 * Converts Persian and Arabic digits to English digits
 */
export function toEnglishDigits(str: string): string {
  if (!str) return '';
  return str
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632));
}

/**
 * Validates Iranian mobile numbers
 * Matches: 09XXXXXXXXX, +989XXXXXXXXX, 989XXXXXXXXX, 9XXXXXXXXX
 */
export function isValidIranianMobile(phone: string): boolean {
  if (!phone) return false;
  const cleanPhone = toEnglishDigits(phone).replace(/[\s\-_]/g, '');
  // Normalize
  let normalized = cleanPhone;
  if (normalized.startsWith('+98')) {
    normalized = '0' + normalized.slice(3);
  } else if (normalized.startsWith('98') && normalized.length === 12) {
    normalized = '0' + normalized.slice(2);
  } else if (normalized.length === 10 && normalized.startsWith('9')) {
    normalized = '0' + normalized;
  }
  return /^09\d{9}$/.test(normalized);
}

/**
 * Normalizes phone number to standard 09XXXXXXXXX format
 */
export function normalizePhoneNumber(phone: string): string {
  const cleanPhone = toEnglishDigits(phone).replace(/[\s\-_]/g, '');
  let normalized = cleanPhone;
  if (normalized.startsWith('+98')) {
    normalized = '0' + normalized.slice(3);
  } else if (normalized.startsWith('98') && normalized.length === 12) {
    normalized = '0' + normalized.slice(2);
  } else if (normalized.length === 10 && normalized.startsWith('9')) {
    normalized = '0' + normalized;
  }
  return normalized;
}

/**
 * Convert Gregorian date to Jalali
 */
export function gregorianToJalali(gy: number, gm: number, gd: number): JalaliDate {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let jy: number;
  if (gy > 1600) {
    jy = 979;
    gy -= 1600;
  } else {
    jy = 0;
    gy -= 621;
  }
  const gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    365 * gy +
    Math.floor((gy2 + 3) / 4) -
    Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400) -
    80 +
    gd +
    g_d_m[gm - 1];
  jy += 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  let jm: number;
  let jd: number;
  if (days < 186) {
    jm = 1 + Math.floor(days / 31);
    jd = 1 + (days % 31);
  } else {
    jm = 7 + Math.floor((days - 186) / 30);
    jd = 1 + ((days - 186) % 30);
  }
  return { jy, jm, jd };
}

/**
 * Convert Jalali date to Gregorian
 */
export function jalaliToGregorian(jy: number, jm: number, jd: number): { gy: number; gm: number; gd: number } {
  let gy: number;
  if (jy > 979) {
    gy = 1600;
    jy -= 979;
  } else {
    gy = 621;
  }
  let days =
    365 * jy +
    Math.floor(jy / 33) * 8 +
    Math.floor(((jy % 33) + 3) / 4) +
    78 +
    jd +
    (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186);
  gy += 400 * Math.floor(days / 146097);
  days %= 146097;
  if (days > 36524) {
    gy += 100 * Math.floor(--days / 36524);
    days %= 36524;
    if (days >= 365) days++;
  }
  gy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    gy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  const sal_a = [0, 31, ((gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let gm = 0;
  while (gm < 13 && days >= sal_a[gm]) {
    days -= sal_a[gm];
    gm++;
  }
  return { gy, gm, gd: days + 1 };
}

/**
 * Formats a Date object or ISO string (YYYY-MM-DD) into Persian display format
 * e.g., "شنبه، ۲ مهر ۱۴۰۵"
 */
export function formatToPersianDate(dateInput: Date | string, includeWeekday = true): string {
  const d = typeof dateInput === 'string' ? new Date(dateInput + 'T00:00:00') : dateInput;
  if (isNaN(d.getTime())) return String(dateInput);

  const j = gregorianToJalali(d.getFullYear(), d.getMonth() + 1, d.getDate());
  const monthName = PERSIAN_MONTH_NAMES[j.jm - 1];
  const weekdayName = PERSIAN_WEEKDAY_NAMES[d.getDay()];

  if (includeWeekday) {
    return `${weekdayName}، ${toPersianDigits(j.jd)} ${monthName} ${toPersianDigits(j.jy)}`;
  }
  return `${toPersianDigits(j.jd)} ${monthName} ${toPersianDigits(j.jy)}`;
}

/**
 * Format date to standard ISO YYYY-MM-DD
 */
export function toISODateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Number of days in a Jalali month
 */
export function getJalaliMonthDaysCount(jy: number, jm: number): number {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  // Esfand leap year check
  const g = jalaliToGregorian(jy, 12, 30);
  const back = gregorianToJalali(g.gy, g.gm, g.gd);
  return back.jd === 30 ? 30 : 29;
}
