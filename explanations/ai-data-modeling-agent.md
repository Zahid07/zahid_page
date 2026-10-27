## What it is

An agent that reconciles three sources into an evidence-backed, human-approved data model: a business process document (what the business intends), existing report SQL (what analytics does today), and a live Oracle database (what is actually there). It produces conceptual, logical and physical models, transformation mappings, validation results, diagrams and Oracle DDL.

It is in progress.

## The core rule

None of the three sources is automatically authoritative. When they conflict, the agent records the conflict and asks for a business decision, instead of silently copying a report's defect or inventing a source.

## Who does what

- **LLM roles** (DeepSeek through LangChain) interpret business meaning, review report SQL for KPIs, sources and joins, and propose designs, citing the evidence behind each observation.
- **Deterministic code** controls database access (scoped, read-only, behind a SQL guard), model commits, validation, rendering and release.
- **People** approve at three review checkpoints in a Next.js reviewer app with React Flow diagrams. DDL is exported for the customer's own deployment process; the agent never deploys.

## Engineering

A bounded LangGraph `StateGraph` with durable checkpoints (PostgresSaver), so a review can pause a run for days and resume it. PostgreSQL with pgvector holds the evidence catalog, immutable model versions, decisions and approvals; uploaded originals live in a private MinIO bucket; FastAPI and a workflow worker run in Docker Compose.
