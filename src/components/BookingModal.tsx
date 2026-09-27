import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  X,
  Calendar,
  Clock,
  User,
  Phone,
  FileText,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Copy,
  Check,
  RotateCcw
} from 'lucide-react';
import { salonData } from '../data/salonData';
import { ServiceItem, AvailableSlot, Appointment } from '../types';
import { PersianDatePicker } from './PersianDatePicker';
import {
  formatToPersianDate,
  toPersianDigits,
  isValidIranianMobile,
  normalizePhoneNumber
} from '../utils/jalali';
import { bookingApi } from '../services/bookingApi';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedService?: ServiceItem | null;
}

type BookingStep = 1 | 2 | 3 | 4 | 5 | 6;

const STEP_TITLES = [
  { step: 1, label: 'خدمات' },
  { step: 2, label: 'تاریخ' },
  { step: 3, label: 'ساعت' },
  { step: 4, label: 'اطلاعات' },
  { step: 5, label: 'تأیید' }
];

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  selectedService: initialService
}) => {
  // Step tracker
  const [currentStep, setCurrentStep] = useState<BookingStep>(1);

  // Form State
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(''); // YYYY-MM-DD
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [note, setNote] = useState<string>('');

  // UI & Loading States
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);
  const [slotError, setSlotError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [createdAppointment, setCreatedAppointment] = useState<Appointment | null>(null);

  // Validation errors
  const [nameError, setNameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  // Reset or initialize on modal open
  useEffect(() => {
    if (isOpen) {
      if (initialService) {
        setSelectedService(initialService);
        setCurrentStep(2); // Jump to date if service was preselected
      } else if (!selectedService) {
        setSelectedService(salonData.services[0]);
      }
      setSubmitError(null);
    }
  }, [isOpen, initialService]);

  // Load available slots whenever date changes
  const fetchSlots = useCallback(async (date: string) => {
    if (!date) return;
    setLoadingSlots(true);
    setSlotError(null);
    try {
      const res = await bookingApi.getAvailableSlots(date);
      if (res.isClosed) {
        setSlotError(res.closedReason || 'سالن در این تاریخ نوبت‌دهی ندارد.');
        setAvailableSlots([]);
      } else {
        setAvailableSlots(res.slots);
      }
    } catch (err: any) {
      setSlotError(err.message || 'خطا در بارگذاری زمان‌های خالی');
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchSlots(selectedDate);
    }
  }, [selectedDate, fetchSlots]);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const orig = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = orig;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Validation handlers
  const validateStep4 = (): boolean => {
    let isValid = true;
    if (!customerName || customerName.trim().length < 2) {
      setNameError('لطفاً نام و نام‌خانوادگی خود را کامل وارد نمایید (حداقل ۲ حرف).');
      isValid = false;
    } else {
      setNameError(null);
    }

    if (!phone || !isValidIranianMobile(phone)) {
      setPhoneError('شماره موبایل نامعتبر است. لطفاً یک شماره معتبر ۱۱ رقمی (مثال: ۰۹۱۲۳۴۵۶۷۸۹) وارد کنید.');
      isValid = false;
    } else {
      setPhoneError(null);
    }

    return isValid;
  };

  // Navigation handlers
  const handleNextFromService = () => {
    if (!selectedService) return;
    setCurrentStep(2);
  };

  const handleNextFromDate = () => {
    if (!selectedDate) return;
    setCurrentStep(3);
  };

  const handleNextFromTime = () => {
    if (!selectedTime) return;
    setCurrentStep(4);
  };

  const handleNextFromInfo = () => {
    if (validateStep4()) {
      setCurrentStep(5);
    }
  };

  const handlePrevStep = () => {
    setSubmitError(null);
    if (currentStep > 1 && currentStep <= 5) {
      setCurrentStep((prev) => (prev - 1) as BookingStep);
    }
  };

  // Final submission with atomic server verification
  const handleFinalSubmit = async () => {
    if (submitting) return; // Prevent double submission
    if (!selectedService || !selectedDate || !selectedTime || !customerName || !phone) {
      setSubmitError('اطلاعات نوبت ناقص است. لطفاً به مراحل قبل بازگردید.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const response = await bookingApi.createAppointment({
        serviceId: selectedService.id,
        date: selectedDate,
        time: selectedTime,
        customerName: customerName.trim(),
        phone: normalizePhoneNumber(phone),
        note: note ? note.trim() : undefined
      });

      if (!response.success || !response.appointment) {
        setSubmitError(response.error || 'این زمان قبلاً رزرو شده است. لطفاً زمان دیگری را انتخاب کنید.');
        // If conflict, give option to pick another time
        return;
      }

      // Success! Move to Step 6
      setCreatedAppointment(response.appointment);
      setCurrentStep(6);
    } catch (err: any) {
      setSubmitError(err.message || 'خطای غیرمنتظره در ثبت نوبت');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setCurrentStep(1);
    setSelectedService(salonData.services[0]);
    setSelectedDate('');
    setSelectedTime('');
    setCustomerName('');
    setPhone('');
    setNote('');
    setSubmitError(null);
    setCreatedAppointment(null);
    onClose();
  };

  const handleCopyId = () => {
    if (createdAppointment) {
      navigator.clipboard?.writeText(createdAppointment.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2500);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#FAF8F5] rounded-2xl shadow-2xl border border-[#E8DFD7] overflow-hidden my-auto text-right flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-[#2B231F] text-white px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#DEC9BE] mb-0.5">
              <Sparkles className="w-3.5 h-3.5 text-[#E6C6B8]" />
              <span>رزرو آنلاین استودیو ناخن نیوشا</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-[#F8F4EF]">
              {currentStep === 6 ? 'رسید نهایی رزرو' : 'فرم رزرو نوبت اختصاصی'}
            </h2>
          </div>

          <button
            onClick={onClose}
            aria-label="بستن"
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar (Only visible in steps 1 to 5) */}
        {currentStep <= 5 && (
          <div className="bg-[#F3EBE3] px-4 py-3 sm:px-6 border-b border-[#E8DDD4] shrink-0">
            <div className="flex items-center justify-between max-w-md mx-auto relative">
              {/* Connecting line */}
              <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-0.5 bg-[#DDD0C5] -z-0" />
              <div
                className="absolute top-1/2 right-0 -translate-y-1/2 h-0.5 bg-[#8C6D62] transition-all duration-300 -z-0"
                style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
              />

              {STEP_TITLES.map((item) => {
                const isPassed = currentStep > item.step;
                const isCurrent = currentStep === item.step;

                return (
                  <div key={item.step} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isPassed
                          ? 'bg-[#8C6D62] text-white shadow-xs'
                          : isCurrent
                          ? 'bg-[#2B231F] text-white ring-3 ring-[#DEC9BE]'
                          : 'bg-[#EAE0D7] text-[#7A6C63]'
                      }`}
                    >
                      {isPassed ? <Check className="w-4 h-4" /> : toPersianDigits(item.step)}
                    </div>
                    <span
                      className={`text-[10px] sm:text-[11px] mt-1 font-medium whitespace-nowrap ${
                        isCurrent ? 'text-[#2B231F] font-bold' : 'text-[#85746B]'
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Modal Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-grow">
          {/* STEP 1: Select Service */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-right">
                <h3 className="font-bold text-sm sm:text-base text-[#2E2420]">
                  مرحله ۱: انتخاب خدمت مورد نظر
                </h3>
                <p className="text-xs text-[#7F7067] mt-0.5">
                  لطفاً خدمت مورد نظر را برای تعیین زمان و تعرفه انتخاب کنید:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {salonData.services.map((service) => {
                  const isSelected = selectedService?.id === service.id;
                  return (
                    <div
                      key={service.id}
                      onClick={() => setSelectedService(service)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setSelectedService(service);
                        }
                      }}
                      className={`p-3.5 sm:p-4 rounded-xl border text-right cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                        isSelected
                          ? 'bg-white border-[#8C6D62] ring-2 ring-[#8C6D62]/30 shadow-xs'
                          : 'bg-white/80 border-[#E8DDD4] hover:border-[#D5C6BA] hover:bg-white'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs text-[#8F7E75] mb-1.5">
                          <span className="font-medium text-[#8C6D62]">{service.category}</span>
                          <span className="flex items-center gap-1 text-[11px]">
                            <Clock className="w-3 h-3 text-[#A8988F]" />
                            {service.duration}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-[#2C231F]">
                          {service.title}
                        </h4>
                        <p className="text-xs text-[#6F6057] mt-1.5 line-clamp-2 leading-relaxed">
                          {service.description}
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-[#F2ECE6] flex items-center justify-between">
                        <span className="text-[11px] text-[#8C7D74]">تعرفه:</span>
                        <span className="font-bold text-xs sm:text-sm text-[#2E2420] tabular-nums">
                          {service.price}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Select Date */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-right">
                <h3 className="font-bold text-sm sm:text-base text-[#2E2420]">
                  مرحله ۲: انتخاب تاریخ نوبت
                </h3>
                <p className="text-xs text-[#7F7067] mt-0.5">
                  تقویم شمسی زیر را مشاهده و روز مورد نظر خود را انتخاب نمایید:
                </p>
              </div>

              {/* Service reminder snippet */}
              {selectedService && (
                <div className="p-2.5 rounded-lg bg-[#F3ECE5] border border-[#E6DBD1] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-[#463831]">
                    <Sparkles className="w-3.5 h-3.5 text-[#8C6D62]" />
                    <span className="font-semibold">{selectedService.title}</span>
                  </div>
                  <span className="text-[#7F6F66]">{selectedService.duration}</span>
                </div>
              )}

              {/* Persian Date Picker */}
              <PersianDatePicker
                selectedDate={selectedDate}
                onSelectDate={(newDate) => {
                  setSelectedDate(newDate);
                  setSelectedTime(''); // Reset time when date changes
                }}
                schedule={salonData.schedule}
              />

              {selectedDate && (
                <div className="p-3 bg-white rounded-lg border border-[#E5DAD1] text-xs flex items-center justify-between">
                  <span className="text-[#7D6E66]">تاریخ انتخاب شده:</span>
                  <span className="font-bold text-[#2D231F]">
                    {formatToPersianDate(selectedDate)}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Select Time */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-right">
                <h3 className="font-bold text-sm sm:text-base text-[#2E2420]">
                  مرحله ۳: انتخاب ساعت حضور در استودیو
                </h3>
                <p className="text-xs text-[#7F7067] mt-0.5">
                  ساعت‌های خالی برای {formatToPersianDate(selectedDate)}:
                </p>
              </div>

              {/* Loading spinner */}
              {loadingSlots && (
                <div className="py-12 text-center text-xs text-[#7A6A61] space-y-2">
                  <div className="w-7 h-7 border-2 border-[#8C6D62] border-t-transparent rounded-full animate-spin mx-auto" />
                  <p>در حال استعلام زمان‌های آزاد از سرور...</p>
                </div>
              )}

              {/* Error or Closed */}
              {!loadingSlots && slotError && (
                <div className="p-4 rounded-xl bg-[#FBF0EE] border border-[#E8C2BA] text-xs text-[#A14737] flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">امکان رزرو در این تاریخ وجود ندارد</p>
                    <p className="mt-1">{slotError}</p>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="mt-2 text-xs font-semibold text-[#872D1E] underline cursor-pointer"
                    >
                      تغییر تاریخ نوبت
                    </button>
                  </div>
                </div>
              )}

              {/* Slots Grid */}
              {!loadingSlots && !slotError && (
                <div className="space-y-4">
                  {availableSlots.length === 0 ? (
                    <div className="p-6 text-center text-xs text-[#7F6F66] bg-white rounded-xl border border-[#E8DDD4]">
                      هیچ زمان خالی برای این تاریخ یافت نشد. لطفاً تاریخ دیگری انتخاب کنید.
                    </div>
                  ) : (
                    <div>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                        {availableSlots.map((slot) => {
                          const isSelected = selectedTime === slot.time;
                          const isUnavailable = !slot.isAvailable;

                          return (
                            <button
                              key={slot.time}
                              type="button"
                              disabled={isUnavailable}
                              onClick={() => setSelectedTime(slot.time)}
                              title={slot.reason || (isUnavailable ? 'غیرقابل انتخاب' : 'آزاد برای رزرو')}
                              className={`p-3 rounded-lg border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                                isSelected
                                  ? 'bg-[#2E2420] text-white border-[#2E2420] shadow-xs font-bold scale-102'
                                  : isUnavailable
                                  ? 'bg-[#F2ECE6] text-[#A6978E] border-[#E8DDD4] opacity-60 cursor-not-allowed'
                                  : 'bg-white text-[#332722] border-[#E8DDD4] hover:border-[#8C6D62] hover:bg-[#FAF4EE] cursor-pointer'
                              }`}
                            >
                              <span className="font-bold text-sm tabular-nums">
                                {toPersianDigits(slot.time)}
                              </span>
                              <span className="text-[10px]">
                                {slot.isAvailable ? 'آزاد' : slot.reason || 'رزرو شده'}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#EFE7E0] flex items-center justify-between text-[11px] text-[#86766E]">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-sm bg-white border border-[#E8DDD4]" />
                          <span>زمان‌های آزاد</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-sm bg-[#F2ECE6] opacity-60" />
                          <span>رزرو شده / استراحت</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-sm bg-[#2E2420]" />
                          <span>انتخاب شما</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Customer Information */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-right">
                <h3 className="font-bold text-sm sm:text-base text-[#2E2420]">
                  مرحله ۴: مشخصات متقاضی نوبت
                </h3>
                <p className="text-xs text-[#7F7067] mt-0.5">
                  اطلاعات تماس جهت پیامک تأییدیه و هماهنگی روز نوبت استفاده خواهد شد:
                </p>
              </div>

              <div className="space-y-3.5 pt-1">
                {/* Name field */}
                <div>
                  <label htmlFor="customer-name-field" className="block text-xs font-semibold text-[#3E322C] mb-1">
                    نام و نام خانوادگی <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="customer-name-field"
                      type="text"
                      required
                      placeholder="مثال: نیلوفر افشار"
                      value={customerName}
                      onChange={(e) => {
                        setCustomerName(e.target.value);
                        if (nameError) setNameError(null);
                      }}
                      className={`w-full text-xs sm:text-sm p-3 rounded-lg border bg-white text-[#2B231F] focus:outline-none focus:ring-2 ${
                        nameError
                          ? 'border-red-400 focus:ring-red-200'
                          : 'border-[#D9CFC5] focus:ring-[#8C6D62]'
                      }`}
                    />
                    <User className="w-4 h-4 text-[#A8988F] absolute left-3 top-3.5 pointer-events-none" />
                  </div>
                  {nameError && (
                    <p className="text-[11px] text-red-600 mt-1">{nameError}</p>
                  )}
                </div>

                {/* Iranian Mobile field */}
                <div>
                  <label htmlFor="customer-phone-field" className="block text-xs font-semibold text-[#3E322C] mb-1">
                    شماره موبایل (جهت ارسال پیامک نوبت) <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="customer-phone-field"
                      type="tel"
                      required
                      dir="ltr"
                      placeholder="۰۹۱۲XXXXXXX"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (phoneError) setPhoneError(null);
                      }}
                      className={`w-full text-xs sm:text-sm p-3 rounded-lg border bg-white text-[#2B231F] text-left focus:outline-none focus:ring-2 ${
                        phoneError
                          ? 'border-red-400 focus:ring-red-200'
                          : 'border-[#D9CFC5] focus:ring-[#8C6D62]'
                      }`}
                    />
                    <Phone className="w-4 h-4 text-[#A8988F] absolute right-3 top-3.5 pointer-events-none" />
                  </div>
                  {phoneError ? (
                    <p className="text-[11px] text-red-600 mt-1">{phoneError}</p>
                  ) : (
                    <p className="text-[11px] text-[#8F7E75] mt-1">
                      فرمت معتبر: شماره‌های همراه اول، ایرانسل یا رایتل (۱۱ رقم با ۰۹)
                    </p>
                  )}
                </div>

                {/* Optional Note */}
                <div>
                  <label htmlFor="customer-note-field" className="block text-xs font-semibold text-[#3E322C] mb-1">
                    توضیحات یا درخواست خاص (اختیاری)
                  </label>
                  <div className="relative">
                    <textarea
                      id="customer-note-field"
                      rows={3}
                      placeholder="اگر کاشت قبلی دارید که نیاز به ریموو دارد، یا طرح خاصی مدنظرتان است اینجا یادداشت کنید..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="w-full text-xs sm:text-sm p-3 rounded-lg border border-[#D9CFC5] bg-white text-[#2B231F] focus:outline-none focus:ring-2 focus:ring-[#8C6D62]"
                    />
                    <FileText className="w-4 h-4 text-[#A8988F] absolute left-3 top-3 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Confirmation Summary */}
          {currentStep === 5 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-right">
                <h3 className="font-bold text-sm sm:text-base text-[#2E2420]">
                  مرحله ۵: بازبینی و تأیید نهایی نوبت
                </h3>
                <p className="text-xs text-[#7F7067] mt-0.5">
                  لطفاً خلاصه اطلاعات رزرو را بررسی فرمایید:
                </p>
              </div>

              {/* Server Conflict / Error banner */}
              {submitError && (
                <div className="p-3.5 rounded-xl bg-[#FBF0EE] border border-[#E8C2BA] text-xs text-[#A14737] flex items-start gap-2 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">{submitError}</p>
                    <p className="mt-1 text-[11px] text-[#7A362B]">
                      می‌توانید به مرحله ۳ بازگشته و ساعت دیگری را انتخاب فرمایید.
                    </p>
                  </div>
                </div>
              )}

              {/* Summary Card */}
              <div className="bg-white rounded-xl border border-[#E8DFD7] p-4 sm:p-5 space-y-3.5 text-xs sm:text-sm">
                <div className="flex items-center justify-between pb-3 border-b border-[#F2ECE6]">
                  <span className="text-[#87766E] flex items-center gap-1.5">
                    <span>💅</span>
                    <span>خدمت انتخابی:</span>
                  </span>
                  <span className="font-bold text-[#2A211D]">
                    {selectedService?.title}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-[#F2ECE6]">
                  <span className="text-[#87766E] flex items-center gap-1.5">
                    <span>📅</span>
                    <span>تاریخ نوبت:</span>
                  </span>
                  <span className="font-bold text-[#2A211D]">
                    {formatToPersianDate(selectedDate)}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-[#F2ECE6]">
                  <span className="text-[#87766E] flex items-center gap-1.5">
                    <span>⏰</span>
                    <span>ساعت حضور:</span>
                  </span>
                  <span className="font-bold text-[#2A211D] tabular-nums">
                    ساعت {toPersianDigits(selectedTime)}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-[#F2ECE6]">
                  <span className="text-[#87766E] flex items-center gap-1.5">
                    <span>👤</span>
                    <span>نام و نام خانوادگی:</span>
                  </span>
                  <span className="font-bold text-[#2A211D]">
                    {customerName}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-[#F2ECE6]">
                  <span className="text-[#87766E] flex items-center gap-1.5">
                    <span>📱</span>
                    <span>شماره تماس:</span>
                  </span>
                  <span className="font-bold text-[#2A211D] tabular-nums" dir="ltr">
                    {phone}
                  </span>
                </div>

                {note && (
                  <div className="pt-1">
                    <span className="text-[#87766E] block mb-1">📝 توضیحات تکمیلی:</span>
                    <p className="text-xs text-[#4F413A] bg-[#FAF6F2] p-2.5 rounded-lg border border-[#EDE2D8]">
                      {note}
                    </p>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between text-xs text-[#7F6F66]">
                  <span>مبلغ پایه بیعانه/تعرفه:</span>
                  <span className="font-bold text-sm text-[#8C6D62]">
                    {selectedService?.price}
                  </span>
                </div>
              </div>

              {/* Policy note */}
              <div className="text-[11px] text-[#86766E] bg-[#F7F2EC] p-3 rounded-lg border border-[#EAE0D7]">
                با کلیک روی «تأیید و ثبت نوبت»، این زمان به نام شما در سرور رزرو شده و تا تأیید نهایی، محفوظ می‌ماند.
              </div>
            </div>
          )}

          {/* STEP 6: Successful Booking Screen */}
          {currentStep === 6 && createdAppointment && (
            <div className="text-center py-4 sm:py-6 space-y-5 animate-fadeIn">
              <div className="w-16 h-16 bg-[#E8DDD4] text-[#8C6D62] rounded-full flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#28201C]">
                  نوبت شما با موفقیت ثبت شد 💅🏻
                </h3>
                <p className="text-xs sm:text-sm text-[#73635A] mt-1.5 max-w-sm mx-auto">
                  نوبت در سیستم ثبت گردید و در وضعیت <span className="font-bold text-[#8C6D62]">«در انتظار تأیید»</span> (pending) قرار دارد.
                </p>
              </div>

              {/* Booking Receipt Card */}
              <div className="max-w-md mx-auto bg-white rounded-xl border border-[#E5DAD0] p-4 sm:p-5 text-right space-y-3 text-xs sm:text-sm shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-[#F2ECE6]">
                  <span className="text-[#8C7C73]">کد پیگیری رزرو:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-base text-[#2E2420]">
                      {createdAppointment.id}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyId}
                      className="p-1 rounded bg-[#F4EDE7] hover:bg-[#EBE0D7] text-[#55463E] transition-colors cursor-pointer"
                      title="کپی شناسه"
                    >
                      {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#8C6D62]" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pb-2.5 border-b border-[#F2ECE6]">
                  <span className="text-[#8C7C73]">خدمت:</span>
                  <span className="font-semibold text-[#2E2420]">{createdAppointment.service}</span>
                </div>

                <div className="flex items-center justify-between pb-2.5 border-b border-[#F2ECE6]">
                  <span className="text-[#8C7C73]">تاریخ نوبت:</span>
                  <span className="font-semibold text-[#2E2420]">
                    {formatToPersianDate(createdAppointment.date)}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2.5 border-b border-[#F2ECE6]">
                  <span className="text-[#8C7C73]">ساعت حضور:</span>
                  <span className="font-bold text-[#2E2420] tabular-nums">
                    ساعت {toPersianDigits(createdAppointment.time)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#8C7C73]">نام متقاضی:</span>
                  <span className="font-semibold text-[#2E2420]">{createdAppointment.customerName}</span>
                </div>
              </div>

              {/* Guidance Message */}
              <div className="p-3.5 bg-[#F6EFEA] rounded-xl text-xs text-[#5D4D44] max-w-md mx-auto leading-relaxed border border-[#E9DFD6]">
                جهت هماهنگی نهایی و ارسال لوکیشن دقیق، ظرف ۲ ساعت آینده پیامکی برای شماره شما ارسال خواهد شد. در صورت نیاز می‌توانید با استودیو نیز تماس حاصل فرمایید.
              </div>

              <div className="pt-2 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-6 py-2.5 bg-[#2E2420] hover:bg-[#463932] text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  بازگشت به سایت
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions (Steps 1 to 5) */}
        {currentStep <= 5 && (
          <div className="bg-[#FAF8F5] px-4 py-3 sm:px-6 sm:py-4 border-t border-[#EAE0D7] flex items-center justify-between shrink-0">
            {/* Prev Button */}
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={submitting}
                className="inline-flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg border border-[#D9CFC5] bg-white text-xs sm:text-sm font-medium text-[#463730] hover:bg-[#F4ECE5] transition-colors cursor-pointer disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
                <span>مرحله قبل</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs sm:text-sm text-[#7D6D64] hover:text-[#2E2420] transition-colors cursor-pointer"
              >
                انصراف
              </button>
            )}

            {/* Next / Submit Button */}
            {currentStep === 1 && (
              <button
                type="button"
                onClick={handleNextFromService}
                disabled={!selectedService}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#2E2420] hover:bg-[#463A34] text-white text-xs sm:text-sm font-semibold shadow-xs transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
              >
                <span>انتخاب تاریخ</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}

            {currentStep === 2 && (
              <button
                type="button"
                onClick={handleNextFromDate}
                disabled={!selectedDate}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#2E2420] hover:bg-[#463A34] text-white text-xs sm:text-sm font-semibold shadow-xs transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
              >
                <span>مشاهده ساعت‌های خالی</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}

            {currentStep === 3 && (
              <button
                type="button"
                onClick={handleNextFromTime}
                disabled={!selectedTime}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#2E2420] hover:bg-[#463A34] text-white text-xs sm:text-sm font-semibold shadow-xs transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
              >
                <span>ورود اطلاعات تماس</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}

            {currentStep === 4 && (
              <button
                type="button"
                onClick={handleNextFromInfo}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#2E2420] hover:bg-[#463A34] text-white text-xs sm:text-sm font-semibold shadow-xs transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>پیش‌نمایش و تأیید</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}

            {currentStep === 5 && (
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 sm:px-7 sm:py-3 rounded-lg bg-[#2E2420] hover:bg-[#463A34] text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-[0.98] cursor-pointer disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>در حال ثبت نوبت...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 text-[#DEC9BE]" />
                    <span>تأیید و ثبت نوبت</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
