---
title: Trino on Local
slug: trino-local
---

## The problem

Federated SQL is easy to slide-ware and hard to feel. I wanted Trino on a laptop with **multiple catalogs that actually resolve**: lakehouse formats on object storage, plus live JDBC to a warehouse and a database, without standing up a cluster.

The README is one line. The truth is in `docker-compose.yml` and six files under `catalog/`.

## What I built

Trino 455 as a single node — coordinator is also the worker, 1G heap — with six catalogs whose names are filenames:

Hive, Iceberg, Delta Lake, a second Hive catalog named `minio`, PostgreSQL JDBC, and ClickHouse JDBC.

Lakehouse catalogs share Hive Metastore (MariaDB, Thrift 9083) and MinIO as path-style S3. JDBC catalogs never go through the metastore. ClickHouse is reached on HTTP 8123 so MinIO can keep host 9000.

An ebyhr `storage` connector lives under `storage/` as Java source. It is not installed. `storage.properties` and `delta.properties` at the repo root are **not mounted**.

## Why this shape

Catalogs as files is how Trino actually works in production too — there is no magic registry. Federation means the engine does not copy data; a join can span MinIO parquet and Postgres in one SQL statement. Cache TTL on the metastore is 0s so a lab never serves a stale plan after you drop a table.

`docker-compose_no.yml` switches HMS to Postgres while `metastore-site.xml` still points at MariaDB. That overlay does not match. I leave it documented rather than pretending it is an alternate happy path.

## What I owned

The compose topology, catalog wiring, and a query path you can run without a cluster — including the files that look like catalogs and are not.
