import { SalonConfig } from '../types';

export const salonData: SalonConfig = {
  brand: {
    persianName: 'نیوشا',
    englishName: 'Niwsha',
    tagline: 'ظرافت، زیبایی طبیعی و ماندگاری برای دست‌های شما',
    subTagline: 'خدمات تخصصی کاشت، ژلیش، لمینت و طراحی ناخن در فضایی آرامش‌بخش و کاملاً بهداشتی',
    experienceYears: '+۵ سال تجربه',
    clientsCount: '+۱,۲۰۰ مشتری راضی',
    heroImage: '/images/niwsha_hero_nails_1790499890190.jpg',
    artistImage: '/images/niwsha_artist_portrait_1790499902980.jpg',
  },

  about: {
    title: 'درباره نیوشا',
    subtitle: 'هنرمند ناخن و متخصص سلامت و زیبایی دست‌ها',
    bioParagraphs: [
      'سلام! من نیوشا هستم، طراح و متخصص خدمات تخصصی ناخن با بیش از ۵ سال تجربه مداوم در زمینه کاشت مدرن، ژل‌پولیش و استایلینگ ناخن.',
      'باور من این است که زیبایی ناخن‌ها باید ظریف، طبیعی، متناسب با فرم دست و بدون آسیب به صدف طبیعی ناخن باشد. در سالن من، استفاده از معتبرترین متریال‌های ضدحساسیت بین‌المللی و ضدعفونی دقیق ابزارها با اتوکلاو پزشکی بالاترین اولویت را دارد.',
      'هر نوبت اختصاصی طراحی شده تا در فضایی آرام، به دور از شتاب و با بالاترین توجه به جزئیات، بهترین تجربه را برای شما رقم بزند.'
    ],
    highlights: [
      {
        title: 'متریال درجه یک ضدحساسیت',
        description: 'استفاده از ژل‌ها و ابزارهای استاندارد بدون آسیب به بستر ناخن'
      },
      {
        title: 'استریلیزاسیون پزشکی',
        description: 'ضدعفونی کلیه سرسوهان‌ها و ابزارها با پک‌های استریل یک‌بار مصرف'
      },
      {
        title: 'فرم‌دهی متناسب با فرم دست',
        description: 'طراحی آناتومیک متناسب با دست‌های شما برای زیبایی طبیعی و ماندگار'
      },
      {
        title: 'ماندگاری ۴ تا ۶ هفته',
        description: 'تکنیک اصولی بدون هواگرفتگی، شکستگی یا کدر شدن لاک‌ژل'
      }
    ]
  },

  services: [
    {
      id: 'kasht',
      title: 'کاشت ناخن تخصصی',
      category: 'کاشت',
      englishTitle: 'Nail Extension & Sculpting',
      description: 'کاشت ژل، قالب و فرمر با فرم‌دهی اصولی بر اساس آناتومی انگشتان، با طبیعی‌ترین و ظریف‌ترین ضخامت.',
      duration: '۱۲۰ دقیقه',
      price: '۷۵۰,۰۰۰ تومان',
      badge: 'پرمخاطب',
      features: ['مانیکور روسی عمیق', 'فرم‌دهی تخصصی (بادامی، مربعی، مچی)', 'پوشش با پرایمر ضدقارچ']
    },
    {
      id: 'gel',
      title: 'ژلیش و لمینت (استحکام‌سازی)',
      category: 'ژل',
      englishTitle: 'Gel Polish & Nail Overlay',
      description: 'استحکام‌سازی ناخن طبیعی بدون نیاز به تیپ، مناسب افرادی که خواهان ناخن‌های سالم، قوس استاندارد و درخشان هستند.',
      duration: '۷۵ دقیقه',
      price: '۴۵۰,۰۰۰ تومان',
      badge: 'پیشنهاد ویژه',
      features: ['تقویت صدف ناخن', 'ایجاد قوس طبیعی Apex', 'بیش از ۲۰۰ تناژ رنگی ترند']
    },
    {
      id: 'tarahi',
      title: 'طراحی ناخن ژورنالی',
      category: 'طراحی',
      englishTitle: 'Art & Minimalist Designs',
      description: 'طراحی‌های مینیمال خطی، فرنچ مدرن، داون تاون، آمبره، کروم صدفی (Glazed) و دیزاین‌های سه‌بعدی متناسب با سلیقه شما.',
      duration: '۳۰ تا ۴۵ دقیقه',
      price: 'از ۱۲۰,۰۰۰ تومان',
      features: ['فرنچ‌های مینیاتوری دقیق', 'پودرهای کروم و افکت گلیزر', 'طراحی دستی با قلم مویی']
    },
    {
      id: 'tarmim',
      title: 'ترمیم تخصصی',
      category: 'ترمیم',
      englishTitle: 'Maintenance & Refill',
      description: 'تجدید ریشه کاشت یا لمینت پس از رشد ناخن، اصلاح زاویه رشد و بازسازی براقیت ژل.',
      duration: '۹۰ دقیقه',
      price: '۵۰۰,۰۰۰ تومان',
      features: ['برداشتن بدون آسیب لایه‌های قبلی', 'مانیکور خشک تمیز', 'ژل‌پولیش مجدد']
    },
    {
      id: 'manicure',
      title: 'مانیکور کلاسیک و روسی',
      category: 'مراقبت',
      englishTitle: 'Russian & Care Manicure',
      description: 'پاکسازی دقیق کوتیکول‌ها، فرم‌دهی لبه ناخن، آبرسانی با روغن‌های ارگانیک و لایه‌برداری ملایم پوست دور ناخن.',
      duration: '۴۵ دقیقه',
      price: '۲۸۰,۰۰۰ تومان',
      features: ['استفاده از سرسوهان شنی استاندارد', 'روغن‌تراپی جوجوبا', 'ماساژ آرامش‌بخش دست']
    },
    {
      id: 'pedicure',
      title: 'پدیکور و کفسابی اسپا',
      category: 'مراقبت',
      englishTitle: 'Spa Pedicure',
      description: 'کفسابی نرم‌کننده، اسکراب نمک دریا، رفع زبری پا و ژلیش ناخن‌های پا با ماندگاری طولانی.',
      duration: '۶۰ دقیقه',
      price: '۴۹۰,۰۰۰ تومان',
      features: ['کوکتل درمانی گیاهی', 'اسکراب روغن آرگان', 'سوهان‌کشی و رفع ترک']
    }
  ],

  portfolioCategories: [
    { key: 'all', label: 'همه نمونه‌ها' },
    { key: 'kasht', label: 'کاشت' },
    { key: 'gel', label: 'ژل و لمینت' },
    { key: 'tarahi', label: 'طراحی و آرت' },
    { key: 'tarmim', label: 'ترمیم' }
  ],

  schedule: {
    workingDays: [6, 0, 1, 2, 3, 4], // شنبه تا پنج‌شنبه (جمعه تعطیل است)
    openingTime: '10:00',
    closingTime: '19:00',
    appointmentInterval: 60, // ۶۰ دقیقه برای هر نوبت
    breaks: [
      {
        start: '14:00',
        end: '15:00',
        label: 'استراحت و استریل تجهیزات'
      }
    ],
    closedDates: [] // تاریخ‌های تعطیل رسمی یا سالن
  },

  portfolio: [
    {
      id: 'p1',
      title: 'کاشت بادامی با ژل نود و لاین طلایی مینیمال',
      category: 'kasht',
      categoryLabel: 'کاشت',
      imageUrl: '/images/portfolio_nude_almond_1790499913354.jpg',
      technique: 'کاشت ژل با فرم بادامی و خطوط مینیاتوری ورق طلا',
      shape: 'بادامی کوتاه'
    },
    {
      id: 'p2',
      title: 'فرنچ مدرن میکرو با فینیش کروم گلیزرد',
      category: 'tarahi',
      categoryLabel: 'طراحی',
      imageUrl: '/images/portfolio_french_modern_1790499923138.jpg',
      technique: 'میکرو فرنچ سفید شیری با کروم شاین طبیعی',
      shape: 'مربعی ظریف'
    },
    {
      id: 'p3',
      title: 'آمبره بیبی‌بومر رزگلد با شیب ملایم',
      category: 'gel',
      categoryLabel: 'ژل',
      imageUrl: '/images/portfolio_ombre_blush_1790499934199.jpg',
      technique: 'لمینت استحکام‌بخش با گرادیان هلویی شیری',
      shape: 'بادامی کلاسیک'
    },
    {
      id: 'p4',
      title: 'استحکام‌سازی صدف طبیعی ناخن با ژل شیری ملایم',
      category: 'gel',
      categoryLabel: 'ژل',
      imageUrl: '/images/niwsha_hero_nails_1790499890190.jpg',
      technique: 'Overlay با رابر ژل هلندی و براق‌کننده شیشه‌ای',
      shape: 'طبیعی گرد'
    },
    {
      id: 'p5',
      title: 'ترمیم ۳۰ روزه کاشت ژل به همراه تغییر رنگ ترند',
      category: 'tarmim',
      categoryLabel: 'ترمیم',
      imageUrl: '/images/portfolio_nude_almond_1790499913354.jpg',
      technique: 'ترمیم بدون ایجاد پله و مانیکور دقیق کوتیکول',
      shape: 'بادامی کشیده'
    },
    {
      id: 'p6',
      title: 'دیزاین کلین‌استایل با مینی فرنچ و رینگ مرواریدی',
      category: 'tarahi',
      categoryLabel: 'طراحی',
      imageUrl: '/images/portfolio_french_modern_1790499923138.jpg',
      technique: 'طراحی خطی ظریف با لاک‌ژل سوپر پیگمنت',
      shape: 'مربعی نرم'
    },
    {
      id: 'p7',
      title: 'کاشت سالنی پودر و ژل با تم کرم کاراملی نود',
      category: 'kasht',
      categoryLabel: 'کاشت',
      imageUrl: '/images/portfolio_ombre_blush_1790499934199.jpg',
      technique: 'کاشت روسی با ژل فایبرگلاس و قوس طبیعی',
      shape: 'بادامی مدرن'
    },
    {
      id: 'p8',
      title: 'ترمیم لمینت ناخن طبیعی همراه با روغن‌تراپی عمیق',
      category: 'tarmim',
      categoryLabel: 'ترمیم',
      imageUrl: '/images/niwsha_hero_nails_1790499890190.jpg',
      technique: 'احیا و ریموو لایه اضافه بدون نازک شدن بستر',
      shape: 'کوتاه نچرال'
    }
  ],

  contact: {
    instagram: '@niwsha.nails.studio',
    instagramUrl: 'https://instagram.com/placeholder',
    telegram: '@niwsha_booking',
    telegramUrl: 'https://t.me/placeholder',
    phone: '۰۹۱۲-XXX-XXXX',
    phoneDisplay: '۰۹۱۲-XXX-XXXX (جایگزین با شماره اختصاصی سالن)',
    address: 'تهران، سعادت‌آباد، میدان کاج، خیابان سرو شرقی (آدرس دقیق پس از رزرو پیامک می‌شود)',
    locationNote: 'دسترسی آسان با پارکینگ اختصاصی و محیطی آرام',
    workingHours: 'شنبه تا پنج‌شنبه: ۱۰:۰۰ صبح تا ۱۹:۰۰ عصر (با هماهنگی قبلی)'
  }
};
