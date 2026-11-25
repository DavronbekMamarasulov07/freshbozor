import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Loader2,
  Minus,
  Plus,
  Send,
  ShoppingBag,
  Tag,
  Trash2,
  Truck,
} from 'lucide-react'
import {
  FREE_DELIVERY_THRESHOLD,
  STANDARD_DELIVERY_FEE,
  useLanguage,
  useStore,
} from '../context/contexts'
import { submitOrder } from '../utils/ordersApi'
import OrderStatusTracker from '../components/OrderStatusTracker'

const PROMO_CODES = {
  YANGI10: 0.1,
  FRESH15: 0.15,
}

export default function CartPage() {
  const { t, localize, formatPrice } = useLanguage()
  const {
    cartItems,
    cartSubtotal,
    orders,
    updateCartQty,
    removeFromCart,
    clearCart,
    placeOrder,
  } = useStore()

  const [promoInput, setPromoInput] = useState('')
  const [appliedPromo, setAppliedPromo] = useState(null)
  const [promoError, setPromoError] = useState(false)

  const [customer, setCustomer] = useState({
    fullName: '',
    phone: '',
    address: '',
    deliveryTime: 'now',
    paymentMethod: 'cash',
    notes: '',
  })
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmedOrder, setConfirmedOrder] = useState(null)
  const [telegramResult, setTelegramResult] = useState(null)

  const deliveryFee =
    cartSubtotal === 0 || cartSubtotal >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE
  const promoRate = appliedPromo ? PROMO_CODES[appliedPromo] || 0 : 0
  const discountAmount = Math.round(cartSubtotal * promoRate)
  const grandTotal = Math.max(0, cartSubtotal - discountAmount + deliveryFee)
  const remainingForFree = Math.max(0, FREE_DELIVERY_THRESHOLD - cartSubtotal)
  const freeProgress = Math.min(100, Math.round((cartSubtotal / FREE_DELIVERY_THRESHOLD) * 100))

  const handleApplyPromo = (e) => {
    e.preventDefault()
    const code = promoInput.trim().toUpperCase()
    if (PROMO_CODES[code]) {
      setAppliedPromo(code)
      setPromoError(false)
    } else {
      setAppliedPromo(null)
      setPromoError(true)
    }
  }

  const handleCheckout = async (e) => {
    e.preventDefault()
    if (isSubmitting) return
    if (!customer.fullName.trim() || !customer.phone.trim() || !customer.address.trim()) {
      setFormError(t.cartPage.validationRequired)
      return
    }
    setFormError('')
    setIsSubmitting(true)

    const deliveryTimeMap = {
      now: t.cartPage.timeNow,
      evening: t.cartPage.timeEvening,
      tomorrow: t.cartPage.timeTomorrow,
    }
    const paymentMethodMap = {
      cash: t.cartPage.payCash,
      card: t.cartPage.payCard,
      click: t.cartPage.payClick,
    }

    const orderPayload = {
      id: `FB-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      currency: t.product.currency,
      deliveryTimeLabel: deliveryTimeMap[customer.deliveryTime] || customer.deliveryTime,
      paymentMethodLabel: paymentMethodMap[customer.paymentMethod] || customer.paymentMethod,
      customer: { ...customer },
      promoCode: appliedPromo,
      items: cartItems.map((i) => ({
        id: i.id,
        name: localize(i.name),
        unit: localize(i.unit),
        quantity: i.quantity,
        price: i.price,
      })),
      subtotal: cartSubtotal,
      discountAmount,
      deliveryFee,
      total: grandTotal,
    }

    const res = await submitOrder(orderPayload)
    const savedOrder = placeOrder(res.order || orderPayload)
    setTelegramResult(res.telegram)
    setConfirmedOrder(savedOrder)
    setIsSubmitting(false)
  }

  if (confirmedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14">
        <div className="bg-white dark:bg-[#15221a] rounded-3xl border border-[#d6ead0] dark:border-[#2a4a34] p-8 sm:p-10 text-center shadow-lg space-y-5">
          <div className="w-16 h-16 rounded-full bg-[#eef6ea] dark:bg-[#1e3927] text-[#236927] dark:text-[#4ade80] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142217] dark:text-white">
            {t.cartPage.orderSuccessTitle}
          </h1>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f4f8f1] dark:bg-[#1c2f23] border border-[#dce6d7] dark:border-[#2a4033] text-sm font-bold text-[#236927] dark:text-[#4ade80]">
            <span>{t.cartPage.orderSuccessNumber}</span>
            <span className="font-mono">{confirmedOrder.id}</span>
          </div>
          <p className="text-sm text-[#546858] dark:text-[#a6beac] leading-relaxed">
            {t.cartPage.orderSuccessDesc}
          </p>

          {telegramResult && (
            <div
              className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 text-left ${
                telegramResult.ok
                  ? 'bg-[#eef6ea] dark:bg-[#1a3322] border-[#cde3c7] dark:border-[#2b5237] text-[#1c5920] dark:text-[#86efac]'
                  : 'bg-amber-50 dark:bg-amber-950/35 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
              }`}
            >
              {telegramResult.ok ? (
                <>
                  <Send className="w-4 h-4 shrink-0" />
                  <span>{t.cartPage.telegramSent}</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>
                    {t.cartPage.telegramWarning} ({telegramResult.error})
                  </span>
                </>
              )}
            </div>
          )}
          <OrderStatusTracker initialOrder={confirmedOrder} />

          <div className="p-4 rounded-2xl bg-[#f7faf5] dark:bg-[#1a2920] text-sm text-left space-y-1.5 border border-[#e5eee1] dark:border-[#263c2e]">
            <div className="flex justify-between">
              <span className="text-[#5d7060] dark:text-[#96ad9b]">{t.cartPage.fullName}:</span>
              <span className="font-bold text-[#142217] dark:text-white">
                {confirmedOrder.customer.fullName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5d7060] dark:text-[#96ad9b]">{t.cartPage.address}:</span>
              <span className="font-bold text-[#142217] dark:text-white">
                {confirmedOrder.customer.address}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-[#e5eee1] dark:border-[#263c2e]">
              <span className="font-bold text-[#142217] dark:text-white">{t.cartPage.total}:</span>
              <span className="font-extrabold text-[#236927] dark:text-[#4ade80]">
                {formatPrice(confirmedOrder.total)}
              </span>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#236927] hover:bg-[#1b5e20] text-white font-bold text-sm transition-colors"
            >
              <span>{t.cartPage.continueShopping}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/orders"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl border border-[#cddcc8] dark:border-[#2c4535] text-[#19331c] dark:text-white font-bold text-sm hover:border-[#2e7d32] transition-colors"
            >
              <span>{t.orderTracking.trackLink}</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="bg-white dark:bg-[#15221a] rounded-3xl border border-[#e2ebe0] dark:border-[#24382c] p-10 space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-[#eef6ea] dark:bg-[#1e3326] text-[#236927] dark:text-[#4ade80] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#142217] dark:text-white">
            {t.cartPage.emptyTitle}
          </h1>
          <p className="text-sm text-[#546858] dark:text-[#9cb3a1]">{t.cartPage.emptyDesc}</p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#236927] hover:bg-[#1b5e20] text-white font-bold text-sm transition-colors"
            >
              <span>{t.cartPage.goShopping}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            {orders.length > 0 && (
              <Link
                to="/orders"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl border border-[#cddcc8] dark:border-[#2c4535] text-[#19331c] dark:text-white font-bold text-sm hover:border-[#2e7d32] transition-colors"
              >
                <span>{t.orderTracking.trackLink}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-[#142217] dark:text-white">
            {t.cartPage.title}
          </h1>
          <p className="text-sm text-[#546858] dark:text-[#9cb3a1] mt-1">{t.cartPage.subtitle}</p>
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline self-start sm:self-auto cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          <span>{t.cartPage.clearCart}</span>
        </button>
      </div>

      {/* Free Delivery Progress Bar */}
      <div className="bg-white dark:bg-[#15221a] rounded-2xl border border-[#e2ebe0] dark:border-[#24382c] p-4 mb-6">
        <div className="flex items-center gap-2.5 text-sm font-semibold text-[#1b361f] dark:text-[#d5e6d8] mb-2">
          <Truck className="w-4 h-4 text-[#236927] dark:text-[#4ade80] shrink-0" />
          <span>
            {remainingForFree === 0
              ? t.cartPage.freeDeliveryUnlocked
              : t.cartPage.freeDeliveryRemaining.replace('{amount}', formatPrice(remainingForFree))}
          </span>
        </div>
        <div className="h-2.5 rounded-full bg-[#ebf2e8] dark:bg-[#1e3126] overflow-hidden">
          <div
            className="h-full rounded-full bg-[#236927] dark:bg-[#4ade80] transition-all duration-300"
            style={{ width: `${freeProgress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* Left: Cart Items + Checkout Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-[#15221a] rounded-3xl border border-[#e2ebe0] dark:border-[#24382c] divide-y divide-[#eef3eb] dark:divide-[#213327] overflow-hidden shadow-xs">
            {cartItems.map((item) => (
              <div key={item.id} className="p-4 sm:p-5 flex items-center gap-4">
                <img
                  src={item.image}
                  alt={localize(item.name)}
                  className="w-20 h-20 rounded-2xl object-cover bg-[#f7faf5] dark:bg-[#1b2b21] border border-[#e6efe2] dark:border-[#283e31] shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base font-bold text-[#142217] dark:text-white truncate">
                    {localize(item.name)}
                  </p>
                  <p className="text-xs text-[#647868] dark:text-[#96ad9b] mt-0.5">
                    {localize(item.unit)} • {formatPrice(item.price)}
                  </p>

                  <div className="mt-3 flex items-center gap-3">
                    <div className="inline-flex items-center rounded-xl border border-[#dce6d7] dark:border-[#2c4234] bg-[#f7faf5] dark:bg-[#1a2920]">
                      <button
                        type="button"
                        onClick={() => updateCartQty(item.id, item.quantity - 1)}
                        aria-label="Decrease"
                        className="p-1.5 sm:p-2 text-[#283a2c] dark:text-white hover:text-[#236927] cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs sm:text-sm font-bold text-[#142217] dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartQty(item.id, item.quantity + 1)}
                        aria-label="Increase"
                        className="p-1.5 sm:p-2 text-[#283a2c] dark:text-white hover:text-[#236927] cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      aria-label="Remove item"
                      className="p-2 rounded-xl text-[#809483] hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-sm sm:text-base font-extrabold text-[#163d19] dark:text-[#4ade80]">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Form */}
          <form
            id="checkout-form"
            onSubmit={handleCheckout}
            className="bg-white dark:bg-[#15221a] rounded-3xl border border-[#e2ebe0] dark:border-[#24382c] p-6 sm:p-7 space-y-4 shadow-xs"
          >
            <h2 className="text-xl font-extrabold text-[#142217] dark:text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#236927] dark:text-[#4ade80]" />
              <span>{t.cartPage.checkoutTitle}</span>
            </h2>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs sm:text-sm font-semibold text-rose-600 dark:text-rose-300">
                {formError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#3a4f3e] dark:text-[#b8cbbd] mb-1.5">
                  {t.cartPage.fullName} *
                </label>
                <input
                  type="text"
                  required
                  value={customer.fullName}
                  onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                  placeholder={t.cartPage.fullNamePh}
                  className="w-full px-4 py-3 rounded-xl bg-[#f6f9f4] dark:bg-[#1a2920] border border-[#dce6d7] dark:border-[#2b4032] text-sm text-[#142217] dark:text-white focus:outline-none focus:border-[#2e7d32]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3a4f3e] dark:text-[#b8cbbd] mb-1.5">
                  {t.cartPage.phone} *
                </label>
                <input
                  type="tel"
                  required
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  placeholder={t.cartPage.phonePh}
                  className="w-full px-4 py-3 rounded-xl bg-[#f6f9f4] dark:bg-[#1a2920] border border-[#dce6d7] dark:border-[#2b4032] text-sm text-[#142217] dark:text-white focus:outline-none focus:border-[#2e7d32]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3a4f3e] dark:text-[#b8cbbd] mb-1.5">
                {t.cartPage.address} *
              </label>
              <input
                type="text"
                required
                value={customer.address}
                onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                placeholder={t.cartPage.addressPh}
                className="w-full px-4 py-3 rounded-xl bg-[#f6f9f4] dark:bg-[#1a2920] border border-[#dce6d7] dark:border-[#2b4032] text-sm text-[#142217] dark:text-white focus:outline-none focus:border-[#2e7d32]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#3a4f3e] dark:text-[#b8cbbd] mb-1.5">
                  {t.cartPage.deliveryTime}
                </label>
                <select
                  value={customer.deliveryTime}
                  onChange={(e) => setCustomer({ ...customer, deliveryTime: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#f6f9f4] dark:bg-[#1a2920] border border-[#dce6d7] dark:border-[#2b4032] text-sm text-[#142217] dark:text-white focus:outline-none cursor-pointer"
                >
                  <option value="now">{t.cartPage.timeNow}</option>
                  <option value="evening">{t.cartPage.timeEvening}</option>
                  <option value="tomorrow">{t.cartPage.timeTomorrow}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3a4f3e] dark:text-[#b8cbbd] mb-1.5">
                  {t.cartPage.paymentMethod}
                </label>
                <select
                  value={customer.paymentMethod}
                  onChange={(e) => setCustomer({ ...customer, paymentMethod: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#f6f9f4] dark:bg-[#1a2920] border border-[#dce6d7] dark:border-[#2b4032] text-sm text-[#142217] dark:text-white focus:outline-none cursor-pointer"
                >
                  <option value="cash">{t.cartPage.payCash}</option>
                  <option value="card">{t.cartPage.payCard}</option>
                  <option value="click">{t.cartPage.payClick}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3a4f3e] dark:text-[#b8cbbd] mb-1.5">
                {t.cartPage.notes}
              </label>
              <input
                type="text"
                value={customer.notes}
                onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                placeholder={t.cartPage.notesPh}
                className="w-full px-4 py-3 rounded-xl bg-[#f6f9f4] dark:bg-[#1a2920] border border-[#dce6d7] dark:border-[#2b4032] text-sm text-[#142217] dark:text-white focus:outline-none focus:border-[#2e7d32]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-[#236927] hover:bg-[#1b5e20] disabled:opacity-70 text-white font-extrabold text-base shadow-md shadow-[#236927]/20 flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:cursor-wait"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{t.cartPage.submittingBtn}</span>
                </>
              ) : (
                <span>
                  {t.cartPage.placeOrderBtn} • {formatPrice(grandTotal)}
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Right: Order Summary & Promo Code */}
        <aside className="lg:col-span-5 bg-white dark:bg-[#15221a] rounded-3xl border border-[#e2ebe0] dark:border-[#24382c] p-6 space-y-5 lg:sticky lg:top-28 shadow-xs">
          <h2 className="text-lg font-extrabold text-[#142217] dark:text-white">
            {t.cartPage.summaryTitle}
          </h2>

          {/* Promo Input */}
          <form onSubmit={handleApplyPromo} className="space-y-2">
            <label className="block text-xs font-semibold text-[#546858] dark:text-[#9cb3a1]">
              {t.cartPage.promoLabel}
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-4 h-4 text-[#6d8271] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder={t.cartPage.promoPlaceholder}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#f6f9f4] dark:bg-[#1a2920] border border-[#dce6d7] dark:border-[#2b4032] text-sm text-[#142217] dark:text-white focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-[#1d5421] hover:bg-[#154118] text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer"
              >
                {t.cartPage.promoApply}
              </button>
            </div>
            {promoError && <p className="text-xs text-rose-500 font-medium">{t.cartPage.promoInvalid}</p>}
            {appliedPromo && (
              <p className="text-xs text-[#236927] dark:text-[#4ade80] font-semibold">
                {t.cartPage.promoApplied} ({appliedPromo})
              </p>
            )}
          </form>

          <div className="space-y-3 pt-4 border-t border-[#eef3eb] dark:border-[#213327] text-sm">
            <div className="flex justify-between text-[#546858] dark:text-[#9cb3a1]">
              <span>{t.cartPage.subtotal}</span>
              <span className="font-bold text-[#142217] dark:text-white">
                {formatPrice(cartSubtotal)}
              </span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-[#236927] dark:text-[#4ade80]">
                <span>{t.cartPage.discount}</span>
                <span className="font-bold">-{formatPrice(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between text-[#546858] dark:text-[#9cb3a1]">
              <span>{t.cartPage.deliveryFee}</span>
              <span className="font-bold text-[#142217] dark:text-white">
                {deliveryFee === 0 ? t.cartPage.free : formatPrice(deliveryFee)}
              </span>
            </div>

            <div className="pt-3 border-t border-[#eef3eb] dark:border-[#213327] flex justify-between items-baseline">
              <span className="text-base font-extrabold text-[#142217] dark:text-white">
                {t.cartPage.total}
              </span>
              <span className="text-2xl font-extrabold text-[#236927] dark:text-[#4ade80]">
                {formatPrice(grandTotal)}
              </span>
            </div>
          </div>

          <a
            href="#checkout-form"
            className="lg:hidden block w-full py-3.5 rounded-xl bg-[#236927] text-white font-bold text-center text-sm"
          >
            {t.cartPage.checkoutTitle} ↓
          </a>
        </aside>
      </div>
    </div>
  )
}
