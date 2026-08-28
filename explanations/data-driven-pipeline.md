---
title: Data-Driven Computing Architecture
slug: data-driven-pipeline
---

## The problem

The course asked for a full data-driven architecture: ingestion, a warehouse, a dashboard, a shareable product, quality, logging. The domain is a two-sided store — customers order, merchants manage catalog and stock.

That store is real: FastAPI, React, MySQL. Five 3NF tables (`customers`, `merchants`, `products`, `orders`, `order_items`) mutate all day. They have no surrogate keys, no grain contract, and nowhere to hang a five-day demand forecast. Analytics cannot live in that OLTP schema. The lakehouse exists to freeze those mutations into layers you can replay and model.

Some READMEs in the repo mention Spark, or Kafka as the bronze consumer. **The DAGs do neither.** I document what actually runs.

## What I built

A local lab that is a complete platform, not a slide:

- A working store and seeded OLTP.
- Debezium CDC into Kafka as a **sidecar** for change events.
- Config-driven Airflow that pulls MySQL through **Trino MERGE** into Delta on MinIO (bronze → silver → gold).
- Kimball gold: helper tables mint surrogates so Type-1 dimension updates do not rewrite facts.
- Gold parquet copied into ClickHouse. Nine semantic marts, a 5-day sklearn forecast, quality tables, Superset.

The store’s `/api/analytics/*` still computes on MySQL. That is deliberate: the UI needs live operational numbers. BI and ML need frozen gold.

## Why this shape

Trino SQL as ETL kept the warehouse in one language the course could inspect. `pipeline_configs` is the control plane — jobs, column maps, Dataset edges — so adding a table is data, not another DAG file. Overflow JSON in bronze lets the source grow without breaking silver contracts.

## What I owned

The end-to-end lab: OLTP app and schema, CDC, schema-driven lake pipelines, gold SQL, Dataset-ordered transformers, ClickHouse serving, marts, forecast, quality logging, and the Docker topology for each subsystem.
