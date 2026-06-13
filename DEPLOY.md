# 🚀 Putting New Faiaz Books online (beginner guide)

You'll use 3 free services. Do them in order. Total time: ~20–30 minutes.

```
Your code ──► GitHub ──► Vercel ──► live website
                 ▲
            Neon (database)
```

---

## Step 1 — Create a free database (Neon)

1. Go to **https://neon.tech** and click **Sign up** (use your Google account or email).
2. Create a new **Project** (any name, e.g. `new-faiaz-books`). Pick a region near Bangladesh (e.g. Singapore).
3. After it's created, find **Connection string** on the dashboard.
4. Copy the string that starts with `postgresql://...`. **Keep it safe — it's like a password.**

➡️ **Send me that connection string** and I'll load all your books into it for you.
(Or do it yourself — see "Loading data" at the bottom.)

---

## Step 2 — Put your code on GitHub

1. Go to **https://github.com** and click **Sign up**. Verify your email.
2. Click the **+** (top-right) → **New repository**.
   - Repository name: `new-faiaz-books`
   - Keep it **Public** (or Private — both work)
   - **Do NOT** check "Add a README" (we already have one)
   - Click **Create repository**.
3. GitHub shows a page with commands. You only need the repo URL, which looks like:
   `https://github.com/YOUR-USERNAME/new-faiaz-books.git`

➡️ **Send me that URL** and I'll push your code up for you. (I've already prepared the
local git repository and made the first commit.)

---

## Step 3 — Deploy on Vercel

1. Go to **https://vercel.com** → **Sign up** → choose **Continue with GitHub**
   (this links the two accounts).
2. Click **Add New… → Project**.
3. Find **new-faiaz-books** in the list and click **Import**.
4. Before clicking Deploy, open **Environment Variables** and add these three
   (I'll give you the exact values):

   | Name              | Value                                            |
   |-------------------|--------------------------------------------------|
   | `DATABASE_URL`    | your Neon connection string                      |
   | `NEXTAUTH_SECRET` | `iZx4qxcSie0stDodJVTsv0oM4r5Zyri//xrjuD/ANUs=`   |
   | `NEXTAUTH_URL`    | leave blank for now — fill after first deploy    |

5. Click **Deploy** and wait 1–2 minutes. 🎉 You'll get a URL like
   `https://new-faiaz-books.vercel.app`.
6. Copy that URL, go to **Settings → Environment Variables**, set
   `NEXTAUTH_URL` to it (e.g. `https://new-faiaz-books.vercel.app`), then
   **Deployments → ⋯ → Redeploy** so login works.

That's it — your shop is live on the internet!

---

## Loading data into the database (if doing it yourself)

After Step 1, put the Neon connection string into your local `.env` file as
`DATABASE_URL`, then run:

```bash
npx prisma db push     # creates the tables in Neon
npm run db:seed        # loads the 21 sample books + admin/customer logins
```

---

## Updating the live site later

Every time you (or I) push new code to GitHub, Vercel **automatically rebuilds and
redeploys**. No extra steps. To add/edit books, just use the **Admin panel** on the
live site — no deploy needed.

## Custom domain (optional)

In Vercel: **Settings → Domains → Add**, type `newfaiazbooks.com` (after buying it
from a registrar like Namecheap/GoDaddy), and follow the DNS instructions.
