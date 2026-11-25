import { Link } from 'react-router-dom'
import { Clock, Mail, MapPin, Phone, ShoppingBasket } from 'lucide-react'
import { categories } from '../data/categories'
import { useLanguage } from '../context/contexts'

export default function Footer() {
  const { t, localize } = useLanguage()

  return (
    <footer className="bg-[#164219] dark:bg-[#09120c] text-emerald-50 border-t border-[#225826] dark:border-[#18291e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-1 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-white">
                <ShoppingBasket className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-xl font-extrabold tracking-tight text-white font-display">
                  Fresh<span className="text-[#86efac]">Bozor</span>
                </span>
                <span className="block text-[11px] text-emerald-200/80">{t.brand.tagline}</span>
              </div>
            </Link>
            <p className="text-sm text-emerald-100/80 leading-relaxed">{t.brand.description}</p>
            <div className="flex items-center gap-2.5 pt-1">
              {['TG', 'IG', 'FB', 'YT'].map((social) => (
                <a
                  key={social}
                  href="#top"
                  onClick={(e) => {
                    e.preventDefault()
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#4ade80] hover:text-[#0d2610] flex items-center justify-center text-xs font-bold transition-colors"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              {t.footer.quickLinks}
            </h3>
            <ul className="space-y-2.5 text-sm text-emerald-100/80">
              <li>
                <Link to="/" className="hover:text-[#86efac] transition-colors">
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-[#86efac] transition-colors">
                  {t.nav.products}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#86efac] transition-colors">
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#86efac] transition-colors">
                  {t.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              {t.footer.customerService}
            </h3>
            <ul className="space-y-2.5 text-sm text-emerald-100/80">
              <li>
                <Link to="/wishlist" className="hover:text-[#86efac] transition-colors">
                  {t.nav.wishlist}
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-[#86efac] transition-colors">
                  {t.nav.cart}
                </Link>
              </li>
              <li>
                <Link to="/products?deals=1" className="hover:text-[#86efac] transition-colors">
                  {t.nav.dealsBadge}
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-[#86efac] transition-colors">
                  {t.footer.orderTracking}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#86efac] transition-colors">
                  {t.footer.deliveryTerms}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#86efac] transition-colors">
                  {t.footer.returnPolicy}
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              {t.footer.categoriesTitle}
            </h3>
            <ul className="space-y-2.5 text-sm text-emerald-100/80">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/products?category=${cat.id}`}
                    className="hover:text-[#86efac] transition-colors"
                  >
                    {localize(cat.name)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Payment */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              {t.footer.contactTitle}
            </h3>
            <ul className="space-y-2.5 text-sm text-emerald-100/85">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#86efac] shrink-0 mt-0.5" />
                <span>{t.topbar.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#86efac] shrink-0" />
                <span>+998 (71) 200-45-78</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#86efac] shrink-0" />
                <span>info@freshbozor.uz</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#86efac] shrink-0" />
                <span>{t.topbar.hours}</span>
              </li>
            </ul>

            <div className="pt-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-200/80 mb-2">
                {t.footer.acceptTitle}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {['UZCARD', 'HUMO', 'Payme', 'Click', 'VISA'].map((pay) => (
                  <span
                    key={pay}
                    className="px-2.5 py-1 rounded bg-white text-[#153e18] text-[11px] font-extrabold tracking-tight"
                  >
                    {pay}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 px-4 text-center text-xs text-emerald-200/80">
        {t.footer.copyright}
      </div>
    </footer>
  )
}
