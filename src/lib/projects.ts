// Screenshots are discovered from public/shots/<slug>/*.png (see lib/shots.ts and scripts/capture-screenshots.mjs).
export type ProjectMeta = {
  slug: string;
  title: string;
  kicker: string;
  summary: string;
  problem: string; // the card's lead: why the project exists
  role?: string; // omitted where the exact part is not on record
  outcome: string;
  stack: string[];
  context?: string; // where it was built: employer, "Personal project", "Own venture"...
  status?: "live" | "in progress" | "concept UI";
  links?: { label: string; href: string }[];
  captions?: string[]; // one per screenshot, in file order
  flowFile?: string;
  sourceFlow?: string;
  featured?: boolean;
};

export const projects: ProjectMeta[] = [
  {
    slug: "plainjoin",
    title: "Plainjoin",
    kicker: "AI self-service BI",
    summary:
      "Learns a company's SQL reports and tables into a knowledge base and answers business questions in plain language. Certified metrics compile to SQL; everything else is labelled exploratory, and every query passes one read-only gate.",
    problem: "Business users wait on analysts for answers, and SQL an LLM writes on its own can't be trusted with a company's numbers.",
    role: "Designed and built it end to end.",
    outcome: "Certified answers compile from metric contracts; everything else is labelled exploratory and reviewed before it runs.",
    stack: ["Python", "FastAPI", "PostgreSQL", "pgvector", "React", "TypeScript", "LM Studio", "AWS Athena"],
    context: "Personal project",
    status: "concept UI",
    captions: ["Home: KPIs, recent dashboards and open data questions", "Ask: a plain-language question answered with reviewed SQL", "Schema map: relationships verified against real data", "Dashboards built from saved answers"],
    featured: true,
  },
  {
    slug: "ai-analytics-agent",
    title: "AI Analytics Agent",
    kicker: "Multi-agent text-to-SQL",
    summary:
      "Catalog, relationship and semantic-layer agents use LLM tool calling to learn a data warehouse into long-term pgvector memory, then answer analytics questions with verified, read-only SQL that is reconciled against known dashboard numbers.",
    problem: "A text-to-SQL bot that guesses at joins gives confident, wrong numbers.",
    role: "Designing and building it end to end.",
    outcome: "Tool-calling agents learn the warehouse step by step; every answer shows its SQL and is checked against trusted dashboards.",
    stack: ["Python", "FastAPI", "PostgreSQL", "pgvector", "Next.js", "LLM tool calling", "MySQL", "Metabase"],
    context: "Personal project",
    status: "in progress",
    featured: true,
  },
  {
    slug: "studydeck",
    title: "StudyDeck",
    kicker: "AI study platform on GCP",
    summary:
      "Turns uploaded PDFs and photos of notes into study notes, flashcards and quizzes through a 12-stage document pipeline on Vertex AI Gemini, with separate Cloud Run workers coordinated by Cloud Tasks and retrieval on pgvector.",
    problem: "Students re-read their notes instead of testing themselves on them.",
    role: "Built it and run it on my own.",
    outcome: "Live at thestudydeck.com, with the slow AI stages in their own Cloud Run workers.",
    stack: ["Python", "FastAPI", "Vertex AI", "PostgreSQL", "pgvector", "Cloud Run", "Cloud Tasks", "Cloud SQL"],
    context: "Own venture, solo builder",
    status: "live",
    links: [{ label: "thestudydeck.com", href: "https://thestudydeck.com" }],
    captions: ["thestudydeck.com"],
    featured: true,
  },
  {
    slug: "whowantswhat",
    title: "WhoWantsWhat",
    kicker: "Marketplace and storefronts on GCP",
    summary:
      "A live marketplace where people post what they want, offer or are building, with Shopify-style storefronts, carts, orders, negotiations and real-time chat. 51 versioned PostgreSQL migrations and full change history (SCD Type 4) via triggers.",
    problem: "People who know exactly what they want have nowhere to post it, and small shops need a store without the platform overhead.",
    role: "Built it and run it on my own.",
    outcome: "Live at whowantswhat.eu: storefronts, orders, negotiations and chat, on 51 versioned migrations.",
    stack: ["FastAPI", "PostgreSQL", "SQLAlchemy", "Next.js", "TypeScript", "Cloud Run", "Firebase Auth"],
    context: "Own venture, solo builder",
    status: "live",
    links: [{ label: "whowantswhat.eu", href: "https://whowantswhat.eu" }],
    captions: ["whowantswhat.eu"],
    featured: true,
  },
  {
    slug: "ai-data-modeling-agent",
    title: "AI Data Modeling Agent",
    kicker: "LangGraph · human in the loop",
    summary:
      "Reconciles business process documents, report SQL and a live Oracle database into an evidence-backed dimensional model. LLM roles interpret and propose; deterministic code controls database access, validation, versioning and DDL release, with durable review checkpoints.",
    problem: "Modelling a legacy Oracle system means reconciling documents, reports and the database by hand, and they often disagree.",
    role: "Designing and building it end to end.",
    outcome: "Evidence-backed models, with a person approving every checkpoint before any DDL is released.",
    stack: ["LangGraph", "LangChain", "DeepSeek", "FastAPI", "PostgreSQL", "pgvector", "MinIO", "Next.js", "Oracle"],
    context: "Personal project",
    status: "in progress",
    captions: ["Evidence review in the Next.js reviewer app"],
  },
  {
    slug: "hci-lab-thesis",
    title: "HCI Lab Data Platform",
    kicker: "MSc thesis · Åbo Akademi",
    summary:
      "Records sensors, video, audio and robot state from HCI lab sessions onto one traceable timeline in ClickHouse, with live observation, frame-accurate replay and anomaly detection. Raw records never change; access is study-scoped and GDPR-aware.",
    problem: "Lab sessions produce sensor, video and robot data on different clocks, which is hard to replay or trust together.",
    role: "My MSc thesis: the architecture and the build.",
    outcome: "Architecture complete (v5); the build starts on simulated sensors before moving to lab devices.",
    stack: ["ClickHouse", "Kafka", "Lab Streaming Layer", "LabRecorder", "PyAV", "MediaMTX", "Superset"],
    context: "MSc thesis",
    status: "in progress",
    captions: ["Prototype researcher console: live session with recording readiness, cameras, gaze and EEG"],
  },
  {
    slug: "mobile-games",
    title: "Mobile Games",
    kicker: "Godot 4 · Android · GCP backend",
    summary:
      "A portfolio of Android games built in Godot 4, sharing one FastAPI and PostgreSQL backend on GCP with Firebase sign-in. The game catalog lives on the server, so difficulty, story and prices change with a backend deploy instead of an app release.",
    problem: "In most mobile games, every content tweak means a new store release.",
    role: "Built the games and their shared backend on my own.",
    outcome: "Difficulty, story and prices change with a backend deploy instead of an app update.",
    stack: ["Godot 4", "Android", "FastAPI", "PostgreSQL", "Firebase Auth", "GCP"],
    context: "Own venture, solo builder",
    captions: ["Last Light", "Skyfold", "Snake", "Snakeman"],
  },
  {
    slug: "agent-data-modelling",
    title: "Data Modelling Agent",
    kicker: "Agentic data engineering",
    summary:
      "An eight-stage Claude Code pipeline that reverse-engineers an undocumented Oracle 11g manufacturing database into a governed warehouse model, with an adversarial validator between every gate.",
    problem: "An undocumented Oracle 11g database needed a governed warehouse model.",
    role: "Designed and built the agent pipeline.",
    outcome: "Eight gated Claude Code stages, with an adversarial validator between each one.",
    stack: ["Claude Code", "Python", "Oracle 11g", "Redshift", "S3"],
    context: "Personal project",
    flowFile: "agent-data-modelling.html",
    sourceFlow: String.raw`D:\Agent Implementation\Flow.html`,
    featured: true,
  },
  {
    slug: "agent-de-aws-glue",
    title: "AWS Agentic DE",
    kicker: "Glue · Iceberg · Oracle",
    summary:
      "A framework that encodes pipeline rules so an agent can generate Glue jobs for an Iceberg star schema on Oracle bronze — with offline invariant audits and an operator-in-the-loop for anything that touches AWS.",
    problem: "Hand-writing Glue jobs for an Iceberg star schema is slow and easy to get subtly wrong.",
    role: "Designed and built the framework.",
    outcome: "Generated Glue jobs pass offline invariant audits, and a person runs anything that touches AWS.",
    stack: ["AWS Glue", "Iceberg", "Oracle", "Python", "Agents"],
    context: "Personal project",
    flowFile: "agent-de-aws-glue.html",
    sourceFlow: String.raw`D:\AWS Glue Jobs\AWS Agentic DE\flow.html`,
  },
  {
    slug: "duckstream-pipeline",
    title: "DuckStream Pipeline",
    kicker: "Raspberry Pi 5 lakehouse",
    summary:
      "Sensor to queryable table on a Pi 5: MQTT ingest lands parquet, a second process commits exactly-once into DuckLake with three models, SCD2, and a star schema.",
    problem: "Sensor data has to reach a queryable table on a Raspberry Pi without losing or duplicating rows.",
    role: "Designed and built it.",
    outcome: "Exactly-once commits into DuckLake, with SCD Type 2 and a star schema.",
    stack: ["DuckDB", "DuckLake", "MQTT", "Parquet", "Python"],
    context: "Personal project",
    flowFile: "duckstream-pipeline.html",
    sourceFlow: String.raw`D:\lakehouse-rpi5\duckstream_pipeline\FLOWS.html`,
    featured: true,
  },
  {
    slug: "data-driven-pipeline",
    title: "Data-Driven Computing Architecture",
    kicker: "Medallion · CDC · Trino",
    summary:
      "Simple Store lakehouse: MySQL OLTP pulled through Trino into Delta medallion, a Kimball star, ClickHouse marts, and a five-day demand forecast. FastAPI + React is the store.",
    problem: "A store's MySQL data had to feed analytics and a demand forecast.",
    role: "Built it as a course project.",
    outcome: "A Delta medallion, a Kimball star, ClickHouse marts and a five-day forecast.",
    stack: ["Airflow", "Trino", "Delta Lake", "ClickHouse", "Debezium", "MySQL"],
    context: "Åbo Akademi course project",
    flowFile: "data-driven-pipeline.html",
    sourceFlow: String.raw`D:\Abo Akademi\Data-Driven Computing Architecture\Project\flow.html`,
  },
  {
    slug: "email-exporter-consumer",
    title: "Email Exporter Consumer",
    kicker: "Salla · Kafka · ClickHouse",
    summary:
      "Production Kafka consumer that runs ClickHouse exports to S3/MinIO as CSV/XLSX and emails them via Mailgun, with sequential, batch, and queue strategies for different loads.",
    problem: "Large ClickHouse exports had to reach people as files, by email, under very different loads.",
    outcome: "Sequential, batch and queue strategies, each suited to a different load.",
    stack: ["Kafka", "ClickHouse", "S3", "Redis", "Mailgun", "Python"],
    context: "Salla",
    flowFile: "email-exporter-consumer.html",
    sourceFlow: String.raw`D:\Salla\email-exporter-consumer-python\flow.html`,
  },
  {
    slug: "customer-group-evaluator",
    title: "Customer Group Evaluator",
    kicker: "Timeplus · Kafka · ClickHouse",
    summary:
      "Evaluation syncer: Timeplus triggers Kafka events, the consumer builds ClickHouse filters from MySQL group conditions, then fans out assignments to MySQL, OpenSearch, and status topics.",
    problem: "Customer groups had to be re-evaluated as events arrived.",
    outcome: "Timeplus triggers Kafka events, and assignments fan out to MySQL, OpenSearch and status topics.",
    stack: ["Kafka", "Timeplus", "ClickHouse", "MySQL", "OpenSearch"],
    context: "Salla",
    flowFile: "customer-group-evaluator.html",
    sourceFlow: String.raw`D:\New Salla\activate-customer-consumer-python\flow.html`,
  },
  {
    slug: "trino-local",
    title: "Trino on Local",
    kicker: "Federated query lab",
    summary:
      "Single-node Trino 455 on Docker with six catalog files: Hive, Iceberg, Delta, and JDBC to PostgreSQL and ClickHouse, sharing Hive Metastore and MinIO.",
    problem: "Comparing Hive, Iceberg, Delta and JDBC catalogs needed one local lab.",
    role: "Built it to learn and compare.",
    outcome: "Single-node Trino with six catalogs sharing a Hive Metastore and MinIO.",
    stack: ["Trino", "Hive Metastore", "MinIO", "Iceberg", "Delta Lake", "ClickHouse"],
    context: "Personal lab",
    flowFile: "trino-local.html",
    sourceFlow: String.raw`D:\TinoTesting\flow.html`,
  },
  {
    slug: "spark-streaming-acme",
    title: "ACME Spark Streaming",
    kicker: "Debezium · Spark · Kafka",
    summary:
      "Spark Structured Streaming take-home: PostgreSQL CDC through Debezium into Kafka, Spark aggregations, and a visualization stack — started in a strict compose order.",
    problem: "Stream PostgreSQL changes into live aggregations.",
    role: "Solved it as a take-home assignment.",
    outcome: "Debezium CDC into Kafka, aggregated with Spark Structured Streaming.",
    stack: ["Spark Structured Streaming", "Debezium", "Kafka", "PostgreSQL"],
    context: "Take-home assignment",
    flowFile: "spark-streaming-acme.html",
    sourceFlow: String.raw`D:\Deel\deel-data-engineering-task\flow.html`,
  },
  {
    slug: "triptop",
    title: "TripTop",
    kicker: "Backend · Snowflake schema",
    summary:
      "Student-trip marketplace: Flutter client, Flask /api/v1, and a PostgreSQL snowflake whose grain is one student on one trip. SQL lives in files, not in the handlers.",
    problem: "A student-trip marketplace needed a backend and a data model.",
    role: "Built the backend as a course project.",
    outcome: "A Flask API over a PostgreSQL snowflake schema, with SQL kept in files, not handlers.",
    stack: ["Flask", "PostgreSQL", "Snowflake schema", "Flutter", "JWT"],
    context: "Åbo Akademi course project",
    flowFile: "triptop.html",
    sourceFlow: String.raw`D:\Abo Akademi\Project_Course\trip_top\flow.html`,
  },
  {
    slug: "pitb-ossp",
    title: "PITB OSSP Data Platform",
    kicker: "On-prem government lakehouse",
    summary:
      "On-prem OSS lakehouse: MySQL holds the Airflow graph, Delta on MinIO is raw/curated, Trino models the star, ClickHouse serves the thin layer across government sectors.",
    problem: "Many government sectors' data had to be analysed under data-sovereignty rules, with no public cloud warehouse.",
    role: "Led the architecture.",
    outcome: "An on-prem lakehouse with ~200 Airflow DAGs serving 7+ departmental teams.",
    stack: ["Airflow", "Trino", "Delta Lake", "ClickHouse", "MinIO", "MySQL"],
    context: "Addo AI",
    flowFile: "pitb-ossp.html",
    sourceFlow: String.raw`D:\PITB\ossp-data-platform-code\flow.html`,
    featured: true,
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
