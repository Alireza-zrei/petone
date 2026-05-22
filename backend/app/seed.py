"""Seed the products table with the Petone demo catalogue.

Idempotent: does nothing if the products table already has rows.
Run with:  python -m app.seed
"""
import asyncio

from sqlalchemy import func, select

from app.database import AsyncSessionLocal
from app.domains.products.models import Product

_IMG = "https://images.unsplash.com/photo-{}?auto=format&fit=crop&q=80&w=400"

_PRODUCTS: list[dict] = [
    {
        "slug": "product-1",
        "name": "غذای خشک سگ رویال کنین مدل Mini Adult",
        "brand": "رویال کنین",
        "price": 1850000,
        "discount_price": 1650000,
        "rating": 4.8,
        "reviews_count": 124,
        "image_url": _IMG.format("1589924691995-400dc9ecc119"),
        "category": "غذای سگ",
        "description": "غذای خشک سگ رویال کنین مدل مینی ادالت مخصوص سگ‌های بالغ نژاد کوچک می باشد. این محصول با فرمولاسیون ویژه خود به حفظ وزن ایده‌آل و سلامت پوست و مو کمک می‌کند.",
        "is_best_seller": True,
        "stock": 50,
    },
    {
        "slug": "product-2",
        "name": "کنسرو گربه شایر با طعم مرغ و برنج",
        "brand": "شایر",
        "price": 85000,
        "discount_price": 72000,
        "rating": 4.5,
        "reviews_count": 89,
        "image_url": _IMG.format("1597843798183-435edc64aa8b"),
        "category": "غذای گربه",
        "description": "کنسرو مرغ و برنج شایر ۱۰۰٪ طبیعی بوده و فاقد هرگونه مواد افزودنی شیمیایی و نگهدارنده است. این کنسرو سرشار از پروتئین و ویتامین‌های ضروری برای گربه شماست.",
        "is_new": True,
        "stock": 50,
    },
    {
        "slug": "product-3",
        "name": "قلاده کتفی سگ مدل نایکی",
        "brand": "تاپ پت",
        "price": 320000,
        "rating": 4.2,
        "reviews_count": 45,
        "image_url": _IMG.format("1591768793355-74d7c513c2c7"),
        "category": "لوازم جانبی",
        "description": "قلاده کتفی با طراحی ارگونومیک و پد‌های نرم جهت جلوگیری از فشار به گردن و ستون فقرات سگ. قابل شستشو و دارای بازتابنده نور در شب.",
        "stock": 3,
    },
    {
        "slug": "product-4",
        "name": "خاک گربه معطر مدل Lavender",
        "brand": "کت لیدر",
        "price": 145000,
        "discount_price": 120000,
        "rating": 4.6,
        "reviews_count": 230,
        "image_url": _IMG.format("1568640347023-a616a30bc3bd"),
        "category": "بهداشتی",
        "description": "خاک گربه با قدرت جذب بالا و توده شوندگی سریع. دارای رایحه ملایم اسطوخودوس جهت از بین بردن بوی نامطبوع و آنتی باکتریال.",
        "is_best_seller": True,
        "stock": 50,
    },
    {
        "slug": "product-5",
        "name": "تشویقی سگ جرهای مدل مرغ",
        "brand": "جرهای",
        "price": 125000,
        "rating": 4.9,
        "reviews_count": 312,
        "image_url": _IMG.format("1563460716037-460a3ad24ba9"),
        "category": "غذای سگ",
        "description": "تشویقی‌های خوشمزه جرهای با طعم مرغ، سرشار از پروتئین و مناسب برای آموزش و تربیت سگ‌های دلبند شما.",
        "stock": 50,
    },
    {
        "slug": "product-6",
        "name": "قفس پرنده مدل بازا",
        "brand": "سپهر",
        "price": 950000,
        "discount_price": 850000,
        "rating": 4.0,
        "reviews_count": 24,
        "image_url": _IMG.format("1551893478-d726eaf0442c"),
        "category": "پرندگان",
        "description": "قفس فلزی بزرگ با رنگ کوره‌ای ثابت، مناسب برای انواع طوطی‌سانان و فنچ‌ها. دارای سینی نظافت و ظرف آب و غذا.",
        "stock": 50,
    },
    {
        "slug": "product-7",
        "name": "شامپو براق کننده موی سگ و گربه",
        "brand": "بیولاین",
        "price": 195000,
        "rating": 4.7,
        "reviews_count": 56,
        "image_url": _IMG.format("1516734212186-a967f81ad0d7"),
        "category": "آرایشی و بهداشتی",
        "description": "شامپوی ملایم با عصاره آلوئه‌ورا، مناسب برای براقیت و نرمی پوشش مویی حیوانات خانگی.",
        "stock": 50,
    },
    {
        "slug": "product-8",
        "name": "اسکرچر عمودی گربه مدل درختی",
        "brand": "نینا‌پت",
        "price": 1250000,
        "discount_price": 1100000,
        "rating": 4.9,
        "reviews_count": 15,
        "image_url": _IMG.format("1583337130417-3346a1be7dee"),
        "category": "گربه",
        "description": "درخت گربه با ستون‌های کنفی جهت اصلاح ناخن و طبقات نرم برای استراحت و خواب گربه.",
        "stock": 50,
    },
    {
        "slug": "product-9",
        "name": "غذای همستر مدل نیچر",
        "brand": "ورسلاگا",
        "price": 245000,
        "rating": 4.8,
        "reviews_count": 78,
        "image_url": _IMG.format("1425082661705-1834bfd09dca"),
        "category": "جوندگان",
        "description": "غذای کامل و متعادل برای همستر، حاوی غلات، حبوبات و دانه‌های روغنی غنی شده با ویتامین‌ها.",
        "stock": 50,
    },
    {
        "slug": "product-10",
        "name": "مولتی ویتامین سگ مدل Top 10",
        "brand": "بیفار",
        "price": 480000,
        "rating": 4.9,
        "reviews_count": 142,
        "image_url": _IMG.format("1584308666744-24d5c474f2ae"),
        "category": "داروخانه",
        "description": "مکمل مولتی ویتامین حاوی کلسیم و ال-کارنیتین جهت تقویت عضلات و استخوان‌بندی و افزایش شادابی سگ.",
        "is_best_seller": True,
        "stock": 50,
    },
    {
        "slug": "product-11",
        "name": "غذای ماهی فلاک مدل تِترا مین",
        "brand": "تترا",
        "price": 185000,
        "discount_price": 155000,
        "rating": 4.6,
        "reviews_count": 34,
        "image_url": _IMG.format("1522069169874-c58ec4b76be5"),
        "category": "ماهی آکواریوم",
        "description": "غذای پولکی با کیفیت بالا برای تمامی ماهی‌های زینتی آب شیرین، تقویت کننده رنگ و سیستم ایمنی.",
        "stock": 50,
    },
    {
        "slug": "product-12",
        "name": "لونه چوبی فنچ مدل کلبه",
        "brand": "ماهر‌پت",
        "price": 95000,
        "rating": 4.3,
        "reviews_count": 21,
        "image_url": _IMG.format("1444464666168-49d633b867ad"),
        "category": "پرندگان",
        "description": "لانه چوبی طبیعی مناسب برای فنچ و مرغ عشق، با نصب آسان داخل قفس.",
        "stock": 50,
    },
    {
        "slug": "product-13",
        "name": "کتاب راهنمای جامع تربیت و روانشناسی سگ و گربه",
        "brand": "انتشارات همشهری",
        "price": 185000,
        "discount_price": 150000,
        "rating": 4.9,
        "reviews_count": 46,
        "image_url": _IMG.format("1544716278-ca5e3f4abd8c"),
        "category": "سرپرست حیوانات",
        "description": "کتاب آموزش گام به گام تربیت، درک زبان بدن و رفع ناهنجاری‌های رفتاری سگ و گربه تالیف جمعی از دامپزشکان مطرح کشور.",
        "is_best_seller": True,
        "stock": 50,
    },
    {
        "slug": "product-14",
        "name": "هودی ست طرح پنجه عشق (رنگ طوسی ملانژ)",
        "brand": "پت‌وان استایل",
        "price": 495000,
        "discount_price": 420000,
        "rating": 4.7,
        "reviews_count": 18,
        "image_url": _IMG.format("1556821840-3a63f95609a7"),
        "category": "سرپرست حیوانات",
        "description": "یک هودی فوق‌العاده نرم با طرح پنجه مینیاتوری گلدوزی شده، ایده‌آل برای استفاده در زمان گردش با حیوان خانگی دلبندتان.",
        "is_new": True,
        "stock": 50,
    },
    {
        "slug": "product-15",
        "name": "پرزگیر برقی لباس و مبل مدل پرتابل",
        "brand": "شیائومی",
        "price": 360000,
        "rating": 4.8,
        "reviews_count": 95,
        "image_url": _IMG.format("1516734212186-a967f81ad0d7"),
        "category": "سرپرست حیوانات",
        "description": "دستگاه پرزگیر موی حیوان و پرز لباس شارژی با سه تیغه استیل تیز برای تمیز کردن سریع کل موها از روی مبلمان، صندلی خودرو و لباس.",
        "stock": 50,
    },
    {
        "slug": "product-16",
        "name": "کیف پیاده‌روی چندکاره سرپرست پت‌وان",
        "brand": "پت‌وان",
        "price": 290000,
        "rating": 4.6,
        "reviews_count": 29,
        "image_url": _IMG.format("1553062407-98eeb64c6a62"),
        "category": "سرپرست حیوانات",
        "description": "مجهز به بخش مجزا برای بطری آب، جیب دستمال مرطوب، محفظه کیسه فضولات و جیب مخصوص لوازم شخصی سرپرست.",
        "stock": 50,
    },
]


async def seed() -> None:
    async with AsyncSessionLocal() as db:
        existing = await db.scalar(select(func.count()).select_from(Product))
        if existing:
            print(f"products table already has {existing} rows; skipping seed")
            return
        db.add_all([Product(**data) for data in _PRODUCTS])
        await db.commit()
        print(f"seeded {len(_PRODUCTS)} products")


if __name__ == "__main__":
    asyncio.run(seed())
