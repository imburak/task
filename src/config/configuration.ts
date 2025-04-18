export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'postgres',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    database: process.env.DATABASE_NAME || 'tasks',
  },
  rmq: {
    concurrency: parseInt(process.env.RABBITMQ_CONCURRENCY || '1', 10),
    url: process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672',
  },
});
