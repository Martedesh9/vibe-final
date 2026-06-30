import { useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { wineriesData } from '../data/wineries'
import './WineryDetail.css'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function WineryDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart, items } = useCart()
  const { currentUser, isLoggedIn, toggleFavorite } = useAuth()

  const winery = useMemo(
    () => wineriesData.find((w) => w.id === id),
    [id],
  )

  if (!winery) {
    return (
      <div className="page-placeholder">
        <h1>მარანი ვერ მოიძებნა</h1>
        <p>მითითებული მარანის გვერდი არ არსებობს ან შეიცვალა.</p>
        <Link to="/maranebi" className="btn btn-outline" style={{ marginTop: '1.5rem' }}>
          მეღვინეების სიაში დაბრუნება
        </Link>
      </div>
    )
  }

  return (
    <section className="winery-detail">
      <div className="container">

        {/* Hero: photo + info */}
        <div className="wd-hero">
          <img
            src={winery.image}
            alt={winery.name}
            className="wd-hero__image"
          />
          <div className="wd-info">
            <span className="wd-region">{winery.region} · {winery.village}</span>
            <h1 className="wd-title">{winery.name}</h1>
            <p className="wd-description">{winery.description}</p>

            <div className="wd-stats">
              <div className="wd-stat">
                <span className="wd-stat__num">{winery.foundedYear}</span>
                <span className="wd-stat__label">დაარსდა</span>
              </div>
              <div className="wd-stat">
                <span className="wd-stat__num">{winery.wines.length}</span>
                <span className="wd-stat__label">ღვინო</span>
              </div>
              <div className="wd-stat">
                <span className="wd-stat__num">{winery.vineyardHa}ჰა</span>
                <span className="wd-stat__label">ვენახი</span>
              </div>
            </div>

            <div className="wd-actions">
              <Link
                to={`/marani/${winery.id}/viziti`}
                className="btn btn-primary wd-book-btn"
              >
                ვიზიტის დაჯავშნა →
              </Link>
              {currentUser?.role === 'guest' && (
                <button
                  type="button"
                  className="btn btn-outline wd-favorite-btn"
                  onClick={() => toggleFavorite(winery.id)}
                >
                  {currentUser.favorites?.includes(winery.id)
                    ? 'ფავორიტიდან წაშლა'
                    : 'ფავორიტებში დამატება'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="winery-gallery">
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
        </div>

        {/* History */}
        <section className="winery-history">
          <h2 className="section-title">მარანის ისტორია</h2>
          <p>{winery.history}</p>
        </section>

        {/* Wines */}
        <section className="winery-wines">
          <h2 className="section-title">ჩვენი ღვინოები</h2>
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
                    <p className="wine-card__price">{wine.priceGel} ₾</p>
                    <p className="wine-card__description">{wine.description}</p>
                    <button
                      type="button"
                      className="btn btn-outline wine-card__button"
                      onClick={() => {
                        if (!isLoggedIn) { navigate('/auth'); return }
                        addToCart(wine.id)
                      }}
                    >
                      {alreadyAdded ? `კალათაშია (${cartItem.quantity})` : 'კალათაში დამატება'}
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

      </div>
    </section>
  )
}
