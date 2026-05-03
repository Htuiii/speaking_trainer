# Порядок Реализации

Рекомендуемый порядок следующих шагов:

1. Добавить минимальные Docker Compose-файлы для Postgres, Kafka, MinIO и сети.
2. Добавить init-скрипты для логических БД, Kafka topics и MinIO buckets.
3. Добавить skeleton gateway с `GET /health` и `GET /api/status`.
4. Добавлять сервисы по одному, начиная с `questions-service`.
5. Добавить seed/import tooling, когда источник контента будет финализирован.
6. Добавить `answers-service` с метаданными загрузки в MinIO.
7. Добавить Kafka-событие `answer.uploaded`.
8. Добавить `ai-feedback-service` как stub consumer.

## Текущий Этап

Пункт 2 готовит инфраструктуру для будущих сервисов:

- Postgres DB: `auth_db`, `questions_db`, `answers_db`, `ai_feedback_db`.
- Kafka topics: `answer.uploaded`, `feedback.created`.
- MinIO buckets: `speaking-content-assets`, `speaking-user-answers`.

## Принцип

Двигаемся маленькими шагами: сначала инфраструктурный каркас, потом один минимальный сервис, затем связь между сервисами. Общие helpers и contracts добавляем только когда появляется реальная потребность, а не заранее.
