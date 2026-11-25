import { useState } from 'react'
import { CheckCircle2, Clock, Mail, MapPin, Phone, Send, Store } from 'lucide-react'
import { useLanguage } from '../context/contexts'

export default function ContactPage() {
  const { t } = useLanguage()
  const [form, setForm] = useState({ name: '', contact: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.contact.trim() || !form.message.trim()) return
    setSent(true)
    setForm({ name: '', contact: '', subject: '', message: '' })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Header */}
      <div className="max-w-2xl space-y-2.5">
        <span className="text-xs font-extrabold tracking-widest uppercase text-[#236927] dark:text-[#4ade80]">
          {t.contactPage.eyebrow}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#142217] dark:text-white">
          {t.contactPage.title}
        </h1>
        <p className="text-sm sm:text-base text-[#546858] dark:text-[#9cb3a1]">
          {t.contactPage.subtitle}
        </p>
      </div>

      {/* Contact Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Phone, label: t.contactPage.infoPhone, value: '+998 (71) 200-45-78' },
          { icon: Mail, label: t.contactPage.infoEmail, value: 'info@freshbozor.uz' },
          { icon: MapPin, label: t.contactPage.infoAddress, value: t.topbar.address },
          { icon: Clock, label: t.contactPage.infoHours, value: t.topbar.hours },
        ].map((item, idx) => {
          const Icon = item.icon
          return (
            <div
              key={idx}
              className="bg-white dark:bg-[#15221a] rounded-2xl border border-[#e2ebe0] dark:border-[#24382c] p-5 space-y-2"
            >
              <div className="w-10 h-10 rounded-xl bg-[#eef6ea] dark:bg-[#1e3426] text-[#236927] dark:text-[#4ade80] flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#6a7e6e] dark:text-[#8ea694]">
                {item.label}
              </p>
              <p className="text-sm font-bold text-[#142217] dark:text-white">{item.value}</p>
            </div>
          )
        })}
      </div>

      {/* Form + Branches */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        <div className="lg:col-span-7 bg-white dark:bg-[#15221a] rounded-3xl border border-[#e2ebe0] dark:border-[#24382c] p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#142217] dark:text-white mb-5">
            {t.contactPage.formTitle}
          </h2>

          {sent ? (
            <div className="p-6 rounded-2xl bg-[#eef6ea] dark:bg-[#1c3324] border border-[#cde3c7] dark:border-[#2c4f38] flex items-start gap-3 text-[#194a1c] dark:text-[#86efac]">
              <CheckCircle2 className="w-6 h-6 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm sm:text-base">{t.contactPage.formSuccess}</p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-3 text-xs font-extrabold underline cursor-pointer"
                >
                  {t.contactPage.formBtn}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#3a4f3e] dark:text-[#b8cbbd] mb-1.5">
                    {t.contactPage.formName}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#f6f9f4] dark:bg-[#1a2920] border border-[#dce6d7] dark:border-[#2b4032] text-sm text-[#142217] dark:text-white focus:outline-none focus:border-[#2e7d32]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#3a4f3e] dark:text-[#b8cbbd] mb-1.5">
                    {t.contactPage.formPhone}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.contact}
                    onChange={(e) => setForm({ ...form, contact: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#f6f9f4] dark:bg-[#1a2920] border border-[#dce6d7] dark:border-[#2b4032] text-sm text-[#142217] dark:text-white focus:outline-none focus:border-[#2e7d32]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3a4f3e] dark:text-[#b8cbbd] mb-1.5">
                  {t.contactPage.formSubject}
                </label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#f6f9f4] dark:bg-[#1a2920] border border-[#dce6d7] dark:border-[#2b4032] text-sm text-[#142217] dark:text-white focus:outline-none focus:border-[#2e7d32]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3a4f3e] dark:text-[#b8cbbd] mb-1.5">
                  {t.contactPage.formMessage}
                </label>
                <textarea
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#f6f9f4] dark:bg-[#1a2920] border border-[#dce6d7] dark:border-[#2b4032] text-sm text-[#142217] dark:text-white focus:outline-none focus:border-[#2e7d32]"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#236927] hover:bg-[#1b5e20] text-white font-bold text-sm transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{t.contactPage.formBtn}</span>
              </button>
            </form>
          )}
        </div>

        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white dark:bg-[#15221a] rounded-3xl border border-[#e2ebe0] dark:border-[#24382c] p-6 space-y-4">
            <h2 className="text-lg font-extrabold text-[#142217] dark:text-white flex items-center gap-2">
              <Store className="w-5 h-5 text-[#236927] dark:text-[#4ade80]" />
              <span>{t.contactPage.branchesTitle}</span>
            </h2>
            <div className="space-y-3">
              {[t.contactPage.branch1, t.contactPage.branch2, t.contactPage.branch3].map(
                (branch, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-[#f6f9f4] dark:bg-[#1a2920] border border-[#e4ede0] dark:border-[#273d30] flex items-start gap-3"
                  >
                    <MapPin className="w-4 h-4 text-[#236927] dark:text-[#4ade80] shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-[#243828] dark:text-[#d2e2d5]">
                      {branch}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-[#1d5421] to-[#133b16] text-white p-6 space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-[#86efac]">
              {t.deliverySection.eyebrow}
            </p>
            <p className="text-lg font-extrabold">{t.promo.rightTitle}</p>
            <p className="text-xs text-emerald-100/85 leading-relaxed">{t.promo.rightDesc}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
