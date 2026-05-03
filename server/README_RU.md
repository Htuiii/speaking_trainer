# Server

Backend workspace для проекта Speaking Trainer.

Сейчас директория содержит только каркас микросервисной структуры. Код сервисов, Docker Compose, миграции БД и event-контракты будут добавляться постепенно.

## Документация

- [Архитектура](docs/architecture_RU.md)
- [Порядок реализации](docs/implementation_order_RU.md)

## Текущее состояние

Подготовлена только базовая структура папок. Большинство implementation-файлов намеренно отсутствует до момента реализации соответствующей части.
Текущая директория `server` пока является только **каркасом микросервисной структуры**. Код сервисов, Docker Compose, миграции БД и Kafka-контракты будут добавляться постепенно.

## Целевая Архитектура

Backend планируется как легкая микросервисная система. На первом этапе намеренно не добавляем тяжелые production-компоненты: Consul, gRPC, KeyDB, Tarantool, Ansible, Kafka Connect и OpenSearch.

Планируемые runtime-компоненты:

- `gateway` - единая публичная HTTP-точка входа для frontend.
- `auth-service` - регистрация, авторизация, JWT, профиль пользователя.
- `questions-service` - темы ЕГЭ speaking, intro и interview questions.
- `answers-service` - попытки ответов, метаданные загруженного аудио, ключи объектов MinIO.
- `ai-feedback-service` - AI-фидбек и оценивание загруженных ответов.
- `postgres` - один локальный контейнер Postgres с отдельными логическими БД под каждый сервис.
- `kafka` - асинхронная шина событий для обработки ответов.
- `minio` - S3-compatible object storage для аудиофайлов.

## Структура Директорий

```text
server/
  compose/                 # Будущие Docker Compose-фрагменты.
    infrastructure/        # MinIO и другая инфраструктура, когда понадобится.
    kafka/                 # Локальная конфигурация Kafka.
    init/                  # Одноразовые init-скрипты.

  gateway/                 # Публичный API gateway.

  services/
    auth-service/          # Пользователи и авторизация.
    questions-service/     # Каталог вопросов и цель для seed-импорта.
    answers-service/       # Ответы пользователей и метаданные аудио.
    ai-feedback-service/   # AI-фидбек, оценивание, обработка транскриптов.

  packages/
    common/                # Общие helper'ы, только когда появится реальное дублирование.
    contracts/             # Общие API/event-контракты.

  tools/
    seed/                  # Будущие инструменты импорта данных.

  src/                     # Существующий legacy/simple server scaffold.
```

## Границы Сервисов

Каждый сервис должен владеть своими данными и не ходить напрямую в БД другого сервиса.

Планируемые базы:

- `auth_db`
- `questions_db`
- `answers_db`
- `ai_feedback_db`

`answers-service` и `ai-feedback-service` не должны использовать одну общую БД. Сервис ответов владеет метаданными загруженных ответов, а сервис AI-фидбека владеет результатами оценивания.

## Асинхронный Flow

Kafka планируется только для фоновой обработки, а не для обычных frontend CRUD-запросов.

Ожидаемый поток событий:

```text
frontend
  -> gateway
  -> answers-service
  -> MinIO audio upload
  -> Kafka: answer.uploaded
  -> ai-feedback-service
  -> Kafka: feedback.created
```

HTTP остается публичным request/response API. Kafka нужна для медленной или повторяемой фоновой работы: транскрибации, оценивания и генерации AI-фидбека.

## Порядок Реализации

Рекомендуемый порядок следующих шагов:

1. Добавить минимальные Docker Compose-файлы для Postgres, Kafka, MinIO и сети.
2. Добавить init-скрипты для логических БД, Kafka topics и MinIO bucket.
3. Добавить skeleton gateway с `GET /health` и `GET /api/status`.
4. Добавлять сервисы по одному, начиная с `questions-service`.
5. Добавить seed/import tooling, когда источник контента будет финализирован.
6. Добавить `answers-service` с метаданными загрузки в MinIO.
7. Добавить Kafka-событие `answer.uploaded`.
8. Добавить `ai-feedback-service` как stub consumer.

## Текущее Состояние

Подготовлена только структура папок. Большинство файлов намеренно отсутствует до момента реализации соответствующей части.
