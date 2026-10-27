## What it is

Plainjoin is a self-hosted, self-service BI product. A team connects a PostgreSQL or AWS Athena source, imports the SQL reports they already trust, and then asks questions in plain language. Answers come back as SQL, a table and a chart, and can be saved to dashboards and shared with teammates in a workspace.

The screenshots are from the product concept: the clickable prototype the UI is built from.

## How an answer is made

- **Certified first.** Metrics are contracts: an expression, a row filter, a time column, the dimensions it may be sliced by, and whether it is additive. When a certified metric answers the question, the SQL is compiled from the contract and labelled **Certified**.
- **Exploratory otherwise.** If no certified metric fits, the model drafts SQL, which is labelled **Exploratory** and reviewed before it runs against live data or a snapshot.
- **One gate.** Every query, certified or not, goes through a single read-only SQL guard. Plainjoin's own control database is rejected as a customer source.

## Knowledge, not guesses

Imported reports and table notes become a knowledge base with embeddings (and text search as a fallback if embeddings fail). Join cardinality is **measured from data** with "Verify relationships", so the compiler's fan-out guard knows which joins would multiply rows. Report SQL is dry-run with `EXPLAIN` on import, so references to missing columns are reported instead of stored.

## Quality you can re-check

Golden questions with reference SQL are re-run after every change to metrics or models, so a regression shows up as a failed question rather than a wrong number in a meeting.

## Engineering

FastAPI backend, PostgreSQL with pgvector, a React + TypeScript frontend, and a local LLM through LM Studio, all in Docker Compose. Source credentials are encrypted per workspace with a persistent key. Customer knowledge ships as data bundles (connections without secrets, reports, metrics, glossary, golden questions) and imports idempotently.
