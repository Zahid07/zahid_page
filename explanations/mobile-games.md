## What it is

A portfolio of mobile games for Android, built in Godot 4, under my WhoWantsWhat Solutions venture. They range from arcade titles like Snake and Snakeman to Skyfold and Last Light.

## One backend for every game

The games share a FastAPI and PostgreSQL backend on GCP. Each game has its own tables and its own migrations table, applied once and in order when the API starts.

- **Shared sign-in.** Players sign in through the same Firebase project as WhoWantsWhat, so one Google account works across every app. The backend exchanges Firebase's ID token for its own session token.
- **The game lives on the server.** Worlds, levels, power-ups and their upgrade prices, cosmetics, story chapters and in-app offers are defined in a server-side catalog that the app reads at startup. Changing difficulty, story or prices is a backend deploy, not an app release, and the server checks results and charges coins itself.
- **Account deletion.** Players can delete their account and all their game data in the app, as Google Play requires, while keeping their shared sign-in.

## Stack

Godot 4 for the games and Android builds, Python, FastAPI, SQLAlchemy and PostgreSQL for the API, Firebase Authentication, and GCP.
