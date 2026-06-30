# Marani

მცირე ოჯახური მარნების აღმოჩენისა და ვიზიტის დაჯავშნის პლატფორმა. მომხმარებლები ათვალიერებენ საქართველოს სხვადასხვა რეგიონის ღვინის მარნებს, ყიდულობენ ღვინოს და უშუალოდ ჯავშნიან ვიზიტს მარანში.

---

## Tech Stack

| ფენა | ტექნოლოგია |
|---|---|
| UI | React 19 |
| Routing | React Router v7 |
| Build | Vite 6 |
| State | React Context (Auth, Cart) |
| Persistence | localStorage |
| AI Sommelier | n8n webhook + keyword engine |
| Styling | Plain CSS (CSS custom properties) |

---

## პროექტის სტრუქტურა

```
src/
├── components/
│   ├── BrandMark.jsx       # ლოგო / ბრენდ-მარკი
│   ├── Footer.jsx
│   ├── Layout.jsx          # Navbar + Outlet + Footer
│   ├── Navbar.jsx
│   ├── ScrollToTop.jsx     # route-ცვლილებისას გვერდის ზევით სქროლი
│   └── SommelierChat.jsx   # AI სომელიეს ჩატი
│
├── context/
│   ├── AuthContext.jsx     # მომხმარებლის auth (localStorage)
│   └── CartContext.jsx     # კალათა (localStorage)
│
├── data/
│   └── wineries.js         # 6 მარნის სტატიკური მონაცემები
│
└── pages/
    ├── Home.jsx / .css             # მთავარი გვერდი
    ├── Wineries.jsx / .css         # მარნების სია + ფილტრი
    ├── WineryDetail.jsx / .css     # მარნის პროფილი
    ├── VisitBooking.jsx / .css     # ვიზიტის ჯავშანი
    ├── BookingConfirmation.jsx     # დადასტურება
    ├── Cart.jsx / .css             # კალათა
    ├── AuthPage.jsx / .css         # შესვლა / რეგისტრაცია
    └── Profile.jsx / .css          # პირადი გვერდი (protected)
```

---

## მარშრუტები

| URL | გვერდი |
|---|---|
| `/` | მთავარი |
| `/maranebi` | მარნების სია |
| `/marani/:id` | მარნის პროფილი |
| `/marani/:id/viziti` | ვიზიტის ჯავშანი |
| `/marani/:id/dadastureba` | ჯავშნის დადასტურება |
| `/kalata` | კალათა |
| `/auth` | შესვლა / რეგისტრაცია |
| `/profil` | პირადი გვერდი *(protected)* |

---

## ფუნქციონალი

### მარნების კატალოგი
- 6 ოჯახური მარანი 5 რეგიონიდან: კახეთი, რაჭა, იმერეთი, ქართლი, სამეგრელო
- ფილტრი რეგიონის მიხედვით
- თითოეული მარანის პროფილზე: გალერეა, ისტორია, სტატისტიკა, ღვინოების ბარათები

### ვიზიტის ჯავშანი
- პერსონების რაოდენობა, თარიღი, დამატებითი შენიშვნა
- ჯავშნის დადასტურების გვერდი

### კალათა და შეძენა
- ღვინოს კალათაში დამატება ნებისმიერი მარნის გვერდიდან
- რაოდენობის ცვლილება, ამოშლა
- შეკვეთის ჯამი

### Auth
- რეგისტრაცია და შესვლა localStorage-ით
- ორი როლი: **სტუმარი** და **მეღვინე**
- მეღვინის პროფილი უკავშირდება კონკრეტულ მარანს

### AI სომელიე
- ჩატ-ინტერფეისი keyword-based რეკომენდაციებით
- გარე n8n webhook-ი გაფართოებული პასუხებისთვის (`mtedeshvili.app.n8n.cloud`)
- ავტომატურად გასცემს ღვინის რეკომენდაციებს კერძის ტიპის მიხედვით

---

## მონაცემები

`src/data/wineries.js` — ყველა მარანი სტატიკურ მასივშია. თითოეული მარანის ობიექტი შეიცავს:

```js
{
  id, name, region, village, foundedYear,
  acceptsVisitors, vineyardHa,
  visit: { includes, pricePerPerson },
  description, history,
  image, gallery,
  wines: [{ id, name, type, grape, year, priceGel, description, image }]
}
```

---

## გაშვება

```bash
npm install
npm run dev
```

```bash
npm run build    # production build
npm run preview  # build-ის preview
```

---

## გარემო

Node 18+ / npm 9+. სხვა კონფიგურაციო ფაილი არ არის საჭირო — n8n webhook URL კოდშია ჩაწერილი (`src/components/SommelierChat.jsx`).
