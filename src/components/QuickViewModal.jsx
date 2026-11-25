import { useEffect, useState } from 'react'
import { Check, Heart, MapPin, Minus, Plus, ShoppingCart, Star, X } from 'lucide-react'
import { categories } from '../data/categories'
import { useLanguage, useStore } from '../context/contexts'

function QuickViewContent({ product, onClose }) {
  const { t, localize, formatPrice } = useLanguage()
  const { addToCart, toggleWishlist, isWishlisted } = useStore()
  const [qty, setQty] = useState(1)

  const category = categories.find((c) => c.id === product.categoryId)
  const wishlisted = isWishlisted(product.id)

  return (
    <div
      className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white dark:bg-[#15221a] rounded-3xl shadow-2xl border border-[#e2ebe0] dark:border-[#293f32] animate-slide-up"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/95 dark:bg-[#1f3227] text-[#283a2c] dark:text-white border border-[#e2ebe0] dark:border-[#2f4939] flex items-center justify-center shadow-sm hover:scale-105 transition-transform cursor-pointer"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="grid grid-cols-1 md:grid-cols-12">
        <div className="md:col-span-6 relative bg-[#f7faf5] dark:bg-[#1b2b21] aspect-[4/3] md:aspect-auto md:min-h-[450px]">
          <img
            src={product.image}
            alt={localize(product.name)}
            className="w-full h-full object-cover"
          />
          {product.discount > 0 && (
            <span className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-[#236927] text-white text-xs font-extrabold shadow-xs">
              -{product.discount}% {t.product.discountSuffix}
            </span>
          )}
        </div>

        <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#2e7d32] dark:text-[#4ade80] mb-2 pr-10">
              <span>{category ? localize(category.name) : ''}</span>
              <span>•</span>
              <span>{localize(product.unit)}</span>
            </div>

            <h2 className="text-2xl sm:text-[26px] font-extrabold text-[#142217] dark:text-white leading-snug mb-2.5">
              {localize(product.name)}
            </h2>

            <div className="flex items-center gap-2 text-sm mb-4">
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold text-[#142217] dark:text-white">{product.rating}</span>
              </div>
              <span className="text-[#697d6d] dark:text-[#96ad9b]">
                ({product.reviewsCount} {t.product.reviewsLabel})
              </span>
            </div>

            <p className="text-sm sm:text-[15px] text-[#4a5d4e] dark:text-[#b8cbbd] leading-relaxed mb-5">
              {localize(product.description)}
            </p>

            <div className="space-y-2.5 text-xs sm:text-sm text-[#546858] dark:text-[#98b09d] bg-[#f5f9f2] dark:bg-[#1b2b21] p-4 rounded-2xl">
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#2e7d32] dark:text-[#4ade80] shrink-0" />
                  {t.product.origin}:
                </span>
                <span className="font-semibold text-[#162219] dark:text-white text-right">
                  {localize(product.origin)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#2e7d32] dark:text-[#4ade80] shrink-0" />
                  {t.product.availability}:
                </span>
                <span className="font-semibold text-[#236927] dark:text-[#4ade80]">
                  {t.product.inStock}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-[#e8efe5] dark:border-[#24382c]">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#163d19] dark:text-[#4ade80]">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-sm sm:text-base text-[#8a9a8d] line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
              <div className="h-12 shrink-0 flex items-center border border-[#d6e3d2] dark:border-[#2c4234] rounded-xl bg-[#f7faf5] dark:bg-[#1a2920]">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="w-10 h-full flex items-center justify-center text-[#283a2c] dark:text-white hover:text-[#236927] cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-9 text-center text-sm font-bold text-[#142217] dark:text-white">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="w-10 h-full flex items-center justify-center text-[#283a2c] dark:text-white hover:text-[#236927] cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  addToCart(product.id, qty)
                  onClose()
                }}
                className="h-12 flex-1 min-w-[165px] px-5 rounded-xl bg-[#236927] hover:bg-[#1b5e20] text-white font-bold text-sm flex items-center justify-center gap-2 whitespace-nowrap transition-colors cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4 shrink-0" />
                <span>{t.product.addToCart}</span>
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                aria-label={wishlisted ? t.product.removeWishlist : t.product.addWishlist}
                className={`w-12 h-12 shrink-0 rounded-xl border flex items-center justify-center transition-colors cursor-pointer ${
                  wishlisted
                    ? 'bg-rose-500 border-rose-500 text-white'
                    : 'border-[#d6e3d2] dark:border-[#2c4234] text-[#4a5d4e] dark:text-[#b5cbb9] hover:text-rose-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function QuickViewModal() {
  const { localize } = useLanguage()
  const { quickViewProduct, setQuickViewProduct } = useStore()

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setQuickViewProduct(null)
    }
    if (quickViewProduct) {
      window.addEventListener('keydown', onKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [quickViewProduct, setQuickViewProduct])

  if (!quickViewProduct) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs"
      onClick={() => setQuickViewProduct(null)}
      role="dialog"
      aria-modal="true"
      aria-label={localize(quickViewProduct.name)}
    >
      <QuickViewContent
        key={quickViewProduct.id}
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  )
}
