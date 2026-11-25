import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  ChevronDown,
  Clock,
  Heart,
  LayoutGrid,
  MapPin,
  Menu,
  Moon,
  Phone,
  Search,
  ShoppingBasket,
  ShoppingCart,
  Sun,
  Truck,
  X,
  Zap,
} from 'lucide-react'
import { categories } from '../data/categories'
import { products } from '../data/products'
import { useLanguage, useStore, useTheme } from '../context/contexts'

export default function Header() {
  const { lang, setLang, t, localize, formatPrice } = useLanguage()
  const { isDark, toggleTheme } = useTheme()
  const { cartCount, cartSubtotal, wishlistCount, setQuickViewProduct } = useStore()
  const navigate = useNavigate()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [catMenuOpen, setCatMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const searchRef = useRef(null)
  const catMenuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
      if (catMenuRef.current && !catMenuRef.current.contains(e.target)) {
        setCatMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const trimmedQuery = searchTerm.trim().toLowerCase()
  const liveMatches = trimmedQuery
    ? products
        .filter((p) => {
          const matchesCat = selectedCategory === 'all' || p.categoryId === selectedCategory
          const haystack = `${p.name.uz} ${p.name.ru} ${p.description.uz} ${p.description.ru}`.toLowerCase()
          return matchesCat && haystack.includes(trimmedQuery)
        })
        .slice(0, 5)
    : []

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchTerm.trim()) params.set('q', searchTerm.trim())
    if (selectedCategory !== 'all') params.set('category', selectedCategory)
    setShowSuggestions(false)
    setMobileMenuOpen(false)
    navigate(`/products${params.toString() ? `?${params.toString()}` : ''}`)
  }

  const navItems = [
    { to: '/', label: t.nav.home, end: true },
    { to: '/products', label: t.nav.products },
    { to: '/about', label: t.nav.about },
    { to: '/contact', label: t.nav.contact },
    { to: '/wishlist', label: t.nav.wishlist },
    { to: '/cart', label: t.nav.cart },
  ]

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#111b15]/95 backdrop-blur-md border-b border-[#e4ece0] dark:border-[#213328] transition-colors">
      {/* Top Utility Bar */}
      <div className="hidden md:block bg-[#f4f8f1] dark:bg-[#0c140f] border-b border-[#e4ece0] dark:border-[#1e2f24] text-xs text-[#4a5d4e] dark:text-[#9cb3a1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-9 flex items-center justify-between gap-4">
          <div className="flex items-center gap-5 truncate">
            <span className="inline-flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-[#2e7d32] dark:text-[#4ade80] shrink-0" />
              <span className="truncate">{t.topbar.address}</span>
            </span>
            <span className="hidden lg:inline-flex items-center gap-1.5 text-[#2e7d32] dark:text-[#4ade80] font-medium shrink-0">
              <Truck className="w-3.5 h-3.5 shrink-0" />
              <span>{t.topbar.freeDelivery}</span>
            </span>
          </div>

          <div className="flex items-center gap-5 shrink-0">
            <a
              href="tel:+998712004578"
              className="inline-flex items-center gap-1.5 hover:text-[#1b5e20] dark:hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#2e7d32] dark:text-[#4ade80]" />
              <span>+998 (71) 200-45-78</span>
            </a>
            <span className="hidden xl:inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#2e7d32] dark:text-[#4ade80]" />
              <span>{t.topbar.hours}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3 sm:gap-5">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#2e7d32] to-[#1b5e20] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <ShoppingBasket className="w-6 h-6" />
          </div>
          <div className="leading-tight">
            <span className="block text-xl sm:text-2xl font-extrabold tracking-tight text-[#163619] dark:text-white font-display">
              Fresh<span className="text-[#2e7d32] dark:text-[#4ade80]">Bozor</span>
            </span>
            <span className="hidden sm:block text-[11px] font-medium text-[#5a705e] dark:text-[#96ad9b]">
              {t.brand.tagline}
            </span>
          </div>
        </Link>

        {/* Desktop Search Bar */}
        <div ref={searchRef} className="hidden lg:block flex-1 max-w-2xl relative">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-stretch h-11 rounded-xl focus-within:ring-2 focus-within:ring-[#2e7d32]/30 transition-all"
          >
            <div className="flex-1 flex items-center min-w-0 bg-[#f6f9f4] dark:bg-[#19281f] border border-r-0 border-[#dce6d7] dark:border-[#2a3f31] rounded-l-xl">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setShowSuggestions(true)
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder={t.nav.searchPlaceholder}
                aria-label={t.nav.searchPlaceholder}
                className="flex-1 min-w-0 h-full bg-transparent px-4 text-sm text-[#162219] dark:text-white placeholder:text-[#718574] dark:placeholder:text-[#7f9785] focus:outline-none"
              />
              <div className="h-6 w-px bg-[#dce6d7] dark:bg-[#2a3f31] shrink-0" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label={t.nav.allCategories}
                className="h-full bg-transparent pl-3 pr-2.5 text-xs font-medium text-[#3c5040] dark:text-[#c7d9cb] focus:outline-none cursor-pointer max-w-[175px] truncate"
              >
                <option value="all" className="dark:bg-[#19281f]">
                  {t.nav.allCategories}
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id} className="dark:bg-[#19281f]">
                    {localize(cat.name)}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              aria-label={t.nav.searchBtn}
              className="bg-[#236927] hover:bg-[#1b5e20] text-white px-5 rounded-r-xl flex items-center justify-center shrink-0 transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Live Search Suggestions */}
          {showSuggestions && trimmedQuery.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-[#16231b] rounded-2xl shadow-xl border border-[#e2ebe0] dark:border-[#283d30] overflow-hidden z-50">
              {liveMatches.length > 0 ? (
                <>
                  <div className="divide-y divide-[#eef3eb] dark:divide-[#23362a]">
                    {liveMatches.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setShowSuggestions(false)
                          setQuickViewProduct(item)
                        }}
                        className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-[#f4f9f1] dark:hover:bg-[#1d2f24] text-left transition-colors cursor-pointer"
                      >
                        <img
                          src={item.image}
                          alt={localize(item.name)}
                          className="w-11 h-11 rounded-lg object-cover bg-white shrink-0 border border-[#e7efe4] dark:border-[#293d30]"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#162219] dark:text-white truncate">
                            {localize(item.name)}
                          </p>
                          <p className="text-xs text-[#647868] dark:text-[#96ad9b]">
                            {localize(item.unit)}
                          </p>
                        </div>
                        <span className="text-sm font-bold text-[#236927] dark:text-[#4ade80] shrink-0">
                          {formatPrice(item.price)}
                        </span>
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleSearchSubmit}
                    className="w-full py-2.5 px-4 text-xs font-semibold text-center text-[#236927] dark:text-[#4ade80] bg-[#f4f8f1] dark:bg-[#121d16] hover:underline cursor-pointer"
                  >
                    {t.nav.viewAllResults} →
                  </button>
                </>
              ) : (
                <div className="p-4 text-center text-sm text-[#647868] dark:text-[#96ad9b]">
                  {t.nav.noSearchResults}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Controls: Language, Theme, Wishlist, Cart */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Language Toggle UZ / RU */}
          <div
            className="inline-flex items-center rounded-xl bg-[#f1f6ee] dark:bg-[#1a2920] p-1 border border-[#dfe9db] dark:border-[#293e31]"
            role="group"
            aria-label="Language switcher"
          >
            <button
              type="button"
              onClick={() => setLang('uz')}
              className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                lang === 'uz'
                  ? 'bg-[#236927] text-white shadow-xs'
                  : 'text-[#485d4c] dark:text-[#9cb3a1] hover:text-[#162219] dark:hover:text-white'
              }`}
            >
              UZ
            </button>
            <button
              type="button"
              onClick={() => setLang('ru')}
              className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                lang === 'ru'
                  ? 'bg-[#236927] text-white shadow-xs'
                  : 'text-[#485d4c] dark:text-[#9cb3a1] hover:text-[#162219] dark:hover:text-white'
              }`}
            >
              RU
            </button>
          </div>

          {/* Theme Toggle (Light / Dark) */}
          <button
            type="button"
            onClick={toggleTheme}
            title={isDark ? t.nav.lightMode : t.nav.darkMode}
            aria-label={isDark ? t.nav.lightMode : t.nav.darkMode}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#f1f6ee] dark:bg-[#1a2920] border border-[#dfe9db] dark:border-[#293e31] flex items-center justify-center text-[#2c4630] dark:text-[#fde047] hover:bg-[#e5efe0] dark:hover:bg-[#23362b] transition-colors cursor-pointer"
          >
            {isDark ? <Sun className="w-4 h-4 sm:w-[18px] sm:h-[18px]" /> : <Moon className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />}
          </button>

          {/* Wishlist Link */}
          <Link
            to="/wishlist"
            aria-label={t.nav.wishlist}
            className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#f1f6ee] dark:bg-[#1a2920] border border-[#dfe9db] dark:border-[#293e31] flex items-center justify-center text-[#2c4630] dark:text-[#d1e0d5] hover:bg-[#e5efe0] dark:hover:bg-[#23362b] transition-colors"
          >
            <Heart className={`w-4 h-4 sm:w-[18px] sm:h-[18px] ${wishlistCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[19px] h-[19px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Button */}
          <Link
            to="/cart"
            className="relative flex items-center gap-2.5 pl-2.5 pr-3 py-1.5 sm:py-2 rounded-xl bg-[#236927] hover:bg-[#1b5e20] text-white transition-colors shadow-xs"
          >
            <div className="relative">
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-[#86efac] text-[#113314] text-[10px] font-extrabold flex items-center justify-center">
                {cartCount}
              </span>
            </div>
            <div className="hidden sm:block text-left leading-tight pl-0.5">
              <span className="block text-[10px] text-emerald-100/90 font-medium">{t.nav.cart}</span>
              <span className="block text-xs font-bold whitespace-nowrap">{formatPrice(cartSubtotal)}</span>
            </div>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Menu"
            className="lg:hidden w-9 h-9 rounded-xl bg-[#f1f6ee] dark:bg-[#1a2920] border border-[#dfe9db] dark:border-[#293e31] flex items-center justify-center text-[#162219] dark:text-white cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Desktop Navigation Strip */}
      <div className="hidden lg:block border-t border-[#e9f0e5] dark:border-[#1e2f24] bg-white dark:bg-[#111b15]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            {/* Categories Dropdown */}
            <div ref={catMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setCatMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1d5421] hover:bg-[#164219] text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                <LayoutGrid className="w-4 h-4" />
                <span>{t.nav.categoriesBtn}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${catMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {catMenuOpen && (
                <div className="absolute left-0 top-full mt-2 w-72 bg-white dark:bg-[#16231b] rounded-2xl shadow-xl border border-[#e2ebe0] dark:border-[#283d30] p-2 z-50">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/products?category=${cat.id}`}
                      onClick={() => setCatMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#f2f8ef] dark:hover:bg-[#1e3125] transition-colors"
                    >
                      <img
                        src={cat.image}
                        alt={localize(cat.name)}
                        className="w-9 h-9 rounded-full object-cover border border-[#dfe9db] dark:border-[#2c4234]"
                      />
                      <span className="flex-1 text-sm font-medium text-[#1b2b1e] dark:text-[#e6f0e8]">
                        {localize(cat.name)}
                      </span>
                      <span className="text-xs font-semibold text-[#5a705e] dark:text-[#8ea694]">
                        {cat.count}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Primary Nav Links */}
            <nav className="flex items-center gap-1" aria-label="Main Navigation">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      isActive
                        ? 'text-[#1b5e20] dark:text-[#4ade80] bg-[#eef6ea] dark:bg-[#1c3123]'
                        : 'text-[#324436] dark:text-[#c7d9cb] hover:text-[#1b5e20] dark:hover:text-white hover:bg-[#f5f9f2] dark:hover:bg-[#19281f]'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Weekly Deals Pill */}
          <Link
            to="/products?deals=1"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#eef7e9] dark:bg-[#1d3424] text-[#1f6223] dark:text-[#4ade80] border border-[#d6ead0] dark:border-[#294a34] text-xs font-bold hover:bg-[#e1f1d9] dark:hover:bg-[#24412d] transition-colors"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>{t.nav.dealsBadge}</span>
          </Link>
        </div>
      </div>

      {/* Mobile Drawer + Mobile Search */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#e4ece0] dark:border-[#213328] bg-white dark:bg-[#111b15] px-4 py-4 space-y-4">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-stretch h-11 rounded-xl"
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.nav.searchPlaceholder}
              className="flex-1 min-w-0 bg-[#f6f9f4] dark:bg-[#19281f] border border-r-0 border-[#dce6d7] dark:border-[#2a3f31] rounded-l-xl px-3.5 text-sm text-[#162219] dark:text-white focus:outline-none"
            />
            <button
              type="submit"
              aria-label={t.nav.searchBtn}
              className="bg-[#236927] hover:bg-[#1b5e20] text-white px-4 rounded-r-xl flex items-center justify-center shrink-0 transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          <nav className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3.5 py-2.5 rounded-xl text-sm font-semibold text-center border transition-colors ${
                    isActive
                      ? 'bg-[#236927] text-white border-[#236927]'
                      : 'bg-[#f6f9f4] dark:bg-[#18261d] text-[#28392b] dark:text-[#d1e0d5] border-[#e2ebe0] dark:border-[#263a2d]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="pt-2 border-t border-[#e8efe5] dark:border-[#203227] flex items-center justify-between text-xs text-[#546858] dark:text-[#96ad9b]">
            <span className="inline-flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#2e7d32] dark:text-[#4ade80]" />
              +998 (71) 200-45-78
            </span>
            <Link
              to="/products?deals=1"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center gap-1 font-bold text-[#236927] dark:text-[#4ade80]"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              {t.nav.dealsBadge}
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
