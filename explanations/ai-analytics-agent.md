## What it is

An agent that learns a company's data estate into long-term memory and then answers analytics questions with verified, read-only SQL. Every answer shows the SQL, the tables, the default filters, the assumptions and a confidence level, and is reconciled against numbers the company already trusts on its dashboards.

It is in progress.

## How it learns

Learning is explicit: nothing is learned automatically. Five steps run in order, each unlocking the next:

1. **Discover**: the warehouse structure, including tables, columns, keys and indexes.
2. **Catalog**: an agent writes the meaning of every table and column, flags PII, and states the grain.
3. **Relationships**: an agent proposes joins and verifies them against data, query history and BI definitions.
4. **Semantic layer**: an agent defines metrics, then the glossary and default filters.
5. **Search index**: embeddings over everything learned, stored in pgvector.

Each agent works through LLM **tool calling**, and the live log shows every tool call it makes, with progress and time-left estimates per step.

## Never writes

Read-only access is enforced in five independent layers, so a single mistake in one of them cannot turn a question into a write. Answers are reconciled against Metabase dashboards and LookML definitions as ground truth.

## Engineering

FastAPI API, a Next.js UI, PostgreSQL with pgvector as memory, MySQL as the first warehouse behind a pluggable connector (SQLite as the reference second connector), and any OpenAI-compatible chat and embeddings endpoint. Migrations run through Alembic, and CI runs on GitHub Actions.
