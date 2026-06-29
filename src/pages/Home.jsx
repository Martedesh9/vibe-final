import { Link } from 'react-router-dom'
import './Home.css'

const featuredWineries = [
  {
    id: 'teliani',
    name: 'მარანი თელიანი',
    image:
      'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'gurjaani',
    name: 'მარანი გურჯაანი',
    image:
      'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'racha',
    name: 'მარანი რაჭა',
    image:
      'https://images.unsplash.com/photo-1470158499416-75be9aa0c4db?auto=format&fit=crop&w=1200&q=80',
  },
]

const steps = [
  {
    title: 'აღმოაჩინე',
  },
  {
    title: 'დაუკავშირდი',
  },
  {
    title: 'ეწვიე ან შეუკვეთე',
  },
]

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero__overlay" aria-hidden="true" />
        <div className="container hero__content">
          <h1 className="hero__title">აღმოაჩინე ქართული ოჯახური მარნები</h1>
          <div className="hero__actions">
            <Link to="/maranebi" className="btn btn-primary">
              მარნების ნახვა
            </Link>
          </div>
        </div>
      </section>

      <section className="how">
        <div className="container">
          <h2 className="section-title how__title">როგორ მუშაობს</h2>
          <div className="how__steps">
            {steps.map((step, index) => (
              <div key={step.title} className="how__step">
                <span className="how__step-title">{step.title}</span>
                {index < steps.length - 1 && <span className="how__arrow">→</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="featured">
        <div className="container">
          <h2 className="section-title featured__title">გამორჩეული მარნები</h2>
          <div className="featured__grid">
            {featuredWineries.map((winery) => (
              <article key={winery.id} className="winery-card">
                <img src={winery.image} alt={winery.name} className="winery-card__image" />
                <h3 className="winery-card__name">{winery.name}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-banner">
        <div className="container cta-banner__inner">
          <h2 className="cta-banner__title">ხარ მეღვინე? წარადგინე შენი მარანი</h2>
          <Link to="/maranebi" className="btn btn-primary cta-banner__btn">
            მარანის დამატება
          </Link>
        </div>
      </section>
    </div>
  )
}
