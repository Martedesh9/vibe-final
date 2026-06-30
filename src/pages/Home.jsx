import { Link } from 'react-router-dom'
import './Home.css'

const featuredWineries = [
  {
    id: 'teliani',
    name: 'მარანი თელიანი',
    image: '/images/winery3-exterior.jpg',
  },
  {
    id: 'gurjaani',
    name: 'მარანი გურჯაანი',
    image: '/images/gurjaani.jpg',
  },
  {
    id: 'racha',
    name: 'მარანი რაჭა',
    image: '/images/winery4-exterior.jpg',
  },
]

const steps = [
  { title: 'აღმოაჩინე', to: '/maranebi' },
  { title: 'დაუკავშირდი', to: '/auth' },
  { title: 'ეწვიე ან შეუკვეთე', to: '/maranebi' },
]

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero__overlay" aria-hidden="true" />
        <div className="container hero__content">
          <h1 className="hero__title">აღმოაჩინე მცირე მეღვინეები და ეწვიე მათ</h1>
          <div className="hero__actions">
            <Link to="/maranebi" className="btn btn-primary">
              მეღვინეების ნახვა
            </Link>
          </div>
        </div>
      </section>

      <section className="how">
        <div className="container">
          <h2 className="section-title how__title">როგორ მუშაობს</h2>
          <div className="how__steps">
            {steps.map((step, index) => (
              <div key={step.title} className="how__step-wrapper">
                <Link to={step.to} className="how__step">
                  <span className="how__step-title">{step.title}</span>
                </Link>
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
              <Link key={winery.id} to={`/marani/${winery.id}`} className="winery-card">
                <img src={winery.image} alt={winery.name} className="winery-card__image" />
                <h3 className="winery-card__name">{winery.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-banner">
        <div className="container cta-banner__inner">
          <h2 className="cta-banner__title">ხარ მეღვინე? წარადგინე შენი ოჯახური მარანი</h2>
          <Link to="/maranebi" className="btn btn-primary cta-banner__btn">
            მარანის დამატება
          </Link>
        </div>
      </section>
    </div>
  )
}
