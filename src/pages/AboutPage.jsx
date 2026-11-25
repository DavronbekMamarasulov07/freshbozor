import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Leaf, Recycle, ThermometerSnowflake } from 'lucide-react'
import { useLanguage } from '../context/contexts'

export default function AboutPage() {
  const { t } = useLanguage()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Hero Banner */}
      <section className="rounded-3xl overflow-hidden bg-white dark:bg-[#15221a] border border-[#e2ebe0] dark:border-[#24382c] shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 p-7 sm:p-11 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eef6ea] dark:bg-[#1e3326] text-[#236927] dark:text-[#4ade80] text-xs font-extrabold tracking-widest uppercase">
              <Leaf className="w-3.5 h-3.5" />
              {t.aboutPage.eyebrow}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#142217] dark:text-white leading-tight">
              {t.aboutPage.title}
            </h1>
            <p className="text-sm sm:text-base text-[#546858] dark:text-[#a6beac] leading-relaxed">
              {t.aboutPage.subtitle}
            </p>
            <div className="pt-2">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#236927] hover:bg-[#1b5e20] text-white font-bold text-sm transition-colors"
              >
                <span>{t.hero.ctaShop}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 h-64 sm:h-80 lg:h-full">
            <img
              src="/images/promo-veggies.jpg"
              alt={t.aboutPage.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Key Numbers */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {[
          { num: t.aboutPage.stat1Num, label: t.aboutPage.stat1Label },
          { num: t.aboutPage.stat2Num, label: t.aboutPage.stat2Label },
          { num: t.aboutPage.stat3Num, label: t.aboutPage.stat3Label },
          { num: t.aboutPage.stat4Num, label: t.aboutPage.stat4Label },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white dark:bg-[#15221a] rounded-2xl border border-[#e2ebe0] dark:border-[#24382c] p-6 text-center shadow-2xs"
          >
            <p className="text-3xl sm:text-4xl font-extrabold text-[#236927] dark:text-[#4ade80]">
              {stat.num}
            </p>
            <p className="text-xs sm:text-sm font-semibold text-[#546858] dark:text-[#a2b9a7] mt-1.5">
              {stat.label}
            </p>
          </div>
        ))}
      </section>

      {/* Story + Quality Values */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-5 rounded-3xl overflow-hidden bg-[#f2f6ee] dark:bg-[#18271e] border border-[#e2ebe0] dark:border-[#24382c]">
          <img
            src="/images/hero-basket.jpg"
            alt={t.aboutPage.storyTitle}
            className="w-full h-72 sm:h-80 object-cover"
          />
        </div>

        <div className="lg:col-span-7 space-y-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142217] dark:text-white">
            {t.aboutPage.storyTitle}
          </h2>
          <p className="text-sm sm:text-base text-[#4d6151] dark:text-[#aec4b3] leading-relaxed">
            {t.aboutPage.storyP1}
          </p>
          <p className="text-sm sm:text-base text-[#4d6151] dark:text-[#aec4b3] leading-relaxed">
            {t.aboutPage.storyP2}
          </p>
        </div>
      </section>

      {/* Standards */}
      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142217] dark:text-white text-center">
          {t.aboutPage.valuesTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              icon: CheckCircle2,
              title: t.aboutPage.val1Title,
              desc: t.aboutPage.val1Desc,
            },
            {
              icon: ThermometerSnowflake,
              title: t.aboutPage.val2Title,
              desc: t.aboutPage.val2Desc,
            },
            {
              icon: Recycle,
              title: t.aboutPage.val3Title,
              desc: t.aboutPage.val3Desc,
            },
          ].map((val, idx) => {
            const Icon = val.icon
            return (
              <div
                key={idx}
                className="bg-white dark:bg-[#15221a] rounded-2xl border border-[#e2ebe0] dark:border-[#24382c] p-6 space-y-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#eef6ea] dark:bg-[#1e3426] text-[#236927] dark:text-[#4ade80] flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#142217] dark:text-white">{val.title}</h3>
                <p className="text-sm text-[#546858] dark:text-[#9cb3a1] leading-relaxed">
                  {val.desc}
                </p>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
