---
title: TripTop
slug: triptop
---

## The problem

A university project: organizations (student unions, travel clubs) publish trips; students book seats, often keyed to a Finnish university email domain; staff belong to an org.

If the API invents SQL in handlers, the grain disappears into whatever join was convenient that week. If the client and the warehouse disagree on “what is a booking,” you get double seats and ghost itineraries. I wanted a snowflake whose grain is **one student on one trip**, and an API that runs named SQL files instead of assembling queries in Python.

## What I built

This repository is the backend and the schema. A Flutter client lives in a sibling project.

Flask `/api/v1` — 23 blueprints, Flasgger at `/apidocs` — loads files from `app/queries/allQueries/` and runs them on PostgreSQL 12. Lookups and role profiles sit as dimensions. Itinerary is ordered rows, not a JSON blob. Booking enforces uniqueness, capacity, start time, price, and a server-minted QR.

JWT is **issued** on sign-in. `require_auth` exists and is **not mounted on any route**. Attendance tables (`devices`, `checkins`) exist in DDL; there is no blueprint. Flutter implements welcome, three sign-up funnels, sign-in, admin trip list, and itinerary detail. It does not yet call booking or trip-authoring. Staff/customer home is a stub.

## Why this shape

SQL files are the join contract — the same grain the snowflake was drawn for. Lookups instead of denormalized stars keep organization, university, and location from being copy-pasted onto every fact. I document the auth gap and the unwired client on purpose: a portfolio that pretends those are done is less useful than one that shows the API surface that is waiting.

There is also a real bug worth not hiding: create/sign-in store passwords as-is, while `update_user_data` SHA-256s. Those two cannot both work against `signInUser.sql`.

## What I owned

Snowflake DDL and seed, Flask blueprints, the query files, JWT/OTP/session machinery, Docker wiring, and the booking invariants. The Flutter shell is a sibling — I am clear about where the backend stops and the client has not caught up.
