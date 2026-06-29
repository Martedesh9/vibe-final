import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import './Cart.css'

const ORDER_RECEIVER_EMAIL = import.meta.env.VITE_ORDER_EMAIL || 'orders@example.com'

export default function Cart() {
  const { items, totalAmount, updateQuantity, removeFromCart, clearCart } = useCart()
  const { currentUser, saveOrder } = useAuth()
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    note: '',
  })

  const orderSummaryText = useMemo(() => {
    if (items.length === 0) return ''

    const lines = items.map(
      (item, index) =>
        `${index + 1}. ${item.wine.name} (${item.wine.wineryName}) - რაოდენობა: ${item.quantity}, ფასი: ${item.lineTotal} ლარი`,
    )

    return lines.join('\n')
  }, [items])

  const onSubmitOrder = (event) => {
    event.preventDefault()
    if (items.length === 0) return

    const subject = encodeURIComponent(`ახალი შეკვეთა - ${formData.name}`)
    const body = encodeURIComponent(
      `ახალი შეკვეთა მარანიდან:\n\n` +
        `სახელი: ${formData.name}\n` +
        `ტელეფონი: ${formData.phone}\n` +
        `მისამართი: ${formData.address}\n` +
        `შენიშვნა: ${formData.note || '-'}\n\n` +
        `შეკვეთის პოზიციები:\n${orderSummaryText}\n\n` +
        `ჯამური თანხა: ${totalAmount} ლარი`,
    )

    window.location.href = `mailto:${ORDER_RECEIVER_EMAIL}?subject=${subject}&body=${body}`
    if (currentUser) {
      saveOrder({
        items,
        totalAmount,
        customer: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          note: formData.note,
        },
      })
    }
    clearCart()
    setSubmitted(true)
  }

  if (items.length === 0) {
    return (
      <section className="cart-page">
        <div className="container">
          {submitted ? (
            <div className="cart-success">
              <h1>შეკვეთა მიღებულია, მალე დაგიკავშირდებით</h1>
              <p>
                თქვენი შეკვეთის დეტალები გაგზავნილია ელფოსტაზე:
                {' '}
                {ORDER_RECEIVER_EMAIL}
              </p>
            </div>
          ) : (
            <div className="page-placeholder">
              <h1>კალათა ცარიელია</h1>
              <p>ჯერ არ გაქვს დამატებული ღვინოები.</p>
              <Link to="/maranebi" className="btn btn-outline" style={{ marginTop: '1.5rem' }}>
                მარნებზე დაბრუნება
              </Link>
            </div>
          )}
        </div>
      </section>
    )
  }

  return (
    <section className="cart-page">
      <div className="container cart-layout">
        <div className="cart-items">
          <h1 className="section-title">კალათა</h1>
          {items.map((item) => (
            <article key={item.wineId} className="cart-item">
              <img src={item.wine.image} alt={item.wine.name} className="cart-item__image" />
              <div className="cart-item__body">
                <h2 className="cart-item__name">{item.wine.name}</h2>
                <p className="cart-item__meta">{item.wine.wineryName}</p>
                <p className="cart-item__price">{item.wine.priceGel} ლარი</p>
                <div className="cart-item__actions">
                  <label>
                    რაოდენობა
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(event) => updateQuantity(item.wineId, event.target.value)}
                    />
                  </label>
                  <button
                    type="button"
                    className="cart-item__remove"
                    onClick={() => removeFromCart(item.wineId)}
                  >
                    წაშლა
                  </button>
                </div>
              </div>
              <div className="cart-item__total">{item.lineTotal} ლარი</div>
            </article>
          ))}
        </div>

        <aside className="cart-summary">
          <h2>ჯამური თანხა</h2>
          <p className="cart-summary__total">{totalAmount} ლარი</p>

          <form className="order-form" onSubmit={onSubmitOrder}>
            <h3>შეკვეთის ფორმა</h3>
            <label>
              სახელი
              <input
                required
                type="text"
                value={formData.name}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, name: event.target.value }))
                }
              />
            </label>
            <label>
              ტელეფონი
              <input
                required
                type="tel"
                value={formData.phone}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, phone: event.target.value }))
                }
              />
            </label>
            <label>
              მისამართი
              <input
                required
                type="text"
                value={formData.address}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, address: event.target.value }))
                }
              />
            </label>
            <label>
              შენიშვნა
              <textarea
                rows="3"
                value={formData.note}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, note: event.target.value }))
                }
              />
            </label>
            <button type="submit" className="btn btn-primary order-form__submit">
              შეკვეთის გაფორმება
            </button>
          </form>
        </aside>
      </div>
    </section>
  )
}
