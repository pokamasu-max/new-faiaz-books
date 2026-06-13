# 📚 New Faiaz Books — Nilkhet, Dhaka

An online shop for **National University (জাতীয় বিশ্ববিদ্যালয়)** books — textbooks,
guides, suggestions and handnotes for **Honours, Degree and Masters** — built with
**Next.js 14**, **Prisma + SQLite**, **NextAuth**, and **Tailwind CSS**.

## Features

- 🏠 **Storefront** — NU-focused homepage: shop by **Program** (Honours/Degree/Masters) and **Subject**
- 🔍 **Academic filters** — Program → Year → Subject → Book type (Textbook/Guide/Suggestion/Notes); search by title (English **or Bangla**), author, publisher
- 🌐 **Bilingual** — full **Bangla / English** toggle (saved in a cookie); Bangla titles & labels throughout
- 📖 **Book detail pages** — program/year/subject/type tags, publisher, related books
- 🛒 **Cart** — persists in the browser (localStorage)
- 💳 **Checkout** — shipping form + **Cash on Delivery** or **Online (mock)** payment
- 👤 **Accounts** — register, login, view your orders (NextAuth credentials)
- 🛠️ **Admin panel** — dashboard stats, add/edit/delete books (with all academic fields), manage order status
- 🗄️ **Local database** — SQLite via Prisma, seeded with 21 sample NU books

## Getting started

```bash
npm install         # install dependencies
npm run db:push     # create the SQLite database
npm run db:seed     # load demo books + demo users
npm run dev         # start the dev server → http://localhost:3000
```

> **Note:** Node.js was installed to a winget path on this machine. If `node`/`npm`
> aren't found in a new terminal, either restart the terminal (the PATH was updated)
> or run commands from a shell where Node is on the PATH.

## Demo accounts

| Role     | Email                       | Password   |
|----------|-----------------------------|------------|
| Admin    | admin@newfaiazbooks.com     | admin123   |
| Customer | customer@example.com        | user123    |

Sign in as the admin and open **Admin Dashboard** (avatar menu) to manage the catalogue.

## Tech stack

| Layer     | Choice                          |
|-----------|---------------------------------|
| Framework | Next.js 14 (App Router) + TS    |
| Database  | SQLite + Prisma ORM             |
| Auth      | NextAuth (credentials + JWT)    |
| Styling   | Tailwind CSS                    |
| Payments  | Mock gateway (see below)        |

## Going to production

- **Payments:** `src/app/api/orders/route.ts` contains a mock payment step.
  Replace it with a real gateway — **Stripe**, **SSLCommerz**, or **bKash** —
  by calling the gateway, then marking the order `PAID` only after confirmation.
- **Database:** switch the Prisma datasource from `sqlite` to `postgresql` and set
  `DATABASE_URL` to your hosted DB.
- **Secrets:** set a strong `NEXTAUTH_SECRET` and the correct `NEXTAUTH_URL` in `.env`.
- **Images:** book covers use `placehold.co` placeholders — swap in real cover URLs
  (the admin "Cover image URL" field supports this).

## Project structure

```
prisma/
  schema.prisma        # data models: User, Book, Order, OrderItem
  seed.js              # demo data
src/
  app/                 # pages & API routes (App Router)
    api/               # auth, register, orders, admin endpoints
    admin/             # admin dashboard, books, orders
    books/             # listing + detail
    cart, checkout, orders, login, register
  components/          # Header, Footer, BookCard, etc.
  context/CartContext  # client-side cart
  lib/                 # prisma client, auth options, helpers
```
