import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Wineries from './pages/Wineries'
import WineryDetail from './pages/WineryDetail'
import VisitBooking from './pages/VisitBooking'
import BookingConfirmation from './pages/BookingConfirmation'
import Cart from './pages/Cart'
import AuthPage from './pages/AuthPage'
import Profile from './pages/Profile'
import { useAuth } from './context/AuthContext'

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth()
  return isLoggedIn ? children : <Navigate to="/auth" replace />
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="maranebi" element={<Wineries />} />
        <Route path="marani/:id" element={<WineryDetail />} />
        <Route path="marani/:id/viziti" element={<VisitBooking />} />
        <Route path="marani/:id/dadastureba" element={<BookingConfirmation />} />
        <Route path="kalata" element={<Cart />} />
        <Route path="auth" element={<AuthPage />} />
        <Route
          path="profil"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  )
}
