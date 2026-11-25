import { Eye, Heart, Minus, Plus, ShoppingCart, Star } from 'lucide-react'
import { categories } from '../data/categories'
import { useLanguage, useStore } from '../context/contexts'

export default function ProductCard({ product }) {
  const { t, localize, formatPrice } = useLanguage()
  const {
    addToCart,
    updateCartQty,
    getCartQty,
    toggleWishlist,
    isWishlisted,
    setQuickViewProduct,
  } = useStore()

  const cartQty = getCartQty(product.id)
  const wishlisted = isWishlisted(product.id)
  const category = categories.find((c) => c.id === product.categoryId)

  return (
    <article className="group bg-white dark:bg-[#15221a] rounded-2xl border border-[#e3ece0] dark:border-[#24382c] p-3.5 sm:p-4 flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-[#b7d6b3] dark:hover:border-[#395e47]">
      <div>
        {/* Image Frame */}
        <div className="relative aspect-[4/3] rounded-xl bg-[#f7faf5] dark:bg-[#1b2b21] overflow-hidden mb-3.5">
          <button
            type="button"
            onClick={() => setQuickViewProduct(product)}
            className="w-full h-full block cursor-pointer"
            aria-label={localize(product.name)}
          >
            <img
              src={product.image}
              alt={localize(product.name)}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </button>

          {/* Discount Badge */}
          {product.discount > 0 && (
            <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-[#236927] text-white text-[11px] font-extrabold tracking-wide shadow-xs">
              -{product.discount}%
            </span>
          )}

          {/* Action Overlay Buttons (Wishlist & QuickView) */}
          <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              aria-label={wishlisted ? t.product.removeWishlist : t.product.addWishlist}
              className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm shadow-xs transition-all cursor-pointer ${
                wishlisted
                  ? 'bg-rose-500 text-white'
                  : 'bg-white/90 dark:bg-[#121e17]/90 text-[#4a5d4e] dark:text-[#b5cbb9] hover:text-rose-500 hover:bg-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
            </button>
            <button
              type="button"
              onClick={() => setQuickViewProduct(product)}
              aria-label={t.product.quickView}
              className="w-8 h-8 rounded-full bg-white/90 dark:bg-[#121e17]/90 text-[#4a5d4e] dark:text-[#b5cbb9] hover:text-[#236927] dark:hover:text-[#4ade80] flex items-center justify-center backdrop-blur-sm shadow-xs opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category & Unit */}
        <div className="flex items-center justify-between gap-2 text-[11px] font-medium text-[#647868] dark:text-[#92a997] mb-1">
          <span className="truncate">{category ? localize(category.shortName) : ''}</span>
          <span className="px-2 py-0.5 rounded-md bg-[#f1f6ee] dark:bg-[#1d2f24] text-[#35523a] dark:text-[#b8d4be] shrink-0">
            {localize(product.unit)}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-[15px] leading-snug text-[#152418] dark:text-white mb-1.5 line-clamp-2 min-h-[42px]">
          <button
            type="button"
            onClick={() => setQuickViewProduct(product)}
            className="text-left hover:text-[#236927] dark:hover:text-[#4ade80] transition-colors cursor-pointer"
          >
            {localize(product.name)}
          </button>
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 text-xs mb-3">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="font-semibold text-[#283a2c] dark:text-[#dfece2]">{product.rating}</span>
          <span className="text-[#798d7d] dark:text-[#869f8c]">({product.reviewsCount})</span>
        </div>
      </div>

      {/* Price & Add to Cart */}
      <div className="pt-2 border-t border-[#eef3eb] dark:border-[#213327]">
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-base sm:text-[17px] font-extrabold text-[#163d19] dark:text-[#4ade80]">
            {formatPrice(product.price)}
          </span>
          {product.oldPrice && (
            <span className="text-xs text-[#8a9a8d] line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>

        {cartQty === 0 ? (
          <button
            type="button"
            onClick={() => addToCart(product.id, 1)}
            className="w-full py-2.5 px-3 rounded-xl border border-[#2c7a30] dark:border-[#399941] text-[#236927] dark:text-[#6ee787] hover:bg-[#236927] hover:text-white dark:hover:bg-[#2b8733] dark:hover:text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{t.product.addToCart}</span>
          </button>
        ) : (
          <div className="w-full rounded-xl bg-[#236927] text-white flex items-center justify-between p-1 shadow-xs">
            <button
              type="button"
              onClick={() => updateCartQty(product.id, cartQty - 1)}
              aria-label="Decrease quantity"
              className="w-8 h-8 rounded-lg hover:bg-white/15 flex items-center justify-center transition-colors cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-sm font-bold px-2">
              {cartQty} ×
            </span>
            <button
              type="button"
              onClick={() => updateCartQty(product.id, cartQty + 1)}
              aria-label="Increase quantity"
              className="w-8 h-8 rounded-lg hover:bg-white/15 flex items-center justify-center transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </article>
  )
}
