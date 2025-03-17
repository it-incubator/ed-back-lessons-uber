export const SETTINGS = {
  PORT: process.env.PORT || 5003,
  MONGO_URL:
    process.env.MONGO_URL ||
    'mongodb://root:example@localhost:27017,localhost:27018,localhost:27019/nest?retryWrites=true&loadBalanced=false&replicaSet=rs0&authSource=admin&readPreference=primary',
  MONGO_URL_TEST:
    process.env.MONGO_URL_TEST ||
    'mongodb://root:example@localhost:27017,localhost:27018,localhost:27019/nest?retryWrites=true&loadBalanced=false&replicaSet=rs0&authSource=admin&readPreference=primary',
  DB_NAME: process.env.DB_NAME || 'ed-back-lessons-uber',
};
