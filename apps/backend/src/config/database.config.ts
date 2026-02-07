export default () => ({
  mongo: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/mymindos',
    dbName: process.env.MONGO_DB_NAME || 'mymindos',
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    queuePrefix: process.env.QUEUE_PREFIX || 'mymindos',
  },
});
