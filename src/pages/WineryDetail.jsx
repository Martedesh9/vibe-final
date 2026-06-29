import { useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { wineriesData } from '../data/wineries'
import './WineryDetail.css'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const ORDER_RECEIVER_EMAIL = import.meta.env.VITE_ORDER_EMAIL || 'orders@example.com'

export default function WineryDetail() {
  const { id } = useParams()
  const [visitFormOpen, setVisitFormOpen] = useState(false)
  const [visitSubmitted, setVisitSubmitted] = useState(false)
  const [visitFormData, setVisitFormData] = useState({
    name: '',
    phone: '',
    date: '',
    guests: 2,
    note: '',
  })
  const { addToCart, items } = useCart()
  const { currentUser, toggleFavorite, saveVisitRequest } = useAuth()

  const winery = useMemo(
    () => wineriesData.find((currentWinery) => currentWinery.id === id),
    [id],
  )

  const onAddToCart = (wineId) => addToCart(wineId)

  const onSubmitVisitRequest = (event) => {
    event.preventDefault()

    const subject = encodeURIComponent(`ვიზიტის მოთხოვნა - ${winery.name}`)
    const body = encodeURIComponent(
      `ვიზიტის ახალი მოთხოვნა:\n\n` +
        `მარანი: ${winery.name}\n` +
        `რეგიონი/სოფელი: ${winery.region}, ${winery.village}\n\n` +
        `სახელი: ${visitFormData.name}\n` +
        `ტელეფონი: ${visitFormData.phone}\n` +
        `სასურველი თარიღი: ${visitFormData.date}\n` +
        `სტუმრების რაოდენობა: ${visitFormData.guests}\n` +
        `შენიშვნა: ${visitFormData.note || '-'}\n`,
    )

    window.location.href = `mailto:${ORDER_RECEIVER_EMAIL}?subject=${subject}&body=${body}`
    if (currentUser) {
      saveVisitRequest({
        wineryId: winery.id,
        wineryName: winery.name,
        formData: visitFormData,
      })
    }
    setVisitFormOpen(false)
    setVisitSubmitted(true)
    setVisitFormData({
      name: '',
      phone: '',
      date: '',
      guests: 2,
      note: '',
    })
  }

  if (!winery) {
    return (
      <div className="page-placeholder">
        <h1>მარანი ვერ მოიძებნა</h1>
        <p>მითითებული მარანის გვერდი არ არსებობს ან შეიცვალა.</p>
        <Link to="/maranebi" className="btn btn-outline" style={{ marginTop: '1.5rem' }}>
          მარნების სიაში დაბრუნება
        </Link>
      </div>
    )
  }

  return (
    <section className="winery-detail">
      <div className="container">
        <header className="winery-detail__header">
          <div>
            <h1 className="winery-detail__title">{winery.name}</h1>
            <p className="winery-detail__meta">
              {winery.region}, {winery.village} • დაარსდა {winery.foundedYear}
            </p>
          </div>
          <div className="winery-detail__head-actions">
            {winery.acceptsVisitors && (
              <span className="winery-detail__badge">სტუმრებს იღებს</span>
            )}
            {currentUser?.role === 'guest' && (
              <button
                type="button"
                className="btn btn-outline winery-detail__favorite"
                onClick={() => toggleFavorite(winery.id)}
              >
                {currentUser.favorites?.includes(winery.id)
                  ? 'ფავორიტიდან წაშლა'
                  : 'ფავორიტებში დამატება'}
              </button>
            )}
          </div>
        </header>

        <section className="winery-gallery">
          <img
            src={winery.image}
            alt={`${winery.name} მთავარი ფოტო`}
            className="winery-gallery__main"
          />
          <div className="winery-gallery__grid">
            {winery.gallery.map((photo, index) => (
              <img
                key={photo}
                src={photo}
                alt={`${winery.name} გალერეა ${index + 1}`}
                className="winery-gallery__thumb"
              />
            ))}
          </div>
        </section>

        <section className="winery-history">
          <h2 className="section-title">მარანის ისტორია</h2>
          <p>{winery.history}</p>
        </section>

        <section className="winery-wines">
          <h2 className="section-title">ღვინოები</h2>
          <div className="wine-grid">
            {winery.wines.map((wine) => {
              const cartItem = items.find((item) => item.wineId === wine.id)
              const alreadyAdded = Boolean(cartItem)

              return (
                <article key={wine.id} className="wine-card">
                  <img src={wine.image} alt={wine.name} className="wine-card__image" />
                  <div className="wine-card__body">
                    <h3 className="wine-card__name">{wine.name}</h3>
                    <p className="wine-card__type">{wine.type}</p>
                    <p className="wine-card__info">ჯიში: {wine.grape}</p>
                    <p className="wine-card__info">წელი: {wine.year}</p>
                    <p className="wine-card__price">{wine.priceGel} ლარი</p>
                    <p className="wine-card__description">{wine.description}</p>
                    <button
                      type="button"
                      className="btn btn-outline wine-card__button"
                      onClick={() => onAddToCart(wine.id)}
                    >
                      {alreadyAdded
                        ? `კალათაშია (${cartItem.quantity})`
                        : 'კალათაში დამატება'}
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <section className="visit-request">
          <button
            type="button"
            className="btn btn-primary visit-request__button"
            onClick={() => setVisitFormOpen(true)}
          >
            ვიზიტის მოთხოვნა
          </button>
          {visitSubmitted && (
            <p className="visit-request__success">
              მოთხოვნა გაიგზავნა, მალე დაგიკავშირდებით
            </p>
          )}
        </section>

        {visitFormOpen && (
          <div
            className="visit-modal"
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setVisitFormOpen(false)
            }}
          >
            <div className="visit-modal__content" role="dialog" aria-modal="true">
              <button
                type="button"
                className="visit-modal__close"
                aria-label="დახურვა"
                onClick={() => setVisitFormOpen(false)}
              >
                X
              </button>
              <form className="visit-form" onSubmit={onSubmitVisitRequest}>
                <h3 className="visit-form__title">ვიზიტის მოთხოვნა — {winery.name}</h3>
                <label className="visit-form__field">
                  სახელი
                  <input
                    required
                    type="text"
                    value={visitFormData.name}
                    onChange={(event) =>
                      setVisitFormData((prev) => ({ ...prev, name: event.target.value }))
                    }
                  />
                </label>
                <label className="visit-form__field">
                  ტელეფონი
                  <input
                    required
                    type="tel"
                    value={visitFormData.phone}
                    onChange={(event) =>
                      setVisitFormData((prev) => ({ ...prev, phone: event.target.value }))
                    }
                  />
                </label>
                <label className="visit-form__field">
                  სასურველი თარიღი
                  <input
                    required
                    type="date"
                    value={visitFormData.date}
                    onChange={(event) =>
                      setVisitFormData((prev) => ({ ...prev, date: event.target.value }))
                    }
                  />
                </label>
                <label className="visit-form__field">
                  სტუმრების რაოდენობა
                  <input
                    required
                    type="number"
                    min="1"
                    value={visitFormData.guests}
                    onChange={(event) =>
                      setVisitFormData((prev) => ({
                        ...prev,
                        guests: Math.max(1, Number(event.target.value) || 1),
                      }))
                    }
                  />
                </label>
                <label className="visit-form__field">
                  შენიშვნა
                  <textarea
                    rows="4"
                    value={visitFormData.note}
                    onChange={(event) =>
                      setVisitFormData((prev) => ({ ...prev, note: event.target.value }))
                    }
                  />
                </label>
                <button type="submit" className="btn btn-primary">
                  მოთხოვნის გაგზავნა
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
