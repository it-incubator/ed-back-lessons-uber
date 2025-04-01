export const SETTINGS = {
  PORT: process.env.PORT || 5003,
  MONGO_URL:
    process.env.MONGO_URL || 'mongodb://localhost:27017/ed-back-lessons-uber',
  DB_NAME: process.env.DB_NAME || 'ed-back-lessons-uber',
};
