import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import { StoreProvider } from './context/StoreContext'
import { ThemeProvider } from './context/ThemeContext'
import Footer from './components/Footer'
import Header from './components/Header'
import QuickViewModal from './components/QuickViewModal'
import ToastContainer from './components/ToastContainer'
import AboutPage from './pages/AboutPage'
import CartPage from './pages/CartPage'
import ContactPage from './pages/ContactPage'
import HomePage from './pages/HomePage'
import OrderStatusPage from './pages/OrderStatusPage'
import ProductsPage from './pages/ProductsPage'
import WishlistPage from './pages/WishlistPage'

function ScrollToTop() {
  const { pathname, search } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, search])
  return null
}

function AppShell() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f6f8f4] dark:bg-[#0d1510] text-[#162219] dark:text-[#ecf3ed] transition-colors">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/orders" element={<OrderStatusPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
      <QuickViewModal />
      <ToastContainer />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <StoreProvider>
          <BrowserRouter>
            <AppShell />
          </BrowserRouter>
        </StoreProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}
