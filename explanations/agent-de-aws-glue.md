---
title: AWS Agentic DE
slug: agent-de-aws-glue
---

## The problem

Oracle lands as Iceberg bronze. Silver is a star schema built by AWS Glue. The logical model already exists as SQL. The failure mode is not “we cannot generate jobs.” It is that someone hand-edits generated Glue, the next generator run silently reverts them, and three weeks later CloudWatch is how you find out a measure is wrong.

An agent that *discovers* this platform from scratch every session will rediscover the same scars. I wanted a session that starts already knowing the rules.

## What I built

A framework that encodes those rules. Reference SQL is exported from the LDM into `input/<module>/*.sql`. A generator turns it into deployable Glue jobs. An **offline invariant audit** — no AWS credentials — has to pass before anyone is allowed to touch the cloud. The agent then prepares commands. A human runs anything that changes AWS or deletes data.

Generated trees such as `new_silver/` are not source. A defect there is a defect in the generator. Patching the artefact is how you lose.

## Why this shape

Correctness that needs a cluster to check will be skipped. The audit runs in seconds on a laptop and catches the class of bug that otherwise becomes a wrong number after everyone has forgotten the change.

Splitting prepare from execute is not ceremony. It is how you keep an agent from becoming a principal that can wipe a table. Credentials stay in the operator’s shell.

## What I owned

The operating model, the generator/audit loop, and the invariant that Glue jobs stay derived from the LDM. The agent is a disciplined intern with a checklist — not an unsupervised account in production.
