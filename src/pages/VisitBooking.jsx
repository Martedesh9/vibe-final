import { useState, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { wineriesData } from '../data/wineries'
import { useAuth } from '../context/AuthContext'
import './VisitBooking.css'

const ORDER_RECEIVER_EMAIL = import.meta.env.VITE_ORDER_EMAIL || 'orders@example.com'

export default function VisitBooking() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser, saveVisitRequest } = useAuth()

  const winery = useMemo(() => wineriesData.find((w) => w.id === id), [id])
  const [formData, setFormData] = useState({ name: '', phone: '', date: '', guests: 2 })
  const [slide, setSlide] = useState(0)

  if (!winery) {
    return (
      <div className="page-placeholder">
        <h1>მარანი ვერ მოიძებნა</h1>
        <Link to="/maranebi" className="btn btn-outline" style={{ marginTop: '1.5rem' }}>
          მეღვინეების სიაში
        </Link>
      </div>
    )
  }

  const totalPrice = formData.guests * winery.visit.pricePerPerson
  const allPhotos = [winery.image, ...winery.gallery]

  const onSubmit = (e) => {
    e.preventDefault()
    if (!currentUser) { navigate('/auth'); return }
    const subject = encodeURIComponent(`ვიზიტის ჯავშანი — ${winery.name}`)
    const body = encodeURIComponent(
      `მარანი: ${winery.name}\n` +
      `თარიღი: ${formData.date}\n` +
      `სტუმრები: ${formData.guests}\n` +
      `სახელი: ${formData.name}\n` +
      `ტელეფონი: ${formData.phone}\n` +
      `სრული ფასი: ₾${totalPrice}`
    )
    window.location.href = `mailto:${ORDER_RECEIVER_EMAIL}?subject=${subject}&body=${body}`
    if (currentUser) {
      saveVisitRequest({ wineryId: winery.id, wineryName: winery.name, formData })
    }
    navigate(`/marani/${id}/dadastureba`, {
      state: {
        wineryName: winery.name,
        date: formData.date,
        guests: formData.guests,
        totalPrice,
      },
    })
  }

  const prevSlide = () => setSlide((s) => (s - 1 + allPhotos.length) % allPhotos.length)
  const nextSlide = () => setSlide((s) => (s + 1) % allPhotos.length)

  return (
    <section className="visit-booking">
      <div className="container">
        <Link to={`/marani/${id}`} className="visit-booking__back">
          ← {winery.name}-ის გვერდი
        </Link>
        <h1 className="visit-booking__title">ვიზიტი {winery.name}-ში</h1>

        <div className="visit-booking__layout">
          {/* LEFT */}
          <div className="visit-booking__left">
            <div className="vb-includes">
              <h2 className="vb-includes__title">რა შედის ვიზიტში</h2>
              <ul className="vb-includes__list">
                {winery.visit.includes.map((item) => (
                  <li key={item.title} className="vb-includes__item">
                    <span className="vb-includes__item-title">{item.title}</span>
                    <span className="vb-includes__item-detail">{item.detail}</span>
                  </li>
                ))}
              </ul>
              <p className="vb-price">
                ₾{winery.visit.pricePerPerson} <span>/ პირი</span>
              </p>
            </div>

            <div className="vb-carousel">
              <img src={allPhotos[slide]} alt={winery.name} className="vb-carousel__img" />
              <div className="vb-carousel__controls">
                <button type="button" onClick={prevSlide}>‹</button>
                <span>{slide + 1} / {allPhotos.length}</span>
                <button type="button" onClick={nextSlide}>›</button>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="visit-booking__right">
            <form className="vb-form" onSubmit={onSubmit}>
              <h2 className="vb-form__title">დაჯავშნე ვიზიტი</h2>

              <label className="vb-form__field">
                თარიღი
                <input
                  required
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))}
                />
              </label>

              <label className="vb-form__field">
                სტუმრების რაოდენობა
                <div className="vb-form__guests">
                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, guests: Math.max(1, p.guests - 1) }))}
                  >
                    −
                  </button>
                  <span>{formData.guests}</span>
                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, guests: p.guests + 1 }))}
                  >
                    +
                  </button>
                </div>
              </label>

              <label className="vb-form__field">
                სახელი
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                />
              </label>

              <label className="vb-form__field">
                ტელეფონი
                <input
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                />
              </label>

              <div className="vb-form__total">
                სრული ფასი: <strong>₾{totalPrice}</strong>
              </div>

              <button type="submit" className="btn btn-primary vb-form__submit">
                ჯავშნის გაგზავნა
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
