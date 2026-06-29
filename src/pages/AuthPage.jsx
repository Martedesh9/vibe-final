import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './AuthPage.css'

export default function AuthPage() {
  const { isLoggedIn, login, register } = useAuth()
  const [mode, setMode] = useState('login')
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    role: 'guest',
    name: '',
    email: '',
    password: '',
  })

  if (isLoggedIn) return <Navigate to="/profil" replace />

  const onSubmit = (event) => {
    event.preventDefault()
    setError('')
    const action = mode === 'login' ? login : register
    const result = action(form)
    if (!result.ok) setError(result.error)
  }

  return (
    <section className="auth-page">
      <div className="container auth-page__wrap">
        <div className="auth-card">
          <div className="auth-card__tabs">
            <button
              type="button"
              className={mode === 'login' ? 'is-active' : ''}
              onClick={() => setMode('login')}
            >
              შესვლა
            </button>
            <button
              type="button"
              className={mode === 'register' ? 'is-active' : ''}
              onClick={() => setMode('register')}
            >
              რეგისტრაცია
            </button>
          </div>

          <form className="auth-form" onSubmit={onSubmit}>
            <label>
              ვინ ხარ?
              <select
                value={form.role}
                onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}
              >
                <option value="guest">სტუმარი</option>
                <option value="winemaker">მეღვინე</option>
              </select>
            </label>

            {mode === 'register' && (
              <label>
                სახელი
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                />
              </label>
            )}

            <label>
              მეილი
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              />
            </label>
            <label>
              პაროლი
              <input
                required
                type="password"
                value={form.password}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, password: event.target.value }))
                }
              />
            </label>

            {error && <p className="auth-form__error">{error}</p>}

            <button type="submit" className="btn btn-primary auth-form__submit">
              {mode === 'login' ? 'შესვლა' : 'რეგისტრაცია'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
