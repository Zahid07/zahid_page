export const site = {
  name: "Muhammad Zahid",
  title: "Data and Platform Engineer",
  location: "Turku, Finland",
  email: "zahidmuhammad127@gmail.com",
  phone: "+358 44 959 9940",
  linkedin: "https://linkedin.com/in/zahidmu",
  github: "https://github.com/Zahid07",
  resume: "/Muhammad_Zahid_Data_Engineer.pdf",
  // Set NEXT_PUBLIC_SITE_URL on the host (e.g. Vercel) so share cards get absolute URLs.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  summary:
    "Data and platform engineer with 4 years owning production data systems end to end, and an MSc Computer Science student at Åbo Akademi. I build pipelines, lakehouses and AI agents, and I ship products of my own.",
};

export const experience = [
  {
    role: "Data and Platform Engineer",
    company: "Salla",
    dates: "Sep 2025 — Present",
    place: "Remote, Finland",
    did: "I owned the production analytics path: ERP, transactions, and Kafka events into ClickHouse on EKS — and I kept the consumers from falling behind when traffic spiked.",
    points: [
      "Run end-to-end ELT from ERP, transactional, and event sources into ClickHouse for near-real-time analytics, on AWS EKS with Terraform-managed infra.",
      "Designed Kafka microservices (Python/JavaScript) with Redis, Docker, and KEDA scaling on consumer lag — then unblocked a consumer bottleneck from 25 to 25,000 msg/s.",
      "Forward-compatible ClickHouse schema evolution: new upstream columns land in a structured additionalcolumns JSON field so downstream jobs do not wait on a migration.",
      "Owned ClickHouse as a system: ORDER BY, partitioning, skip indexes, query tuning, and 2-replica HA.",
      "Built a multi-threaded ClickHouse backup/restore framework to S3 + Iceberg with Slack-based monitoring and alerting.",
      "Shipped a NetSuite ERP sync on SQS + Lambda + dbt for invoicing data with full reconciliation, and a Rust S3 file-combiner to cut small-file overhead.",
      "Moved orchestration from Airflow to Mage AI, and worked with DevOps on EKS cost using real Kafka backlog as the scaling signal.",
    ],
  },
  {
    role: "Data Engineer",
    company: "Addo AI",
    dates: "Aug 2023 — Sep 2025",
    place: "Remote, Pakistan",
    did: "I led the lakehouse for a government analytics platform — terabytes a day, ~200 Airflow DAGs — and I was the person the client called when a number was wrong.",
    points: [
      "Architected an on-prem bare-metal lakehouse on Delta Lake/MinIO, Trino, ClickHouse, and MySQL with Apache Superset for multi-sector government data.",
      "Migrated a legacy Oracle 19c system to AWS Glue with Redshift as the warehouse.",
      "Built ELT pipelines on Azure Databricks for a global consumer-health client, with incremental loads into ADLS Gen2 and Unity Catalog catalogs and schemas.",
      "Implemented a data mesh: domain-owned data products on a shared self-serve platform under federated governance.",
      "Built a generic ETL framework that cut deployment time by 60% and processing from 10 hours to 5, covering MySQL, SQL Server, APIs, scraping, and PDFs.",
      "Implemented Kafka + PySpark streaming and dimensional models (facts/dims, SCD Type 2/4) with geographic normalization across sources.",
      "Put an NLP name-normalization model in the production path so Korean names parsed cleanly for entity matching.",
      "Led ClickHouse adoption as the OLAP engine (about 40% query gain) and automated RBAC plus anonymization, cutting that manual work by ~90%.",
      "Primary technical contact with client teams on data correctness, and led three engineers on BI dashboards and Python ingestion (API, GeoJSON, DAGs).",
    ],
  },
  {
    role: "Software Engineer",
    company: "Bitnine Global",
    dates: "Aug 2022 — Aug 2023",
    place: "Seoul, South Korea",
    did: "I wrote database software — graph features in Apache AGE, and the tool that moved people onto AgensSQL.",
    points: [
      "Open-source work on Apache AGE (PostgreSQL graph extension): inheritance, mathematical functions, string manipulation, plus contributions to PG-Pool II.",
      "Database applications in C/C++ and Python, including desktop/web UI from Figma designs (Tkinter).",
      "Worked across PostgreSQL, Oracle, and AgensSQL, and was the main developer of the AgensSQL Migration Tool.",
    ],
  },
  {
    role: "Cloud Computing Intern",
    company: "Nokia",
    dates: "Aug 2022 — Sep 2022",
    place: "Remote, Pakistan",
    did: "A short internship on telco cloud infrastructure — learning how that stack is actually run.",
    points: [
      "Worked through Telco Cloud Computing infrastructure: how the platform is laid out, not a production ownership role.",
    ],
  },
];

// Mirrors the skills in D:cv_makermaster_cv.yaml (the source of truth). Keep them in sync.
export const skills = {
  Languages: ["Python", "SQL", "TypeScript", "JavaScript", "Bash", "C/C++", "Rust (working)"],
  "Streaming & Orchestration": ["Kafka", "RabbitMQ", "Timeplus", "Spark", "PySpark", "Airflow", "Mage AI", "dbt"],
  "Databases & Warehousing": ["ClickHouse", "PostgreSQL", "Redshift", "DuckDB", "Trino", "Delta Lake", "Iceberg", "MySQL", "Oracle", "Redis"],
  Cloud: ["AWS (S3, Glue, Lambda, SQS, EKS)", "GCP (Cloud Run, Cloud Tasks, Cloud SQL, Vertex AI)", "Azure (Databricks, Unity Catalog, Data Factory, ADLS Gen2)"],
  "Infrastructure & CI/CD": ["Kubernetes", "Docker", "Helm", "KEDA", "Terraform (working)", "GitHub Actions", "GitLab CI/CD", "pytest"],
  "AI & BI": ["LLM tool calling", "AI agents", "LangGraph", "RAG", "pgvector", "Claude Code", "Power BI", "Superset"],
  "Ways of Working": ["Agile (Scrum)", "Code review", "On-call", "Postmortems"],
};
