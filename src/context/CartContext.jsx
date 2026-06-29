import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { wineriesData } from '../data/wineries'

const CART_STORAGE_KEY = 'marani_cart_v1'

const CartContext = createContext(null)

const sanitizeCart = (value) => {
  if (!Array.isArray(value)) return []

  return value
    .filter(
      (item) =>
        item &&
        typeof item.wineId === 'string' &&
        Number.isFinite(item.quantity) &&
        item.quantity > 0,
    )
    .map((item) => ({
      wineId: item.wineId,
      quantity: Math.floor(item.quantity),
    }))
}

const getInitialCart = () => {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    return sanitizeCart(JSON.parse(raw))
  } catch {
    return []
  }
}

const allWines = wineriesData.flatMap((winery) =>
  winery.wines.map((wine) => ({
    ...wine,
    wineryId: winery.id,
    wineryName: winery.name,
  })),
)

const wineById = Object.fromEntries(allWines.map((wine) => [wine.id, wine]))

export function CartProvider({ children }) {
  const [items, setItems] = useState(getInitialCart)

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addToCart = (wineId) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.wineId === wineId)
      if (existing) {
        return prev.map((item) =>
          item.wineId === wineId ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }
      return [...prev, { wineId, quantity: 1 }]
    })
  }

  const updateQuantity = (wineId, quantity) => {
    const safeQuantity = Math.max(1, Math.floor(Number(quantity) || 1))
    setItems((prev) =>
      prev.map((item) => (item.wineId === wineId ? { ...item, quantity: safeQuantity } : item)),
    )
  }

  const removeFromCart = (wineId) => {
    setItems((prev) => prev.filter((item) => item.wineId !== wineId))
  }

  const clearCart = () => {
    setItems([])
  }

  const cartDetailedItems = useMemo(
    () =>
      items
        .map((item) => {
          const wine = wineById[item.wineId]
          if (!wine) return null
          return {
            ...item,
            wine,
            lineTotal: wine.priceGel * item.quantity,
          }
        })
        .filter(Boolean),
    [items],
  )

  const totalAmount = useMemo(
    () => cartDetailedItems.reduce((sum, item) => sum + item.lineTotal, 0),
    [cartDetailedItems],
  )

  const cartCount = useMemo(
    () => cartDetailedItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartDetailedItems],
  )

  const value = useMemo(
    () => ({
      items: cartDetailedItems,
      cartCount,
      totalAmount,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
    }),
    [cartDetailedItems, cartCount, totalAmount],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
