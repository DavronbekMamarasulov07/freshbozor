import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, Tag, X } from 'lucide-react'
import { categories } from '../data/categories'
import { products } from '../data/products'
import { useLanguage } from '../context/contexts'
import ProductCard from '../components/ProductCard'

export default function ProductsPage() {
  const { t, localize } = useLanguage()
  const [searchParams, setSearchParams] = useSearchParams()

  const activeCategory = searchParams.get('category') || 'all'
  const queryParam = searchParams.get('q') || ''
  const onlyDeals = searchParams.get('deals') === '1'
  const [sortBy, setSortBy] = useState('popular')

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (!value || value === 'all') {
      next.delete(key)
    } else {
      next.set(key, value)
    }
    setSearchParams(next)
  }

  const clearAllFilters = () => {
    setSearchParams({})
    setSortBy('popular')
  }

  const filteredProducts = useMemo(() => {
    const q = queryParam.trim().toLowerCase()
    const list = products.filter((p) => {
      if (activeCategory !== 'all' && p.categoryId !== activeCategory) return false
      if (onlyDeals && p.discount <= 0) return false
      if (q) {
        const hay = `${p.name.uz} ${p.name.ru} ${p.description.uz} ${p.description.ru}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })

    if (sortBy === 'price-asc') return [...list].sort((a, b) => a.price - b.price)
    if (sortBy === 'price-desc') return [...list].sort((a, b) => b.price - a.price)
    if (sortBy === 'discount') return [...list].sort((a, b) => b.discount - a.discount)
    return list
  }, [activeCategory, queryParam, onlyDeals, sortBy])

  const hasActiveFilter = activeCategory !== 'all' || queryParam.trim() !== '' || onlyDeals

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      {/* Page Header */}
      <div className="mb-7">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#142217] dark:text-white">
          {t.productsPage.title}
        </h1>
        <p className="text-sm sm:text-base text-[#546858] dark:text-[#9cb3a1] mt-1.5">
          {t.productsPage.subtitle}
        </p>
      </div>

      {/* Category Filter Strip (Single horizontal row of circular pills) */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-3 mb-6">
        <button
          type="button"
          onClick={() => updateParam('category', 'all')}
          className={`shrink-0 px-4 py-2.5 rounded-full text-sm font-bold border transition-all cursor-pointer ${
            activeCategory === 'all'
              ? 'bg-[#236927] text-white border-[#236927] shadow-xs'
              : 'bg-white dark:bg-[#15221a] text-[#283a2c] dark:text-[#d0dfd3] border-[#dce6d7] dark:border-[#273d30] hover:border-[#2e7d32]'
          }`}
        >
          {t.nav.allCategories} ({products.length})
        </button>

        {categories.map((cat) => {
          const isActive = activeCategory === cat.id
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => updateParam('category', cat.id)}
              className={`shrink-0 flex items-center gap-2 pl-1.5 pr-4 py-1.5 rounded-full text-sm font-bold border transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#236927] text-white border-[#236927] shadow-xs'
                  : 'bg-white dark:bg-[#15221a] text-[#283a2c] dark:text-[#d0dfd3] border-[#dce6d7] dark:border-[#273d30] hover:border-[#2e7d32]'
              }`}
            >
              <img
                src={cat.image}
                alt={localize(cat.shortName)}
                className="w-7 h-7 rounded-full object-cover"
              />
              <span>{localize(cat.shortName)}</span>
            </button>
          )
        })}
      </div>

      {/* Toolbar: Search, Deals Toggle, Sort */}
      <div className="bg-white dark:bg-[#15221a] rounded-2xl border border-[#e2ebe0] dark:border-[#24382c] p-4 mb-7 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
        <div className="flex-1 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-[#6d8271] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={queryParam}
              onChange={(e) => updateParam('q', e.target.value)}
              placeholder={t.nav.searchPlaceholder}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#f6f9f4] dark:bg-[#1a2920] border border-[#dce6d7] dark:border-[#2b4032] text-sm text-[#142217] dark:text-white focus:outline-none focus:border-[#2e7d32]"
            />
            {queryParam && (
              <button
                type="button"
                onClick={() => updateParam('q', '')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6d8271] hover:text-[#142217] dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => updateParam('deals', onlyDeals ? '' : '1')}
            className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-colors cursor-pointer ${
              onlyDeals
                ? 'bg-[#236927] text-white border-[#236927]'
                : 'bg-[#f6f9f4] dark:bg-[#1a2920] text-[#2c4530] dark:text-[#cde0d1] border-[#dce6d7] dark:border-[#2b4032]'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>{t.productsPage.onlyDeals}</span>
          </button>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-[#546858] dark:text-[#9cb3a1]">
            <SlidersHorizontal className="w-4 h-4 text-[#236927] dark:text-[#4ade80]" />
            <span className="hidden sm:inline">{t.productsPage.sortLabel}</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#f6f9f4] dark:bg-[#1a2920] border border-[#dce6d7] dark:border-[#2b4032] text-[#142217] dark:text-white font-semibold focus:outline-none cursor-pointer"
            >
              <option value="popular">{t.productsPage.sortPopular}</option>
              <option value="price-asc">{t.productsPage.sortPriceAsc}</option>
              <option value="price-desc">{t.productsPage.sortPriceDesc}</option>
              <option value="discount">{t.productsPage.sortDiscount}</option>
            </select>
          </div>

          {hasActiveFilter && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
            >
              {t.productsPage.clearFilters}
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-5 text-sm text-[#546858] dark:text-[#9cb3a1]">
        <p>
          {queryParam && (
            <span className="mr-2">
              {t.productsPage.searchLabel}{' '}
              <strong className="text-[#142217] dark:text-white">“{queryParam}”</strong> —
            </span>
          )}
          <strong className="text-[#236927] dark:text-[#4ade80]">{filteredProducts.length}</strong>{' '}
          {t.productsPage.foundCount}
        </p>
      </div>

      {/* Product Grid or Empty State */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-[#15221a] rounded-3xl border border-[#e2ebe0] dark:border-[#24382c] py-16 px-6 text-center max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-[#eef6ea] dark:bg-[#1e3326] text-[#236927] dark:text-[#4ade80] flex items-center justify-center mx-auto mb-4">
            <Search className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-extrabold text-[#142217] dark:text-white mb-2">
            {t.productsPage.emptyTitle}
          </h2>
          <p className="text-sm text-[#546858] dark:text-[#9cb3a1] mb-6">
            {t.productsPage.emptyDesc}
          </p>
          <button
            type="button"
            onClick={clearAllFilters}
            className="px-6 py-3 rounded-xl bg-[#236927] hover:bg-[#1b5e20] text-white font-bold text-sm transition-colors cursor-pointer"
          >
            {t.productsPage.clearFilters}
          </button>
        </div>
      )}
    </div>
  )
}
