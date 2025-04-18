# 📦 Task Processing API

This is a backend application built with **NestJS**, **PostgreSQL**, and **RabbitMQ** that simulates job processing with delay, retry logic, and failure handling. The API allows users to create tasks, which are then processed asynchronously with concurrency support.

### 🛠️ Getting Started

💡 Note: This is a Dockerized project. Make sure you have Docker installed before proceeding.

1. Create `.env` file from `.env.example`.

```bash
cp .env.example .env
```

> ⚙️ You can control how many tasks are processed concurrently using the `RABBITMQ_CONCURRENCY` value in the .env file.

2. Start the services with docker

```bash
docker-compose up
```

### 🧱 Built With

- [NestJS](https://nestjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [RabbitMQ](https://www.rabbitmq.com/)
- [Docker & Docker Compose](https://docs.docker.com/)

### 📬 API Endpoints

| Method | URL               | Description                                          |
| ------ | ----------------- | ---------------------------------------------------- |
| POST   | /v1/tasks         | Create a new task and enqueue it for processing.     |
| GET    | /v1/tasks/stats   | Retrieve task processing statistics.                 |
| GET    | /v1/tasks/results | Fetch all tasks that are either failed or completed. |
