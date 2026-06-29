import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import './Navbar.css'
import BrandMark from './BrandMark'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { to: '/', label: 'მთავარი', end: true },
  { to: '/maranebi', label: 'მარნები' },
  { to: '/kalata', label: 'კალათა' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { currentUser, isLoggedIn, logout } = useAuth()

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo" onClick={() => setMenuOpen(false)}>
          <span className="navbar__logo-icon" aria-hidden="true">
            <BrandMark className="navbar__logo-svg" />
          </span>
          <span className="navbar__logo-text">მარანი</span>
        </Link>

        <nav className={`navbar__nav ${menuOpen ? 'navbar__nav--open' : ''}`}>
          {navLinks.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `navbar__link ${isActive ? 'navbar__link--active' : ''}`
              }
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </NavLink>
          ))}

          {isLoggedIn ? (
            <>
              <span className="navbar__user">{currentUser.name}</span>
              <NavLink
                to="/profil"
                className={({ isActive }) =>
                  `navbar__link ${isActive ? 'navbar__link--active' : ''}`
                }
                onClick={() => setMenuOpen(false)}
              >
                პროფილი
              </NavLink>
              <button
                type="button"
                className="navbar__link navbar__logout"
                onClick={() => {
                  logout()
                  setMenuOpen(false)
                }}
              >
                გასვლა
              </button>
            </>
          ) : (
            <NavLink
              to="/auth"
              className={({ isActive }) =>
                `navbar__link ${isActive ? 'navbar__link--active' : ''}`
              }
              onClick={() => setMenuOpen(false)}
            >
              შესვლა
            </NavLink>
          )}
        </nav>

        <button
          className={`navbar__toggle ${menuOpen ? 'navbar__toggle--open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'მენიუს დახურვა' : 'მენიუს გახსნა'}
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}
