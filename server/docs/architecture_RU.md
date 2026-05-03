# Архитектура Server

Backend планируется как легкая микросервисная система. На первом этапе намеренно не добавляем тяжелые production-компоненты: Consul, gRPC, KeyDB, Tarantool, Ansible, Kafka Connect и OpenSearch.

## Планируемые Компоненты

- `gateway` - единая публичная HTTP-точка входа для frontend.
- `auth-service` - регистрация, авторизация, JWT, профиль пользователя.
- `questions-service` - темы ЕГЭ speaking, intro и interview questions.
- `answers-service` - попытки ответов, метаданные загруженного аудио, ключи объектов MinIO.
- `ai-feedback-service` - AI-фидбек и оценивание загруженных ответов.
- `postgres` - один локальный контейнер Postgres с отдельными логическими БД под каждый сервис.
- `kafka` - асинхронная шина событий для обработки ответов.
- `minio` - S3-compatible object storage для файлов заданий и ответов пользователей.

## Структура Директорий

```text
server/
  compose/                 # Docker Compose-фрагменты.
    infrastructure.yml     # MinIO и другая инфраструктура.
    messaging.yml          # Kafka.
    databases.yml          # Postgres.
    init.yml               # Одноразовые init-контейнеры.
    init/                  # SQL и будущие init-скрипты.

  gateway/                 # Публичный API gateway.

  services/
    auth-service/          # Пользователи и авторизация.
    questions-service/     # Каталог вопросов.
    answers-service/       # Ответы пользователей и метаданные аудио.
    ai-feedback-service/   # AI-фидбек, оценивание, обработка транскриптов.

  packages/
    common/                # Общие helper'ы, только когда появится реальное дублирование.
    contracts/             # Общие API/event-контракты.

  tools/
    seed/                  # Будущие инструменты импорта данных.
```

## Границы Сервисов

Каждый сервис должен владеть своими данными и не ходить напрямую в БД другого сервиса.

Планируемые базы:

- `auth_db`
- `questions_db`
- `answers_db`
- `ai_feedback_db`

`answers-service` и `ai-feedback-service` не должны использовать одну общую БД. Сервис ответов владеет метаданными загруженных ответов, а сервис AI-фидбека владеет результатами оценивания.

## Хранение Файлов

MinIO используется как файловое хранилище. Postgres хранит только метаданные и object keys.

Планируемые buckets:

- `speaking-content-assets` - файлы заданий: аудио, картинки и будущие материалы разных типов заданий.
- `speaking-user-answers` - аудиоответы пользователей.

Так материалы заданий и приватные ответы пользователей разделены логически и по правам доступа. Это важно для масштабирования: сейчас разбираем interview, но позже у разных заданий могут появиться картинки, аудио, дополнительные условия и другие assets.

## Асинхронный Flow

Kafka планируется только для фоновой обработки, а не для обычных frontend CRUD-запросов.

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
