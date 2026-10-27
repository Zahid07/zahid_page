## What it is

My MSc thesis at Åbo Akademi University: a data platform that records sensors, video, audio and robot state from human-computer interaction lab sessions and puts them on one traceable timeline. It supports live observation, frame-accurate replay and anomaly detection. The screenshot is the prototype researcher console.

It is in the design stage. The core contribution is measured synchronization, reliable recording and recovery, synced replay, and evaluated anomaly detection.

## The rules the design follows

1. **Raw media stays out of the pipeline.** Video and audio live in object storage; only their indexes flow through Kafka and ClickHouse.
2. **Raw records never change.** Every row keeps its original source timestamp and a stable record ID. Aligned time is a separate, versioned clock fit per stream, applied when data is read.
3. **The archive is the published version.** LabRecorder writes an XDF file for every session; after the session it is imported, validated and only then published. Nothing is deleted first.
4. **Access is study-scoped everywhere**: SQL, replay, live media and any agent tools.
5. **Alerts are not safety.** Only an independent safety controller can stop the robot.

## Privacy

Retention and participant withdrawal are designed in from the start, with GDPR-aware wording and explicit grants, and no access to error tables.

## Stack

ClickHouse, Kafka, Lab Streaming Layer with LabRecorder and pyxdf, PyAV for exact frame-to-timestamp mapping, MediaMTX and hls.js for live and replay video, and Apache Superset with per-study users.
