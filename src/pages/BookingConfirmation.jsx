import { useLocation, Link } from 'react-router-dom'
import './BookingConfirmation.css'

export default function BookingConfirmation() {
  const { state } = useLocation()

  if (!state) {
    return (
      <div className="page-placeholder">
        <h1>გვერდი ვერ მოიძებნა</h1>
        <Link to="/" className="btn btn-outline" style={{ marginTop: '1.5rem' }}>
          მთავარზე
        </Link>
      </div>
    )
  }

  const { wineryName, date, guests, totalPrice } = state

  return (
    <section className="booking-confirm">
      <div className="container">
        <div className="booking-confirm__card">
          <div className="booking-confirm__check">✓</div>
          <h1 className="booking-confirm__title">ჯავშანი დადასტურდა!</h1>
          <p className="booking-confirm__subtitle">
            მალე დაგიკავშირდებით დასადასტურებლად.
          </p>

          <div className="booking-confirm__details">
            <div className="booking-confirm__row">
              <span>მარანი</span>
              <strong>{wineryName}</strong>
            </div>
            <div className="booking-confirm__row">
              <span>თარიღი</span>
              <strong>{date}</strong>
            </div>
            <div className="booking-confirm__row">
              <span>სტუმრები</span>
              <strong>{guests} პირი</strong>
            </div>
            <div className="booking-confirm__row booking-confirm__row--total">
              <span>სრული ფასი</span>
              <strong>₾{totalPrice}</strong>
            </div>
          </div>

          <Link to="/" className="btn btn-primary booking-confirm__btn">
            მთავარზე დაბრუნება
          </Link>
        </div>
      </div>
    </section>
  )
}
