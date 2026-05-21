/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Heart, 
  Menu, 
  X, 
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  PawPrint,
  Clock,
  Phone,
  ArrowLeft,
  TrendingUp,
  Grid,
  MapPin,
  Settings,
  LayoutDashboard,
  Plus,
  Trash2,
  Edit,
  Award,
  BookOpen,
  Tag,
  Users,
  Package,
  BarChart2,
  CheckCircle,
  RefreshCw,
  Eye,
  Percent,
  FileText,
  Compass,
  AlertCircle,
  Sparkles,
  Filter,
  Home,
  Check,
  PlusCircle,
  MinusCircle,
  Calendar,
  MessageSquare,
  ShieldCheck,
  Mail,
  ArrowRight,
  LogOut,
  Soup,
  Crown,
  HeartHandshake,
  Stethoscope,
  Scissors,
  Camera,
  Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PRODUCTS, CATEGORIES, TRUST_BADGES, FOOD_CATEGORIES, NAV_CATEGORIES } from './constants';
import { Product, Category } from './types';

const toPersianDigits = (num: number | string | undefined | null) => {
  if (num === undefined || num === null) return '';
  const idToFa = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  let str = '';
  if (typeof num === 'number') {
    str = num.toLocaleString('fa-IR');
  } else {
    str = num.toString();
  }
  return str.replace(/[0-9]/g, (w) => idToFa[parseInt(w, 10)]);
};

// Note: SEARCH_DATA was moved inside App component to avoid module load issues

// --- Sub-components (could be in separate files) ---

const Header = ({ 
  cartCount, 
  onCartClick, 
  onLogoClick, 
  onNavClick,
  onAccountClick,
  isLoggedIn,
  searchData
}: { 
  cartCount: number, 
  onCartClick: () => void, 
  onLogoClick: () => void, 
  onNavClick: (cat: string) => void,
  onAccountClick: () => void,
  isLoggedIn: boolean,
  searchData: any
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [expandedMobileCats, setExpandedMobileCats] = useState<Record<string, boolean>>({});

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      setIsScrolled(scrolled);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileCat = (id: string) => {
    setExpandedMobileCats(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredProducts = React.useMemo(() => 
    (searchData.products || []).filter((p: any) => 
      (p.name || '').includes(searchQuery) || (p.brand || '').includes(searchQuery)
    ), [searchQuery, searchData.products]
  );

  return (
    <>
      <div className="h-[60px]" /> {/* Persistent spacer to prevent layout shift */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out h-[60px] flex items-center ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'}`}>
        <div className="container flex items-center justify-between gap-4 h-full mx-auto">
        {/* Mobile Menu & Search Toggle */}
        <div className="flex lg:hidden items-center gap-1">
          <button className="p-2 text-slate-600" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>
          <button className="p-2 text-slate-600" onClick={() => setIsSearchOpen(true)}>
            <Search size={22} />
          </button>
        </div>

        {/* Logo */}
        <div onClick={onLogoClick} dir="ltr" className="flex items-center gap-1 sm:gap-2 group cursor-pointer shrink-0">
          <svg viewBox="0 0 100 100" className="w-[30px] h-[30px] sm:w-[42px] sm:h-[42px] text-brand-orange transform group-hover:rotate-12 transition-transform duration-300">
            <circle cx="50" cy="24" r="13" fill="currentColor" />
            <path d="M 17 46 C 23 66, 35 73, 50 73 C 65 73, 77 66, 83 46" stroke="currentColor" strokeWidth="24" fill="none" strokeLinecap="round" />
          </svg>
          <span className="text-base sm:text-2xl font-logo font-black tracking-tight select-none">
            <span className="text-slate-800">pet</span><span className="text-brand-orange">one</span>
          </span>
        </div>

        {/* Search Bar - Desktop */}
        <div className="hidden lg:flex flex-1 max-w-2xl relative group">
           <div className="relative w-full">
            <input 
              ref={searchInputRef}
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="جستجو در محصولات، برندها و ملزومات..."
              className="w-full bg-slate-50 border-none rounded-2xl py-2.5 px-6 pr-12 text-sm font-bold focus:ring-2 focus:ring-brand-orange/20 transition-all text-right placeholder:text-slate-300"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-orange transition-colors" size={18} />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
              >
                <X size={14} />
              </button>
            )}
           </div>

           {/* Search Dropdown - Desktop */}
           <AnimatePresence>
            {isSearchOpen && (
              <>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsSearchOpen(false)}
                  className="fixed inset-0 z-[-1] bg-slate-900/5 backdrop-blur-[2px]"
                />
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  className="absolute top-full left-0 right-0 mt-3 bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 z-[60] rtl"
                >
                  {searchQuery.length > 1 ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">نتایج جستجو</span>
                        <span className="text-[10px] font-bold text-slate-300 leading-none">{filteredProducts.length} مورد پیدا شد</span>
                      </div>
                      
                      {filteredProducts.length > 0 ? (
                        <div className="space-y-3">
                          {filteredProducts.map((p: any) => (
                            <div key={p.id} className="flex items-center gap-4 p-2 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer group">
                              <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-slate-100 shadow-sm shrink-0">
                                <img src={p.image} className="w-full h-full object-cover" alt="" />
                              </div>
                              <div className="flex-1 space-y-1 text-right">
                                <h4 className="text-xs font-black text-slate-800 group-hover:text-brand-orange transition-colors">{p.name}</h4>
                                <div className="flex items-center justify-end gap-2">
                                  <span className="text-[9px] font-bold text-slate-400 leading-none">{p.brand}</span>
                                  <span className="w-1 h-1 rounded-full bg-slate-200" />
                                  <span className="text-[9px] font-bold text-slate-400 leading-none">{p.category}</span>
                                </div>
                              </div>
                              <div className="text-left">
                                <div className="text-xs font-black text-slate-600 leading-none">{p.price}</div>
                                <div className="text-[8px] font-bold text-slate-300">تومان</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-8 text-center space-y-2">
                          <div className="text-2xl opacity-20">🔍</div>
                          <p className="text-xs font-bold text-slate-400">نتیجه‌ای برای "{searchQuery}" پیدا نشد</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-8 divide-x divide-x-reverse divide-slate-100 text-right rtl">
                      <div className="space-y-6">
                        <section className="space-y-3 px-2">
                          <div className="flex items-center justify-end gap-2 text-slate-400">
                            <span className="text-[10px] font-black uppercase tracking-widest leading-none">جستجوهای اخیر</span>
                            <Clock size={12} />
                          </div>
                          <div className="flex flex-wrap justify-end gap-2">
                            {searchData.recent.map((term: string) => (
                              <button key={term} onClick={() => setSearchQuery(term)} className="text-[10px] font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full hover:bg-orange-50 hover:text-brand-orange transition-all">
                                {term}
                              </button>
                            ))}
                          </div>
                        </section>
                      </div>

                      <div className="space-y-6 pr-8">
                        <section className="space-y-3">
                          <div className="flex items-center justify-end gap-2 text-slate-400">
                            <span className="text-[10px] font-black uppercase tracking-widest leading-none">دسته‌بندی‌ها</span>
                            <Grid size={12} />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {searchData.categories.map((cat: any) => (
                              <button key={cat.id} onClick={() => { onNavClick(cat.name); setIsSearchOpen(false); }} className="flex items-center justify-center p-3.5 bg-slate-50/50 hover:bg-orange-50 hover:border-brand-orange border border-transparent rounded-2xl transition-all group">
                                <span className="text-[10px] font-black text-slate-700 group-hover:text-brand-orange leading-none">{cat.name}</span>
                              </button>
                            ))}
                          </div>
                        </section>
                      </div>
                    </div>
                  )}
                </motion.div>
              </>
            )}
           </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onAccountClick}
            className="flex items-center gap-2 text-slate-600 hover:text-brand-orange transition-colors"
          >
            <User size={22} />
            <span className="text-sm font-bold hidden sm:inline">
              {isLoggedIn ? 'حساب کاربری' : 'ورود / ثبت‌نام'}
            </span>
          </button>
          
          <div className="w-px h-6 bg-slate-200 hidden sm:block" />

          <button 
            onClick={onCartClick}
            className="flex items-center gap-2 text-slate-600 hover:text-brand-orange transition-colors relative"
          >
            <div className="relative">
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-orange text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-sm font-bold hidden sm:inline leading-none">سبد خرید</span>
          </button>
        </div>
        </div>
      </header>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            className="fixed inset-0 bg-white z-[100] lg:hidden flex flex-col rtl"
          >
            <div className="p-4 flex items-center gap-3 border-b border-slate-100">
               <button onClick={() => setIsSearchOpen(false)} className="p-2 text-slate-400">
                  <X size={24} />
               </button>
               <div className="flex-1 relative">
                  <input 
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="جستجو در پِت‌وان..."
                    className="w-full bg-slate-50 border-none rounded-2xl py-3 px-10 text-sm font-bold focus:ring-1 focus:ring-brand-orange/50 text-right"
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-20 text-right">
              {searchQuery.length > 1 ? (
                <div className="space-y-4">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map(p => (
                      <div key={p.id} onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }} className="flex items-center gap-4 p-4 bg-slate-50 rounded-3xl border border-slate-100">
                        <div className="text-left shrink-0">
                           <div className="text-sm font-black text-brand-orange leading-none">{p.price}</div>
                           <div className="text-[9px] font-bold text-slate-400 leading-none">تومان</div>
                        </div>
                        <div className="flex-1">
                           <h4 className="text-xs font-black text-slate-800 leading-tight">{p.name}</h4>
                           <p className="text-[10px] font-bold text-slate-400 mt-1 leading-none">{p.brand}</p>
                        </div>
                        <img src={p.image} className="w-16 h-16 rounded-2xl object-cover shrink-0" alt="" />
                      </div>
                    ))
                  ) : (
                    <div className="py-20 text-center opacity-40">
                       <Search size={40} className="mx-auto mb-4" />
                       <p className="text-sm font-bold">موردی یافت نشد</p>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <section className="space-y-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center justify-end gap-2 leading-none">
                       محبوب‌ترین جستجوها <TrendingUp size={14} />
                    </h3>
                    <div className="flex flex-wrap justify-end gap-2">
                       {searchData.popular.map((term: string) => (
                         <button key={term} onClick={() => setSearchQuery(term)} className="text-xs font-bold text-slate-600 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-100">
                           {term}
                         </button>
                       ))}
                    </div>
                  </section>
                  
                  <section className="space-y-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center justify-end gap-2 leading-none">
                       جستجوهای اخیر <Clock size={14} />
                    </h3>
                    <div className="space-y-2">
                       {searchData.recent.map((term: string) => (
                         <div key={term} onClick={() => setSearchQuery(term)} className="flex items-center justify-between p-4 bg-white border border-slate-50 rounded-2xl shadow-sm">
                            <ArrowLeft size={14} className="text-slate-300" />
                            <span className="text-xs font-bold text-slate-600">{term}</span>
                         </div>
                       ))}
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center justify-end gap-2 leading-none">
                       دسته‌بندی‌ها <Grid size={14} />
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                       {searchData.categories.map((cat: any) => (
                         <div key={cat.id} onClick={() => { onNavClick(cat.name); setIsSearchOpen(false); }} className="p-3.5 bg-orange-50/50 rounded-2xl flex items-center justify-center text-center border border-orange-100/30 cursor-pointer hover:border-brand-orange/30">
                            <span className="text-xs font-black text-slate-800 leading-none">{cat.name}</span>
                         </div>
                       ))}
                    </div>
                  </section>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Rail with Mega Menu */}
      <nav className="hidden lg:flex h-12 border-t border-slate-100 bg-white items-center justify-center gap-10 text-xs font-black text-slate-600">
        <button onClick={onLogoClick} className="text-brand-orange border-b-2 border-brand-orange h-full flex items-center px-2">صفحه اصلی</button>
        {NAV_CATEGORIES.map(cat => (
          <div 
            key={cat.id}
            onMouseEnter={() => setHoveredCategory(cat.id)}
            onMouseLeave={() => setHoveredCategory(null)}
            className="h-full flex items-center relative group"
          >
            <button 
              onClick={() => onNavClick(cat.name)}
              className="hover:text-brand-orange transition-colors flex items-center gap-1 py-4"
            >
              {cat.name}
              <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
            </button>

            {/* Mega Menu */}
            <AnimatePresence>
              {hoveredCategory === cat.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full right-1/2 translate-x-1/2 w-[600px] bg-white shadow-2xl rounded-b-[32px] border-t border-slate-50 p-8 grid grid-cols-2 gap-8 z-50"
                >
                  <div className="space-y-4">
                    <h4 className="text-brand-orange font-black text-sm border-b pb-2">دسته‌بندی‌های {cat.name}</h4>
                    <div className="grid grid-cols-1 gap-2">
                       {cat.subcategories?.slice(0, 10).map(sub => (
                         <button 
                           key={sub}
                           onClick={() => onNavClick(sub)}
                           className="text-right text-slate-500 hover:text-brand-orange hover:translate-x-[-4px] transition-all"
                         >
                           {sub}
                         </button>
                       ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                     <div className="h-4 leading-none invisible">.</div>
                     <div className="grid grid-cols-1 gap-2">
                       {cat.subcategories?.slice(10).map(sub => (
                         <button 
                           key={sub}
                           onClick={() => onNavClick(sub)}
                           className="text-right text-slate-500 hover:text-brand-orange hover:translate-x-[-4px] transition-all"
                         >
                           {sub}
                         </button>
                       ))}
                    </div>
                    <div className="mt-4 rounded-2xl overflow-hidden relative aspect-video bg-slate-50">
                       <img src={cat.image} className="w-full h-full object-cover grayscale opacity-20" alt={cat.name} loading="lazy" width="300" height="150" />
                       <div className="absolute inset-0 flex items-center justify-center font-black text-brand-orange text-lg opacity-40">
                         Petone Care 🐾
                       </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
        <button onClick={() => onNavClick('همه')} className="text-red-500 hover:opacity-80">تخفیف‌های ویژه 🔥</button>
      </nav>

      {/* Mobile Menu Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white z-[70] p-6 shadow-2xl overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <div dir="ltr" className="flex items-center gap-2">
                  <svg width="34" height="34" viewBox="0 0 100 100" className="text-brand-orange">
                    <circle cx="50" cy="24" r="13" fill="currentColor" />
                    <path d="M 17 46 C 23 66, 35 73, 50 73 C 65 73, 77 66, 83 46" stroke="currentColor" strokeWidth="21" fill="none" strokeLinecap="round" />
                  </svg>
                  <span className="text-xl font-logo font-bold tracking-tight select-none">
                    <span className="text-slate-800">pet</span><span className="text-brand-orange">one</span>
                  </span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-slate-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">دسته‌بندی‌ها</h3>
                  <div className="space-y-1">
                    {NAV_CATEGORIES.map(cat => (
                      <div key={cat.id} className="border-b border-slate-50 last:border-0">
                        <button 
                          onClick={() => toggleMobileCat(cat.id)}
                          className="flex items-center justify-between w-full p-4 hover:bg-orange-50 transition-colors rounded-xl"
                        >
                          <div className="flex items-center gap-4">
                            <span className="font-black text-slate-700 text-sm">{cat.name}</span>
                          </div>
                          <ChevronDown size={16} className={`text-slate-400 transition-transform ${expandedMobileCats[cat.id] ? 'rotate-180' : ''}`} />
                        </button>
                        
                        <AnimatePresence>
                          {expandedMobileCats[cat.id] && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden bg-slate-50 rounded-xl"
                            >
                              <div className="p-2 space-y-1">
                                {cat.subcategories?.map(sub => (
                                  <button 
                                    key={sub}
                                    onClick={() => { onNavClick(sub); setIsMobileMenuOpen(false); }}
                                    className="w-full text-right p-3 text-xs font-bold text-slate-500 hover:text-brand-orange hover:bg-white rounded-lg transition-all"
                                  >
                                    {sub}
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const Hero = () => {
  return (
    <section 
      className="relative h-[60px] hero-gradient rounded-[16px] border border-orange-100 flex items-center px-6 overflow-hidden container shadow-sm mx-auto my-4"
    >
      <div className="z-10 w-full flex items-center justify-between">
        <motion.span 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-brand-orange text-white px-3 py-1 rounded-full text-[10px] font-bold shrink-0"
        >
          پیشنهاد ویژه
        </motion.span>
        
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-sm font-black text-slate-800 leading-tight line-clamp-1 mx-2"
        >
          ۵۰٪ تخفیف ویژه پِت‌وان
        </motion.h1>
        
        <motion.button 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-brand-orange text-white text-[10px] font-bold py-1.5 px-4 rounded-xl shrink-0"
        >
          خرید
        </motion.button>
      </div>
      
      <div className="absolute left-4 opacity-5 text-4xl pointer-events-none select-none">
        🐾
      </div>
    </section>
  );
};

const HERO_SLIDES = [
  {
    id: 1,
    title: "مجموعه جدید پاییزی پت‌وان",
    subtitle: "تا ۵۰٪ تخفیف ویژه برای انواع ملزومات گربه و سگ",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=1200",
    cta: "مشاهده شگفت‌انگیزها",
  },
  {
    id: 2,
    title: "سلامتی پت، اولویت ماست",
    subtitle: "مکمل‌های تخصصی و ویتامین‌های اصل از برترین برندها",
    image: "https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&q=80&w=1200",
    cta: "خرید مکمل‌ها",
  },
  {
    id: 3,
    title: "دنیای بازی و سرگرمی",
    subtitle: "لحظات شاد برای فرشته‌های کوچک شما با اسباب‌بازی‌های جدید",
    image: "https://images.unsplash.com/photo-1591768793355-74d750d603bb?auto=format&fit=crop&q=80&w=1200",
    cta: "مشاهده اسباب‌بازی‌ها",
  }
];

const HeroSlider = ({ onCtaClick, slides = HERO_SLIDES }: { onCtaClick: () => void, slides?: any[] }) => {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isHovered, slides.length]);

  const nextSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrent(prev => (prev + 1) % slides.length);
  };
  
  const prevSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrent(prev => (prev - 1 + slides.length) % slides.length);
  };

  if (!slides || slides.length === 0) return null;

  return (
    <section 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative h-[220px] sm:h-[400px] mt-2 mb-4 overflow-hidden container mx-auto rounded-[32px] group shadow-xl border border-slate-100 bg-white"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="absolute inset-0 will-change-transform"
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 bg-gradient-to-l from-slate-900/60 via-slate-900/20 to-transparent z-10" />
          <img 
            src={slides[current].image} 
            alt={slides[current].title} 
            className="w-full h-full object-cover backface-hidden"
            referrerPolicy="no-referrer"
            loading={current === 0 ? "eager" : "lazy"}
            width="1200"
            height="400"
          />
          
          {/* Content Area */}
          <div className="absolute inset-0 z-20 flex flex-col justify-center px-8 text-right rtl">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-3"
            >
              <div className="inline-block bg-brand-orange/90 backdrop-blur-sm px-3 py-1 rounded-full text-[8px] font-black text-white uppercase tracking-wider">
                {slides[current].badge || 'پیشنهاد ویژه پِت‌وان'}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-lg">
                {slides[current].title}
              </h2>
              <p className="text-[10px] sm:text-sm font-bold text-white/90 max-w-[180px] sm:max-w-md leading-relaxed">
                {slides[current].subtitle}
              </p>
              <motion.button
                whileHover={{ scale: 1.05, x: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={onCtaClick}
                className="mt-2 bg-brand-orange text-white text-[10px] sm:text-xs font-black py-2 px-6 rounded-2xl shadow-lg shadow-brand-orange/40 flex items-center gap-2 group-hover:bg-brand-orange-dark transition-all"
              >
                {slides[current].cta || 'مشاهده شگفت‌انگیزها'}
                <ArrowLeft size={14} />
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Manual Navigation - Arrows */}
      <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-between px-2">
        <button 
          onClick={prevSlide}
          className="pointer-events-auto p-2 bg-white/10 hover:bg-white/30 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0"
        >
          <ChevronRight size={20} />
        </button>
        <button 
          onClick={nextSlide}
          className="pointer-events-auto p-2 bg-white/10 hover:bg-white/30 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-500 transform -translate-x-4 group-hover:translate-x-0"
        >
          <ChevronLeft size={20} />
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`transition-all duration-300 rounded-full ${current === idx ? 'w-6 h-1.5 bg-brand-orange shadow-lg shadow-brand-orange/50' : 'w-1.5 h-1.5 bg-white/50 hover:bg-white'}`}
          />
        ))}
      </div>
    </section>
  );
};


// Main categories are now managed via the CATEGORIES constant in constants.ts

const CircularCategoryCarousel = ({ onCategoryClick, activeCategory, categories = CATEGORIES }: { onCategoryClick: (name: string) => void, activeCategory: string | null, categories?: Category[] }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - 150 : scrollLeft + 150;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="pt-0 pb-4 bg-transparent">
      <div className="container mx-auto px-4 relative">
        {/* Carousel Area */}
        <div className="relative group/carousel">
          <div 
            ref={scrollRef}
            className="flex gap-2 sm:gap-4 overflow-x-auto pb-4 pt-2 scrollbar-hide snap-x snap-mandatory touch-pan-x rtl overflow-y-hidden"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((cat, idx) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05, type: 'spring', stiffness: 300, damping: 20 }}
                viewport={{ once: true }}
                onClick={() => onCategoryClick(cat.name)}
                className="flex-shrink-0 snap-start cursor-pointer group w-[calc((100%-1.5rem)/3.5)] sm:w-auto"
              >
                <div className="flex flex-col items-center gap-2">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative w-full aspect-square sm:w-24 sm:h-24 rounded-full p-0.5 border-2 transition-all duration-300 ${activeCategory === cat.name ? 'border-brand-orange shadow-lg shadow-brand-orange/20' : 'border-slate-100 group-hover:border-slate-300'}`}
                  >
                    <div className="w-full h-full rounded-full overflow-hidden shadow-inner bg-slate-50 relative aspect-square">
                      <img 
                        src={cat.image} 
                        alt={cat.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 backface-hidden"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        width="96"
                        height="96"
                      />
                    </div>
                  </motion.div>
                  <span className={`block text-[9px] sm:text-[10px] font-black transition-colors truncate w-full sm:w-24 text-center px-1 ${activeCategory === cat.name ? 'text-brand-orange' : 'text-slate-700'}`}>{cat.name}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Nav Controls */}
          <button 
            onClick={() => scroll('right')}
            className="absolute -right-2 top-8 z-10 w-8 h-8 bg-white/90 backdrop-blur shadow-md rounded-full flex items-center justify-center text-slate-400 hover:text-brand-orange opacity-0 group-hover/carousel:opacity-100 transition-opacity lg:flex hidden"
          >
            <ChevronRight size={16} />
          </button>
          <button 
            onClick={() => scroll('left')}
            className="absolute -left-2 top-8 z-10 w-8 h-8 bg-white/90 backdrop-blur shadow-md rounded-full flex items-center justify-center text-slate-400 hover:text-brand-orange opacity-0 group-hover/carousel:opacity-100 transition-opacity lg:flex hidden"
          >
            <ChevronLeft size={16} />
          </button>
        </div>
      </div>
    </section>
  );
};

const CategoriesSection = ({ onNavClick, foodCategories = FOOD_CATEGORIES }: { onNavClick: (cat: string) => void, foodCategories?: Category[] }) => {
  const catStyleMap: Record<string, { icon: React.ReactNode; circleClass: string; cardClass: string }> = {
    f1: {
      icon: (
        <svg viewBox="0 0 100 100" className="w-10 h-10 sm:w-14 sm:h-14 transition-all duration-300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 65 L22 80 C24 84, 28 86, 33 86 L67 86 C72 86, 76 84, 78 80 L85 65 Z" fill="currentColor" opacity="0.15"/>
          <path d="M12 62 C12 60, 14 58, 17 58 L83 58 C86 58, 88 60, 88 62 C88 77, 72 86, 50 86 C28 86, 12 77, 12 62 Z" fill="currentColor" />
          <path d="M22 64 C22 64, 35 68, 50 68 C65 68, 78 64, 78 64" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.4"/>
          <path d="M30 58 C35 48, 42 42, 50 42 C58 42, 65 48, 70 58" fill="currentColor" opacity="0.8"/>
          <circle cx="42" cy="46" r="4" fill="white" opacity="0.9" />
          <circle cx="56" cy="45" r="3" fill="white" opacity="0.9" />
          <circle cx="49" cy="51" r="3.5" fill="white" opacity="0.9" />
          <rect x="42" y="70" width="16" height="6" rx="3" fill="white" />
          <circle cx="42" cy="70" r="4.5" fill="white" />
          <circle cx="42" cy="76" r="4.5" fill="white" />
          <circle cx="58" cy="70" r="4.5" fill="white" />
          <circle cx="58" cy="76" r="4.5" fill="white" />
        </svg>
      ),
      circleClass: "bg-orange-50 border border-orange-100/50 text-brand-orange group-hover:bg-brand-orange group-hover:text-white group-hover:border-brand-orange",
      cardClass: "hover:border-brand-orange/40 hover:shadow-[0_12px_24px_-4px_rgba(249,115,22,0.12)] text-slate-700 hover:text-brand-orange"
    },
    f2: {
      icon: (
        <svg viewBox="0 0 100 100" className="w-10 h-10 sm:w-14 sm:h-14 transition-all duration-300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 35 C15 35, 18 62, 50 62 C82 62, 85 35, 85 35 C85 35, 78 48, 50 48 C22 48, 15 35, 15 35 Z" fill="currentColor" />
          <rect x="44" y="44" width="12" height="10" rx="2" fill="white" opacity="0.9"/>
          <rect x="47" y="47" width="6" height="4" rx="1" fill="currentColor" />
          <path d="M42 59 C39 59, 37 61, 37 64 C37 67, 39 69, 42 69 L58 69 C61 69, 63 67, 63 64 C63 61, 61 59, 58 59 Z" fill="currentColor" opacity="0.7" />
          <circle cx="42" cy="61" r="3" fill="currentColor" opacity="0.7" />
          <circle cx="42" cy="67" r="3" fill="currentColor" opacity="0.7" />
          <circle cx="58" cy="61" r="3" fill="currentColor" opacity="0.7" />
          <circle cx="58" cy="67" r="3" fill="currentColor" opacity="0.7" />
          <circle cx="50" cy="54" r="2.5" fill="currentColor" opacity="0.6"/>
          <line x1="50" y1="52" x2="50" y2="59" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      ),
      circleClass: "bg-orange-50 border border-orange-100/50 text-brand-orange group-hover:bg-brand-orange group-hover:text-white group-hover:border-brand-orange",
      cardClass: "hover:border-brand-orange/40 hover:shadow-[0_12px_24px_-4px_rgba(249,115,22,0.12)] text-slate-700 hover:text-brand-orange"
    },
    f3: {
      icon: (
        <svg viewBox="0 0 100 100" className="w-10 h-10 sm:w-14 sm:h-14 transition-all duration-300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 35 C22 25, 78 25, 78 35 L78 72 C78 82, 22 82, 22 72 Z" fill="currentColor" />
          <ellipse cx="50" cy="32" rx="28" ry="7" fill="currentColor" opacity="0.3"/>
          <ellipse cx="50" cy="32" rx="28" ry="7" stroke="white" strokeWidth="2.5"/>
          <ellipse cx="50" cy="74" rx="28" ry="7" fill="white" opacity="0.2"/>
          <rect x="22" y="42" width="56" height="22" fill="white" opacity="0.9"/>
          <circle cx="50" cy="55" r="4.5" fill="currentColor"/>
          <circle cx="43" cy="48" r="2.5" fill="currentColor"/>
          <circle cx="50" cy="45" r="2.5" fill="currentColor"/>
          <circle cx="57" cy="48" r="2.5" fill="currentColor"/>
          <line x1="28" y1="46" x2="36" y2="46" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
          <line x1="64" y1="46" x2="72" y2="46" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
        </svg>
      ),
      circleClass: "bg-orange-50 border border-orange-100/50 text-brand-orange group-hover:bg-brand-orange group-hover:text-white group-hover:border-brand-orange",
      cardClass: "hover:border-brand-orange/40 hover:shadow-[0_12px_24px_-4px_rgba(249,115,22,0.12)] text-slate-700 hover:text-brand-orange"
    },
    f4: {
      icon: (
        <svg viewBox="0 0 100 100" className="w-10 h-10 sm:w-14 sm:h-14 transition-all duration-300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 35 C18 25, 30 18, 50 18 C70 18, 82 25, 82 35 L82 65 C82 78, 62 88, 50 88 C38 88, 18 78, 18 65 Z" fill="currentColor" />
          <path d="M24 38 C24 30, 34 24, 50 24 C66 24, 76 30, 76 38 L76 62 C76 72, 60 80, 50 80 C40 80, 24 72, 24 62 Z" stroke="white" strokeWidth="2.5" strokeDasharray="4 2" opacity="0.6"/>
          <path d="M41 42 H59" stroke="white" strokeWidth="6" strokeLinecap="round" />
          <path d="M50 33 V51" stroke="white" strokeWidth="6" strokeLinecap="round" />
          <circle cx="50" cy="62" r="5" fill="white"/>
          <circle cx="43" cy="55" r="3" fill="white"/>
          <circle cx="57" cy="55" r="3" fill="white"/>
        </svg>
      ),
      circleClass: "bg-orange-50 border border-orange-100/50 text-brand-orange group-hover:bg-brand-orange group-hover:text-white group-hover:border-brand-orange",
      cardClass: "hover:border-brand-orange/40 hover:shadow-[0_12px_24px_-4px_rgba(249,115,22,0.12)] text-slate-700 hover:text-brand-orange"
    },
    f5: {
      icon: (
        <svg viewBox="0 0 100 100" className="w-10 h-10 sm:w-14 sm:h-14 transition-all duration-300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="70" cy="28" r="7" fill="currentColor" opacity="0.25" />
          <circle cx="76" cy="40" r="5" fill="currentColor" opacity="0.25" />
          <circle cx="28" cy="74" r="8" fill="currentColor" opacity="0.25" />
          <path d="M35 38 C35 34, 42 32, 50 32 C58 32, 65 34, 65 38 L65 76 C65 81, 58 84, 50 84 C42 84, 35 81, 35 76 Z" fill="currentColor" />
          <rect x="45" y="22" width="10" height="10" rx="2" fill="currentColor" opacity="0.8" />
          <line x1="43" y1="30" x2="57" y2="30" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="40" y="44" width="20" height="24" rx="4" fill="white" />
          <path d="M50 49 C47 52, 47 56, 50 59 C53 56, 53 52, 50 49 Z" fill="currentColor" />
          <path d="M22 35 L26 39 M26 35 L22 39" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.6"/>
        </svg>
      ),
      circleClass: "bg-orange-50 border border-orange-100/50 text-brand-orange group-hover:bg-brand-orange group-hover:text-white group-hover:border-brand-orange",
      cardClass: "hover:border-brand-orange/40 hover:shadow-[0_12px_24px_-4px_rgba(249,115,22,0.12)] text-slate-700 hover:text-brand-orange"
    },
    f6: {
      icon: (
        <svg viewBox="0 0 100 100" className="w-10 h-10 sm:w-14 sm:h-14 transition-all duration-300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 54 C20 37, 33 24, 50 24 C67 24, 80 37, 80 54 C80 67, 72 78, 50 84 C28 78, 20 67, 20 54 Z" fill="currentColor" opacity="0.15" />
          <path d="M50 78 C50 78, 28 64, 28 48 C28 38, 36 30, 44 30 C47 30, 49 31, 50 33 C51 31, 53 30, 56 30 C64 30, 72 38, 72 48 C72 64, 50 78, 50 78 Z" fill="currentColor" />
          <circle cx="50" cy="51" r="5" fill="white" />
          <circle cx="42" cy="44" r="3" fill="white" />
          <circle cx="50" cy="40" r="3" fill="white" />
          <circle cx="58" cy="44" r="3" fill="white" />
          <path d="M30 82 A 28 28 0 0 1 70 82" stroke="white" strokeWidth="3.5" strokeLinecap="round" opacity="0.5" />
        </svg>
      ),
      circleClass: "bg-orange-50 border border-orange-100/50 text-brand-orange group-hover:bg-brand-orange group-hover:text-white group-hover:border-brand-orange",
      cardClass: "hover:border-brand-orange/40 hover:shadow-[0_12px_24px_-4px_rgba(249,115,22,0.12)] text-slate-700 hover:text-brand-orange"
    }
  };

  return (
    <section className="py-4 bg-transparent">
      <div className="container">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight italic">دسترسی سریع</h2>
          <button onClick={() => onNavClick('همه')} className="text-sm text-brand-orange font-bold hover:underline underline-offset-4">مشاهده همه ←</button>
        </div>
        
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {foodCategories.map((cat, idx) => {
            const style = catStyleMap[cat.id] || {
              icon: <PawPrint className="w-7 h-7 sm:w-10 sm:h-10 transition-transform group-hover:scale-110 duration-300" />,
              circleClass: "bg-orange-50 border border-orange-100/80 text-orange-600 group-hover:bg-brand-orange group-hover:text-white group-hover:border-brand-orange",
              cardClass: "hover:border-orange-300 hover:shadow-[0_8px_20px_-4px_rgba(249,115,22,0.15)] text-slate-700 hover:text-brand-orange"
            };

            return (
              <motion.div 
                key={cat.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                viewport={{ once: true, margin: "-50px" }}
                onClick={() => onNavClick(cat.name)}
                className={`bg-white p-3 sm:p-5 rounded-2xl text-center border border-slate-100 transition-all cursor-pointer shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)] group flex flex-col items-center justify-center transform hover:-translate-y-1 duration-200 ${style.cardClass}`}
              >
                <div className={`w-14 h-14 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mb-2 sm:mb-3 shadow-inner transform group-hover:scale-110 transition-all duration-300 ${style.circleClass}`}>
                  {style.icon}
                </div>
                <div className="text-[10px] sm:text-xs font-black line-clamp-2 leading-tight sm:line-clamp-1 sm:leading-normal h-8 sm:h-auto flex items-center justify-center text-center px-1">
                  {cat.name}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const ProductCard = React.memo(({ product, onAddToCart, onClick, variant = 'default' }: any) => {
  const isCompact = variant === 'compact';
  
  return (
    <motion.div 
      layout="position"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      whileHover={{ y: -8 }}
      className={`${isCompact ? 'w-[110px] xs:w-[130px] sm:w-[180px] md:w-[220px] shrink-0' : 'w-full'} group cursor-pointer will-change-transform bg-white rounded-[18px] sm:rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:border-brand-orange transition-all duration-500 overflow-hidden`}
      onClick={() => onClick(product)}
    >
      <div className={`relative ${isCompact ? 'aspect-[4/3]' : 'aspect-square'} overflow-hidden bg-slate-100 group-cursor-pointer rounded-t-[18px] sm:rounded-t-[32px]`}>
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 backface-hidden"
          referrerPolicy="no-referrer"
          loading="lazy"
          width="400"
          height="400"
        />
        
        {product.discountPrice && (
          <div className={`absolute top-2 right-2 bg-red-500 text-white ${isCompact ? 'text-[7px] px-1.5 py-0.5' : 'text-xs px-3 py-1'} font-black rounded-full shadow-lg z-10`}>
            {Math.round(((product.price - product.discountPrice) / product.price) * 100)}٪
          </div>
        )}
        
        {!isCompact && product.isBestSeller && (
          <div className="absolute top-4 left-4 bg-brand-orange text-white text-[10px] uppercase font-black py-1 px-2 rounded-md tracking-tighter z-10">
            پرفروش
          </div>
        )}

        <button className={`absolute bottom-2 left-2 ${isCompact ? 'w-6 h-6' : 'w-10 h-10'} bg-white/90 backdrop-blur shadow-lg rounded-lg sm:rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 z-10`}>
          <Heart size={isCompact ? 12 : 20} />
        </button>
      </div>
      
      <div className={`${isCompact ? 'p-2 sm:p-3 gap-0.5' : 'p-3 sm:p-5 gap-1.5 sm:gap-3'} flex flex-col`}>
        <div className={`text-[6px] sm:text-[8px] ${isCompact ? 'mb-0' : 'mb-0.5 sm:mb-1'} text-brand-orange font-black uppercase tracking-wider`}>{product.brand}</div>
        <h3 className={`font-bold text-gray-800 line-clamp-2 leading-tight sm:leading-relaxed ${isCompact ? 'text-[9px] sm:text-[10px] h-6 sm:h-8' : 'text-[10px] sm:text-sm lg:text-base h-8 sm:h-12'}`}>{product.name}</h3>
        
        {!isCompact && (
          <div className="flex items-center gap-1 min-h-[12px]">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`w-3 h-3 rounded-full ${i < Math.floor(product.rating) ? 'bg-yellow-400' : 'bg-gray-200'}`} />
            ))}
            <span className="text-[10px] font-bold text-gray-400 mr-1">({product.reviewsCount})</span>
          </div>
        )}
        
        <div className={`flex items-center justify-between gap-1 sm:gap-2 ${isCompact ? 'mt-0.5' : 'pt-1.5 sm:pt-2'}`}>
          <div className="flex flex-col min-w-0">
            {product.discountPrice ? (
              <>
                <span className={`text-[6px] sm:text-[8px] text-slate-400 line-through truncate leading-none`}>{toPersianDigits(product.price)}</span>
                <span className={`${isCompact ? 'text-[9px] sm:text-xs' : 'text-xs sm:text-base'} font-black text-slate-800 truncate leading-none mt-0.5`}>
                  {toPersianDigits(product.discountPrice)} 
                  <span className={`scale-75 sm:scale-100 inline-block ${isCompact ? 'text-[6px]' : 'text-[7px] sm:text-[8px]'} mr-0.5 ml-0.5`}>ت</span>
                </span>
              </>
            ) : (
              <span className={`${isCompact ? 'text-[9px] sm:text-xs' : 'text-xs sm:text-base'} font-black text-slate-800 truncate leading-none`}>
                {toPersianDigits(product.price)} 
                <span className={`scale-75 sm:scale-100 inline-block ${isCompact ? 'text-[6px]' : 'text-[7px] sm:text-[8px]'} mr-0.5 ml-0.5`}>ت</span>
              </span>
            )}
          </div>
          
          <button 
            onClick={(e) => { e.stopPropagation(); onAddToCart(e, product); }}
            className={`${isCompact ? 'w-5 h-5 sm:w-8 sm:h-8' : 'w-7 h-7 sm:w-10 h-10'} bg-brand-orange text-white rounded-lg sm:rounded-xl flex items-center justify-center hover:bg-brand-orange-dark transition-colors shadow-sm shrink-0 active:scale-90`}
          >
            <ShoppingCart size={isCompact ? 10 : 16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
        </div>
      </div>
    </motion.div>
  );
});

const TrustSection = () => {
  return (
    <footer className="bg-white border border-slate-100 py-10 px-6 lg:px-12 container my-12 rounded-[40px] shadow-sm grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
      <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-right">
        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner italic">🚚</div>
        <div className="space-y-0.5">
           <h4 className="text-xs font-black text-slate-800">ارسال سریع</h4>
           <p className="text-[9px] font-bold text-slate-400">تحویل در همان روز</p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-right">
        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner">🛡️</div>
        <div className="space-y-0.5">
           <h4 className="text-xs font-black text-slate-800">ضمانت اصالت</h4>
           <p className="text-[9px] font-bold text-slate-400">کالای ۱۰۰٪ اورجینال</p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-right">
        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner">📞</div>
        <div className="space-y-0.5">
           <h4 className="text-xs font-black text-slate-800">پشتیبانی ۲۴ ساعته</h4>
           <p className="text-[9px] font-bold text-slate-400">پاسخگویی حتی تعطیلات</p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-right">
        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner">💳</div>
        <div className="space-y-0.5">
           <h4 className="text-xs font-black text-slate-800">پرداخت امن</h4>
           <p className="text-[9px] font-bold text-slate-400">بهترین درگاه‌های بانکی</p>
        </div>
      </div>
    </footer>
  );
};

const ShopView = ({ 
  selectedCategory, 
  setSelectedCategory, 
  setSelectedProduct, 
  handleAddToCart,
  products = PRODUCTS,
  categories = CATEGORIES,
  foodCategories = FOOD_CATEGORIES
}: { 
  selectedCategory: string | null, 
  setSelectedCategory: (cat: string | null) => void, 
  setSelectedProduct: (product: any) => void, 
  handleAddToCart: (e: React.MouseEvent, product: any) => void,
  products?: Product[],
  categories?: Category[],
  foodCategories?: any[]
}) => {
  const [expandedSidebarCats, setExpandedSidebarCats] = useState<Record<string, boolean>>({});
  
  const toggleSidebarCat = (id: string) => {
    setExpandedSidebarCats(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredProducts = React.useMemo(() => {
    if (!selectedCategory) return products;
    
    // Normalize and split the selected category into keywords for more robust matching
    const searchLower = selectedCategory.toLowerCase();
    const searchKeywords = searchLower.split(/\s+/).filter(k => k.length > 1);
    
    const isDogProduct = (p: Product) => {
      const cat = (p.category || '').toLowerCase();
      const name = (p.name || '').toLowerCase();
      return cat.includes('سگ') || name.includes('سگ') || cat.includes('dog');
    };

    const isCatProduct = (p: Product) => {
      const cat = (p.category || '').toLowerCase();
      const name = (p.name || '').toLowerCase();
      return cat.includes('گربه') || name.includes('گربه') || cat.includes('cat');
    };

    const isOfficialOther = (p: Product) => {
      const cat = (p.category || '').toLowerCase();
      const name = (p.name || '').toLowerCase();
      return cat.includes('پرنده') || name.includes('پرنده') || cat.includes('bird') || cat.includes('جونده') || name.includes('جونده') || cat.includes('همستر') || name.includes('همستر') || cat.includes('rodent') || name.includes('خرگوش') || cat.includes('ماهی') || name.includes('ماهی') || cat.includes('آکواریوم') || name.includes('آکواریوم') || cat.includes('fish') || cat.includes('aquatic');
    };

    const isGuardianProduct = (p: Product) => {
      const cat = (p.category || '').toLowerCase();
      const name = (p.name || '').toLowerCase();
      return cat.includes('سرپرست') || name.includes('سرپرست') || cat.includes('guardian') || name.includes('کتاب') || name.includes('هودی') || name.includes('پرزگیر') || name.includes('پیاده‌روی');
    };

    const isBirdProduct = (p: Product) => {
      const cat = (p.category || '').toLowerCase();
      const name = (p.name || '').toLowerCase();
      return cat.includes('پرنده') || name.includes('پرنده') || cat.includes('bird');
    };

    const isRodentProduct = (p: Product) => {
      const cat = (p.category || '').toLowerCase();
      const name = (p.name || '').toLowerCase();
      return cat.includes('جونده') || name.includes('جونده') || cat.includes('همستر') || name.includes('همستر') || cat.includes('rodent') || name.includes('خرگوش');
    };

    const isAquaticProduct = (p: Product) => {
      const cat = (p.category || '').toLowerCase();
      const name = (p.name || '').toLowerCase();
      return cat.includes('ماهی') || name.includes('ماهی') || cat.includes('آکواریوم') || name.includes('آکواریوم') || cat.includes('fish') || cat.includes('aquatic');
    };

    const isOtherProduct = (p: Product) => {
      return isBirdProduct(p) || isRodentProduct(p) || isAquaticProduct(p) || (!isDogProduct(p) && !isCatProduct(p) && !isGuardianProduct(p));
    };

    if (selectedCategory === 'سگ') {
      return products.filter(isDogProduct);
    }
    if (selectedCategory === 'گربه') {
      return products.filter(isCatProduct);
    }
    if (selectedCategory === 'سرپرست حیوانات') {
      return products.filter(isGuardianProduct);
    }
    if (selectedCategory === 'پرندگان') {
      return products.filter(isBirdProduct);
    }
    if (selectedCategory === 'جوندگان') {
      return products.filter(isRodentProduct);
    }
    if (selectedCategory === 'آبزیان') {
      return products.filter(isAquaticProduct);
    }
    if (selectedCategory === 'سایر حیوانات') {
      return products.filter(isOtherProduct);
    }
    
    return products.filter(p => {
      const catLower = p.category.toLowerCase();
      const nameLower = p.name.toLowerCase();
      
      // 1. Check for exact match or keyword match in category/name
      if (catLower.includes(searchLower) || nameLower.includes(searchLower)) return true;
      
      // Check if any keyword matches
      if (searchKeywords.some(k => catLower.includes(k) || nameLower.includes(k))) return true;

      // 2. Check if selectedCategory is a main animal category
      const animalCat = categories.find(c => c.name === selectedCategory);
      if (animalCat?.subcategories?.some(sub => 
        catLower.includes(sub.toLowerCase()) || nameLower.includes(sub.toLowerCase())
      )) return true;
      
      // 3. Check if selectedCategory is a food category
      const foodCat = foodCategories.find(c => c.name === selectedCategory);
      if (foodCat?.subcategories?.some(sub => 
        catLower.includes(sub.toLowerCase()) || nameLower.includes(sub.toLowerCase())
      )) return true;

      return false;
    });
  }, [selectedCategory, products, categories, foodCategories]);

  return (
    <div className="pb-20 container">
      <div className="flex flex-col lg:grid lg:grid-cols-[300px_1fr] gap-10">
        {/* Filters Sidebar */}
        <aside className="space-y-10 lg:sticky lg:top-32 h-fit">
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50">
              <h3 className="text-lg font-black text-slate-800">فیلتر محصولات</h3>
            </div>
            
            <div className="p-4 space-y-2">
              <button 
                onClick={() => setSelectedCategory(null)}
                className={`w-full text-right p-4 rounded-2xl text-xs font-black transition-all ${!selectedCategory ? 'bg-brand-orange text-white' : 'hover:bg-slate-50 text-slate-600'}`}
              >
                نمایش همه محصولات
              </button>

              <div className="pt-4 space-y-4">
                <h4 className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">انتخاب حیوان</h4>
                <div className="grid grid-cols-2 gap-2 px-2">
                   {NAV_CATEGORIES.map(cat => (
                     <button 
                       key={cat.id}
                       onClick={() => setSelectedCategory(cat.name)}
                       className={`p-3 rounded-2xl text-[10px] font-black border transition-all ${selectedCategory === cat.name ? 'border-brand-orange bg-orange-50 text-brand-orange' : 'border-slate-100 hover:border-brand-orange text-slate-400'}`}
                     >
                       {cat.name}
                     </button>
                   ))}
                </div>
              </div>

              <div className="pt-6 space-y-2">
                 <h4 className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">دسته‌بندی‌ها</h4>
                 {NAV_CATEGORIES.map(cat => (
                   <div key={cat.id} className="space-y-1">
                      <button 
                        onClick={() => toggleSidebarCat(cat.id)}
                        className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 group text-right"
                      >
                        <span className="text-xs font-bold text-slate-600 group-hover:text-brand-orange transition-colors">{cat.name}</span>
                        <ChevronDown size={14} className={`text-slate-300 transition-transform ${expandedSidebarCats[cat.id] ? 'rotate-180' : ''}`} />
                      </button>
                      
                      <AnimatePresence>
                        {expandedSidebarCats[cat.id] && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden pr-4"
                          >
                            <div className="py-1 space-y-1">
                              {cat.subcategories?.map(sub => (
                                <button 
                                  key={sub}
                                  onClick={() => setSelectedCategory(sub)}
                                  className={`w-full text-right p-2 text-[10px] font-bold rounded-lg transition-all ${selectedCategory === sub ? 'text-brand-orange' : 'text-slate-400 hover:text-brand-orange'}`}
                                >
                                  • {sub}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                   </div>
                 ))}
              </div>
            </div>
          </div>

          <div className="p-8 bg-orange-50 rounded-[40px] space-y-4 border border-orange-100 shadow-sm">
            <div className="w-10 h-10 bg-brand-orange rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-orange/30">
              <Clock size={20} />
            </div>
            <h4 className="font-black text-brand-orange">ارسال فوری پِت‌وان</h4>
            <p className="text-[10px] font-bold text-slate-500 leading-relaxed">با خرید بالای ۲ میلیون تومان، ارسال تمام سفارشات شما رایگان و با اولویت VIP خواهد بود.</p>
            <button className="text-[10px] font-black border-b-2 border-brand-orange/20 pb-0.5 hover:border-brand-orange transition-all">مشاهده شرایط ارسال</button>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50 p-4 rounded-2xl">
            <span className="text-sm font-bold text-gray-500">نمایش {filteredProducts.length} محصول</span>
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-gray-400">مرتب‌سازی:</span>
              <select className="bg-transparent border-none text-sm font-bold focus:ring-0 cursor-pointer">
                <option>جدیدترین‌ها</option>
                <option>ارزان‌ترین</option>
                <option>گران‌ترین</option>
                <option>پرفروش‌ترین</option>
              </select>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8 content-auto">
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={handleAddToCart}
                  onClick={(p: any) => setSelectedProduct(p)}
                />
              ))}
            </div>
          ) : (
            <div className="py-40 text-center space-y-6">
              <div className="text-gray-200">
                <Search size={80} className="mx-auto" />
              </div>
              <h3 className="text-xl font-bold">محصولی پیدا نشد</h3>
              <button onClick={() => setSelectedCategory(null)} className="btn-primary">نمایش همه محصولات</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const HomeView = ({ 
  setView, 
  selectedCategory,
  setSelectedCategory, 
  setSelectedProduct, 
  handleAddToCart,
  products = PRODUCTS,
  categories = CATEGORIES,
  foodCategories = FOOD_CATEGORIES,
  banners,
  articles = [],
  discounts = []
}: { 
  setView: (v: any) => void, 
  selectedCategory: string | null,
  setSelectedCategory: (c: any) => void, 
  setSelectedProduct: (p: any) => void, 
  handleAddToCart: (e: any, p: any) => void,
  products?: Product[],
  categories?: Category[],
  foodCategories?: Category[],
  banners?: any[],
  articles?: any[],
  discounts?: any[]
}) => {
  const [activeArticle, setActiveArticle] = useState<any>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const productsToShow = React.useMemo(() => {
    if (!selectedCategory) return products;
    
    const searchLower = selectedCategory.toLowerCase();
    
    const isDogProduct = (p: Product) => {
      const cat = (p.category || '').toLowerCase();
      const name = (p.name || '').toLowerCase();
      return cat.includes('سگ') || name.includes('سگ') || cat.includes('dog');
    };

    const isCatProduct = (p: Product) => {
      const cat = (p.category || '').toLowerCase();
      const name = (p.name || '').toLowerCase();
      return cat.includes('گربه') || name.includes('گربه') || cat.includes('cat');
    };

    const isGuardianProduct = (p: Product) => {
      const cat = (p.category || '').toLowerCase();
      const name = (p.name || '').toLowerCase();
      return cat.includes('سرپرست') || name.includes('سرپرست') || cat.includes('guardian') || name.includes('کتاب') || name.includes('هودی') || name.includes('پرزگیر') || name.includes('پیاده‌روی');
    };

    const isBirdProduct = (p: Product) => {
      const cat = (p.category || '').toLowerCase();
      const name = (p.name || '').toLowerCase();
      return cat.includes('پرنده') || name.includes('پرنده') || cat.includes('bird');
    };

    const isRodentProduct = (p: Product) => {
      const cat = (p.category || '').toLowerCase();
      const name = (p.name || '').toLowerCase();
      return cat.includes('جونده') || name.includes('جونده') || cat.includes('همستر') || name.includes('همستر') || cat.includes('rodent') || name.includes('خرگوش');
    };

    const isAquaticProduct = (p: Product) => {
      const cat = (p.category || '').toLowerCase();
      const name = (p.name || '').toLowerCase();
      return cat.includes('ماهی') || name.includes('ماهی') || cat.includes('آکواریوم') || name.includes('آکواریوم') || cat.includes('fish') || cat.includes('aquatic');
    };

    const isOtherProduct = (p: Product) => {
      return isBirdProduct(p) || isRodentProduct(p) || isAquaticProduct(p) || (!isDogProduct(p) && !isCatProduct(p) && !isGuardianProduct(p));
    };

    if (selectedCategory === 'سگ') {
      return products.filter(isDogProduct);
    }
    if (selectedCategory === 'گربه') {
      return products.filter(isCatProduct);
    }
    if (selectedCategory === 'سرپرست حیوانات') {
      return products.filter(isGuardianProduct);
    }
    if (selectedCategory === 'پرندگان') {
      return products.filter(isBirdProduct);
    }
    if (selectedCategory === 'جوندگان') {
      return products.filter(isRodentProduct);
    }
    if (selectedCategory === 'آبزیان') {
      return products.filter(isAquaticProduct);
    }
    if (selectedCategory === 'سایر حیوانات') {
      return products.filter(isOtherProduct);
    }

    return products.filter(p => {
      const catLower = (p.category || '').toLowerCase();
      const nameLower = (p.name || '').toLowerCase();
      
      // 1. Direct match
      if (catLower.includes(searchLower) || nameLower.includes(searchLower)) return true;
      
      // 2. Animal categories match
      const animalCat = categories.find(c => c.name === selectedCategory);
      if (animalCat?.subcategories?.some(sub => 
        catLower.includes(sub.toLowerCase()) || nameLower.includes(sub.toLowerCase())
      )) return true;
      
      // 3. Food categories match
      const foodCat = foodCategories.find(c => c.name === selectedCategory);
      if (foodCat?.subcategories?.some(sub => 
        catLower.includes(sub.toLowerCase()) || nameLower.includes(sub.toLowerCase())
      )) return true;

      // 4. Keywords match
      const keywords = searchLower.split(/\s+(?:و\s+)?/).filter(k => k.length > 2);
      if (keywords.length > 0 && keywords.some(k => catLower.includes(k) || nameLower.includes(k))) return true;
      
      return false;
    });
  }, [selectedCategory, products, categories, foodCategories]);

  return (
    <>
      <HeroSlider onCtaClick={() => setView('shop')} slides={banners} />
      
      {selectedCategory ? (
        <div className="container pb-12 py-4">
           <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-brand-orange/10 text-brand-orange rounded-xl flex items-center justify-center font-black animate-pulse">
                    <PawPrint size={18} />
                 </div>
                 <h2 className="text-2xl font-black text-slate-800 tracking-tight italic">محصولات مربوط به {selectedCategory}</h2>
              </div>
              <button 
                onClick={() => setSelectedCategory(null)}
                className="text-xs font-black text-slate-400 hover:text-brand-orange transition-colors underline underline-offset-4"
               >
                 حذف فیلتر ×
              </button>
           </div>

           <CircularCategoryCarousel 
             activeCategory={selectedCategory}
             onCategoryClick={(cat) => setSelectedCategory(selectedCategory === cat ? null : cat)} 
             categories={categories}
           />
           
            {/* Subcategories for سایر حیوانات */}
            {(selectedCategory === 'سایر حیوانات' || ['پرندگان', 'جوندگان', 'آبزیان'].includes(selectedCategory || '')) && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="flex flex-wrap items-center justify-center gap-3 mt-4 mb-2 bg-orange-50/45 p-3 rounded-2xl border border-orange-100/50 max-w-2xl mx-auto"
              >
                <span className="text-[10px] font-black text-slate-400 ml-2">زیردسته‌های سایر حیوانات:</span>
                {[
                  { name: 'سایر حیوانات', label: 'همه سایر حیوانات', icon: '🐾' },
                  { name: 'پرندگان', label: 'پرندگان', icon: '🦜' },
                  { name: 'جوندگان', label: 'جوندگان', icon: '🐹' },
                  { name: 'آبزیان', label: 'آبزیان', icon: '🐠' }
                ].map(sub => (
                  <button
                    key={sub.name}
                    onClick={() => setSelectedCategory(sub.name)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                      selectedCategory === sub.name 
                        ? 'bg-brand-orange text-white shadow-md shadow-brand-orange/20 scale-105' 
                        : 'bg-white text-slate-600 hover:bg-slate-100/80 border border-slate-100'
                    }`}
                  >
                    <span className="text-sm">{sub.icon}</span>
                    <span>{sub.label}</span>
                  </button>
                ))}
              </motion.div>
            )}

           <div className="mt-6">
             {productsToShow.length > 0 ? (
               <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
                 {productsToShow.map(product => (
                   <ProductCard 
                     key={product.id} 
                     product={product} 
                     onAddToCart={handleAddToCart} 
                     onClick={(p: any) => setSelectedProduct(p)} 
                   />
                 ))}
               </div>
             ) : (
               <div className="py-12 text-center bg-white rounded-[40px] border border-dashed border-slate-200">
                  <Search size={48} className="mx-auto mb-4 text-slate-200" />
                  <p className="text-slate-400 font-bold">در حال حاضر محصولی در این دسته‌بندی موجود نیست.</p>
                  <button onClick={() => setSelectedCategory(null)} className="btn-primary mt-6">مشاهده همه محصولات</button>
               </div>
             )}
           </div>
        </div>
      ) : (
        <>
          <section className="py-2 bg-transparent overflow-hidden">
            <div className="container">
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-1">
                  <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight italic">تخفیف‌های شگفت‌انگیز امروز 🔥</h2>
                  <div className="flex items-center gap-2 text-red-500 font-bold">
                    <Clock size={16} />
                    <span className="text-[10px]">۱۱:۴۵:۳۰ مانده تا پایان</span>
                  </div>
                </div>
                <button onClick={() => setView('shop')} className="text-sm text-brand-orange font-bold hover:underline underline-offset-4">مشاهده همه ←</button>
              </div>
              
              <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory content-auto">
                {products.filter(p => p.discountPrice).slice(0, 8).map(product => (
                  <div key={product.id} className="snap-start">
                    <ProductCard 
                      product={product} 
                      onAddToCart={handleAddToCart} 
                      onClick={(p: any) => setSelectedProduct(p)} 
                      variant="compact"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <CircularCategoryCarousel 
            activeCategory={selectedCategory}
            onCategoryClick={(cat) => setSelectedCategory(selectedCategory === cat ? null : cat)} 
            categories={categories}
          />

          {/* Subcategories for سایر حیوانات */}
          {(selectedCategory === 'سایر حیوانات' || ['پرندگان', 'جوندگان', 'آبزیان'].includes(selectedCategory || '')) && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="flex flex-wrap items-center justify-center gap-3 mt-4 mb-2 bg-orange-50/45 p-3 rounded-2xl border border-orange-100/50 max-w-2xl mx-auto"
            >
              <span className="text-[10px] font-black text-slate-400 ml-2">زیردسته‌های سایر حیوانات:</span>
              {[
                { name: 'سایر حیوانات', label: 'همه سایر حیوانات', icon: '🐾' },
                { name: 'پرندگان', label: 'پرندگان', icon: '🦜' },
                { name: 'جوندگان', label: 'جوندگان', icon: '🐹' },
                { name: 'آبزیان', label: 'آبزیان', icon: '🐠' }
              ].map(sub => (
                <button
                  key={sub.name}
                  onClick={() => setSelectedCategory(sub.name)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                    selectedCategory === sub.name 
                      ? 'bg-brand-orange text-white shadow-md shadow-brand-orange/20 scale-105' 
                      : 'bg-white text-slate-600 hover:bg-slate-100/80 border border-slate-100'
                  }`}
                >
                  <span className="text-sm">{sub.icon}</span>
                  <span>{sub.label}</span>
                </button>
              ))}
            </motion.div>
          )}

          <CategoriesSection onNavClick={(cat) => { setSelectedCategory(selectedCategory === cat ? null : cat); window.scrollTo({ top: 0, behavior: 'smooth' }); }} foodCategories={foodCategories} />

          {/* Dynamic Coupons Section */}
          {discounts && discounts.filter(d => d.active).length > 0 && (
            <section className="py-4 bg-transparent overflow-hidden">
              <div className="container">
                <div className="mb-4">
                  <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                    <Tag size={18} className="text-brand-orange" />
                    <span>کدهای تخفیف و بن‌های خرید فعال 🏷️</span>
                  </h2>
                  <p className="text-[10px] text-slate-400 font-bold">جهت تخفیف در خرید کدهای زیر را ثبت کنید</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {discounts.filter(d => d.active).map(discount => (
                    <div key={discount.id} className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-4 border border-orange-100 flex items-center justify-between gap-4 relative overflow-hidden shadow-sm group hover:border-brand-orange transition-all duration-300">
                      <div className="space-y-1 text-right">
                        <span className="bg-brand-orange/15 text-brand-orange text-[9px] font-black px-2 py-0.5 rounded-full">{discount.percent}٪ تخفیف ویژه</span>
                        <h4 className="text-xs font-black text-slate-800">{discount.title}</h4>
                        <p className="text-[9px] font-bold text-slate-400 leading-relaxed">{discount.description}</p>
                      </div>
                      <div className="flex flex-col items-center gap-1.5 bg-white border border-dashed border-orange-200 p-2 rounded-xl shrink-0">
                        <span className="font-mono text-xs font-black text-slate-800 select-all tracking-wider">{discount.code}</span>
                        <button 
                          onClick={() => handleCopyCode(discount.code)}
                          className="text-[8px] font-black px-2 py-1.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors leading-none cursor-pointer"
                        >
                          {copiedCode === discount.code ? 'کپی شد ✔' : 'کپی کد'}
                        </button>
                      </div>
                      <div className="absolute -top-12 -left-12 w-24 h-24 bg-brand-orange/5 rounded-full pointer-events-none" />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          <section className="py-2 bg-transparent overflow-hidden">
            <div className="container">
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-1">
                  <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight italic">محبوب‌ترین‌ها 🔥</h2>
                  <p className="text-[10px] text-slate-400 font-bold">انتخاب‌های برتر همراهان پِت‌وان</p>
                </div>
                <button onClick={() => setView('shop')} className="text-sm text-brand-orange font-bold hover:underline underline-offset-4">مشاهده همه ←</button>
              </div>
              
              <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory content-auto">
                {products.filter(p => p.isBestSeller || p.rating >= 4.7).slice(0, 10).map(product => (
                  <div key={product.id} className="snap-start">
                    <ProductCard 
                      product={product} 
                      onAddToCart={handleAddToCart} 
                      onClick={(p: any) => setSelectedProduct(p)} 
                      variant="compact"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-2">
            <div className="container">
               <div className="relative aspect-[16/5] rounded-[32px] overflow-hidden group shadow-lg border border-slate-100 bg-slate-100">
                  <img src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=1200" alt="Promo Banner" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" referrerPolicy="no-referrer" loading="lazy" width="1200" height="375" />
                  <div className="absolute inset-0 bg-gradient-to-l from-slate-900/80 via-slate-900/40 to-transparent flex items-center px-12 text-white">
                     <div className="max-w-md space-y-4 text-right">
                        <div className="inline-block bg-brand-orange px-3 py-1 rounded-full text-[10px] font-black uppercase">پیشنهاد طلایی</div>
                        <h2 className="text-3xl font-black leading-tight">غذای مکمل مخصوص <br /> توله سگ‌های نژاد کوچک</h2>
                        <h2 className="text-sm text-white/80 font-medium">تا ۳۰٪ تخفیف برای اولین خرید محصولات منتخب برندهای برتر</h2>
                        <button onClick={() => setView('shop')} className="btn-primary mt-2">همین حالا بخرید</button>
                     </div>
                  </div>
               </div>
            </div>
          </section>

          {/* Dynamic Blogs/Articles Section */}
          {articles && articles.length > 0 && (
            <section className="py-8 bg-slate-50 border-y border-slate-100">
              <div className="container">
                <div className="flex items-center justify-between mb-6">
                  <div className="space-y-1 text-right">
                    <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                      <BookOpen size={20} className="text-brand-orange" />
                      <span>مجله دانستنی‌ها و مقالات آموزشی پت‌وان 📖</span>
                    </h2>
                    <p className="text-[10px] text-slate-400 font-bold">راهنماهای علمی و کاربردی برای نگهداری، سلامت و تربیت پت دلبند شما</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {articles.map(article => (
                    <motion.div 
                      key={article.id}
                      whileHover={{ y: -6 }}
                      onClick={() => setActiveArticle(article)}
                      className="bg-white rounded-[24px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:border-orange-200 transition-all cursor-pointer flex flex-col"
                    >
                      <div className="aspect-[16/10] overflow-hidden relative bg-slate-100">
                        <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                        <span className="absolute top-3 right-3 bg-brand-orange text-white text-[9px] font-black px-2.5 py-1 rounded-full">{article.category}</span>
                      </div>
                      <div className="p-5 flex-1 flex flex-col justify-between text-right">
                        <div className="space-y-2">
                          <span className="text-[9px] font-bold text-slate-400">{article.date}</span>
                          <h3 className="text-xs font-black text-slate-800 leading-snug hover:text-brand-orange transition-colors">{article.title}</h3>
                          <p className="text-[10px] font-bold text-slate-500 leading-relaxed line-clamp-2">{article.excerpt}</p>
                        </div>
                        <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-[10px] font-black">
                          <span className="text-brand-orange">مطالعه کامل مقاله ←</span>
                          <span className="text-slate-400 font-bold">{article.author}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Article Reading Modal */}
          <AnimatePresence>
            {activeArticle && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setActiveArticle(null)}
                  className="absolute inset-0 bg-black/60 backdrop-blur-md"
                />
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0, y: 30 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 30 }}
                  className="relative w-full max-w-3xl bg-white rounded-[24px] sm:rounded-[32px] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto z-10"
                >
                  <button 
                    onClick={() => setActiveArticle(null)}
                    className="absolute top-4 left-4 z-20 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
                  >
                    <X size={18} />
                  </button>
                  <div className="aspect-[16/9] bg-slate-100 relative">
                    <img src={activeArticle.image} className="w-full h-full object-cover" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    <div className="absolute bottom-6 right-6 text-white text-right space-y-1">
                      <span className="bg-brand-orange text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase">{activeArticle.category}</span>
                      <h2 className="text-base sm:text-xl font-black mt-2 leading-snug">{activeArticle.title}</h2>
                      <div className="flex items-center gap-3 text-[10px] text-white/80 font-bold pt-1">
                        <span>{activeArticle.author}</span>
                        <span>•</span>
                        <span>{activeArticle.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 sm:p-8 space-y-6 text-right pb-10">
                    <div className="bg-orange-50/50 border-r-4 border-brand-orange p-4 rounded-xl text-[11px] sm:text-xs font-bold text-slate-600 leading-relaxed italic">
                      {activeArticle.excerpt}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-700 leading-loose space-y-4 font-bold whitespace-pre-wrap">
                      {activeArticle.content || activeArticle.excerpt}
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <TrustSection />
          
          <section className="py-12 bg-white/50 backdrop-blur-sm border-y border-slate-100 overflow-hidden">
            <div className="container">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="relative">
                   <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-100 rounded-full blur-3xl opacity-30" />
                   <div className="grid grid-cols-2 gap-4 relative z-10">
                      <div className="aspect-[3/4] bg-slate-100 rounded-3xl overflow-hidden mt-12 shadow-2xl">
                        <img src="https://images.unsplash.com/photo-1548191265-cc70d3d45ba1?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Story 1" referrerPolicy="no-referrer" loading="lazy" width="400" height="533" />
                      </div>
                      <div className="aspect-[3/4] bg-slate-100 rounded-3xl overflow-hidden shadow-2xl">
                        <img src="https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Story 2" referrerPolicy="no-referrer" loading="lazy" width="400" height="533" />
                      </div>
                   </div>
                </div>
                <div className="space-y-8">
                  <div className="w-12 h-1.5 bg-brand-orange rounded-full" />
                  <h2 className="text-4xl font-black text-slate-800 leading-tight">پِت‌وان: <br/>بیش از یک فروشگاه، یک خانواده</h2>
                  <p className="text-base text-slate-600 font-medium leading-relaxed">
                    داستان پِت‌وان از یک آرزوی قلبی شروع شد؛ فراهم کردن بهترین‌ها برای کسانی که وفادارترین دوستان ما هستند. ما می‌دانیم که پت‌ها عضوی از خانواده شما هستند و به همین دلیل در انتخاب هر محصول، بالاترین استانداردهای کیفی و سلامتی را در نظر می‌گیریم.
                  </p>
                  <div className="space-y-4">
                    {[
                      'تامین مستقیم از بهترین برندهای جهان',
                      'مشاوره تخصصی رایگان با دامپزشکان مجرب',
                      'جامعه‌ای از دوستداران حیوانات با ۵۰ هزار عضو'
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 font-bold text-slate-700 text-sm">
                        <div className="w-5 h-5 bg-brand-orange/10 text-brand-orange rounded-full flex items-center justify-center">
                          <PawPrint size={12} />
                        </div>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
};

const AuthView = ({ 
  setView, 
  setIsLoggedIn 
}: { 
  setView: (v: any) => void, 
  setIsLoggedIn: (s: any) => void 
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  
  // Local Toast notification
  const [toast, setToast] = useState<string | null>(null);
  const triggerToastLocal = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Custom Controlled States
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');

  // Bot-prevention security CAPTCHA code generator
  const generateCaptcha = () => {
    const chars = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(result);
    setCaptchaInput('');
  };

  useEffect(() => {
    if (mode === 'signup') {
      generateCaptcha();
      setConfirmPassword('');
      setCaptchaInput('');
    }
  }, [mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'signup') {
      // 1. Password repeat validation
      if (password !== confirmPassword) {
        triggerToastLocal('تکرار رمز عبور با رمز عبور اصلی مطابقت ندارد! ❌');
        return;
      }
      // 2. Client-side security Captcha validation
      if (captchaInput.trim().toUpperCase() !== captchaCode) {
        triggerToastLocal('کد امنیتی صحیح نیست! لطفا مجدد تلاش کنید ❌');
        generateCaptcha();
        return;
      }
    }

    setIsLoggedIn(true);
    setView('account');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20 bg-slate-50/50 relative">
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 left-6 sm:left-auto max-w-sm bg-slate-950/95 border border-slate-800 text-white py-3.5 px-6 rounded-2xl shadow-xl z-[999] text-right font-black text-xs flex items-center justify-between gap-3 shadow-brand-orange/5 backdrop-blur-md animate-fade-in"
          >
            <span className="flex-1">{toast}</span>
            <button type="button" onClick={() => setToast(null)} className="text-slate-400 hover:text-white text-[10px] p-1 font-bold">✖</button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden"
      >
        <div className="p-10 space-y-8">
          <div className="text-center space-y-3">
            <div className="flex justify-center mb-6">
              <div onClick={() => setView('home')} className="flex items-center gap-2 group cursor-pointer inline-flex">
                 <svg width="50" height="50" viewBox="0 0 100 100" className="text-brand-orange transform group-hover:rotate-12 transition-transform duration-300">
                   <circle cx="50" cy="24" r="13" fill="currentColor" />
                   <path d="M 17 46 C 23 66, 35 73, 50 73 C 65 73, 77 66, 83 46" stroke="currentColor" strokeWidth="21" fill="none" strokeLinecap="round" />
                 </svg>
              </div>
            </div>
            <h2 className="text-2xl font-black text-slate-800">
              {mode === 'login' ? 'خوش آمدید' : mode === 'signup' ? 'ساخت حساب کاربری' : 'بازیابی رمز عبور'}
            </h2>
            <p className="text-xs font-bold text-slate-400">
              {mode === 'login' ? 'به خانواده پِت‌وان خوش آمدید' : mode === 'signup' ? 'به دنیای حیوانات خانگی بپیوندید' : 'لینک بازیابی به ایمیل شما ارسال می‌شود'}
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 mr-4">ایمیل یا شماره موبایل</label>
              <input 
                type="text" 
                placeholder="name@example.com"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-brand-orange/20 transition-all text-right"
                required
              />
            </div>
            
            {mode !== 'forgot' && (
              <div className="space-y-1">
                <div className="flex items-center justify-between px-4">
                  <label className="text-[10px] font-black text-slate-400">رمز عبور</label>
                  {mode === 'login' && (
                    <button type="button" onClick={() => setMode('forgot')} className="text-[10px] font-black text-brand-orange hover:underline">فراموشی رمز؟</button>
                  )}
                </div>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-brand-orange/20 transition-all text-right"
                  required
                />
              </div>
            )}

            {mode === 'signup' && (
              <div className="space-y-1 animate-fade-in">
                <label className="text-[10px] font-black text-slate-400 mr-4">تکرار رمز عبور</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-brand-orange/20 transition-all text-right"
                  required
                />
              </div>
            )}

            {mode === 'signup' && (
              <div className="space-y-2 bg-slate-50/50 p-4 rounded-3xl border border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 mr-2">تصویر امنیتی (جلوگیری از ورود ربات)</span>
                  <button 
                    type="button" 
                    onClick={generateCaptcha} 
                    className="text-[10px] font-black text-brand-orange hover:underline flex items-center gap-1 transition-all active:scale-95"
                    title="تغییر تصویر امنیتی"
                  >
                    تغییر عکس 🔄
                  </button>
                </div>
                
                {/* Visual Captcha Row */}
                <div className="flex items-center justify-between gap-4">
                  <div className="relative h-14 w-36 bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-around px-2 select-none overflow-hidden shrink-0" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(235, 94, 40, 0.05) 10px, rgba(235, 94, 40, 0.05) 20px)' }}>
                    {/* Background Noise Grid/Lines */}
                    <div className="absolute inset-0 pointer-events-none opacity-20">
                      <div className="absolute top-1/4 left-0 right-0 h-[2.5px] bg-brand-orange transform rotate-3" />
                      <div className="absolute top-2/4 left-0 right-0 h-[1.5px] bg-slate-600 transform -rotate-2" />
                      <div className="absolute top-3/4 left-0 right-0 h-[2px] bg-brand-orange transform rotate-6" />
                      <div className="absolute top-1/3 left-1/4 w-[1px] h-6 bg-slate-400 transform rotate-12" />
                      <div className="absolute top-1/3 left-2/4 w-[1.5px] h-6 bg-brand-orange transform -rotate-12" />
                      <div className="absolute top-1/3 left-3/4 w-[1px] h-6 bg-slate-400 transform rotate-45" />
                    </div>
                    {captchaCode.split('').map((char, index) => {
                      const rotation = [-18, -10, 8, 15, -6, 12, -12][(index + char.charCodeAt(0)) % 7];
                      const scale = [1.1, 1.2, 0.95, 1.15][(index + char.charCodeAt(0)) % 4];
                      const translate = [-4, -2, 2, 4][(index + char.charCodeAt(0)) % 4];
                      const colors = [
                        'text-brand-orange', 
                        'text-slate-800', 
                        'text-slate-700', 
                        'text-orange-600', 
                        'text-slate-900', 
                        'text-amber-600'
                      ];
                      const selectedColor = colors[(index + char.charCodeAt(0)) % colors.length];
                      return (
                        <span 
                          key={index} 
                          className="font-black tracking-normal select-none pointer-events-none text-lg"
                          style={{ 
                            color: selectedColor === 'text-brand-orange' ? '#eb5e28' : selectedColor === 'text-orange-600' ? '#ea580c' : '#1e293b',
                            transform: `rotate(${rotation}deg) scale(${scale}) translateY(${translate}px)`,
                            filter: 'drop-shadow(1px 1px 0px rgba(255,255,255,0.8))'
                          }}
                        >
                          {char}
                        </span>
                      );
                    })}
                  </div>
                  
                  {/* Access input */}
                  <div className="flex-1">
                    <input 
                      type="text" 
                      placeholder="کد فوق را وارد کنید"
                      value={captchaInput}
                      onChange={(e) => setCaptchaInput(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-xs font-bold focus:ring-2 focus:ring-brand-orange/20 transition-all text-center placeholder:text-slate-300 uppercase tracking-widest"
                      required
                      maxLength={4}
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <div className="flex items-center gap-2 px-4 py-2">
                 <input type="checkbox" id="terms" required className="rounded border-slate-200 text-brand-orange focus:ring-brand-orange" />
                 <label htmlFor="terms" className="text-[10px] font-bold text-slate-500">قوانین و مقررات پِت‌وان را می‌پذیرم</label>
              </div>
            )}

            <button type="submit" className="w-full btn-primary py-4 rounded-2xl text-base font-black shadow-lg shadow-brand-orange/30">
              {mode === 'login' ? 'ورود به حساب' : mode === 'signup' ? 'ثبت‌نام در نظام' : 'ارسال لینک بازیابی'}
            </button>
          </form>

          <div className="relative text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <span className="relative bg-white px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">یا</span>
          </div>

          <div className="text-center">
             <button 
               onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
               className="text-xs font-black text-slate-600 hover:text-brand-orange transition-colors"
              >
               {mode === 'login' ? 'حساب کاربری ندارید؟ ثبت‌نام کنید' : 'قبلاً ثبت‌نام کرده‌اید؟ وارد شوید'}
             </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const AccountDashboard = ({ 
  setIsLoggedIn, 
  setView, 
  setSelectedCategory,
  setCartCount
}: { 
  setIsLoggedIn: (s: any) => void, 
  setView: (v: any) => void, 
  setSelectedCategory: (c: any) => void,
  setCartCount?: React.Dispatch<React.SetStateAction<number>>
}) => {
  const [tab, setTab] = useState<'overview' | 'orders' | 'pets' | 'wishlist' | 'addresses' | 'settings'>('overview');
  
  // Persisted Pets State
  const [pets, setPets] = useState(() => {
    const saved = localStorage.getItem('petone_pets_v3');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'بیمبو', type: 'dog', breed: 'هاسکی', image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=300', age: '۲ سال', weight: '۱۸ کیلوگرم', gender: 'نر' },
      { id: 2, name: 'لوسی', type: 'cat', breed: 'اسکاتیش', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=300', age: '۱ سال', weight: '۴ کیلوگرم', gender: 'ماده' },
      { id: 3, name: 'چیکی', type: 'bird', breed: 'عروس هلندی', image: 'https://images.unsplash.com/photo-1444464666168-49d633b867ad?auto=format&fit=crop&q=80&w=300', age: '۶ ماه', weight: '۱۰۰ گرم', gender: 'نر' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('petone_pets_v3', JSON.stringify(pets));
  }, [pets]);

  // Persisted Wishlist State
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('petone_wishlist_v3');
    return saved ? JSON.parse(saved) : [
      { id: 101, name: 'غذای خشک گربه رویال کنین مدل Fit 32', price: '۱,۴۵۰,۰۰۰', brand: 'رویال کنین', image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&q=80&w=300', category: 'غذای گربه' },
      { id: 102, name: 'قلاده چرمی سگ برند سافاری مقاوم', price: '۳۸۰,۰۰۰', brand: 'سافاری', image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=300', category: 'ملزومات سگ' },
      { id: 103, name: 'مکمل ویتامینه پرندگان برند کانتو', price: '۲۴۰,۰۰۰', brand: 'کانتو', image: 'https://images.unsplash.com/photo-1444464666168-49d633b867ad?auto=format&fit=crop&q=80&w=300', category: 'مکمل پرنده' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('petone_wishlist_v3', JSON.stringify(wishlist));
  }, [wishlist]);

  // Persisted Addresses State: شهر، آدرس، کد پستی
  const [addresses, setAddresses] = useState(() => {
    const saved = localStorage.getItem('petone_addresses_v3');
    return saved ? JSON.parse(saved) : [
      { id: 1, city: 'تهران', text: 'بلوار بهارستان، خیابان مطهری، پلاک ۱۴، واحد ۳', postalCode: '۱۴۳۹۸۷۶۵۴۳' },
      { id: 2, city: 'اصفهان', text: 'خيابان بزرگمهر، کوچه اقاقیا، پلاک ۲۵', postalCode: '۸۱۵۴۶۹۸۷۶۵' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('petone_addresses_v3', JSON.stringify(addresses));
  }, [addresses]);

  // Address Inputs State
  const [addrCity, setAddrCity] = useState('');
  const [addrText, setAddrText] = useState('');
  const [addrPostalCode, setAddrPostalCode] = useState('');
  const [editingAddress, setEditingAddress] = useState<any | null>(null);

  const [showPetModal, setShowPetModal] = useState(false);
  const [selectedPetForEdit, setSelectedPetForEdit] = useState<any>(null);

  // Settings / Profile Data State
  const [profileData, setProfileData] = useState(() => {
    const saved = localStorage.getItem('petone_profile_data_v3');
    return saved ? JSON.parse(saved) : {
      name: 'مهدی محمود',
      email: 'mehdi@petone.ir',
      phone: '۰۹۱۲۳۴۵۶۷۸۹',
      province: 'تهران'
    };
  });

  // Settings inputs for editing
  const [settingsName, setSettingsName] = useState(profileData.name);
  const [settingsEmail, setSettingsEmail] = useState(profileData.email);
  const [settingsProvince, setSettingsProvince] = useState(profileData.province);

  // Simple Notification Toast
  const [toast, setToast] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const handleAddPet = (newPet: any) => {
    if (selectedPetForEdit) {
      setPets((prev: any[]) => prev.map(p => p.id === selectedPetForEdit.id ? { ...newPet, id: p.id } : p));
      triggerToast('اطلاعات پت دلبند شما بروزرسانی شد 🐕');
    } else {
      setPets((prev: any[]) => [...prev, { ...newPet, id: Date.now() }]);
      triggerToast('پت دلبند شما به لیست اضافه شد 🎉');
    }
    setShowPetModal(false);
    setSelectedPetForEdit(null);
  };

  const deletePet = (id: number) => {
    setPets((prev: any[]) => prev.filter(p => p.id !== id));
    triggerToast('پت حذف شد');
  };

  const handleEditPetClick = (pet: any) => {
    setSelectedPetForEdit(pet);
    setShowPetModal(true);
  };

  const handleAddPetClick = () => {
    setSelectedPetForEdit(null);
    setShowPetModal(true);
  };

  const handleRemoveFromWishlist = (id: number) => {
    setWishlist((prev: any[]) => prev.filter(item => item.id !== id));
    triggerToast('کالا با موفقیت از لیست علاقه‌مندی‌ها حذف شد ❌');
  };

  const handleAddToCart = (item: any) => {
    if (setCartCount) {
      setCartCount(prev => prev + 1);
    }
    triggerToast(`"${item.name}" به سبد خرید اضافه شد 🛒`);
  };

  const startEditAddress = (addr: any) => {
    setEditingAddress(addr);
    setAddrCity(addr.city);
    setAddrText(addr.text);
    setAddrPostalCode(addr.postalCode);
  };

  const cancelEditAddress = () => {
    setEditingAddress(null);
    setAddrCity('');
    setAddrText('');
    setAddrPostalCode('');
  };

  const handleAddAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrCity.trim() || !addrText.trim() || !addrPostalCode.trim()) {
      triggerToast('لطفاً تمام فیلدها را به دقت پر کنید ⚠️');
      return;
    }
    if (editingAddress) {
      setAddresses((prev: any[]) => prev.map(a => a.id === editingAddress.id ? {
        ...a,
        city: addrCity.trim(),
        text: addrText.trim(),
        postalCode: addrPostalCode.trim()
      } : a));
      setEditingAddress(null);
      triggerToast('تغییرات آدرس مورد نظر با موفقیت ذخیره شد 📍');
    } else {
      const newAddress = {
        id: Date.now(),
        city: addrCity.trim(),
        text: addrText.trim(),
        postalCode: addrPostalCode.trim()
      };
      setAddresses((prev: any[]) => [...prev, newAddress]);
      triggerToast('آدرس جدید شما ثبت شد 📍');
    }
    setAddrCity('');
    setAddrText('');
    setAddrPostalCode('');
  };

  const handleRemoveAddress = (id: number) => {
    setAddresses((prev: any[]) => prev.filter(a => a.id !== id));
    triggerToast('آدرس ثبت شده با موفقیت حذف شد 🗑️');
  };

  const handleSaveSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...profileData,
      name: settingsName,
      email: settingsEmail,
      province: settingsProvince
    };
    setProfileData(updated);
    localStorage.setItem('petone_profile_data_v3', JSON.stringify(updated));
    triggerToast('تغییرات حساب کاربری با موفقیت ذخیره شد 💾');
  };

  const sections = [
    { id: 'overview', name: 'پیشخوان', icon: <Clock size={18} /> },
    { id: 'orders', name: 'سفارشات من', icon: <ShoppingCart size={18} /> },
    { id: 'pets', name: 'حیوانات من', icon: <PawPrint size={18} /> },
    { id: 'wishlist', name: 'علاقه‌مندی‌ها', icon: <Heart size={18} /> },
    { id: 'addresses', name: 'آدرس‌ها', icon: <MapPin size={18} /> },
    { id: 'settings', name: 'تنظیمات', icon: <User size={18} /> },
  ];

  const OrderCard = ({ id, status, price, date }: any) => (
    <div className="p-3 sm:p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between hover:border-brand-orange transition-all group">
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
         <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-orange-50 group-hover:text-brand-orange transition-colors">
            <ShoppingCart size={18} className="sm:w-5 sm:h-5" />
         </div>
         <div className="space-y-0.5 sm:space-y-1 min-w-0">
            <h4 className="text-[11px] sm:text-sm font-black text-slate-800 truncate max-w-[120px] sm:max-w-none">سفارش: {id}</h4>
            <p className="text-[9px] sm:text-[10px] font-bold text-slate-400">{date}</p>
         </div>
      </div>
      <div className="text-left space-y-1 sm:space-y-2 shrink-0">
         <div className={`text-[8px] sm:text-[9px] font-black px-1.5 sm:px-2 py-0.5 rounded-md inline-block ${status === 'delivered' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
            {status === 'delivered' ? 'تحویل شده' : 'در حال ارسال'}
         </div>
         <div className="text-xs sm:text-sm font-black text-slate-700">{price} <span className="text-[10px] opacity-50">ت</span></div>
      </div>
    </div>
  );

  const PetCard = ({ pet, onEdit }: { pet: any, onEdit: (p: any) => void, key?: any }) => (
    <div className="p-3 sm:p-4 bg-white border border-slate-100 rounded-[24px] flex flex-col items-center gap-3 sm:gap-4 hover:shadow-xl hover:shadow-slate-200/50 transition-all cursor-pointer group relative">
       <button 
         onClick={(e) => { e.stopPropagation(); deletePet(pet.id); }}
         className="absolute top-3 right-3 p-1.5 bg-red-50 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg transition-colors"
         title="حذف حیوان"
       >
         <Trash2 size={14} />
       </button>
       <div 
         onClick={() => onEdit(pet)}
         className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 sm:border-4 border-slate-50 group-hover:border-brand-orange transition-colors"
       >
          <img src={pet.image} className="w-full h-full object-cover" alt={pet.name} referrerPolicy="no-referrer" />
       </div>
       <div className="text-center" onClick={() => onEdit(pet)}>
          <h4 className="text-xs sm:text-sm font-black text-slate-800">{pet.name}</h4>
          <p className="text-[9px] sm:text-[10px] font-bold text-slate-400">{pet.breed}</p>
       </div>
       <div className="flex gap-2">
         <div className="bg-slate-50 px-2 py-0.5 rounded-md text-[8px] font-bold text-slate-500">{pet.age}</div>
         <div className="bg-slate-50 px-2 py-0.5 rounded-md text-[8px] font-bold text-slate-500">{pet.weight}</div>
       </div>
       <button onClick={() => onEdit(pet)} className="text-[9px] sm:text-[10px] font-black text-brand-orange hover:underline">ویرایش پرونده ✂️</button>
    </div>
  );

  const PetModal = () => {
    const isEdit = !!selectedPetForEdit;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState(selectedPetForEdit || {
      name: '',
      type: 'dog',
      breed: '',
      age: '',
      weight: '',
      gender: 'نر',
      image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=300'
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        if (file.size > 3 * 1024 * 1024) {
          triggerToast('حجم عکس نباید بیشتر از ۳ مگابایت باشد ❌');
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({ ...prev, image: reader.result as string }));
          triggerToast('عکس پت دلبند شما بارگذاری شد 📸');
        };
        reader.readAsDataURL(file);
      }
    };

    const onSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleAddPet(formData);
    };

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
          onClick={() => { setShowPetModal(false); setSelectedPetForEdit(null); }} 
        />
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
          className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden p-6 sm:p-8 z-10"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg sm:text-xl font-black text-slate-800">{isEdit ? 'ویرایش پرونده حیوان' : 'افزودن حیوان جدید'}</h2>
            <button 
              onClick={() => { setShowPetModal(false); setSelectedPetForEdit(null); }} 
              className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-lg"
            >
              <X size={18} />
            </button>
          </div>
          
          <form className="space-y-4 text-right" onSubmit={onSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 mr-2">نام حیوان</label>
                <input required type="text" className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-xs font-bold text-right" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 mr-2">نوع حیوان</label>
                <select className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-xs font-bold appearance-none text-right" value={formData.type || 'dog'} onChange={e => setFormData({...formData, type: e.target.value})}>
                  <option value="dog">سگ</option>
                  <option value="cat">گربه</option>
                  <option value="bird">پرنده</option>
                  <option value="other">سایر</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 mr-2">نژاد</label>
                <input required type="text" className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-xs font-bold text-right" value={formData.breed || ''} onChange={e => setFormData({...formData, breed: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 mr-2">سن</label>
                <input required type="text" className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-xs font-bold text-right" value={formData.age || ''} onChange={e => setFormData({...formData, age: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 mr-2">وزن</label>
                <input required type="text" className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-xs font-bold text-right" value={formData.weight || ''} onChange={e => setFormData({...formData, weight: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 mr-2">جنسیت</label>
                <select className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-xs font-bold appearance-none text-right" value={formData.gender || 'نر'} onChange={e => setFormData({...formData, gender: e.target.value})}>
                  <option value="نر">نر</option>
                  <option value="ماده">ماده</option>
                </select>
              </div>
            </div>
            <div className="space-y-2 text-right">
              <label className="text-[10px] font-black text-slate-400 mr-2 block">تصویر حیوان خانگی</label>
              
              {/* File Upload Zone */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-brand-orange/40 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all bg-slate-50/50 hover:bg-orange-50/10 group relative overflow-hidden"
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
                
                {formData.image ? (
                  <div className="flex items-center gap-4 w-full">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shadow-md shrink-0">
                      <img src={formData.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" alt="Pet preview" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[9px] font-bold">
                        تغییر عکس 📸
                      </div>
                    </div>
                    <div className="text-right flex-1">
                      <p className="text-xs font-black text-emerald-600 flex items-center gap-1">
                        <Check size={12} className="text-emerald-600 shrink-0" /> عکس با موفقیت انتخاب شد
                      </p>
                      <button 
                        type="button" 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          setFormData(prev => ({ ...prev, image: '' })); 
                        }} 
                        className="text-[10px] font-bold text-red-500 hover:underline mt-1 block"
                      >
                        حذف عکس و بارگذاری مجدد ✖
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-2">
                    <div className="p-3 bg-white rounded-full text-slate-400 group-hover:text-brand-orange group-hover:scale-110 transition-all shadow-sm mb-2">
                      <Camera size={20} />
                    </div>
                    <p className="text-[11px] font-black text-slate-600">برای بارگذاری یا تغییر عکس کلیک کنید</p>
                    <p className="text-[9px] font-medium text-slate-400 mt-1">فرمت‌های تصویری (حداکثر ۳ مگابایت)</p>
                  </div>
                )}
              </div>

              {/* URL Fallback Option */}
              <div className="pt-2">
                <label className="text-[9px] font-black text-slate-400 mr-2 block mb-1">یا آدرس مستقیم اینترنتی تصویر را وارد کنید:</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border-none rounded-xl py-2.5 px-4 text-[10px] font-medium text-left placeholder:text-slate-300" 
                  dir="ltr" 
                  placeholder="https://example.com/pet.jpg"
                  value={formData.image && !formData.image.startsWith('data:') ? formData.image : ''} 
                  onChange={e => setFormData({...formData, image: e.target.value})} 
                />
              </div>
            </div>
            
            <button type="submit" className="w-full btn-primary py-4 rounded-2xl text-sm font-black mt-4 shadow-lg shadow-brand-orange/20">
              {isEdit ? 'ذخیره تغییرات پرونده' : 'ایجاد پرونده حیوان جدید'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-[80vh] bg-slate-50/50 py-6 sm:py-12 lg:py-20">
      {showPetModal && <PetModal />}
      <div className="container px-4 sm:px-6">
        <div className="grid lg:grid-cols-[280px_1fr] gap-6 sm:gap-8 rtl">
          {/* Sidebar Navigation */}
          <aside className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 border border-slate-100 shadow-sm text-center">
               <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-3 sm:mb-4">
                  <div className="w-full h-full rounded-[24px] sm:rounded-[32px] overflow-hidden bg-slate-100 border-2 sm:border-4 border-white shadow-lg">
                     <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200" alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <button className="absolute -bottom-1 -left-1 w-8 h-8 bg-brand-orange text-white rounded-xl flex items-center justify-center border-4 border-white shadow-lg">
                     <PawPrint size={14} />
                  </button>
               </div>
               <h3 className="text-base sm:text-lg font-black text-slate-800">{profileData.name}</h3>
               <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 tracking-wider font-mono">{profileData.email}</p>
               <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-50 flex items-center justify-around">
                  <div className="text-center">
                     <span className="block text-xs sm:text-sm font-black text-slate-800">۱۲</span>
                     <span className="block text-[7px] sm:text-[8px] font-bold text-slate-400 uppercase">سفارش</span>
                  </div>
                  <div className="w-px h-5 sm:h-6 bg-slate-100" />
                  <div className="text-center">
                     <span className="block text-xs sm:text-sm font-black text-slate-800">{pets.length}</span>
                     <span className="block text-[7px] sm:text-[8px] font-bold text-slate-400 uppercase">حیوان</span>
                  </div>
                  <div className="w-px h-5 sm:h-6 bg-slate-100" />
                  <div className="text-center">
                     <span className="block text-xs sm:text-sm font-black text-slate-800">{wishlist.length}</span>
                     <span className="block text-[7px] sm:text-[8px] font-bold text-slate-400 uppercase">پسندیده</span>
                  </div>
               </div>
               <div className="mt-4 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-50">
                  <button 
                    onClick={() => { setIsLoggedIn(false); setView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="w-full py-3 sm:py-4 text-[11px] sm:text-xs font-black text-red-500 bg-red-50 hover:bg-red-100 rounded-xl sm:rounded-2xl transition-all flex items-center justify-center gap-2"
                  >
                    خروج از حساب کاربری
                    <X size={14} className="sm:w-4 sm:h-4" />
                  </button>
               </div>
            </div>

            <nav className="bg-white rounded-[24px] sm:rounded-[32px] border border-slate-100 shadow-sm overflow-hidden p-1.5 sm:p-2">
               {sections.map(s => (
                 <button
                  key={s.id}
                  onClick={() => setTab(s.id as any)}
                  className={`w-full flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-black transition-all ${tab === s.id ? 'bg-orange-50 text-brand-orange shadow-inner shadow-orange-100/50' : 'text-slate-500 hover:bg-slate-50'}`}
                 >
                   <span className={tab === s.id ? 'text-brand-orange' : 'text-slate-300'}>{s.icon}</span>
                   {s.name}
                 </button>
               ))}
                <button 
                 onClick={() => { setIsLoggedIn(false); setView('home'); }}
                 className="w-full flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-black hidden"
                >
                  <X size={16} />
                  خروج از حساب
                </button>
             </nav>
           </aside>

           {/* Main Content Area */}
           <main className="space-y-6 sm:space-y-8 min-w-0">
              <AnimatePresence mode="wait">
                {tab === 'overview' && (
                  <motion.div key="overview" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6 sm:space-y-8">
                    <div className="bg-brand-orange rounded-[30px] sm:rounded-[40px] p-6 sm:p-10 text-white relative overflow-hidden group shadow-xl sm:shadow-2xl shadow-brand-orange/30">
                       <div className="absolute top-0 left-0 w-48 h-48 sm:w-64 sm:h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl sm:blur-3xl" />
                       <div className="relative z-10 space-y-3 sm:space-y-4">
                          <h2 className="text-xl sm:text-3xl font-black leading-tight">سلام {profileData.name.split(' ')[0]} جان، <br />به پِت‌وان خوش برگشتی! 🐾</h2>
                          <p className="text-xs sm:text-sm text-white/80 font-bold max-w-xs sm:max-w-sm leading-relaxed">امروز برای "{pets[0]?.name || 'حیوان شما'}" کوچولوت محصول جدید آوردم، می‌خوای ببینی؟</p>
                          <button onClick={() => setView('shop')} className="bg-white text-brand-orange px-6 sm:px-8 py-2 sm:py-3 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-black shadow-lg hover:scale-105 transition-transform">بررسی پیشنهادات</button>
                       </div>
                       <div className="absolute left-6 sm:left-10 bottom-0 top-0 flex items-center opacity-10 sm:opacity-20 pointer-events-none transform -rotate-12">
                          <PawPrint size={100} className="sm:w-[180px] sm:h-[180px]" />
                       </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                       <section className="bg-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 border border-slate-100 shadow-sm space-y-4 sm:space-y-6">
                          <div className="flex items-center justify-between">
                             <h3 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-widest">توصیه‌های هوشمند 💡</h3>
                             <div className="bg-orange-100 text-brand-orange text-[7px] sm:text-[8px] font-black px-2 py-0.5 rounded-full">AI INSIGHT</div>
                          </div>
                          <div className="space-y-3 sm:space-y-4">
                             <div 
                               onClick={() => { setSelectedCategory('غذای سگ'); setView('shop'); }}
                               className="p-3 sm:p-4 bg-slate-50 rounded-xl sm:rounded-2xl border-r-4 border-brand-orange space-y-1.5 sm:space-y-2 cursor-pointer hover:bg-orange-50 transition-colors"
                             >
                                <h4 className="text-[11px] sm:text-xs font-black text-slate-800">تغذیه {pets[0]?.name || 'حیوان شما'}</h4>
                                <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 leading-relaxed">با توجه به نژاد {pets[0]?.breed || 'دیفالت'} و سن {pets[0]?.name || 'پت'}، پیشنهاد می‌کنیم مکمل‌های امگا ۳ را برای سلامت پوشش مویی به رژیم غذایی‌اش اضافه کنید.</p>
                             </div>
                             <div 
                               onClick={() => { setSelectedCategory('خدمات'); }}
                               className="p-3 sm:p-4 bg-slate-50 rounded-xl sm:rounded-2xl border-r-4 border-blue-400 space-y-1.5 sm:space-y-2 cursor-pointer hover:bg-blue-50 transition-colors"
                             >
                                <h4 className="text-[11px] sm:text-xs font-black text-slate-800">زمان چکاآپ</h4>
                                <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 leading-relaxed">کمتر از ۲ هفته تا زمان واکسیناسیون سالانه {pets[1]?.name || 'لوسی'} باقی مانده است. می‌توانید از بخش خدمات نوبت رزرو کنید.</p>
                             </div>
                          </div>
                       </section>

                       <section className="bg-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 border border-slate-100 shadow-sm space-y-4 sm:space-y-6">
                          <div className="flex items-center justify-between">
                             <h3 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-widest">سفارشات اخیر</h3>
                             <button onClick={() => setTab('orders')} className="text-[9px] sm:text-[10px] font-black text-brand-orange">مشاهده همه</button>
                          </div>
                          <div className="space-y-2.5 sm:space-y-3">
                             <OrderCard id="PT-8942" status="shipping" date="۱۴ فروردین ۱۴۰۳" price="۱,۴۵۰,۰۰۰" />
                             <OrderCard id="PT-8931" status="delivered" date="۲۸ اسفند ۱۴۰۲" price="۸۹۰,۰۰۰" />
                          </div>
                       </section>
                    </div>

                   <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                      <section className="bg-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 border border-slate-100 shadow-sm space-y-4 sm:space-y-6">
                         <div className="flex items-center justify-between">
                            <h3 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-widest">حیوانات دلبند شما</h3>
                            <button onClick={() => setTab('pets')} className="text-[9px] sm:text-[10px] font-black text-brand-orange">افزودن</button>
                         </div>
                         <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            <div onClick={() => { if (pets[0]) { handleEditPetClick(pets[0]); } else { setTab('pets'); } }} className="p-3 sm:p-4 bg-orange-50/50 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 border border-orange-100/50 cursor-pointer hover:border-brand-orange/40 transition-all">
                               <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden shrink-0"><img src={pets[0]?.image || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=100"} alt="Pet" className="w-full h-full object-cover" referrerPolicy="no-referrer" /></div>
                               <div className="truncate"><h4 className="text-[10px] sm:text-xs font-black text-slate-800 truncate">{pets[0]?.name || 'بیمبو'}</h4><p className="text-[7px] sm:text-[8px] font-bold text-slate-400">{pets[0]?.breed || 'هاسکی'}</p></div>
                            </div>
                            <div onClick={handleAddPetClick} className="p-3 sm:p-4 bg-white border border-slate-100 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 border-dashed cursor-pointer hover:border-brand-orange/40 transition-all">
                               <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300"><PawPrint size={14} className="sm:w-4 sm:h-4" /></div>
                               <div className="truncate"><h4 className="text-[10px] sm:text-xs font-black text-slate-300">افزودن پت</h4></div>
                            </div>
                         </div>
                      </section>
                   </div>
                 </motion.div>
               )}

               {tab === 'pets' && (
                 <motion.div key="pets" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
                   <div className="flex items-center justify-between">
                      <h2 className="text-xl sm:text-2xl font-black text-slate-800">حیوانات من</h2>
                      <button className="btn-primary px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-[9px] sm:text-[10px] whitespace-nowrap cursor-pointer" onClick={handleAddPetClick}>افزودن جدید +</button>
                   </div>
                   <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {pets.map(pet => (
                        <PetCard key={pet.id} pet={pet} onEdit={handleEditPetClick} />
                      ))}
                   </div>
                 </motion.div>
               )}

               {tab === 'orders' && (
                  <motion.div key="orders" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4 sm:space-y-6">
                     <h2 className="text-xl sm:text-2xl font-black text-slate-800 px-1">سفارشات من</h2>
                     <div className="grid gap-3 sm:gap-4">
                        <OrderCard id="PT-8942" status="shipping" date="۱۴ فروردین ۱۴۰۳" price="۱,۴۵۰,۰۰۰" />
                        <OrderCard id="PT-8931" status="delivered" date="۲۸ اسفند ۱۴۰۲" price="۸۹۰,۰۰۰" />
                        <OrderCard id="PT-8920" status="delivered" date="۱۵ اسفند ۱۴۰۲" price="۲,۱۰۰,۰۰۰" />
                        <OrderCard id="PT-8895" status="delivered" date="۲ بهمن ۱۴۰۲" price="۴۵۰,۰۰۰" />
                     </div>
                  </motion.div>
               )}

                {tab === 'wishlist' && (
                   <motion.div key="wishlist" initial={{ opacity: 0, x: -25 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 25 }} className="space-y-6" dir="rtl">
                      <h2 className="text-lg sm:text-2xl font-black text-slate-800 text-right">علاقه‌مندی‌های من</h2>
                      
                      {wishlist.length === 0 ? (
                        <div className="text-center py-16 bg-white border border-slate-100 rounded-[32px] space-y-4">
                           <div className="text-5xl">❤️</div>
                           <h3 className="text-sm sm:text-base font-black text-slate-700">لیست علاقه‌مندی‌های شما خالی است</h3>
                           <p className="text-xs text-slate-400 max-w-xs mx-auto">می‌توانید محصولاتی که دوست دارید را هنگام بازدید از فروشگاه نشان کنید.</p>
                           <button onClick={() => setView('shop')} className="btn-primary px-6 py-3 rounded-xl text-xs font-black">رفتن به فروشگاه پِت‌وان</button>
                        </div>
                      ) : (
                        <div className="grid gap-4 sm:grid-cols-2">
                          {wishlist.map((item: any) => (
                            <div key={item.id} className="p-4 bg-white border border-slate-100 rounded-3xl flex items-center justify-between hover:border-orange-200 transition-all gap-4 text-right">
                              <div className="flex items-center gap-4 min-w-0 text-right">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden shrink-0 flex items-center justify-center">
                                  <img src={item.image} className="w-full h-full object-cover" alt={item.name} referrerPolicy="no-referrer" />
                                </div>
                                <div className="space-y-1 sm:space-y-2 min-w-0 text-right">
                                  <h4 className="text-xs sm:text-sm font-black text-slate-800 truncate max-w-[160px] sm:max-w-[220px] text-right">{item.name}</h4>
                                  <div className="flex items-center gap-2">
                                     <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">{item.brand}</span>
                                     <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">{item.category}</span>
                                  </div>
                                  <div className="text-xs sm:text-sm font-black text-brand-orange text-right">{item.price} <span className="text-[10px] opacity-60">تومان</span></div>
                                </div>
                              </div>
                              <div className="flex flex-col gap-2 shrink-0">
                                <button 
                                  onClick={() => handleAddToCart(item)}
                                  className="p-2 sm:px-4 sm:py-2 bg-orange-50 text-[10px] sm:text-xs font-black text-brand-orange hover:bg-brand-orange hover:text-white rounded-xl transition-all"
                                >
                                  خرید کالا 🛒
                                </button>
                                <button 
                                  onClick={() => handleRemoveFromWishlist(item.id)}
                                  className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all flex items-center justify-center gap-1.5 text-[9px] sm:text-[10px] font-bold"
                                >
                                  <X size={12} />
                                  حذف
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                   </motion.div>
                )}

                {tab === 'addresses' && (
                  <motion.div key="addresses" initial={{ opacity: 0, x: -25 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 25 }} className="grid md:grid-cols-[1fr_320px] gap-6 sm:gap-8 items-start" dir="rtl">
                     {/* Saved Addresses List */}
                     <div className="space-y-4 sm:space-y-6 text-right">
                        <h2 className="text-lg sm:text-2xl font-black text-slate-800 text-right">آدرس‌های من</h2>
                        
                        {addresses.length === 0 ? (
                          <div className="text-center py-16 bg-white border border-slate-100 rounded-[32px] space-y-4">
                             <div className="text-5xl">📍</div>
                             <h3 className="text-sm font-black text-slate-600">هنوز هیچ آدرسی ثبت نکرده‌اید</h3>
                             <p className="text-[10px] text-slate-400 max-w-xs mx-auto">برای سهولت در خریدهای بعدی، آدرس محل دریافت سفارش خود را در کادر روبرو اضافه کنید.</p>
                          </div>
                        ) : (
                          <div className="grid gap-4">
                             {addresses.map((addr: any) => (
                                <div key={addr.id} className="p-4 sm:p-5 bg-white border border-slate-100 shadow-sm rounded-3xl relative hover:border-brand-orange/40 transition-all flex gap-4 text-right">
                                   <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                                      <MapPin size={20} className="text-brand-orange" />
                                   </div>
                                   <div className="space-y-2 flex-1 min-w-0 text-right">
                                      <div className="flex items-center justify-between">
                                         <span className="text-xs sm:text-sm font-black text-slate-800 bg-orange-50 px-2.5 py-0.5 rounded-lg text-brand-orange inline-block">شهر {addr.city}</span>
                                         <button 
                                           onClick={(e) => { e.stopPropagation(); startEditAddress(addr); }} 
                                           className="p-1.5 mr-auto text-slate-400 hover:text-brand-orange hover:bg-orange-50 rounded-lg transition-colors inline-flex"
                                           title="ویرایش آدرس"
                                         >
                                            <Edit size={14} />
                                         </button>
                                         <button 
                                           onClick={() => handleRemoveAddress(addr.id)} 
                                           className="p-2 text-slate-400 hover:text-red-500 rounded-lg transition-colors inline-flex"
                                           title="حذف آدرس"
                                         >
                                            <Trash2 size={15} />
                                         </button>
                                      </div>
                                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-bold break-words pr-1 text-right">{addr.text}</p>
                                      <div className="text-[10px] font-bold text-slate-400 font-sans text-right">کد پستی: <span className="font-mono">{addr.postalCode}</span></div>
                                   </div>
                                </div>
                             ))}
                          </div>
                        )}
                     </div>

                     {/* Add New Address Form */}
                     <div className="bg-white border border-slate-100 p-6 rounded-[32px] shadow-sm space-y-4 text-right">
                        <h3 className="text-sm sm:text-base font-black text-slate-800 border-b border-slate-50 pb-2 text-right">{editingAddress ? '✏️ ویرایش آدرس ثبت شده' : '➕ افزودن آدرس جدید'}</h3>
                        <form className="space-y-4 text-right" onSubmit={handleAddAddressSubmit}>
                           <div className="space-y-1">
                              <label className="text-[10px] font-black text-slate-400 mr-2 block text-right font-bold">استان / شهر</label>
                              <input 
                                required 
                                type="text" 
                                placeholder="مثال: تهران" 
                                value={addrCity}
                                onChange={e => setAddrCity(e.target.value)}
                                className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-xs font-bold text-right focus:ring-2 focus:ring-brand-orange/20 transition-all"
                              />
                           </div>
                           <div className="space-y-1">
                              <label className="text-[10px] font-black text-slate-400 mr-2 block text-right font-bold">نشانی دقیق پستی</label>
                              <textarea 
                                required 
                                placeholder="مثال: بزرگراه چمران، خیابان یمن، پلاک ۱۰..." 
                                value={addrText}
                                onChange={e => setAddrText(e.target.value)}
                                rows={3}
                                className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-xs font-bold text-right focus:ring-2 focus:ring-brand-orange/20 transition-all resize-none"
                              />
                           </div>
                           <div className="space-y-1">
                              <label className="text-[10px] font-black text-slate-400 mr-2 block text-right font-bold">کد پستی (۱۰ رقمی)</label>
                              <input 
                                required 
                                type="text" 
                                placeholder="مثال: ۱۴۳۹۸۷۶۵۴۳" 
                                value={addrPostalCode}
                                onChange={e => setAddrPostalCode(e.target.value)}
                                className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-xs font-bold text-left font-mono focus:ring-2 focus:ring-brand-orange/20 transition-all"
                                dir="ltr"
                              />
                           </div>
                           <div className={editingAddress ? "grid grid-cols-2 gap-2 mt-2" : "mt-2"}>
                              <button type="submit" className="w-full btn-primary py-3 rounded-xl text-[11px] sm:text-xs font-black shadow-lg shadow-brand-orange/10">
                                 {editingAddress ? 'ذخیره تغییرات 📍' : 'ثبت آدرس جدید 📍'}
                              </button>
                              {editingAddress && (
                                 <button type="button" onClick={cancelEditAddress} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 py-3 rounded-xl text-[11px] sm:text-xs font-black transition-all">
                                    انصراف ✖
                                 </button>
                              )}
                           </div>
                        </form>
                     </div>
                  </motion.div>
                )}

                {tab === 'settings' && (
                  <motion.div key="settings" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="bg-white rounded-[24px] sm:rounded-[32px] p-6 sm:p-10 border border-slate-100 shadow-sm space-y-6 sm:space-y-8">
                     <h2 className="text-xl sm:text-2xl font-black text-slate-800">تنظیمات حساب</h2>
                     <form className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-1">
                           <label className="text-[10px] font-black text-slate-400 mr-4">نام و نام خانوادگی</label>
                           <input type="text" defaultValue="مهدی محمود" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-brand-orange/20 transition-all text-right" />
                        </div>
                        <div className="space-y-1">
                           <label className="text-[10px] font-black text-slate-400 mr-4">شماره موبایل</label>
                           <input type="text" defaultValue="۰۹۱۲۳۴۵۶۷۸۹" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-brand-orange/20 transition-all text-right" disabled />
                        </div>
                        <div className="space-y-1">
                           <label className="text-[10px] font-black text-slate-400 mr-4">ایمیل (اختیاری)</label>
                           <input type="email" defaultValue="mehdi@petone.ir" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-brand-orange/20 transition-all text-right" />
                        </div>
                        <div className="space-y-1">
                           <label className="text-[10px] font-black text-slate-400 mr-4">استان</label>
                           <select className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-brand-orange/20 transition-all text-right appearance-none">
                              <option>تهران</option>
                              <option>البرز</option>
                              <option>اصفهان</option>
                           </select>
                        </div>
                        <div className="sm:col-span-2 pt-4">
                           <button type="button" className="btn-primary w-full sm:w-auto px-12 py-4 rounded-2xl">ذخیره تغییرات</button>
                        </div>
                     </form>
                  </motion.div>
               )}
             </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// ADMIN DASHBOARD COMPONENT
// ============================================================================

const AdminDashboard = ({
  products,
  setProducts,
  categories,
  setCategories,
  foodCategories,
  setFoodCategories,
  heroSlides,
  setHeroSlides,
  discounts,
  setDiscounts,
  articles,
  setArticles,
  orders,
  setOrders,
  setView,
  setIsAdmin
}: {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  categories: any[];
  setCategories: React.Dispatch<React.SetStateAction<any[]>>;
  foodCategories: any[];
  setFoodCategories: React.Dispatch<React.SetStateAction<any[]>>;
  heroSlides: any[];
  setHeroSlides: React.Dispatch<React.SetStateAction<any[]>>;
  discounts: any[];
  setDiscounts: React.Dispatch<React.SetStateAction<any[]>>;
  articles: any[];
  setArticles: React.Dispatch<React.SetStateAction<any[]>>;
  orders: any[];
  setOrders: React.Dispatch<React.SetStateAction<any[]>>;
  setView: (v: any) => void;
  setIsAdmin: (v: boolean) => void;
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'categories' | 'banners' | 'discounts' | 'articles' | 'orders'>('dashboard');
  
  // Local form/edit states
  const categoryAddFileInputRef = useRef<HTMLInputElement>(null);
  const categoryEditFileInputRef = useRef<HTMLInputElement>(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<any>(null);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '', price: 0, discountPrice: 0, category: 'سگ', brand: '', rating: 4.5, image: '', isBestSeller: false, stock: 10
  });

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [isFoodCategory, setIsFoodCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '', icon: '🐈', image: '', subcategories: ''
  });
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const [showAddSlide, setShowAddSlide] = useState(false);
  const [newSlide, setNewSlide] = useState({
    title: '', subtitle: '', image: '', cta: '', badge: ''
  });

  const [showAddDiscount, setShowAddDiscount] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<any | null>(null);
  const [newDiscount, setNewDiscount] = useState({
    code: '', title: '', description: '', percent: 10, active: true
  });

  const [showAddArticle, setShowAddArticle] = useState(false);
  const [newArticle, setNewArticle] = useState({
    title: '', excerpt: '', content: '', category: 'سلامت پت', image: '', author: '', date: ''
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubCatFilter, setSelectedSubCatFilter] = useState('');

  // CALCULATE SUMMARY STATS DYNAMICALLY
  const stats = React.useMemo(() => {
    const totalSales = orders
      .filter(o => o.status === 'Completed')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0) + 7600000; // base sales setup
    return {
      totalSales,
      ordersCount: orders.length,
      customersCount: 145 + orders.length * 3,
      productsCount: products.length,
      couponCount: discounts.filter(d => d.active).length
    };
  }, [orders, products, discounts]);

  // PRODUCT ACTIONS
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;
    const added: Product = {
      id: String(products.length + 1),
      name: newProduct.name,
      price: Number(newProduct.price),
      discountPrice: newProduct.discountPrice ? Number(newProduct.discountPrice) : undefined,
      category: newProduct.category,
      brand: newProduct.brand || 'PetOne',
      rating: Number(newProduct.rating),
      image: newProduct.image || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=200',
      isBestSeller: newProduct.isBestSeller,
      reviewsCount: 1,
      stockStatus: 'available',
      description: newProduct.name
    };
    setProducts(prev => [added, ...prev]);
    setNewProduct({ name: '', price: 0, discountPrice: 0, category: 'سگ', brand: '', rating: 4.5, image: '', isBestSeller: false, stock: 10 });
    setShowAddProduct(false);
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setProducts(prev => prev.map(p => p.id === editingProduct.id ? editingProduct : p));
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm('آیا از حذف این محصول اطمینان دارید؟')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  // CATEGORY ACTIONS
  const handleCategoryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert('حجم عکس نباید بیشتر از ۳ مگابایت باشد ❌');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCategory(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditCategoryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert('حجم عکس نباید بیشتر از ۳ مگابایت باشد ❌');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingCategory(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name) return;
    const subList = newCategory.subcategories ? newCategory.subcategories.split('،').map(s => s.trim()) : [];
    const addedCat = {
      id: (isFoodCategory ? foodCategories.length : categories.length) + 1,
      name: newCategory.name,
      icon: newCategory.icon,
      image: newCategory.image || 'https://images.unsplash.com/photo-1541599540903-216a46cc1ad6?auto=format&fit=crop&q=80&w=200',
      subcategories: subList
    };

    if (isFoodCategory) {
      setFoodCategories(prev => [...prev, addedCat]);
    } else {
      setCategories(prev => [...prev, addedCat]);
    }

    setNewCategory({ name: '', icon: '🐈', image: '', subcategories: '' });
    setShowAddCategory(false);
  };

  const handleDeleteCategory = (id: number, isFood: boolean) => {
    if (confirm('آیا از حذف این دسته‌بندی اطمینان دارید؟')) {
      if (isFood) {
        setFoodCategories(prev => prev.filter(c => c.id !== id));
      } else {
        setCategories(prev => prev.filter(c => c.id !== id));
      }
    }
  };

  const handleUpdateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.name) return;

    const subList = typeof editingCategory.subcategories === 'string'
      ? editingCategory.subcategories.split(/[،,]/).map((s: string) => s.trim()).filter(Boolean)
      : editingCategory.subcategories;

    const updatedCat = {
      ...editingCategory,
      subcategories: subList
    };

    if (editingCategory.isFood) {
      setFoodCategories(prev => prev.map(c => c.id === editingCategory.id ? updatedCat : c));
    } else {
      setCategories(prev => prev.map(c => c.id === editingCategory.id ? updatedCat : c));
    }

    setEditingCategory(null);
  };

  // BANNER ACTIONS
  const handleAddSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlide.title || !newSlide.image) return;
    const added = {
      id: heroSlides.length + 1,
      title: newSlide.title,
      subtitle: newSlide.subtitle,
      image: newSlide.image,
      cta: newSlide.cta || 'مشاهده محصولات',
      badge: newSlide.badge || 'پیشنهاد ویژه'
    };
    setHeroSlides(prev => [...prev, added]);
    setNewSlide({ title: '', subtitle: '', image: '', cta: '', badge: '' });
    setShowAddSlide(false);
  };

  const handleDeleteSlide = (id: number) => {
    if (confirm('آیا از حذف این بنر اسلایدر اطمینان دارید؟')) {
      setHeroSlides(prev => prev.filter(s => s.id !== id));
    }
  };

  // DISCOUNT ACTIONS
  const handleAddDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDiscount.code || !newDiscount.title) return;
    const added = {
      id: 'd' + (discounts.length + 1),
      code: newDiscount.code.toUpperCase(),
      title: newDiscount.title,
      description: newDiscount.description,
      percent: Number(newDiscount.percent),
      active: true
    };
    setDiscounts(prev => [...prev, added]);
    setNewDiscount({ code: '', title: '', description: '', percent: 10, active: true });
    setShowAddDiscount(false);
  };

  const handleUpdateDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDiscount || !editingDiscount.code || !editingDiscount.title) return;
    setDiscounts(prev => prev.map(d => d.id === editingDiscount.id ? {
      ...editingDiscount,
      code: editingDiscount.code.toUpperCase(),
      percent: Number(editingDiscount.percent)
    } : d));
    setEditingDiscount(null);
  };

  const toggleDiscountStatus = (id: string) => {
    setDiscounts(prev => prev.map(d => d.id === id ? { ...d, active: !d.active } : d));
  };

  const handleDeleteDiscount = (id: string) => {
    if (confirm('آیا از حذف این کد تخفیف گارانتی دار اطمینان دارید؟')) {
      setDiscounts(prev => prev.filter(d => d.id !== id));
    }
  };

  // ARTICLE ACTIONS
  const handleAddArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArticle.title || !newArticle.excerpt) return;
    const offsetDate = new Date().toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });
    const added = {
      id: 'art' + (articles.length + 1),
      title: newArticle.title,
      excerpt: newArticle.excerpt,
      content: newArticle.content || newArticle.excerpt,
      category: newArticle.category,
      image: newArticle.image || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=400',
      author: newArticle.author || 'پشتیبانی پت‌وان',
      date: newArticle.date || offsetDate
    };
    setArticles(prev => [added, ...prev]);
    setNewArticle({ title: '', excerpt: '', content: '', category: 'سلامت پت', image: '', author: '', date: '' });
    setShowAddArticle(false);
  };

  const handleDeleteArticle = (id: string) => {
    if (confirm('آیا از حذف این مقاله علمی اطمینان دارید؟')) {
      setArticles(prev => prev.filter(a => a.id !== id));
    }
  };

  // ORDER ACTIONS
  const handleUpdateOrderStatus = (id: string, newStatus: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  const handleDeleteOrder = (id: string) => {
    if (confirm('آیا مایل به لغو و حذف دائمی این سفارش خرید هستید؟')) {
      setOrders(prev => prev.filter(o => o.id !== id));
    }
  };

  // FILTERED PRODUCTS FOR LIST
  const filteredProducts = React.useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.brand || '').toLowerCase().includes(searchQuery.toLowerCase());
      if (selectedSubCatFilter) {
        return matchSearch && p.category === selectedSubCatFilter;
      }
      return matchSearch;
    });
  }, [products, searchQuery, selectedSubCatFilter]);

  // ALL UNIQUE SUB-CATEGORIES FOR FILTER DROPDOWN
  const productCategoriesList = React.useMemo(() => {
    const list = new Set<string>();
    products.forEach(p => {
      if (p.category) list.add(p.category);
    });
    return Array.from(list);
  }, [products]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-24 text-right rtl" dir="rtl">
      {/* Admin Header Navbar */}
      <header className="bg-slate-950 border-b border-slate-800 text-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-orange text-white rounded-xl flex items-center justify-center font-black text-2xl shadow-lg shadow-brand-orange/20 animate-pulse">
              🐾
            </div>
            <div>
              <span className="font-sans font-black tracking-tight text-white block">پت‌وان • پنل مدیریت حرفه‌ای 🛠️</span>
              <span className="text-[10px] text-brand-orange font-bold block">دسترسی و مدیریت کامل همه‌ی اجزای سیستم</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                localStorage.removeItem('petone_is_admin');
                setIsAdmin(false);
                setView('home');
                window.location.hash = '';
                window.history.pushState(null, '', '/');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-1.5 bg-rose-500/15 hover:bg-rose-600 text-[10px] sm:text-xs text-rose-400 hover:text-white font-black px-3.5 py-2 sm:py-2.5 rounded-2xl transition-all cursor-pointer"
            >
              <LogOut size={13} />
              <span>خروج از پنل</span>
            </button>
            <button 
              onClick={() => { 
                setView('home'); 
                window.location.hash = '';
                window.history.pushState(null, '', '/');
                window.scrollTo({ top: 0, behavior: 'smooth' }); 
              }}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-brand-orange text-[10px] sm:text-xs text-white font-black px-3.5 py-2 sm:py-2.5 rounded-2xl transition-all cursor-pointer"
            >
              <Home size={13} />
              <span>بازگشت به سایت اصلی</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SIDEBAR TABS SELECTION */}
          <aside className="lg:w-64 shrink-0 bg-slate-950 p-4 rounded-[28px] border border-slate-800 space-y-2 h-fit">
            <div className="px-3 py-2 text-slate-500 font-black text-[10px] uppercase tracking-wider">ناوبری مدیریت</div>
            {[
              { id: 'dashboard', label: 'داشبورد خلاصه', icon: LayoutDashboard },
              { id: 'categories', label: 'دسته بندی‌ها', icon: Grid },
              { id: 'products', label: 'محصولات سایت', icon: Package },
              { id: 'banners', label: 'بنرها و اسلایدر', icon: Sparkles },
              { id: 'discounts', label: 'کدهای تخفیف', icon: Percent },
              { id: 'articles', label: 'مقالات و وبلاگ', icon: BookOpen },
              { id: 'orders', label: 'سفارشات مشتریان', icon: Users }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/20' 
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} />
                    <span>{tab.label}</span>
                  </div>
                  <ChevronLeft size={12} className={`opacity-60 transition-transform ${isActive ? 'rotate-90' : ''}`} />
                </button>
              );
            })}

            <div className="pt-8 border-t border-slate-900 mt-6 text-center space-y-2 text-slate-500 text-[10px] font-bold">
              <p>ورژن مدیریت: ۲.۴.۰</p>
              <div className="w-2 h-2 rounded-full bg-emerald-500 inline-block align-middle me-1.5" />
              <span>پایگاه داده زنده و متصل</span>
            </div>
          </aside>

          {/* MAIN WORKING CONTENT PANEL */}
          <main className="flex-1 space-y-6">

            {/* TAB 1: DASHBOARD OVERVIEW */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8 animate-fadeIn">
                {/* Metrics Cards Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'فرو ناخالص ممتد 💰', value: stats.totalSales.toLocaleString('fa-IR') + ' تومان', sub: 'رشد ۲۳٪ این هـفته', color: 'border-emerald-500/20 text-emerald-400' },
                    { label: 'سفارش ثبت شده 📦', value: stats.ordersCount.toLocaleString('fa-IR'), sub: 'تحویل به پست فعال', color: 'border-cyan-500/20 text-cyan-400' },
                    { label: 'اعضای فعال 👥', value: stats.customersCount.toLocaleString('fa-IR') + ' نفر', sub: '۵۰ کاربر جدید آنلاین', color: 'border-indigo-500/20 text-indigo-400' },
                    { label: 'محصولات فعال 🏷️', value: stats.productsCount.toLocaleString('fa-IR') + ' عدد', sub: 'در دسته‌بندی سگ و گربه', color: 'border-orange-500/20 text-brand-orange' }
                  ].map((metric, i) => (
                    <div key={i} className={`bg-slate-950 p-5 rounded-3xl border ${metric.color.split(' ')[0]} text-right space-y-2 shadow-sm`}>
                      <span className="text-[10px] text-slate-400 font-bold block">{metric.label}</span>
                      <h3 className={`text-base sm:text-lg font-black ${metric.color.split(' ')[1]}`}>{metric.value}</h3>
                      <span className="text-[9px] text-slate-500 block">{metric.sub}</span>
                    </div>
                  ))}
                </div>

                {/* Pure CSS Charts & Data Panel Block */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Chart 1 */}
                  <div className="bg-slate-950 border border-slate-800 p-6 rounded-[28px] text-right space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-slate-200">نمودار فروش دوره‌ای فروشگاه (توضیحی) 📊</h4>
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded-lg">۶ ماه گذشته</span>
                    </div>
                    <div className="h-44 flex items-end justify-between gap-3 pt-6">
                      {[
                        { label: 'آذر', percent: '40%', val: '۴.۸ م' },
                        { label: 'دی', percent: '55%', val: '۶.۲ م' },
                        { label: 'بهمن', percent: '75%', val: '۸.۵ م' },
                        { label: 'اسفند', percent: '95%', val: '۱۱.۴ م' },
                        { label: 'فروردین', percent: '65%', val: '۷.۸ م' },
                        { label: 'اردیبهشت', percent: '88%', val: '۱۰.۹ م' }
                      ].map((item, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                          <span className="text-[8px] text-slate-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity">{item.val}</span>
                          <div className="w-full bg-slate-900 rounded-t-lg relative overflow-hidden h-full flex items-end">
                            <motion.div 
                              initial={{ height: 0 }}
                              animate={{ height: item.percent }}
                              transition={{ duration: 1, delay: idx * 0.1 }}
                              className="w-full bg-gradient-to-t from-orange-600 to-amber-400 rounded-t-lg shadow" 
                            />
                          </div>
                          <span className="text-[9px] text-slate-400 font-black">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Activity Alerts Log */}
                  <div className="bg-slate-950 border border-slate-800 p-6 rounded-[28px] text-right">
                    <h3 className="text-xs font-black text-slate-200 mb-4 block">وضعیت سفارشات زنده امروز ⏰</h3>
                    <div className="space-y-4">
                      {orders.slice(0, 4).map((o, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-slate-900/60 p-3 rounded-2xl border border-slate-800 text-xs">
                          <div className="flex items-center gap-3">
                            <span className="bg-slate-800 p-2 rounded-xl text-brand-orange text-center font-bold">🛒</span>
                            <div>
                              <span className="font-black block">{o.customerName}</span>
                              <span className="text-[9px] text-slate-500 block">{o.date} • {o.itemsCount} قلم کالا</span>
                            </div>
                          </div>
                          <div className="text-left">
                            <span className="font-mono font-black text-[11px] block">{o.totalAmount.toLocaleString('fa-IR')} تومان</span>
                            <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${
                              o.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' :
                              o.status === 'Processing' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'
                            }`}>{o.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Fast Action Guidance Links */}
                <div className="bg-slate-950 border border-slate-800 p-6 rounded-[28px] text-right space-y-4">
                  <h3 className="text-xs font-black text-slate-200">میز کار سری بازرگانی و محتوا ⚡</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button onClick={() => { setActiveTab('products'); setShowAddProduct(true); }} className="p-4 bg-slate-900 border border-slate-800 hover:border-brand-orange text-center rounded-2xl transition-all space-y-1.5 font-bold text-xs cursor-pointer">
                      <Plus className="mx-auto text-brand-orange" size={20} />
                      <span className="block text-slate-300">محصول جدید</span>
                    </button>
                    <button onClick={() => { setActiveTab('categories'); setShowAddCategory(true); }} className="p-4 bg-slate-900 border border-slate-800 hover:border-brand-orange text-center rounded-2xl transition-all space-y-1.5 font-bold text-xs cursor-pointer">
                      <Grid className="mx-auto text-cyan-400" size={20} />
                      <span className="block text-slate-300">افزودن دسته‌بندی</span>
                    </button>
                    <button onClick={() => { setActiveTab('discounts'); setShowAddDiscount(true); }} className="p-4 bg-slate-900 border border-slate-800 hover:border-brand-orange text-center rounded-2xl transition-all space-y-1.5 font-bold text-xs cursor-pointer">
                      <Percent className="mx-auto text-emerald-400" size={20} />
                      <span className="block text-slate-300">کد تخفیف جدید</span>
                    </button>
                    <button onClick={() => { setActiveTab('articles'); setShowAddArticle(true); }} className="p-4 bg-slate-900 border border-slate-800 hover:border-brand-orange text-center rounded-2xl transition-all space-y-1.5 font-bold text-xs cursor-pointer">
                      <BookOpen className="mx-auto text-indigo-400" size={20} />
                      <span className="block text-slate-300">ارسال مقاله علمی</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CATEGORY MANAGEMENT */}
            {activeTab === 'categories' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-white">مدیریت دسته‌بندی‌های اصلی و فرعی 🐾</h2>
                    <p className="text-[10px] text-slate-400 font-bold">حذف، ویرایش، اضافه کردن به تفکیک حیوان یا نوع خوراک</p>
                  </div>
                  <button 
                    onClick={() => setShowAddCategory(!showAddCategory)}
                    className="flex items-center gap-1 bg-brand-orange text-white text-xs font-black px-4 py-2 rounded-xl hover:bg-orange-600 transition-all cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>افزودن دسته‌بندی جدید</span>
                  </button>
                </div>

                {/* Expansion Category Added Panel */}
                {showAddCategory && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-950 p-6 rounded-[28px] border border-brand-orange/20">
                    <form onSubmit={handleAddCategory} className="space-y-4">
                      <h3 className="text-xs font-black text-slate-200">مشخصات دسته‌بندی جدید</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1 text-right">
                          <label className="text-[10px] font-black text-slate-400 block">نوع دسته‌بندی چیست؟</label>
                          <select 
                            value={isFoodCategory ? 'food' : 'main'} 
                            onChange={(e) => setIsFoodCategory(e.target.value === 'food')}
                            className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-white"
                          >
                            <option value="main">دسته‌بندی پت (سگ، گربه، پرنده و...)</option>
                            <option value="food">دسته‌بندی دسترسی سریع (۶ مجموعه)</option>
                          </select>
                        </div>
                        <div className="space-y-1 text-right">
                          <label className="text-[10px] font-black text-slate-400 block">عنوان دسته‌بندی</label>
                          <input 
                            placeholder="مثلا: همستر و جوندگان، درمانی" 
                            type="text" 
                            required 
                            value={newCategory.name}
                            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-white outline-none focus:border-brand-orange"
                          />
                        </div>
                        <div className="space-y-1 text-right">
                          <label className="text-[10px] font-black text-slate-400 block">آیکون اموجی (یا کاراکتر گرافیکی)</label>
                          <input 
                            placeholder="🐹" 
                            type="text" 
                            value={newCategory.icon}
                            onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-white text-center outline-none focus:border-brand-orange"
                          />
                        </div>
                        
                        <div className="space-y-1 text-right md:col-span-2">
                          <label className="text-[10px] font-black text-slate-400 block pb-1">تصویر دسته‌بندی (آپلود فایل)</label>
                          <div 
                            onClick={() => categoryAddFileInputRef.current?.click()}
                            className="border-2 border-dashed border-slate-800 hover:border-brand-orange/40 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all bg-slate-900/50 hover:bg-orange-950/20 group relative overflow-hidden"
                          >
                            <input 
                              type="file" 
                              ref={categoryAddFileInputRef} 
                              onChange={handleCategoryFileChange} 
                              accept="image/*" 
                              className="hidden" 
                            />
                            
                            {newCategory.image ? (
                              <div className="flex items-center gap-4 w-full justify-between">
                                <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-md shrink-0">
                                  <img src={newCategory.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" alt="Category preview" />
                                  <div className="absolute inset-0 bg-black/40 opacity-100 flex items-center justify-center text-white text-[9px] font-bold">
                                    تغییر عکس 📸
                                  </div>
                                </div>
                                <div className="text-right flex-1 pr-3">
                                  <p className="text-xs font-black text-brand-orange">
                                    عکس دسته‌بندی با موفقیت انتخاب شد ✨
                                  </p>
                                  <button 
                                    type="button" 
                                    onClick={(e) => { 
                                      e.stopPropagation(); 
                                      setNewCategory(prev => ({ ...prev, image: '' })); 
                                    }} 
                                    className="text-[10px] font-bold text-red-400 hover:underline mt-1 block"
                                  >
                                    حذف عکس و آپلود فایل دیگر ✖
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center py-2">
                                <span className="text-xl mb-1">📸</span>
                                <p className="text-[11px] font-black text-slate-300">برای بارگذاری عکس کلیک کنید</p>
                                <p className="text-[9px] font-medium text-slate-500 mt-1">فرمت‌های تصویری (حداکثر ۳ مگابایت)</p>
                              </div>
                            )}
                          </div>
                          <div className="pt-2">
                            <label className="text-[9px] font-black text-slate-500 block mb-1">یا آدرس مستقیم اینترنتی تصویر را وارد کنید:</label>
                            <input 
                              placeholder="https://images.unsplash.com/..." 
                              type="text" 
                              value={newCategory.image && !newCategory.image.startsWith('data:') ? newCategory.image : ''} 
                              onChange={(e) => setNewCategory({ ...newCategory, image: e.target.value })}
                              className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-white outline-none focus:border-brand-orange text-left"
                              dir="ltr"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-1 text-right">
                        <label className="text-[10px] font-black text-slate-400 block">مجموع زیر دسته‌بندی‌ها (جدا شده با علامت ویرگول فارسی «،»)</label>
                        <input 
                          placeholder="خشک، تر، کنسرو، پوچ، غذای کمکی" 
                          type="text" 
                          value={newCategory.subcategories}
                          onChange={(e) => setNewCategory({ ...newCategory, subcategories: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-white outline-none focus:border-brand-orange"
                        />
                      </div>
                      <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={() => setShowAddCategory(false)} className="px-4 py-2 bg-slate-900 text-xs font-black rounded-xl">انصراف</button>
                        <button type="submit" className="px-4 py-2 bg-brand-orange text-white text-xs font-black rounded-xl">ذخیره نهایی</button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* Edit Category Panel */}
                {editingCategory && (
                  <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-950 p-6 rounded-[28px] border-2 border-brand-orange bg-slate-955 shadow-2xl">
                    <form onSubmit={handleUpdateCategory} className="space-y-4">
                      <h3 className="text-xs font-black text-slate-200">ویرایش دسته‌بندی: <span className="text-brand-orange">{editingCategory.name}</span></h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1 text-right">
                          <label className="text-[10px] font-black text-slate-400 block">عنوان دسته‌بندی</label>
                          <input 
                            type="text" 
                            required 
                            value={editingCategory.name}
                            onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-white outline-none focus:border-brand-orange"
                          />
                        </div>
                        <div className="space-y-1 text-right">
                          <label className="text-[10px] font-black text-slate-400 block">آیکون اموجی</label>
                          <input 
                            type="text" 
                            value={editingCategory.icon || ''}
                            onChange={(e) => setEditingCategory({ ...editingCategory, icon: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-white text-center outline-none focus:border-brand-orange"
                          />
                        </div>
                        
                        <div className="space-y-1 text-right md:col-span-2">
                          <label className="text-[10px] font-black text-slate-400 block pb-1">تصویر دسته‌بندی (آپلود فایل)</label>
                          <div 
                            onClick={() => categoryEditFileInputRef.current?.click()}
                            className="border-2 border-dashed border-slate-800 hover:border-brand-orange/40 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all bg-slate-900/50 hover:bg-orange-950/20 group relative overflow-hidden"
                          >
                            <input 
                              type="file" 
                              ref={categoryEditFileInputRef} 
                              onChange={handleEditCategoryFileChange} 
                              accept="image/*" 
                              className="hidden" 
                            />
                            
                            {editingCategory.image ? (
                              <div className="flex items-center gap-4 w-full justify-between">
                                <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-md shrink-0">
                                  <img src={editingCategory.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" alt="Category preview" />
                                  <div className="absolute inset-0 bg-black/40 opacity-100 flex items-center justify-center text-white text-[9px] font-bold">
                                    تغییر عکس 📸
                                  </div>
                                </div>
                                <div className="text-right flex-1 pr-3">
                                  <p className="text-xs font-black text-brand-orange">
                                    عکس جدید انتخاب شد ✨
                                  </p>
                                  <button 
                                    type="button" 
                                    onClick={(e) => { 
                                      e.stopPropagation(); 
                                      setEditingCategory(prev => ({ ...prev, image: '' })); 
                                    }} 
                                    className="text-[10px] font-bold text-red-400 hover:underline mt-1 block"
                                  >
                                    حذف عکس و آپلود مجدد ✖
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center py-2">
                                <span className="text-xl mb-1">📸</span>
                                <p className="text-[11px] font-black text-slate-300">کلیک جهت آپلود فایل تصویر</p>
                                <p className="text-[9px] font-medium text-slate-500 mt-1">فرمت‌های تصویری (حداکثر ۳ مگابایت)</p>
                              </div>
                            )}
                          </div>
                          <div className="pt-2">
                            <label className="text-[9px] font-black text-slate-500 block mb-1">یا آدرس مستقیم اینترنتی تصویر را وارد کنید:</label>
                            <input 
                              placeholder="https://images.unsplash.com/..." 
                              type="text" 
                              value={editingCategory.image && !editingCategory.image.startsWith('data:') ? editingCategory.image : ''} 
                              onChange={(e) => setEditingCategory({ ...editingCategory, image: e.target.value })}
                              className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-white outline-none focus:border-brand-orange text-left"
                              dir="ltr"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1 text-right">
                        <label className="text-[10px] font-black text-slate-400 block">زیر دسته‌بندی‌ها (جدا شده با علامت ویرگول فارسی «،»)</label>
                        <input 
                          type="text" 
                          value={Array.isArray(editingCategory.subcategories) ? editingCategory.subcategories.join('، ') : editingCategory.subcategories || ''}
                          onChange={(e) => setEditingCategory({ ...editingCategory, subcategories: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-white outline-none focus:border-brand-orange"
                        />
                      </div>
                      <div className="flex justify-end gap-3 pt-4 border-t border-slate-900">
                        <button type="button" onClick={() => setEditingCategory(null)} className="px-4 py-2 bg-slate-900 text-xs font-black rounded-xl cursor-pointer">انصراف</button>
                        <button type="submit" className="px-4 py-2 bg-brand-orange text-white text-xs font-black rounded-xl cursor-pointer">اعمال تغییرات</button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* Section A: MAIN PET CATEGORIES */}
                <div className="bg-slate-950 rounded-[28px] border border-slate-800 p-6 space-y-4">
                  <h3 className="text-sm font-black text-white border-b border-slate-800 pb-3">دسته‌بندی‌های اصلی پت و ملزومات 🐕🐈</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {categories.map(cat => (
                      <div key={cat.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          {cat.image ? (
                            <img src={cat.image} className="w-12 h-12 rounded-xl object-cover shrink-0" alt="" />
                          ) : (
                            <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center font-black shrink-0">
                              <PawPrint size={20} className="text-indigo-400" />
                            </div>
                          )}
                          <div>
                            <span className="font-black text-xs block text-slate-200">{cat.name} {cat.icon}</span>
                            <span className="text-[9px] text-slate-400 font-bold block">زیربخش‌ها: {cat.subcategories?.join(', ') || 'ندارد'}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setEditingCategory({ ...cat, isFood: false })}
                            className="p-2 bg-indigo-500/15 text-indigo-400 hover:bg-indigo-500 hover:text-white rounded-xl transition-colors cursor-pointer"
                            title="ویرایش دسته‌بندی"
                          >
                            <Edit size={13} />
                          </button>
                          <button 
                            onClick={() => handleDeleteCategory(cat.id, false)}
                            className="p-2 bg-rose-500/15 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl transition-colors cursor-pointer"
                            title="حذف دسته‌بندی"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section B: FOOD CATEGORIES */}
                <div className="bg-slate-950 rounded-[28px] border border-slate-800 p-6 space-y-4">
                  <h3 className="text-sm font-black text-white border-b border-slate-800 pb-3">دسته‌بندی‌های دسترسی سریع (۶ مجموعه) ⚡</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {foodCategories.map(cat => (
                      <div key={cat.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <img src={cat.image} className="w-12 h-12 rounded-xl object-cover shrink-0" alt="" />
                          <div>
                            <span className="font-black text-xs block text-slate-200">{cat.name} {cat.icon}</span>
                            <span className="text-[9px] text-slate-400 font-bold block">زیربخش‌ها: {cat.subcategories?.join(', ') || 'ندارد'}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setEditingCategory({ ...cat, isFood: true })}
                            className="p-2 bg-indigo-500/15 text-indigo-400 hover:bg-indigo-500 hover:text-white rounded-xl transition-colors cursor-pointer"
                            title="ویرایش دسته‌بندی"
                          >
                            <Edit size={13} />
                          </button>
                          <button 
                            onClick={() => handleDeleteCategory(cat.id, true)}
                            className="p-2 bg-rose-500/15 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl transition-colors cursor-pointer"
                            title="حذف دسته‌بندی"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: PRODUCTS MANAGEMENT */}
            {activeTab === 'products' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-white">مدیریت موجودی غنی و تغییر قیمت‌ها 🏷️</h2>
                    <p className="text-[10px] text-slate-400 font-bold">بیش از {products.length} محصول ثبت شده در بانک داده</p>
                  </div>
                  <button 
                    onClick={() => setShowAddProduct(!showAddProduct)}
                    className="flex items-center gap-1.5 bg-brand-orange text-white text-xs font-black px-4 py-2 rounded-xl hover:bg-orange-600 transition-all cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>افزودن محصول جدید</span>
                  </button>
                </div>

                {/* EXPANSION PANEL: ADD PRODUCT */}
                {showAddProduct && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-950 p-6 rounded-[28px] border border-brand-orange/20">
                    <form onSubmit={handleAddProduct} className="space-y-4">
                      <h3 className="text-xs font-black text-slate-200">مشخصات محصول جدید</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1 text-right col-span-1 md:col-span-2">
                          <label className="text-[10px] font-black text-slate-400 block">نام کامل کالا</label>
                          <input 
                            placeholder="غذای خشک سگ رویال کنین مدل Mini Adult وزن ۸ کیلوگرم" 
                            type="text" required value={newProduct.name}
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-white outline-none focus:border-brand-orange"
                          />
                        </div>
                        <div className="space-y-1 text-right">
                          <label className="text-[10px] font-black text-slate-400 block">دسته‌بندی اصلی</label>
                          <select 
                            value={newProduct.category} 
                            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-white"
                          >
                            <option value="سگ">سگ</option>
                            <option value="گربه">گربه</option>
                            <option value="بهداشتی">بهداشتی پت</option>
                            <option value="خوراک">مکمل و خوراک دانه</option>
                            <option value="پرندگان">پرندگان</option>
                          </select>
                        </div>
                        <div className="space-y-1 text-right">
                          <label className="text-[10px] font-black text-slate-400 block">قیمت مصرف کننده (تومان)</label>
                          <input 
                            type="number" required value={newProduct.price || ''}
                            onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                            className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-white"
                          />
                        </div>
                        <div className="space-y-1 text-right">
                          <label className="text-[10px] font-black text-slate-400 block">قیمت پس از تخفیف (اختیاری - تومان)</label>
                          <input 
                            type="number" value={newProduct.discountPrice || ''}
                            onChange={(e) => setNewProduct({ ...newProduct, discountPrice: Number(e.target.value) })}
                            className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-white"
                          />
                        </div>
                        <div className="space-y-1 text-right">
                          <label className="text-[10px] font-black text-slate-400 block">برند تجاری</label>
                          <input 
                            placeholder="Royal Canin" 
                            type="text" value={newProduct.brand}
                            onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-white outline-none focus:border-brand-orange"
                          />
                        </div>
                        <div className="space-y-1 text-right">
                          <label className="text-[10px] font-black text-slate-400 block">آدرس تصویر (URL)</label>
                          <input 
                            placeholder="https://images.unsplash.com/..." 
                            type="text" value={newProduct.image}
                            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-white outline-none focus:border-brand-orange"
                          />
                        </div>
                        <div className="space-y-1 text-right">
                          <label className="text-[10px] font-black text-slate-400 block">امتیاز کالا (از ۵.۰)</label>
                          <input 
                            type="number" step="0.1" max="5.0" min="1.0" value={newProduct.rating}
                            onChange={(e) => setNewProduct({ ...newProduct, rating: Number(e.target.value) })}
                            className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-white"
                          />
                        </div>
                        <div className="space-y-1 text-right flex items-center gap-2 pt-6">
                          <input 
                            type="checkbox" id="best_seller" checked={newProduct.isBestSeller}
                            onChange={(e) => setNewProduct({ ...newProduct, isBestSeller: e.target.checked })}
                            className="accent-brand-orange h-4 w-4"
                          />
                          <label htmlFor="best_seller" className="text-xs font-black text-slate-300">محصول محبوب و ویژه شود؟</label>
                        </div>
                      </div>
                      <div className="flex justify-end gap-3 pt-4 border-t border-slate-900">
                        <button type="button" onClick={() => setShowAddProduct(false)} className="px-4 py-2 bg-slate-900 text-xs font-black rounded-xl cursor-pointer">انصراف</button>
                        <button type="submit" className="px-4 py-2 bg-brand-orange text-white text-xs font-black rounded-xl cursor-pointer">افزودن محصول</button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* EXPANSION PANEL: EDIT PRODUCT */}
                {editingProduct && (
                  <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-950 p-6 rounded-[28px] border-2 border-brand-orange bg-slate-950">
                    <form onSubmit={handleUpdateProduct} className="space-y-4">
                      <h3 className="text-xs font-black text-slate-200">ویرایش و تغییر قیمت محصول: <span className="text-brand-orange">{editingProduct.name}</span></h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1 text-right col-span-1 md:col-span-2">
                          <label className="text-[10px] font-black text-slate-400 block">نام غنی کالا</label>
                          <input 
                            type="text" required value={editingProduct.name}
                            onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-white"
                          />
                        </div>
                        <div className="space-y-1 text-right">
                          <label className="text-[10px] font-black text-slate-400 block">دسته‌بندی</label>
                          <input 
                            type="text" value={editingProduct.category}
                            onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-white"
                          />
                        </div>
                        <div className="space-y-1 text-right">
                          <label className="text-[10px] font-black text-slate-400 block">قیمت اصلی (تومان)</label>
                          <input 
                            type="number" required value={editingProduct.price || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                            className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-white"
                          />
                        </div>
                        <div className="space-y-1 text-right">
                          <label className="text-[10px] font-black text-slate-400 block">قیمت با تخفیف (تومان)</label>
                          <input 
                            type="number" value={editingProduct.discountPrice || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, discountPrice: e.target.value ? Number(e.target.value) : undefined })}
                            className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-white"
                          />
                        </div>
                        <div className="space-y-1 text-right">
                          <label className="text-[10px] font-black text-slate-400 block">برند</label>
                          <input 
                            type="text" value={editingProduct.brand || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-white"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-3 pt-4 border-t border-slate-900">
                        <button type="button" onClick={() => setEditingProduct(null)} className="px-4 py-2 bg-slate-900 text-xs font-black rounded-xl">انصراف</button>
                        <button type="submit" className="px-4 py-2 bg-emerald-500 text-white text-xs font-black rounded-xl">اعمال تخفیف و بروزرسانی</button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* SEARCH AND FILTERS GRID */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="relative w-full md:w-80">
                    <Search className="absolute right-3 top-3.5 text-slate-500" size={14} />
                    <input 
                      placeholder="جستجو در بین محصولات و برندها..." 
                      className="w-full bg-slate-900 border border-slate-800 pr-9 pl-3 py-2.5 rounded-xl text-xs text-right outline-none focus:border-brand-orange text-white"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <span className="text-[10px] text-slate-400 font-bold shrink-0">فیلتر گروه:</span>
                    <select 
                      value={selectedSubCatFilter}
                      onChange={(e) => setSelectedSubCatFilter(e.target.value)}
                      className="bg-slate-900 border border-slate-800 p-2 rounded-xl text-xs text-slate-200"
                    >
                      <option value="">همه دسته‌ها ({products.length})</option>
                      {productCategoriesList.map((sc, i) => (
                        <option key={i} value={sc}>{sc}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* DATA GRID TABLE CONTAINER */}
                <div className="bg-slate-950 border border-slate-800 rounded-[28px] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead className="bg-slate-905 text-slate-400 font-bold border-b border-slate-800">
                        <tr>
                          <th className="p-4">تصویر کالا</th>
                          <th className="p-4">عنوان محصول</th>
                          <th className="p-4">گروه / دسته‌بندی</th>
                          <th className="p-4">برند</th>
                          <th className="p-4">قیمت (تومان)</th>
                          <th className="p-4">قیمت تخفیف</th>
                          <th className="p-4">امتیاز</th>
                          <th className="p-4 text-center">عملیات مدیریت</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900">
                        {filteredProducts.map(product => (
                          <tr key={product.id} className="hover:bg-slate-900/40 transition-colors">
                            <td className="p-4">
                              <img src={product.image} className="w-10 h-10 rounded-lg object-cover bg-slate-800" alt="" />
                            </td>
                            <td className="p-4 max-w-xs font-black text-slate-200 leading-normal">{product.name}</td>
                            <td className="p-4">
                              <span className="bg-slate-900 text-slate-300 text-[10px] font-black px-2 py-1 rounded-full">{product.category}</span>
                            </td>
                            <td className="p-4 font-mono text-slate-300">{product.brand || 'PetOne'}</td>
                            <td className="p-4 font-mono font-black text-slate-300">{product.price.toLocaleString('fa-IR')}</td>
                            <td className="p-4 font-mono text-emerald-400 font-black">
                              {product.discountPrice ? product.discountPrice.toLocaleString('fa-IR') : '-'}
                            </td>
                            <td className="p-4 text-amber-400 font-black">⭐ {product.rating || '4.5'}</td>
                            <td className="p-4">
                              <div className="flex items-center justify-center gap-2">
                                <button 
                                  onClick={() => { setEditingProduct(product); window.scrollTo({ top: 150, behavior: 'smooth' }); }}
                                  className="p-2 bg-indigo-500/15 text-indigo-400 hover:bg-indigo-500 hover:text-white rounded-xl transition-colors cursor-pointer"
                                  title="تغییر قیمت و نام"
                                >
                                  <Edit size={12} />
                                </button>
                                <button 
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="p-2 bg-rose-500/15 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl transition-colors cursor-pointer"
                                  title="حذف کامل کالا"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: HERO SLIDER BANNERS */}
            {activeTab === 'banners' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-white">مدیریت بنرهای اسلایدر صفحه اصلی ⚙️</h2>
                    <p className="text-[10px] text-slate-400 font-bold">تولید اسلایدهای روتاری شیک با افکت‌های زیبای وبسایت</p>
                  </div>
                  <button 
                    onClick={() => setShowAddSlide(!showAddSlide)}
                    className="flex items-center gap-1.5 bg-brand-orange text-white text-xs font-black px-4 py-2 rounded-xl hover:bg-orange-600 transition-all cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>افزودن اسلاید جدید</span>
                  </button>
                </div>

                {/* ADD SLIDE ROW EXPANDABLE */}
                {showAddSlide && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-950 p-6 rounded-[28px] border border-brand-orange/20">
                    <form onSubmit={handleAddSlide} className="space-y-4">
                      <h3 className="text-xs font-black text-slate-200">مشخصات اسلاید اسلایدر جدید</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1 text-right">
                          <label className="text-[10px] font-black text-slate-400 block">عنوان بزرگ اسلاید</label>
                          <input 
                            placeholder="مکمل‌های تقویتی و درمانی مو و پوست پت" 
                            type="text" required value={newSlide.title}
                            onChange={(e) => setNewSlide({ ...newSlide, title: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-white outline-none"
                          />
                        </div>
                        <div className="space-y-1 text-right">
                          <label className="text-[10px] font-black text-slate-400 block">زیرعنوان (توضیحات کوتاه)</label>
                          <input 
                            placeholder="تخفیف استثنایی ۲۵ درصدی برای غذای برند رویال کنین" 
                            type="text" value={newSlide.subtitle}
                            onChange={(e) => setNewSlide({ ...newSlide, subtitle: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-white outline-none"
                          />
                        </div>
                        <div className="space-y-1 text-right">
                          <label className="text-[10px] font-black text-slate-400 block">عکس با کیفیت پس‌زمینه (Unsplash URL)</label>
                          <input 
                            placeholder="https://images.unsplash.com/..." 
                            type="text" required value={newSlide.image}
                            onChange={(e) => setNewSlide({ ...newSlide, image: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-white outline-none"
                          />
                        </div>
                        <div className="space-y-1 text-right">
                          <label className="text-[10px] font-black text-slate-400 block">عنوان دکمه خرید (CTA)</label>
                          <input 
                            placeholder="همین حالا خرید کنید" 
                            type="text" value={newSlide.cta}
                            onChange={(e) => setNewSlide({ ...newSlide, cta: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-white outline-none"
                          />
                        </div>
                        <div className="space-y-1 text-right">
                          <label className="text-[10px] font-black text-slate-400 block">نشانک کوچک بالا (Badge)</label>
                          <input 
                            placeholder="پیشنهاد طلایی پت‌وان" 
                            type="text" value={newSlide.badge}
                            onChange={(e) => setNewSlide({ ...newSlide, badge: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-white outline-none"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-3 pt-4 border-t border-slate-900">
                        <button type="button" onClick={() => setShowAddSlide(false)} className="px-4 py-2 bg-slate-900 text-xs font-black rounded-xl cursor-pointer">انصراف</button>
                        <button type="submit" className="px-4 py-2 bg-brand-orange text-white text-xs font-black rounded-xl cursor-pointer">ذخیره اسلاید</button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* LIST SLIDES RENDER CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {heroSlides.map((slide, i) => (
                    <div key={slide.id} className="bg-slate-950 rounded-[28px] border border-slate-800 overflow-hidden text-right flex flex-col justify-between">
                      <div className="aspect-[16/7] relative bg-slate-850">
                        <img src={slide.image} className="w-full h-full object-cover" alt="" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                        <span className="absolute top-4 right-4 bg-brand-orange text-white text-[9px] font-black px-2.5 py-1 rounded-full">{slide.badge || 'پیشنهاد شیک'}</span>
                      </div>
                      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <h3 className="text-xs font-black text-slate-200 leading-snug">{slide.title}</h3>
                          <p className="text-[10px] font-bold text-slate-400 leading-relaxed">{slide.subtitle}</p>
                        </div>
                        <div className="pt-4 border-t border-slate-900 flex items-center justify-between text-xs">
                          <span className="bg-slate-900 px-3 py-1.5 rounded-lg text-[10px] font-bold text-slate-400">دکمه: {slide.cta || 'خرید'}</span>
                          <button 
                            onClick={() => handleDeleteSlide(slide.id)}
                            className="flex items-center gap-1 bg-rose-500/15 text-rose-400 hover:bg-rose-500 hover:text-white px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                          >
                            <Trash2 size={11} />
                            <span>حذف اسلاید</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: ACTIVE DISCOUNTS & PROMOTIONS */}
            {activeTab === 'discounts' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-white">مدیریت بن‌های معافیت مالیاتی و کدهای تخفیف 🏷️</h2>
                    <p className="text-[10px] text-slate-400 font-bold">تنظیم مقادیر درصدی کدهای تبلیغاتی پیگرددار</p>
                  </div>
                  <button 
                    onClick={() => setShowAddDiscount(!showAddDiscount)}
                    className="flex items-center gap-1.5 bg-brand-orange text-white text-xs font-black px-4 py-2 rounded-xl hover:bg-orange-600 transition-all cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>تولید بن جدید</span>
                  </button>
                </div>

                {/* ADD COUPON DRAWER */}
                {showAddDiscount && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-950 p-6 rounded-[28px] border border-brand-orange/20">
                    <form onSubmit={handleAddDiscount} className="space-y-4">
                      <h3 className="text-xs font-black text-slate-200">مشخصات کد تخفیف جدید</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1 text-right">
                          <label className="text-[10px] font-black text-slate-400 block">کد تخفیف (یک کلمه انگلیسی)</label>
                          <input 
                            placeholder="WINTER40" 
                            type="text" required value={newDiscount.code}
                            onChange={(e) => setNewDiscount({ ...newDiscount, code: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-white text-center font-mono outline-none"
                          />
                        </div>
                        <div className="space-y-1 text-right">
                          <label className="text-[10px] font-black text-slate-400 block">عنوان جشنواره</label>
                          <input 
                            placeholder="تخفیف ویژه جشنواره پاییزی" 
                            type="text" required value={newDiscount.title}
                            onChange={(e) => setNewDiscount({ ...newDiscount, title: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-white outline-none"
                          />
                        </div>
                        <div className="space-y-1 text-right">
                          <label className="text-[10px] font-black text-slate-400 block">میزان درصد کسر قیمت (تا ۱۰۰)</label>
                          <input 
                            type="number" max="100" min="1" required value={newDiscount.percent}
                            onChange={(e) => setNewDiscount({ ...newDiscount, percent: Number(e.target.value) })}
                            className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-white"
                          />
                        </div>
                      </div>
                      <div className="space-y-1 text-right">
                        <label className="text-[10px] font-black text-slate-400 block">توضیحات کوتاه تاثیرات کوپن</label>
                        <input 
                          placeholder="تخفیف ۳۰ درصدی بدون محدودیت روی همه محصولات آرایشی بهداشتی گربه" 
                          type="text" value={newDiscount.description}
                          onChange={(e) => setNewDiscount({ ...newDiscount, description: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-white"
                        />
                      </div>
                      <div className="flex justify-end gap-3 pt-4 border-t border-slate-900">
                        <button type="button" onClick={() => setShowAddDiscount(false)} className="px-4 py-2 bg-slate-900 text-xs font-black rounded-xl cursor-pointer">انصراف</button>
                        <button type="submit" className="px-4 py-2 bg-brand-orange text-white text-xs font-black rounded-xl cursor-pointer">ذخیره نهایی</button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* EDIT COUPON DRAWER */}
                {editingDiscount && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-950 p-6 rounded-[28px] border border-cyan-500/40">
                    <form onSubmit={handleUpdateDiscount} className="space-y-4">
                      <h3 className="text-xs font-black text-slate-200">ویرایش مشخصات کد تخفیف</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1 text-right">
                          <label className="text-[10px] font-black text-slate-400 block">کد تخفیف (یک کلمه انگلیسی)</label>
                          <input 
                            placeholder="WINTER40" 
                            type="text" required value={editingDiscount.code}
                            onChange={(e) => setEditingDiscount({ ...editingDiscount, code: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-white text-center font-mono outline-none"
                          />
                        </div>
                        <div className="space-y-1 text-right">
                          <label className="text-[10px] font-black text-slate-400 block">عنوان جشنواره</label>
                          <input 
                            placeholder="تخفیف ویژه جشنواره پاییزی" 
                            type="text" required value={editingDiscount.title}
                            onChange={(e) => setEditingDiscount({ ...editingDiscount, title: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-white outline-none"
                          />
                        </div>
                        <div className="space-y-1 text-right">
                          <label className="text-[10px] font-black text-slate-400 block">میزان درصد کسر قیمت (تا ۱۰۰)</label>
                          <input 
                            type="number" max="100" min="1" required value={editingDiscount.percent}
                            onChange={(e) => setEditingDiscount({ ...editingDiscount, percent: Number(e.target.value) })}
                            className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-white"
                          />
                        </div>
                      </div>
                      <div className="space-y-1 text-right">
                        <label className="text-[10px] font-black text-slate-400 block">توضیحات کوتاه تاثیرات کوپن</label>
                        <input 
                          placeholder="تخفیف ۳۰ درصدی بدون محدودیت روی همه محصولات آرایشی بهداشتی گربه" 
                          type="text" value={editingDiscount.description || ''}
                          onChange={(e) => setEditingDiscount({ ...editingDiscount, description: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-white"
                        />
                      </div>
                      <div className="flex justify-end gap-3 pt-4 border-t border-slate-900">
                        <button type="button" onClick={() => setEditingDiscount(null)} className="px-4 py-2 bg-slate-900 text-xs font-black rounded-xl cursor-pointer">انصراف</button>
                        <button type="submit" className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-black rounded-xl cursor-pointer">بروزرسانی تغییرات</button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* CURRENT ACTIVE COUPONS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {discounts.map(discount => (
                    <div key={discount.id} className={`bg-slate-950 p-5 rounded-[24px] border border-slate-800 text-right space-y-4 flex flex-col justify-between ${!discount.active ? 'opacity-50' : ''}`}>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="bg-brand-orange/15 text-brand-orange text-[9px] font-black px-2.5 py-1 rounded-full">{discount.percent}٪ کسر مبلغ</span>
                          <span className={`w-3.5 h-3.5 rounded-full ${discount.active ? 'bg-emerald-500' : 'bg-slate-600'}`} title={discount.active ? 'فعال' : 'غیرفعال'} />
                        </div>
                        <h4 className="text-xs font-black text-slate-200">{discount.title}</h4>
                        <p className="text-[10px] text-slate-400 font-bold leading-relaxed">{discount.description}</p>
                      </div>
                      <div className="pt-4 border-t border-slate-900 flex items-center justify-between gap-4">
                        <div className="bg-slate-900 border border-dashed border-slate-800 px-3 py-1.5 rounded-xl font-mono text-xs text-center font-black text-slate-200 uppercase tracking-widest leading-none">
                          {discount.code}
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => toggleDiscountStatus(discount.id)}
                            className={`text-[9.5px] font-black px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                              discount.active ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500'
                            }`}
                          >
                            {discount.active ? 'غیرفعال کردن' : 'فعال‌سازی'}
                          </button>
                          <button 
                            onClick={() => {
                              setEditingDiscount(discount);
                              setShowAddDiscount(false);
                            }}
                            className="p-1.5 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-white rounded-xl transition-all cursor-pointer"
                            title="ویرایش کد تخفیف"
                          >
                            <Edit size={13} />
                          </button>
                          <button 
                            onClick={() => handleDeleteDiscount(discount.id)}
                            className="p-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl transition-all cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: MAGAZINE ARTICLES CMS */}
            {activeTab === 'articles' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-white">مدیریت مقالات علمی و مطالب مجله 📖</h2>
                    <p className="text-[10px] text-slate-400 font-bold">تنظیم و انتشار خودآموزهای نگهداری پت در صفحه اصلی</p>
                  </div>
                  <button 
                    onClick={() => setShowAddArticle(!showAddArticle)}
                    className="flex items-center gap-1.5 bg-brand-orange text-white text-xs font-black px-4 py-2 rounded-xl hover:bg-orange-600 transition-all cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>افزودن مطلب جدید</span>
                  </button>
                </div>

                {/* ADD ARTICLE CMS BOX */}
                {showAddArticle && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-950 p-6 rounded-[28px] border border-brand-orange/20">
                    <form onSubmit={handleAddArticle} className="space-y-4">
                      <h3 className="text-xs font-black text-slate-200">مشخصات مقاله جدید</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1 text-right col-span-1 md:col-span-2">
                          <label className="text-[10px] font-black text-slate-400 block">عنوان مقاله</label>
                          <input 
                            placeholder="نکات تغذیه مرغ عشق و روش‌های جفت‌گیری آن 🦜" 
                            type="text" required value={newArticle.title}
                            onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-white outline-none"
                          />
                        </div>
                        <div className="space-y-1 text-right">
                          <label className="text-[10px] font-black text-slate-400 block">دسته‌بندی موضوعی</label>
                          <input 
                            placeholder="پرندگان، بهداشت سگ" 
                            type="text" value={newArticle.category}
                            onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-white"
                          />
                        </div>
                        <div className="space-y-1 text-right">
                          <label className="text-[10px] font-black text-slate-400 block">نویسنده مقاله</label>
                          <input 
                            placeholder="دکتر همایون صالحی (متخصص پرندگان)" 
                            type="text" value={newArticle.author}
                            onChange={(e) => setNewArticle({ ...newArticle, author: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-white"
                          />
                        </div>
                        <div className="space-y-1 text-right">
                          <label className="text-[10px] font-black text-slate-400 block">آدرس عکس هدر (Unsplash URL)</label>
                          <input 
                            placeholder="https://images.unsplash.com/..." 
                            type="text" value={newArticle.image}
                            onChange={(e) => setNewArticle({ ...newArticle, image: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-white"
                          />
                        </div>
                        <div className="space-y-1 text-right">
                          <label className="text-[10px] font-black text-slate-400 block">تاریخ انتشار</label>
                          <input 
                            placeholder="۳۰ اردیبهشت ۱۴۰۵" 
                            type="text" value={newArticle.date}
                            onChange={(e) => setNewArticle({ ...newArticle, date: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-white"
                          />
                        </div>
                      </div>
                      <div className="space-y-1 text-right">
                        <label className="text-[10px] font-black text-slate-400 block">خلاصه چند خطی مقاله (جهت نمایش در هوم پیج)</label>
                        <textarea 
                          placeholder="تغذیه نادرست پرندگان کوچک می‌تواند منجر به فلجی یا سوءهاضمه شود. ارزن به عنوان غذای پایه عالی است اما کافی نیست..." 
                          required rows={2} value={newArticle.excerpt}
                          onChange={(e) => setNewArticle({ ...newArticle, excerpt: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-white outline-none focus:border-brand-orange"
                        />
                      </div>
                      <div className="space-y-1 text-right flex-1">
                        <label className="text-[10px] font-black text-slate-400 block">متن مفصل و کامل مقاله</label>
                        <textarea 
                          placeholder="در این قسمت راهنماهای علمی جفت‌گیری، میزان سبزیجات لازم، کلسیم مورد نیاز پوسته تخم مرغ را اضافه کنید..." 
                          required rows={6} value={newArticle.content}
                          onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-white outline-none focus:border-brand-orange font-bold whitespace-pre-wrap"
                        />
                      </div>
                      <div className="flex justify-end gap-3 pt-4 border-t border-slate-900">
                        <button type="button" onClick={() => setShowAddArticle(false)} className="px-4 py-2 bg-slate-900 text-xs font-black rounded-xl">انصراف</button>
                        <button type="submit" className="px-4 py-2 bg-brand-orange text-white text-xs font-black rounded-xl">انتشار مقاله در سایت</button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* CURRENT PUBLISHED POSTS TABLE */}
                <div className="bg-slate-950 border border-slate-800 rounded-[28px] overflow-hidden">
                  <div className="p-4 bg-slate-900/60 font-black text-xs text-slate-300 border-b border-slate-800">لیست تمامی مقالات وبلاگ زنده ({articles.length} مقاله)</div>
                  <div className="divide-y divide-slate-900">
                    {articles.map(article => (
                      <div key={article.id} className="p-5 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-slate-900/40 transition-all text-xs">
                        <div className="flex items-center gap-4 text-right">
                          <img src={article.image} className="w-16 h-12 rounded-xl object-cover" alt="" />
                          <div>
                            <span className="bg-brand-orange/15 text-brand-orange text-[9px] font-black px-2 py-0.5 rounded-full">{article.category}</span>
                            <h4 className="font-extrabold text-slate-200 text-xs mt-1.5 leading-snug">{article.title}</h4>
                            <p className="text-[10px] font-bold text-slate-400 mt-1">{article.excerpt}</p>
                            <span className="text-[9px] text-slate-500 font-bold block mt-2">نویسنده: <strong className="text-slate-400">{article.author}</strong> • تاریخ: {article.date}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleDeleteArticle(article.id)}
                          className="flex items-center gap-1 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white px-3 py-1.5 rounded-xl transition-all font-black cursor-pointer shrink-0"
                        >
                          <Trash2 size={13} />
                          <span>حذف مقاله</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: OUTSTANDING ORDERS LOG */}
            {activeTab === 'orders' && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-white">تحلیل سفارشات و وضعیت فروشندگان 🛒👥</h2>
                  <p className="text-[10px] text-slate-400 font-bold">بررسی روش پرداخت، اطلاعات دقیق آدرس پستی و جزئیات کالاها</p>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-[28px] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead className="bg-slate-905 text-slate-400 font-black border-b border-slate-800">
                        <tr>
                          <th className="p-4">شماره سفارش</th>
                          <th className="p-4">نام مشتری</th>
                          <th className="p-4">تلفن خریدار</th>
                          <th className="p-4">آدرس ارسال</th>
                          <th className="p-4">تاریخ ثبت</th>
                          <th className="p-4">روش پرداخت</th>
                          <th className="p-4">مبلغ پرداختی</th>
                          <th className="p-4">تغییر وضعیت سفارش</th>
                          <th className="p-4 text-center">عملیات</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900">
                        {orders.map(order => (
                          <tr key={order.id} className="hover:bg-slate-900/40 transition-colors">
                            <td className="p-4 font-mono font-black text-brand-orange">{order.id}</td>
                            <td className="p-4 font-black text-slate-200">{order.customerName}</td>
                            <td className="p-4 font-mono text-slate-300">{order.customerPhone}</td>
                            <td className="p-4 text-slate-300 font-bold max-w-[180px] truncate" title={order.address || 'آدرس پیش‌فرض'}>
                              {order.address || 'ثبت نشده'}
                            </td>
                            <td className="p-4 font-mono text-slate-400">{order.date}</td>
                            <td className="p-4 text-slate-300 font-bold">{order.paymentMethod || 'آنلاین'}</td>
                            <td className="p-4 font-mono font-black text-slate-200">{order.totalAmount.toLocaleString('fa-IR')} تومان</td>
                            <td className="p-4">
                              <select 
                                value={order.status}
                                onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                className={`text-[10px] font-black p-1.5 rounded-xl border-none outline-none cursor-pointer ${
                                  order.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' :
                                  order.status === 'Processing' ? 'bg-indigo-500/10 text-indigo-400' :
                                  order.status === 'Pending' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'
                                }`}
                              >
                                <option value="Pending" className="bg-slate-900 text-white">Pending (در انتظار)</option>
                                <option value="Processing" className="bg-slate-900 text-white">Processing (تجهیز مرسوله)</option>
                                <option value="Completed" className="bg-slate-900 text-white">Completed (تحویل اداره پست)</option>
                                <option value="Cancelled" className="bg-slate-900 text-white">Cancelled (لغو شده)</option>
                              </select>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center justify-center gap-2">
                                <button 
                                  onClick={() => setSelectedOrderDetails(order)}
                                  className="p-2 bg-brand-orange/15 text-brand-orange hover:bg-brand-orange hover:text-white rounded-xl transition-all cursor-pointer"
                                  title="مشخصات کامل سفارش"
                                >
                                  <Eye size={13} />
                                </button>
                                <button 
                                  onClick={() => handleDeleteOrder(order.id)}
                                  className="p-2 bg-rose-500/15 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl transition-all cursor-pointer"
                                  title="حذف سفارش"
                                >
                                  <X size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Order Details Modal (مشخصات کامل سفارش) */}
                <AnimatePresence>
                  {selectedOrderDetails && (
                    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-[9999] overflow-y-auto">
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 30 }}
                        className="bg-slate-900 border border-slate-800 rounded-[32px] w-full max-w-2xl overflow-hidden shadow-2xl text-right text-white relative flex flex-col max-h-[90vh]"
                      >
                        {/* Header */}
                        <div className="bg-slate-950/80 p-6 border-b border-slate-800/80 flex items-center justify-between sticky top-0 z-10 backdrop-blur-sm">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">📦</span>
                            <div>
                              <h3 className="text-sm font-black text-slate-200">مشخصات کامل سفارش: <span className="text-brand-orange font-mono font-black">{selectedOrderDetails.id}</span></h3>
                              <p className="text-[9px] text-slate-400 font-bold block mt-0.5">ثبت شده در تاریخ {selectedOrderDetails.date}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => setSelectedOrderDetails(null)} 
                            className="p-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer text-slate-400 hover:text-white"
                          >
                            <X size={16} />
                          </button>
                        </div>

                        {/* Content Area */}
                        <div className="p-6 overflow-y-auto space-y-6 flex-1">
                          
                          {/* Status Tracker and Payment info */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50 space-y-2">
                              <span className="text-[10px] font-black text-slate-400 block">وضعیت سفارش:</span>
                              <div className="flex items-center gap-2">
                                <span className={`inline-block w-2.5 h-2.5 rounded-full ${
                                  selectedOrderDetails.status === 'Completed' ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' :
                                  selectedOrderDetails.status === 'Processing' ? 'bg-indigo-500 shadow-lg shadow-indigo-500/20' :
                                  selectedOrderDetails.status === 'Pending' ? 'bg-amber-500 shadow-lg shadow-amber-500/20' : 'bg-rose-500 shadow-lg shadow-rose-500/20'
                                }`} />
                                <span className={`text-xs font-black ${
                                  selectedOrderDetails.status === 'Completed' ? 'text-emerald-400' :
                                  selectedOrderDetails.status === 'Processing' ? 'text-indigo-400' :
                                  selectedOrderDetails.status === 'Pending' ? 'text-amber-400' : 'text-rose-400'
                                }`}>
                                  {selectedOrderDetails.status === 'Completed' ? 'تحویل اداره پست (تکمیل شده)' :
                                   selectedOrderDetails.status === 'Processing' ? 'در حال آماده‌سازی و بسته‌بندی' :
                                   selectedOrderDetails.status === 'Pending' ? 'در انتظار تایید پرداخت' : 'لغو شده'}
                                </span>
                              </div>
                            </div>

                            <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50 space-y-2">
                              <span className="text-[10px] font-black text-slate-400 block">نحوه پرداخت و تراکنش:</span>
                              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                                <span>{selectedOrderDetails.paymentMethod}</span>
                                <span className="font-black text-brand-orange text-sm font-mono">{selectedOrderDetails.totalAmount.toLocaleString('fa-IR')} تومان</span>
                              </div>
                            </div>
                          </div>

                          {/* Customer info & Address */}
                          <div className="bg-slate-950/50 p-5 rounded-2xl border border-slate-800/50 space-y-4">
                            <h4 className="text-xs font-extrabold text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-2">
                              <span>👤</span>
                              <span>اطلاعات خریدار و نشانی تحویل مرسوله</span>
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-slate-300">
                              <div>
                                <span className="text-slate-500 block text-[10px] mb-1 font-black">نام و نام خانوادگی خریدار:</span>
                                <span>{selectedOrderDetails.customerName}</span>
                              </div>
                              <div>
                                <span className="text-slate-500 block text-[10px] mb-1 font-black">تلفن تماس:</span>
                                <span className="font-mono">{selectedOrderDetails.customerPhone}</span>
                              </div>
                            </div>
                            <div className="pt-3 border-t border-slate-800/50">
                              <span className="text-slate-500 block text-[10px] mb-1 font-black">📍 آدرس دقیق تحویل گیرنده:</span>
                              <p className="text-xs text-slate-100 font-extrabold leading-relaxed pr-1 bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                                {selectedOrderDetails.address || 'تهران، خیابان ولیعصر، کوچه تورج، پلاک ۱۲، واحد ۳'}
                              </p>
                            </div>
                          </div>

                          {/* Order items (Simulated Products details) */}
                          <div className="bg-slate-950/50 p-5 rounded-2xl border border-slate-800/50 space-y-3">
                            <h4 className="text-xs font-extrabold text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-2">
                              <span>🛍️</span>
                              <span>لیست اقلام سفارش داده شده ({selectedOrderDetails.itemsCount || 1} قلم کالا)</span>
                            </h4>
                            <div className="space-y-3">
                              {selectedOrderDetails.items && selectedOrderDetails.items.length > 0 ? (
                                selectedOrderDetails.items.map((item: any, idx: number) => (
                                  <div key={idx} className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between gap-3 text-xs">
                                    <div className="flex items-center gap-3">
                                      <div className="w-9 h-9 bg-slate-950 rounded-lg flex items-center justify-center text-rose-500 font-black shrink-0 shadow-inner">
                                        📦
                                      </div>
                                      <div>
                                        <p className="font-black text-slate-200 leading-snug">{item.name}</p>
                                        <span className="text-[9px] text-slate-500 font-black block mt-1">تعداد: <strong className="text-slate-300 ml-2">{item.quantity} عدد</strong> • قیمت واحد: {item.price.toLocaleString('fa-IR')} تومان</span>
                                      </div>
                                    </div>
                                    <span className="font-mono font-black text-slate-200">{(item.price * item.quantity).toLocaleString('fa-IR')} تومان</span>
                                  </div>
                                ))
                              ) : (
                                <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between gap-3 text-xs">
                                  <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-slate-950 rounded-lg flex items-center justify-center text-brand-orange font-black shrink-0">
                                      📦
                                    </div>
                                    <div>
                                      <p className="font-black text-slate-200 leading-snug">بسته غافلگیری ملزومات گربه و سگ خانگی</p>
                                      <span className="text-[9px] text-slate-500 font-black block mt-1">تعداد کل: <strong className="text-slate-300">{selectedOrderDetails.itemsCount || 1} کالا</strong></span>
                                    </div>
                                  </div>
                                  <span className="font-mono font-black text-slate-200">{selectedOrderDetails.totalAmount.toLocaleString('fa-IR')} تومان</span>
                                </div>
                              )}
                            </div>
                          </div>

                        </div>

                        {/* Footer */}
                        <div className="bg-slate-950/85 p-5 border-t border-slate-800 sticky bottom-0 z-10 flex items-center justify-between">
                          <button 
                            type="button" 
                            onClick={() => {
                              alert('فاکتور خرید آماده شده و به فکس / پرینتر متصل به پنل ارسال شد! 🖨️');
                            }}
                            className="bg-slate-900 border border-slate-800 hover:border-brand-orange hover:text-brand-orange transition-all py-2 px-4 rounded-xl text-xs font-black cursor-pointer text-slate-300"
                          >
                            🖨️ چاپ فاکتور خرید
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setSelectedOrderDetails(null)}
                            className="bg-brand-orange text-white hover:bg-orange-600 transition-all py-2 px-5 rounded-xl text-xs font-black cursor-pointer"
                          >
                            تایید و بستن صفحه
                          </button>
                        </div>

                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>

              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// FOOTER COMPONENT
// ============================================================================

const Footer = () => {
  const [selectedInfo, setSelectedInfo] = useState<{ title: string; desc: string } | null>(null);

  const footerContent: Record<string, { title: string; desc: string }> = {
    'درباره پِت‌وان': {
      title: 'درباره پِت‌وان 🐾',
      desc: 'پِت‌وان بزرگترین و معتبرترین مرجع تخصصی ملزومات، غذا و لوازم جانبی حیوانات خانگی در ایران است. هدف ما ارتقای استانداردهای سلامت و رفاه همراهان وفادار شماست.'
    },
    'درباره ما': {
      title: 'بیشتر بدانید: درباره پت‌وان 🏢',
      desc: 'پت‌وان در سال ۱۳۹۸ با یک تیم پرشور از متخصصین تغذیه و دامپزشکان کارآزموده آغاز به کار کرد. اعتقاد قلبی ما این است که هر پت لایق تغذیه عالی، بهداشت مناسب و محیطی شاداب است. ما کالاهای اصل و شناسنامه‌دار را از برترین تولیدکنندگان جهان بدون واسطه تامین و با قیمتی شفاف تحویل خانواده‌ها می‌دهیم.'
    },
    'همکاری با پتوان': {
      title: 'همکاری با برند پِت‌وان 🤝',
      desc: 'پتوان همواره پذیرای همفکری و همکاری با درمانگران، دامپزشکان، توزیع‌کنندگان تخصصی، مربیان خلاق و تولیدکنندگان داخلی پد یا قفس است. در صورتی که تمایل به همکاری تجاری، فروش عمده یا تولید محتوا دارید، پورتال پشتیبانی فعال است.'
    },
    'ارتباط با ما': {
      title: 'راه‌های ارتباطی با پت‌وان ☎️',
      desc: 'پشتیبانی برخط و سراسری پت‌وان همه روزه پاسخگوی ابهامات شماست. تلفن مستقیم: ۰۹۳۷۲۲۳۹۳۷۳ (پیام‌رسان‌ها فعال) | ایمیل رسمی: support@petone.ir | نشانی پستی دفتر مرکزی: تهران، بزرگراه چمران، خیابان یمن، پلاک ۱۰.'
    },
    'پاسخ به پرسش‌های متداول': {
      title: 'پاسخ به پرسش‌های پرتکرار ❓',
      desc: 'تمامی سفارشات تهران ظرف ۲۴ ساعت توسط پیک اختصاصی تحویل داده شده و سایر شهرها با پست پیشتاز سریع (۳ الی ۵ روزه) با بیمه کامل حمل می‌گردند. امکان لغو سفارش تا قبل از خروج مرسوله وجود دارد.'
    },
    'راهنمای خرید': {
      title: 'راهنمای جامع خرید از پت‌وان 🛍️',
      desc: 'خرید از پت‌وان بسیار آسان است! فقط کافیست دسته‌بندی محصول مورد نظر خود را انتخاب کرده، آن را به سبد خرید بیفزایید و آدرس تحویل خود را مشخص کنید.'
    },
    'پیش از خرید': {
      title: 'توصیه‌های مهم پیش از خرید محصول ⚠️2',
      desc: 'قبل از افزودن غذا یا مکمل به سبد خرید، حتما سن پت (مثلاً پاپ/کیتن یا ادالت)، وزن تقریبی و هرگونه حساسیت گوارشی یا کلیوی را در تصمیم‌گیری دخالت دهید. در صورت لزوم می‌توانید توضیحات محصول را کامل مطالعه یا با دامپزشک مشورت کنید.'
    },
    'پرفروش‌ترین محصولات': {
      title: 'معرفی پرفروش‌ترین محصولات پت‌وان 🔥',
      desc: 'پرفروش‌ترین‌های فروشگاه شامل غذاهای خشک ضد هربال، خاک گربه معطر با جذب بو، شامپوهای نرم‌کننده پوست ضد حساسیت، و قطره‌های تعلیم ادرار هستند که بر اساس بالاترین آمار ثبت سفارش ماهانه خریداران دسته‌بندی شده‌اند.'
    },
    'قوانین و مقررات': {
      title: 'قوانین خرید و حقوق خریداران ⚖️',
      desc: 'به دلیل ضرورت‌های بهداشتی حیوانات خانگی، کالاهای پلمپ‌باز شده، تشویقی‌های باز یا البسه استفاده شده عودت داده نمی‌شوند. سایر کالاها در بسته‌بندی پلمپ کارخانه تا ۷ روز کاری ضمانت تعویض یا ارجاع بدون هزینه دارند.'
    },
    'رویه ارسال سفارش': {
      title: 'رویه جامع ارسال مرسولات 📦',
      desc: 'بسته‌بندی‌ها در جعبه‌های محافظ فلزی یا کارتنی محکم ضد آب عرضه می‌شوند. کدهای رهگیری پست پس از آغاز پردازش از طریق پنل کاربری یا پیامک اطلاع‌رسانی شده تا لحظه‌به‌لحظه فرآیند تحویل را پایش کنید.'
    },
    'پِت‌دانستنی': {
      title: 'آکادمی پت‌دانستنی پت‌وان 🧠',
      desc: 'مجله دیجیتال برخط پت‌وان بستری تخصصی برای یادگیری شیوه‌های همزیستی بهتر، اصول پرورش سالم، راهکارهای روانشناختی رفتار حیوان خانگی و نکات طلایی تربیتی در منزل است.'
    },
    'مجله آموزشی': {
      title: 'مجله آموزشی و وبلاگ علمی پت‌وان 📖',
      desc: 'صدها مقاله ترجمه شده از منابع معتبر دامپزشکی جهانی نظیر PetMD و رویال کنین به صورت رایگان در اختیار شماست. اطلاعات واکسیناسیون، بیماری‌های فصلی و آموزش‌های گونان پت را در این مجله بجویید.'
    },
    'دانشنامه نژادها': {
      title: 'دانشنامه بزرگ نژادهای سگ و گربه 📚',
      desc: 'دانستن ویژگی‌های متمایز نژادی به پیشگیری از اختلالات رفتاری کمک زیادی می‌کند. مثلا نژاد شیتزو نیاز به شستشوی چشمی مرتب دارد یا نژاد بریتیش مستعد اضافه وزن است. نژادهای مختلف را در این بخش بررسی کنید.'
    },
    'تغذیه حیوانات': {
      title: 'راهنمای تغذیه اصولی و ایمن پت‌ها 🍖',
      desc: 'یک رژیم غذایی ایده‌آل باید شامل پروتئین حیوانی غنی، ویتامین‌های گروه B، و امگا ۳ باشد. همواره به یاد داشته باشید که شکلات، پیاز، کشمش، و هسته میوه‌ها برای سگ و گربه سمی و خطرناک هستند.'
    },
    'تربیت و آموزش': {
      title: 'تکنیک‌های علمی تربیت و اصلاح رفتار 🎓',
      desc: 'تربیت موفق متکی بر تکنیک‌های تشویق کلامی و فیدبک مثبت (پاداش‌های کوچک لذیذ) است. با یادگیری آموزش دستوراتی هم‌چون پارک، هم قدم شدن و رفع ترس از صدای رعد و برق، محیطی آرام را برای حیوان ایجاد نمایید.'
    }
  };

  // Pre-process pre-purchase typo or similar
  const handleItemClick = (item: string) => {
    let key = item;
    if (item === 'پیش از خرید' && !footerContent['پیش از خرید']) {
      key = 'پیش از خرید';
    }
    const content = footerContent[key] || footerContent[item];
    if (content) {
      setSelectedInfo({
        title: content.title.replace('⚠️2', '⚠️'),
        desc: content.desc
      });
    }
  };

  return (
    <>
      <footer className="bg-white border-t border-slate-100 pt-20 pb-10">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
            <div className="col-span-2 space-y-6">
              <div dir="ltr" className="flex items-center gap-2 justify-end">
                <svg width="34" height="34" viewBox="0 0 100 100" className="text-brand-orange">
                  <circle cx="50" cy="24" r="13" fill="currentColor" />
                  <path d="M 17 46 C 23 66, 35 73, 50 73 C 65 73, 77 66, 83 46" stroke="currentColor" strokeWidth="21" fill="none" strokeLinecap="round" />
                </svg>
                <span className="text-xl font-logo font-bold tracking-tight select-none">
                  <span className="text-slate-800">pet</span><span className="text-brand-orange">one</span>
                </span>
              </div>
              <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-xs text-right">
                پِت‌وان بزرگترین مرجع تخصصی ملزومات حیوانات خانگی در ایران. تلاش ما فراهم کردن بهترین کیفیت برای همراهان وفادار شماست.
              </p>
              <div className="flex items-center gap-4">
                {['Instagram', 'Twitter', 'Youtube'].map(social => (
                  <div key={social} className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:bg-brand-orange hover:text-white transition-all cursor-pointer">
                     <div className="text-[10px] font-black">{social[0]}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-6 text-right">
              <h4 
                onClick={() => handleItemClick('درباره پِت‌وان')}
                className="text-sm font-black text-slate-800 hover:text-brand-orange transition-colors cursor-pointer select-none"
              >
                درباره پِت‌وان
              </h4>
              <ul className="space-y-4">
                {['درباره ما', 'همکاری با پتوان', 'ارتباط با ما', 'پاسخ به پرسش‌های متداول'].map(item => (
                  <li 
                    key={item} 
                    onClick={() => handleItemClick(item)}
                    className="text-xs font-bold text-slate-500 hover:text-brand-orange transition-colors cursor-pointer select-none"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6 text-right">
              <h4 
                onClick={() => handleItemClick('راهنمای خرید')}
                className="text-sm font-black text-slate-800 hover:text-brand-orange transition-colors cursor-pointer select-none"
              >
                راهنمای خرید
              </h4>
              <ul className="space-y-4">
                {['پیش از خرید', 'پرفروش‌ترین محصولات', 'قوانین و مقررات', 'رویه ارسال سفارش'].map(item => (
                  <li 
                    key={item} 
                    onClick={() => handleItemClick(item)}
                    className="text-xs font-bold text-slate-500 hover:text-brand-orange transition-colors cursor-pointer select-none"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6 text-right">
              <h4 
                onClick={() => handleItemClick('پِت‌دانستنی')}
                className="text-sm font-black text-slate-800 hover:text-brand-orange transition-colors cursor-pointer select-none"
              >
                پِت‌دانستنی
              </h4>
              <ul className="space-y-4">
                {['مجله آموزشی', 'دانشنامه نژادها', 'تغذیه حیوانات', 'تربیت و آموزش'].map(item => (
                  <li 
                    key={item} 
                    onClick={() => handleItemClick(item)}
                    className="text-xs font-bold text-slate-500 hover:text-brand-orange transition-colors cursor-pointer select-none"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="pt-10 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-black text-slate-300 uppercase tracking-widest">
            <p>© ۲۰۲۴ تمامی حقوق برای پِت‌وان محفوظ است</p>
            <div className="flex flex-col items-center sm:items-end gap-2">
              <span className="text-[11px] text-slate-400 font-bold tracking-normal normal-case mt-1">
                برای ارتباط با طراح برند و سایت: <a href="tel:09372239373" className="underline hover:text-brand-orange transition-colors">09372239373</a> پیام دهید
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Info Popup Modal */}
      <AnimatePresence>
        {selectedInfo && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedInfo(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[32px] p-6 sm:p-8 shadow-2xl overflow-hidden text-right z-10"
              dir="rtl"
            >
              {/* Decorative top bar */}
              <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-brand-orange via-orange-400 to-amber-500" />
              
              <button 
                onClick={() => setSelectedInfo(null)}
                className="absolute top-4 left-4 p-2 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors text-slate-500 cursor-pointer"
              >
                <X size={16} />
              </button>
              
              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center text-xl">
                    🐾
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-slate-800">{selectedInfo.title}</h3>
                </div>
                
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-bold pr-1">
                  {selectedInfo.desc}
                </p>
                
                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button 
                    onClick={() => setSelectedInfo(null)}
                    className="px-5 py-2.5 bg-brand-orange text-white rounded-xl text-xs font-black hover:bg-orange-600 transition-all cursor-pointer shadow-lg shadow-brand-orange/10"
                  >
                    متوجه شدم ✔️
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default function App() {
  console.log('App mounting...', { productsCount: PRODUCTS?.length });
  const [error, setError] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [view, setView] = useState<'home' | 'shop' | 'auth' | 'account' | 'admin'>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('petone_is_logged_in') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('petone_is_logged_in', isLoggedIn ? 'true' : 'false');
  }, [isLoggedIn]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('petone_is_admin') === 'true';
  });
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState('');
  const [adminLoginError, setAdminLoginError] = useState('');

  // Dynamic system states
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('petone_products_v3');
    return saved ? JSON.parse(saved) : PRODUCTS;
  });
  
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('petone_categories_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some(c => c.id === 'birds')) {
          return NAV_CATEGORIES;
        }
        return parsed;
      } catch (e) {
        return NAV_CATEGORIES;
      }
    }
    return NAV_CATEGORIES;
  });
  
  const [foodCategories, setFoodCategories] = useState(() => {
    const saved = localStorage.getItem('petone_food_categories_v3');
    return saved ? JSON.parse(saved) : FOOD_CATEGORIES;
  });

  const [heroSlides, setHeroSlides] = useState(() => {
    const saved = localStorage.getItem('petone_hero_slides');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: 'غذای خشک گربه رویال کنین مدل Fit 32', subtitle: 'تغذیه‌ای متعادل برای گربه‌های فعال با هضم آسان و طعم لذیذ', image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&q=80&w=1200', cta: 'مشاهده و خرید محصول', badge: '۳۰٪ تخفیف ویژه بهاره' },
      { id: 2, title: 'بهترین ملزومات سگ و گربه دلبندتان', subtitle: 'کلکسیونی از باکیفیت‌ترین ظروف، اسباب‌بازی‌ها و مکمل‌های غذایی', image: 'https://images.unsplash.com/photo-1415369629372-26f2fe60c467?auto=format&fit=crop&q=80&w=1200', cta: 'کشف هیجان بیشتر', badge: 'تخفیف شگفت‌انگیز پاییزه' }
    ];
  });

  const [discounts, setDiscounts] = useState(() => {
    const saved = localStorage.getItem('petone_discounts');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'd1', code: 'HELLOONE', title: 'خوش‌آمدگویی پت‌وان', description: '۱۰ درصد تخفیف ویژه اولین سفارش محصولات', percent: 10, active: true },
      { id: 'd2', code: 'SPRING30', title: 'تخفیف بهاره غذای پت', description: '۳۰ درصد تخفیف مکمل‌ها و خوراک سگ و گربه', percent: 30, active: true },
      { id: 'd3', code: 'LOYAL20', title: 'باشگاه مشتریان وفادار', description: '۲۰ درصد تخفیف ویژه خریدهای بالای ۵ میلیون تومان', percent: 20, active: true }
    ];
  });

  const [articles, setArticles] = useState(() => {
    const saved = localStorage.getItem('petone_articles');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'art1',
        title: 'راهنمای کامل نگهداری از توله سگ در آپارتمان 🐕',
        excerpt: 'تربیت و نگهداری توله سگ آپارتمانی چالش‌ها و روش‌های مخصوص به خود را دارد. در این مقاله نکات طلایی را پوشش داده‌ایم.',
        content: 'نگهداری از توله سگ‌ها در محیط‌های آپارتمانی نیازمند برنامه‌ریزی منظم و صبوری است. سگ‌های آپارتمانی به ویژه در ماه‌های ابتدایی نیاز مبرم به آموزش رفتاری، کنترل دفع، و همچنین برنامه‌ریزی پیاده‌روی دارند.\n\nروش‌های بهینه دفع در آپارتمان:\n۱. استفاده از پدهای بهداشتی مخصوص و مایع جذب کننده.\n۲. تشویق و دادن پاداش پس از انجام صحیح کار.\n۳. پرهیز از تنبیه بدنی یا فریاد زدن، که فقط حیوان را لجبازتر می‌کند.\n\nتغذیه مناسب توله‌سگ:\nتوله‌سگ‌های نژاد کوچک و بزرگ در حال رشد به پروتئین باکیفیت و کلسیم متعادل نیاز دارند. حتماً از برندهای معتبر غذایی مانند رویال کنین یا رفلکس استفاده نموده و کارهای سنگین و دویدن‌های زیاد را قبل از سن بلوغ استخوانی محدود کنید.',
        category: 'آموزش سگ',
        image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=400',
        author: 'دکتر علیرضا محمدی (دامپزشک)',
        date: '۲۸ اردیبهشت ۱۴۰۵'
      },
      {
        id: 'art2',
        title: 'چگونه بهترین غذای خشک را برای گربه بالغ انتخاب کنیم؟ 🐈',
        excerpt: 'سلامت پوست، مو و کلیه‌های گربه شما مستقیماً به نوع غذای خشک بستگی دارد. این تحلیل جامع را از دست ندهید.',
        content: 'انتخاب بهترین غذای خشک گربه یکی از مهم‌ترین خدماتی است که می‌توانید به سلامتی پت دلبادتان بکنید. کلیه گربه‌ها به شدت در معرض تشکیل سنگ و نارسایی‌های ادراری هستند، بنابراین تغذیه با سدیم و فلوئور کنترل شده و پروتئین حیوانی مرغوب حیاتی است.\n\nفاکتورهای مهم در خرید غذای خشک گربه:\n- فاقد غلات مازاد (Grain-Free) در صورت داشتن حساسیت گوارشی.\n- تعادل پی‌اچ (pH) برای پیشگیری از سنگ کلیه.\n- غنی بودن از تائورین (حرکات قلبی و بینایی قوی گربه به این آمینواسید وابسته است).\n\nمیزان مصرف روزانه:\nحتما بر اساس جدول پشت بسته‌بندی غذا و با استفاده از پیمانه مدرج، مقدار متناسب با وزن گربه را سرو کنید و همیشه آب تازه و فراوان در ظرف استیل یا فیلتردار برای گربه قرار دهید.',
        category: 'سلامت گربه',
        image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400',
        author: 'خانم مهندس سمیرا راد (متخصص تغذیه پت)',
        date: '۲۵ اردیبهشت ۱۴۰۵'
      },
      {
        id: 'art3',
        title: 'تربیت و کنترل پارس کردن مداوم سگ در خانه 🐾',
        excerpt: 'پارس کردن واکنشی طبیعی است اما مداومت آن نشانه تنهایی یا اضطراب است. راهکارهای برخورد صحیح را بیاموزید.',
        content: 'سگ‌ها به زبان پارس کردن با ما و محیط اطراف ارتباط برقرار می‌کنند، اما زمانی که سگ شما به محض شنیدن صدای آسانسور یا زنگ در شروع به پارس پی‌درپی می‌کند، آرامش منزل سلب خواهد شد.\n\nعوامل اصلی پارس کردن مداوم:\n۱. اضطراب جدایی (Separation Anxiety) هنگام خروج صاحبان از منزل.\n۲. جلب توجه و اعلام کسالت.\n۳. مکانیزم‌های دفاعی و نگهبانی.\n\nراه‌حل‌های عملی:\n- اسباب‌بازی‌های فکری و پرشدنی با تشویقی (مانند Kong) تهیه کنید تا سگ سرگرم تخلیه انرژی ذهنی شود.\n- هنگام پارس کردن، به هیچ عنوان او را نوازش نکنید یا با صدای بلند سر او داد نزنید (دویدن و داد زدن برای او به معنای همراهی در هیاهوست).\n- از دستور "ساکت" به همراه پاداش پس از چند ثانیه سکوت استفاده کنید.',
        category: 'رفتارشناسی پت',
        image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=400',
        author: 'علی رضوانی (مربی مجرب رفتارشناسی)',
        date: '۱۵ اردیبهشت ۱۴۰۵'
      }
    ];
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('petone_orders');
    if (saved) return JSON.parse(saved);
    return [
      { 
        id: 'ORD-1002', 
        customerName: 'کامران امیری', 
        customerPhone: '۰۹۱۲۳۴۵۶۷۸۹', 
        date: '۱۴۰۵/۰۲/۲۹', 
        totalAmount: 1850000, 
        status: 'Completed', 
        itemsCount: 3, 
        paymentMethod: 'پرداخت آنلاین',
        address: 'تهران، خیابان ولیعصر، کوچه تورج، پلاک ۱۲، واحد ۳',
        items: [
          { name: 'غذای خشک سگ رویال کنین مدل Mini Adult', quantity: 1, price: 1650000 },
          { name: 'پک تشویقی مدادی سگ برند ونپی', quantity: 2, price: 100000 }
        ]
      },
      { 
        id: 'ORD-1003', 
        customerName: 'مریم حسینی', 
        customerPhone: '۰۹۱۸۷۶۵۴۳۲۱', 
        date: '۱۴۰۵/۰۲/۲۸', 
        totalAmount: 4320000, 
        status: 'Pending', 
        itemsCount: 5, 
        paymentMethod: 'کارت به کارت',
        address: 'اصفهان، محله مرداویج، خیابان آزادی، پلاک ۴، واحد ۱',
        items: [
          { name: 'درخت گربه و اسکرچر مدل کویین', quantity: 1, price: 3800000 },
          { name: 'قطره تعلیم ادرار حیوانات تریکسی', quantity: 2, price: 260000 }
        ]
      },
      { 
        id: 'ORD-1004', 
        customerName: 'سهراب قاسمی', 
        customerPhone: '۰۹۳۵۴۴۴۵۵۶۶', 
        date: '۱۴۰۵/۰۲/۲۸', 
        totalAmount: 950000, 
        status: 'Processing', 
        itemsCount: 1, 
        paymentMethod: 'پرداخت آنلاین',
        address: 'مشهد، بلوار سجاد، خیابان بزرگمهر، ساختمان اطلس، پلاک ۲۴',
        items: [
          { name: 'شامپو براق‌کننده موی سگ تریکسی', quantity: 1, price: 950000 }
        ]
      },
      { 
        id: 'ORD-1005', 
        customerName: 'الناز عباسی', 
        customerPhone: '۰۹۱۲۷۷۷۸۸۹۹', 
        date: '۱۴۰۵/۰۲/۲۷', 
        totalAmount: 1240000, 
        status: 'Completed', 
        itemsCount: 2, 
        paymentMethod: 'پرداخت در محل',
        address: 'تبریز، شهرک ولیعصر، کوچه پروین اعتصامی، پلاک ۸',
        items: [
          { name: 'باکس حمل گربه و سگ اندی مدل مینی', quantity: 1, price: 1240000 }
        ]
      },
      { 
        id: 'ORD-1006', 
        customerName: 'آرمان شکری', 
        customerPhone: '۰۹۱۹۵۵۵۶۶۷۷', 
        date: '۱۴۰۵/۰۲/۲۶', 
        totalAmount: 3100000, 
        status: 'Cancelled', 
        itemsCount: 4, 
        paymentMethod: 'پرداخت آنلاین',
        address: 'شیراز، خیابان قصر دشت، کوچه ۱۶، پلاک ۵، طبقه اول',
        items: [
          { name: 'قلاده کتفی سگ نایلونی برند هانتر', quantity: 2, price: 850000 },
          { name: 'اسباب‌بازی توپ دندانی جویدنی سگ', quantity: 2, price: 700000 }
        ]
      }
    ];
  });

  // Local storage backup side effects
  useEffect(() => {
    localStorage.setItem('petone_products_v3', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('petone_categories_v3', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('petone_food_categories_v3', JSON.stringify(foodCategories));
  }, [foodCategories]);

  useEffect(() => {
    localStorage.setItem('petone_hero_slides', JSON.stringify(heroSlides));
  }, [heroSlides]);

  useEffect(() => {
    localStorage.setItem('petone_discounts', JSON.stringify(discounts));
  }, [discounts]);

  useEffect(() => {
    localStorage.setItem('petone_articles', JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem('petone_orders', JSON.stringify(orders));
  }, [orders]);

  // Secret URL path and hash router for Admin console (no visible UI option)
  useEffect(() => {
    const handleUrlRouting = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/admin' || path.endsWith('/admin') || hash === '#admin') {
        setView('admin');
        if (!isAdmin) {
          setShowAdminLoginModal(true);
        }
      }
    };

    // Run on initial page load / mount
    handleUrlRouting();

    // Listen to hash and POPSTATE shifts
    window.addEventListener('hashchange', handleUrlRouting);
    window.addEventListener('popstate', handleUrlRouting);

    return () => {
      window.removeEventListener('hashchange', handleUrlRouting);
      window.removeEventListener('popstate', handleUrlRouting);
    };
  }, [isAdmin]);

  if (error) {
    return (
      <div className="p-20 text-center bg-red-50 text-red-800 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">خطای سیستمی رخ داده است</h1>
        <pre className="p-4 bg-white rounded border text-left overflow-auto">{error}</pre>
        <button onClick={() => window.location.reload()} className="mt-4 btn-primary">تلاش مجدد</button>
      </div>
    );
  }

  try {
    // Memoized search data to prevent module-level evaluation risks
  const searchData = React.useMemo(() => ({
    recent: ["غذای خشک گربه رویال کنین", "قلاده سگ", "خاک گربه", "شامپو حیوانات"],
    popular: ["باکس حمل", "مکمل پرنده", "اسباب‌بازی جویدنی", "برس موی گربه", "غذای همستر"],
    categories: [
      { id: 'dogs', name: 'سگ', icon: '🐕' },
      { id: 'cats', name: 'گربه', icon: '🐈' },
      { id: 'grooming', name: 'بهداشتی', icon: '✂️' },
      { id: 'birds', name: 'پرندگان', icon: '🦜' }
    ],
    products: (PRODUCTS || []).slice(0, 10).map(p => ({
      id: p.id,
      name: p.name,
      price: (p.discountPrice || p.price || 0).toLocaleString('fa-IR'),
      brand: p.brand || 'PetOne',
      image: p.image,
      category: p.category
    }))
  }), []);

  const handleAddToCart = React.useCallback((e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    setCartCount(prev => prev + 1);
  }, []);

  const onNavClick = React.useCallback((cat: string) => {
    if (cat === 'admin') {
      if (isAdmin) {
        setView('admin');
      } else {
        setShowAdminLoginModal(true);
        setAdminPasscode('');
        setAdminLoginError('');
      }
    } else {
      setSelectedCategory(cat === 'همه' ? null : cat);
      setView('shop');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [isAdmin]);

  const onLogoClick = React.useCallback(() => {
    setView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const onAccountClick = React.useCallback(() => {
    setView(isLoggedIn ? 'account' : 'auth');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen bg-slate-50/30">
      <Header 
        cartCount={cartCount} 
        onCartClick={() => setIsCartOpen(true)} 
        onLogoClick={onLogoClick}
        onNavClick={onNavClick}
        onAccountClick={onAccountClick}
        isLoggedIn={isLoggedIn}
        searchData={{
          ...searchData,
          products: (products || []).slice(0, 10).map(p => ({
            id: p.id,
            name: p.name,
            price: (p.discountPrice || p.price || 0).toLocaleString('fa-IR'),
            brand: p.brand || 'PetOne',
            image: p.image,
            category: p.category
          }))
        }}
      />
      
      <main>
        {view === 'home' ? (
          <HomeView 
            setView={setView} 
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory} 
            setSelectedProduct={setSelectedProduct} 
            handleAddToCart={handleAddToCart} 
            products={products}
            categories={categories}
            foodCategories={foodCategories}
            banners={heroSlides}
            articles={articles}
            discounts={discounts}
          />
        ) : view === 'shop' ? (
          <ShopView 
            selectedCategory={selectedCategory} 
            setSelectedCategory={setSelectedCategory} 
            setSelectedProduct={setSelectedProduct} 
            handleAddToCart={handleAddToCart} 
            products={products}
            categories={categories}
            foodCategories={foodCategories}
          />
        ) : view === 'auth' ? (
          <AuthView 
            setView={setView} 
            setIsLoggedIn={setIsLoggedIn} 
          />
        ) : view === 'admin' ? (
          isAdmin ? (
            <AdminDashboard 
              products={products}
              setProducts={setProducts}
              categories={categories}
              setCategories={setCategories}
              foodCategories={foodCategories}
              setFoodCategories={setFoodCategories}
              heroSlides={heroSlides}
              setHeroSlides={setHeroSlides}
              discounts={discounts}
              setDiscounts={setDiscounts}
              articles={articles}
              setArticles={setArticles}
              orders={orders}
              setOrders={setOrders}
              setView={setView}
              setIsAdmin={setIsAdmin}
            />
          ) : (
            <div className="min-h-[70vh] flex items-center justify-center p-4 sm:p-8 bg-slate-900 text-slate-100 font-sans text-right rtl" dir="rtl">
              <div className="bg-slate-950 border border-slate-800 p-8 rounded-[36px] text-center max-w-sm w-full space-y-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-red-500 via-orange-500 to-amber-500" />
                <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-3xl flex items-center justify-center mx-auto text-3xl font-black shadow-lg shadow-rose-500/5">
                  🛡️
                </div>
                <div className="space-y-2">
                  <h3 className="font-black text-lg text-slate-100">بخش مدیریت ایمن شده</h3>
                  <p className="text-xs font-bold text-slate-400 leading-normal">دسترسی کاربر عادی به تنظیمات و داده‌های حساس مسدود است. لطفاً ابتدا رمز عبور مدیریت را وارد کنید.</p>
                </div>
                <button 
                  onClick={() => {
                    setShowAdminLoginModal(true);
                    setAdminPasscode('');
                    setAdminLoginError('');
                  }}
                  className="w-full bg-brand-orange hover:bg-orange-600 text-white text-xs font-black py-3.5 rounded-2xl transition-all cursor-pointer shadow-lg shadow-brand-orange/20"
                >
                  ورود به عنوان ادمین
                </button>
                <button 
                  onClick={() => {
                    setView('home');
                    window.location.hash = '';
                    window.history.pushState(null, '', '/');
                  }} 
                  className="w-full bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-black py-3.5 rounded-2xl transition-all cursor-pointer border border-slate-800"
                >
                  بازگشت به فروشگاه
                </button>
              </div>
            </div>
          )
        ) : (
          <AccountDashboard 
            setIsLoggedIn={setIsLoggedIn} 
            setView={setView} 
            setSelectedCategory={setSelectedCategory} 
            setCartCount={setCartCount}
          />
        )}
      </main>

      <Footer />

      {/* Product Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-5xl bg-white rounded-[24px] sm:rounded-[40px] shadow-2xl overflow-hidden max-h-[95vh] overflow-y-auto"
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 p-2 bg-gray-100/80 backdrop-blur hover:bg-gray-200 rounded-full transition-colors"
              >
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
              
              <div className="flex flex-col lg:grid lg:grid-cols-2 h-full">
                <div className="bg-gray-50 flex items-center justify-center p-4 sm:p-8 lg:p-20 relative">
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name} 
                    className="w-48 sm:w-full max-w-sm aspect-square object-contain animate-float"
                    referrerPolicy="no-referrer"
                    width="400"
                    height="400"
                  />
                </div>
                
                <div className="p-5 sm:p-8 lg:p-16 space-y-4 sm:space-y-8 flex flex-col justify-center">
                  <div className="space-y-2 sm:space-y-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="text-[10px] sm:text-xs text-brand-orange font-black uppercase tracking-widest">{selectedProduct.brand}</span>
                      <div className="h-3 w-px bg-gray-200" />
                      <span className="text-gray-400 font-bold text-[10px] sm:text-xs">{selectedProduct.category}</span>
                    </div>
                    <h2 className="text-xl sm:text-3xl font-black text-gray-900 leading-tight">{selectedProduct.name}</h2>
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="flex items-center gap-1 text-yellow-500 font-black text-sm sm:text-base">
                        <span>{selectedProduct.rating}</span>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${i < Math.floor(selectedProduct.rating) ? 'bg-yellow-500' : 'bg-gray-200'}`} />
                          ))}
                        </div>
                      </div>
                      <span className="text-gray-400 text-[10px] sm:text-xs font-bold">{selectedProduct.reviewsCount} دیدگاه کاربران</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed font-medium text-xs sm:text-base line-clamp-4 lg:line-clamp-none">
                    {selectedProduct.description}
                  </p>
                  
                  <div className="pt-3 sm:pt-4 border-t border-gray-100 space-y-4 sm:space-y-6">
                    <div className="flex items-center justify-between">
                       <span className="text-gray-500 font-bold text-xs sm:text-base">قیمت کالا:</span>
                       <div className="flex flex-col items-end">
                          {selectedProduct.discountPrice ? (
                            <>
                              <span className="text-[10px] sm:text-sm text-gray-400 line-through decoration-red-300 font-bold">{toPersianDigits(selectedProduct.price)} تومان</span>
                              <span className="text-xl sm:text-3xl font-black text-gray-900">{toPersianDigits(selectedProduct.discountPrice)} <span className="text-[10px] sm:text-sm font-bold opacity-50">تومان</span></span>
                            </>
                          ) : (
                            <span className="text-xl sm:text-3xl font-black text-gray-900">{toPersianDigits(selectedProduct.price)} <span className="text-[10px] sm:text-sm font-bold opacity-50">تومان</span></span>
                          )}
                       </div>
                    </div>
                    
                    <div className="flex gap-3 sm:gap-4">
                      <button 
                        onClick={(e) => {
                          handleAddToCart(e, selectedProduct);
                          setSelectedProduct(null);
                        }}
                        className="flex-1 btn-primary py-3 sm:py-5 rounded-xl sm:rounded-[20px] text-sm sm:text-lg flex items-center justify-center gap-2 sm:gap-3"
                      >
                        <ShoppingCart size={18} className="sm:w-6 sm:h-6" />
                        افزودن به سبد خرید
                      </button>
                      <button className="p-3 sm:p-5 border border-gray-200 rounded-xl sm:rounded-[20px] hover:bg-gray-50 transition-colors">
                        <Heart size={18} className="text-gray-400 sm:w-6 sm:h-6" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[120] p-8 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-orange rounded-xl flex items-center justify-center text-white">
                    <ShoppingCart size={22} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black">سبد خرید شما</h3>
                    <span className="text-xs text-gray-400 font-bold">{cartCount} محصول انتخاب شده</span>
                  </div>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-6 -mx-2 px-2">
                {cartCount === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                      <ShoppingCart size={64} />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-lg font-bold text-gray-900">سبد خرید شما خالی است</h4>
                      <p className="text-sm text-gray-400 font-medium">محصولات مورد نظرتان را به سبد خرید اضافه کنید</p>
                    </div>
                    <button onClick={() => setIsCartOpen(false)} className="btn-primary">مشاهده فروشگاه</button>
                  </div>
                ) : (
                      <div className="space-y-4 animate-in slide-in-from-right duration-500">
                         {/* Mock items based on some products */}
                         {PRODUCTS.slice(0, 2).map((p, i) => (
                           <div key={i} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
                              <div className="w-20 h-20 bg-white rounded-xl overflow-hidden shadow-sm shrink-0">
                                <img src={p.image} className="w-full h-full object-cover" alt={p.name} referrerPolicy="no-referrer" loading="lazy" width="80" height="80" />
                              </div>
                              <div className="flex-1 space-y-2">
                                 <h4 className="text-sm font-bold line-clamp-1">{p.name}</h4>
                             <div className="flex items-center justify-between">
                                <span className="text-sm font-black">{p.price.toLocaleString()} تومان</span>
                                <div className="flex items-center gap-3 bg-white px-3 py-1 rounded-lg border border-gray-200">
                                   <button className="text-gray-400 hover:text-brand-orange">+</button>
                                   <span className="text-xs font-bold">۱</span>
                                   <button className="text-gray-400 hover:text-brand-orange">-</button>
                                </div>
                             </div>
                          </div>
                          <button className="self-start text-gray-300 hover:text-red-500 transition-colors">
                             <X size={18} />
                          </button>
                       </div>
                     ))}
                  </div>
                )}
              </div>
              
              {cartCount > 0 && (
                <div className="pt-8 border-t border-gray-100 space-y-6">
                  <div className="flex items-center justify-between text-lg">
                    <span className="text-gray-500 font-bold">مجموع مبلغ:</span>
                    <span className="text-2xl font-black text-gray-900">۳,۴۵۰,۰۰۰ <span className="text-sm font-bold opacity-50">تومان</span></span>
                  </div>
                  <button className="w-full btn-primary py-5 rounded-[20px] text-lg">تایید و مرحله بعد</button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Admin Passcode Modal */}
      <AnimatePresence>
        {showAdminLoginModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAdminLoginModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            {/* Dialog Container */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-sm bg-slate-900 border border-slate-800 text-slate-100 rounded-[36px] overflow-hidden shadow-2xl p-8 text-right font-sans rtl" dir="rtl"
            >
              {/* Premium Top Line Accent */}
              <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-brand-orange via-amber-500 to-yellow-400" />
              
              <button 
                onClick={() => setShowAdminLoginModal(false)}
                className="absolute top-6 left-6 w-9 h-9 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>

              <div className="space-y-6 pt-4">
                <div className="w-16 h-16 bg-brand-orange/10 text-brand-orange rounded-3xl flex items-center justify-center mx-auto text-3xl shadow-lg border border-brand-orange/20">
                  🛡️
                </div>

                <div className="text-center space-y-2">
                  <h3 className="font-sans font-black text-xl text-slate-100">احراز هویت مدیریت پت‌وان</h3>
                  <p className="text-xs font-bold text-slate-400">برای اعطای دسترسی مدیریت، لطفاً رمز امنیتی را وارد کنید.</p>
                </div>

                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const trimmed = adminPasscode.trim();
                    if (trimmed === 'admin' || trimmed === '1405' || trimmed === '1234') {
                      localStorage.setItem('petone_is_admin', 'true');
                      setIsAdmin(true);
                      setShowAdminLoginModal(false);
                      setView('admin');
                      setAdminPasscode('');
                      setAdminLoginError('');
                    } else {
                      setAdminLoginError('رمز وارد شده صحیح نمی‌باشد. دوباره تلاش کنید.');
                    }
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 block mr-1">رمز ورود مدیریت</label>
                    <input 
                      type="password"
                      value={adminPasscode}
                      onChange={(e) => setAdminPasscode(e.target.value)}
                      placeholder="••••••••"
                      autoFocus
                      className="w-full bg-slate-950/70 border-2 border-slate-800 focus:border-brand-orange rounded-2xl py-3.5 px-4 text-center font-mono text-lg tracking-widest text-white outline-none transition-all placeholder:text-slate-700"
                    />
                  </div>

                  {adminLoginError && (
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3.5 rounded-xl text-xs font-bold text-center"
                    >
                      {adminLoginError}
                    </motion.div>
                  )}

                  <button 
                    type="submit"
                    className="w-full bg-brand-orange hover:bg-orange-600 text-white text-xs font-black py-4 rounded-2xl transition-all shadow-lg shadow-brand-orange/20 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>بررسی رمز و ورود به پنل</span>
                  </button>
                </form>

                <div className="bg-slate-950/40 border border-slate-850 p-4 rounded-2xl text-center">
                  <span className="text-[11px] font-bold text-slate-500 leading-normal block">
                    💡 جهت تست سریع برنامه، می‌توانید از رمز <code className="font-mono text-brand-orange font-bold text-xs bg-slate-900 px-1.5 py-0.5 rounded">1405</code> یا <code className="font-mono text-brand-orange font-bold text-xs bg-slate-900 px-1.5 py-0.5 rounded">admin</code> استفاده نمایید.
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Chatbot Bubble */}
      <div className="fixed bottom-6 left-6 z-[150]">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20, transformOrigin: 'bottom left' }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="absolute bottom-16 left-0 w-[320px] sm:w-[380px] bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col"
            >
              <div className="bg-brand-orange p-5 text-white text-right">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-0.5 shadow-sm">
                      <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" className="text-brand-orange">
                        {/* Background subtle glow */}
                        <circle cx="50" cy="50" r="45" fill="currentColor" opacity="0.08" />
                        
                        {/* Elegant Illustrator-style Ears */}
                        <path d="M 28 32 C 20 18, 12 12, 12 12 C 12 12, 22 24, 28 32 Z" fill="currentColor" />
                        <path d="M 28 32 C 22 22, 17 18, 17 18 C 17 18, 23 26, 28 32 Z" fill="#FFEDD5" opacity="0.9" />
                        
                        <path d="M 72 32 C 80 18, 88 12, 88 12 C 88 12, 78 24, 72 32 Z" fill="currentColor" />
                        <path d="M 72 32 C 78 22, 83 18, 83 18 C 83 18, 77 26, 72 32 Z" fill="#FFEDD5" opacity="0.9" />

                        {/* Interactive Spark Antenna */}
                        <circle cx="50" cy="18" r="4.5" fill="currentColor" />
                        <line x1="50" y1="18" x2="50" y2="28" stroke="currentColor" strokeWidth="3" />

                        {/* High-quality Vector Head */}
                        <rect x="22" y="26" width="56" height="48" rx="24" fill="white" stroke="currentColor" strokeWidth="3.5" />
                        
                        {/* UI Visor Layer */}
                        <rect x="29" y="37" width="42" height="24" rx="12" fill="#1E293B" />
                        
                        {/* Friendly Glowing LED Eyes */}
                        <circle cx="41" cy="49" r="4" fill="currentColor" />
                        <circle cx="41" cy="47" r="1.5" fill="white" />
                        
                        <circle cx="59" cy="49" r="4" fill="currentColor" />
                        <circle cx="59" cy="47" r="1.5" fill="white" />
                        
                        {/* Soft Blush */}
                        <circle cx="34" cy="54" r="2" fill="#F43F5E" opacity="0.55" />
                        <circle cx="66" cy="54" r="2" fill="#F43F5E" opacity="0.55" />

                        {/* Smiling mouth */}
                        <path d="M 46 53 Q 50 57, 54 53" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div className="text-right">
                      <h4 className="font-black text-xs">مشاوره آنلاین پِت‌وان</h4>
                      <div className="flex items-center gap-1.5 opacity-80 justify-end">
                        <span className="text-[9px] font-bold">پاسخگوی سوالات شما هستیم</span>
                        <span className="w-1 h-1 bg-green-400 rounded-full animate-pulse" />
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <X size={18} />
                  </button>
                </div>
              </div>
              <div className="h-72 p-5 overflow-y-auto bg-slate-50 space-y-4">
                <div className="bg-white p-4 rounded-2xl rounded-tr-none shadow-sm text-xs font-bold text-slate-700 border border-slate-100 max-w-[85%] text-right mr-auto leading-relaxed">
                  سلام! من دستیار هوشمند پِت‌وان هستم. چطور می‌تونم به شما و پت دلبندتون کمک کنم؟ 🐾
                </div>
              </div>
              <div className="p-4 border-t border-slate-100 bg-white">
                <div className="flex items-center gap-2 bg-slate-100 rounded-2xl px-4 py-2">
                  <input 
                    type="text" 
                    placeholder="سوال خود را بپرسید..." 
                    className="flex-1 bg-transparent border-none text-xs font-bold focus:ring-0 text-right outline-none"
                  />
                  <button className="text-brand-orange hover:scale-110 transition-transform">
                    <ArrowLeft size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-14 h-14 bg-brand-orange text-white rounded-[20px] shadow-2xl shadow-brand-orange/40 flex items-center justify-center group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          {isChatOpen ? (
            <X size={24} />
          ) : (
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-0.5 shadow-sm">
              <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" className="text-brand-orange">
                {/* Background subtle glow */}
                <circle cx="50" cy="50" r="45" fill="currentColor" opacity="0.08" />
                
                {/* Elegant Illustrator-style Ears */}
                <path d="M 28 32 C 20 18, 12 12, 12 12 C 12 12, 22 24, 28 32 Z" fill="currentColor" />
                <path d="M 28 32 C 22 22, 17 18, 17 18 C 17 18, 23 26, 28 32 Z" fill="#FFEDD5" opacity="0.9" />
                
                <path d="M 72 32 C 80 18, 88 12, 88 12 C 88 12, 78 24, 72 32 Z" fill="currentColor" />
                <path d="M 72 32 C 78 22, 83 18, 83 18 C 83 18, 77 26, 72 32 Z" fill="#FFEDD5" opacity="0.9" />

                {/* Interactive Spark Antenna */}
                <circle cx="50" cy="18" r="4.5" fill="currentColor" />
                <line x1="50" y1="18" x2="50" y2="28" stroke="currentColor" strokeWidth="3" />

                {/* High-quality Vector Head */}
                <rect x="22" y="26" width="56" height="48" rx="24" fill="white" stroke="currentColor" strokeWidth="3.5" />
                
                {/* UI Visor Layer */}
                <rect x="29" y="37" width="42" height="24" rx="12" fill="#1E293B" />
                
                {/* Friendly Glowing LED Eyes */}
                <circle cx="41" cy="49" r="4" fill="currentColor" />
                <circle cx="41" cy="47" r="1.5" fill="white" />
                
                <circle cx="59" cy="49" r="4" fill="currentColor" />
                <circle cx="59" cy="47" r="1.5" fill="white" />
                
                {/* Soft Blush */}
                <circle cx="34" cy="54" r="2" fill="#F43F5E" opacity="0.55" />
                <circle cx="66" cy="54" r="2" fill="#F43F5E" opacity="0.55" />

                {/* Smiling mouth */}
                <path d="M 46 53 Q 50 57, 54 53" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          )}
        </motion.button>
      </div>
    </div>
  );
  } catch (err: any) {
    setError(err.message || String(err));
    return null;
  }
}
