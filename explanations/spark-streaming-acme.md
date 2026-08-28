---
title: ACME Spark Streaming
slug: spark-streaming-acme
---

## The problem

ACME Delivery Services needed near-real-time answers over a living order book: open orders by delivery date, the busiest upcoming dates, pending items by product, customers with the most pending orders.

The starter stack already wrote those orders into PostgreSQL. Scanning `operations` for those four questions fights OLTP. The work was to stream every insert and update into a dimensional schema those questions can hit without touching the system of record.

The solution PDF and the repo disagree in places. This write-up follows the code.

## What I built

One Postgres instance, two schemas. `operations` is OLTP (pg_cron keeps it moving). `analytical` is the warehouse. They never share tables.

WAL logical decoding → Debezium (`pgoutput`) → four Kafka topics → four Spark Structured Streaming queries (`implementation/main.py`, Spark 3.5 `local[4]`, 10s trigger). Spark JDBC cannot upsert, so each micro-batch overwrites staging, then `INSERT ON CONFLICT` MERGE, then history, then truncate.

The model is SCD Type 4 (current + history). Hard deletes (`op=d`) are dropped. The source typo `quanity` is preserved in `_additional_columns` rather than “fixed” into a column the producer does not send. FastAPI + React poll every 10 seconds — the same clock as Spark.

Starter = OLTP, Debezium, Kafka, Conduktor. I built the Spark consumer, analytical DDL, and the visualization API/UI.

## Why this shape

Staging MERGE exists because pretending Spark JDBC can upsert is how you get duplicates. `coalesce(1)` exists because local-mode JDBC deadlocked without it. Matching the UI poll to the trigger means the dashboard is not claiming a freshness the stream does not have.

## What I owned

The CDC-to-star path, four micro-batch consumers, SCD4 dimensions, the additional-columns escape hatch, and the API that answers the four questions without scanning OLTP.
