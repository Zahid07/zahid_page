---
title: Customer Group Evaluator
slug: customer-group-evaluator
---

## The problem

Salla merchants define automatic customer groups as conditions in MySQL — spend, last order, location, and how those clauses combine. When a group is due, every customer in the store has to be scored: who should join, who should leave. Doing that inside MySQL does not scale. Doing it inside this service *and* writing OpenSearch and MySQL from the same process couples evaluation to every sink outage.

The job of this service is to **evaluate and publish a delta**. Sinks write. Timeplus decides eligibility.

## What I built

A Kafka consumer (`evaluation-syncer` in logs, image `activate-customer-consumer-python`). Timeplus materialized view `mv_k_tp_groups_customer_groups_trigger_v2` emits `{ group_id }` only when the group is not expired and `status = queue`.

A thread pool runs `process_group`. MySQL conditions compile to a ClickHouse WHERE. Matched = satisfies the clause and not already in the group. Unmatched = in the group and no longer satisfies. Empty conditions compile to `1 = 0` — match nobody, do not match the world.

Three output topics (the README still says two): OpenSearch assign-only, MySQL upsert/delete, and a status flip to `active` even when both lists are empty. Downstream connectors own the writes.

## Why this shape

A full recompute on every trigger is how you melt ClickHouse and fan out duplicate assignments. A delta is the contract the sinks can apply. Committing Kafka after the worker is at-least-once: better a second evaluation than a lost group.

I followed the code where docs drifted: `OperatorType` 1 INTERSECT / 2 UNION / 3 DIFFERENCE / 4 COMPLEMENT (README swaps 1 and 2); env vars `KAFKA_TOPICS`, `MYSQL_USERNAME`, `MYSQL_DATABASE_NAME`.

## What I owned

The consumer loop, condition-to-SQL compiler, ClickHouse delta, and the three-topic publish contract — including the decision to keep sink I/O out of this process.
