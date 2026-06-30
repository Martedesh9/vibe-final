import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { wineriesData } from '../data/wineries'

const USERS_STORAGE_KEY = 'marani_users_v1'
const SESSION_STORAGE_KEY = 'marani_session_v1'

const AuthContext = createContext(null)

const safeParse = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

const getStoredUsers = () => safeParse(localStorage.getItem(USERS_STORAGE_KEY), [])
const getStoredSession = () => safeParse(localStorage.getItem(SESSION_STORAGE_KEY), null)

const chooseWineryId = (users) => {
  const taken = new Set(users.filter((u) => u.role === 'winemaker').map((u) => u.wineryId))
  return wineriesData.find((w) => !taken.has(w.id))?.id || wineriesData[0]?.id
}

const createWineryProfile = (wineryId) => {
  const winery = wineriesData.find((item) => item.id === wineryId)
  if (!winery) return { description: '', wines: [] }
  return {
    description: winery.description,
    wines: winery.wines,
  }
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(getStoredUsers)
  const [sessionUserId, setSessionUserId] = useState(getStoredSession)

  useEffect(() => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
  }, [users])

  useEffect(() => {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionUserId))
  }, [sessionUserId])

  const currentUser = useMemo(
    () => users.find((user) => user.id === sessionUserId) || null,
    [users, sessionUserId],
  )

  const register = ({ name, email, password, role }) => {
    const normalizedEmail = email.trim().toLowerCase()
    if (users.some((user) => user.email === normalizedEmail)) {
      return { ok: false, error: 'ეს მეილი უკვე გამოყენებულია.' }
    }

    const newUser = {
      id: `u-${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      password,
      role,
      favorites: [],
      orders: [],
      visits: [],
      incomingOrders: [],
      incomingVisits: [],
      wineryId: null,
      wineryProfile: role === 'winemaker' ? { description: '', wines: [] } : null,
    }
    setUsers((prev) => [...prev, newUser])
    setSessionUserId(newUser.id)
    return { ok: true }
  }

  const login = ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase()
    const found = users.find(
      (user) => user.email === normalizedEmail && user.password === password,
    )
    if (!found) return { ok: false, error: 'მეილი ან პაროლი არასწორია.' }
    setSessionUserId(found.id)
    return { ok: true }
  }

  const logout = () => {
    setSessionUserId(null)
    localStorage.removeItem('marani_cart_v1')
  }

  const updateCurrentUser = (updater) => {
    if (!currentUser) return
    setUsers((prev) =>
      prev.map((user) => (user.id === currentUser.id ? { ...user, ...updater(user) } : user)),
    )
  }

  const toggleFavorite = (wineryId) => {
    if (!currentUser || currentUser.role !== 'guest') return
    updateCurrentUser((user) => {
      const exists = user.favorites.includes(wineryId)
      return {
        favorites: exists
          ? user.favorites.filter((id) => id !== wineryId)
          : [...user.favorites, wineryId],
      }
    })
  }

  const saveOrder = ({ items, totalAmount, customer }) => {
    if (!currentUser) return
    const order = {
      id: `o-${Date.now()}`,
      createdAt: new Date().toISOString(),
      items,
      totalAmount,
      customer,
    }

    updateCurrentUser((user) => ({ orders: [order, ...user.orders] }))

    const wineryMap = new Map()
    items.forEach((item) => {
      const current = wineryMap.get(item.wine.wineryId) || []
      current.push(item)
      wineryMap.set(item.wine.wineryId, current)
    })

    setUsers((prev) =>
      prev.map((user) => {
        if (user.role !== 'winemaker' || !user.wineryId || !wineryMap.has(user.wineryId)) {
          return user
        }
        const incoming = {
          id: order.id,
          createdAt: order.createdAt,
          customer,
          items: wineryMap.get(user.wineryId),
        }
        return { ...user, incomingOrders: [incoming, ...(user.incomingOrders || [])] }
      }),
    )
  }

  const saveVisitRequest = ({ wineryId, wineryName, formData }) => {
    if (!currentUser) return
    const visit = {
      id: `v-${Date.now()}`,
      createdAt: new Date().toISOString(),
      wineryId,
      wineryName,
      ...formData,
    }
    updateCurrentUser((user) => ({ visits: [visit, ...user.visits] }))

    setUsers((prev) =>
      prev.map((user) => {
        if (user.role !== 'winemaker' || user.wineryId !== wineryId) return user
        return {
          ...user,
          incomingVisits: [visit, ...(user.incomingVisits || [])],
        }
      }),
    )
  }

  const updateWineryProfile = ({ description, wines }) => {
    if (!currentUser || currentUser.role !== 'winemaker') return
    updateCurrentUser(() => ({
      wineryProfile: {
        description,
        wines,
      },
    }))
  }

  const value = {
    currentUser,
    isLoggedIn: Boolean(currentUser),
    register,
    login,
    logout,
    toggleFavorite,
    saveOrder,
    saveVisitRequest,
    updateWineryProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
