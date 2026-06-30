// const WEBHOOK_URL = 'https://mtedeshvili.app.n8n.cloud/webhook/sommelier'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { wineriesData } from '../data/wineries'
import './SommelierChat.css'

const normalize = (text) => text.toLowerCase()

const keywordRules = [
  {
    keywords: ['ხორცი', 'სტეიკ', 'ბარბექიუ', 'მწვადი'],
    types: ['მშრალი წითელი', 'ნახევრადტკბილი წითელი'],
    grapes: ['საფერავი', 'ოჯალეში', 'ალექსანდროული'],
    reason: 'ხორციან კერძებთან უფრო კარგად ჯდება სხეულიანი წითელი ღვინო.',
  },
  {
    keywords: ['თევზი', 'ზღვის', 'სალათი', 'ბოსტნეული'],
    types: ['მშრალი თეთრი'],
    grapes: ['ციცქა', 'ცოლიკოური', 'ჩინური', 'გორული მწვანე'],
    reason: 'მსუბუქ კერძებთან სუფთა და ცოცხალი თეთრი ღვინო უკეთ მუშაობს.',
  },
  {
    keywords: ['ტკბილი', 'დესერტი', 'შოკოლადი'],
    types: ['ნახევრადტკბილი წითელი'],
    grapes: ['ალექსანდროული'],
    reason: 'დესერტთან ტკბილი პროფილის ღვინო არომატებს უკეთ აძლიერებს.',
  },
  {
    keywords: ['მჟავე', 'მსუბუქი', 'ცოცხალი', 'ხილის'],
    types: ['მშრალი თეთრი'],
    grapes: ['ქისი', 'ჩინური', 'ციცქა'],
    reason: 'მსუბუქი და მჟავიანობაზე ორიენტირებული გემოსთვის თეთრი ჯიშები კარგი არჩევანია.',
  },
]

const allWineOptions = wineriesData.flatMap((winery) =>
  winery.wines.map((wine) => ({
    ...wine,
    wineryId: winery.id,
    wineryName: winery.name,
  })),
)

function getRecommendations(query) {
  const text = normalize(query)
  const matchedRules = keywordRules.filter((rule) =>
    rule.keywords.some((keyword) => text.includes(keyword)),
  )

  const scored = allWineOptions
    .map((wine) => {
      let score = 0
      let reason = 'ეს ღვინო მრავალმხრივია და სხვადასხვა კერძთან ბალანსს ინარჩუნებს.'

      matchedRules.forEach((rule) => {
        if (rule.types.some((type) => wine.type.includes(type))) score += 3
        if (rule.grapes.some((grape) => wine.grape.includes(grape))) score += 2
        if (score > 0) reason = rule.reason
      })

      return { wine, score, reason }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  if (matchedRules.length === 0) {
    return allWineOptions.slice(0, 3).map((wine) => ({
      wine,
      reason:
        'ზოგადი რეკომენდაციაა — თუ დამიწერ გემოს დეტალებს ან კერძს, უფრო ზუსტ არჩევანს მოგცემ.',
    }))
  }

  return scored.map((item) => ({
    wine: item.wine,
    reason: item.reason,
  }))
}

const GREETING = {
  id: 'greeting',
  role: 'bot',
  text: 'გამარჯობა! მითხარი რა გემოვნება გაქვს ან რა კერძთან გინდა ღვინო.',
  recommendations: [],
}

let msgCounter = 0

export default function SommelierChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([GREETING])

  const sendMessage = (event) => {
    event.preventDefault()
    const text = input.trim()
    if (!text) return

    const recommendations = getRecommendations(text)
    const ts = ++msgCounter

    setMessages((prev) => [
      ...prev,
      { id: `u-${ts}`, role: 'user', text, recommendations: [] },
      {
        id: `b-${ts}`,
        role: 'bot',
        text: 'აი ჩემი რეკომენდაციები:',
        recommendations,
      },
    ])
    setInput('')
  }

  return (
    <div className="sommelier">
      {isOpen && (
        <div className="sommelier__panel">
          <div className="sommelier__header">
            <strong>🍷 სომელიე</strong>
            <button
              type="button"
              className="sommelier__close"
              onClick={() => setIsOpen(false)}
              aria-label="ჩატის დახურვა"
            >
              X
            </button>
          </div>

          <div className="sommelier__messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`sommelier__message ${
                  message.role === 'user' ? 'sommelier__message--user' : 'sommelier__message--bot'
                }`}
              >
                <p>{message.text}</p>
                {message.recommendations.length > 0 && (
                  <ul className="sommelier__recommendations">
                    {message.recommendations.map(({ wine, reason }) => (
                      <li key={wine.id}>
                        <p>
                          <strong>{wine.name}</strong> — {wine.wineryName}
                        </p>
                        <p className="sommelier__reason">{reason}</p>
                        <Link to={`/marani/${wine.wineryId}`}>მარანის გვერდზე გადასვლა</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <form className="sommelier__form" onSubmit={sendMessage}>
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="მაგ: მწვადთან რომელი ღვინო მოუხდება?"
            />
            <button type="submit">გაგზავნა</button>
          </form>
        </div>
      )}

      <button type="button" className="sommelier__trigger" onClick={() => setIsOpen(true)}>
        🍷 სომელიე
      </button>
    </div>
  )
}
