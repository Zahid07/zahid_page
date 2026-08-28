export type Tone = "source" | "process" | "store" | "serve" | "gate";

export type ArchNode = {
  label: string;
  sub?: string;
  tone?: Tone;
};

export type ArchStage = {
  n: string;
  title: string;
  body: string;
  systems?: string[];
  gate?: string;
};

export type Timing = {
  stage: string;
  cost: string;
  note: string;
  highlight?: boolean;
};

export type Architecture = {
  caption: string;
  map: ArchNode[];
  stages: ArchStage[];
  decisions: { title: string; body: string }[];
  timings?: Timing[];
  timingNote?: string;
};

export const architectures: Record<string, Architecture> = {
  "agent-data-modelling": {
    caption:
      "Eight gated passes. A second agent is paid to disagree before the next one starts. The artefacts are the proof, not the chat log.",
    map: [
      { label: "Oracle 11g HMS", sub: "undocumented", tone: "source" },
      { label: "345 report SQL", sub: "the real docs", tone: "source" },
      { label: "8 agent stages", sub: "gated", tone: "process" },
      { label: "Adversarial check", sub: "must be green", tone: "gate" },
      { label: "SMX + marts", sub: "4,543 maps", tone: "store" },
      { label: "S3 / Redshift", sub: "executable SQL", tone: "serve" },
    ],
    stages: [
      {
        n: "00",
        title: "Requirements",
        body: "Statement of work and nine BPDs set the modelling contract before any table is touched.",
        systems: ["SOW", "9 BPDs"],
      },
      {
        n: "01",
        title: "ISD",
        body: "Profile the source as it actually is: 422 table profiles from Oracle, not from a dictionary that does not exist.",
        systems: ["422 profiles"],
      },
      {
        n: "02",
        title: "Extended ISD",
        body: "Infer 820 relations from how reports use the data — declared FKs were never enough.",
        systems: ["820 relations"],
      },
      {
        n: "03",
        title: "Entity graph",
        body: "Collapse aliases and report-only shapes. 632 of 887 nodes survive as real entities.",
        systems: ["632 / 887"],
      },
      {
        n: "04",
        title: "CDM",
        body: "303 conceptual entities — the business language, still independent of warehouse keys.",
        systems: ["303 entities"],
      },
      {
        n: "05",
        title: "LDM",
        body: "96 dimensions and 133 facts. Grain is decided here, not later in a dashboard.",
        systems: ["96D", "133F"],
      },
      {
        n: "06",
        title: "SMX",
        body: "4,543 mapping rows, column by column, so every gold field has a source and a rule.",
        systems: ["4,543 rows"],
      },
      {
        n: "07",
        title: "Data marts",
        body: "47 gold marts shipped as executable SQL toward S3, Redshift, and Tableau.",
        systems: ["47 marts"],
        gate: "Both validators green before anything is treated as done.",
      },
    ],
    decisions: [
      {
        title: "Reports are the schema",
        body: "HMS never documented itself. Grain and meaning live in 345 queries, so those queries are the source of truth.",
      },
      {
        title: "A second agent that disagrees",
        body: "Each stage is blocked until an adversarial check passes. That is what stops a fluent wrong model from becoming the warehouse.",
      },
      {
        title: "Evidence over chat",
        body: "110 Python scripts, 25 libraries, 137 logged decisions. A run is a pile of artefacts, not a transcript.",
      },
    ],
  },
  "agent-de-aws-glue": {
    caption:
      "The agent prepares. The operator executes. Generated Glue is not source — a defect there is a defect in the generator.",
    map: [
      { label: "LDM SQL", sub: "input/<module>", tone: "source" },
      { label: "Generator", sub: "offline", tone: "process" },
      { label: "Invariant audit", sub: "no AWS creds", tone: "gate" },
      { label: "Operator", sub: "runs AWS", tone: "gate" },
      { label: "Iceberg silver", sub: "star on bronze", tone: "store" },
      { label: "Oracle bronze", sub: "S3", tone: "source" },
    ],
    stages: [
      {
        n: "01",
        title: "Generate",
        body: "Reference SQL from the logical model becomes deployable Glue job code. Nothing under new_silver/ is hand-edited.",
        systems: ["LDM", "Glue generator"],
      },
      {
        n: "02",
        title: "Invariant audit",
        body: "Catches the class of bug that otherwise becomes a wrong number months later. Runs in seconds. Needs no cloud credentials.",
        systems: ["Offline checks"],
        gate: "Audit green, or the build does not move.",
      },
      {
        n: "03",
        title: "Prepare",
        body: "The agent stages commands and diffs. It does not hold production credentials.",
        systems: ["Runbook", "Diff"],
      },
      {
        n: "04",
        title: "Operator execute",
        body: "Anything that changes AWS or deletes data is a command a human runs.",
        systems: ["AWS Glue", "S3"],
      },
      {
        n: "05",
        title: "Verify",
        body: "Silver Iceberg tables match the intended star on Oracle bronze.",
        systems: ["Iceberg", "Star schema"],
      },
    ],
    decisions: [
      {
        title: "Generated output is not source",
        body: "Patch the artefact and the next run silently reverts you. Fix the generator.",
      },
      {
        title: "Correctness is offline-checkable",
        body: "The invariant audit is the gate that used to be a CloudWatch surprise three weeks later.",
      },
      {
        title: "Agent prepares, operator executes",
        body: "Credentials live in the operator’s shell. The agent never becomes the thing that can wipe a table.",
      },
    ],
  },
  "duckstream-pipeline": {
    caption:
      "Two processes that never talk. They meet at parquet on disk. That seam is what turns an unrepeatable MQTT stream into exactly-once DuckLake. Every figure below was measured on this Raspberry Pi 5.",
    timingNote: "Raspberry Pi 5 · aarch64 · 4 cores · 4 GB · DuckDB 1.5.5. Not estimates.",
    timings: [
      {
        stage: "Ingest hold",
        cost: "up to 5 s",
        note: "--flush-seconds. The biggest part of sensor-to-mart delay, and yours to choose.",
      },
      {
        stage: "Wait for cycle",
        cost: "up to 3 s",
        note: "--interval. Pipeline wakes every three seconds.",
      },
      {
        stage: "Cycle with data",
        cost: "~1.5 s",
        note: "Idle cycle is ~540 ms. Attach is ~11 ms. Catalog held only during steps 1–5.",
      },
      {
        stage: "Sensor to mart",
        cost: "~5–9 s",
        note: "End to end on this Pi. Raw parquet is readable as soon as the file lands.",
        highlight: true,
      },
      {
        stage: "DuckLake commit",
        cost: "~26 ms",
        note: "Why per-reading writes cap out around 35/s — not merely slow, impossible.",
      },
      {
        stage: "TOOK vs wall clock",
        cost: "70–120 ms / model",
        note: "TOOK excludes the commit. Three models × ~26 ms commit is why a cycle logs ~1,000 ms.",
      },
    ],
    map: [
      { label: "Sensor", sub: "~100 / s", tone: "source" },
      { label: "MQTT", sub: "ack = gone", tone: "source" },
      { label: "ingest.py", sub: "at-least-once", tone: "process" },
      { label: "landing/", sub: "parquet + READY", tone: "store" },
      { label: "pipeline.py", sub: "exactly-once", tone: "process" },
      { label: "DuckLake", sub: "star + SCD2", tone: "serve" },
    ],
    stages: [
      {
        n: "01",
        title: "Sense",
        body: "The accelerometer publishes about a hundred readings a second. MQTT cannot be replayed — once acknowledged, the broker has thrown the message away.",
        systems: ["Sensor", "MQTT"],
      },
      {
        n: "02",
        title: "Ingest",
        body: "Buffer in memory. Write a parquet file at 2,000 rows or 5 seconds. Ack only when that file is durable. At-least-once on purpose.",
        systems: ["ingest.py", "≤5 s flush"],
      },
      {
        n: "03",
        title: "The seam",
        body: "landing/ holds data.parquet and a _READY marker. Files can be re-read. That is the whole reason this is two processes. Raw readings are queryable via read_parquet as soon as the file lands — no catalog required.",
        systems: ["parquet", "_READY"],
      },
      {
        n: "04",
        title: "Pipeline",
        body: "Every 3 seconds: attach (~11 ms), drain three models, SCD2, views, detach, sleep the remainder. With data ~1.5 s; idle ~540 ms so it writes zero snapshots. A DuckLake commit is ~26 ms — writing each reading straight in would cap out around 35/s.",
        systems: ["pipeline.py", "~1.5 s", "commit ~26 ms"],
      },
      {
        n: "05",
        title: "Serve",
        body: "fact_accelerometer, hourly summary, minute spectrum, location_dim, plus views. Numbers on the original write-up were measured on the machine.",
        systems: ["DuckLake"],
      },
    ],
    decisions: [
      {
        title: "Landing is the contract",
        body: "MQTT is at-least-once and unreplayable. Files convert that into a source the second process can promise exactly-once on.",
      },
      {
        title: "Batch or drown",
        body: "2,000 readings become one file. Per-row commits would also produce millions of tiny parquet files a day.",
      },
      {
        title: "Measure, don’t estimate",
        body: "The dashboard existed because two numbers were wrong. Timings are from this Pi 5, not a blog.",
      },
    ],
  },
  "data-driven-pipeline": {
    caption:
      "The store is MySQL. The warehouse is Trino into Delta, then ClickHouse. Kafka is a CDC sidecar — it is not how bronze gets loaded.",
    map: [
      { label: "Simple Store", sub: "FastAPI + React", tone: "source" },
      { label: "MySQL OLTP", sub: "5 tables", tone: "source" },
      { label: "Debezium / Kafka", sub: "CDC sidecar", tone: "process" },
      { label: "Airflow + Trino", sub: "MERGE to Delta", tone: "process" },
      { label: "Gold star", sub: "HLP · DIM · FCT", tone: "store" },
      { label: "ClickHouse + Superset", sub: "marts · forecast", tone: "serve" },
    ],
    stages: [
      {
        n: "01",
        title: "Operate",
        body: "Customers and merchants use a real store. Five 3NF tables mutate. That schema cannot hold surrogate keys or a five-day forecast.",
        systems: ["MySQL", "FastAPI", "React"],
      },
      {
        n: "02",
        title: "CDC beside the lake",
        body: "Binlog → Debezium → Kafka for change events. Bronze does not consume those topics. Lake load is a separate Trino MERGE with an updated_at watermark.",
        systems: ["Debezium", "Kafka"],
      },
      {
        n: "03",
        title: "Bronze / silver",
        body: "Config-driven Airflow DAGs. Trino INSERT to staging, MERGE into Delta on MinIO. Overflow JSON in bronze, promote in silver.",
        systems: ["Airflow", "Trino", "MinIO"],
      },
      {
        n: "04",
        title: "Gold",
        body: "Helper tables mint surrogates so Type-1 dimension updates do not rewrite facts. Then fct_orders and fct_order_items.",
        systems: ["HLP", "DIM", "FCT"],
      },
      {
        n: "05",
        title: "Serve",
        body: "Parquet copied into ClickHouse. Nine semantic marts, a 5-day sklearn forecast, quality tables, Superset. Store /api/analytics/* still runs on MySQL — live vs warehouse on purpose.",
        systems: ["ClickHouse", "Superset"],
      },
    ],
    decisions: [
      {
        title: "Trino SQL is the ETL",
        body: "READMEs mention Spark. The DAGs do not. The warehouse is Trino MERGE into Delta.",
      },
      {
        title: "pipeline_configs is the control plane",
        body: "Jobs, column maps, Dataset edges, and gold task lists live in seed SQL, not in a forest of one-off DAGs.",
      },
      {
        title: "Two analytics planes",
        body: "The store UI needs live OLTP. BI, forecast, and quality need frozen gold. They are not the same query.",
      },
    ],
  },
  "email-exporter-consumer": {
    caption:
      "The consumer does not do the work. It spawns an executor. ClickHouse writes the file to S3. This process holds URLs, not result sets.",
    map: [
      { label: "Export request", sub: "Kafka JSON", tone: "source" },
      { label: "3 poll strategies", sub: "seq · queue · batch", tone: "process" },
      { label: "Executor subprocess", sub: "one message", tone: "process" },
      { label: "ClickHouse → S3", sub: "CSVWithNames", tone: "store" },
      { label: "Redis lock / cache", sub: "60s then 900s", tone: "gate" },
      { label: "Email + link", sub: "MJML", tone: "serve" },
    ],
    stages: [
      {
        n: "01",
        title: "Poll",
        body: "A merchant asks for an export. Another service publishes JSON. live must be false or the message is skipped.",
        systems: ["Kafka"],
      },
      {
        n: "02",
        title: "Choose a consumer",
        body: "Sequential wait, queue workers, or batch+chunk. All three only spawn kafkaConsumeExecutor.py. Isolation is a process, not a thread. Docker CMD is sequential consumer.py.",
        systems: ["consumer.py", "queue", "batches"],
      },
      {
        n: "03",
        title: "Lock, parse, export",
        body: "Pydantic contract, Redis lock then URL cache, SQL templates on disk, optional 24 date slices. ClickHouse INSERT INTO FUNCTION s3(..., 'CSVWithNames').",
        systems: ["Redis", "ClickHouse", "MinIO"],
      },
      {
        n: "04",
        title: "File and mail",
        body: "Row-count gate skips XLSX above 200k. Pandas converts when needed. MJML renders the mail. Sidecar failures (Postgres, Redis, combiner) must not fail the export.",
        systems: ["XLSX", "MJML", "Graylog"],
        gate: "WebSocket and Optimus modules exist and are not imported by the executor.",
      },
    ],
    decisions: [
      {
        title: "Process isolation",
        body: "A bad export dies in a subprocess. The poller keeps running.",
      },
      {
        title: "ClickHouse writes the file",
        body: "Python does not materialise the main result set. It asks MinIO for a presigned GET.",
      },
      {
        title: "Prefer to continue",
        body: "IMPLEMENTATION.md lags the code. SMTP to localhost:1025 currently shadows Mailgun/SES. Dedup is store + export id + hash of parameters.",
      },
    ],
  },
  "customer-group-evaluator": {
    caption:
      "This process evaluates. It does not write MySQL or OpenSearch. Timeplus decides who is eligible. Three Kafka streams carry the delta.",
    map: [
      { label: "Timeplus MV", sub: "status=queue", tone: "source" },
      { label: "Kafka group_id", sub: "KAFKA_TOPICS", tone: "process" },
      { label: "MySQL conditions", sub: "compile WHERE", tone: "store" },
      { label: "ClickHouse delta", sub: "join / leave", tone: "process" },
      { label: "3 output topics", sub: "OS · MySQL · status", tone: "serve" },
      { label: "Sink connectors", sub: "they write", tone: "gate" },
    ],
    stages: [
      {
        n: "01",
        title: "Trigger",
        body: "Timeplus MV emits only when the group is not expired and status is queue. Payload is { group_id }.",
        systems: ["Timeplus"],
      },
      {
        n: "02",
        title: "Consume",
        body: "Thread pool, in-flight cap, skip duplicates, commit after the worker — at-least-once on purpose.",
        systems: ["consumer.py"],
      },
      {
        n: "03",
        title: "Compile",
        body: "Read groups, conditions, relationships from MySQL. OperatorType in code: 1 INTERSECT, 2 UNION, 3 DIFFERENCE, 4 COMPLEMENT. Empty conditions become 1 = 0.",
        systems: ["MySQL", "QueryGenerator"],
      },
      {
        n: "04",
        title: "Score",
        body: "Matched = WHERE and not already in the group. Unmatched = already in the group and no longer match. Delta, not a full recompute.",
        systems: ["ClickHouse"],
      },
      {
        n: "05",
        title: "Fan-out",
        body: "Three topics (README still says two): OpenSearch assign-only, MySQL upsert/delete, status active even when both lists are empty.",
        systems: ["Kafka × 3"],
        gate: "Sinks own the writes. This image never talks to OpenSearch or customer_groups_v2 directly.",
      },
    ],
    decisions: [
      {
        title: "Eligibility lives upstream",
        body: "Timeplus filters. This service does not re-decide whether a group should run.",
      },
      {
        title: "Publish a delta",
        body: "Join and leave lists, not “here is every member again.”",
      },
      {
        title: "Follow the code",
        body: "Env names are KAFKA_TOPICS, MYSQL_USERNAME, MYSQL_DATABASE_NAME. Operator numbering in the README is swapped.",
      },
    ],
  },
  "trino-local": {
    caption:
      "Catalogs are files. Filename minus .properties is the name you query. Trino federates — it does not copy.",
    map: [
      { label: "SQL client", sub: ":8080", tone: "serve" },
      { label: "Trino 455", sub: "coordinator=worker", tone: "process" },
      { label: "6 catalog files", sub: "Hive · Iceberg · Delta", tone: "process" },
      { label: "Hive Metastore", sub: "MariaDB · :9083", tone: "store" },
      { label: "MinIO", sub: "path-style S3", tone: "store" },
      { label: "PG + ClickHouse", sub: "JDBC", tone: "source" },
    ],
    stages: [
      {
        n: "01",
        title: "Client",
        body: "HTTP :8080. Single node: coordinator is also the worker, 1G heap. There is no separate worker service.",
        systems: ["Trino 455"],
      },
      {
        n: "02",
        title: "Pick a catalog",
        body: "Compose mounts ./catalog to /etc/trino/catalog. Six files, six names. Changing a connector means editing a file and restarting Trino.",
        systems: ["hive", "iceberg", "delta", "minio", "postgresql", "clickhouse"],
      },
      {
        n: "03",
        title: "Lakehouse path",
        body: "Hive, Iceberg, Delta, and the extra Hive catalog named minio share Hive Metastore + MinIO. Metadata over Thrift 9083. Bytes over path-style S3.",
        systems: ["HMS", "MinIO"],
      },
      {
        n: "04",
        title: "JDBC path",
        body: "PostgreSQL and ClickHouse never go through the metastore. ClickHouse is HTTP 8123 so MinIO can keep host 9000.",
        systems: ["PostgreSQL", "ClickHouse"],
        gate: "storage.properties and delta.properties at repo root are not mounted. The Java storage/ plugin is source only.",
      },
    ],
    decisions: [
      {
        title: "Files, not a registry",
        body: "A catalog is a properties file. That is the whole operational model.",
      },
      {
        title: "Federate, don’t copy",
        body: "One engine, two storage planes. Lakehouse through HMS+MinIO; warehouses through JDBC.",
      },
      {
        title: "Lab honesty",
        body: "docker-compose_no.yml switches HMS to Postgres while metastore-site.xml still points at MariaDB. That file is not a working overlay.",
      },
    ],
  },
  "spark-streaming-acme": {
    caption:
      "One Postgres, two schemas. operations is OLTP. analytical is the warehouse. They meet only through Debezium, Kafka, and four Spark queries.",
    map: [
      { label: "operations.*", sub: "pg_cron", tone: "source" },
      { label: "WAL / pgoutput", sub: "CDC slot", tone: "process" },
      { label: "Debezium", sub: "Connect", tone: "process" },
      { label: "4 Kafka topics", sub: "finance_db.*", tone: "process" },
      { label: "Spark 3.5", sub: "foreachBatch", tone: "process" },
      { label: "analytical + UI", sub: "SCD4 · 10s", tone: "serve" },
    ],
    stages: [
      {
        n: "01",
        title: "OLTP",
        body: "customers, products, orders, order_items. pg_cron keeps the book moving so CDC has something to say.",
        systems: ["PostgreSQL 12"],
      },
      {
        n: "02",
        title: "Capture",
        body: "Logical WAL, pgoutput slot, Debezium finance-db-connector. Four topics, one per table.",
        systems: ["Debezium", "Kafka"],
      },
      {
        n: "03",
        title: "Stream",
        body: "Four Structured Streaming queries, earliest offsets, 10s trigger, local[4]. Spark JDBC cannot upsert, so each micro-batch overwrites staging then MERGE.",
        systems: ["PySpark 3.5"],
      },
      {
        n: "04",
        title: "Warehouse",
        body: "SCD Type 4 current + history. Hard deletes dropped. The source column quanity is kept in _additional_columns rather than invented as quantity.",
        systems: ["analytical schema"],
      },
      {
        n: "05",
        title: "Serve",
        body: "FastAPI on :8001, React on :3000, 10s poll matched to the Spark trigger. Four questions without scanning OLTP.",
        systems: ["FastAPI", "React"],
        gate: "Where the PDF disagrees, the repo wins: inline SQL, JDBC overwrite, no Spark window dedup.",
      },
    ],
    decisions: [
      {
        title: "Staging MERGE",
        body: "Spark JDBC has no upsert. Overwrite staging, INSERT ON CONFLICT, then history.",
      },
      {
        title: "SCD Type 4",
        body: "Current row plus a history table. Status is copied onto history so the four questions stay simple.",
      },
      {
        title: "Same clock as the UI",
        body: "10 second trigger, 10 second poll. The dashboard is not lying about freshness.",
      },
    ],
  },
  triptop: {
    caption:
      "Flutter talks JSON. Flask does not invent SQL — it loads files. PostgreSQL is a snowflake whose grain is one student on one trip.",
    map: [
      { label: "Flutter client", sub: "sibling repo", tone: "serve" },
      { label: "Flask /api/v1", sub: "23 blueprints", tone: "process" },
      { label: "SQL files", sub: "allQueries/", tone: "process" },
      { label: "PostgreSQL 12", sub: "snowflake", tone: "store" },
      { label: "JWT + OTP", sub: "issued, not mounted", tone: "gate" },
      { label: "Booking API", sub: "client not wired", tone: "gate" },
    ],
    stages: [
      {
        n: "01",
        title: "Register",
        body: "Student (OTP + Finnish university domain), staff (pending profile), admin (org + user in one call).",
        systems: ["OTP", "SMTP"],
      },
      {
        n: "02",
        title: "Authenticate",
        body: "JWT is issued on sign-in. require_auth exists and is not mounted on any route. That is the current contract, not a diagram fiction.",
        systems: ["PyJWT", "user_sessions"],
      },
      {
        n: "03",
        title: "Catalog",
        body: "Lookups, trip list, itinerary detail — what the Flutter admin home actually calls.",
        systems: ["GET", "get_trips"],
      },
      {
        n: "04",
        title: "Compose & book",
        body: "Location → trip → ordered itinerary rows. Booking enforces uniqueness, capacity, start time, price, QR. Flutter does not call these yet.",
        systems: ["Flask", "SQL files"],
      },
      {
        n: "05",
        title: "Attend",
        body: "devices and checkins exist in DDL. There is no blueprint.",
        systems: ["DDL only"],
      },
    ],
    decisions: [
      {
        title: "SQL files are the join contract",
        body: "Handlers load named queries. Grain stays one student on one trip instead of collapsing into JSON blobs.",
      },
      {
        title: "Lookups, not denormalized stars",
        body: "Organization, university, location, and role sit as dimensions. Itinerary is ordered rows.",
      },
      {
        title: "Honest about the client",
        body: "This repo is backend + schema. Flutter covers welcome, sign-up, sign-in, admin list. Staff/customer home is a stub.",
      },
    ],
  },
  "pitb-ossp": {
    caption:
      "Airflow does not contain the graph — MySQL does. A DAG file names a pipeline_id. Everything else loads at parse time.",
    map: [
      { label: "Sector sources", sub: "JDBC · API · Sqoop", tone: "source" },
      { label: "MySQL control", sub: "pitb_monitoring", tone: "gate" },
      { label: "Airflow renderer", sub: "pipeline_id", tone: "process" },
      { label: "Delta on MinIO", sub: "raw · curated", tone: "store" },
      { label: "Trino star", sub: "delta_lake", tone: "process" },
      { label: "ClickHouse thin", sub: "BI contract", tone: "serve" },
    ],
    stages: [
      {
        n: "01",
        title: "Register",
        body: "Onboard a table into ingestion_metadata: watermarks, masking, catalog, merge column. Unpublished rows (is_productionised = 0) never enter the DAG.",
        systems: ["automate.py", "MySQL"],
      },
      {
        n: "02",
        title: "Land raw",
        body: "dl_rw_job.py: truncate staging, then full, API, or CDC merge/append into Delta. Secure catalog for PII-heavy departments.",
        systems: ["Trino", "MinIO"],
      },
      {
        n: "03",
        title: "Build the star",
        body: "run_ct_job: lookups → helpings → dimensions → facts. Conformed citizen_key across Tax, Health, Education, Finance.",
        systems: ["Jobs/Curated"],
      },
      {
        n: "04",
        title: "Semantic staging",
        body: "run_ld_job copies the modelled tables into Hive hive.:env_semantic_stg — the hand-off toward serving.",
        systems: ["Hive"],
      },
      {
        n: "05",
        title: "Serve",
        body: "ClickHouse thin layers (tl_*) are the BI contract. Flask Location and Assan Karobar consume ClickHouse. Flask is not the orchestrator.",
        systems: ["ClickHouse", "Flask"],
      },
      {
        n: "06",
        title: "Close the batch",
        body: "Mutex, Dataset outlet, production email. Dev and prod are the same tree (dd_ vs dp_), switched by an Airflow Variable named env.",
        systems: ["mutex", "email"],
      },
    ],
    decisions: [
      {
        title: "Graph in MySQL",
        body: "Adding a table is a registry row, not a new Python DAG. Airflow is a renderer.",
      },
      {
        title: "Two engines",
        body: "Trino models the star on Delta. ClickHouse serves the thin layer. They are not interchangeable.",
      },
      {
        title: "Sovereignty",
        body: "On-prem, MinIO, no cloud warehouse. The GitLab README is still a stub — the jobs are the documentation.",
      },
    ],
  },
};

export function getArchitecture(slug: string) {
  return architectures[slug];
}
