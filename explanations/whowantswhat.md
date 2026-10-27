## What it is

[Who Wants What](https://whowantswhat.eu) is a live marketplace. Anyone can post what they want (10 tons of sugar, a plumber, an app), what they offer, or what they are building. Providers answer wants with a quote, buyers register interest in offers, and founders collect waitlists with what people would pay. Shops get Shopify-style storefronts with catalogs, carts, orders, negotiations, reviews, wishlists and real-time chat. I built and run it alone.

## The data model

- **51 versioned SQL migrations.** Every table is prefixed `www_`. The API applies pending migrations at startup in one transaction behind a lock, so several Cloud Run instances starting together is safe, and a test fails if the migrations and the models disagree.
- **Full change history.** Postgres triggers copy every change into `<table>_history` tables (SCD Type 4).
- **Money you can audit.** An internal export explains every order line's money, one row per line, with the order's totals on each row. Store analytics cover orders, products, carts and customers.

## Security

Firebase handles sign-in (email/password and Google). The backend verifies every Firebase ID token's signature, expiry, audience and issuer, and issues its own session token. Posting requires a verified email, account deletion requires a fresh sign-in, uploaded images live in a private bucket served through the API, and only an allow-listed set of public values ever reaches the browser.

## Engineering

FastAPI, SQLAlchemy and PostgreSQL, a server-rendered Next.js + TypeScript frontend with programmatic SEO pages, generated sitemaps and JSON-LD, deployed on GCP Cloud Run with Cloud Storage and Secret Manager.
