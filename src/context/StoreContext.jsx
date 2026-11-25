import { useCallback, useEffect, useMemo, useState } from 'react'
import { products } from '../data/products'
import { StoreContext, useLanguage } from './contexts'

const CART_KEY = 'freshbozor_cart'
const WISHLIST_KEY = 'freshbozor_wishlist'
const ORDERS_KEY = 'freshbozor_orders'

function readJsonStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function StoreProvider({ children }) {
  const { t, localize } = useLanguage()

  const [cart, setCart] = useState(() => readJsonStorage(CART_KEY, []))
  const [wishlist, setWishlist] = useState(() => readJsonStorage(WISHLIST_KEY, []))
  const [orders, setOrders] = useState(() => readJsonStorage(ORDERS_KEY, []))
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart))
    } catch {
      // ignore storage errors
    }
  }, [cart])

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist))
    } catch {
      // ignore storage errors
    }
  }, [wishlist])

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
    } catch {
      // ignore storage errors
    }
  }, [orders])

  const pushToast = useCallback((message, type = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    setToasts((prev) => [...prev.slice(-2), { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id))
    }, 2800)
  }, [])

  const addToCart = useCallback(
    (productId, qty = 1) => {
      const prod = products.find((p) => p.id === productId)
      if (!prod) return

      setCart((prev) => {
        const existing = prev.find((item) => item.id === productId)
        if (existing) {
          return prev.map((item) =>
            item.id === productId ? { ...item, quantity: item.quantity + qty } : item
          )
        }
        return [...prev, { id: productId, quantity: qty }]
      })

      pushToast(`${localize(prod.name)} — ${t.toasts.addedToCart}`)
    },
    [localize, pushToast, t.toasts.addedToCart]
  )

  const updateCartQty = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== productId))
      return
    }
    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
    )
  }, [])

  const removeFromCart = useCallback((productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId))
  }, [])

  const clearCart = useCallback(() => {
    setCart([])
  }, [])

  const toggleWishlist = useCallback(
    (productId) => {
      const prod = products.find((p) => p.id === productId)
      if (!prod) return

      const exists = wishlist.includes(productId)
      setWishlist((prev) =>
        exists
          ? prev.filter((id) => id !== productId)
          : prev.includes(productId)
            ? prev
            : [...prev, productId]
      )
      pushToast(
        `${localize(prod.name)} — ${exists ? t.toasts.removedWishlist : t.toasts.addedWishlist}`,
        exists ? 'info' : 'success'
      )
    },
    [wishlist, localize, pushToast, t.toasts.addedWishlist, t.toasts.removedWishlist]
  )

  const clearWishlist = useCallback(() => {
    setWishlist([])
  }, [])

  const addAllWishlistToCart = useCallback(() => {
    if (wishlist.length === 0) return
    setCart((prev) => {
      const next = [...prev]
      for (const productId of wishlist) {
        const idx = next.findIndex((item) => item.id === productId)
        if (idx >= 0) {
          next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 }
        } else {
          next.push({ id: productId, quantity: 1 })
        }
      }
      return next
    })
    pushToast(t.toasts.allWishlistToCart)
  }, [wishlist, pushToast, t.toasts.allWishlistToCart])

  const placeOrder = useCallback((orderDetails) => {
    const orderNumber = orderDetails.id || `FB-${Math.floor(100000 + Math.random() * 900000)}`
    const newOrder = {
      createdAt: new Date().toISOString(),
      ...orderDetails,
      id: orderNumber,
    }
    setOrders((prev) => [newOrder, ...prev])
    setCart([])
    return newOrder
  }, [])

  const value = useMemo(() => {
    const cartItems = cart
      .map((entry) => {
        const product = products.find((p) => p.id === entry.id)
        return product ? { ...product, quantity: entry.quantity } : null
      })
      .filter(Boolean)

    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
    const cartSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const wishlistProducts = wishlist
      .map((id) => products.find((p) => p.id === id))
      .filter(Boolean)

    const getCartQty = (productId) => {
      const found = cart.find((item) => item.id === productId)
      return found ? found.quantity : 0
    }

    const isWishlisted = (productId) => wishlist.includes(productId)

    return {
      cart,
      cartItems,
      cartCount,
      cartSubtotal,
      wishlist,
      wishlistProducts,
      wishlistCount: wishlistProducts.length,
      orders,
      quickViewProduct,
      setQuickViewProduct,
      toasts,
      addToCart,
      updateCartQty,
      removeFromCart,
      clearCart,
      toggleWishlist,
      clearWishlist,
      addAllWishlistToCart,
      placeOrder,
      getCartQty,
      isWishlisted,
    }
  }, [
    cart,
    wishlist,
    orders,
    quickViewProduct,
    toasts,
    addToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
    toggleWishlist,
    clearWishlist,
    addAllWishlistToCart,
    placeOrder,
  ])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
