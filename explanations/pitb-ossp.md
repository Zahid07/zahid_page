---
title: PITB OSSP Data Platform
slug: pitb-ossp
---

## The problem

Punjab Bureau of Statistics needed an **on-prem** lakehouse under data-sovereignty constraints: Tax, Health, Education, Finance, and more, terabytes daily, no “just put it in a cloud warehouse.”

If every new table is a new Airflow DAG, you drown in Python and you cannot see the graph. If serving and modelling share one engine, either BI is slow or the star is compromised. The GitLab README is still a template. The jobs are the documentation.

## What I built

The code plane: generic Python runners, thousands of SQL files, Airflow that only names a `pipeline_id`. **MySQL `pitb_monitoring` owns the graph** — schedule, task list, bash command, watermarks, batch mutex. Unpublished tables (`is_productionised = 0`) are stripped at parse time.

Raw and curated live as Delta on MinIO, queried through Trino `delta_lake` (and `delta_lake_secure` for PII). Semantic staging is a Hive write. Serving is ClickHouse thin layers — the BI contract. Flask Location and Assan Karobar consume ClickHouse; Flask is not the orchestrator.

Sources are mixed on purpose: JDBC, REST (eStamp, PRA, PFA, PLRA), Sqoop+Hadoop for health, Kafka for special education, CSV/Excel one-offs. A conformed `citizen_key` is how sectors join without each inventing a person.

Dev and prod are the same tree (`dd_` vs `dp_`), switched by an Airflow Variable named `env`.

## Why this shape

Metadata-driven DAGs mean onboarding a table is a registry row. Two engines mean Trino can model and ClickHouse can serve. A thin layer means BI does not query the star’s guts. Batch mutex means two pipelines do not stomp the same watermark.

## What I owned

Platform architecture and warehouse jobs for a sovereignty-constrained lakehouse: the metadata control plane, raw/curated/serving split, secure catalog for PII, and the pattern that adding a sector is data plus SQL — not a new orchestrator.
