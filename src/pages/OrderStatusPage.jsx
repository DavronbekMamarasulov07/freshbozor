import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, PackageSearch, Search } from 'lucide-react'
import { useLanguage, useStore } from '../context/contexts'
import { fetchOrderStatus } from '../utils/ordersApi'
import OrderStatusTracker from '../components/OrderStatusTracker'

export default function OrderStatusPage() {
  const { t, formatPrice } = useLanguage()
  const { orders } = useStore()
  const [orderIdInput, setOrderIdInput] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(() => orders[0] || null)
  const [notFound, setNotFound] = useState(false)

  const handleLookup = async (e) => {
    e.preventDefault()
    const cleaned = orderIdInput.trim().replace(/^#/, '').toUpperCase()
    if (!cleaned) return
    setNotFound(false)

    const remote = await fetchOrderStatus(cleaned)
    if (remote) {
      setSelectedOrder(remote)
      return
    }

    const local = orders.find((o) => o.id.toUpperCase() === cleaned)
    if (local) {
      setSelectedOrder(local)
    } else {
      setSelectedOrder(null)
      setNotFound(true)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-7">
      <div>
        <h1 className="text-3xl font-extrabold text-[#142217] dark:text-white">
          {t.orderTracking.pageTitle}
        </h1>
        <p className="text-sm text-[#546858] dark:text-[#9cb3a1] mt-1">
          {t.orderTracking.pageSubtitle}
        </p>
      </div>

      <form
        onSubmit={handleLookup}
        className="bg-white dark:bg-[#15221a] rounded-2xl border border-[#e2ebe0] dark:border-[#24382c] p-4 flex flex-col sm:flex-row gap-3 shadow-xs"
      >
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#6d8271] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={orderIdInput}
            onChange={(e) => setOrderIdInput(e.target.value)}
            placeholder={t.orderTracking.inputPlaceholder}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#f6f9f4] dark:bg-[#1a2920] border border-[#dce6d7] dark:border-[#2b4032] text-sm text-[#142217] dark:text-white focus:outline-none focus:border-[#2e7d32]"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-[#236927] hover:bg-[#1b5e20] text-white font-bold text-sm transition-colors cursor-pointer"
        >
          {t.orderTracking.searchBtn}
        </button>
      </form>

      {notFound && (
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-sm font-semibold text-amber-800 dark:text-amber-300">
          {t.orderTracking.notFound}
        </div>
      )}

      {selectedOrder ? (
        <div className="bg-white dark:bg-[#15221a] rounded-3xl border border-[#e2ebe0] dark:border-[#24382c] p-6 sm:p-8 space-y-5 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#546858] dark:text-[#96ad9b]">
                {t.cartPage.orderSuccessNumber}
              </span>
              <h2 className="text-2xl font-extrabold font-mono text-[#142217] dark:text-white">
                #{selectedOrder.id}
              </h2>
            </div>
            <span className="text-lg font-extrabold text-[#236927] dark:text-[#4ade80]">
              {formatPrice(selectedOrder.total)}
            </span>
          </div>

          <OrderStatusTracker key={selectedOrder.id} initialOrder={selectedOrder} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm pt-2">
            <div className="p-3.5 rounded-xl bg-[#f7faf5] dark:bg-[#1a2920]">
              <span className="block text-xs text-[#647868] dark:text-[#96ad9b]">
                {t.cartPage.fullName}
              </span>
              <span className="font-bold text-[#142217] dark:text-white">
                {selectedOrder.customer?.fullName}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#f7faf5] dark:bg-[#1a2920]">
              <span className="block text-xs text-[#647868] dark:text-[#96ad9b]">
                {t.cartPage.address}
              </span>
              <span className="font-bold text-[#142217] dark:text-white">
                {selectedOrder.customer?.address}
              </span>
            </div>
          </div>
        </div>
      ) : (
        !notFound && (
          <div className="bg-white dark:bg-[#15221a] rounded-3xl border border-[#e2ebe0] dark:border-[#24382c] p-10 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#eef6ea] dark:bg-[#1e3326] text-[#236927] dark:text-[#4ade80] flex items-center justify-center mx-auto">
              <PackageSearch className="w-7 h-7" />
            </div>
            <p className="text-sm text-[#546858] dark:text-[#9cb3a1]">
              {t.orderTracking.noOrdersYet}
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#236927] text-white font-bold text-sm"
            >
              <span>{t.cartPage.goShopping}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )
      )}

      {orders.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#546858] dark:text-[#96ad9b]">
            {t.orderTracking.recentListTitle}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {orders.slice(0, 6).map((ord) => (
              <button
                key={ord.id}
                type="button"
                onClick={async () => {
                  const fresh = await fetchOrderStatus(ord.id)
                  setSelectedOrder(fresh || ord)
                  setNotFound(false)
                }}
                className="p-4 rounded-2xl bg-white dark:bg-[#15221a] border border-[#e2ebe0] dark:border-[#24382c] hover:border-[#2e7d32] text-left flex items-center justify-between gap-3 transition-colors cursor-pointer"
              >
                <div>
                  <span className="font-mono font-extrabold text-sm text-[#142217] dark:text-white">
                    #{ord.id}
                  </span>
                  <p className="text-xs text-[#647868] dark:text-[#96ad9b] mt-0.5 truncate max-w-[200px]">
                    {ord.customer?.address}
                  </p>
                </div>
                <span className="text-sm font-bold text-[#236927] dark:text-[#4ade80]">
                  {formatPrice(ord.total)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
