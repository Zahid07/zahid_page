---
title: Email Exporter Consumer
slug: email-exporter-consumer
---

## The problem

Salla merchants need to export large slices of ClickHouse — orders, customers, catalog — as a file they can open. The request arrives as a Kafka message. The naive consumer pulls the result into Python, writes CSV, uploads, and emails. That design dies on wide exports, blocks the poller when one job hangs, and double-sends if Kafka redelivers.

I needed isolation per message, ClickHouse to write the file where it already lives next to the data, and a delivery path that still succeeds when a sidecar is down.

## What I built

Three Kafka pollers — sequential, queue, and batch — that **do not do the export**. Each accepted message becomes `python app/kafkaConsumeExecutor.py --message '<json>'`. Isolation is a process boundary.

The executor parses a Pydantic contract, takes a Redis lock (then caches the URL), loads SQL templates from disk, and asks ClickHouse to `INSERT INTO FUNCTION s3(..., 'CSVWithNames')`. Optional 24 date-slices go through a combiner. XLSX is skipped above 200k rows. MJML renders the mail with a presigned GET.

Postgres tracking, WebSocket progress, and Optimus ID encoding exist as modules. The executor does not import the last two. Postgres is off unless `PG_HOST` is set. A Redis or PG failure must not fail the export.

## Why this shape

ClickHouse writing S3 keeps Python off the hot path. Process-per-message keeps a bad export from killing the consumer. Dedup is store + export id + hash of parameters — not the whole payload — so retries with the same business key collapse.

Honest about production: Dockerfile `CMD` is sequential `consumer.py` (the queue file is not in the image). `send_email` is defined twice; SMTP to `localhost:1025` currently shadows Mailgun/SES. `IMPLEMENTATION.md` lags the code. The flow follows the code.

## What I owned

The consumer/executor split, the three load strategies, ClickHouse-side materialisation, Redis lock/cache, template queries, and the email path merchants actually wait on.
