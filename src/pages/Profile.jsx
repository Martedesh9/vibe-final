import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { wineriesData } from '../data/wineries'
import './Profile.css'

const formatDate = (value) =>
  new Date(value).toLocaleString('ka-GE', { dateStyle: 'medium', timeStyle: 'short' })

const emptyWine = {
  name: '',
  type: '',
  grape: '',
  year: new Date().getFullYear(),
  priceGel: '',
  description: '',
  image: '',
}

function Avatar({ name }) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
  return <div className="profile-avatar">{initials}</div>
}

export default function Profile() {
  const { currentUser, updateWineryProfile } = useAuth()
  const { items: cartItems, cartCount, totalAmount } = useCart()
  const [draft, setDraft] = useState(null)
  const [newWine, setNewWine] = useState(emptyWine)

  const favoriteWineries = useMemo(
    () => wineriesData.filter((w) => currentUser.favorites?.includes(w.id)),
    [currentUser],
  )

  useEffect(() => {
    if (currentUser?.role === 'winemaker') setDraft(currentUser.wineryProfile)
  }, [currentUser])

  const onSaveWineryProfile = () => {
    if (!draft) return
    updateWineryProfile(draft)
  }

  const addWine = () => {
    if (!newWine.name || !newWine.type) return
    setDraft((prev) => ({
      ...prev,
      wines: [
        ...prev.wines,
        {
          ...newWine,
          id: `custom-${Date.now()}`,
          year: Number(newWine.year),
          priceGel: Number(newWine.priceGel) || 0,
        },
      ],
    }))
    setNewWine(emptyWine)
  }

  const updateWineField = (wineId, key, value) => {
    setDraft((prev) => ({
      ...prev,
      wines: prev.wines.map((wine) => (wine.id === wineId ? { ...wine, [key]: value } : wine)),
    }))
  }

  const myWinery = wineriesData.find((w) => w.id === currentUser.wineryId)

  return (
    <section className="profile-page">
      <div className="container profile-page__wrap">

        {/* User card */}
        <div className="profile-hero">
          <Avatar name={currentUser.name} />
          <div className="profile-hero__info">
            <h1 className="profile-hero__name">{currentUser.name}</h1>
            <p className="profile-hero__email">{currentUser.email}</p>
          </div>
          <span className={`profile-role-badge ${currentUser.role === 'winemaker' ? 'profile-role-badge--winemaker' : ''}`}>
            {currentUser.role === 'guest' ? 'სტუმარი' : 'მეღვინე'}
          </span>
        </div>

        {currentUser.role === 'guest' ? (
          <>
            {/* Cart */}
            <div className="profile-block">
              <h2 className="profile-block__title">კალათა</h2>
              {cartCount === 0 ? (
                <p className="profile-empty">კალათა ცარიელია.</p>
              ) : (
                <div className="profile-cart">
                  <div className="profile-cart__summary">
                    <span>{cartCount} პოზიცია</span>
                    <span className="profile-cart__total">{totalAmount} ₾</span>
                  </div>
                  <div className="profile-timeline">
                    {cartItems.map((item) => (
                      <div key={item.wineId} className="profile-timeline__item">
                        <div className="profile-timeline__dot" />
                        <div className="profile-timeline__body">
                          <p className="profile-timeline__title">{item.wine.name}</p>
                          <p className="profile-timeline__meta">{item.wine.wineryName} · {item.quantity} ბოთლი · {item.lineTotal} ₾</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: '1rem' }}>
                    <Link to="/kalata" className="btn btn-primary">შეკვეთის გაფორმება →</Link>
                  </div>
                </div>
              )}
            </div>

            {/* Favorites */}
            <div className="profile-block">
              <h2 className="profile-block__title">ფავორიტი მარნები</h2>
              {favoriteWineries.length === 0 ? (
                <p className="profile-empty">ჯერ ფავორიტი მარანი არ გაქვს.</p>
              ) : (
                <div className="profile-winery-grid">
                  {favoriteWineries.map((winery) => (
                    <Link key={winery.id} to={`/marani/${winery.id}`} className="profile-winery-card">
                      <img src={winery.image} alt={winery.name} className="profile-winery-card__img" />
                      <span className="profile-winery-card__name">{winery.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Visits */}
            <div className="profile-block">
              <h2 className="profile-block__title">ვიზიტის ჯავშნები</h2>
              {currentUser.visits?.length ? (
                <div className="profile-timeline">
                  {currentUser.visits.map((visit) => (
                    <div key={visit.id} className="profile-timeline__item">
                      <div className="profile-timeline__dot" />
                      <div className="profile-timeline__body">
                        <p className="profile-timeline__title">{visit.wineryName}</p>
                        <p className="profile-timeline__meta">{visit.date} · {visit.guests} სტუმარი</p>
                        <p className="profile-timeline__date">{formatDate(visit.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="profile-empty">ვიზიტის ჯავშანი ჯერ არ გაქვს.</p>
              )}
            </div>

            {/* Orders */}
            <div className="profile-block">
              <h2 className="profile-block__title">შეკვეთების ისტორია</h2>
              {currentUser.orders?.length ? (
                <div className="profile-timeline">
                  {currentUser.orders.map((order) => (
                    <div key={order.id} className="profile-timeline__item">
                      <div className="profile-timeline__dot" />
                      <div className="profile-timeline__body">
                        <p className="profile-timeline__title">{order.totalAmount} ₾</p>
                        <p className="profile-timeline__meta">{order.items.length} პოზიცია</p>
                        <p className="profile-timeline__date">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="profile-empty">შეკვეთების ისტორია ცარიელია.</p>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Winery info */}
            {myWinery && (
              <div className="profile-block profile-block--winery-banner">
                <img src={myWinery.image} alt={myWinery.name} className="profile-winery-banner__img" />
                <div className="profile-winery-banner__info">
                  <span className="profile-winery-banner__region">{myWinery.region} · {myWinery.village}</span>
                  <h2 className="profile-winery-banner__name">{myWinery.name}</h2>
                  <label className="profile-field">
                    <span>მარნის აღწერა</span>
                    <textarea
                      rows="3"
                      value={draft?.description || ''}
                      onChange={(e) => setDraft((p) => ({ ...p, description: e.target.value }))}
                    />
                  </label>
                  <button type="button" className="btn btn-primary" onClick={onSaveWineryProfile}>
                    შენახვა
                  </button>
                </div>
              </div>
            )}

            {/* Wines */}
            <div className="profile-block">
              <h2 className="profile-block__title">ჩემი ღვინოები</h2>
              <div className="wine-edit-grid">
                {draft?.wines?.map((wine) => (
                  <div key={wine.id} className="wine-edit-card">
                    <input placeholder="დასახელება" value={wine.name}
                      onChange={(e) => updateWineField(wine.id, 'name', e.target.value)} />
                    <input placeholder="ტიპი" value={wine.type}
                      onChange={(e) => updateWineField(wine.id, 'type', e.target.value)} />
                    <input placeholder="ჯიში" value={wine.grape}
                      onChange={(e) => updateWineField(wine.id, 'grape', e.target.value)} />
                    <input type="number" placeholder="წელი" value={wine.year}
                      onChange={(e) => updateWineField(wine.id, 'year', e.target.value)} />
                    <input type="number" placeholder="ფასი ₾" value={wine.priceGel}
                      onChange={(e) => updateWineField(wine.id, 'priceGel', e.target.value)} />
                  </div>
                ))}
              </div>

              <div className="wine-add-form">
                <h3 className="wine-add-form__title">ახალი ღვინის დამატება</h3>
                <div className="wine-add-form__grid">
                  {[
                    ['დასახელება', 'name', 'text'],
                    ['ტიპი', 'type', 'text'],
                    ['ჯიში', 'grape', 'text'],
                    ['წელი', 'year', 'number'],
                    ['ფასი ₾', 'priceGel', 'number'],
                  ].map(([placeholder, key, type]) => (
                    <input key={key} type={type} placeholder={placeholder}
                      value={newWine[key]}
                      onChange={(e) => setNewWine((p) => ({ ...p, [key]: e.target.value }))} />
                  ))}
                </div>
                <textarea rows="2" placeholder="აღწერა" value={newWine.description}
                  onChange={(e) => setNewWine((p) => ({ ...p, description: e.target.value }))} />
                <input placeholder="ფოტოს URL" value={newWine.image}
                  onChange={(e) => setNewWine((p) => ({ ...p, image: e.target.value }))} />
                <button type="button" className="btn btn-outline" onClick={addWine}>
                  + დამატება
                </button>
              </div>

              <div style={{ marginTop: '1rem' }}>
                <button type="button" className="btn btn-primary" onClick={onSaveWineryProfile}>
                  ცვლილებების შენახვა
                </button>
              </div>
            </div>

            {/* Incoming visits */}
            <div className="profile-block">
              <h2 className="profile-block__title">შემოსული ვიზიტის ჯავშნები</h2>
              {currentUser.incomingVisits?.length ? (
                <div className="profile-timeline">
                  {currentUser.incomingVisits.map((visit) => (
                    <div key={visit.id} className="profile-timeline__item">
                      <div className="profile-timeline__dot" />
                      <div className="profile-timeline__body">
                        <p className="profile-timeline__title">{visit.name}</p>
                        <p className="profile-timeline__meta">{visit.date} · {visit.guests} სტუმარი · {visit.phone}</p>
                        <p className="profile-timeline__date">{formatDate(visit.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="profile-empty">ვიზიტის ჯავშნები ჯერ არ არის.</p>
              )}
            </div>

            {/* Incoming orders */}
            <div className="profile-block">
              <h2 className="profile-block__title">შემოსული შეკვეთები</h2>
              {currentUser.incomingOrders?.length ? (
                <div className="profile-timeline">
                  {currentUser.incomingOrders.map((order) => (
                    <div key={order.id} className="profile-timeline__item">
                      <div className="profile-timeline__dot" />
                      <div className="profile-timeline__body">
                        <p className="profile-timeline__title">{order.customer?.name}</p>
                        <p className="profile-timeline__meta">{order.customer?.phone} · {order.items.length} პოზიცია</p>
                        <p className="profile-timeline__date">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="profile-empty">შეკვეთები ჯერ არ არის.</p>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
