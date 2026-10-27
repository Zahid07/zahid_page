import type { Tone } from "@/lib/architecture";

export type Side = "left" | "right" | "top" | "bottom";

export type DiagramBox = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  lines?: string[];
  kicker?: string;
  tone?: Tone;
  shape?: "rect" | "diamond";
  group?: boolean;
};

export type DiagramEdge = {
  id: string;
  from?: string;
  to?: string;
  fromSide?: Side;
  toSide?: Side;
  path?: string;
  dashed?: boolean;
  label?: string;
  lx?: number;
  ly?: number;
};

export type FlowDiagramSpec = {
  id: string;
  title: string;
  caption?: string;
  width: number;
  height: number;
  boxes: DiagramBox[];
  edges: DiagramEdge[];
  notes?: { x: number; y: number; text: string }[];
  kind?: "flow" | "model";
};

export const tones: Record<
  Tone,
  { fill: string; stroke: string; text: string }
> = {
  source: {
    fill: "rgba(251, 191, 36, 0.14)",
    stroke: "rgba(252, 211, 77, 0.55)",
    text: "#fde68a",
  },
  process: {
    fill: "rgba(56, 189, 248, 0.14)",
    stroke: "rgba(125, 211, 252, 0.55)",
    text: "#7dd3fc",
  },
  store: {
    fill: "rgba(34, 211, 238, 0.12)",
    stroke: "rgba(103, 232, 249, 0.5)",
    text: "#67e8f9",
  },
  serve: {
    fill: "rgba(167, 139, 250, 0.14)",
    stroke: "rgba(196, 181, 253, 0.55)",
    text: "#c4b5fd",
  },
  gate: {
    fill: "rgba(255,255,255,0.08)",
    stroke: "rgba(255,255,255,0.38)",
    text: "#f4f4f5",
  },
};

function b(
  id: string,
  x: number,
  y: number,
  w: number,
  h: number,
  label: string,
  tone: Tone,
  extra: Partial<DiagramBox> = {},
): DiagramBox {
  return { id, x, y, w, h, label, tone, ...extra };
}

function e(
  id: string,
  from: string,
  to: string,
  extra: Partial<DiagramEdge> = {},
): DiagramEdge {
  return { id, from, to, fromSide: "right", toSide: "left", ...extra };
}

export const diagrams: Record<string, FlowDiagramSpec[]> = {
  "customer-group-evaluator": [
    {
      id: "e2e",
      title: "End to end",
      caption:
        "Dashed arrows are reads. Solid arrows are events. Sinks are other repositories.",
      width: 1080,
      height: 420,
      boxes: [
        b("tp", 8, 28, 200, 86, "Timeplus MV", "source", {
          lines: ["mv_k_tp_groups_trigger_v2", "not expired · status=queue"],
        }),
        b("kin", 248, 28, 168, 86, "Kafka input", "process", {
          lines: ["KAFKA_TOPICS", "{ group_id }"],
        }),
        b("svc", 456, 12, 280, 248, "This service", "process", {
          kicker: "consumer.py",
          group: true,
        }),
        b("pool", 472, 68, 248, 36, "ThreadPool · process_group(id)", "gate"),
        b("sql", 472, 112, 248, 36, "MySQL conditions → WHERE SQL", "gate"),
        b("chq", 472, 156, 248, 36, "ClickHouse matched / unmatched", "gate"),
        b("pub", 472, 200, 248, 44, "GroupAssignmentService", "process", {
          lines: ["produce · poll(0) · flush"],
        }),
        b("mysql", 248, 196, 168, 64, "MySQL", "store", {
          lines: ["groups · conditions", "relationships"],
        }),
        b("ch", 248, 280, 168, 64, "ClickHouse", "store", {
          lines: ["customer_profile", "+ customer_groups_v2"],
        }),
        b("os", 782, 16, 286, 72, "OpenSearch topic", "serve", {
          lines: ["auto_groups · matched only", "OpenSearch indexer"],
        }),
        b("ms", 782, 114, 286, 72, "MySQL-sync topic", "serve", {
          lines: ["customer_groups_v2 upsert/delete", "mysql_kafka_sink_connector"],
        }),
        b("st", 782, 212, 286, 72, "Active-group topic", "serve", {
          lines: ["salla.groups.status = active", "mysql-sink-connector-python"],
        }),
      ],
      edges: [
        e("e1", "tp", "kin"),
        e("e2", "kin", "svc"),
        e("e3", "mysql", "sql", { dashed: true, fromSide: "right", toSide: "left" }),
        e("e4", "ch", "chq", { dashed: true, fromSide: "right", toSide: "left" }),
        e("e5", "pub", "os", { fromSide: "right", toSide: "left" }),
        e("e6", "pub", "ms", { fromSide: "right", toSide: "left" }),
        e("e7", "pub", "st", { fromSide: "right", toSide: "left" }),
      ],
      notes: [
        {
          x: 8,
          y: 400,
          text: "Eligibility lives in Timeplus. This process never checks expired_at or status=queue.",
        },
      ],
    },
  ],
  "duckstream-pipeline": [
    {
      id: "e2e",
      title: "Sensor to DuckLake",
      caption:
        "MQTT cannot be replayed. Files can. The landing tree is what converts at-least-once into exactly-once.",
      width: 1080,
      height: 292,
      boxes: [
        b("sensor", 6, 104, 104, 66, "Sensor", "source", { lines: ["~100 / s"] }),
        b("ingest", 148, 70, 188, 134, "ingest.py", "process", {
          kicker: "Process 1 · ≤5 s",
          lines: ["buffer in memory", "2,000 rows or 5 s", "temp → rename", "ack when durable"],
        }),
        b("land", 374, 86, 150, 102, "landing/", "store", {
          kicker: "The seam",
          lines: ["data.parquet", "_READY", "readable immediately"],
        }),
        b("pipe", 562, 70, 196, 134, "pipeline.py", "source", {
          kicker: "Process 2 · 3 s",
          lines: ["idle ~540 ms", "with data ~1.5 s", "3 models + SCD2", "commit ~26 ms"],
        }),
        b("lake", 796, 70, 180, 134, "DuckLake", "serve", {
          lines: ["sensor→mart ~5–9 s", "fact_accelerometer", "hourly + spectrum", "location_dim"],
        }),
      ],
      edges: [
        e("e1", "sensor", "ingest", { label: "MQTT", lx: 129, ly: 96 }),
        e("e2", "ingest", "land"),
        e("e3", "land", "pipe"),
        e("e4", "pipe", "lake"),
      ],
      notes: [
        { x: 148, y: 230, text: "at-least-once · may repeat, never loses" },
        { x: 562, y: 230, text: "exactly-once · never repeats, never loses" },
        { x: 6, y: 268, text: "Pi 5 · ~100/s in · flush 5 s · cycle 3 s · commit ~26 ms · sensor→mart ~5–9 s" },
      ],
    },
    {
      id: "cycle",
      title: "One pipeline cycle — measured",
      caption:
        "Idle cycle ~540 ms · cycle with data ~1.5 s. Catalog is held only during steps 1–5, so at a 2 s interval an outside reader got in on 33 of 38 attempts (~86%). Steps 3 and 4 skip when nothing is new — an idle cycle now writes zero snapshots.",
      width: 1080,
      height: 300,
      boxes: [
        b("att", 18, 44, 136, 74, "1 · Attach", "process", {
          kicker: "~11 ms",
          lines: ["open catalog", "take the lock"],
        }),
        b("drain", 186, 44, 330, 150, "2 · Drain — three models", "source", {
          kicker: "the work",
          lines: [
            "fact_accelerometer · merge by key",
            "hourly_summary · fold into the hour",
            "minute_spectrum · rebuild the minute",
          ],
        }),
        b("dim", 548, 44, 152, 74, "3 · Dimension", "store", {
          kicker: "if new locations",
          lines: ["SCD2 · else skip"],
        }),
        b("views", 732, 44, 132, 74, "4 · Views", "store", {
          kicker: "if missing",
          lines: ["create or skip"],
        }),
        b("det", 896, 44, 166, 74, "5 · Detach", "process", {
          kicker: "releases the lock",
          lines: ["others can read"],
        }),
        b("sleep", 452, 198, 180, 32, "6 · sleep the remainder", "gate"),
      ],
      edges: [
        e("c1", "att", "drain"),
        e("c2", "drain", "dim"),
        e("c3", "dim", "views"),
        e("c4", "views", "det"),
        {
          id: "c5",
          path: "M 979 122 L 979 214 L 86 214 L 86 126",
          dashed: true,
        },
      ],
      notes: [
        { x: 18, y: 268, text: "Idle ~540 ms · with data ~1.5 s · TOOK is per model (70–120 ms) and excludes the ~26 ms commit" },
        { x: 18, y: 286, text: "A whole cycle is roughly three TOOK rows plus three commits — that is why the log shows ~1,000 ms" },
      ],
    },
    {
      id: "star",
      kind: "model",
      title: "Star schema — keys live on the dimension",
      caption:
        "Facts keep the location name (natural key). location_dim holds the surrogate. Views join them so queries see location_key without the fact carrying SCD2 history.",
      width: 1080,
      height: 280,
      boxes: [
        b("fact", 10, 40, 320, 86, "curated.fact_accelerometer", "serve", {
          kicker: "What duckstream writes",
          lines: ["timestamp, location, x, y, z", "natural key only — the name"],
        }),
        b("mart", 10, 146, 320, 86, "marts.accel_hourly_summary", "serve", {
          lines: ["window_ts, location, sample_count", "natural key only"],
        }),
        b("dim", 392, 86, 264, 106, "curated.location_dim", "store", {
          kicker: "SCD2",
          lines: ["location_key, location_name", "city, country, is_current", "valid_from / valid_to"],
        }),
        b("vf", 716, 40, 352, 86, "curated.v_fact_accelerometer", "process", {
          kicker: "What you query",
          lines: ["timestamp, location_key, name", "x, y, z, magnitude"],
        }),
        b("vm", 716, 146, 352, 106, "marts.v_accel_hourly_summary", "process", {
          lines: ["hour_ts, location_key, city", "country, sample_count, avg_…"],
        }),
      ],
      edges: [
        e("s1", "fact", "dim", { dashed: true }),
        e("s2", "mart", "dim", { dashed: true }),
        e("s3", "dim", "vf", { label: "join", lx: 685, ly: 128 }),
        e("s4", "dim", "vm"),
      ],
    },
  ],
  "email-exporter-consumer": [
    {
      id: "e2e",
      title: "Kafka to an emailed link",
      caption: "The consumer does not do the work. ClickHouse writes the file. Sidecars sit beside the path.",
      width: 1080,
      height: 300,
      boxes: [
        b("k", 8, 28, 128, 78, "Kafka topic", "source", { lines: ["KAFKA_TOPIC"] }),
        b("c", 170, 20, 168, 94, "Consumer", "process", {
          lines: ["consumer.py", "_queue / _batches", "poll · filter live"],
        }),
        b("x", 372, 16, 196, 102, "Executor subprocess", "source", {
          lines: ["kafkaConsumeExecutor.py", "one process / message"],
        }),
        b("ch", 602, 20, 150, 94, "ClickHouse", "store", {
          lines: ["INSERT INTO FUNCTION s3", "CSVWithNames"],
        }),
        b("s3", 786, 20, 140, 94, "MinIO / S3", "serve", {
          lines: ["presigned GET", "expires 7 days"],
        }),
        b("mail", 960, 20, 110, 94, "Email", "source", { lines: ["MJML → HTML"] }),
        b("redis", 8, 176, 250, 88, "Redis", "gate", {
          lines: ["lock 60s · cached link 900s"],
        }),
        b("pg", 274, 176, 250, 88, "PostgreSQL", "gate", {
          lines: ["queued → succeeded", "off unless PG_HOST"],
        }),
        b("comb", 540, 176, 250, 88, "s3obj-materializer", "gate", {
          lines: ["24 date slices · combine"],
        }),
        b("gray", 806, 176, 264, 88, "Graylog GELF", "gate", {
          lines: ["exported_successfully"],
        }),
      ],
      edges: [
        e("e1", "k", "c"),
        e("e2", "c", "x"),
        e("e3", "x", "ch"),
        e("e4", "ch", "s3"),
        e("e5", "s3", "mail"),
        e("e6", "x", "redis", { fromSide: "bottom", toSide: "top", dashed: true }),
      ],
    },
  ],
  "spark-streaming-acme": [
    {
      id: "e2e",
      title: "CDC to dashboard",
      caption: "One Postgres, two schemas. They meet only through Debezium, Kafka, and four Spark queries.",
      width: 1080,
      height: 330,
      boxes: [
        b("ops", 8, 86, 150, 118, "operations", "source", {
          kicker: "pg_cron",
          lines: ["customers", "products", "orders", "order_items"],
        }),
        b("deb", 190, 104, 132, 82, "Debezium", "process", {
          lines: ["pgoutput slot", "finance-db-connector"],
        }),
        b("kf", 354, 78, 168, 134, "Kafka", "process", {
          lines: ["4 operations.* topics", "prefix finance_db"],
        }),
        b("sp", 554, 78, 176, 134, "Spark 3.5.0", "process", {
          lines: ["4 StreamingQueries", "local[4] · 10s", "foreachBatch"],
        }),
        b("an", 762, 78, 150, 134, "analytical", "store", {
          lines: ["dims + facts", "*_history", "*_staging", "same Postgres"],
        }),
        b("ui", 942, 86, 130, 118, "Serve", "serve", {
          lines: ["FastAPI :8001", "React :3000", "poll 10s"],
        }),
      ],
      edges: [
        e("e1", "ops", "deb", { label: "WAL", lx: 173, ly: 128 }),
        e("e2", "deb", "kf"),
        e("e3", "kf", "sp"),
        e("e4", "sp", "an"),
        e("e5", "an", "ui"),
      ],
    },
    {
      id: "scd4",
      kind: "model",
      title: "SCD Type 4 — current vs history",
      caption:
        "Current-state tables are upserted. History is append-only with recorded_at. There is no Type 2 valid_from / valid_to. Line items copy order_status at MERGE; Q3 still joins fact_orders as source of truth.",
      width: 1080,
      height: 300,
      boxes: [
        b("fo", 12, 38, 300, 70, "analytical.fact_orders", "serve", {
          lines: ["PK order_id · latest status"],
        }),
        b("dc", 12, 120, 300, 70, "analytical.dim_customer", "serve", {
          lines: ["PK customer_id · is_active"],
        }),
        b("dp", 12, 202, 300, 70, "analytical.dim_product", "serve", {
          lines: ["PK product_id · unity_price"],
        }),
        b("foh", 360, 38, 300, 70, "fact_orders_history", "source", {
          lines: ["every CDC event · recorded_at"],
        }),
        b("dch", 360, 120, 300, 70, "dim_customer_history", "source", {
          lines: ["append-only"],
        }),
        b("dph", 360, 202, 300, 70, "dim_product_history", "source", {
          lines: ["append-only"],
        }),
        b("foi", 708, 80, 356, 130, "fact_order_items", "store", {
          lines: [
            "PK order_item_id",
            "order_status denormalised",
            "from fact_orders at MERGE",
            "STATUS_SYNC_SQL keeps it close",
          ],
        }),
      ],
      edges: [
        e("h1", "fo", "foh", { dashed: true }),
        e("h2", "dc", "dch", { dashed: true }),
        e("h3", "dp", "dph", { dashed: true }),
      ],
      notes: [
        { x: 12, y: 24, text: "What you query for “now”" },
        { x: 360, y: 24, text: "What you query for “then”" },
        { x: 708, y: 24, text: "Line items, current only" },
      ],
    },
  ],
  "trino-local": [
    {
      id: "e2e",
      title: "What talks to what",
      caption: "Lakehouse catalogs go through Hive Metastore + MinIO. PostgreSQL and ClickHouse are JDBC only.",
      width: 1080,
      height: 420,
      boxes: [
        b("cli", 8, 28, 150, 72, "SQL client", "serve", { lines: ["JDBC / CLI / UI"] }),
        b("trino", 200, 16, 240, 96, "trino :455", "process", {
          kicker: "coordinator + worker",
          lines: ["./etc · ./catalog", "host :8080"],
        }),
        b("hms", 550, 128, 230, 80, "hive-metastore", "process", {
          lines: ["Thrift :9083"],
        }),
        b("maria", 830, 128, 236, 80, "mariadb:10.5.8", "store", {
          lines: ["metastore_db :3306"],
        }),
        b("minio", 550, 216, 230, 80, "minio", "store", {
          lines: ["S3 API :9000", "volume minio-data"],
        }),
        b("pg", 400, 320, 210, 80, "postgres", "source", {
          lines: ["trino_db :5432", "catalog postgresql"],
        }),
        b("ch", 670, 320, 220, 80, "clickhouse", "source", {
          lines: ["HTTP :8123", "native :9000 unused"],
        }),
      ],
      edges: [
        e("e1", "cli", "trino", { label: ":8080", lx: 178, ly: 46 }),
        e("e2", "trino", "hms", { fromSide: "right", toSide: "left" }),
        e("e3", "hms", "maria"),
        e("e4", "trino", "minio", { fromSide: "bottom", toSide: "left" }),
        e("e5", "hms", "minio", { fromSide: "bottom", toSide: "top", dashed: true }),
        e("e6", "trino", "pg", { fromSide: "bottom", toSide: "left" }),
        e("e7", "pg", "ch"),
      ],
    },
  ],
  "agent-data-modelling": [
    {
      id: "gate",
      title: "The gate",
      caption:
        "The feedback agent re-derives every claim from primary sources. Rejected work loops back — no later stage may skip it.",
      width: 900,
      height: 310,
      boxes: [
        b("src", 300, 18, 290, 46, "PRIMARY SOURCES", "source", {
          lines: ["SOW · report SQL · live Oracle"],
        }),
        b("in", 26, 132, 118, 52, "input/", "gate", { lines: ["prior approved"] }),
        b("phase", 188, 124, 132, 68, "Phase Agent", "process", {
          lines: ["reads PHASE.md", "runs the scripts"],
        }),
        b("out", 364, 132, 118, 52, "output/", "store", { lines: ["the deliverable"] }),
        b("fb", 520, 118, 160, 80, "Feedback Agent", "gate", {
          shape: "diamond",
          lines: ["approve or reject"],
        }),
        b("next", 758, 132, 116, 52, "Next phase", "serve", { lines: ["treats it as truth"] }),
      ],
      edges: [
        e("e1", "in", "phase"),
        e("e2", "phase", "out"),
        e("e3", "out", "fb"),
        e("e4", "src", "fb", { dashed: true, fromSide: "bottom", toSide: "top" }),
        e("e5", "fb", "next", { label: "approved", lx: 720, ly: 124 }),
        {
          id: "reject",
          path: "M 600 198 L 600 250 L 254 250 L 254 192",
          dashed: false,
          label: "rejected → rebuild",
          lx: 420,
          ly: 268,
        },
      ],
    },
    {
      id: "ldm",
      kind: "model",
      title: "Collapse, then decompose",
      caption:
        "Stage 03 folds three Oracle tables into one conceptual Batch because the business calls all of it “the batch.” Stage 05 splits it again: a dimension and a 23.8M-row event log cannot share a grain.",
      width: 1000,
      height: 360,
      boxes: [
        b("mst", 16, 50, 230, 66, "PRD_BATCH_MST", "source", {
          lines: ["14,675,233 rows", "composite PK"],
        }),
        b("dtl", 16, 132, 230, 66, "PRD_BATCH_DTL", "source", {
          lines: ["pair lines", "PK TRANDTL_PK"],
        }),
        b("oper", 16, 214, 230, 66, "PRD_BATCH_OPER", "source", {
          lines: ["23,829,720 rows", "PK TRANMST_PK"],
        }),
        b("batch", 342, 124, 196, 84, "Batch", "process", {
          kicker: "CDM",
          lines: ["1 conceptual entity", "conformed · 10 processes"],
        }),
        b("dim", 636, 50, 344, 66, "Dim_Batch", "store", {
          lines: ["SCD2 · surrogate over composite NK", "CDC on BATCH_DATE"],
        }),
        b("pair", 636, 132, 344, 66, "Fact_Batch_Pair", "serve", {
          lines: ["one pair line per batch"],
        }),
        b("tc", 636, 214, 344, 66, "Fact_Tc_Production", "serve", {
          lines: ["one stitch posting · TRANMST_PK", "CDC on STITCH_DATE"],
        }),
      ],
      edges: [
        { id: "c1", path: "M 246 83 C 296 83 296 166 342 166" },
        { id: "c2", path: "M 246 165 L 342 166" },
        { id: "c3", path: "M 246 247 C 296 247 296 166 342 166" },
        { id: "d1", path: "M 538 166 C 588 166 588 83 636 83" },
        { id: "d2", path: "M 538 166 L 636 165" },
        { id: "d3", path: "M 538 166 C 588 166 588 247 636 247" },
      ],
      notes: [
        { x: 16, y: 28, text: "PHASE 01 — PHYSICAL" },
        { x: 342, y: 28, text: "PHASE 03/04 — CONCEPTUAL" },
        { x: 636, y: 28, text: "PHASE 05 — LOGICAL" },
        { x: 252, y: 308, text: "collapse: shared name family + parent PK + same owning process" },
        { x: 546, y: 308, text: "grain decomposition: one entity, three grains, three constructs" },
      ],
    },
  ],
  "agent-de-aws-glue": [
    {
      id: "e2e",
      title: "Generate, audit, then a human",
      caption: "The agent prepares. The operator executes. Generated Glue is not source.",
      width: 1080,
      height: 260,
      boxes: [
        b("ldm", 16, 70, 170, 110, "LDM SQL", "source", {
          lines: ["input/<module>/*.sql", "do not hand-edit"],
        }),
        b("gen", 220, 70, 170, 110, "Generator", "process", {
          lines: ["Glue job code", "offline"],
        }),
        b("aud", 424, 70, 170, 110, "Invariant audit", "gate", {
          lines: ["no AWS creds", "seconds, not CloudWatch"],
        }),
        b("op", 628, 70, 170, 110, "Operator", "source", {
          lines: ["runs AWS commands", "creds in their shell"],
        }),
        b("sil", 832, 70, 230, 110, "Iceberg silver", "serve", {
          lines: ["star on Oracle bronze", "S3"],
        }),
      ],
      edges: [
        e("e1", "ldm", "gen"),
        e("e2", "gen", "aud"),
        e("e3", "aud", "op"),
        e("e4", "op", "sil"),
      ],
    },
    {
      id: "star",
      kind: "model",
      title: "Iceberg star on Oracle bronze",
      caption:
        "Table names come from the LDM, not the generator. Glue only executes Construct / Key / Load. Dimensions carry the surrogate; facts never mint keys.",
      width: 1080,
      height: 300,
      boxes: [
        b("ora", 16, 96, 200, 108, "Oracle bronze", "source", {
          kicker: "Landed as-is",
          lines: ["Iceberg on S3", "no warehouse keys"],
        }),
        b("dim", 280, 28, 240, 100, "Silver dimensions", "store", {
          kicker: "Construct = Dim",
          lines: ["surrogate from LDM Key", "SCD2 insert-only"],
        }),
        b("fct", 280, 172, 240, 100, "Silver facts", "serve", {
          kicker: "Construct = Fact",
          lines: ["grain decided in LDM", "FK to dim surrogates"],
        }),
        b("date", 592, 96, 220, 108, "Conformed date", "process", {
          lines: ["role-playing on facts", "never sourced from Oracle"],
        }),
        b("s3", 860, 96, 200, 108, "S3 · Iceberg", "serve", {
          lines: ["catalog + data files", "wipe purges locations"],
        }),
      ],
      edges: [
        e("g1", "ora", "dim", { fromSide: "top", toSide: "left" }),
        e("g2", "ora", "fct", { fromSide: "bottom", toSide: "left" }),
        e("g3", "dim", "date"),
        e("g4", "fct", "date"),
        e("g5", "date", "s3"),
      ],
    },
  ],
  "data-driven-pipeline": [
    {
      id: "e2e",
      title: "Two paths out of MySQL",
      caption: "CDC is a sidecar for events. The lake is Trino MERGE into Delta — Kafka is not bronze.",
      width: 1120,
      height: 480,
      boxes: [
        b("store", 16, 150, 168, 168, "Data product", "serve", {
          lines: ["React + Vite", "FastAPI", "simpleStoreSetup"],
        }),
        b("mysql", 232, 168, 168, 132, "MySQL 8.0", "store", {
          lines: ["inventory", "pipeline_configs", "binlog ROW + GTID"],
        }),
        b("dummy", 248, 46, 136, 72, "dummyData", "gate", { lines: ["100 / 25 / 250 / 400"] }),
        b("cdc", 460, 36, 300, 150, "CDC path — events, not the lake", "source", {
          group: true,
        }),
        b("deb", 478, 74, 84, 88, "Debezium", "source", { lines: [":8083"] }),
        b("kf", 578, 74, 84, 88, "Kafka", "source", { lines: ["dbserver1.*"] }),
        b("con", 658, 74, 84, 88, "Conduktor", "source", { lines: [":8087"] }),
        b("lake", 460, 214, 300, 248, "Lake path — medallion", "process", { group: true }),
        b("af", 478, 256, 264, 56, "Airflow 2.8.1", "process", {
          lines: ["LocalExecutor · Datasets"],
        }),
        b("tr", 478, 326, 264, 56, "Trino", "process", {
          lines: ["mysql · delta_lake · clickhouse"],
        }),
        b("hms", 478, 396, 126, 50, "Hive Metastore", "store"),
        b("minio", 616, 396, 126, 50, "MinIO", "store", { lines: ["bronze|silver|gold"] }),
        b("gold", 820, 214, 280, 248, "Gold + serving", "serve", { group: true }),
        b("delta", 838, 256, 244, 52, "Delta Lake gold", "serve", { lines: ["HLP · DIM · FCT"] }),
        b("ch", 838, 322, 244, 52, "ClickHouse", "serve", { lines: ["marts · forecast"] }),
        b("ss", 838, 388, 244, 52, "Superset", "serve", { lines: ["dashboards"] }),
      ],
      edges: [
        e("e1", "dummy", "mysql", { fromSide: "bottom", toSide: "top" }),
        e("e2", "store", "mysql"),
        e("e3", "mysql", "deb", { fromSide: "top", toSide: "left" }),
        e("e4", "deb", "kf"),
        e("e5", "kf", "con"),
        e("e6", "mysql", "af", { fromSide: "right", toSide: "left" }),
        e("e7", "af", "tr", { fromSide: "bottom", toSide: "top" }),
        e("e8", "tr", "minio", { fromSide: "bottom", toSide: "top" }),
        e("e9", "tr", "delta", { fromSide: "right", toSide: "left" }),
        e("e10", "delta", "ch", { fromSide: "bottom", toSide: "top" }),
        e("e11", "ch", "ss", { fromSide: "bottom", toSide: "top" }),
      ],
    },
    {
      id: "star",
      kind: "model",
      title: "Kimball gold — HLP mints the key",
      caption:
        "The helper is the only place a natural key becomes a surrogate. Facts never join silver on customer_id; they join HLP. Type 1 rewrites on the DIM cannot scramble fact keys.",
      width: 1120,
      height: 430,
      boxes: [
        b("chlp", 40, 28, 200, 110, "customer_hlp", "process", {
          lines: ["customer_sk · customer_id", "source · oper · batch_id", "insert new NK only"],
        }),
        b("cdim", 40, 168, 200, 110, "customer_dim", "store", {
          lines: ["name · email · cnic", "created_at · updated_at", "Type 1 MERGE"],
        }),
        b("mhlp", 280, 28, 200, 110, "merchant_hlp", "process", {
          lines: ["merchant_sk · merchant_id", "source · oper · batch_id", "insert new NK only"],
        }),
        b("mdim", 280, 168, 200, 110, "merchant_dim", "store", {
          lines: ["store_name · email", "password never copied", "Type 1 MERGE"],
        }),
        b("phlp", 40, 308, 200, 90, "product_hlp", "process", {
          lines: ["product_sk · product_id", "insert new NK only"],
        }),
        b("pdim", 280, 308, 200, 90, "product_dim", "store", {
          lines: ["merchant_sk · name · price", "stock_quantity"],
        }),
        b("fo", 560, 70, 240, 140, "fct_orders", "serve", {
          lines: [
            "order_sk · order_id",
            "customer_sk · order_status",
            "placed_date_sk · total_amount",
            "grain: one order",
          ],
        }),
        b("foi", 560, 240, 240, 158, "fct_order_items", "serve", {
          lines: [
            "item_id · order_id",
            "customer_sk · merchant_sk · product_sk",
            "qty · unit_price · line_total",
            "grain: one line",
          ],
        }),
        b("dd", 860, 140, 220, 140, "dim_date", "source", {
          lines: ["date_sk = yyyymmdd", "dow · month · quarter · year", "role-playing on orders"],
        }),
      ],
      edges: [
        { id: "k1", path: "M 240 83 L 560 120" },
        { id: "k2", path: "M 240 223 L 560 140" },
        { id: "k3", path: "M 480 83 L 560 300" },
        { id: "k4", path: "M 240 353 L 560 320" },
        { id: "k5", path: "M 480 353 L 560 330" },
        { id: "k6", path: "M 800 140 L 858 190" },
        { id: "k7", path: "M 800 300 L 858 230" },
      ],
    },
  ],
  triptop: [
    {
      id: "e2e",
      title: "How a booking becomes a row",
      caption: "The seam is HTTP. Flask does not invent SQL — it loads files. Grain is one student on one trip.",
      width: 1080,
      height: 300,
      boxes: [
        b("fl", 16, 70, 210, 170, "Flutter", "serve", {
          kicker: "Client",
          lines: ["package:http", "role_id 1 → admin home", "LAN :8080 hardcoded"],
        }),
        b("api", 272, 48, 300, 214, "Flask · app.py", "process", {
          kicker: "API",
          lines: ["host 0.0.0.0 :8080", "/api/v1 · 23 blueprints", "Flasgger /apidocs", "PyJWT · OTP"],
        }),
        b("sql", 622, 36, 214, 110, "allQueries/*.sql", "source", {
          kicker: "Query files",
          lines: [":param replace", "not an ORM"],
        }),
        b("pg", 622, 172, 214, 110, "PostgreSQL 12", "store", {
          kicker: "Store",
          lines: ["host port 5433", "snowflake + lookups"],
        }),
        b("dc", 860, 88, 200, 154, "Compose", "gate", {
          lines: ["database/ :5433", "backend/ :8080", "host.docker.internal"],
        }),
      ],
      edges: [
        e("e1", "fl", "api", { label: "JSON", lx: 247, ly: 132 }),
        e("e2", "api", "sql", { fromSide: "right", toSide: "left" }),
        e("e3", "api", "pg", { fromSide: "right", toSide: "left" }),
        e("e4", "pg", "dc", { fromSide: "right", toSide: "left", dashed: true }),
      ],
    },
    {
      id: "snowflake",
      kind: "model",
      title: "Snowflake — not a warehouse star",
      caption:
        "The fact is bookings: one student on one trip. Dimensions normalize outward into lookups and role profiles so a name or a status lives once. Amber is a lookup. Dashed tables exist in DDL but have no API blueprint.",
      width: 1080,
      height: 640,
      boxes: [
        b("roles", 16, 16, 168, 70, "user_roles_lkp", "source", {
          lines: ["admin · staff · customer"],
        }),
        b("admin", 200, 16, 168, 70, "admin_profiles", "store", {
          lines: ["is_superadmin", "1–1 users"],
        }),
        b("staff", 384, 16, 168, 70, "staff_profiles", "store", {
          lines: ["title · Pending", "+ organization_id"],
        }),
        b("custp", 568, 16, 188, 70, "customer_profiles", "store", {
          lines: ["student_number", "is_exchange · uni"],
        }),
        b("uni", 772, 16, 188, 70, "universities_lkp", "source", {
          lines: ["domain unique", "abo.fi · utu.fi"],
        }),
        b("org", 40, 150, 210, 66, "organizations", "store", {
          lines: ["slug · social_media JSONB"],
        }),
        b("tstat", 830, 140, 210, 66, "trip_status_lkp", "source", {
          lines: ["draft · published · archived"],
        }),
        b("users", 40, 250, 210, 78, "users", "store", {
          lines: ["email unique", "role_id · org"],
        }),
        b("book", 390, 258, 300, 96, "bookings  ·  fact", "serve", {
          lines: ["grain: (trip_id, user_id)", "price_paid · qr_token · status_id"],
        }),
        b("trips", 830, 250, 210, 78, "trips", "store", {
          lines: ["org · location · status · price"],
        }),
        b("sess", 40, 360, 210, 62, "user_sessions", "serve", {
          lines: ["token_hash · 24 h"],
        }),
        b("otp", 40, 438, 210, 62, "user_otps", "serve", {
          lines: ["email · 15 min · 3 tries"],
        }),
        b("bstat", 430, 400, 220, 66, "booking_status_lkp", "source", {
          lines: ["pending · confirmed · cancelled"],
        }),
        b("itin", 830, 360, 210, 66, "trip_itineraries", "store", {
          lines: ["step_order unique per trip"],
        }),
        b("media", 830, 442, 210, 52, "trip_media  ·  unused", "gate"),
        b("chk", 250, 520, 200, 66, "checkins", "gate", {
          lines: ["schema only"],
        }),
        b("dev", 630, 520, 200, 66, "devices", "gate", {
          lines: ["fingerprint hash"],
        }),
        b("loc", 830, 548, 210, 66, "locations_lkp", "source", {
          lines: ["shared by trip + step"],
        }),
      ],
      edges: [
        e("t1", "roles", "users", { fromSide: "bottom", toSide: "top" }),
        e("t2", "admin", "users", { fromSide: "bottom", toSide: "top" }),
        e("t3", "staff", "users", { fromSide: "bottom", toSide: "top" }),
        e("t4", "custp", "users", { fromSide: "bottom", toSide: "top" }),
        e("t5", "uni", "custp", { fromSide: "left", toSide: "right" }),
        e("t6", "org", "users", { fromSide: "bottom", toSide: "top" }),
        e("t7", "tstat", "trips", { fromSide: "bottom", toSide: "top" }),
        e("t8", "users", "book"),
        e("t9", "trips", "book", { fromSide: "left", toSide: "right" }),
        e("t10", "users", "sess", { fromSide: "bottom", toSide: "top" }),
        e("t11", "sess", "otp", { fromSide: "bottom", toSide: "top" }),
        e("t12", "book", "bstat", { fromSide: "bottom", toSide: "top" }),
        e("t13", "trips", "itin", { fromSide: "bottom", toSide: "top" }),
        e("t14", "itin", "media", { fromSide: "bottom", toSide: "top", dashed: true }),
        e("t15", "book", "chk", { fromSide: "bottom", toSide: "top", dashed: true }),
        e("t16", "users", "dev", { fromSide: "bottom", toSide: "left", dashed: true }),
        e("t17", "trips", "loc", { fromSide: "bottom", toSide: "top" }),
        e("t18", "itin", "loc", { fromSide: "bottom", toSide: "top" }),
        e("t19", "org", "trips", { fromSide: "right", toSide: "left" }),
      ],
    },
  ],
  "pitb-ossp": [
    {
      id: "e2e",
      title: "Lakehouse layers",
      caption: "Four storage seams, two query engines. Staging and raw are Delta. ClickHouse is the serving store.",
      width: 1080,
      height: 420,
      boxes: [
        b("src", 8, 28, 168, 364, "Sources", "source", {
          group: true,
          lines: ["JDBC / Trino", "REST APIs", "Sqoop + Hadoop", "Kafka", "CSV / Excel"],
        }),
        b("raw", 214, 78, 196, 264, "Delta Lake · MinIO", "source", {
          kicker: "Staging + raw",
          lines: ["truncated staging", "full / CDC merge", "dl_rw_job.py", "delta_lake + secure"],
        }),
        b("cur", 448, 78, 196, 264, "Curated star", "process", {
          lines: ["lookups · helpings", "dims · facts", "run_ct_job.py → Trino", "citizen_key"],
        }),
        b("sem", 700, 72, 354, 110, "Semantic staging", "store", {
          lines: ["hive.:env_semantic_stg", "run_ld_job.py"],
        }),
        b("ch", 700, 210, 354, 158, "ClickHouse semantic", "serve", {
          lines: ["thin layers tl_*", "s3() parquet → MergeTree", "Flask APIs · BI"],
        }),
      ],
      edges: [
        e("e1", "src", "raw"),
        e("e2", "raw", "cur"),
        e("e3", "cur", "sem"),
        e("e4", "sem", "ch", { fromSide: "bottom", toSide: "top" }),
      ],
    },
    {
      id: "star",
      kind: "model",
      title: "Curated star — lookups, helpings, then grain",
      caption:
        "SQL is organised the way a warehouse team thinks, not by source system. Lookups load first. Helpings mint the conformed key. Dims MERGE. Facts INSERT a surrogate on top of max_*_key.",
      width: 1080,
      height: 280,
      boxes: [
        b("lkp", 16, 70, 230, 130, "Lookups  lkp", "source", {
          lines: ["wards · blood groups", "banks · roles", "loaded first"],
        }),
        b("hlp", 286, 70, 230, 130, "Helpings  hlp", "process", {
          lines: ["citizen_hlp", "source id → citizen_key", "location helpings"],
        }),
        b("dim", 556, 28, 230, 110, "Dimensions", "store", {
          lines: ["MERGE on business key", "hospital / clinic / patient"],
        }),
        b("fct", 556, 154, 230, 110, "Facts", "serve", {
          lines: ["INSERT + surrogate", "ins_tmstmp · batch_id · oper"],
        }),
        b("thin", 826, 70, 238, 130, "Thin layer", "serve", {
          kicker: "ClickHouse",
          lines: ["tl_* denormalised", "BI does not query the star"],
        }),
      ],
      edges: [
        e("p1", "lkp", "hlp"),
        e("p2", "hlp", "dim", { fromSide: "right", toSide: "left" }),
        e("p3", "hlp", "fct", { fromSide: "right", toSide: "left" }),
        e("p4", "dim", "thin", { fromSide: "right", toSide: "left" }),
        e("p5", "fct", "thin", { fromSide: "right", toSide: "left" }),
      ],
    },
    {
      id: "hmis",
      kind: "model",
      title: "Health HMIS — one sector, the full walk",
      caption:
        "Raw patients go through citizen_hlp into health_patient_dim, then visit / admission / billing facts, then Hive ldr copies, then ClickHouse tl_health_hmis_*. Education, Finance, Agriculture, HED, Dastak, Livestock, and FDIP repeat this shape.",
      width: 1080,
      height: 340,
      boxes: [
        b("oltp", 8, 120, 150, 90, "HMIS OLTP", "source", {
          lines: ["patients · visits", "pharmacy · billing"],
        }),
        b("raw", 198, 108, 168, 114, "dl_rw_job", "source", {
          kicker: "HMIS_Central DAG",
          lines: ["…_hmisv2…_raw.patients", "CDC or full_load", "Delta / MinIO"],
        }),
        b("cur", 406, 16, 280, 300, "Curated DAGs", "process", {
          group: true,
          kicker: "Trino · Delta",
        }),
        b("lkp2", 422, 78, 248, 64, "healthhmisLookups", "source", {
          lines: ["ward · department · diagnosis"],
        }),
        b("dim2", 422, 150, 248, 80, "healthhmisDimension", "store", {
          lines: ["citizen_hlp → citizen_hub", "MERGE health_patient_dim"],
        }),
        b("fct2", 422, 238, 248, 70, "healthhmisFacts", "serve", {
          lines: ["visit · admission · billing", "pathology · pharmacy"],
        }),
        b("ldr", 726, 70, 160, 100, "ldr", "process", {
          lines: ["hive.dp_semantic_stg", "run_ld_job"],
        }),
        b("tl", 926, 70, 146, 180, "Thin layer", "serve", {
          lines: ["tl_health_hmis_*", "visits · hospital", "ClickHouse", "run_sm_job"],
        }),
      ],
      edges: [
        e("h1", "oltp", "raw"),
        e("h2", "raw", "dim2"),
        e("h3", "lkp2", "dim2", { fromSide: "bottom", toSide: "top" }),
        e("h4", "dim2", "fct2", { fromSide: "bottom", toSide: "top" }),
        e("h5", "fct2", "ldr", { fromSide: "right", toSide: "left" }),
        e("h6", "ldr", "tl"),
      ],
    },
  ],
  "ai-data-modeling-agent": [
    {
      id: "e2e",
      title: "Three sources in, one approved model out",
      caption: "LLM roles interpret and propose. Deterministic code owns access, validation and release. People approve at every checkpoint.",
      width: 1080,
      height: 340,
      boxes: [
        b("bpd", 16, 24, 170, 80, "Business docs", "source", { lines: ["BPD uploads", "business intent"] }),
        b("sql", 16, 130, 170, 80, "Report SQL", "source", { lines: ["what analytics does", "today"] }),
        b("ora", 16, 236, 170, 80, "Oracle DB", "source", { lines: ["observed evidence", "read-only"] }),
        b("ev", 230, 110, 180, 120, "Evidence catalog", "store", { lines: ["MinIO originals", "pgvector + citations"] }),
        b("llm", 456, 30, 190, 110, "LLM roles", "process", { lines: ["Business Understanding", "SQL Reviewer · DeepSeek"] }),
        b("det", 456, 200, 190, 110, "Deterministic services", "gate", { lines: ["validation · versioning", "SQL guard · DDL checks"] }),
        b("rev", 690, 110, 170, 120, "Human review", "gate", { lines: ["3 checkpoints", "Next.js + React Flow"] }),
        b("rel", 904, 110, 160, 120, "Approved release", "serve", { lines: ["CDM · LDM · physical", "Oracle DDL export"] }),
      ],
      edges: [
        e("a1", "bpd", "ev"),
        e("a2", "sql", "ev"),
        e("a3", "ora", "ev", { label: "scoped, read-only", lx: 205, ly: 300 }),
        e("a4", "ev", "llm"),
        e("a5", "ev", "det"),
        e("a6", "llm", "det", { fromSide: "bottom", toSide: "top", label: "proposals", lx: 590, ly: 172 }),
        e("a7", "det", "rev"),
        e("a8", "rev", "rel"),
        e("a9", "rev", "llm", { fromSide: "top", toSide: "right", dashed: true, label: "rework", lx: 760, ly: 70 }),
      ],
    },
    {
      id: "graph",
      title: "The LangGraph workflow",
      caption: "A bounded StateGraph. Review steps are durable interrupts in PostgresSaver, so a run can wait days for a decision and resume.",
      width: 1080,
      height: 230,
      boxes: [
        b("in", 16, 70, 150, 96, "Ingest", "source", { lines: ["hash-verify uploads", "parallel parsing"] }),
        b("un", 196, 70, 150, 96, "Understand", "process", { lines: ["cited observations", "KPIs · joins · lineage"] }),
        b("pr", 376, 70, 150, 96, "Propose", "process", { lines: ["dimensional design", "typed schemas"] }),
        b("va", 556, 70, 150, 96, "Validate", "gate", { lines: ["rule engine", "report reconciliation"] }),
        b("ck", 736, 70, 150, 96, "Checkpoint", "gate", { lines: ["interrupt", "human decision"] }),
        b("go", 916, 70, 148, 96, "Release", "serve", { lines: ["immutable version", "artifact manifest"] }),
      ],
      edges: [
        e("g1", "in", "un"),
        e("g2", "un", "pr"),
        e("g3", "pr", "va"),
        e("g4", "va", "ck"),
        e("g5", "ck", "go"),
        e("g6", "ck", "pr", { fromSide: "bottom", toSide: "bottom", dashed: true, label: "bounded rework", lx: 630, ly: 205 }),
      ],
    },
  ],
  "ai-analytics-agent": [
    {
      id: "learn",
      title: "How it learns a warehouse",
      caption: "Five steps, in order, each unlocking the next. Every agent works through tool calls you can watch in the live log.",
      width: 1080,
      height: 240,
      boxes: [
        b("wh", 16, 74, 150, 96, "Warehouse", "source", { lines: ["MySQL 8", "pluggable connector"] }),
        b("d1", 196, 74, 150, 96, "Discover", "process", { lines: ["tables · columns", "keys · indexes"] }),
        b("d2", 376, 74, 150, 96, "Catalog agent", "process", { lines: ["meaning · PII", "grain"] }),
        b("d3", 556, 74, 150, 96, "Relationship agent", "process", { lines: ["joins verified on", "data + BI + history"] }),
        b("d4", 736, 74, 150, 96, "Semantic agent", "process", { lines: ["metrics · glossary", "default filters"] }),
        b("mem", 916, 74, 148, 96, "Memory", "store", { lines: ["pgvector", "search index"] }),
      ],
      edges: [e("l1", "wh", "d1"), e("l2", "d1", "d2"), e("l3", "d2", "d3"), e("l4", "d3", "d4"), e("l5", "d4", "mem")],
    },
    {
      id: "answer",
      title: "How it answers",
      caption: "The LLM only sees metadata. SQL runs read-only, and the answer is checked against numbers the business already trusts.",
      width: 1080,
      height: 280,
      boxes: [
        b("q", 16, 90, 140, 96, "Question", "source", { lines: ["plain language"] }),
        b("rt", 186, 90, 150, 96, "Retrieve", "store", { lines: ["memory: tables,", "metrics, joins"] }),
        b("pl", 366, 90, 150, 96, "Plan SQL", "process", { lines: ["LLM, metadata only"] }),
        b("gd", 546, 90, 160, 96, "Read-only guard", "gate", { lines: ["5 independent layers"] }),
        b("rn", 736, 90, 140, 96, "Run", "source", { lines: ["warehouse"] }),
        b("ok", 906, 30, 158, 96, "Reconcile", "gate", { lines: ["vs Metabase", "dashboard numbers"] }),
        b("an", 906, 160, 158, 96, "Answer", "serve", { lines: ["SQL · tables · filters", "assumptions · confidence"] }),
      ],
      edges: [
        e("q1", "q", "rt"),
        e("q2", "rt", "pl"),
        e("q3", "pl", "gd"),
        e("q4", "gd", "rn"),
        e("q5", "rn", "ok"),
        e("q6", "ok", "an", { fromSide: "bottom", toSide: "top" }),
      ],
    },
  ],
  plainjoin: [
    {
      id: "ask",
      title: "From a question to trusted SQL",
      caption: "A certified metric compiles straight to SQL. Anything else is drafted, labelled exploratory and reviewed. Every query passes the same gate.",
      width: 1080,
      height: 330,
      boxes: [
        b("src", 16, 30, 170, 90, "Sources", "source", { lines: ["PostgreSQL · Athena", "read-only role"] }),
        b("rep", 16, 200, 170, 90, "Trusted reports", "source", { lines: ["SQL + measures + grain", "EXPLAIN dry-run"] }),
        b("kb", 226, 110, 170, 110, "Knowledge base", "store", { lines: ["pgvector + text search", "verified joins"] }),
        b("dec", 436, 115, 160, 100, "Certified metric fits?", "gate", { shape: "diamond" }),
        b("cmp", 640, 30, 180, 96, "Compile contract", "process", { lines: ["fan-out guard", "label: Certified"] }),
        b("llm", 640, 204, 180, 96, "LLM draft", "process", { lines: ["label: Exploratory", "reviewed before run"] }),
        b("gate", 864, 110, 200, 110, "SQL gate", "serve", { lines: ["one read-only guard", "→ table, chart, dashboard"] }),
      ],
      edges: [
        e("p1", "src", "kb"),
        e("p2", "rep", "kb"),
        e("p3", "kb", "dec"),
        e("p4", "dec", "cmp", { fromSide: "top", toSide: "left", label: "yes", lx: 560, ly: 70 }),
        e("p5", "dec", "llm", { fromSide: "bottom", toSide: "left", label: "no", lx: 560, ly: 270 }),
        e("p6", "cmp", "gate"),
        e("p7", "llm", "gate"),
      ],
      notes: [{ x: 864, y: 300, text: "Golden questions re-run after every change" }],
    },
  ],
  studydeck: [
    {
      id: "pipeline",
      title: "Upload to study material",
      caption: "The fast API stays fast: minutes-long stages run in their own Cloud Run workers, dispatched through Cloud Tasks.",
      width: 1080,
      height: 330,
      boxes: [
        b("up", 16, 120, 150, 96, "Upload", "source", { lines: ["PDFs · slides", "note photos"] }),
        b("api", 196, 120, 160, 96, "API", "process", { lines: ["Cloud Run", "triage · plan"] }),
        b("ct", 386, 120, 150, 96, "Cloud Tasks", "gate", { lines: ["dispatch", "retries"] }),
        b("pw", 566, 20, 170, 86, "Page worker", "process", { lines: ["vision extraction", "Vertex AI Gemini"] }),
        b("nw", 566, 124, 170, 86, "Note worker", "process", { lines: ["notes · coverage score"] }),
        b("dw", 566, 228, 170, 86, "Diagram worker", "process", { lines: ["diagram generation"] }),
        b("emb", 766, 124, 140, 86, "Embedder", "process", { lines: ["text-embedding-004"] }),
        b("db", 936, 110, 128, 114, "Cloud SQL", "store", { lines: ["pgvector HNSW", "notes · cards · quizzes"] }),
      ],
      edges: [
        e("s1", "up", "api"),
        e("s2", "api", "ct"),
        e("s3", "ct", "pw", { fromSide: "top", toSide: "left" }),
        e("s4", "ct", "nw"),
        e("s5", "ct", "dw", { fromSide: "bottom", toSide: "left" }),
        e("s6", "nw", "emb"),
        e("s7", "emb", "db"),
        e("s8", "pw", "db", { fromSide: "right", toSide: "top", dashed: true }),
        e("s9", "dw", "db", { fromSide: "right", toSide: "bottom", dashed: true }),
      ],
    },
  ],
  whowantswhat: [
    {
      id: "request",
      title: "One request, end to end",
      caption: "Passwords never touch the backend. Schema changes ship as numbered migrations the API applies itself on startup.",
      width: 1080,
      height: 320,
      boxes: [
        b("br", 16, 110, 160, 100, "Browser", "source", { lines: ["Next.js, server-rendered", "SEO pages · JSON-LD"] }),
        b("fb", 216, 20, 170, 90, "Firebase Auth", "gate", { lines: ["email · Google", "ID token"] }),
        b("api", 216, 200, 170, 96, "FastAPI", "process", { lines: ["Cloud Run", "token verified"] }),
        b("pg", 436, 200, 180, 96, "PostgreSQL", "store", { lines: ["www_ tables", "51 migrations at startup"] }),
        b("hist", 666, 200, 180, 96, "History tables", "store", { lines: ["Postgres triggers", "SCD Type 4"] }),
        b("gcs", 436, 40, 180, 90, "Cloud Storage", "store", { lines: ["private images", "served via the API"] }),
        b("out", 896, 120, 168, 96, "Stores & board", "serve", { lines: ["orders · chat", "analytics · audit CSV"] }),
      ],
      edges: [
        e("w1", "br", "fb", { fromSide: "top", toSide: "left" }),
        e("w2", "fb", "api", { fromSide: "bottom", toSide: "top", label: "session token", lx: 320, ly: 160 }),
        e("w3", "br", "api", { fromSide: "bottom", toSide: "left" }),
        e("w4", "api", "pg"),
        e("w5", "pg", "hist"),
        e("w6", "api", "gcs", { fromSide: "top", toSide: "left", dashed: true }),
        e("w7", "hist", "out", { fromSide: "right", toSide: "bottom" }),
        e("w8", "pg", "out", { fromSide: "top", toSide: "left", dashed: true }),
      ],
    },
  ],
  "hci-lab-thesis": [
    {
      id: "record",
      title: "Record, archive, publish",
      caption: "Raw media never enters Kafka or ClickHouse. A session is published from its XDF archive only after it validates.",
      width: 1080,
      height: 330,
      boxes: [
        b("sen", 16, 30, 160, 90, "Sensors + robot", "source", { lines: ["LSL streams", "source sequences"] }),
        b("cam", 16, 210, 160, 90, "Cameras + mic", "source", { lines: ["video · audio"] }),
        b("gw", 216, 30, 160, 90, "Gateway", "process", { lines: ["record IDs", "readiness checks"] }),
        b("kf", 416, 30, 150, 90, "Kafka", "process", { lines: ["live path"] }),
        b("ch", 606, 110, 180, 110, "ClickHouse", "store", { lines: ["immutable raw records", "per-stream clock fit"] }),
        b("xdf", 216, 150, 160, 70, "LabRecorder", "store", { lines: ["XDF archive"] }),
        b("obj", 216, 240, 160, 70, "Object storage", "store", { lines: ["media segments"] }),
        b("imp", 416, 150, 150, 90, "Import + validate", "gate", { lines: ["then publish"] }),
        b("ui", 826, 110, 238, 110, "Live · replay · BI", "serve", { lines: ["frame-accurate replay", "study-scoped access"] }),
      ],
      edges: [
        e("h1", "sen", "gw"),
        e("h2", "gw", "kf"),
        e("h3", "kf", "ch", { fromSide: "right", toSide: "top" }),
        e("h4", "sen", "xdf", { fromSide: "bottom", toSide: "top" }),
        e("h5", "xdf", "imp"),
        e("h6", "imp", "ch"),
        e("h7", "cam", "obj"),
        e("h8", "obj", "ui", { fromSide: "right", toSide: "bottom", dashed: true, label: "index only", lx: 700, ly: 300 }),
        e("h9", "ch", "ui"),
      ],
    },
  ],
  "mobile-games": [
    {
      id: "catalog",
      title: "The game lives on the server",
      caption: "Changing difficulty, story or prices is a backend deploy, not an app release. The server also checks results and charges coins.",
      width: 1080,
      height: 260,
      boxes: [
        b("app", 16, 80, 170, 100, "Godot 4 games", "source", { lines: ["Android builds"] }),
        b("fb", 236, 20, 180, 86, "Firebase sign-in", "gate", { lines: ["shared with WhoWantsWhat"] }),
        b("api", 236, 150, 180, 96, "FastAPI", "process", { lines: ["GCP", "30-day session token"] }),
        b("cat", 466, 80, 200, 100, "Game catalog", "process", { lines: ["worlds · levels · power-ups", "story · prices"] }),
        b("pg", 716, 80, 170, 100, "PostgreSQL", "store", { lines: ["own tables per game", "migrations at startup"] }),
        b("pl", 926, 80, 138, 100, "Player", "serve", { lines: ["progress · coins", "delete my data"] }),
      ],
      edges: [
        e("m1", "app", "fb", { fromSide: "top", toSide: "left" }),
        e("m2", "fb", "api", { fromSide: "bottom", toSide: "top" }),
        e("m3", "app", "api", { fromSide: "bottom", toSide: "left" }),
        e("m4", "api", "cat"),
        e("m5", "cat", "pg"),
        e("m6", "pg", "pl"),
      ],
    },
  ],
};

export function getDiagrams(slug: string) {
  return diagrams[slug] ?? [];
}
