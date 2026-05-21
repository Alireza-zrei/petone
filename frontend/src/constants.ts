/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Category, TrustBadge } from './types';

export const CATEGORIES: Category[] = [
  { 
    id: 'dogs', 
    name: 'سگ', 
    icon: '🐕', 
    image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=400', 
    path: '/dogs',
    subcategories: ['غذای خشک سگ', 'غذای مرطوب سگ', 'تشویقی سگ', 'مکمل و ویتامین سگ', 'لوازم جانبی سگ', 'بهداشتی سگ']
  },
  { 
    id: 'cats', 
    name: 'گربه', 
    icon: '🐈', 
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400', 
    path: '/cats',
    subcategories: ['غذای خشک گربه', 'غذای مرطوب گربه', 'خاک گربه', 'اسکرچر و درخت گربه', 'اسباب‌بازی گربه']
  },
  { 
    id: 'birds', 
    name: 'پرندگان', 
    icon: '🦜', 
    image: 'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?auto=format&fit=crop&q=80&w=400', 
    path: '/birds',
    subcategories: ['غذای پرندگان', 'قفس و ملزومات', 'مکمل و بهداشت پرندگان']
  },
  { 
    id: 'rodents', 
    name: 'جوندگان', 
    icon: '🐹', 
    image: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&q=80&w=400', 
    path: '/rodents',
    subcategories: ['غذای جوندگان', 'قفس و ملزومات', 'پوشال و بستر']
  },
  { 
    id: 'aquatic', 
    name: 'آبزیان', 
    icon: '🐠', 
    image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&q=80&w=400', 
    path: '/aquatic',
    subcategories: ['غذای ماهی', 'آکواریوم و تجهیزات']
  },
  { 
    id: 'guardians', 
    name: 'سرپرست حیوانات', 
    icon: '👤', 
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=400', 
    path: '/guardians',
    subcategories: ['کتاب و آموزش', 'پوشاک و ست طرح پنجه', 'پرزگیر و نظافت لباس', 'کیف و ملزومات پیاده‌روی']
  }
];

export const NAV_CATEGORIES: Category[] = [
  { 
    id: 'dogs', 
    name: 'سگ', 
    icon: '🐕', 
    image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=400', 
    path: '/dogs',
    subcategories: ['غذای خشک سگ', 'غذای مرطوب سگ', 'تشویقی سگ', 'مکمل و ویتامین سگ', 'لوازم جانبی سگ', 'بهداشتی سگ']
  },
  { 
    id: 'cats', 
    name: 'گربه', 
    icon: '🐈', 
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400', 
    path: '/cats',
    subcategories: ['غذای خشک گربه', 'غذای مرطوب گربه', 'خاک گربه', 'اسکرچر و درخت گربه', 'اسباب‌بازی گربه']
  },
  { 
    id: 'other-pets', 
    name: 'سایر حیوانات', 
    icon: '🦜', 
    image: 'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?auto=format&fit=crop&q=80&w=400', 
    path: '/other-pets',
    subcategories: ['پرندگان', 'جوندگان', 'آبزیان']
  },
  { 
    id: 'guardians', 
    name: 'سرپرست حیوانات', 
    icon: '👤', 
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=400', 
    path: '/guardians',
    subcategories: ['کتاب و آموزش', 'پوشاک و ست طرح پنجه', 'پرزگیر و نظافت لباس', 'کیف و ملزومات پیاده‌روی']
  }
];

export const FOOD_CATEGORIES: Category[] = [
  { 
    id: 'f1', 
    name: 'غذای خشک و تر', 
    icon: '🥣', 
    image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&q=80&w=400', 
    path: '/dry-wet-food',
    subcategories: ['غذای خشک سگ', 'غذای خشک گربه', 'غذای خشک جوندگان', 'غذای خشک پرندگان', 'کنسرو سگ', 'کنسرو گربه', 'پوچ گربه', 'سوپ پت']
  },
  { 
    id: 'f2', 
    name: 'اکسسوری', 
    icon: '🧣', 
    image: 'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&q=80&w=400', 
    path: '/accessories',
    subcategories: ['اسباب‌بازی سگ', 'قلاده و بند', 'لوازم بهداشتی', 'قفس و باکس حمل', 'اسکرچر و درخت گربه', 'اسباب‌بازی گربه', 'باکس حمل', 'ظرف غذا و آب']
  },
  { 
    id: 'f3', 
    name: 'کنسرو و تشویقی', 
    icon: '🥫', 
    image: 'https://images.unsplash.com/photo-1563460716037-460a3ad24ba9?auto=format&fit=crop&q=80&w=400', 
    path: '/wet-treats',
    subcategories: ['کنسرو سگ', 'کنسرو گربه', 'پوچ گربه', 'تشویقی جویدنی سگ', 'مداد تشویقی گربه', 'اسنک طبیعی', 'بیسکویت سگ', 'تشویقی سگ', 'تشویقی گربه']
  },
  { 
    id: 'f4', 
    name: 'مراقبتی و سلامتی', 
    icon: '🩺', 
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400', 
    path: '/care-health',
    subcategories: ['مولتی ویتامین', 'سلامت مفاصل', 'پوست و مو', 'تقویت سیستم ایمنی', 'دارو و سلامت سگ', 'مکمل و سلامت', 'داروخانه', 'مکمل و ویتامین سگ']
  },
  { 
    id: 'f5', 
    name: 'بهداشتی', 
    icon: '🧼', 
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=400', 
    path: '/grooming-hygiene',
    subcategories: ['شامپو و لوسیون', 'برس و شانه', 'ناخن‌گیر', 'ضدعفونی‌کننده محیط', 'پاک‌کننده چشم و گوش', 'بهداشتی سگ', 'خاک گربه']
  },
  { 
    id: 'f6', 
    name: 'خدمات', 
    icon: '🏥', 
    image: 'https://images.unsplash.com/photo-1581888227599-779811939961?auto=format&fit=crop&q=80&w=400', 
    path: '/services',
    subcategories: ['ویزیت دامپزشک', 'اصلاح و شستشو', 'پت شاپ آنلاین', 'هتل پانسیون حیوانات', 'آموزش و مربی']
  },
];

export const TRUST_BADGES: TrustBadge[] = [
  { id: '1', title: 'ارسال سریع', description: 'تحویل درب منزل در کمترین زمان', icon: 'Truck' },
  { id: '2', title: 'ضمانت اصالت', description: 'تمامی محصولات اصل و اورجینال هستند', icon: 'ShieldCheck' },
  { id: '3', title: 'پرداخت امن', description: 'درگاه‌های معتبر بانکی کشور', icon: 'Lock' },
  { id: '4', title: 'پشتیبانی تخصصی', description: 'مشاوره رایگان توسط دامپزشکان', icon: 'Headset' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'غذای خشک سگ رویال کنین مدل Mini Adult',
    brand: 'رویال کنین',
    price: 1850000,
    discountPrice: 1650000,
    rating: 4.8,
    reviewsCount: 124,
    image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&q=80&w=400',
    category: 'غذای سگ',
    description: 'غذای خشک سگ رویال کنین مدل مینی ادالت مخصوص سگ‌های بالغ نژاد کوچک می باشد. این محصول با فرمولاسیون ویژه خود به حفظ وزن ایده‌آل و سلامت پوست و مو کمک می‌کند.',
    isBestSeller: true,
    stockStatus: 'available'
  },
  {
    id: 'p2',
    name: 'کنسرو گربه شایر با طعم مرغ و برنج',
    brand: 'شایر',
    price: 85000,
    discountPrice: 72000,
    rating: 4.5,
    reviewsCount: 89,
    image: 'https://images.unsplash.com/photo-1597843798183-435edc64aa8b?auto=format&fit=crop&q=80&w=400',
    category: 'غذای گربه',
    description: 'کنسرو مرغ و برنج شایر ۱۰۰٪ طبیعی بوده و فاقد هرگونه مواد افزودنی شیمیایی و نگهدارنده است. این کنسرو سرشار از پروتئین و ویتامین‌های ضروری برای گربه شماست.',
    isNew: true,
    stockStatus: 'available'
  },
  {
    id: 'p3',
    name: 'قلاده کتفی سگ مدل نایکی',
    brand: 'تاپ پت',
    price: 320000,
    rating: 4.2,
    reviewsCount: 45,
    image: 'https://images.unsplash.com/photo-1591768793355-74d7c513c2c7?auto=format&fit=crop&q=80&w=400',
    category: 'لوازم جانبی',
    description: 'قلاده کتفی با طراحی ارگونومیک و پد‌های نرم جهت جلوگیری از فشار به گردن و ستون فقرات سگ. قابل شستشو و دارای بازتابنده نور در شب.',
    stockStatus: 'low'
  },
  {
    id: 'p4',
    name: 'خاک گربه معطر مدل Lavender',
    brand: 'کت لیدر',
    price: 145000,
    discountPrice: 120000,
    rating: 4.6,
    reviewsCount: 230,
    image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&q=80&w=400',
    category: 'بهداشتی',
    description: 'خاک گربه با قدرت جذب بالا و توده شوندگی سریع. دارای رایحه ملایم اسطوخودوس جهت از بین بردن بوی نامطبوع و آنتی باکتریال.',
    isBestSeller: true,
    stockStatus: 'available'
  },
  {
    id: 'p5',
    name: 'تشویقی سگ جرهای مدل مرغ',
    brand: 'جرهای',
    price: 125000,
    rating: 4.9,
    reviewsCount: 312,
    image: 'https://images.unsplash.com/photo-1563460716037-460a3ad24ba9?auto=format&fit=crop&q=80&w=400',
    category: 'غذای سگ',
    description: 'تشویقی‌های خوشمزه جرهای با طعم مرغ، سرشار از پروتئین و مناسب برای آموزش و تربیت سگ‌های دلبند شما.',
    stockStatus: 'available'
  },
  {
    id: 'p6',
    name: 'قفس پرنده مدل بازا',
    brand: 'سپهر',
    price: 950000,
    discountPrice: 850000,
    rating: 4.0,
    reviewsCount: 24,
    image: 'https://images.unsplash.com/photo-1551893478-d726eaf0442c?auto=format&fit=crop&q=80&w=400',
    category: 'پرندگان',
    description: 'قفس فلزی بزرگ با رنگ کوره‌ای ثابت، مناسب برای انواع طوطی‌سانان و فنچ‌ها. دارای سینی نظافت و ظرف آب و غذا.',
    stockStatus: 'available'
  },
  {
    id: 'p7',
    name: 'شامپو براق کننده موی سگ و گربه',
    brand: 'بیولاین',
    price: 195000,
    rating: 4.7,
    reviewsCount: 56,
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=400',
    category: 'آرایشی و بهداشتی',
    description: 'شامپوی ملایم با عصاره آلوئه‌ورا، مناسب برای براقیت و نرمی پوشش مویی حیوانات خانگی.',
    stockStatus: 'available'
  },
  {
    id: 'p8',
    name: 'اسکرچر عمودی گربه مدل درختی',
    brand: 'نینا‌پت',
    price: 1250000,
    discountPrice: 1100000,
    rating: 4.9,
    reviewsCount: 15,
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=400',
    category: 'گربه',
    description: 'درخت گربه با ستون‌های کنفی جهت اصلاح ناخن و طبقات نرم برای استراحت و خواب گربه.',
    stockStatus: 'available'
  },
  {
    id: 'p9',
    name: 'غذای همستر مدل نیچر',
    brand: 'ورسلاگا',
    price: 245000,
    rating: 4.8,
    reviewsCount: 78,
    image: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&q=80&w=400',
    category: 'جوندگان',
    description: 'غذای کامل و متعادل برای همستر، حاوی غلات، حبوبات و دانه‌های روغنی غنی شده با ویتامین‌ها.',
    stockStatus: 'available'
  },
  {
    id: 'p10',
    name: 'مولتی ویتامین سگ مدل Top 10',
    brand: 'بیفار',
    price: 480000,
    rating: 4.9,
    reviewsCount: 142,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400',
    category: 'داروخانه',
    description: 'مکمل مولتی ویتامین حاوی کلسیم و ال-کارنیتین جهت تقویت عضلات و استخوان‌بندی و افزایش شادابی سگ.',
    isBestSeller: true,
    stockStatus: 'available'
  },
  {
    id: 'p11',
    name: 'غذای ماهی فلاک مدل تِترا مین',
    brand: 'تترا',
    price: 185000,
    discountPrice: 155000,
    rating: 4.6,
    reviewsCount: 34,
    image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&q=80&w=400',
    category: 'ماهی آکواریوم',
    description: 'غذای پولکی با کیفیت بالا برای تمامی ماهی‌های زینتی آب شیرین، تقویت کننده رنگ و سیستم ایمنی.',
    stockStatus: 'available'
  },
  {
    id: 'p12',
    name: 'لونه چوبی فنچ مدل کلبه',
    brand: 'ماهر‌پت',
    price: 95000,
    rating: 4.3,
    reviewsCount: 21,
    image: 'https://images.unsplash.com/photo-1444464666168-49d633b867ad?auto=format&fit=crop&q=80&w=400',
    category: 'پرندگان',
    description: 'لانه چوبی طبیعی مناسب برای فنچ و مرغ عشق، با نصب آسان داخل قفس.',
    stockStatus: 'available'
  },
  {
    id: 'p13',
    name: 'کتاب راهنمای جامع تربیت و روانشناسی سگ و گربه',
    brand: 'انتشارات همشهری',
    price: 185000,
    discountPrice: 150000,
    rating: 4.9,
    reviewsCount: 46,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400',
    category: 'سرپرست حیوانات',
    description: 'کتاب آموزش گام به گام تربیت، درک زبان بدن و رفع ناهنجاری‌های رفتاری سگ و گربه تالیف جمعی از دامپزشکان مطرح کشور.',
    isBestSeller: true,
    stockStatus: 'available'
  },
  {
    id: 'p14',
    name: 'هودی ست طرح پنجه عشق (رنگ طوسی ملانژ)',
    brand: 'پت‌وان استایل',
    price: 495000,
    discountPrice: 420000,
    rating: 4.7,
    reviewsCount: 18,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=400',
    category: 'سرپرست حیوانات',
    description: 'یک هودی فوق‌العاده نرم با طرح پنجه مینیاتوری گلدوزی شده، ایده‌آل برای استفاده در زمان گردش با حیوان خانگی دلبندتان.',
    isNew: true,
    stockStatus: 'available'
  },
  {
    id: 'p15',
    name: 'پرزگیر برقی لباس و مبل مدل پرتابل',
    brand: 'شیائومی',
    price: 360000,
    rating: 4.8,
    reviewsCount: 95,
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=400',
    category: 'سرپرست حیوانات',
    description: 'دستگاه پرزگیر موی حیوان و پرز لباس شارژی با سه تیغه استیل تیز برای تمیز کردن سریع کل موها از روی مبلمان، صندلی خودرو و لباس.',
    stockStatus: 'available'
  },
  {
    id: 'p16',
    name: 'کیف پیاده‌روی چندکاره سرپرست پت‌وان',
    brand: 'پت‌وان',
    price: 290000,
    rating: 4.6,
    reviewsCount: 29,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=400',
    category: 'سرپرست حیوانات',
    description: 'مجهز به بخش مجزا برای بطری آب، جیب دستمال مرطوب، محفظه کیسه فضولات و جیب مخصوص لوازم شخصی سرپرست.',
    stockStatus: 'available'
  }
];
