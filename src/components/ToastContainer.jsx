import { CheckCircle2, Heart } from 'lucide-react'
import { useStore } from '../context/contexts'

export default function ToastContainer() {
  const { toasts } = useStore()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="animate-slide-up pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#163c19] dark:bg-[#1d3b26] text-white text-sm font-medium shadow-xl border border-white/15"
        >
          {toast.type === 'info' ? (
            <Heart className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-[#86efac] shrink-0" />
          )}
          <span className="leading-snug">{toast.message}</span>
        </div>
      ))}
    </div>
  )
}
