import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import './Wineries.css'
import { wineriesData } from '../data/wineries'

const REGIONS = ['ყველა', 'კახეთი', 'რაჭა', 'იმერეთი', 'ქართლი', 'სამეგრელო']

export default function Wineries() {
  const [region, setRegion] = useState('ყველა')

  const filteredWineries = useMemo(() => {
    return wineriesData.filter((winery) =>
      region === 'ყველა' || winery.region === region
    )
  }, [region])

  return (
    <section className="wineries-page">
      <div className="container">
        <header className="wineries-page__header">
          <h1 className="section-title">ჩვენი მეღვინეები</h1>
          <p className="section-subtitle">
            აღმოაჩინე მცირე ოჯახური მარნები და დაჯავშნე ვიზიტი.
          </p>
        </header>

        <div className="wineries-filter">
          {REGIONS.map((r) => (
            <button
              key={r}
              type="button"
              className={`wineries-filter__btn ${region === r ? 'wineries-filter__btn--active' : ''}`}
              onClick={() => setRegion(r)}
            >
              {r}
            </button>
          ))}
        </div>

        {filteredWineries.length === 0 ? (
          <p className="wineries-empty">ამ ფილტრით მარანი ვერ მოიძებნა</p>
        ) : (
          <div className="wineries-grid">
            {filteredWineries.map((winery) => (
              <article key={winery.id} className="winery-item">
                <Link to={`/marani/${winery.id}`} className="winery-item__link">
                  <img src={winery.image} alt={winery.name} className="winery-item__image" />
                  <div className="winery-item__body">
                    <span className="winery-item__region-badge">
                      {winery.region} · {winery.village}
                    </span>
                    <h2 className="winery-item__name">{winery.name}</h2>
                    <p className="winery-item__stats">
                      {winery.wines.length} ღვინო · ₾{Math.min(...winery.wines.map((w) => w.priceGel))}-დან
                    </p>
                  </div>
                </Link>
                <div className="winery-item__footer">
                  <Link
                    to={`/marani/${winery.id}`}
                    className="btn btn-primary winery-item__book-btn"
                  >
                    ვიზიტის დაჯავშნა
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
