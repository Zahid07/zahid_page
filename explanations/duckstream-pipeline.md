---
title: DuckStream Pipeline
slug: duckstream-pipeline
---

## The problem

An accelerometer on a Raspberry Pi 5 publishes about 100 readings a second over MQTT. MQTT cannot be replayed. Once you ack, the broker has thrown the message away. There is no offset to rewind.

A DuckLake commit on this machine costs ~26 ms. Write each reading straight to the database and you cap out around 35/s — you fall behind immediately — and you also create millions of tiny parquet files. I needed at-least-once ingest that does not lose, and exactly-once modelling that does not double-count, on a Pi, without pretending MQTT is Kafka.

## What I built

Two processes that **never talk**. They meet at a landing tree of ordinary parquet files.

`ingest.py` buffers in memory and writes a file at 2,000 rows or 5 seconds, plus a `_READY` marker. It acks only when that file is durable. That side is allowed to repeat. `pipeline.py` wakes every 3 seconds, runs three models plus SCD2 in one transaction, and commits one snapshot. That side must not repeat.

The star is `fact_accelerometer`, hourly and minute-spectrum summaries, `location_dim`, and views. The dashboard exists because two numbers were wrong; timings in the write-up were measured here, not estimated.

## Why this shape

Files can be re-read. MQTT cannot. Landing durably first is what turns an unrepeatable stream into a replayable source — the only way the second process can promise exactly-once.

Batching is not an optimisation on top. It is the difference between a working Pi and a disk full of 100-byte objects.

## How long it takes

Measured on this Raspberry Pi 5 (aarch64, 4 cores, 4 GB, DuckDB 1.5.5):

- **Ingest hold** — up to 5 s (`--flush-seconds`). That is most of the delay, and it is the knob to turn.
- **Wait for the next cycle** — up to 3 s (`--interval`).
- **The cycle** — ~1.5 s with data, ~540 ms idle. Attach is ~11 ms. Catalog is held only for steps 1–5, so a reader still got in ~86% of the time at a 2 s interval.
- **Sensor to mart** — about **5–9 s**. Raw parquet is readable as soon as the file lands, with no catalog.
- **Commit floor** — ~26 ms. That is why one-row writes cap out around 35/s.

`TOOK` is per model (typically 70–120 ms) and **does not include the commit**. A cycle in the log is ~1,000 ms because three models each pay that 26 ms floor. Below a second or two of flush there is nothing left to win: committing more often just means more snapshots for less data.

## What I owned

The landing-tree seam, the ingest/pipeline split, the star schema, SCD2, and the dashboard that made the bad numbers visible. This is a small lakehouse with adult delivery guarantees.
