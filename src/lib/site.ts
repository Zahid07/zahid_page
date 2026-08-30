export const site = {
  name: "Muhammad Zahid",
  title: "Data Engineer",
  location: "Turku, Finland",
  email: "zahidmuhammad127@gmail.com",
  phone: "+358 44 959 9940",
  linkedin: "https://linkedin.com/in/zahidmu",
  github: "https://github.com/Zahid07",
  resume: "/Muhammad_Zahid_Data_Engineer.pdf",
  summary:
    "Data engineer with 4 years owning production pipelines end to end — ingestion, transformation, enrichment, validation, and monitoring — for high-volume, real-time systems.",
};

export const experience = [
  {
    role: "Data Engineer",
    company: "Salla",
    dates: "Sep 2025 — Sep 2026",
    place: "Remote, Finland",
    did: "I owned the production analytics path: ERP, transactions, and Kafka events into ClickHouse on EKS — and I kept the consumers from falling behind when traffic spiked.",
    points: [
      "Run end-to-end ELT from ERP, transactional, and event sources into ClickHouse for near-real-time analytics, on AWS EKS with Terraform-managed infra.",
      "Designed Kafka microservices (Python/JavaScript) with Redis, Docker, and KEDA scaling on consumer lag — then unblocked a consumer bottleneck from 25 to 25,000 msg/s.",
      "Forward-compatible ClickHouse schema evolution: new upstream columns land in a structured additionalcolumns JSON field so downstream jobs do not wait on a migration.",
      "Owned ClickHouse as a system: ORDER BY, partitioning, skip indexes, query tuning, and 2-replica HA.",
      "Built a multi-threaded backup/restore to S3 + Iceberg (hive-style partitions, PostgreSQL metadata) with Slack alerts.",
      "Shipped a NetSuite ERP sync on SQS + Lambda + dbt for invoicing data with full reconciliation, and a Rust S3 file-combiner to cut small-file overhead.",
      "Moved orchestration from Airflow to Mage AI, and worked with DevOps on EKS cost using real Kafka backlog as the scaling signal.",
    ],
  },
  {
    role: "Data Engineer",
    company: "Addo AI",
    dates: "Apr 2024 — Sep 2025",
    place: "Remote, Finland",
    did: "I led the lakehouse for a government analytics platform — terabytes a day, ~200 Airflow DAGs — and I was the person the client called when a number was wrong.",
    points: [
      "Architected an on-prem/cloud lakehouse on Azure Databricks, Delta Lake, Trino, and ClickHouse for multi-sector government data.",
      "Migrated a legacy Oracle 19c system to AWS Glue with Redshift as the warehouse.",
      "Built a generic ETL framework that cut deployment time by 60% and processing from 10 hours to 5, covering MySQL, SQL Server, APIs, scraping, and PDFs.",
      "Implemented Kafka + PySpark streaming and dimensional models (facts/dims, SCD Type 2/4) with geographic normalization across sources.",
      "Put an NLP name-normalization model in the production path so Korean names parsed cleanly for entity matching.",
      "Led ClickHouse adoption as the OLAP engine (about 40% query gain) and automated RBAC plus anonymization, cutting that manual work by ~90%.",
      "Primary technical contact with client teams on data correctness, and led three engineers on BI dashboards and Python ingestion (API, GeoJSON, DAGs).",
    ],
  },
  {
    role: "Data Engineer",
    company: "RedCoast Co",
    dates: "Aug 2023 — Mar 2024",
    place: "Ontario, Canada",
    did: "I built client ETL and a SQL builder so business users could mint KPIs without writing SQL.",
    points: [
      "Python + Airflow ETL for multiple clients, plus Spark Structured Streaming for low-latency work, deployed on Azure.",
      "A dynamic SQL builder for custom KPIs, with MLflow for model versioning.",
      "Ingestion and analytics services against PostgreSQL, MongoDB, and other sources.",
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

export const skills = {
  Languages: ["Python", "SQL", "Go", "Rust", "JavaScript", "Bash", "C/C++"],
  Orchestration: [
    "Apache Airflow",
    "Mage AI",
    "Kafka",
    "PySpark",
    "Spark Structured Streaming",
    "Debezium CDC",
    "dbt",
  ],
  Platforms: [
    "ClickHouse",
    "Trino",
    "PostgreSQL",
    "MongoDB",
    "Redis",
    "Delta Lake",
    "Redshift",
    "MySQL",
  ],
  Infra: [
    "Kubernetes",
    "Docker",
    "KEDA",
    "AWS",
    "Azure Databricks",
    "Terraform",
    "GitHub Actions",
  ],
};
