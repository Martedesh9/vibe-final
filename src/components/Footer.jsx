import { Link } from 'react-router-dom'
import './Footer.css'
import BrandMark from './BrandMark'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <span className="footer__logo">
            <BrandMark className="footer__logo-svg" />
            <span>მარანი</span>
          </span>
          <p className="footer__tagline">
            ქართული ოჯახური მარნების ციფრული ვიტრინა
          </p>
        </div>
        <nav className="footer__nav">
          <Link to="/">მთავარი</Link>
          <Link to="/maranebi">მარნები</Link>
          <Link to="/kalata">კალათა</Link>
        </nav>
        <p className="footer__copy">© {new Date().getFullYear()} მარანი</p>
      </div>
    </footer>
  )
}
