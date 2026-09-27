import React, { useState, useMemo } from 'react';
import { ChevronRight, ChevronLeft, Calendar as CalendarIcon } from 'lucide-react';
import {
  gregorianToJalali,
  jalaliToGregorian,
  getJalaliMonthDaysCount,
  toPersianDigits,
  toISODateString,
  PERSIAN_MONTH_NAMES,
  PERSIAN_WEEKDAY_SHORT
} from '../utils/jalali';
import { WorkingScheduleConfig } from '../types';

interface PersianDatePickerProps {
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (date: string) => void;
  schedule: WorkingScheduleConfig;
}

export const PersianDatePicker: React.FC<PersianDatePickerProps> = ({
  selectedDate,
  onSelectDate,
  schedule
}) => {
  // Current real date
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const todayJalali = useMemo(() => {
    return gregorianToJalali(today.getFullYear(), today.getMonth() + 1, today.getDate());
  }, [today]);

  // Calendar view year and month (in Jalali)
  const [viewYear, setViewYear] = useState<number>(() => {
    if (selectedDate) {
      const parts = selectedDate.split('-').map(Number);
      return gregorianToJalali(parts[0], parts[1], parts[2]).jy;
    }
    return todayJalali.jy;
  });

  const [viewMonth, setViewMonth] = useState<number>(() => {
    if (selectedDate) {
      const parts = selectedDate.split('-').map(Number);
      return gregorianToJalali(parts[0], parts[1], parts[2]).jm;
    }
    return todayJalali.jm;
  });

  // Calculate days for the current Jalali month
  const daysInMonth = useMemo(() => {
    return getJalaliMonthDaysCount(viewYear, viewMonth);
  }, [viewYear, viewMonth]);

  // Calculate starting weekday for day 1 of this Jalali month
  // Persian week starts with Saturday (شنبه = 0 in our grid)
  const startDayOffset = useMemo(() => {
    const gFirst = jalaliToGregorian(viewYear, viewMonth, 1);
    const dateObj = new Date(gFirst.gy, gFirst.gm - 1, gFirst.gd);
    const gWeekday = dateObj.getDay(); // 0: Sun, 1: Mon, ..., 6: Sat
    // Convert to Persian weekday index: 0: شنبه (Sat=6), 1: یکشنبه (Sun=0), 2: دوشنبه (Mon=1)...
    const persianWeekdayIndex = (gWeekday + 1) % 7;
    return persianWeekdayIndex;
  }, [viewYear, viewMonth]);

  // Can we navigate to previous month?
  const canGoPrev = useMemo(() => {
    if (viewYear > todayJalali.jy) return true;
    if (viewYear === todayJalali.jy && viewMonth > todayJalali.jm) return true;
    return false;
  }, [viewYear, viewMonth, todayJalali]);

  const handlePrevMonth = () => {
    if (!canGoPrev) return;
    if (viewMonth === 1) {
      setViewYear((y) => y - 1);
      setViewMonth(12);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 12) {
      setViewYear((y) => y + 1);
      setViewMonth(1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // Quick select helper
  const handleQuickSelect = (offsetDays: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + offsetDays);
    const iso = toISODateString(d);
    
    // Check if valid working day
    if (!schedule.workingDays.includes(d.getDay())) return;
    if (schedule.closedDates.includes(iso)) return;

    onSelectDate(iso);
    const j = gregorianToJalali(d.getFullYear(), d.getMonth() + 1, d.getDate());
    setViewYear(j.jy);
    setViewMonth(j.jm);
  };

  return (
    <div className="bg-white rounded-xl border border-[#E8DFD7] p-4 sm:p-5 shadow-xs select-none">
      {/* Quick Select Row */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#F0E8E1] overflow-x-auto scrollbar-none">
        <span className="text-[11px] font-medium text-[#8F7F76] shrink-0">انتخاب سریع:</span>
        <button
          type="button"
          onClick={() => handleQuickSelect(0)}
          className="px-2.5 py-1 text-xs rounded-md bg-[#F4EDE7] hover:bg-[#EBE0D7] text-[#42352F] transition-colors shrink-0 cursor-pointer"
        >
          امروز
        </button>
        <button
          type="button"
          onClick={() => handleQuickSelect(1)}
          className="px-2.5 py-1 text-xs rounded-md bg-[#F4EDE7] hover:bg-[#EBE0D7] text-[#42352F] transition-colors shrink-0 cursor-pointer"
        >
          فردا
        </button>
        <button
          type="button"
          onClick={() => handleQuickSelect(2)}
          className="px-2.5 py-1 text-xs rounded-md bg-[#F4EDE7] hover:bg-[#EBE0D7] text-[#42352F] transition-colors shrink-0 cursor-pointer"
        >
          پس‌فردا
        </button>
      </div>

      {/* Month Header Navigation */}
      <div className="flex items-center justify-between mb-4">
        {/* RTL: Next is on Left or Right depending on preference */}
        <button
          type="button"
          onClick={handlePrevMonth}
          disabled={!canGoPrev}
          aria-label="ماه قبل"
          className={`p-1.5 rounded-lg border border-[#E8DDD4] text-[#55463E] transition-colors ${
            canGoPrev ? 'hover:bg-[#F5ECE5] cursor-pointer' : 'opacity-30 cursor-not-allowed'
          }`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5 font-bold text-sm sm:text-base text-[#2C231F]">
          <CalendarIcon className="w-4 h-4 text-[#8C6D62]" />
          <span>
            {PERSIAN_MONTH_NAMES[viewMonth - 1]} {toPersianDigits(viewYear)}
          </span>
        </div>

        <button
          type="button"
          onClick={handleNextMonth}
          aria-label="ماه بعد"
          className="p-1.5 rounded-lg border border-[#E8DDD4] hover:bg-[#F5ECE5] text-[#55463E] transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Weekdays Header */}
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['شنبه', '۱ش', '۲ش', '۳ش', '۴ش', '۵ش', 'جمعه'].map((day, idx) => (
          <div
            key={idx}
            className={`text-[11px] font-medium py-1 ${
              idx === 6 ? 'text-[#B87063]' : 'text-[#8A796F]'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5 text-center">
        {/* Leading empty days */}
        {Array.from({ length: startDayOffset }).map((_, idx) => (
          <div key={`empty-${idx}`} className="aspect-square" />
        ))}

        {/* Days of current Jalali month */}
        {Array.from({ length: daysInMonth }).map((_, idx) => {
          const dayNumber = idx + 1;
          const gDate = jalaliToGregorian(viewYear, viewMonth, dayNumber);
          const dateObj = new Date(gDate.gy, gDate.gm - 1, gDate.gd);
          dateObj.setHours(0, 0, 0, 0);

          const isoString = toISODateString(dateObj);
          const isSelected = selectedDate === isoString;
          const isToday = dateObj.getTime() === today.getTime();
          const isPast = dateObj.getTime() < today.getTime();

          // Working day check (getDay(): 0=Sun, 1=Mon, ..., 5=Fri, 6=Sat)
          const isClosedDay = !schedule.workingDays.includes(dateObj.getDay());
          const isSpecialClosed = schedule.closedDates.includes(isoString);
          const isDisabled = isPast || isClosedDay || isSpecialClosed;

          let tooltip = '';
          if (isPast) tooltip = 'تاریخ سپری شده';
          else if (isClosedDay) tooltip = 'روز تعطیل سالن';
          else if (isSpecialClosed) tooltip = 'تعطیل رسمی / سالن';

          return (
            <button
              key={dayNumber}
              type="button"
              disabled={isDisabled}
              title={tooltip}
              onClick={() => onSelectDate(isoString)}
              className={`aspect-square w-full rounded-lg text-xs sm:text-sm font-medium flex flex-col items-center justify-center transition-all relative ${
                isSelected
                  ? 'bg-[#2E2420] text-white shadow-xs font-bold scale-105'
                  : isDisabled
                  ? 'text-[#C5B7AE] bg-transparent cursor-not-allowed'
                  : 'text-[#3E322C] hover:bg-[#F3EBE3] hover:text-[#2E2420] cursor-pointer'
              } ${isToday && !isSelected ? 'border border-[#8C6D62] text-[#8C6D62] font-bold' : ''}`}
            >
              <span>{toPersianDigits(dayNumber)}</span>
              {isToday && !isSelected && (
                <span className="w-1 h-1 rounded-full bg-[#8C6D62] mt-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend footer */}
      <div className="mt-4 pt-3 border-t border-[#F2ECE6] flex flex-wrap items-center justify-between text-[11px] text-[#8A7A71]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm border border-[#8C6D62]" />
          <span>امروز</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#2E2420]" />
          <span>انتخاب شده</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#EFE7E0] opacity-50" />
          <span>غیرقابل رزرو / تعطیل</span>
        </div>
      </div>
    </div>
  );
};
