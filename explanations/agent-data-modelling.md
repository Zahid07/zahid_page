---
title: Data Modelling Agent
slug: agent-data-modelling
---

## The problem

Interloop runs HMS, a custom Oracle 11g hosiery system. Nobody documented it. There is no trustworthy data dictionary. The only faithful description of grain, keys, and business meaning is **345 report queries** — the reports *are* the schema.

Hand-modelling that into a warehouse is slow, and it fails quietly. A fluent but wrong entity becomes a dashboard number nobody can defend six months later. I wanted a process that is repeatable, gated, and evidenced — a modelling run you can audit, not a chat you have to trust.

## What I built

An eight-stage pipeline of Claude Code subagents that reverse-engineers HMS into a governed warehouse model and ships executable SQL toward S3, Redshift, and Tableau.

Every stage has a second agent whose job is to disagree. The next stage is not allowed to start until that check is green. Nine agent definitions are scoped so each cannot wander. A worked example takes one table through every pass so the method is visible, not just claimed.

The output is not a slide. It is 422 source profiles, 303 conceptual entities, 96 dimensions and 133 facts, 4,543 mapping rows, and 47 gold marts — plus 137 logged design decisions checked against artefacts.

## Why this shape

If the validator is the same model that wrote the draft, it will agree with itself. Splitting “propose” from “attack” is the whole point. The adversarial gate is how a fluent wrong CDM dies on the floor instead of becoming the LDM.

I also refused to treat the conversation as the deliverable. 110 Python scripts and 25 shared libraries exist so a rerun produces the same evidence. If it is not in an artefact, it did not happen.

## What I owned

The gated multi-agent process, the validator-as-adversary pattern, the artefact contract, and the mapping from undocumented Oracle into mart SQL. This is the modelling system I would run again on the next undocumented ERP — not a one-off notebook.
