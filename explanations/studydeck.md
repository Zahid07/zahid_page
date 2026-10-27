## What it is

[The Study Deck](https://thestudydeck.com) turns lecture slides, PDFs and photos of handwritten notes into study notes, flashcards, quizzes and mock papers. Cards a student keeps getting wrong come back sooner than the ones they know. I built and run it alone.

## The document pipeline

Each upload goes through a 12-stage pipeline: page triage, structure detection, vision extraction, a note planner, note generation, diagram generation, rendering and chunking, coverage scoring, persistence, persona detection and embedding. Extraction and note writing run on Vertex AI Gemini models, and chunks are embedded for retrieval (RAG) on PostgreSQL with pgvector HNSW indexes.

## Splitting the service

The first version ran everything in one Cloud Run service against one memory ceiling: a minutes-long background pipeline next to a fast text-in, JSON-out API. The slow work forced an always-on instance onto the fast API. I wrote a decision record, then split the slow stages into separate **page, note, diagram and embedding workers** on Cloud Run, orchestrated with **Cloud Tasks**, so each scales and fails on its own.

## Engineering

Python and FastAPI services on GCP Cloud Run, Cloud Tasks, Cloud SQL and Cloud Storage, Vertex AI Gemini, and pgvector. I also prototyped a local GPU pipeline (OCR, Qwen3-VL extraction, Gemma note writing) that runs one GPU job at a time.
