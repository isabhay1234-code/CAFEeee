# Kopi Pitu — QR Ordering System

A dark, gold-accented QR ordering app built for Kopi Pitu's menu: customers scan a
table QR code to browse and order, orders land instantly on a password-protected
kitchen dashboard, and an admin panel manages the menu, categories, prices, photos,
availability, and table QR codes. Built on React + Vite + Tailwind + Supabase
(Postgres, Realtime, Auth, Storage).

## 1. Create your Supabase project

1. Go to [supabase.com](https://supabase.com) → New project. Pick any name/region, free tier is enough.
2. Once it's ready, open **SQL Editor** → paste the entire contents of `supabase/schema.sql` → **Run**.
   This creates all tables, security rules, the `menu-images` storage bucket, 10 tables
   (Table 1–10), and seeds the full Kopi Pitu menu (~65 items) from your poster.
3. Go to **Project Settings → API** and copy:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public` key → `VITE_SUPABASE_ANON_KEY`

## 2. Create the two staff logins

Kitchen and admin use a single shared password each, backed by real Supabase Auth
accounts (this is what keeps the RLS write policies secure, instead of a password
that only lives in the frontend).

1. Go to **Authentication → Users → Add user** (untick "send confirmation email").
2. Create one user with email `kitchen@kopipitu.internal` and a password you choose — this is the kitchen dashboard password.
3. Create a second user with email `admin@kopipitu.internal` and a different password — this is the admin panel password.
4. You can use any email-shaped strings you like here, just make sure they match `VITE_KITCHEN_EMAIL` / `VITE_ADMIN_EMAIL` in your `.env`.

## 3. Configure the app

```bash
cp .env.example .env
```

Fill in the four values (Supabase URL/key + the two staff emails from step 2).

## 4. Run locally

```bash
npm install
npm run dev
```

- Customer menu: `http://localhost:5173/t/<qr_token>` — get a real `qr_token` from
  the `cafe_tables` table in Supabase (Table Editor), or from the Admin Panel → Tables & QR tab.
- Kitchen dashboard: `http://localhost:5173/kitchen`
- Admin panel: `http://localhost:5173/admin`

## 5. Deploy to Netlify

1. Push this project to a GitHub repo.
2. In Netlify: **Add new site → Import an existing project** → pick the repo.
3. Build command: `npm run build`. Publish directory: `dist`.
4. Add the four `.env` variables under **Site settings → Environment variables**.
5. Deploy. Netlify gives you a URL like `https://kopipitu.netlify.app`.

## 6. Print your table QR codes

Open `/admin` → **Tables & QR** tab. Each of the 10 tables shows its live QR code
pointing at `https://your-site.netlify.app/t/<token>`. Click **Download** to save
a PNG for printing, or **Regenerate** if a code is lost/compromised (this invalidates
the old printed code).

## How it's organized

```
src/
  pages/
    CustomerMenu.jsx     customer browsing + cart, at /t/:tableToken
    OrderStatus.jsx       live order tracker after checkout
    KitchenDashboard.jsx  realtime kanban: New → Accepted → Preparing → Ready → Served
    AdminPanel.jsx        tabs: Menu items / Categories / Tables & QR
  components/             shared UI (cart drawer, item modal, admin editors)
  hooks/useCart.js         cart state, persisted per-table in localStorage
  hooks/useStaffAuth.js    Supabase Auth wrapper for the shared logins
supabase/schema.sql        full DB schema, RLS policies, storage bucket, menu seed
```

## Notes & assumptions

- Prices are stored as whole Rupiah integers (e.g. `20000`) and displayed in the
  poster's "20K" style via `formatPrice()` — edit prices as normal numbers in the
  Admin Panel, the "K" formatting is automatic.
- The poster's "Coffee Flavoured Latte" section printed "Caramel" twice at the same
  price in both Hot and Ice — seeded as "Caramel" and "Salted Caramel" so nothing
  is silently dropped. Rename or delete in Admin Panel → Menu items if that's wrong.
- Orders and their items are readable by anyone with the anon key (needed so a
  customer can watch their own order status update). Only signed-in staff
  (kitchen/admin accounts) can change order status, edit the menu, or manage tables.
- The kitchen dashboard plays a short chime on new orders; swap the placeholder
  `<audio>` source in `KitchenDashboard.jsx` for a real notification sound file if
  you want something louder for a busy kitchen.
- To reduce no-shows on stale carts, cart contents are stored per table in
  `localStorage`, so refreshing a customer's phone doesn't clear their in-progress order.
