export type ProjectMeta = {
  slug: string;
  title: string;
  kicker: string;
  summary: string;
  stack: string[];
  flowFile: string;
  sourceFlow: string;
  featured?: boolean;
};

export const projects: ProjectMeta[] = [
  {
    slug: "agent-data-modelling",
    title: "Data Modelling Agent",
    kicker: "Agentic data engineering",
    summary:
      "An eight-stage Claude Code pipeline that reverse-engineers an undocumented Oracle 11g manufacturing database into a governed warehouse model, with an adversarial validator between every gate.",
    stack: ["Claude Code", "Python", "Oracle 11g", "Redshift", "S3"],
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
    stack: ["AWS Glue", "Iceberg", "Oracle", "Python", "Agents"],
    flowFile: "agent-de-aws-glue.html",
    sourceFlow: String.raw`D:\AWS Glue Jobs\AWS Agentic DE\flow.html`,
    featured: true,
  },
  {
    slug: "duckstream-pipeline",
    title: "DuckStream Pipeline",
    kicker: "Raspberry Pi 5 lakehouse",
    summary:
      "Sensor to queryable table on a Pi 5: MQTT ingest lands parquet, a second process commits exactly-once into DuckLake with three models, SCD2, and a star schema.",
    stack: ["DuckDB", "DuckLake", "MQTT", "Parquet", "Python"],
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
    stack: ["Airflow", "Trino", "Delta Lake", "ClickHouse", "Debezium", "MySQL"],
    flowFile: "data-driven-pipeline.html",
    sourceFlow: String.raw`D:\Abo Akademi\Data-Driven Computing Architecture\Project\flow.html`,
  },
  {
    slug: "email-exporter-consumer",
    title: "Email Exporter Consumer",
    kicker: "Salla · Kafka · ClickHouse",
    summary:
      "Production Kafka consumer that runs ClickHouse exports to S3/MinIO as CSV/XLSX and emails them via Mailgun, with sequential, batch, and queue strategies for different loads.",
    stack: ["Kafka", "ClickHouse", "S3", "Redis", "Mailgun", "Python"],
    flowFile: "email-exporter-consumer.html",
    sourceFlow: String.raw`D:\Salla\email-exporter-consumer-python\flow.html`,
    featured: true,
  },
  {
    slug: "customer-group-evaluator",
    title: "Customer Group Evaluator",
    kicker: "Timeplus · Kafka · ClickHouse",
    summary:
      "Evaluation syncer: Timeplus triggers Kafka events, the consumer builds ClickHouse filters from MySQL group conditions, then fans out assignments to MySQL, OpenSearch, and status topics.",
    stack: ["Kafka", "Timeplus", "ClickHouse", "MySQL", "OpenSearch"],
    flowFile: "customer-group-evaluator.html",
    sourceFlow: String.raw`D:\New Salla\activate-customer-consumer-python\flow.html`,
    featured: true,
  },
  {
    slug: "trino-local",
    title: "Trino on Local",
    kicker: "Federated query lab",
    summary:
      "Single-node Trino 455 on Docker with six catalog files: Hive, Iceberg, Delta, and JDBC to PostgreSQL and ClickHouse, sharing Hive Metastore and MinIO.",
    stack: ["Trino", "Hive Metastore", "MinIO", "Iceberg", "Delta Lake", "ClickHouse"],
    flowFile: "trino-local.html",
    sourceFlow: String.raw`D:\TinoTesting\flow.html`,
  },
  {
    slug: "spark-streaming-acme",
    title: "ACME Spark Streaming",
    kicker: "Debezium · Spark · Kafka",
    summary:
      "Spark Structured Streaming take-home: PostgreSQL CDC through Debezium into Kafka, Spark aggregations, and a visualization stack — started in a strict compose order.",
    stack: ["Spark Structured Streaming", "Debezium", "Kafka", "PostgreSQL"],
    flowFile: "spark-streaming-acme.html",
    sourceFlow: String.raw`D:\Deel\deel-data-engineering-task\flow.html`,
  },
  {
    slug: "triptop",
    title: "TripTop",
    kicker: "Backend · Snowflake schema",
    summary:
      "Student-trip marketplace: Flutter client, Flask /api/v1, and a PostgreSQL snowflake whose grain is one student on one trip. SQL lives in files, not in the handlers.",
    stack: ["Flask", "PostgreSQL", "Snowflake schema", "Flutter", "JWT"],
    flowFile: "triptop.html",
    sourceFlow: String.raw`D:\Abo Akademi\Project_Course\trip_top\flow.html`,
  },
  {
    slug: "pitb-ossp",
    title: "PITB OSSP Data Platform",
    kicker: "On-prem government lakehouse",
    summary:
      "On-prem OSS lakehouse: MySQL holds the Airflow graph, Delta on MinIO is raw/curated, Trino models the star, ClickHouse serves the thin layer across government sectors.",
    stack: ["Airflow", "Trino", "Delta Lake", "ClickHouse", "MinIO", "MySQL"],
    flowFile: "pitb-ossp.html",
    sourceFlow: String.raw`D:\PITB\ossp-data-platform-code\flow.html`,
    featured: true,
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
