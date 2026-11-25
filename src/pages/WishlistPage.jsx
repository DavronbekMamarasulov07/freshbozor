import { Link } from 'react-router-dom'
import { ArrowRight, Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { useLanguage, useStore } from '../context/contexts'
import ProductCard from '../components/ProductCard'

export default function WishlistPage() {
  const { t } = useLanguage()
  const { wishlistProducts, addAllWishlistToCart, clearWishlist } = useStore()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
        <div>
          <h1 className="text-3xl font-extrabold text-[#142217] dark:text-white">
            {t.wishlistPage.title}
          </h1>
          <p className="text-sm text-[#546858] dark:text-[#9cb3a1] mt-1">
            {t.wishlistPage.subtitle}
          </p>
        </div>

        {wishlistProducts.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={addAllWishlistToCart}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#236927] hover:bg-[#1b5e20] text-white text-sm font-bold transition-colors cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{t.wishlistPage.addAllToCart}</span>
            </button>
            <button
              type="button"
              onClick={clearWishlist}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#dce6d7] dark:border-[#2a3f32] text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>{t.wishlistPage.clearWishlist}</span>
            </button>
          </div>
        )}
      </div>

      {wishlistProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {wishlistProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="max-w-xl mx-auto py-12 text-center">
          <div className="bg-white dark:bg-[#15221a] rounded-3xl border border-[#e2ebe0] dark:border-[#24382c] p-10 space-y-4 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#142217] dark:text-white">
              {t.wishlistPage.emptyTitle}
            </h2>
            <p className="text-sm text-[#546858] dark:text-[#9cb3a1]">
              {t.wishlistPage.emptyDesc}
            </p>
            <div className="pt-2">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#236927] hover:bg-[#1b5e20] text-white font-bold text-sm transition-colors"
              >
                <span>{t.cartPage.goShopping}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
