import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Award,
  BadgePercent,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Leaf,
  RefreshCw,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Star,
  Tag,
  Truck,
  Wallet,
} from 'lucide-react'
import { categories } from '../data/categories'
import { products } from '../data/products'
import { reviews } from '../data/reviews'
import { useLanguage } from '../context/contexts'
import ProductCard from '../components/ProductCard'

export default function HomePage() {
  const { t, localize } = useLanguage()
  const catScrollRef = useRef(null)
  const [reviewIdx, setReviewIdx] = useState(0)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const topProducts = products.filter((p) => p.isTop).slice(0, 8)

  const scrollCategories = (dir) => {
    if (!catScrollRef.current) return
    catScrollRef.current.scrollBy({ left: dir * 280, behavior: 'smooth' })
  }

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubscribed(true)
    setEmail('')
  }

  const activeReview = reviews[reviewIdx]
  const nextReview = () => setReviewIdx((i) => (i + 1) % reviews.length)
  const prevReview = () => setReviewIdx((i) => (i - 1 + reviews.length) % reviews.length)

  return (
    <div id="top" className="pb-12">
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden bg-[#f2f6ee] dark:bg-[#111f16] border-b border-[#e3ece0] dark:border-[#1e3125]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-10 lg:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Hero Copy */}
            <div className="lg:col-span-6 space-y-5 relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/85 dark:bg-[#1a2e22] border border-[#d6e5d0] dark:border-[#2a4534] text-[#236927] dark:text-[#6ee787] text-xs font-extrabold tracking-wider uppercase shadow-2xs">
                <Leaf className="w-3.5 h-3.5" />
                <span>{t.hero.eyebrow}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight leading-[1.08] text-[#142217] dark:text-white">
                {t.hero.titleLine1}
                <br />
                <span className="text-[#2e7d32] dark:text-[#4ade80]">{t.hero.titleLine2}</span>
              </h1>

              <p className="text-base sm:text-lg text-[#4b5f4f] dark:text-[#b4c8b9] max-w-xl leading-relaxed">
                {t.hero.subtitle}
              </p>

              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#236927] hover:bg-[#1b5e20] text-white font-bold text-sm sm:text-base shadow-md shadow-[#236927]/20 transition-all hover:-translate-y-0.5"
                >
                  <span>{t.hero.ctaShop}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/products?deals=1"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white dark:bg-[#1a2b21] border border-[#cddcc8] dark:border-[#2c4535] text-[#19331c] dark:text-white hover:border-[#2e7d32] dark:hover:border-[#4ade80] font-bold text-sm sm:text-base transition-colors"
                >
                  <span>{t.hero.ctaDeals}</span>
                </Link>
              </div>
            </div>

            {/* Hero Visual & Discount Badge */}
            <div className="lg:col-span-6 relative">
              {/* Floating Discount Badge */}
              <div className="hidden sm:flex absolute -top-2 left-2 lg:-left-6 z-20 w-24 h-24 rounded-full bg-[#1d5821] text-white flex-col items-center justify-center shadow-xl border-4 border-[#f2f6ee] dark:border-[#111f16] -rotate-6">
                <span className="text-[10px] font-bold tracking-widest opacity-90">
                  {t.hero.discountTop}
                </span>
                <span className="text-2xl font-extrabold leading-none">{t.hero.discountPercent}</span>
                <span className="text-[10px] font-bold tracking-wider text-[#86efac]">
                  {t.hero.discountLabel}
                </span>
              </div>

              <div className="relative rounded-3xl overflow-hidden shadow-lg dark:shadow-black/40 border border-[#e3ece0] dark:border-[#24392b] bg-[#f2f6ee]">
                <img
                  src="/images/hero-basket.jpg"
                  alt={t.hero.titleLine1}
                  className="w-full h-[270px] sm:h-[340px] lg:h-[390px] object-cover object-right"
                />
                <div className="hidden dark:block absolute inset-0 bg-gradient-to-tr from-[#0d1510]/35 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Trust Badges Strip */}
          <div className="mt-8 lg:mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 bg-white/90 dark:bg-[#16241b]/95 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-[#e2ebe0] dark:border-[#253a2d] shadow-xs">
            {[
              { icon: Leaf, title: t.hero.trust1Title, sub: t.hero.trust1Sub },
              { icon: Truck, title: t.hero.trust2Title, sub: t.hero.trust2Sub },
              { icon: ShieldCheck, title: t.hero.trust3Title, sub: t.hero.trust3Sub },
              { icon: RefreshCw, title: t.hero.trust4Title, sub: t.hero.trust4Sub },
            ].map((item, idx) => {
              const Icon = item.icon
              return (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#eef6ea] dark:bg-[#1f3426] text-[#236927] dark:text-[#4ade80] flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-[#152418] dark:text-white truncate">
                      {item.title}
                    </p>
                    <p className="text-[11px] sm:text-xs text-[#647868] dark:text-[#96ad9b] truncate">
                      {item.sub}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES SECTION — Single horizontal row, circular shape, background image */}
      <section className="relative overflow-hidden py-12 sm:py-14 border-b border-[#e5ede2] dark:border-[#1e2f24]">
        {/* Section Background Photo with soft scrim */}
        <img
          src="/images/categories-bg.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-55 dark:opacity-15 pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-[#f6f8f4]/80 via-[#f6f8f4]/65 to-[#f6f8f4]/85 dark:from-[#0d1510]/90 dark:via-[#0d1510]/85 dark:to-[#0d1510]/95 pointer-events-none"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-extrabold tracking-widest uppercase text-[#236927] dark:text-[#4ade80]">
                {t.categoriesSection.eyebrow}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142217] dark:text-white mt-1">
                {t.categoriesSection.title}
              </h2>
              <p className="text-sm text-[#546858] dark:text-[#9cb3a1] mt-1">
                {t.categoriesSection.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => scrollCategories(-1)}
                aria-label={t.categoriesSection.scrollLeft}
                className="w-9 h-9 rounded-full bg-white dark:bg-[#1a2b20] border border-[#dce6d7] dark:border-[#2a3f32] text-[#234027] dark:text-white flex items-center justify-center hover:bg-[#236927] hover:text-white transition-colors shadow-xs cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollCategories(1)}
                aria-label={t.categoriesSection.scrollRight}
                className="w-9 h-9 rounded-full bg-white dark:bg-[#1a2b20] border border-[#dce6d7] dark:border-[#2a3f32] text-[#234027] dark:text-white flex items-center justify-center hover:bg-[#236927] hover:text-white transition-colors shadow-xs cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Single Horizontal Row of Circular Categories with Image Background */}
          <div
            ref={catScrollRef}
            className="flex flex-nowrap items-center justify-start xl:justify-between gap-4 sm:gap-5 overflow-x-auto no-scrollbar py-2 px-1"
          >
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.id}`}
                className="group relative shrink-0 w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden shadow-md hover:shadow-xl ring-4 ring-white/95 dark:ring-[#1e3326] hover:ring-[#2e7d32] dark:hover:ring-[#4ade80] transition-all duration-300 hover:-translate-y-1 flex items-end justify-center text-center"
              >
                {/* Full-bleed Background Image inside the circle */}
                <img
                  src={cat.image}
                  alt={localize(cat.name)}
                  className="absolute inset-0 w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-500"
                />
                {/* Rich scrim for guaranteed text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10 group-hover:from-[#164b19]/90 group-hover:via-[#164b19]/45 transition-colors" />

                <div className="relative z-10 px-3 pb-3.5 pt-2 w-full">
                  <span className="block text-xs sm:text-[13px] font-extrabold text-white leading-tight drop-shadow-sm line-clamp-2">
                    {localize(cat.shortName)}
                  </span>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-[10px] font-semibold text-emerald-100">
                    {cat.count} {t.categoriesSection.itemsSuffix}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. DUAL PROMO BANNERS (Weekend Saver + 30-Min Express Card) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Dark Forest Promo Banner */}
          <div className="lg:col-span-8 relative rounded-3xl overflow-hidden bg-[#133b18] text-white min-h-[240px] sm:min-h-[260px] flex items-center shadow-md">
            <img
              src="/images/promo-veggies.jpg"
              alt={t.promo.leftTitle}
              className="absolute inset-0 w-full h-full object-cover object-right"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0d2d11] via-[#123817]/90 to-[#123817]/20" />

            <div className="relative z-10 p-6 sm:p-9 max-w-md space-y-3">
              <span className="inline-block px-3 py-1 rounded-full bg-white/15 text-[#a7f3d0] text-[11px] font-extrabold tracking-widest uppercase">
                {t.promo.leftBadge}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                {t.promo.leftTitle}
                <span className="block text-[#86efac]">{t.promo.leftHighlight}</span>
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/85 leading-relaxed">
                {t.promo.leftDesc}
              </p>
              <div className="pt-1 flex items-center gap-4">
                <Link
                  to="/products?deals=1"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4ade80] hover:bg-[#22c55e] text-[#0c290f] font-extrabold text-sm transition-colors"
                >
                  <span>{t.promo.leftBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="hidden sm:flex w-16 h-16 rounded-full bg-amber-400 text-[#132915] flex-col items-center justify-center font-extrabold shadow-lg -rotate-6">
                  <span className="text-lg leading-none">30%</span>
                  <span className="text-[9px] tracking-wider">{t.promo.leftBadgeLabel}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right 30-Minute Delivery Highlight Card */}
          <div className="lg:col-span-4 relative rounded-3xl overflow-hidden bg-[#ebf4e5] dark:bg-[#17281e] border border-[#dce8d5] dark:border-[#273f30] p-6 flex flex-col justify-between min-h-[240px] shadow-xs">
            <div className="relative z-10 max-w-[62%] space-y-2.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#236927] text-white text-[11px] font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>30 min</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#142217] dark:text-white leading-snug">
                {t.promo.rightTitle}
              </h3>
              <p className="text-xs text-[#4b604f] dark:text-[#a8bfae] leading-relaxed">
                {t.promo.rightDesc}
              </p>
              <div className="pt-2">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#236927] hover:bg-[#1b5e20] text-white text-xs font-bold transition-colors"
                >
                  <span>{t.promo.rightBtn}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <img
              src="/images/delivery-courier.jpg"
              alt={t.promo.rightTitle}
              className="absolute right-0 bottom-0 w-[48%] h-[82%] object-cover object-center rounded-tl-3xl"
            />
          </div>
        </div>
      </section>

      {/* 4. TOP 8 PRODUCTS + ALL PRODUCTS LINK BUTTON */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-14">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
          <div>
            <span className="text-xs font-extrabold tracking-widest uppercase text-[#236927] dark:text-[#4ade80]">
              {t.topProducts.eyebrow}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142217] dark:text-white mt-1">
              {t.topProducts.title}
            </h2>
            <p className="text-sm text-[#546858] dark:text-[#9cb3a1] mt-1">
              {t.topProducts.subtitle}
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#236927] dark:text-[#4ade80] hover:underline shrink-0"
          >
            <span>{t.topProducts.viewAllBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {topProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Prominent Link Button to All Products Page */}
        <div className="mt-9 text-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-[#236927] hover:bg-[#1b5e20] text-white font-bold text-base shadow-lg shadow-[#236927]/20 transition-all hover:-translate-y-0.5"
          >
            <span>
              {t.topProducts.viewAllBtn} ({products.length})
            </span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* 5. DELIVERY SERVICE DETAILS & WHY CHOOSE US */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-16">
        <div className="rounded-3xl bg-white dark:bg-[#142018] border border-[#e2ebe0] dark:border-[#23372a] p-6 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold tracking-widest uppercase text-[#236927] dark:text-[#4ade80]">
                <Truck className="w-4 h-4" />
                {t.deliverySection.eyebrow}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142217] dark:text-white leading-tight">
                {t.deliverySection.title}
              </h2>
              <p className="text-sm text-[#546858] dark:text-[#9cb3a1] leading-relaxed">
                {t.deliverySection.subtitle}
              </p>

              <div className="rounded-2xl overflow-hidden bg-[#edf5e7] dark:bg-[#1b2c22] border border-[#dce8d5] dark:border-[#294032]">
                <img
                  src="/images/delivery-courier.jpg"
                  alt={t.deliverySection.title}
                  className="w-full h-52 object-cover"
                />
              </div>

              <div className="pt-1">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#236927] hover:bg-[#1b5e20] text-white font-bold text-sm transition-colors"
                >
                  <span>{t.deliverySection.ctaBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  icon: Clock,
                  title: t.deliverySection.card1Title,
                  desc: t.deliverySection.card1Desc,
                },
                {
                  icon: Snowflake,
                  title: t.deliverySection.card2Title,
                  desc: t.deliverySection.card2Desc,
                },
                {
                  icon: BadgePercent,
                  title: t.deliverySection.card3Title,
                  desc: t.deliverySection.card3Desc,
                },
                {
                  icon: Wallet,
                  title: t.deliverySection.card4Title,
                  desc: t.deliverySection.card4Desc,
                },
              ].map((card, i) => {
                const Icon = card.icon
                return (
                  <div
                    key={i}
                    className="p-5 rounded-2xl bg-[#f7faf5] dark:bg-[#1a2920] border border-[#e5eee1] dark:border-[#273d30] space-y-2.5"
                  >
                    <div className="w-11 h-11 rounded-xl bg-[#236927] text-white flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-[#142217] dark:text-white">
                      {card.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#546858] dark:text-[#9eb5a3] leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Why Choose FreshBozor 5-card bar */}
          <div className="mt-10 pt-8 border-t border-[#e7efe4] dark:border-[#223529]">
            <h3 className="text-center text-lg sm:text-xl font-extrabold text-[#142217] dark:text-white mb-6">
              {t.deliverySection.whyTitle}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              {[
                { icon: Award, title: t.deliverySection.why1Title, desc: t.deliverySection.why1Desc },
                { icon: Tag, title: t.deliverySection.why2Title, desc: t.deliverySection.why2Desc },
                { icon: Truck, title: t.deliverySection.why3Title, desc: t.deliverySection.why3Desc },
                { icon: ShieldCheck, title: t.deliverySection.why4Title, desc: t.deliverySection.why4Desc },
                { icon: RefreshCw, title: t.deliverySection.why5Title, desc: t.deliverySection.why5Desc },
              ].map((why, idx) => {
                const Icon = why.icon
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#f6f9f3] dark:bg-[#19271e] border border-[#e5ede2] dark:border-[#263c2e] flex flex-col items-start gap-2"
                  >
                    <div className="w-9 h-9 rounded-full bg-white dark:bg-[#22362a] text-[#236927] dark:text-[#4ade80] flex items-center justify-center shadow-2xs">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-bold text-[#142217] dark:text-white">{why.title}</h4>
                    <p className="text-xs text-[#5d7060] dark:text-[#96ad9b] leading-relaxed">
                      {why.desc}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 6. CUSTOMER REVIEWS + TRUST STATS + NEWSLETTER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-14">
        <div className="mb-6">
          <span className="text-xs font-extrabold tracking-widest uppercase text-[#236927] dark:text-[#4ade80]">
            {t.testimonials.eyebrow}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142217] dark:text-white mt-1">
            {t.testimonials.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Review Carousel Card */}
          <div className="lg:col-span-5 bg-white dark:bg-[#15221a] rounded-3xl border border-[#e2ebe0] dark:border-[#24382c] p-6 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: activeReview.rating }).map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-xs text-[#718574] dark:text-[#8ea694]">
                  {localize(activeReview.date)}
                </span>
              </div>

              <p className="text-sm sm:text-base text-[#1f3123] dark:text-[#e3efe5] leading-relaxed italic mb-6">
                “{localize(activeReview.text)}”
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#eef3eb] dark:border-[#213327]">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full text-white font-bold text-xs flex items-center justify-center shrink-0"
                  style={{ backgroundColor: activeReview.color }}
                >
                  {activeReview.initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#142217] dark:text-white">
                    {localize(activeReview.name)}
                  </p>
                  <p className="text-xs text-[#647868] dark:text-[#96ad9b]">
                    {localize(activeReview.role)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={prevReview}
                  aria-label="Previous review"
                  className="w-8 h-8 rounded-full border border-[#dce6d7] dark:border-[#2b4033] flex items-center justify-center text-[#364d3b] dark:text-white hover:bg-[#236927] hover:text-white transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={nextReview}
                  aria-label="Next review"
                  className="w-8 h-8 rounded-full border border-[#dce6d7] dark:border-[#2b4033] flex items-center justify-center text-[#364d3b] dark:text-white hover:bg-[#236927] hover:text-white transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Trusted Customers Summary Card */}
          <div className="lg:col-span-3 bg-white dark:bg-[#15221a] rounded-3xl border border-[#e2ebe0] dark:border-[#24382c] p-6 flex flex-col justify-center items-center text-center shadow-xs">
            <div className="flex -space-x-2.5 mb-4">
              {reviews.map((r) => (
                <div
                  key={r.id}
                  className="w-11 h-11 rounded-full border-2 border-white dark:border-[#15221a] text-white text-xs font-extrabold flex items-center justify-center shadow-xs"
                  style={{ backgroundColor: r.color }}
                >
                  {r.initials}
                </div>
              ))}
            </div>
            <h3 className="text-lg font-extrabold text-[#142217] dark:text-white">
              {t.testimonials.trustedTitle}
            </h3>
            <div className="flex items-center gap-1 text-amber-400 my-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-sm font-bold text-[#236927] dark:text-[#4ade80]">
              {t.testimonials.trustedRating}
            </p>
            <p className="text-xs text-[#647868] dark:text-[#96ad9b] mt-1">
              {t.testimonials.trustedSub}
            </p>
          </div>

          {/* Newsletter & Exclusive Promo */}
          <div className="lg:col-span-4 bg-gradient-to-br from-[#1d5421] to-[#133b16] text-white rounded-3xl p-6 flex flex-col justify-between shadow-md">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#86efac]">
                <Sparkles className="w-4 h-4" />
                <span>YANGI10</span>
              </div>
              <h3 className="text-xl font-extrabold leading-snug">
                {t.testimonials.newsletterTitle}
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/85 leading-relaxed">
                {t.testimonials.newsletterDesc}
              </p>
            </div>

            {subscribed ? (
              <div className="mt-5 p-3.5 rounded-2xl bg-white/15 border border-white/20 flex items-start gap-2.5 text-xs sm:text-sm font-semibold">
                <CheckCircle2 className="w-5 h-5 text-[#86efac] shrink-0" />
                <span>{t.testimonials.newsletterSuccess}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="mt-5 flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.testimonials.newsletterPlaceholder}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/15 border border-white/25 text-white placeholder:text-emerald-100/70 text-sm focus:outline-none focus:bg-white/20"
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-[#4ade80] hover:bg-[#22c55e] text-[#0d2610] font-extrabold text-sm whitespace-nowrap transition-colors cursor-pointer"
                >
                  {t.testimonials.newsletterBtn}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
