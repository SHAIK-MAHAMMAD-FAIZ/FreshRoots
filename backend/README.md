# FreshRoots Backend

A real backend for your FreshRoots project — Node.js only, **no npm install needed**
(uses Node's built-in `node:sqlite`, so it needs Node **v22.5+**; you have v22.22).

## Run it

```bash
cd backend
node server.js
```

You'll see:
```
FreshRoots backend running at http://localhost:4000
```

A `freshroots.db` SQLite file is created automatically next to `server.js` and
pre-seeded with your 10 products the first time you run it. Data persists
across restarts (unlike the old localStorage version).

## API

| Method | Endpoint                    | Body                                          | Notes                          |
|--------|------------------------------|------------------------------------------------|---------------------------------|
| GET    | `/api/products`              | —                                              | optional `?category=Fruits&q=mango` |
| GET    | `/api/products/:id`          | —                                              |                                  |
| POST   | `/api/products`               | `{name, category, price, unit, farmer, ...}`  | creates a product                |
| PUT    | `/api/products/:id`          | any fields to update                          |                                  |
| DELETE | `/api/products/:id`          | —                                              |                                  |
| POST   | `/api/auth/register`         | `{name, email, phone, password}`              | returns `{token, user}`          |
| POST   | `/api/auth/login`            | `{email, password}`                           | returns `{token, user}`          |
| GET    | `/api/auth/me`               | header `Authorization: Bearer <token>`        | returns current user             |

Passwords are salted + hashed (`scrypt`), never stored in plain text.
Auth tokens are simple random strings kept in server memory (fine for a demo;
they reset if you restart the server).

## Wiring the existing frontend to it (optional, not done automatically)

Your frontend currently reads from `js/products.js` and `js/auth.js`
(both localStorage-based) — I did **not** touch those files. To make the
frontend talk to this real backend instead, the smallest change per file is:

**Fetch products from the API** — in `shop.html` / `index.html`, replace the
direct use of the `PRODUCTS` constant with a fetch, e.g.:
```js
const PRODUCTS = await fetch('http://localhost:4000/api/products').then(r => r.json());
```

**Register/login** — in `js/auth.js`, swap the localStorage read/write in
`initLogin()` / `initRegister()` for:
```js
const res = await fetch('http://localhost:4000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, phone, password })
});
const { token, user } = await res.json();
localStorage.setItem('freshroots_user', JSON.stringify(user));
localStorage.setItem('freshroots_token', token);
```

I kept this as a manual step since it touches your existing files and you
asked for additions only — happy to wire it up for you if you want, just ask.
