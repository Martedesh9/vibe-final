import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Wineries.css'
import { wineriesData } from '../data/wineries'

const REGIONS = ['ყველა', 'კახეთი', 'რაჭა', 'იმერეთი', 'ქართლი', 'სამეგრელო']

export default function Wineries() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState('ყველა')

  const filteredWineries = useMemo(() => {
    const query = search.trim().toLowerCase()

    return wineriesData.filter((winery) => {
      const matchesRegion = region === 'ყველა' || winery.region === region
      const searchableText =
        `${winery.name} ${winery.region} ${winery.village} ${winery.description}`.toLowerCase()
      const matchesSearch = query.length === 0 || searchableText.includes(query)

      return matchesRegion && matchesSearch
    })
  }, [search, region])

  return (
    <section className="wineries-page">
      <div className="container">
        <header className="wineries-page__header">
          <h1 className="section-title">მარნების სია</h1>
          <p className="section-subtitle">
            აღმოაჩინე ქართული ოჯახური მარნები, გაეცანი ისტორიას და დაგეგმე ვიზიტი.
          </p>
        </header>

        <div className="wineries-filter">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="მოძებნე მარანი, სოფელი ან აღწერა..."
            className="wineries-filter__search"
            aria-label="მარნების ძებნა"
          />
          <select
            value={region}
            onChange={(event) => setRegion(event.target.value)}
            className="wineries-filter__region"
            aria-label="რეგიონის ფილტრი"
          >
            {REGIONS.map((regionName) => (
              <option key={regionName} value={regionName}>
                {regionName}
              </option>
            ))}
          </select>
        </div>

        {filteredWineries.length === 0 ? (
          <p className="wineries-empty">ამ ფილტრით მარანი ვერ მოიძებნა</p>
        ) : (
          <div className="wineries-grid">
            {filteredWineries.map((winery) => (
              <article
                key={winery.id}
                className="winery-item"
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/marani/${winery.id}`)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    navigate(`/marani/${winery.id}`)
                  }
                }}
              >
                <img src={winery.image} alt={winery.name} className="winery-item__image" />
                <div className="winery-item__body">
                  <h2 className="winery-item__name">{winery.name}</h2>
                  <p className="winery-item__meta">
                    {winery.region}, {winery.village}
                  </p>
                  <p className="winery-item__description">{winery.description}</p>
                  <Link
                    to={`/marani/${winery.id}`}
                    className="btn btn-outline winery-item__button"
                    onClick={(event) => event.stopPropagation()}
                  >
                    ნახვა
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
