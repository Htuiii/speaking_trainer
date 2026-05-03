# Server

Backend workspace for the Speaking Trainer project.

The directory currently contains only a microservice structure scaffold. Runtime code, Docker Compose files, database migrations, and event contracts will be added step by step.

## Documentation

- [Russian overview](README_RU.md)
- [Architecture](docs/architecture_RU.md)
- [Implementation order](docs/implementation_order_RU.md)

## Current State

Only the base folder structure is prepared. Most implementation files are intentionally absent until the corresponding part is built.
The current server directory is intentionally only a **microservice structure scaffold**. Service code, Docker Compose files, database migrations, and Kafka contracts will be added step by step.

## Target Architecture

The backend is planned as a lightweight microservice system. The first stage intentionally avoids heavier production pieces such as Consul, gRPC, KeyDB, Tarantool, Ansible, Kafka Connect, and OpenSearch.

Planned runtime components:

- `gateway` - single public HTTP entrypoint for the frontend.
- `auth-service` - registration, login, JWT, user profile.
- `questions-service` - EGE speaking topics, intros, and interview questions.
- `answers-service` - answer attempts, audio upload metadata, MinIO object keys.
- `ai-feedback-service` - AI-based feedback and scoring for uploaded answers.
- `postgres` - one local Postgres container with separate logical databases per service.
- `kafka` - async event bus for answer processing.
- `minio` - S3-compatible object storage for audio files.

## Directory Layout

```text
server/
  compose/                 # Future Docker Compose fragments.
    infrastructure/        # MinIO and other infrastructure pieces when needed.
    kafka/                 # Kafka local configuration.
    init/                  # One-shot init scripts.

  gateway/                 # Public API gateway.

  services/
    auth-service/          # Users and auth.
    questions-service/     # Question catalog and seed import target.
    answers-service/       # User answers and audio metadata.
    ai-feedback-service/   # AI feedback, scoring, transcript-related processing.

  packages/
    common/                # Shared helpers, only when real duplication appears.
    contracts/             # Shared API/event contracts.

  tools/
    seed/                  # Future data import utilities.

  src/                     # Existing legacy/simple server scaffold.
```

## Service Boundaries

Each service should own its data and avoid direct access to another service database.

Planned databases:

- `auth_db`
- `questions_db`
- `answers_db`
- `ai_feedback_db`

`answers-service` and `ai-feedback-service` should not share one database. The answers service owns uploaded answer metadata; the feedback service owns AI evaluation results.

## Async Flow

Kafka is planned only for background processing, not for ordinary frontend CRUD requests.

Expected event flow:

```text
frontend
  -> gateway
  -> answers-service
  -> MinIO audio upload
  -> Kafka: answer.uploaded
  -> ai-feedback-service
  -> Kafka: feedback.created
```

HTTP remains the public request/response API. Kafka is for slow or retryable work such as transcription, scoring, and AI feedback generation.

## Implementation Order

Recommended next steps:

1. Add minimal Docker Compose files for Postgres, Kafka, MinIO, and the network.
2. Add init scripts for logical databases, Kafka topics, and MinIO bucket.
3. Add the gateway skeleton with `GET /health` and `GET /api/status`.
4. Add one service at a time, starting with `questions-service`.
5. Add seed/import tooling when the content source is finalized.
6. Add `answers-service` with MinIO upload metadata.
7. Add Kafka `answer.uploaded`.
8. Add `ai-feedback-service` as a stub consumer.

## Current State

Only the folder structure is prepared. Most files are intentionally absent until the corresponding part is implemented.
