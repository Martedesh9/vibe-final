import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { wineriesData } from '../data/wineries'
import './Profile.css'

const formatDate = (value) =>
  new Date(value).toLocaleString('ka-GE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

const emptyWine = {
  name: '',
  type: '',
  grape: '',
  year: new Date().getFullYear(),
  priceGel: '',
  description: '',
  image: '',
}

export default function Profile() {
  const { currentUser, updateWineryProfile } = useAuth()
  const [draft, setDraft] = useState(null)
  const [newWine, setNewWine] = useState(emptyWine)

  const favoriteWineries = useMemo(
    () => wineriesData.filter((w) => currentUser.favorites?.includes(w.id)),
    [currentUser],
  )

  useEffect(() => {
    if (currentUser?.role === 'winemaker') {
      setDraft(currentUser.wineryProfile)
    }
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

  return (
    <section className="profile-page">
      <div className="container profile-page__wrap">
        <header className="profile-head">
          <h1 className="section-title">პროფილი</h1>
          <p>
            {currentUser.name} • {currentUser.role === 'guest' ? 'სტუმარი' : 'მეღვინე'}
          </p>
          <p>{currentUser.email}</p>
        </header>

        {currentUser.role === 'guest' ? (
          <>
            <section className="profile-block">
              <h2>ფავორიტი მარნები</h2>
              {favoriteWineries.length === 0 ? (
                <p>ჯერ ფავორიტი მარანი არ გაქვს.</p>
              ) : (
                <ul className="profile-list">
                  {favoriteWineries.map((winery) => (
                    <li key={winery.id}>
                      <Link to={`/marani/${winery.id}`}>{winery.name}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="profile-block">
              <h2>შეკვეთების ისტორია</h2>
              {currentUser.orders?.length ? (
                <ul className="profile-cards">
                  {currentUser.orders.map((order) => (
                    <li key={order.id}>
                      <strong>{formatDate(order.createdAt)}</strong>
                      <p>ჯამი: {order.totalAmount} ლარი</p>
                      <p>პოზიციები: {order.items.length}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>შეკვეთების ისტორია ჯერ ცარიელია.</p>
              )}
            </section>

            <section className="profile-block">
              <h2>ვიზიტის მოთხოვნები</h2>
              {currentUser.visits?.length ? (
                <ul className="profile-cards">
                  {currentUser.visits.map((visit) => (
                    <li key={visit.id}>
                      <strong>{visit.wineryName}</strong>
                      <p>{formatDate(visit.createdAt)}</p>
                      <p>სტუმრები: {visit.guests}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>ვიზიტის მოთხოვნა ჯერ არ გაქვს.</p>
              )}
            </section>
          </>
        ) : (
          <>
            <section className="profile-block">
              <h2>ჩემი მარანი</h2>
              <p>
                {wineriesData.find((w) => w.id === currentUser.wineryId)?.name} (
                {currentUser.wineryId})
              </p>
              <label className="profile-field">
                მარნის აღწერა
                <textarea
                  rows="4"
                  value={draft?.description || ''}
                  onChange={(event) =>
                    setDraft((prev) => ({ ...prev, description: event.target.value }))
                  }
                />
              </label>
            </section>

            <section className="profile-block">
              <h2>ჩემი ღვინოები</h2>
              <div className="profile-cards">
                {draft?.wines?.map((wine) => (
                  <div key={wine.id} className="wine-edit">
                    <input
                      value={wine.name}
                      onChange={(event) => updateWineField(wine.id, 'name', event.target.value)}
                    />
                    <input
                      value={wine.type}
                      onChange={(event) => updateWineField(wine.id, 'type', event.target.value)}
                    />
                    <input
                      value={wine.grape}
                      onChange={(event) => updateWineField(wine.id, 'grape', event.target.value)}
                    />
                    <input
                      type="number"
                      value={wine.year}
                      onChange={(event) => updateWineField(wine.id, 'year', event.target.value)}
                    />
                    <input
                      type="number"
                      value={wine.priceGel}
                      onChange={(event) =>
                        updateWineField(wine.id, 'priceGel', event.target.value)
                      }
                    />
                  </div>
                ))}
              </div>
              <div className="wine-add">
                <h3>ახალი ღვინის დამატება</h3>
                <input
                  placeholder="დასახელება"
                  value={newWine.name}
                  onChange={(event) =>
                    setNewWine((prev) => ({ ...prev, name: event.target.value }))
                  }
                />
                <input
                  placeholder="ტიპი"
                  value={newWine.type}
                  onChange={(event) =>
                    setNewWine((prev) => ({ ...prev, type: event.target.value }))
                  }
                />
                <input
                  placeholder="ჯიში"
                  value={newWine.grape}
                  onChange={(event) =>
                    setNewWine((prev) => ({ ...prev, grape: event.target.value }))
                  }
                />
                <input
                  type="number"
                  placeholder="წელი"
                  value={newWine.year}
                  onChange={(event) =>
                    setNewWine((prev) => ({ ...prev, year: event.target.value }))
                  }
                />
                <input
                  type="number"
                  placeholder="ფასი"
                  value={newWine.priceGel}
                  onChange={(event) =>
                    setNewWine((prev) => ({ ...prev, priceGel: event.target.value }))
                  }
                />
                <textarea
                  rows="3"
                  placeholder="აღწერა"
                  value={newWine.description}
                  onChange={(event) =>
                    setNewWine((prev) => ({ ...prev, description: event.target.value }))
                  }
                />
                <input
                  placeholder="ფოტოს URL"
                  value={newWine.image}
                  onChange={(event) =>
                    setNewWine((prev) => ({ ...prev, image: event.target.value }))
                  }
                />
                <button type="button" className="btn btn-outline" onClick={addWine}>
                  დამატება
                </button>
              </div>
              <button type="button" className="btn btn-primary" onClick={onSaveWineryProfile}>
                ცვლილებების შენახვა
              </button>
            </section>

            <section className="profile-block">
              <h2>შემოსული ვიზიტის მოთხოვნები</h2>
              {currentUser.incomingVisits?.length ? (
                <ul className="profile-cards">
                  {currentUser.incomingVisits.map((visit) => (
                    <li key={visit.id}>
                      <strong>{visit.name}</strong>
                      <p>{visit.phone}</p>
                      <p>{visit.date} • სტუმრები: {visit.guests}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>ვიზიტის მოთხოვნები ჯერ არ არის.</p>
              )}
            </section>

            <section className="profile-block">
              <h2>შემოსული შეკვეთები</h2>
              {currentUser.incomingOrders?.length ? (
                <ul className="profile-cards">
                  {currentUser.incomingOrders.map((order) => (
                    <li key={order.id}>
                      <strong>{order.customer.name}</strong>
                      <p>{order.customer.phone}</p>
                      <p>პოზიციები: {order.items.length}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>შეკვეთები ჯერ არ არის.</p>
              )}
            </section>
          </>
        )}
      </div>
    </section>
  )
}
