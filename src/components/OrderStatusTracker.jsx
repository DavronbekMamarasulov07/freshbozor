import { useEffect, useState } from 'react'
import { CheckCircle2, Clock, PackageCheck, RefreshCw, Truck, XCircle } from 'lucide-react'
import { useLanguage } from '../context/contexts'
import { fetchOrderStatus } from '../utils/ordersApi'

const STEP_KEYS = ['new', 'accepted', 'delivering', 'delivered']

export default function OrderStatusTracker({ initialOrder }) {
  const { t } = useLanguage()
  const [order, setOrder] = useState(initialOrder)
  const [refreshing, setRefreshing] = useState(false)

  const status = order?.status || 'new'
  const isFinal = status === 'delivered' || status === 'cancelled'

  useEffect(() => {
    if (!order?.id || isFinal) return undefined
    const timer = setInterval(async () => {
      const latest = await fetchOrderStatus(order.id)
      if (latest) setOrder(latest)
    }, 4000)
    return () => clearInterval(timer)
  }, [order?.id, isFinal])

  const handleManualRefresh = async () => {
    if (!order?.id || refreshing) return
    setRefreshing(true)
    const latest = await fetchOrderStatus(order.id)
    if (latest) setOrder(latest)
    setRefreshing(false)
  }

  const activeIdx = STEP_KEYS.indexOf(status)

  const stepLabels = {
    new: t.orderTracking.stepNew,
    accepted: t.orderTracking.stepAccepted,
    delivering: t.orderTracking.stepDelivering,
    delivered: t.orderTracking.stepDelivered,
  }

  const stepIcons = {
    new: Clock,
    accepted: PackageCheck,
    delivering: Truck,
    delivered: CheckCircle2,
  }

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#f5f9f2] dark:bg-[#19281f] border border-[#dce8d5] dark:border-[#273d30] text-left space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#546858] dark:text-[#96ad9b]">
            {t.orderTracking.liveStatusTitle}
          </p>
          <p className="text-sm font-extrabold text-[#163d19] dark:text-[#4ade80] mt-0.5">
            {status === 'cancelled' ? t.orderTracking.statusCancelled : stepLabels[status] || stepLabels.new}
          </p>
        </div>

        <button
          type="button"
          onClick={handleManualRefresh}
          aria-label={t.orderTracking.refresh}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#142018] border border-[#d6e3d2] dark:border-[#2b4033] text-xs font-bold text-[#236927] dark:text-[#4ade80] hover:bg-[#eef6ea] transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{t.orderTracking.refresh}</span>
        </button>
      </div>

      {status === 'cancelled' ? (
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/35 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs sm:text-sm font-semibold">
          <XCircle className="w-5 h-5 shrink-0" />
          <span>{t.orderTracking.cancelledDesc}</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {STEP_KEYS.map((key, idx) => {
            const Icon = stepIcons[key]
            const done = idx <= activeIdx
            const current = idx === activeIdx
            return (
              <div
                key={key}
                className={`p-3 rounded-xl border transition-all ${
                  done
                    ? 'bg-white dark:bg-[#142219] border-[#2e7d32] dark:border-[#4ade80]'
                    : 'bg-white/50 dark:bg-[#131e17] border-[#e2ebe0] dark:border-[#223428] opacity-60'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      done
                        ? 'bg-[#236927] text-white'
                        : 'bg-[#e5ede2] dark:bg-[#233529] text-[#6d8271]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  {current && status !== 'delivered' && (
                    <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
                  )}
                </div>
                <p className="text-xs font-bold text-[#142217] dark:text-white leading-snug">
                  {stepLabels[key]}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
